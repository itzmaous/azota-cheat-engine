/* ═══════════════════════════════════════════════
   AZOTA HACK v3.0 — main.js
   Paste toàn bộ nội dung file này vào Console
   (sau khi đã paste logic.js)
   ═══════════════════════════════════════════════ */

(function () {
  /* ── Inject CSS ────────────────────────────────
     Bỏ style nội tuyến này nếu đã load style.css bằng <link>
     ────────────────────────────────────────────── */
  const CSS = `/* PASTE NỘI DUNG style.css VÀO ĐÂY NẾU DÙNG 1 FILE */`;

  if (CSS.trim() && !CSS.startsWith('/*')) {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // Tránh khởi tạo 2 lần
  if (document.getElementById('azhPanel')) {
    document.getElementById('azhPanel').style.display = 'block';
    document.getElementById('azhShowBtn').style.display = 'none';
    return;
  }

  /* ── Panel HTML ────────────────────────────────── */
  const panel = document.createElement('div');
  panel.id = 'azhPanel';
  panel.innerHTML = `
    <div class="azh-header" id="azhDragHandle">
      <span class="azh-title">⚡ Azota Hack</span>
      <span class="azh-badge">v3.0</span>
    </div>

    <!-- TABS -->
    <div class="azh-tabs">
      <button class="azh-tab active" data-tab="main">🏠 Main</button>
      <button class="azh-tab" data-tab="answers">📋 Đáp án</button>
      <button class="azh-tab" data-tab="settings">⚙ Cài đặt</button>
      <button class="azh-tab" data-tab="stats">📊 Stats</button>
    </div>

    <!-- TAB: MAIN -->
    <div class="azh-pane active" id="tab-main">
      <div class="azh-label">Thông tin thí sinh</div>
      <input class="azh-input" id="inpName"  placeholder="Họ và tên (để trống = tự detect)">
      <input class="azh-input" id="inpClass" placeholder="Lớp (để trống = tự detect)">

      <hr class="azh-divider">

      <div class="azh-label">Trạng thái đáp án</div>
      <div id="azhKeyStatus" style="font-size:11px;color:#546e7a;margin-bottom:6px;">
        Chưa có đáp án — vào tab <b style="color:#64b5f6">Đáp án</b> để import
      </div>

      <div class="azh-toggle-row">
        <span class="azh-toggle-label">🔁 Auto-Farm</span>
        <label class="azh-switch"><input type="checkbox" id="autoFarmToggle"><span class="azh-slider"></span></label>
      </div>
      <div class="azh-toggle-row">
        <span class="azh-toggle-label">🎲 Random delay</span>
        <label class="azh-switch"><input type="checkbox" id="randDelayToggle" checked><span class="azh-slider"></span></label>
      </div>

      <div class="azh-action-row">
        <button class="azh-btn azh-btn-primary" id="btnAzhRun">▶ Run <small style="opacity:.7">(F2)</small></button>
        <button class="azh-btn azh-btn-danger"  id="btnAzhStop">■ Stop <small style="opacity:.7">(F3)</small></button>
        <button class="azh-btn-close" id="btnAzhHide" title="Ẩn panel (F4)">✕</button>
      </div>

      <div id="azhLog"><span class="log-dim">[SYS] Azota Hack v3.0 ready. F2=Run F3=Stop F4=Hide</span></div>
    </div>

    <!-- TAB: ĐÁP ÁN -->
    <div class="azh-pane" id="tab-answers">
      <div class="azh-label">Nhập / Import đáp án</div>
      <textarea class="azh-input" id="azhAnswerText"
        placeholder='JSON:  {"keyword câu hỏi": "đáp án", ...}
TXT (mỗi dòng): câu hỏi = đáp án
          hoặc: câu hỏi : đáp án'></textarea>

      <div class="azh-row">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnParseText" style="flex:1">✅ Parse text</button>
        <label class="azh-file-label azh-btn-sm" style="flex:1">
          📂 Upload file
          <input type="file" id="azhFileInput" accept=".json,.txt,.csv">
        </label>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnAutoDetect" style="flex:1" title="Đọc đáp án đã chọn từ DOM">🔍 Auto detect</button>
      </div>

      <div id="azhImportStatus"></div>
      <div id="azhAnswerPreview"></div>

      <div class="azh-row" style="margin-top:6px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCopyAnswers" style="flex:1;display:none">📋 Copy đáp án</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnSaveLocal" style="flex:1;display:none">💾 Lưu local</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnClearAns" style="flex:1">🗑 Xóa</button>
      </div>

      <div class="azh-row" style="margin-top:4px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnLoadLocal" style="flex:1">📥 Load từ local</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnExportReport" style="flex:1">📤 Xuất báo cáo</button>
      </div>
    </div>

    <!-- TAB: CÀI ĐẶT -->
    <div class="azh-pane" id="tab-settings">
      <div class="azh-label">Tốc độ (delay cơ bản)</div>
      <div class="azh-speed-row">
        <label>⚡ Base</label>
        <input type="range" id="azhSpeed" min="100" max="3000" step="100" value="600">
        <span id="azhSpeedVal">600ms</span>
      </div>
      <div class="azh-speed-row">
        <label>🎲 ±Rand</label>
        <input type="range" id="azhRand" min="0" max="1000" step="50" value="200">
        <span id="azhRandVal">±200ms</span>
      </div>

      <hr class="azh-divider">
      <div class="azh-label">Hành vi</div>
      <div class="azh-toggle-row">
        <span class="azh-toggle-label">📝 Tự động nộp bài</span>
        <label class="azh-switch"><input type="checkbox" id="autoSubmitToggle" checked><span class="azh-slider"></span></label>
      </div>
      <div class="azh-toggle-row">
        <span class="azh-toggle-label">🔔 Thông báo khi xong</span>
        <label class="azh-switch"><input type="checkbox" id="notifyToggle" checked><span class="azh-slider"></span></label>
      </div>

      <hr class="azh-divider">
      <div class="azh-label">Phím tắt</div>
      <div class="azh-shortcut-grid">
        <div class="azh-shortcut-item"><span class="azh-key">F2</span> Run</div>
        <div class="azh-shortcut-item"><span class="azh-key">F3</span> Stop</div>
        <div class="azh-shortcut-item"><span class="azh-key">F4</span> Ẩn/Hiện</div>
        <div class="azh-shortcut-item"><span class="azh-key">F5</span> Auto-detect</div>
        <div class="azh-shortcut-item"><span class="azh-key">F6</span> Xuất CSV</div>
        <div class="azh-shortcut-item"><span class="azh-key">Esc</span> Stop farm</div>
      </div>
    </div>

    <!-- TAB: STATS -->
    <div class="azh-pane" id="tab-stats">
      <div class="azh-label">Phiên này</div>
      <div class="azh-stat-grid">
        <div class="azh-stat-card"><span class="azh-stat-val" id="statSessions">0</span><div class="azh-stat-label">Lần chạy</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statAnswered">0</span><div class="azh-stat-label">Đã chọn</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statKeyCount">0</span><div class="azh-stat-label">Đáp án có</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statRate">—</span><div class="azh-stat-label">Tỉ lệ khớp</div></div>
      </div>

      <div class="azh-label" style="margin-top:10px">Lịch sử chạy</div>
      <div id="azhRunHistory" style="font-size:11px;color:#546e7a;max-height:100px;overflow-y:auto;">
        Chưa có lần chạy nào.
      </div>
      <button class="azh-btn azh-btn-ghost azh-btn-sm azh-btn-full" id="btnResetStats" style="margin-top:8px">🗑 Reset stats</button>
    </div>
  `;
  document.body.appendChild(panel);

  /* ── Report Modal ──────────────────────────────── */
  const modal = document.createElement('div');
  modal.id = 'azhReportModal';
  modal.innerHTML = `
    <div class="azh-modal-box">
      <div class="azh-modal-title">
        <span>📤 Báo cáo đáp án</span>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCloseReport">✕ Đóng</button>
      </div>
      <div class="azh-row" style="margin-bottom:8px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnDlCSV">⬇ CSV</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnDlTXT">⬇ TXT</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCopyReport">📋 Copy</button>
      </div>
      <table class="azh-report-table">
        <thead><tr><th>#</th><th>Câu hỏi</th><th>Đáp án</th><th>✓</th></tr></thead>
        <tbody id="azhReportBody"></tbody>
      </table>
    </div>
  `;
  document.body.appendChild(modal);

  /* ── Show button ────────────────────────────────── */
  const showBtn = document.createElement('button');
  showBtn.id = 'azhShowBtn';
  showBtn.innerText = '⚡ Azota';
  document.body.appendChild(showBtn);

  /* ── Drag ───────────────────────────────────────── */
  (function () {
    let ox = 0, oy = 0, drag = false;
    const h = document.getElementById('azhDragHandle');
    h.addEventListener('mousedown', e => {
      drag = true;
      ox = e.clientX - panel.getBoundingClientRect().left;
      oy = e.clientY - panel.getBoundingClientRect().top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      panel.style.left = (e.clientX - ox) + 'px';
      panel.style.top  = (e.clientY - oy) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    });
    document.addEventListener('mouseup', () => drag = false);
  })();

  /* ── Tabs ───────────────────────────────────────── */
  document.querySelectorAll('.azh-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.azh-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.azh-pane').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  /* ── Log ────────────────────────────────────────── */
  const logBox = document.getElementById('azhLog');
  const log = (msg, type = 'inf') => {
    const d = document.createElement('div');
    d.className = 'log-' + type;
    d.textContent = `[${AZH.util.tsTime()}] ${msg}`;
    logBox.appendChild(d);
    logBox.scrollTop = logBox.scrollHeight;
    // Giới hạn 200 dòng
    while (logBox.children.length > 200) logBox.removeChild(logBox.firstChild);
  };

  /* ── Speed ──────────────────────────────────────── */
  const speedEl = document.getElementById('azhSpeed');
  const speedValEl = document.getElementById('azhSpeedVal');
  const randEl = document.getElementById('azhRand');
  const randValEl = document.getElementById('azhRandVal');
  speedEl.addEventListener('input', () => speedValEl.textContent = speedEl.value + 'ms');
  randEl.addEventListener('input',  () => randValEl.textContent  = '±' + randEl.value + 'ms');

  const getDelay = () => {
    const base = parseInt(speedEl.value);
    const useRand = document.getElementById('randDelayToggle').checked;
    const range = parseInt(randEl.value);
    return useRand ? AZH.util.randomDelay(base, range) : base;
  };

  /* ── Answer key state ───────────────────────────── */
  let answerKey = {};

  function setImportStatus(msg, ok = true) {
    const el = document.getElementById('azhImportStatus');
    el.style.color = ok ? 'var(--azh-green)' : 'var(--azh-red)';
    el.textContent = msg;
  }

  function updateKeyStatus() {
    const n = Object.keys(answerKey).length;
    const el = document.getElementById('azhKeyStatus');
    const kEl = document.getElementById('statKeyCount');
    if (kEl) kEl.textContent = n;
    if (n === 0) {
      el.innerHTML = 'Chưa có đáp án — vào tab <b style="color:#64b5f6">Đáp án</b> để import';
      el.style.color = 'var(--azh-dim)';
    } else {
      el.innerHTML = `<span style="color:var(--azh-green)">✅ ${n} câu đáp án đã load</span>`;
    }
  }

  function renderPreview() {
    const preview = document.getElementById('azhAnswerPreview');
    const copyBtn = document.getElementById('btnCopyAnswers');
    const saveBtn = document.getElementById('btnSaveLocal');
    const entries = Object.entries(answerKey);

    if (!entries.length) {
      preview.style.display = 'none';
      if (copyBtn) copyBtn.style.display = 'none';
      if (saveBtn) saveBtn.style.display = 'none';
      return;
    }
    preview.style.display = 'block';
    if (copyBtn) copyBtn.style.display = '';
    if (saveBtn) saveBtn.style.display = '';

    preview.innerHTML = entries.map(([q, a]) =>
      `<div class="ans-item">
        <span class="ans-q" title="${q}">${q.length > 50 ? q.slice(0, 50) + '…' : q}</span>
        <span class="ans-a">${a}</span>
       </div>`
    ).join('');

    updateKeyStatus();
  }

  function loadAnswerKey(raw) {
     try {
       const parsed = AZH.parser.parse(raw);
       const n = Object.keys(parsed).length;
       if (n === 0) {
         setImportStatus('❌ Không tìm thấy câu nào – kiểm tra format', false);
         return;
       }
   
       answerKey = parsed;
   
       // ⭐ FIX QUAN TRỌNG
       window._azhAnswerKey = answerKey;
   
       setImportStatus(`✅ OK — ${n} câu`);
       renderPreview();
       log(`Import: ${n} câu đáp án`, 'ok');
     } catch (e) {

  /* ── Answer tab events ──────────────────────────── */
  document.getElementById('btnParseText').onclick = () => {
    loadAnswerKey(document.getElementById('azhAnswerText').value);
  };

  document.getElementById('azhFileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('azhAnswerText').value = ev.target.result;
      loadAnswerKey(ev.target.result);
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  });

  document.getElementById('btnAutoDetect').onclick = () => {
    const detected = AZH.detector.autoDetectAnswers();
    const n = Object.keys(detected).length;
    if (n === 0) { log('Không detect được đáp án nào từ DOM', 'warn'); return; }
    Object.assign(answerKey, detected);
    window._azhAnswerKey = answerKey;
    const raw = JSON.stringify(answerKey, null, 2);
    document.getElementById('azhAnswerText').value = raw;
    setImportStatus(`🔍 Detect được ${n} câu từ DOM`);
    renderPreview();
    log(`Auto-detect: ${n} câu`, 'ok');
  };

  document.getElementById('btnClearAns').onclick = () => {
    answerKey = {};
    document.getElementById('azhAnswerText').value = '';
    document.getElementById('azhAnswerPreview').style.display = 'none';
    document.getElementById('btnCopyAnswers').style.display = 'none';
    document.getElementById('btnSaveLocal').style.display = 'none';
    setImportStatus('');
    updateKeyStatus();
    log('Đã xóa đáp án', 'dim');
  };

  document.getElementById('btnCopyAnswers').onclick = () => {
    const text = Object.entries(answerKey).map(([q, a]) => `${q} = ${a}`).join('\n');
    navigator.clipboard.writeText(text)
      .then(() => log('Đã copy đáp án!', 'ok'))
      .catch(() => log('Copy thất bại', 'err'));
  };

  document.getElementById('btnSaveLocal').onclick = () => {
    AZH.util.store.set('answerKey', answerKey);
    log('Đã lưu đáp án vào localStorage', 'ok');
    setImportStatus('💾 Đã lưu local');
  };

  document.getElementById('btnLoadLocal').onclick = () => {
    const saved = AZH.util.store.get('answerKey');
    if (!saved || !Object.keys(saved).length) {
      log('Không có đáp án nào trong localStorage', 'warn');
      return;
    }
    answerKey = saved;
    document.getElementById('azhAnswerText').value = JSON.stringify(saved, null, 2);
    setImportStatus(`📥 Loaded ${Object.keys(saved).length} câu từ local`);
    renderPreview();
    log(`Load local: ${Object.keys(saved).length} câu`, 'ok');
  };

  document.getElementById('btnExportReport').onclick = () => openReport();

  /* ── Report modal ───────────────────────────────── */
  function openReport() {
    const tbody = document.getElementById('azhReportBody');
    if (!AZH.report.data.length) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:var(--azh-dim);text-align:center;padding:10px">Chưa có dữ liệu – chạy hack trước.</td></tr>';
    } else {
      tbody.innerHTML = AZH.report.data.map(r =>
        `<tr>
          <td class="cell-num">${r.no}</td>
          <td title="${r.q}">${r.q.length > 45 ? r.q.slice(0, 45) + '…' : r.q}</td>
          <td class="cell-ans">${r.a}</td>
          <td style="text-align:center;color:${r.matched ? 'var(--azh-green)' : 'var(--azh-red)'}">${r.matched ? '✓' : '✗'}</td>
        </tr>`
      ).join('');
    }
    modal.classList.add('open');
  }

  document.getElementById('btnCloseReport').onclick = () => modal.classList.remove('open');
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  document.getElementById('btnDlCSV').onclick = () => AZH.report.download('csv');
  document.getElementById('btnDlTXT').onclick = () => AZH.report.download('txt');
  document.getElementById('btnCopyReport').onclick = () => {
    navigator.clipboard.writeText(AZH.report.toText())
      .then(() => log('Đã copy report!', 'ok'))
      .catch(() => {});
  };

  /* ── Stats ──────────────────────────────────────── */
  AZH.stats.load();

  function updateStatsUI(count, total) {
    const rate = total > 0 ? Math.round(count / total * 100) + '%' : '—';
    document.getElementById('statSessions').textContent = AZH.stats.sessions;
    document.getElementById('statAnswered').textContent  = count;
    document.getElementById('statRate').textContent     = rate;

    const hist = document.getElementById('azhRunHistory');
    hist.innerHTML = AZH.stats.runs.slice(-10).reverse().map(r =>
      `<div style="padding:2px 0;border-bottom:1px solid var(--azh-border2);color:var(--azh-text2)">
        [${r.time}] Lần ${r.session}: ${r.count}/${r.total} câu
       </div>`
    ).join('') || '<div style="color:var(--azh-dim)">Chưa có lần chạy nào.</div>';
  }

  document.getElementById('btnResetStats').onclick = () => {
    AZH.stats.reset();
    AZH.util.store.del('stats');
    updateStatsUI(0, 0);
    log('Đã reset stats', 'dim');
  };

  /* ── Main flow ──────────────────────────────────── */
  (function reattach() {
  const flagRef = { stop: false };
  let autoFarmEnabled = false;
  let isSubmitted = false;

  const getDelay = () => {
    const base = parseInt(document.getElementById('azhSpeed').value);
    const useRand = document.getElementById('randDelayToggle').checked;
    const range = parseInt(document.getElementById('azhRand').value);
    return useRand ? AZH.util.randomDelay(base, range) : base;
  };

  async function runAuto() {
    flagRef.stop = false;
    isSubmitted = false;
    const log = (msg, type='inf') => {
      const logBox = document.getElementById('azhLog');
      const d = document.createElement('div');
      d.className = 'log-' + type;
      d.textContent = '[' + new Date().toLocaleTimeString('vi',{hour12:false}) + '] ' + msg;
      logBox.appendChild(d);
      logBox.scrollTop = logBox.scrollHeight;
    };

    log('══ Bắt đầu ══', 'ok');

    // Bắt đầu thi
    let startBtn = Array.from(document.querySelectorAll('button'))
      .find(b => AZH.util.getText(b).includes('Bắt đầu thi'));
    if (startBtn && !flagRef.stop) {
      startBtn.click(); log("Click 'Bắt đầu thi'", 'ok');
      await AZH.util.wait(getDelay(), flagRef);
       // ⭐ CHỜ LOAD CÂU HỎI
      for (let i = 0; i < 25; i++) {
        if (document.querySelector('.question-standalone-box')) break;
        await AZH.util.sleep(200);
      }
    } else {
      const back = Array.from(document.querySelectorAll('button'))
        .find(b => AZH.util.getText(b).includes('Quay lại'));
      if (back) { back.click(); await AZH.util.wait(500, flagRef); }
      startBtn = Array.from(document.querySelectorAll('button'))
        .find(b => AZH.util.getText(b).includes('Bắt đầu thi'));
      if (startBtn && !flagRef.stop) { startBtn.click(); log("Click 'Bắt đầu thi'", 'ok'); await AZH.util.wait(getDelay(), flagRef); }
    }
    if (flagRef.stop) return log('Dừng.', 'err');

    // Điền tên/lớp
    const nameInput  = AZH.detector.findInputByLabel('họ và tên') || AZH.detector.findInputByLabel('tên');
    const classInput = AZH.detector.findInputByLabel('lớp');
    const uName  = document.getElementById('inpName').value.trim()  || 'Student_' + (Math.random()*9000+1000|0);
    const uClass = document.getElementById('inpClass').value.trim() || '8T3';
    if (nameInput && classInput) { AZH.util.setValue(nameInput, uName); AZH.util.setValue(classInput, uClass); log('Điền: '+uName+' | '+uClass,'ok'); }
    else if (nameInput) { AZH.util.setValue(nameInput, uName); log('Điền tên: '+uName,'ok'); }
    else if (classInput) { AZH.util.setValue(classInput, uClass); log('Điền lớp: '+uClass,'ok'); }

    if (nameInput || classInput) {
      const cf = Array.from(document.querySelectorAll('button')).find(b => AZH.util.getText(b).includes('Xác nhận'));
      if (cf && !flagRef.stop) { cf.click(); log("Click 'Xác nhận'",'ok'); }
      await AZH.util.wait(getDelay(), flagRef);
    }
    if (flagRef.stop) return log('Dừng.','err');

    // Trả lời
    const answerKey = window._azhAnswerKey || {};
    if (!Object.keys(answerKey).length) { log('⚠ Chưa có đáp án!','warn'); }
    else {
      const { count, total, results } = await AZH.engine.answerAll(answerKey, flagRef, getDelay);
      log('Đã chọn '+count+'/'+total+' câu', count>0?'ok':'warn');
      AZH.report.build(results);
      AZH.stats.addRun(count, total);
      document.getElementById('statSessions').textContent = AZH.stats.sessions;
      document.getElementById('statAnswered').textContent = count;
      document.getElementById('statRate').textContent = total>0 ? Math.round(count/total*100)+'%' : '—';
    }
    if (flagRef.stop) return log('Dừng trước nộp.','err');

    // Nộp bài
    if (document.getElementById('autoSubmitToggle').checked && !isSubmitted && Object.keys(window._azhAnswerKey||{}).length) {
      const sm = Array.from(document.querySelectorAll('button'))
        .find(b => AZH.util.getText(b)==='Nộp bài' && !b.closest('.mat-mdc-dialog-surface'));
      if (sm && !flagRef.stop) { sm.click(); isSubmitted=true; log("Click 'Nộp bài'",'ok'); await AZH.util.wait(700, flagRef); }
      const sd = Array.from(document.querySelectorAll('.mat-mdc-dialog-surface button'))
        .find(b => AZH.util.getText(b)==='Nộp bài');
      if (sd && !flagRef.stop) { sd.click(); log('Xác nhận nộp ✓','ok'); }
    }

    autoFarmEnabled = document.getElementById('autoFarmToggle').checked;
    if (autoFarmEnabled && !flagRef.stop) {
      log('Auto-Farm: restart sau 2.5s…','inf');
      await AZH.util.wait(2500, flagRef);
      if (!flagRef.stop) runAuto();
    } else {
      log('══ Hoàn thành ══','ok');
    }
  }

  document.getElementById('btnAzhRun').onclick = runAuto;
  document.getElementById('btnAzhStop').onclick = () => {
    flagRef.stop = true;
    document.getElementById('autoFarmToggle').checked = false;
    const logBox = document.getElementById('azhLog');
    const d = document.createElement('div');
    d.className = 'log-err';
    d.textContent = '['+new Date().toLocaleTimeString('vi',{hour12:false})+'] Đã dừng.';
    logBox.appendChild(d);
  };

  // Keyboard shortcuts
  document.onkeydown = e => {
    if (['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (e.key==='F2') { e.preventDefault(); runAuto(); }
    if (e.key==='F3') { e.preventDefault(); document.getElementById('btnAzhStop').click(); }
    if (e.key==='F4') { e.preventDefault(); const p=document.getElementById('azhPanel'); p.style.display=p.style.display==='none'?'block':'none'; }
    if (e.key==='Escape') { flagRef.stop=true; }
  };

  console.log('✅ Events re-attached. Bấm Run hoặc F2 để chạy.');

  // Expose answerKey — sync từ window.AZH nếu có
  // Mày cần paste answerKey vào đây hoặc dùng import trong panel
  window._reattachRunAuto = runAuto;
})();
  /* ── Button events ──────────────────────────────── */
  document.getElementById('btnAzhStop').onclick = () => {
    flagRef.stop = true;
    autoFarmEnabled = false;
    document.getElementById('autoFarmToggle').checked = false;
    log('Đã dừng.', 'err');
  };

  document.getElementById('autoFarmToggle').onchange = e => {
    autoFarmEnabled = e.target.checked;
    if (autoFarmEnabled) flagRef.stop = false;
    log(autoFarmEnabled ? 'Auto-Farm BẬT' : 'Auto-Farm TẮT', autoFarmEnabled ? 'ok' : 'dim');
  };

  document.getElementById('btnAzhHide').onclick = () => {
    panel.style.display = 'none';
    showBtn.style.display = 'block';
  };
  showBtn.onclick = () => {
    panel.style.display = 'block';
    showBtn.style.display = 'none';
  };

  /* ── Keyboard shortcuts ─────────────────────────── */
  document.addEventListener('keydown', e => {
    // Bỏ qua khi đang focus input/textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'F2') { e.preventDefault(); runAuto(); }
    if (e.key === 'F3') { e.preventDefault(); document.getElementById('btnAzhStop').click(); }
    if (e.key === 'F4') {
      e.preventDefault();
      if (panel.style.display === 'none') { panel.style.display = 'block'; showBtn.style.display = 'none'; }
      else { panel.style.display = 'none'; showBtn.style.display = 'block'; }
    }
    if (e.key === 'F5') { e.preventDefault(); document.getElementById('btnAutoDetect').click(); }
    if (e.key === 'F6') { e.preventDefault(); AZH.report.download('csv'); }
    if (e.key === 'Escape') { flagRef.stop = true; autoFarmEnabled = false; log('ESC — dừng farm.', 'err'); }
  });

  /* ── Init ───────────────────────────────────────── */
  updateKeyStatus();
  updateStatsUI(0, 0);
  log('Sẵn sàng. Phím tắt: F2=Run F3=Stop F4=Ẩn F5=Auto-detect F6=CSV', 'inf');

})();
