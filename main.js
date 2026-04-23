/* ═══════════════════════════════════════════════
   AZOTA HACK v1 — By Lucifer Maous
   ═══════════════════════════════════════════════ */
(function () {
  if (document.getElementById('azhPanel')) {
    document.getElementById('azhPanel').style.display = 'block';
    document.getElementById('azhShowBtn') && (document.getElementById('azhShowBtn').style.display = 'none');
    return;
  }

  /* ══════════════ CSS ══════════════ */
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --azh-bg: rgba(8,10,22,0.97); --azh-bg2: rgba(14,18,36,0.97);
      --azh-border: #1565c0; --azh-border2: #1e3a5f;
      --azh-accent: #42a5f5; --azh-accent2: #64b5f6;
      --azh-text: #b3e5ff; --azh-text2: #90caf9;
      --azh-green: #81c784; --azh-red: #ef5350;
      --azh-yellow: #ffd54f; --azh-dim: #546e7a;
      --azh-input-bg: rgba(6,12,28,0.85);
    }

    @keyframes azhFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes azhPulse  { 0%,100%{box-shadow:0 0 16px rgba(66,165,245,.4)} 50%{box-shadow:0 0 32px rgba(66,165,245,.9),0 0 60px rgba(66,165,245,.3)} }
    @keyframes azhSpin   { to{transform:rotate(360deg)} }
    @keyframes azhShake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
    @keyframes azhSlideIn{ from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
    @keyframes azhBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
    @keyframes azhGlow   { 0%,100%{text-shadow:0 0 6px var(--azh-accent)} 50%{text-shadow:0 0 18px var(--azh-accent),0 0 32px var(--azh-accent2)} }
    @keyframes azhProgress { from{width:0%} to{width:100%} }
    @keyframes azhStatusPop { 0%{transform:scale(.9);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }

    #azhPanel {
      position:fixed; bottom:24px; right:24px; width:340px; max-height:92vh;
      overflow-y:auto; background:linear-gradient(160deg,var(--azh-bg),var(--azh-bg2));
      color:var(--azh-text); font-family:'Segoe UI',system-ui,monospace; font-size:13px;
      padding:14px; border:1px solid var(--azh-border); border-radius:16px;
      z-index:9999999;
      box-shadow:0 0 24px rgba(30,136,229,0.25),0 12px 40px rgba(0,0,0,0.6);
      backdrop-filter:blur(14px); scrollbar-width:thin; scrollbar-color:var(--azh-border) transparent;
      box-sizing:border-box;
      animation: azhFadeIn .35s ease;
    }
    #azhPanel *{box-sizing:border-box;}
    #azhPanel::-webkit-scrollbar{width:4px;}
    #azhPanel::-webkit-scrollbar-thumb{background:var(--azh-border);border-radius:4px;}
    #azhPanel.running { animation: azhPulse 2s ease-in-out infinite; }
    #azhPanel.shake   { animation: azhShake .4s ease; }

    /* Header */
    .azh-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;cursor:move;padding-bottom:10px;border-bottom:1px solid var(--azh-border2);user-select:none;}
    .azh-title{font-size:15px;font-weight:700;color:var(--azh-accent2);letter-spacing:1px;animation:azhGlow 3s ease-in-out infinite;}
    .azh-badge{font-size:10px;padding:2px 8px;border-radius:20px;background:linear-gradient(90deg,#0d47a1,var(--azh-accent));color:#fff;letter-spacing:1px;font-weight:600;}

    /* Status bar */
    #azhStatusBar {
      display:flex;align-items:center;gap:8px;padding:8px 10px;
      border-radius:8px;margin-bottom:10px;font-size:12px;font-weight:600;
      border:1px solid var(--azh-border2);background:var(--azh-input-bg);
      transition:all .3s ease; animation:azhStatusPop .3s ease;
    }
    #azhStatusBar .status-icon{font-size:16px;transition:transform .3s;}
    #azhStatusBar.idle    {border-color:var(--azh-border2);color:var(--azh-dim);}
    #azhStatusBar.waiting {border-color:var(--azh-yellow);color:var(--azh-yellow);background:rgba(255,213,79,.05);}
    #azhStatusBar.running {border-color:var(--azh-accent);color:var(--azh-accent2);background:rgba(66,165,245,.08);}
    #azhStatusBar.done    {border-color:var(--azh-green);color:var(--azh-green);background:rgba(129,199,132,.08);}
    #azhStatusBar.error   {border-color:var(--azh-red);color:var(--azh-red);background:rgba(239,83,80,.08);}
    .status-icon.spin{animation:azhSpin 1s linear infinite;}
    .status-icon.bounce{animation:azhBounce 1s ease-in-out infinite;}
    #azhProgressWrap{height:3px;background:var(--azh-border2);border-radius:2px;overflow:hidden;margin-bottom:10px;display:none;}
    #azhProgressBar{height:100%;background:linear-gradient(90deg,#0d47a1,var(--azh-accent),#00e5ff);border-radius:2px;transition:width .3s ease;}
    #azhProgressWrap.active{display:block;}
    .azh-tabs{display:flex;gap:4px;margin-bottom:10px;}
    .azh-tab{flex:1;padding:5px 2px;border:1px solid var(--azh-border2);border-radius:6px;background:transparent;color:var(--azh-dim);font-size:11px;font-weight:600;cursor:pointer;transition:all .2s;text-align:center;}
    .azh-tab:hover{border-color:var(--azh-accent);color:var(--azh-accent2);transform:translateY(-1px);}
    .azh-tab.active{background:linear-gradient(135deg,#0d47a1,var(--azh-accent));border-color:var(--azh-accent);color:#fff;box-shadow:0 0 8px rgba(66,165,245,.4);}
    .azh-pane{display:none;animation:azhFadeIn .2s ease;} .azh-pane.active{display:block;}
    .azh-label{font-size:10px;color:var(--azh-accent);text-transform:uppercase;letter-spacing:1.8px;margin:10px 0 5px;font-weight:600;}
    .azh-input{width:100%;padding:6px 9px;background:var(--azh-input-bg);color:var(--azh-text);border:1px solid var(--azh-border);border-radius:6px;outline:none;font-size:12px;margin-bottom:6px;transition:border-color .2s,box-shadow .2s;font-family:inherit;}
    .azh-input:focus{border-color:var(--azh-accent2);box-shadow:0 0 0 2px rgba(66,165,245,.15);}
    .azh-input::placeholder{color:var(--azh-dim);}
    textarea.azh-input{height:80px;resize:vertical;font-family:monospace;font-size:11px;color:#a5d6a7;line-height:1.5;}
    .azh-row{display:flex;gap:6px;margin-bottom:6px;align-items:center;}
    .azh-row .azh-input{margin-bottom:0;}
    .azh-btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:7px 10px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit;position:relative;overflow:hidden;}
    .azh-btn::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,0);transition:background .15s;}
    .azh-btn:hover::after{background:rgba(255,255,255,.07);}
    .azh-btn:active{transform:scale(.96);}
    .azh-btn-primary{background:linear-gradient(135deg,#0d47a1,var(--azh-accent));color:#fff;box-shadow:0 2px 12px rgba(66,165,245,.35);}
    .azh-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(66,165,245,.5);}
    .azh-btn-primary.has-answers{animation:azhPulse 2.5s ease-in-out infinite;}
    .azh-btn-danger{background:linear-gradient(135deg,#b71c1c,var(--azh-red));color:#fff;box-shadow:0 2px 10px rgba(239,83,80,.3);}
    .azh-btn-danger:hover{transform:translateY(-1px);}
    .azh-btn-ghost{background:rgba(21,101,192,.12);color:var(--azh-accent2);border:1px solid var(--azh-border);transition:all .2s;}
    .azh-btn-ghost:hover{background:rgba(21,101,192,.3);border-color:var(--azh-accent2);}
    .azh-btn-sm{padding:4px 8px;font-size:11px;border-radius:6px;}
    .azh-btn-full{width:100%;margin-bottom:5px;}
    .azh-file-label{display:inline-flex;align-items:center;justify-content:center;padding:4px 8px;border:1px solid var(--azh-border);border-radius:6px;background:rgba(21,101,192,.12);color:var(--azh-accent2);font-size:11px;font-weight:700;cursor:pointer;transition:all .2s;}
    .azh-file-label:hover{background:rgba(21,101,192,.3);}
    .azh-file-label input{display:none;}
    .azh-toggle-row{display:flex;align-items:center;justify-content:space-between;margin:7px 0;}
    .azh-toggle-label{font-size:12px;color:var(--azh-text2);}
    .azh-switch{position:relative;display:inline-block;width:44px;height:22px;}
    .azh-switch input{display:none;}
    .azh-slider{position:absolute;cursor:pointer;inset:0;background:#263238;border-radius:22px;transition:.3s;}
    .azh-slider::before{content:"";position:absolute;width:16px;height:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;box-shadow:0 1px 4px rgba(0,0,0,.4);}
    .azh-switch input:checked+.azh-slider{background:var(--azh-accent);}
    .azh-switch input:checked+.azh-slider::before{transform:translateX(22px);}
    .azh-speed-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
    .azh-speed-row label{font-size:11px;color:var(--azh-text2);white-space:nowrap;}
    .azh-speed-row input[type=range]{flex:1;accent-color:var(--azh-accent);cursor:pointer;}
    #azhSpeedVal,#azhRandVal{font-size:11px;color:var(--azh-accent2);min-width:44px;text-align:right;}
    #azhImportStatus{font-size:11px;margin-top:4px;min-height:15px;transition:all .3s;}
    #azhAnswerPreview{background:var(--azh-input-bg);border:1px solid var(--azh-border2);border-radius:6px;padding:5px 7px;font-size:11px;max-height:90px;overflow-y:auto;margin-top:5px;display:none;}
    .ans-item{display:flex;justify-content:space-between;align-items:center;padding:2px 0;border-bottom:1px solid var(--azh-border2);gap:6px;animation:azhSlideIn .2s ease;}
    .ans-item:last-child{border-bottom:none;}
    .ans-q{color:var(--azh-text2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;}
    .ans-a{color:var(--azh-green);font-weight:700;white-space:nowrap;}
    #azhKeyStatus{font-size:12px;padding:8px 10px;border-radius:8px;background:var(--azh-input-bg);border:1px solid var(--azh-border2);margin-bottom:8px;transition:all .4s ease;animation:azhStatusPop .3s ease;}
    .azh-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;}
    .azh-stat-card{background:var(--azh-input-bg);border:1px solid var(--azh-border2);border-radius:8px;padding:8px;text-align:center;transition:all .3s;}
    .azh-stat-card:hover{border-color:var(--azh-accent);transform:translateY(-2px);}
    .azh-stat-val{font-size:20px;font-weight:700;color:var(--azh-accent2);display:block;line-height:1.2;transition:all .3s;}
    .azh-stat-label{font-size:10px;color:var(--azh-dim);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
    .azh-shortcut-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:6px;}
    .azh-shortcut-item{display:flex;align-items:center;gap:6px;background:var(--azh-input-bg);border:1px solid var(--azh-border2);border-radius:6px;padding:5px 7px;font-size:11px;transition:all .2s;}
    .azh-shortcut-item:hover{border-color:var(--azh-accent);transform:translateX(2px);}
    .azh-key{background:linear-gradient(135deg,#1a237e,#0d47a1);color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:700;border-bottom:2px solid #000;}
    #azhLog{background:var(--azh-input-bg);padding:6px 8px;font-size:11px;height:120px;overflow-y:auto;border:1px solid var(--azh-border2);border-radius:8px;margin-top:8px;line-height:1.6;font-family:'Courier New',monospace;}
    #azhLog::-webkit-scrollbar{width:3px;}
    #azhLog::-webkit-scrollbar-thumb{background:var(--azh-border);border-radius:2px;}
    .log-ok  {color:var(--azh-green); animation:azhSlideIn .15s ease;}
    .log-err {color:var(--azh-red);   animation:azhSlideIn .15s ease;}
    .log-inf {color:var(--azh-accent2);animation:azhSlideIn .15s ease;}
    .log-warn{color:var(--azh-yellow);animation:azhSlideIn .15s ease;}
    .log-dim {color:var(--azh-dim);   animation:azhSlideIn .15s ease;}
    .log-wait{color:#ce93d8;          animation:azhSlideIn .15s ease;}
    .azh-action-row{display:flex;gap:5px;margin-top:8px;}
    .azh-action-row .azh-btn{flex:1;padding:9px 4px;}
    .azh-btn-close{flex:0 0 36px!important;background:rgba(30,40,60,.8);color:var(--azh-accent2);border:1px solid var(--azh-border);border-radius:8px;font-size:14px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;}
    .azh-btn-close:hover{background:rgba(21,101,192,.3);transform:rotate(90deg);}
    .azh-divider{border:none;border-top:1px solid var(--azh-border2);margin:10px 0;}
    #azhShowBtn{position:fixed;bottom:24px;right:24px;background:rgba(8,10,22,.9);color:var(--azh-accent);border:1px solid var(--azh-border);border-radius:10px;padding:8px 14px;cursor:pointer;font-family:'Segoe UI',monospace;font-size:13px;font-weight:700;z-index:9999999;opacity:.4;transition:all .25s;display:none;}
    #azhShowBtn:hover{opacity:1;box-shadow:0 0 14px rgba(66,165,245,.5);transform:scale(1.05);}
    #azhReportModal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999999;align-items:center;justify-content:center;}
    #azhReportModal.open{display:flex;animation:azhFadeIn .2s ease;}
    .azh-modal-box{background:linear-gradient(160deg,var(--azh-bg),var(--azh-bg2));border:1px solid var(--azh-border);border-radius:16px;padding:18px;width:480px;max-width:95vw;max-height:80vh;overflow-y:auto;box-shadow:0 0 40px rgba(30,136,229,.4);}
    .azh-modal-title{font-size:14px;font-weight:700;color:var(--azh-accent2);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;}
    .azh-report-table{width:100%;border-collapse:collapse;font-size:12px;}
    .azh-report-table th{background:rgba(21,101,192,.2);color:var(--azh-accent2);padding:5px 8px;text-align:left;border-bottom:1px solid var(--azh-border);font-size:11px;}
    .azh-report-table td{padding:5px 8px;border-bottom:1px solid var(--azh-border2);color:var(--azh-text);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .azh-report-table tr:last-child td{border-bottom:none;}
    .cell-ans{color:var(--azh-green)!important;font-weight:700;}
    .cell-num{color:var(--azh-dim)!important;text-align:center;}
  `;
  document.head.appendChild(style);

  /* ══════════════ HTML ══════════════ */
  const panel = document.createElement('div');
  panel.id = 'azhPanel';
  panel.innerHTML = `
    <div class="azh-header" id="azhDragHandle">
      <span class="azh-title">⚡ Azota Cheat By Maous</span>
      <span class="azh-badge">v1.0</span>
    </div>

    <div id="azhStatusBar" class="idle">
      <span class="status-icon" id="azhStatusIcon">💤</span>
      <span id="azhStatusText">Sẵn sàng</span>
    </div>
    <div id="azhProgressWrap"><div id="azhProgressBar" style="width:0%"></div></div>

    <div class="azh-tabs">
      <button class="azh-tab active" data-tab="main">🏠 Main</button>
      <button class="azh-tab" data-tab="answers">📋 Đáp án</button>
      <button class="azh-tab" data-tab="settings">⚙️ Cài đặt</button>
      <button class="azh-tab" data-tab="stats">📊 Stats</button>
    </div>

    <!-- MAIN -->
    <div class="azh-pane active" id="tab-main">
      <div class="azh-label">👤 Thông tin thí sinh</div>
      <input class="azh-input" id="inpName"  placeholder="Họ và tên (để trống = tự detect)">
      <input class="azh-input" id="inpClass" placeholder="Lớp (để trống = tự detect)">
      <hr class="azh-divider">
      <div id="azhKeyStatus" style="color:var(--azh-dim)">
        ⚠️ Chưa có đáp án — vào tab <b style="color:var(--azh-accent2)">📋 Đáp án</b> để import trước
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
        <button class="azh-btn azh-btn-primary" id="btnAzhRun">▶️ Run <small style="opacity:.65">(F2)</small></button>
        <button class="azh-btn azh-btn-danger"  id="btnAzhStop">⏹️ Stop <small style="opacity:.65">(F3)</small></button>
        <button class="azh-btn-close" id="btnAzhHide" title="Ẩn (F4)">✕</button>
      </div>
      <div id="azhLog"><span class="log-dim">[SYS] v3.3 — Import đáp án → Run!</span></div>
    </div>

    <!-- ĐÁP ÁN -->
    <div class="azh-pane" id="tab-answers">
      <div class="azh-label">📥 Nhập / Import đáp án</div>
      <textarea class="azh-input" id="azhAnswerText"
        placeholder='JSON: {"keyword câu hỏi":"đáp án",...}&#10;TXT: câu hỏi = đáp án (mỗi dòng 1 câu)'></textarea>
      <div class="azh-row">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnParseText" style="flex:1">✅ Parse</button>
        <label class="azh-file-label azh-btn-sm" style="flex:1">📂 Upload<input type="file" id="azhFileInput" accept=".json,.txt,.csv"></label>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnAutoDetect" style="flex:1">🔍 Auto</button>
      </div>
      <div id="azhImportStatus"></div>
      <div id="azhAnswerPreview"></div>
      <div class="azh-row" style="margin-top:6px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCopyAnswers" style="flex:1;display:none">📋 Copy</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnSaveLocal"   style="flex:1;display:none">💾 Lưu</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnClearAns"    style="flex:1">🗑️ Xóa</button>
      </div>
      <div class="azh-row" style="margin-top:4px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnLoadLocal"    style="flex:1">📥 Load local</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnExportReport" style="flex:1">📤 Báo cáo</button>
      </div>
    </div>

    <!-- CÀI ĐẶT -->
    <div class="azh-pane" id="tab-settings">
      <div class="azh-label">⚡ Tốc độ</div>
      <div class="azh-speed-row">
        <label>Base</label>
        <input type="range" id="azhSpeed" min="100" max="3000" step="100" value="500">
        <span id="azhSpeedVal">500ms</span>
      </div>
      <div class="azh-speed-row">
        <label>±Rand</label>
        <input type="range" id="azhRand" min="0" max="800" step="50" value="150">
        <span id="azhRandVal">±150ms</span>
      </div>
      <hr class="azh-divider">
      <div class="azh-label">🎛️ Hành vi</div>
      <div class="azh-toggle-row">
        <span class="azh-toggle-label">📝 Tự động nộp bài</span>
        <label class="azh-switch"><input type="checkbox" id="autoSubmitToggle" checked><span class="azh-slider"></span></label>
      </div>
      <div class="azh-toggle-row">
        <span class="azh-toggle-label">🔔 Thông báo khi xong</span>
        <label class="azh-switch"><input type="checkbox" id="notifyToggle"><span class="azh-slider"></span></label>
      </div>
      <hr class="azh-divider">
      <div class="azh-label">⌨️ Phím tắt</div>
      <div class="azh-shortcut-grid">
        <div class="azh-shortcut-item"><span class="azh-key">F2</span> Run</div>
        <div class="azh-shortcut-item"><span class="azh-key">F3</span> Stop</div>
        <div class="azh-shortcut-item"><span class="azh-key">F4</span> Ẩn/Hiện</div>
        <div class="azh-shortcut-item"><span class="azh-key">F5</span> Auto-detect</div>
        <div class="azh-shortcut-item"><span class="azh-key">F6</span> Xuất CSV</div>
        <div class="azh-shortcut-item"><span class="azh-key">Esc</span> Dừng farm</div>
      </div>
    </div>

    <!-- STATS -->
    <div class="azh-pane" id="tab-stats">
      <div class="azh-label">📈 Phiên này</div>
      <div class="azh-stat-grid">
        <div class="azh-stat-card"><span class="azh-stat-val" id="statSessions">0</span><div class="azh-stat-label">Lần chạy</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statAnswered">0</span><div class="azh-stat-label">Đã chọn</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statKeyCount">0</span><div class="azh-stat-label">Đáp án có</div></div>
        <div class="azh-stat-card"><span class="azh-stat-val" id="statRate">—</span><div class="azh-stat-label">Tỉ lệ khớp</div></div>
      </div>
      <div class="azh-label" style="margin-top:10px">📜 Lịch sử</div>
      <div id="azhRunHistory" style="font-size:11px;color:var(--azh-dim);max-height:100px;overflow-y:auto;">Chưa có lần chạy nào.</div>
      <button class="azh-btn azh-btn-ghost azh-btn-sm azh-btn-full" id="btnResetStats" style="margin-top:8px">🗑️ Reset</button>
    </div>
  `;
  document.body.appendChild(panel);

  const modal = document.createElement('div');
  modal.id = 'azhReportModal';
  modal.innerHTML = `
    <div class="azh-modal-box">
      <div class="azh-modal-title">
        <span>📊 Báo cáo đáp án</span>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCloseReport">✕</button>
      </div>
      <div class="azh-row" style="margin-bottom:8px">
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnDlCSV">⬇️ CSV</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnDlTXT">⬇️ TXT</button>
        <button class="azh-btn azh-btn-ghost azh-btn-sm" id="btnCopyReport">📋 Copy</button>
      </div>
      <table class="azh-report-table">
        <thead><tr><th>#</th><th>Câu hỏi</th><th>Đáp án</th><th>✓</th></tr></thead>
        <tbody id="azhReportBody"></tbody>
      </table>
    </div>
  `;
  document.body.appendChild(modal);

  const showBtn = document.createElement('button');
  showBtn.id = 'azhShowBtn'; showBtn.innerText = '⚡ Azota';
  document.body.appendChild(showBtn);

  /* ══ DRAG ══ */
  (function(){
    let ox=0,oy=0,drag=false;
    const h=document.getElementById('azhDragHandle');
    h.addEventListener('mousedown',e=>{drag=true;ox=e.clientX-panel.getBoundingClientRect().left;oy=e.clientY-panel.getBoundingClientRect().top;e.preventDefault();});
    document.addEventListener('mousemove',e=>{if(!drag)return;panel.style.left=(e.clientX-ox)+'px';panel.style.top=(e.clientY-oy)+'px';panel.style.right='auto';panel.style.bottom='auto';});
    document.addEventListener('mouseup',()=>drag=false);
  })();

  /* ══ TABS ══ */
  panel.querySelectorAll('.azh-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      panel.querySelectorAll('.azh-tab').forEach(t=>t.classList.remove('active'));
      panel.querySelectorAll('.azh-pane').forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      panel.querySelector('#tab-'+tab.dataset.tab).classList.add('active');
    });
  });

  /* ══ STATUS BAR ══ */
  function setStatus(type, icon, text, spin=false) {
    const bar=document.getElementById('azhStatusBar');
    const ic=document.getElementById('azhStatusIcon');
    const tx=document.getElementById('azhStatusText');
    bar.className=type;
    ic.textContent=icon;
    ic.className='status-icon'+(spin?' spin':'');
    tx.textContent=text;
  }

  function setProgress(pct) {
    const wrap=document.getElementById('azhProgressWrap');
    const bar=document.getElementById('azhProgressBar');
    if(pct===null){wrap.classList.remove('active');bar.style.width='0%';return;}
    wrap.classList.add('active');
    bar.style.width=Math.min(100,Math.max(0,pct))+'%';
  }

  /* ══ LOG ══ */
  const logBox=document.getElementById('azhLog');
  function log(msg,type='inf'){
    const d=document.createElement('div'); d.className='log-'+type;
    d.textContent='['+new Date().toLocaleTimeString('vi',{hour12:false})+'] '+msg;
    logBox.appendChild(d); logBox.scrollTop=logBox.scrollHeight;
    while(logBox.children.length>300)logBox.removeChild(logBox.firstChild);
  }

  /* ══ SPEED ══ */
  const speedEl=document.getElementById('azhSpeed'),speedValEl=document.getElementById('azhSpeedVal');
  const randEl=document.getElementById('azhRand'),randValEl=document.getElementById('azhRandVal');
  speedEl.addEventListener('input',()=>speedValEl.textContent=speedEl.value+'ms');
  randEl.addEventListener('input',()=>randValEl.textContent='±'+randEl.value+'ms');
  function getDelay(){
    const base=parseInt(speedEl.value),range=parseInt(randEl.value);
    return document.getElementById('randDelayToggle').checked
      ?Math.max(60,base+Math.floor((Math.random()*2-1)*range)):base;
  }

  /* ══ UTILS ══ */
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function wait(ms,flag){for(let i=0;i<ms/50;i++){if(flag&&flag.stop)return;await sleep(50);}}

  // waitFor: chờ cho đến khi selector xuất hiện, timeout ms
  async function waitFor(selectorFn, timeoutMs=15000, intervalMs=200, flag=null){
    const start=Date.now();
    while(Date.now()-start<timeoutMs){
      if(flag&&flag.stop)return null;
      const el=selectorFn();
      if(el)return el;
      await sleep(intervalMs);
    }
    return null;
  }

  function getText(el){return(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();}
  function norm(s){
    return s.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim();
  }
  function wordOverlap(a,b){
    const wa=new Set(norm(a).split(' ').filter(w=>w.length>2));
    const wb=norm(b).split(' ').filter(w=>w.length>2);
    if(!wa.size||!wb.length)return 0;
    return wb.filter(w=>wa.has(w)).length/Math.max(wa.size,wb.length);
  }
  function setValue(el,val){
    if(!el)return;
    try{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(el,val);}catch(_){el.value=val;}
    ['input','change'].forEach(ev=>el.dispatchEvent(new Event(ev,{bubbles:true})));
  }
  function findInputByLabel(kw){
    for(const d of document.querySelectorAll('.input-group-text,label,.form-label')){
      if(norm(getText(d)).includes(norm(kw))){
        const p=d.closest('.input-group,.form-group,.field-wrapper');
        if(p)return p.querySelector('input,textarea');
        let s=d.nextElementSibling;while(s){if(s.tagName==='INPUT')return s;s=s.nextElementSibling;}
      }
    }
    return null;
  }
  function tryClick(el){
    if(!el)return false;
    try{
      el.click();
      ['mousedown','mouseup','click'].forEach(ev=>
        el.dispatchEvent(new MouseEvent(ev,{bubbles:true,cancelable:true,view:window}))
      );
      return true;
    }catch(_){return false;}
  }
  function safeStore(k,v){try{localStorage.setItem('azh_'+k,JSON.stringify(v));}catch(_){}}
  function safeLoad(k,def=null){try{const r=localStorage.getItem('azh_'+k);return r?JSON.parse(r):def;}catch(_){return def;}}

  /* ══ ANSWER KEY ══ */
  let answerKey={};
  let reportData=[];
  let stats=safeLoad('stats',{sessions:0,runs:[]});

  function parseRaw(raw){
    raw=raw.trim();if(!raw)return{};
    try{const o=JSON.parse(raw);if(typeof o==='object'&&!Array.isArray(o))return o;}catch(_){}
    const res={};
    for(const line of raw.split('\n')){
      const t=line.trim();if(!t||t.startsWith('//')||t.startsWith('#'))continue;
      let sep=-1;
      if(t.includes('='))sep=t.indexOf('=');
      else if(t.includes('\t'))sep=t.indexOf('\t');
      else if(t.indexOf(':')>0)sep=t.indexOf(':');
      if(sep<=0)continue;
      const k=t.slice(0,sep).trim(),v=t.slice(sep+1).trim();
      if(k&&v)res[k]=v;
    }
    return res;
  }

  function loadAnswerKey(raw){
    const parsed=parseRaw(raw);
    const n=Object.keys(parsed).length;
    if(!n){setImportStatus('❌ Không parse được – kiểm tra format',false);return;}
    answerKey=parsed;
    setImportStatus('✅ OK — '+n+' câu đã load');
    renderPreview();
    log('✅ Import xong: '+n+' câu đáp án','ok');
    // Quay về tab main
    panel.querySelectorAll('.azh-tab').forEach(t=>t.classList.remove('active'));
    panel.querySelectorAll('.azh-pane').forEach(p=>p.classList.remove('active'));
    panel.querySelector('[data-tab="main"]').classList.add('active');
    panel.querySelector('#tab-main').classList.add('active');
    document.getElementById('btnAzhRun').classList.add('has-answers');
  }

  function setImportStatus(msg,ok=true){
    const el=document.getElementById('azhImportStatus');
    el.style.color=ok?'var(--azh-green)':'var(--azh-red)';el.textContent=msg;
  }

  function updateKeyStatus(){
    const n=Object.keys(answerKey).length;
    document.getElementById('statKeyCount').textContent=n;
    const el=document.getElementById('azhKeyStatus');
    if(n===0){
      el.style.background='rgba(183,28,28,.12)';el.style.borderColor='#b71c1c';
      el.style.color='var(--azh-red)';
      el.innerHTML='⚠️ Chưa có đáp án — vào tab <b style="color:var(--azh-accent2)">📋 Đáp án</b> để import';
    } else {
      el.style.background='rgba(27,94,32,.15)';el.style.borderColor='#2e7d32';
      el.style.color='var(--azh-green)';
      el.innerHTML='✅ Sẵn sàng — <b>'+n+' câu</b> đã load';
    }
  }

  function renderPreview(){
    const preview=document.getElementById('azhAnswerPreview');
    const entries=Object.entries(answerKey);
    if(!entries.length){preview.style.display='none';return;}
    preview.style.display='block';
    document.getElementById('btnCopyAnswers').style.display='';
    document.getElementById('btnSaveLocal').style.display='';
    preview.innerHTML=entries.map(([q,a])=>
      `<div class="ans-item"><span class="ans-q" title="${q}">${q.length>50?q.slice(0,50)+'…':q}</span><span class="ans-a">${a}</span></div>`
    ).join('');
    updateKeyStatus();
  }

  /* ══ FIND ANSWER (3-pass) ══ */
  function findAnswer(qText){
    if(!Object.keys(answerKey).length)return null;
    const qn=norm(qText);
    // Pass 1: exact / substring
    for(const [k,v] of Object.entries(answerKey)){
      const kn=norm(k);
      if(qn===kn||qn.includes(kn)||kn.includes(qn))return v;
    }
    // Pass 2: word overlap ≥ 70%
    let best=0,bestVal=null;
    for(const [k,v] of Object.entries(answerKey)){
      const s=wordOverlap(qText,k);
      if(s>=0.7&&s>best){best=s;bestVal=v;}
    }
    if(bestVal)return bestVal;
    // Pass 3: overlap ≥ 50%
    for(const [k,v] of Object.entries(answerKey)){
      const s=wordOverlap(qText,k);
      if(s>=0.5&&s>best){best=s;bestVal=v;}
    }
    return bestVal;
  }

  /* ══ GET QUESTION TEXT ══ */
  function getQuestionText(box){
    const sels=[
      '.question-standalone-main-content azt-dynamic-hook span',
      '.question-standalone-main-content azt-dynamic-hook',
      '.question-standalone-content-box azt-dynamic-hook span',
      '.question-standalone-content-box azt-dynamic-hook',
      '.question-standalone-main-content',
    ];
    let best='';
    for(const sel of sels){
      for(const el of box.querySelectorAll(sel)){
        const t=getText(el);if(t.length>best.length)best=t;
      }
    }
    return best;
  }

  /* ══ ANSWER ONE BOX ══ */
  async function answerBox(box,flag){
    const qText=getQuestionText(box);
    if(!qText||qText.length<3)return null;
    const correct=findAnswer(qText);
    if(!correct)return{q:qText,a:null,matched:false,type:'no_key'};
    const correctN=norm(correct);
    const d=getDelay();

    // Trắc nghiệm
    const items=box.querySelectorAll('.item-answer');
    if(items.length){
      const getAnsText=item=>{
        for(const sel of ['.answer-content azt-dynamic-hook span','.answer-content azt-dynamic-hook','.answer-content']){
          const el=item.querySelector(sel);if(el){const t=getText(el);if(t)return t;}
        }
        return getText(item);
      };
      // Pass A: exact/substring
      for(const item of items){
        if(flag.stop)return null;
        const aN=norm(getAnsText(item));
        const letter=norm(getText(item.querySelector('button.btn')));
        if(aN===correctN||aN.includes(correctN)||correctN.includes(aN)||letter===correctN){
          tryClick(item);await sleep(d);
          return{q:qText,a:correct,matched:true,type:'choice'};
        }
      }
      // Pass B: fuzzy ≥ 60%
      for(const item of items){
        if(flag.stop)return null;
        if(wordOverlap(correct,getAnsText(item))>=0.6){
          tryClick(item);await sleep(d);
          return{q:qText,a:correct,matched:true,type:'choice-fuzzy'};
        }
      }
      return{q:qText,a:correct,matched:false,type:'choice-no-match'};
    }

    // Điền vào ô
    const inputs=box.querySelectorAll('input[type=text],input:not([type]),textarea');
    if(inputs.length){
      inputs.forEach(inp=>setValue(inp,correct));
      await sleep(d);
      return{q:qText,a:correct,matched:true,type:'fill'};
    }

    // Đúng/Sai fallback
    for(const btn of box.querySelectorAll('button,.option')){
      if(norm(getText(btn))===correctN){tryClick(btn);await sleep(d);return{q:qText,a:correct,matched:true,type:'truefalse'};}
    }
    return{q:qText,a:correct,matched:false,type:'unknown'};
  }

  /* ══ ANSWER ALL ══ */
  async function answerAll(flag){
    const boxes=document.querySelectorAll('.question-standalone-box');
    const results=[];let count=0;
    log('📋 Tổng '+boxes.length+' câu hỏi','inf');
    for(let i=0;i<boxes.length;i++){
      if(flag.stop)break;
      setProgress(i/boxes.length*100);
      const res=await answerBox(boxes[i],flag);
      if(!res)continue;
      results.push(res);
      if(res.matched){count++;log('✓ '+res.q.slice(0,40)+'…','ok');}
      else if(res.a){log('✗ Không khớp: '+res.q.slice(0,40)+'…','warn');}
      else{log('— Không có key: '+res.q.slice(0,40)+'…','dim');}
    }
    setProgress(100);
    return{count,total:boxes.length,results};
  }

  /* ══ STATS ══ */
  function updateStatsUI(count,total){
    document.getElementById('statSessions').textContent=stats.sessions;
    document.getElementById('statAnswered').textContent=count;
    document.getElementById('statRate').textContent=total>0?Math.round(count/total*100)+'%':'—';
    const hist=document.getElementById('azhRunHistory');
    hist.innerHTML=(stats.runs||[]).slice(-10).reverse().map(r=>
      `<div style="padding:2px 0;border-bottom:1px solid var(--azh-border2);color:var(--azh-text2)">[${r.time}] Lần ${r.session}: ${r.count}/${r.total} (${r.rate})</div>`
    ).join('')||'<div style="color:var(--azh-dim)">Chưa có lần chạy nào.</div>';
  }

  /* ══ REPORT ══ */
  function buildReport(results){reportData=results.map((r,i)=>({no:i+1,...r}));}
  function reportToCSV(){
    return 'STT,Câu hỏi,Đáp án,Khớp,Loại\n'+
      reportData.map(r=>`${r.no},"${(r.q||'').replace(/"/g,'""')}","${(r.a||'').replace(/"/g,'""')}",${r.matched?'Có':'Không'},${r.type||''}`).join('\n');
  }
  function reportToText(){return reportData.map(r=>`[${r.no}] ${r.q}\n    → ${r.a||'(không có)'} (${r.matched?'✓':'✗'})`).join('\n\n');}
  function downloadReport(fmt){
    const blob=new Blob(['\uFEFF'+(fmt==='csv'?reportToCSV():reportToText())],{type:'text/'+fmt});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download='azota_report_'+Date.now()+(fmt==='csv'?'.csv':'.txt');a.click();URL.revokeObjectURL(a.href);
  }
  function openReport(){
    document.getElementById('azhReportBody').innerHTML=reportData.length
      ?reportData.map(r=>`<tr><td class="cell-num">${r.no}</td><td title="${r.q||''}">${(r.q||'').length>45?(r.q||'').slice(0,45)+'…':(r.q||'')}</td><td class="cell-ans">${r.a||'—'}</td><td style="text-align:center;color:${r.matched?'var(--azh-green)':'var(--azh-red)'}">${r.matched?'✓':'✗'}</td></tr>`).join('')
      :'<tr><td colspan="4" style="color:var(--azh-dim);text-align:center;padding:10px">Chưa có dữ liệu.</td></tr>';
    modal.classList.add('open');
  }

  /* ══════════════ MAIN RUN ══════════════ */
  const flag={stop:false};
  let isSubmitted=false;

  async function runAuto(){
    // Guard: phải có đáp án
    if(!Object.keys(answerKey).length){
      log('⛔ Chưa có đáp án! Import đáp án trước.','err');
      panel.classList.add('shake');
      setTimeout(()=>panel.classList.remove('shake'),500);
      setStatus('error','❌','Chưa có đáp án!');
      panel.querySelectorAll('.azh-tab').forEach(t=>t.classList.remove('active'));
      panel.querySelectorAll('.azh-pane').forEach(p=>p.classList.remove('active'));
      panel.querySelector('[data-tab="answers"]').classList.add('active');
      panel.querySelector('#tab-answers').classList.add('active');
      return;
    }

    flag.stop=false; isSubmitted=false;
    panel.classList.add('running');
    log('══ Bắt đầu phiên mới ══','ok');

    /* ── BƯỚC 1: Bắt đầu thi ── */
    setStatus('waiting','⏳','Chờ nút Bắt đầu thi…',true);
    log('⏳ Chờ nút "Bắt đầu thi"…','wait');

    const startBtn = await waitFor(
      ()=>Array.from(document.querySelectorAll('button')).find(b=>getText(b).includes('Bắt đầu thi')),
      10000, 300, flag
    );

    if(flag.stop)return cleanup('Dừng.');

    if(startBtn){
      startBtn.click();
      log('✅ Click "Bắt đầu thi"','ok');
    } else {
      // Thử Quay lại → Bắt đầu thi
      const back=Array.from(document.querySelectorAll('button')).find(b=>getText(b).includes('Quay lại'));
      if(back&&!flag.stop){back.click();await wait(600,flag);}
      const retry=await waitFor(
        ()=>Array.from(document.querySelectorAll('button')).find(b=>getText(b).includes('Bắt đầu thi')),
        8000,300,flag
      );
      if(retry&&!flag.stop){retry.click();log('✅ Click "Bắt đầu thi" (retry)','ok');}
      else{log('⚠️ Không tìm thấy nút Bắt đầu thi — bỏ qua bước này','warn');}
    }
    if(flag.stop)return cleanup('Dừng.');

    /* ── BƯỚC 2: Chờ form tên/lớp xuất hiện → điền ── */
    setStatus('waiting','🔍','Chờ form điền thông tin…',true);
    log('⏳ Chờ form tên/lớp xuất hiện…','wait');

    const nameInput = await waitFor(
      ()=>findInputByLabel('họ và tên')||findInputByLabel('tên'),
      12000, 200, flag
    );
    const classInput = await waitFor(
      ()=>findInputByLabel('lớp'),
      3000, 200, flag
    );

    if(flag.stop)return cleanup('Dừng.');

    const uName=document.getElementById('inpName').value.trim()||'Student_'+(Math.random()*9000+1000|0);
    const uClass=document.getElementById('inpClass').value.trim()||'8T3';

    if(nameInput&&classInput){setValue(nameInput,uName);setValue(classInput,uClass);log('✅ Điền: '+uName+' | '+uClass,'ok');}
    else if(nameInput){setValue(nameInput,uName);log('✅ Điền tên: '+uName,'ok');}
    else if(classInput){setValue(classInput,uClass);log('✅ Điền lớp: '+uClass,'ok');}
    else{log('ℹ️ Không có form tên/lớp — bỏ qua','dim');}

    if(nameInput||classInput){
      await wait(250,flag);
      const cf=Array.from(document.querySelectorAll('button')).find(b=>getText(b).includes('Xác nhận'));
      if(cf&&!flag.stop){cf.click();log('✅ Click "Xác nhận"','ok');}
    }
    if(flag.stop)return cleanup('Dừng.');

    /* ── BƯỚC 3: Chờ câu hỏi xuất hiện ── */
    setStatus('waiting','🔎','Chờ câu hỏi tải…',true);
    log('⏳ Chờ câu hỏi xuất hiện…','wait');

    const firstBox = await waitFor(
      ()=>document.querySelector('.question-standalone-box'),
      20000, 300, flag
    );

    if(!firstBox||flag.stop){
      log('❌ Không tìm thấy câu hỏi!','err');
      return cleanup('Không có câu hỏi.');
    }

    // Chờ thêm 1 chút cho render đủ
    await wait(500, flag);
    if(flag.stop)return cleanup('Dừng.');

    /* ── BƯỚC 4: Trả lời ── */
    setStatus('running','🤖','Đang trả lời…',true);
    log('🤖 Bắt đầu trả lời…','inf');

    const{count,total,results}=await answerAll(flag);
    log('📊 Kết quả: '+count+'/'+total+' câu ('+Math.round(count/Math.max(total,1)*100)+'%)',count>0?'ok':'warn');
    setProgress(100);
    buildReport(results);
    stats.sessions=(stats.sessions||0)+1;
    const rate=Math.round(count/Math.max(total,1)*100)+'%';
    (stats.runs=stats.runs||[]).push({session:stats.sessions,count,total,rate,time:new Date().toLocaleTimeString('vi')});
    safeStore('stats',stats);
    updateStatsUI(count,total);

    if(flag.stop)return cleanup('Dừng trước nộp.');

    /* ── BƯỚC 5: Nộp bài ── */
    if(document.getElementById('autoSubmitToggle').checked&&!isSubmitted){
      setStatus('waiting','📤','Chờ nút Nộp bài…',true);
      await wait(400,flag);
      const sm=Array.from(document.querySelectorAll('button')).find(b=>getText(b)==='Nộp bài'&&!b.closest('.mat-mdc-dialog-surface'));
      if(sm&&!flag.stop){sm.click();isSubmitted=true;log('📤 Click "Nộp bài"','ok');await wait(800,flag);}
      const sd=Array.from(document.querySelectorAll('.mat-mdc-dialog-surface button')).find(b=>getText(b)==='Nộp bài');
      if(sd&&!flag.stop){sd.click();log('✅ Xác nhận nộp bài ✓','ok');}
    } else if(!document.getElementById('autoSubmitToggle').checked){
      log('ℹ️ Auto-submit tắt — tự nộp tay','warn');
    }
    if(flag.stop)return cleanup('Dừng.');

    if(document.getElementById('notifyToggle').checked){
      try{new Notification('⚡ Azota Hack',{body:'Xong! '+count+'/'+total+' câu ('+rate+')'});}catch(_){}
    }

    if(document.getElementById('autoFarmToggle').checked&&!flag.stop){
      setStatus('waiting','🔁','Auto-Farm: restart sau 3s…',true);
      log('🔁 Auto-Farm: restart sau 3s…','inf');
      await wait(3000,flag);
      if(!flag.stop){setProgress(null);runAuto();}
    } else {
      setStatus('done','🎉','Hoàn thành! '+count+'/'+total+' câu');
      panel.classList.remove('running');
      setProgress(null);
      log('══ Hoàn thành! ══','ok');
    }
  }

  function cleanup(msg){
    panel.classList.remove('running');
    setProgress(null);
    setStatus('idle','💤','Đã dừng');
    log(msg,'err');
  }

  /* ══ EVENTS ══ */
  document.getElementById('btnAzhRun').addEventListener('click',runAuto);
  document.getElementById('btnAzhStop').addEventListener('click',()=>{
    flag.stop=true;document.getElementById('autoFarmToggle').checked=false;
    cleanup('Đã dừng.');
  });
  document.getElementById('btnAzhHide').addEventListener('click',()=>{panel.style.display='none';showBtn.style.display='block';});
  showBtn.addEventListener('click',()=>{panel.style.display='block';showBtn.style.display='none';});

  document.getElementById('btnParseText').addEventListener('click',()=>loadAnswerKey(document.getElementById('azhAnswerText').value));
  document.getElementById('azhFileInput').addEventListener('change',e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{document.getElementById('azhAnswerText').value=ev.target.result;loadAnswerKey(ev.target.result);};
    r.readAsText(f,'UTF-8');e.target.value='';
  });
  document.getElementById('btnAutoDetect').addEventListener('click',()=>{
    const detected={};
    for(const box of document.querySelectorAll('.question-standalone-box')){
      const qText=getQuestionText(box);if(!qText)continue;
      const sel=box.querySelector('.item-answer .btn.selected-answer,.item-answer.selected,.item-answer .border-selected-answer');
      if(!sel)continue;
      const item=sel.closest('.item-answer');if(!item)continue;
      const ansEl=item.querySelector('.answer-content azt-dynamic-hook span')||item.querySelector('.answer-content azt-dynamic-hook')||item.querySelector('.answer-content');
      const ansText=getText(ansEl);
      if(ansText)detected[qText.slice(0,100)]=ansText;
    }
    const n=Object.keys(detected).length;
    if(!n){log('Không detect được câu nào','warn');return;}
    Object.assign(answerKey,detected);
    document.getElementById('azhAnswerText').value=JSON.stringify(answerKey,null,2);
    setImportStatus('🔍 Detect '+n+' câu từ DOM');renderPreview();log('🔍 Auto-detect: '+n+' câu','ok');
  });
  document.getElementById('btnClearAns').addEventListener('click',()=>{
    answerKey={};document.getElementById('azhAnswerText').value='';
    document.getElementById('azhAnswerPreview').style.display='none';
    document.getElementById('btnCopyAnswers').style.display='none';
    document.getElementById('btnSaveLocal').style.display='none';
    document.getElementById('btnAzhRun').classList.remove('has-answers');
    setImportStatus('');updateKeyStatus();log('🗑️ Đã xóa đáp án','dim');
  });
  document.getElementById('btnCopyAnswers').addEventListener('click',()=>{
    navigator.clipboard.writeText(Object.entries(answerKey).map(([q,a])=>q+' = '+a).join('\n'))
      .then(()=>log('📋 Copied!','ok')).catch(()=>log('Copy thất bại','err'));
  });
  document.getElementById('btnSaveLocal').addEventListener('click',()=>{safeStore('answerKey',answerKey);log('💾 Đã lưu local','ok');});
  document.getElementById('btnLoadLocal').addEventListener('click',()=>{
    const s=safeLoad('answerKey');
    if(!s||!Object.keys(s).length){log('Không có đáp án trong localStorage','warn');return;}
    answerKey=s;document.getElementById('azhAnswerText').value=JSON.stringify(s,null,2);
    setImportStatus('📥 Loaded '+Object.keys(s).length+' câu');renderPreview();log('📥 Load local: '+Object.keys(s).length+' câu','ok');
    document.getElementById('btnAzhRun').classList.add('has-answers');
  });
  document.getElementById('btnExportReport').addEventListener('click',openReport);
  document.getElementById('btnCloseReport').addEventListener('click',()=>modal.classList.remove('open'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});
  document.getElementById('btnDlCSV').addEventListener('click',()=>downloadReport('csv'));
  document.getElementById('btnDlTXT').addEventListener('click',()=>downloadReport('txt'));
  document.getElementById('btnCopyReport').addEventListener('click',()=>{
    navigator.clipboard.writeText(reportToText()).then(()=>log('📋 Copied!','ok')).catch(()=>{});
  });
  document.getElementById('btnResetStats').addEventListener('click',()=>{
    stats={sessions:0,runs:[]};safeStore('stats',stats);updateStatsUI(0,0);log('🗑️ Reset stats','dim');
  });

  /* ══ KEYBOARD ══ */
  document.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
    if(e.key==='F2'){e.preventDefault();runAuto();}
    if(e.key==='F3'){e.preventDefault();document.getElementById('btnAzhStop').click();}
    if(e.key==='F4'){e.preventDefault();const p=document.getElementById('azhPanel');if(p.style.display==='none'){p.style.display='block';showBtn.style.display='none';}else{p.style.display='none';showBtn.style.display='block';}}
    if(e.key==='F5'){e.preventDefault();document.getElementById('btnAutoDetect').click();}
    if(e.key==='F6'){e.preventDefault();downloadReport('csv');}
    if(e.key==='Escape'){flag.stop=true;document.getElementById('autoFarmToggle').checked=false;cleanup('ESC — dừng.');}
  });

  /* ══ INIT ══ */
  updateKeyStatus();updateStatsUI(0,0);
  log('⚡ Sẵn sàng. Import đáp án → Run (F2)','inf');
})();
