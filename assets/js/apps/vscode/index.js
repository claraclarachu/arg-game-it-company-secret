import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { events } from '../../core/events.js';
import { escapeHtml } from '../../utils/helpers.js';

let currentFile = '/workspace/src/billing/service.js';
let activeActivity = 'explorer'; // explorer | search | scm | debug | extensions

export function mountVSCode() {
  const root = document.getElementById('view-vscode');
  if (!root) return;
  root.innerHTML = `
    <div class="vscode">
      <!-- VS Code Title Bar -->
      <div class="vscode__titlebar" role="banner">
        <div class="titlebar__left">
          <span class="vscode__logo" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14.5 2.5L3.2 8L8.2 9.6L9.8 14.6L14.5 2.5Z" fill="#007ACC"/><path d="M3.2 8L1 6.5L14.5 2.5L3.2 8Z" fill="#1681CF"/><path d="M9.8 14.6L8.2 9.6H3.2L9.8 14.6Z" fill="#1681CF"/></svg>
          </span>
          <nav class="titlebar__menu" aria-label="Menu">
            <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span>Help</span>
          </nav>
        </div>
        <div class="titlebar__center" id="vsTitle" title="billing/service.js — Code & Conspiracy — Visual Studio Code">billing/service.js — Code &amp; Conspiracy — Visual Studio Code</div>
        <div class="titlebar__controls" aria-label="Window controls">
          <button class="titlebar__btn" title="Minimize" aria-label="Minimize">—</button>
          <button class="titlebar__btn" title="Maximize" aria-label="Maximize">□</button>
          <button class="titlebar__btn titlebar__btn--close" title="Close" aria-label="Close">✕</button>
        </div>
      </div>

      <div class="vscode__body">
        <!-- Activity Bar -->
        <nav class="vscode__activitybar" aria-label="Activity Bar">
          <div class="activitybar__top">
            <button class="activitybar__btn active" data-activity="explorer" title="Explorer (Ctrl+Shift+E)" aria-label="Explorer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H9l2 2h7.5A2.5 2.5 0 0 1 21 7.5v11A2.5 2.5 0 0 1 18.5 21H5.5A2.5 2.5 0 0 1 3 18.5v-13z"/><path d="M3 9h18"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="search" title="Search (Ctrl+Shift+F)" aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="scm" title="Source Control (Ctrl+Shift+G)" aria-label="Source Control">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="debug" title="Run and Debug (Ctrl+Shift+D)" aria-label="Run and Debug">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 6.5L16.5 12L8 17.5V6.5z"/><path d="M18 8.5a2.5 2.5 0 1 1 0 7"/><path d="M18 10.5v1"/><path d="M18 13.5v1"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="extensions" title="Extensions (Ctrl+Shift+X)" aria-label="Extensions">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </button>
          </div>
          <div class="activitybar__bottom">
            <button class="activitybar__btn" title="Accounts" aria-label="Accounts">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
            </button>
            <button class="activitybar__btn" title="Manage - Settings" aria-label="Manage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.6a1.2 1.2 0 0 0 .27 1.32l.03.04a1.7 1.7 0 1 1-2.4 2.4l-.04-.03a1.2 1.2 0 0 0-1.32-.27 1.2 1.2 0 0 0-.77 1.13V20a1.7 1.7 0 1 1-3.4 0v-.7a1.2 1.2 0 0 0-.77-1.13 1.2 1.2 0 0 0-1.32.27l-.04.03a1.7 1.7 0 1 1-2.4-2.4l.03-.04a1.2 1.2 0 0 0 .27-1.32 1.2 1.2 0 0 0-.77-1.13H5a1.7 1.7 0 1 1 0-3.4h.7a1.2 1.2 0 0 0 .77-1.13 1.2 1.2 0 0 0-.27-1.32L6.17 7a1.7 1.7 0 1 1 2.4-2.4l.04.03a1.2 1.2 0 0 0 1.32.27 1.2 1.2 0 0 0 .77-1.13V3a1.7 1.7 0 1 1 3.4 0v.7a1.2 1.2 0 0 0 .77 1.13 1.2 1.2 0 0 0 1.32-.27l.04-.03a1.7 1.7 0 1 1 2.4 2.4l-.03.04a1.2 1.2 0 0 0-.27 1.32 1.2 1.2 0 0 0 .77 1.13H19a1.7 1.7 0 1 1 0 3.4h-.7a1.2 1.2 0 0 0-.77 1.13z"/></svg>
            </button>
          </div>
        </nav>

        <!-- Sidebar -->
        <aside class="vscode__side" id="vsSide">
          <div class="vscode__side-header">
            <span id="vsSideTitle">EXPLORER</span>
            <span class="vscode__side-actions"><button title="More Actions">⋯</button></span>
          </div>
          <div id="vsSideContent" style="display:flex;flex-direction:column;flex:1;min-height:0">
            <div class="vscode__searchbox" id="vsSearchBox">
              <input id="vsQuickOpen" class="input" placeholder="搜尋檔案 (Ctrl+P)" style="font-size:12px;height:28px" />
            </div>
            <div id="vsTree" class="tree"></div>
          </div>

          <!-- Alternate panels for activity bar -->
          <div id="vsPanelSearch" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SEARCH</div>
            <input id="vsSearchInput" class="input" placeholder="搜尋 (Search)" style="margin-bottom:8px" />
            <input id="vsSearchReplace" class="input" placeholder="取代 (Replace)" />
            <div id="vsSearchResult" class="small" style="margin-top:10px;min-height:16px;color:var(--fg-secondary)"></div>
            <div class="small muted" style="margin-top:12px">結果會顯示於此。</div>
          </div>
          <div id="vsPanelScm" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SOURCE CONTROL</div>
            <div class="small muted">0 changes • main</div>
            <div class="card" style="margin-top:10px"><div class="small">Commit message</div><input class="input" placeholder="Message" style="margin-top:6px" /></div>
          </div>
          <div id="vsPanelDebug" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">RUN AND DEBUG</div>
            <button class="btn primary" style="width:100%">▸ Start Debugging</button>
            <div class="small muted" style="margin-top:8px">No configuration.</div>
          </div>
          <div id="vsPanelExtensions" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">EXTENSIONS</div>
            <input class="input" placeholder="Search Extensions in Marketplace" />
            <div class="small muted" style="margin-top:12px">Offline — no marketplace.</div>
          </div>
        </aside>

        <!-- Editor Group -->
        <div class="vscode__main">
          <div id="vsTabs" class="vscode__tabs"></div>
          <div id="vsEditor" class="editor"><pre class="mono"></pre></div>
          <div class="terminal" id="vsTerminal"></div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="vscode__statusbar" role="contentinfo">
        <div class="vscode__statusbar-left">
          <span class="vscode__statusbar-item" title="Branch">⑂ main</span>
          <span class="vscode__statusbar-item">✓ No Issues</span>
        </div>
        <div class="vscode__statusbar-right">
          <span class="vscode__statusbar-item">Ln 1, Col 1</span>
          <span class="vscode__statusbar-item">Spaces: 2</span>
          <span class="vscode__statusbar-item">UTF-8</span>
          <span class="vscode__statusbar-item">JavaScript</span>
          <span class="vscode__statusbar-item">🔔</span>
        </div>
      </div>
    </div>
  `;
  renderTree();
  renderTabs();
  openFile(currentFile);
  bindVSCode();
  renderTerminal();
}

function bindVSCode() {
  document.getElementById('vsQuickOpen')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    renderTree(q);
  });

  // Hidden trigger: typing 420.69 in SEARCH panel activates portal (no visible hint in Explorer)
  const searchInput = document.getElementById('vsSearchInput');
  const searchResult = document.getElementById('vsSearchResult');
  function handleSearchTrigger(val) {
    const v = val.trim();
    if (!v) {
      if (searchResult) searchResult.textContent = '';
      return;
    }
    // Hidden feature: exact amount 420.69
    const num = parseFloat(v);
    if (v.includes('420.69') || num === 420.69) {
      const res = vfs.tryAccessPortal({ amount: 420.69 });
      if (res) {
        state.setFlag('found_code_map', true);
        if (searchResult) searchResult.textContent = '→ 已觸發隱藏路由 /internal/portal (查看 Search / Portal 頁)';
        appendTerminal('→ SEARCH 觸發隱藏路由 /internal/portal (420.69)');
      } else {
        if (searchResult) searchResult.textContent = '';
      }
      return;
    }
    // Normal search fallback: show VFS search hints without exposing portal
    if (searchResult) searchResult.textContent = '';
  }
  searchInput?.addEventListener('input', e => handleSearchTrigger(e.target.value));
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearchTrigger(e.target.value);
  });

  // Activity bar switching
  document.querySelectorAll('.activitybar__btn[data-activity]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeActivity = btn.dataset.activity;
      updateActivityBar();
    });
  });
}

function updateActivityBar() {
  document.querySelectorAll('.activitybar__btn[data-activity]').forEach(b => {
    b.classList.toggle('active', b.dataset.activity === activeActivity);
  });
  const title = document.getElementById('vsSideTitle');
  const map = { explorer: 'EXPLORER', search: 'SEARCH', scm: 'SOURCE CONTROL', debug: 'RUN AND DEBUG', extensions: 'EXTENSIONS' };
  if (title) title.textContent = map[activeActivity] || 'EXPLORER';

  const showExplorer = activeActivity === 'explorer';
  document.getElementById('vsSideContent').style.display = showExplorer ? 'flex' : 'none';
  document.getElementById('vsPanelSearch').style.display = activeActivity === 'search' ? 'flex' : 'none';
  document.getElementById('vsPanelScm').style.display = activeActivity === 'scm' ? 'flex' : 'none';
  document.getElementById('vsPanelDebug').style.display = activeActivity === 'debug' ? 'flex' : 'none';
  document.getElementById('vsPanelExtensions').style.display = activeActivity === 'extensions' ? 'flex' : 'none';
}

function renderTree(filter = '') {
  const c = document.getElementById('vsTree');
  if (!c) return;
  const tree = vfs.buildTree();
  function renderNode(node, depth = 0) {
    if (node.type === 'dir') {
      const visibleChildren = node.children.filter(ch => !filter || ch.path.toLowerCase().includes(filter) || hasDescendant(ch, filter));
      if (filter && visibleChildren.length === 0) return '';
      return `<div class="tree__node tree__node--dir" style="padding-left:${8+depth*8}px" data-path="${node.path}">📁 ${escapeHtml(node.name)}</div>
        <div class="tree__children">${visibleChildren.map(ch => renderNode(ch, depth+1)).join('')}</div>`;
    } else {
      if (filter && !node.path.toLowerCase().includes(filter)) return '';
      const active = node.path === currentFile ? 'active' : '';
      return `<div class="tree__node ${active}" data-path="${node.path}" data-file="1" style="padding-left:${8+depth*8}px">📄 ${escapeHtml(node.name)}</div>`;
    }
  }
  function hasDescendant(node, q) {
    if (node.path.toLowerCase().includes(q)) return true;
    if (node.children) return node.children.some(ch => hasDescendant(ch, q));
    return false;
  }
  c.innerHTML = tree.children.map(ch => renderNode(ch, 0)).join('');
  c.querySelectorAll('[data-file="1"]').forEach(el => {
    el.addEventListener('click', () => openFile(el.dataset.path));
  });
}

function renderTabs() {
  const tabs = document.getElementById('vsTabs');
  if (!tabs) return;
  const files = vfs.listFiles('/workspace').slice(0, 8);
  if (!files.some(f => f.path === currentFile)) {
    const cur = vfs.getFile(currentFile);
    if (cur) files.unshift({ path: currentFile, ...cur });
  }
  tabs.innerHTML = files.map(f => `<div class="vscode__tab ${f.path===currentFile?'active':''}" data-path="${f.path}"><span class="vscode__tab-dot"></span>${escapeHtml(f.path.split('/').pop())} <span style="opacity:.6;font-size:11px;margin-left:4px">${f.path===currentFile?'●':''}</span></div>`).join('');
  tabs.querySelectorAll('.vscode__tab').forEach(el => el.addEventListener('click', () => openFile(el.dataset.path)));
}

function openFile(path) {
  currentFile = path;
  const content = vfs.readFile(path);
  const pre = document.querySelector('#vsEditor pre');
  if (pre) {
    if (content == null) pre.textContent = '檔案不存在或尚未解鎖';
    else pre.textContent = content;
  }
  const titleEl = document.getElementById('vsTitle');
  if (titleEl) {
    const name = path.split('/').pop();
    titleEl.textContent = `${name} — ${path} — Code & Conspiracy — Visual Studio Code`;
  }
  renderTree(document.getElementById('vsQuickOpen')?.value.trim().toLowerCase() || '');
  renderTabs();
  appendTerminal(`$ open ${path}`);
}

function renderTerminal() {
  appendTerminal('tip: 在 editor 搜尋 "redirectTo" 找到隱藏分支');
  appendTerminal('tip: 在 .env.example 找到 INTERNAL_PORTAL_TOKEN');
}

function appendTerminal(line) {
  const t = document.getElementById('vsTerminal');
  if (!t) return;
  const div = document.createElement('div');
  div.className = 'terminal__line';
  div.textContent = line;
  t.appendChild(div);
  t.scrollTop = t.scrollHeight;
}
