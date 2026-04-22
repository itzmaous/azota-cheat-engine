/* ═══════════════════════════════════════════════
   AZOTA HACK v3.0 — logic.js
   ═══════════════════════════════════════════════ */

window.AZH = window.AZH || {};

/* ── Utilities ─────────────────────────────────── */
AZH.util = {
  sleep: ms => new Promise(r => setTimeout(r, ms)),

  async wait(ms, flagRef) {
    const step = 50;
    for (let i = 0; i < ms / step; i++) {
      if (flagRef && flagRef.stop) return;
      await AZH.util.sleep(step);
    }
  },

  getText(el) {
    return (el?.innerText || el?.textContent || '').trim();
  },

  // Normalize: bỏ dấu, lowercase, trim
  normalize(str) {
    return str.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
  },

  // So sánh mờ (fuzzy) hai chuỗi
  fuzzyMatch(a, b) {
    const na = AZH.util.normalize(a);
    const nb = AZH.util.normalize(b);
    return na === nb || na.includes(nb) || nb.includes(na);
  },

  // Set value vào React/Angular controlled input
  setValue(el, value) {
    if (!el) return;
    try {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, value);
    } catch (_) { el.value = value; }
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  },

  // Delay ngẫu nhiên trong [base ± range]
  randomDelay(base, range) {
    return base + Math.floor((Math.random() * 2 - 1) * range);
  },

  // Lưu/load localStorage an toàn
  store: {
    set(k, v) { try { localStorage.setItem('azh_' + k, JSON.stringify(v)); } catch (_) {} },
    get(k, def = null) { try { const r = localStorage.getItem('azh_' + k); return r ? JSON.parse(r) : def; } catch (_) { return def; } },
    del(k) { try { localStorage.removeItem('azh_' + k); } catch (_) {} }
  },

  tsTime() {
    return new Date().toLocaleTimeString('vi', { hour12: false });
  }
};

/* ── Answer key parser ─────────────────────────── */
AZH.parser = {
  // Parse JSON string
  fromJSON(raw) {
    const obj = JSON.parse(raw);
    if (typeof obj !== 'object' || Array.isArray(obj)) throw new Error('Not an object');
    return obj;
  },

  // Parse TXT: "key=value" hoặc "key:value" mỗi dòng
  fromTXT(raw) {
    const result = {};
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('//') || t.startsWith('#')) continue;
      const sep = t.indexOf('=') !== -1 ? '=' : t.indexOf('\t') !== -1 ? '\t' : ':';
      const idx = t.indexOf(sep);
      if (idx <= 0) continue;
      const k = t.slice(0, idx).trim();
      const v = t.slice(idx + 1).trim();
      if (k && v) result[k] = v;
    }
    return result;
  },

  // Auto-detect format và parse
  parse(raw) {
    raw = raw.trim();
    if (!raw) return {};
    try { return AZH.parser.fromJSON(raw); } catch (_) {}
    return AZH.parser.fromTXT(raw);
  }
};

/* ── DOM Detector ──────────────────────────────── */
AZH.detector = {
  // Lấy text câu hỏi từ một box
  getQuestionText(box) {
    // Thử nhiều selector theo thứ tự ưu tiên
    const selectors = [
      '.question-standalone-main-content azt-dynamic-hook span',
      '.question-standalone-main-content azt-dynamic-hook',
      '.question-standalone-content-box azt-dynamic-hook span',
      '.question-standalone-content-box azt-dynamic-hook',
    ];
    for (const sel of selectors) {
      const el = box.querySelector(sel);
      const t = AZH.util.getText(el);
      if (t && t.length > 2) return t;
    }
    return '';
  },

  // Lấy tất cả option của một câu hỏi
  getOptions(box) {
    // Câu trắc nghiệm: .item-answer
    const items = box.querySelectorAll('.item-answer');
    if (items.length) {
      return Array.from(items).map(item => ({
        el: item,
        letter: AZH.util.getText(item.querySelector('button.btn')).replace(/\s/g, ''),
        text: AZH.util.getText(item.querySelector('.answer-content azt-dynamic-hook') || item.querySelector('.answer-content')),
        type: 'choice',
        click: () => item.click()
      }));
    }
    return [];
  },

  // Detect loại câu hỏi
  getQuestionType(box) {
    if (box.querySelector('.item-answer')) return 'choice';
    if (box.querySelector('input[type=text], textarea')) return 'fill';
    if (box.querySelector('.drag-item, [cdkdrag]')) return 'drag';
    if (box.querySelector('.true-false, [class*="true"], [class*="false"]')) return 'truefalse';
    return 'unknown';
  },

  // Tìm input tên/lớp theo label
  findInputByLabel(keyword) {
    for (const el of document.querySelectorAll('.input-group-text, label, .form-label')) {
      if (AZH.util.normalize(AZH.util.getText(el)).includes(AZH.util.normalize(keyword))) {
        const parent = el.closest('.input-group, .form-group, .field-wrapper');
        if (parent) return parent.querySelector('input, textarea');
        // Fallback: next sibling input
        let sib = el.nextElementSibling;
        while (sib) { if (sib.tagName === 'INPUT') return sib; sib = sib.nextElementSibling; }
      }
    }
    return null;
  },

  // Auto-detect đáp án từ DOM (đọc câu đã chọn hoặc đánh dấu)
  autoDetectAnswers() {
    const detected = {};
    const boxes = document.querySelectorAll('.question-standalone-box');
    for (const box of boxes) {
      const qText = AZH.detector.getQuestionText(box);
      if (!qText) continue;

      // Tìm option đang được selected
      const selected = box.querySelector(
        '.item-answer .btn.selected-answer, ' +
        '.item-answer.selected, ' +
        '.item-answer .border-selected-answer'
      );
      if (selected) {
        const item = selected.closest('.item-answer');
        if (item) {
          const ansText = AZH.util.getText(item.querySelector('.answer-content azt-dynamic-hook') || item.querySelector('.answer-content'));
          if (ansText) detected[qText.slice(0, 80)] = ansText;
        }
      }
    }
    return detected;
  }
};

/* ── Answer Engine ─────────────────────────────── */
AZH.engine = {
  // Tìm đáp án đúng từ answerKey cho một câu hỏi
  findAnswer(qText, answerKey) {
    if (!qText || !answerKey) return null;
    // Pass 1: exact keyword match
    for (const [k, v] of Object.entries(answerKey)) {
      if (AZH.util.normalize(qText).includes(AZH.util.normalize(k)) ||
          AZH.util.normalize(k).includes(AZH.util.normalize(qText))) {
        return v;
      }
    }
    // Pass 2: fuzzy – tìm key có nhiều từ trùng nhất
    let bestScore = 0, bestVal = null;
    const qWords = new Set(AZH.util.normalize(qText).split(' ').filter(w => w.length > 3));
    for (const [k, v] of Object.entries(answerKey)) {
      const kWords = AZH.util.normalize(k).split(' ').filter(w => w.length > 3);
      const match = kWords.filter(w => qWords.has(w)).length;
      const score = match / Math.max(kWords.length, 1);
      if (score > 0.6 && score > bestScore) { bestScore = score; bestVal = v; }
    }
    return bestVal;
  },

  // Xử lý câu trắc nghiệm
  async handleChoice(box, correct, flagRef, delay) {
    const opts = AZH.detector.getOptions(box);
    const correctN = AZH.util.normalize(correct);
    for (const opt of opts) {
      if (flagRef && flagRef.stop) return false;
      const textN = AZH.util.normalize(opt.text);
      const letN  = opt.letter.toLowerCase();
      if (textN === correctN || textN.includes(correctN) || correctN.includes(textN) ||
          letN === correctN || letN === correct.toLowerCase().trim()) {
        opt.click();
        await AZH.util.sleep(delay);
        return true;
      }
    }
    return false;
  },

  // Xử lý câu điền vào ô
  async handleFill(box, correct, flagRef, delay) {
    const inputs = box.querySelectorAll('input[type=text], textarea');
    if (!inputs.length) return false;
    for (const inp of inputs) {
      if (flagRef && flagRef.stop) return false;
      AZH.util.setValue(inp, correct);
      await AZH.util.sleep(delay);
    }
    return true;
  },

  // Xử lý Đúng/Sai
  async handleTrueFalse(box, correct, flagRef, delay) {
    const correctN = AZH.util.normalize(correct);
    const btns = box.querySelectorAll('button, .option');
    for (const btn of btns) {
      const t = AZH.util.normalize(AZH.util.getText(btn));
      if (t === correctN || t.includes(correctN)) {
        btn.click();
        await AZH.util.sleep(delay);
        return true;
      }
    }
    return false;
  },

  // Dispatch chọn đáp án theo type
  async answerBox(box, answerKey, flagRef, delay) {
    const qText = AZH.detector.getQuestionText(box);
    if (!qText) return null;

    const correct = AZH.engine.findAnswer(qText, answerKey);
    if (!correct) return { q: qText, a: null, matched: false };

    const type = AZH.detector.getQuestionType(box);
    let success = false;

    if (type === 'choice')    success = await AZH.engine.handleChoice(box, correct, flagRef, delay);
    else if (type === 'fill') success = await AZH.engine.handleFill(box, correct, flagRef, delay);
    else if (type === 'truefalse') success = await AZH.engine.handleTrueFalse(box, correct, flagRef, delay);
    else {
      // fallback: thử click bất kỳ element nào có text khớp
      const all = box.querySelectorAll('.item-answer, button, .option');
      for (const el of all) {
        if (AZH.util.fuzzyMatch(AZH.util.getText(el), correct)) {
          el.click(); success = true; break;
        }
      }
    }

    return { q: qText, a: correct, matched: success, type };
  },

  // Chạy toàn bộ câu hỏi trong trang
  async answerAll(answerKey, flagRef, getDelay) {
    const boxes = document.querySelectorAll('.question-standalone-box');
    const results = [];
    let count = 0;

    for (const box of boxes) {
      if (flagRef && flagRef.stop) break;
      const d = getDelay ? getDelay() : 120;
      const res = await AZH.engine.answerBox(box, answerKey, flagRef, d);
      if (!res) continue;
      results.push(res);
      if (res.matched) count++;
    }

    return { count, total: boxes.length, results };
  }
};

/* ── Stats ─────────────────────────────────────── */
AZH.stats = {
  sessions: 0,
  answered: 0,
  runs: [],

  reset() {
    AZH.stats.sessions = 0;
    AZH.stats.answered = 0;
    AZH.stats.runs = [];
  },

  addRun(count, total) {
    AZH.stats.sessions++;
    AZH.stats.answered = count;
    AZH.stats.runs.push({ session: AZH.stats.sessions, count, total, time: new Date().toLocaleTimeString('vi') });
    AZH.util.store.set('stats', { sessions: AZH.stats.sessions, runs: AZH.stats.runs });
  },

  load() {
    const s = AZH.util.store.get('stats');
    if (s) { AZH.stats.sessions = s.sessions || 0; AZH.stats.runs = s.runs || []; }
  }
};

/* ── Report builder ────────────────────────────── */
AZH.report = {
  data: [],  // [{no, q, a, matched}]

  clear() { AZH.report.data = []; },

  build(results) {
    AZH.report.data = results.map((r, i) => ({
      no: i + 1,
      q: r.q || '—',
      a: r.a || '—',
      matched: r.matched,
      type: r.type || '?'
    }));
  },

  toCSV() {
    const header = 'STT,Câu hỏi,Đáp án,Chọn được,Loại\n';
    const rows = AZH.report.data.map(r =>
      `${r.no},"${r.q.replace(/"/g,'""')}","${r.a.replace(/"/g,'""')}",${r.matched?'Có':'Không'},${r.type}`
    ).join('\n');
    return header + rows;
  },

  toText() {
    return AZH.report.data.map(r =>
      `[${r.no}] ${r.q}\n    → ${r.a} (${r.matched ? '✓' : '✗'})`
    ).join('\n\n');
  },

  download(format = 'csv') {
    const content = format === 'csv' ? AZH.report.toCSV() : AZH.report.toText();
    const mime = format === 'csv' ? 'text/csv' : 'text/plain';
    const ext = format === 'csv' ? 'csv' : 'txt';
    const blob = new Blob(['\uFEFF' + content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `azota_report_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};
