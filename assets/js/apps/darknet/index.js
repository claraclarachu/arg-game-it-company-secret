import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';

let darkClickCount = 0;
let darkClickTimer = null;
let darkEntered = false;
let currentDarkPath = '/darknet';
let darkViewMode = 'secret'; // 'secret' or 'files'

function buildDarkTree() {
  return vfs.buildDarkTree ? vfs.buildDarkTree() : vfs.buildTree();
}

function getDarkChildren(path) {
  const tree = buildDarkTree();
  function findNode(node, target) {
    if (node.path === target) return node;
    if (!node.children) return null;
    for (const ch of node.children) {
      const res = findNode(ch, target);
      if (res) return res;
    }
    return null;
  }
  const n = findNode(tree, path);
  if (!n || !n.children) return [];
  return n.children;
}

export function mountDarknet() {
  const root = document.getElementById('view-darknet');
  if (!root) return;
  // Check if already entered via flag
  if (state.hasFlag('dark_entered')) {
    darkViewMode = 'files';
    darkEntered = true;
  }
  render();
}

function render() {
  const root = document.getElementById('view-darknet');
  if (!root) return;
  if (darkViewMode === 'secret') {
    root.innerHTML = `
      <div class="darknet">
        <div class="darknet__secret" id="darkSecretView">
          <div class="darknet__title" id="darkTitle" title="點擊六下進入">SECRET</div>
          <div class="darknet__subtitle">Nori Intranet · Dark Portal</div>
          <div class="darknet__search">
            <span style="color:#722F37">🔍</span>
            <input id="darkSearchInput" placeholder="輸入暗網路徑..." value="" autocomplete="off" readonly />
          </div>
          <div class="darknet__hint">無點擊不會有反應</div>
        </div>
      </div>
    `;
    bindSecret();
  } else {
    // Files view - same as VFS but dark
    const children = getDarkChildren(currentDarkPath);
    const dirs = children.filter(c => c.type === 'dir');
    const files = children.filter(c => c.type === 'file');
    root.innerHTML = `
      <div class="darknet">
        <div style="height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid #1a0a0c;background:#0a0a0a;flex-shrink:0">
          <span class="small muted" style="color:#8b6a6e">機密文件庫 · ${escapeHtml(currentDarkPath)}</span>
          <button id="darkExitBtn" class="btn" style="padding:4px 10px;background:#722F37;border-color:#722F37;color:#fff">退出暗網</button>
        </div>
        <div class="darknet__fileview">
          <nav class="darknet__nav" id="darkNav"></nav>
          <div class="darknet__main" id="darkMain"></div>
        </div>
      </div>
      <div id="darkPreview" class="intra-preview" style="display:none" role="dialog" aria-modal="true">
        <div class="intra-preview__card" style="background:#0a0a0a;border-color:#722F37">
          <div class="intra-preview__head" style="background:#1a0a0c;border-color:#722F37">
            <b id="darkPreviewName" class="mono small" style="color:#e9edef"></b>
            <button id="darkPreviewClose" class="btn" style="padding:4px 10px">關閉</button>
          </div>
          <pre id="darkPreviewContent" class="intra-preview__content" style="background:#000;color:#e9edef"></pre>
        </div>
      </div>
    `;
    renderDarkNav();
    renderDarkMain(dirs, files);
    bindDark();
  }
}

function bindSecret() {
  const title = document.getElementById('darkTitle');
  const input = document.getElementById('darkSearchInput');
  if (!title) return;
  title.addEventListener('click', () => {
    darkClickCount++;
    title.style.transform = 'scale(0.95)';
    setTimeout(() => title.style.transform = '', 80);
    if (darkClickTimer) clearTimeout(darkClickTimer);
    darkClickTimer = setTimeout(() => { darkClickCount = 0; }, 2000);
    if (darkClickCount >= 6) {
      darkClickCount = 0;
      enterDarkFiles();
    }
  });
  // Input on SECRET page does nothing (as per spec: 無點擊不會有反應)
  // But we can allow Enter on input to also not react, only title clicks matter
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      // No reaction
      input.placeholder = '請點擊上方標題六下';
      setTimeout(() => input.placeholder = '輸入暗網路徑...', 1500);
    }
  });
}

function enterDarkFiles() {
  darkEntered = true;
  darkViewMode = 'files';
  state.setFlag('dark_entered', true);
  state.setFlag('ch3_entered_secret', true);
  // Also set the original portal flags for compatibility
  state.setFlag('hidden_portal_accessed', true);
  render();
  // Track that user found the secret entrance
  state.setFlag('found_code_map', true);
}

function renderDarkNav() {
  const el = document.getElementById('darkNav');
  if (!el) return;
  const items = [
    { path: '/darknet', label: '機密首頁', icon: '🕶️' },
    { path: '/darknet/全結構圖', label: '全結構圖', icon: '🗺️' },
    { path: '/darknet/毒品交易列表', label: '毒品交易列表', icon: '📋' },
    { path: '/darknet/合作公司列表', label: '合作公司', icon: '🏢' },
    { path: '/darknet/毒品流量', label: '毒品流量', icon: '📦' },
    { path: '/darknet/月結單', label: '月結單', icon: '💰' },
  ];
  el.innerHTML = items.map(it => {
    const active = currentDarkPath === it.path || currentDarkPath.startsWith(it.path + '/') ? 'active' : '';
    return `<div class="darknet__nav-item ${active}" data-path="${it.path}"><span>${it.icon}</span><span>${it.label}</span></div>`;
  }).join('');
  el.querySelectorAll('.darknet__nav-item').forEach(n => n.addEventListener('click', () => {
    currentDarkPath = n.dataset.path;
    render();
  }));
}

function renderDarkMain(dirs, files) {
  const el = document.getElementById('darkMain');
  if (!el) return;
  if (!dirs.length && !files.length) {
    const entry = vfs.getDarkFile ? vfs.getDarkFile(currentDarkPath) : null;
    if (entry && entry.content) {
      el.innerHTML = `<pre style="white-space:pre-wrap;word-break:break-word;font-family:var(--font-mono);font-size:13px;color:#e9edef">${escapeHtml(entry.content.slice(0,8000))}</pre>`;
      // Mark as opened for Ch4
      state.discoverFile(currentDarkPath);
      checkCh4();
      return;
    }
    el.innerHTML = `<div style="padding:24px;text-align:center;color:#5a3a3e">此資料夾為空</div>`;
    return;
  }
  el.innerHTML = `
    <div style="font-size:11px;font-weight:700;letter-spacing:.6px;color:#5a3a3e;margin-bottom:8px">${escapeHtml(currentDarkPath)} — ${dirs.length} 資料夾，${files.length} 檔案</div>
    ${dirs.length ? `<div style="margin-bottom:12px">${dirs.map(ch => `<div class="darknet__file-row is-dir" data-path="${escapeHtml(ch.path)}" data-type="dir">📁 ${escapeHtml(ch.name)}</div>`).join('')}</div>` : ''}
    ${files.length ? `<div>${files.map(ch => `<div class="darknet__file-row" data-path="${escapeHtml(ch.path)}" data-type="file">📄 ${escapeHtml(ch.name)}</div>`).join('')}</div>` : ''}
  `;
  el.querySelectorAll('.darknet__file-row').forEach(row => {
    row.addEventListener('click', () => {
      const p = row.dataset.path;
      const t = row.dataset.type;
      if (t === 'dir') {
        currentDarkPath = p;
        render();
      } else {
        openDarkPreview(p);
      }
    });
  });
}

function openDarkPreview(path) {
  const entry = vfs.getDarkFile ? vfs.getDarkFile(path) : vfs.getFile(path);
  if (!entry) return;
  const modal = document.getElementById('darkPreview');
  const nameEl = document.getElementById('darkPreviewName');
  const contentEl = document.getElementById('darkPreviewContent');
  if (!modal || !nameEl || !contentEl) return;
  nameEl.textContent = path;
  let content = entry.content || '';
  // CSV table view like intranet
  if (path.toLowerCase().endsWith('.csv')) {
    const lines = content.split('\n').filter(l => l.trim() !== '');
    const parseLine = (line) => {
      const out = []; let cur = ''; let inQuote = false;
      for (let i=0;i<line.length;i++) {
        const ch=line[i];
        if (ch==='"') { if(inQuote && line[i+1]==='"'){cur+='"';i++;} else inQuote=!inQuote; }
        else if (ch===',' && !inQuote) { out.push(cur); cur=''; }
        else cur+=ch;
      }
      out.push(cur); return out;
    };
    const header = parseLine(lines[0]||'');
    const rows = lines.slice(1).map(parseLine);
    const thead = `<thead><tr>${header.map(h=>`<th style="padding:8px 10px;border:1px solid #722F37;background:#1a0a0c;color:#a67c81;text-align:left">${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r=>`<tr>${r.map(c=>`<td style="padding:7px 10px;border:1px solid #1a0a0c;color:#e9edef">${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    contentEl.innerHTML = `<div style="padding:8px 12px;border-bottom:1px solid #1a0a0c;background:#1a0a0c;display:flex;justify-content:space-between"><span class="small muted" style="color:#8b6a6e">${escapeHtml(path)} — 表格檢視</span><span class="small muted" style="color:#8b6a6e">${rows.length} 列</span></div><div style="overflow:auto;max-height:60vh"><table style="width:100%;border-collapse:collapse;font-size:13px">${thead}${tbody}</table></div>`;
    contentEl.style.whiteSpace = 'normal';
  } else {
    if (content.length > 12000) content = content.slice(0,12000) + '\n...';
    contentEl.textContent = content;
    contentEl.style.whiteSpace = 'pre-wrap';
  }
  modal.style.display = 'flex';
  // Mark as discovered for Ch4
  state.discoverFile(path);
  state.setFlag('dark_opened:'+path, true);
  checkCh4();
}

function bindDark() {
  document.getElementById('darkExitBtn')?.addEventListener('click', () => {
    // Exit darknet back to normal intranet
    darkViewMode = 'secret';
    // Trigger Ch4 completion check before exit
    checkCh4(true);
    // Switch to intranet view
    import('../../ui/dock.js').then(dock => {
      if (dock.setActiveView) {
        dock.setActiveView('intranet');
        localStorage.setItem('cc_active_view', 'intranet');
      }
    });
    // Also ensure intranet is mounted
    const root = document.getElementById('view-darknet');
    if (root) root.innerHTML = '';
    // After exiting, if Ch4 completed, trigger Ch5
    if (state.hasFlag('ch4_all_opened')) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('darknet:exit'));
      }, 300);
    }
  });
  document.getElementById('darkPreviewClose')?.addEventListener('click', () => {
    const m = document.getElementById('darkPreview');
    if (m) m.style.display = 'none';
  });
  document.getElementById('darkPreview')?.addEventListener('click', e => {
    if (e.target.id === 'darkPreview') e.target.style.display = 'none';
  });
}

function checkCh4(forceExit = false) {
  // Check if all dark files have been opened
  const allDark = vfs.listDarkFiles ? vfs.listDarkFiles('/darknet') : [];
  if (!allDark.length) return;
  const opened = allDark.filter(f => state.hasFlag('dark_opened:'+f.path) || state.hasFlag('discovered:'+f.path) || state.get('discoveredFiles')?.includes(f.path));
  if (opened.length >= allDark.length) {
    if (!state.hasFlag('ch4_all_opened')) {
      state.setFlag('ch4_all_opened', true);
    }
    if (forceExit && !state.hasFlag('ch5_triggered')) {
      state.setFlag('ch5_triggered', true);
      window.dispatchEvent(new CustomEvent('ch4:complete'));
      // Also directly show mail dialog as fallback
      setTimeout(() => {
        const dlg = document.getElementById('mailDialog');
        if (dlg && !dlg.open) {
          try { dlg.showModal(); } catch { dlg.style.display = 'block'; dlg.setAttribute('open',''); }
        }
      }, 500);
    }
  } else if (forceExit && opened.length >= allDark.length) {
    // Already handled
  }
  // If user has opened all files but not yet exited, also set ch4_all_opened for check
  if (opened.length >= allDark.length && !state.hasFlag('ch4_all_opened')) {
    state.setFlag('ch4_all_opened', true);
  }
}

export function triggerDarknetFromIntranet() {
  // Called when intranet detects dark web URL
  const root = document.getElementById('view-darknet');
  if (!root) return;
  // Switch to darknet view
  import('../../ui/dock.js').then(dock => {
    if (dock.setActiveView) {
      dock.setActiveView('darknet');
      localStorage.setItem('cc_active_view', 'darknet');
    }
  });
  darkViewMode = 'secret';
  darkClickCount = 0;
  mountDarknet();
}

export function isDarknetEntered() { return darkEntered; }
