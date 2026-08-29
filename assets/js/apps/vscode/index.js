import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { events } from '../../core/events.js';
import { escapeHtml } from '../../utils/helpers.js';

let currentFile = '/workspace/src/billing/service.js';
let activeActivity = 'explorer'; // explorer | search | scm | debug | extensions
let folded = new Set(); // Set of line numbers that are collapsed
let termHistory = [];
let termHistIdx = -1;
let termDraft = '';

const gitCommits = [
  { hash: 'a1b2c3d', author: 'finance@internal', date: '2024-08-12', msg: 'feat: integrate crypto-mixer (legacy)', diff: `+ import { cryptoMixer } from '@shady/crypto-mixer'\n  feeRate table added: cocoa 0.15, bean 0.22` },
  { hash: '9f8e7d6', author: 'qa-lee', date: '2024-08-10', msg: 'fix: rounding edge case INV-2024-0042 (see 420.69)', diff: `- if (total > 1000) ...\n+ if (total === 420.69) return redirectTo('/internal/portal') // hidden audit` },
  { hash: '4c2a1e0', author: 'dev', date: '2024-08-01', msg: 'chore: init billing service', diff: `+ export function calculateAmount(items, opts) {}\n+ export function computeFee(amount, opts) {}` },
];
const fakeBlame = {
  '/workspace/src/billing/service.js': [
    { line: 1, commit: '4c2a1e0', author: 'dev' },
    { line: 5, commit: '4c2a1e0', author: 'dev' },
    { line: 9, commit: '9f8e7d6', author: 'qa-lee' },
    { line: 12, commit: '9f8e7d6', author: 'qa-lee' },
    { line: 14, commit: 'a1b2c3d', author: 'finance@internal' },
  ]
};

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

          <!-- Search -->
          <div id="vsPanelSearch" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SEARCH</div>
            <input id="vsSearchInput" class="input" placeholder="搜尋 (Search)" style="margin-bottom:8px" />
            <input id="vsSearchReplace" class="input" placeholder="取代 (Replace)" />
            <div id="vsSearchResult" class="small" style="margin-top:10px;min-height:16px;color:var(--fg-secondary)"></div>
            <div class="small muted" style="margin-top:12px">結果會顯示於此。</div>
          </div>
          <!-- SCM -->
          <div id="vsPanelScm" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px;overflow:auto">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SOURCE CONTROL</div>
            <div class="git__tabs" role="tablist">
              <button class="git__tab active" data-git="log" role="tab">Log</button>
              <button class="git__tab" data-git="diff" role="tab">Diff</button>
              <button class="git__tab" data-git="blame" role="tab">Blame</button>
            </div>
            <div id="gitLogView"></div>
            <div id="gitDiffView" style="display:none"></div>
            <div id="gitBlameView" style="display:none"></div>
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
          <div id="vsEditor" class="editor"></div>
          <div class="terminal" id="vsTerminal">
            <div id="vsTerminalHist" class="terminal__hist"></div>
            <div class="terminal__prompt">
              <span class="terminal__ps">➜ ~/workspace $</span>
              <input id="vsTerminalInput" class="terminal__input" placeholder="輸入指令 (help 查看)" autocomplete="off" spellcheck="false" />
            </div>
            <div class="terminal__hint">Tab 補全 · ↑↓ 歷史 · help / ls / cat / grep / git log / git diff</div>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="vscode__statusbar" role="contentinfo">
        <div class="vscode__statusbar-left">
          <span class="vscode__statusbar-item" title="Branch">⑂ main</span>
          <span class="vscode__statusbar-item">✓ No Issues</span>
        </div>
        <div class="vscode__statusbar-right">
          <span class="vscode__statusbar-item" id="vsCursorInfo">Ln 1, Col 1</span>
          <span class="vscode__statusbar-item">Spaces: 2</span>
          <span class="vscode__statusbar-item">UTF-8</span>
          <span class="vscode__statusbar-item">JavaScript</span>
          <span class="vscode__statusbar-item">🔔</span>
        </div>
      </div>
    </div>
    <!-- QuickOpen overlay -->
    <div id="quickOpen" class="quickopen" role="dialog" aria-label="Quick Open">
      <input id="quickOpenInput" class="quickopen__input" placeholder="輸入檔案名稱或路徑 (Ctrl+P) — 輸入 : 可跳至行號" autocomplete="off" />
      <div id="quickOpenList" class="quickopen__list"></div>
    </div>
  `;
  renderTree();
  renderTabs();
  openFile(currentFile);
  bindVSCode();
  renderTerminalIntro();
  renderGitLog();
  bindShortcuts();
}

function bindVSCode() {
  document.getElementById('vsQuickOpen')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    renderTree(q);
  });

  // Hidden trigger: typing 420.69 in SEARCH panel activates portal
  const searchInput = document.getElementById('vsSearchInput');
  const searchResult = document.getElementById('vsSearchResult');
  function handleSearchTrigger(val) {
    const v = val.trim();
    if (!v) { if (searchResult) searchResult.textContent = ''; return; }
    const num = parseFloat(v);
    if (v.includes('420.69') || num === 420.69) {
      const res = vfs.tryAccessPortal({ amount: 420.69 });
      if (res) {
        state.setFlag('found_code_map', true);
        if (searchResult) searchResult.textContent = '→ 已觸發隱藏路由 /internal/portal (查看 Search / Portal 頁)';
        appendTerminal('→ SEARCH 觸發隱藏路由 /internal/portal (420.69)');
      } else { if (searchResult) searchResult.textContent = ''; }
      return;
    }
    if (searchResult) searchResult.textContent = '';
  }
  searchInput?.addEventListener('input', e => handleSearchTrigger(e.target.value));
  searchInput?.addEventListener('keydown', e => { if (e.key==='Enter') handleSearchTrigger(e.target.value); });

  document.querySelectorAll('.activitybar__btn[data-activity]').forEach(btn => {
    btn.addEventListener('click', () => { activeActivity = btn.dataset.activity; updateActivityBar(); });
  });

  // Terminal binding
  const tInput = document.getElementById('vsTerminalInput');
  tInput?.addEventListener('keydown', handleTerminalKey);
  // Git tabs
  document.querySelectorAll('.git__tab').forEach(b => {
    b.addEventListener('click', () => switchGitTab(b.dataset.git));
  });
  // QuickOpen binding
  const qoInput = document.getElementById('quickOpenInput');
  qoInput?.addEventListener('input', e => renderQuickOpen(e.target.value));
  qoInput?.addEventListener('keydown', handleQuickOpenKey);
  document.getElementById('quickOpen')?.addEventListener('click', e => { if (e.target.id==='quickOpen') closeQuickOpen(); });
}

function updateActivityBar() {
  document.querySelectorAll('.activitybar__btn[data-activity]').forEach(b => {
    b.classList.toggle('active', b.dataset.activity === activeActivity);
  });
  const title = document.getElementById('vsSideTitle');
  const map = { explorer: 'EXPLORER', search: 'SEARCH', scm: 'SOURCE CONTROL', debug: 'RUN AND DEBUG', extensions: 'EXTENSIONS' };
  if (title) title.textContent = map[activeActivity] || 'EXPLORER';
  document.getElementById('vsSideContent').style.display = activeActivity === 'explorer' ? 'flex' : 'none';
  document.getElementById('vsPanelSearch').style.display = activeActivity === 'search' ? 'flex' : 'none';
  document.getElementById('vsPanelScm').style.display = activeActivity === 'scm' ? 'flex' : 'none';
  document.getElementById('vsPanelDebug').style.display = activeActivity === 'debug' ? 'flex' : 'none';
  document.getElementById('vsPanelExtensions').style.display = activeActivity === 'extensions' ? 'flex' : 'none';
  if (activeActivity === 'scm') { renderGitLog(); renderGitDiff(); renderGitBlame(); }
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

// --- Editor: highlight + line numbers + folding ---
function highlightCode(code, lang) {
  // Placeholder approach to avoid nested escaping
  const placeholders = [];
  const store = (cls, text) => {
    const idx = placeholders.length;
    placeholders.push(`<span class="${cls}">${escapeHtml(text)}</span>`);
    return `@@__HL_${idx}__@@`;
  };
  let tmp = code;
  // 1) Comments first
  tmp = tmp.replace(/\/\/.*?$|\/\*[\s\S]*?\*\/|^#.*?$|^\/\/.*?$|^\/\*[\s\S]*?\*\//gm, m => store('hl-comment', m));
  // handle # comments for python (after // to avoid double)
  if (lang === 'python') tmp = tmp.replace(/(^#.*?$)/gm, m => store('hl-comment', m));
  // 2) Strings
  tmp = tmp.replace(/`[^`]*`|"[^"]*"|'[^']*'/g, m => store('hl-string', m));
  // 3) Escape remaining
  tmp = escapeHtml(tmp);
  // 4) Keywords
  const kws = lang === 'python'
    ? '\\b(import|from|def|return|if|else|elif|for|while|class|print|with|as|in)\\b'
    : lang === 'java' ? '\\b(package|import|public|private|class|return|switch|case|default|double|String|new)\\b'
    : '\\b(import|export|from|function|const|let|var|if|else|return|class|switch|case|default|new|async|await|try|catch)\\b';
  tmp = tmp.replace(new RegExp(kws, 'g'), '<span class="hl-keyword">$1</span>');
  // 5) Numbers (only on escaped text, safe)
  tmp = tmp.replace(/\b(\d+\.\d+|\d+)\b/g, '<span class="hl-number">$1</span>');
  // 6) Functions (word before '(')
  tmp = tmp.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="hl-func">$1</span>');
  if (lang === 'java') tmp = tmp.replace(/\b(double|String|OrderService)\b/g, '<span class="hl-type">$1</span>');
  // 7) Restore placeholders
  placeholders.forEach((html, i) => { tmp = tmp.split(`@@__HL_${i}__@@`).join(html); });
  return tmp;
}

function openFile(path) {
  currentFile = path;
  const entry = vfs.getFile(path);
  const content = vfs.readFile(path);
  const editor = document.getElementById('vsEditor');
  if (!editor) return;
  if (content == null) {
    editor.innerHTML = '<div class="editor__lines" style="padding:16px;color:var(--fg-muted)">檔案不存在或尚未解鎖 — 嘗試 Search 搜尋 "cocoa" 或觸發隱藏邏輯</div>';
  } else {
    const lang = entry?.meta?.lang || (path.endsWith('.py') ? 'python' : path.endsWith('.java') ? 'java' : 'javascript');
    const lines = content.split('\n');
    // detect foldable lines: ends with {  or contains function/class
    const foldable = new Set();
    lines.forEach((l, i) => {
      const t = l.trim();
      if (t.endsWith('{') && !t.startsWith('//') && !t.startsWith('#')) foldable.add(i + 1);
      if (/^(export )?function|class\s/.test(t)) foldable.add(i + 1);
    });
    const htmlLines = lines.map((raw, idx) => {
      const ln = idx + 1;
      const hl = highlightCode(raw || ' ', lang);
      const isFoldable = foldable.has(ln);
      const isCollapsed = folded.has(path + ':' + ln);
      const foldBtn = isFoldable ? `<span class="editor__fold ${isCollapsed?'collapsed':''}" data-fold="${ln}" title="${isCollapsed?'展開':'摺疊'}">${isCollapsed?'▸':'▾'}</span>` : '<span style="width:14px"></span>';
      // hidden due to collapsed parent
      let hidden = false;
      for (let p of folded) {
        const [pp, pl] = p.split(':');
        if (pp !== path) continue;
        const pln = parseInt(pl, 10);
        if (ln > pln) {
          const parentLine = lines[pln - 1];
          const indentParent = parentLine ? parentLine.search(/\S/) : 0;
          const curIndent = raw.search(/\S/);
          if (curIndent > indentParent || raw.trim() === '}') {
            // check if still within block - naive: hide until dedent or }
            if (ln - pln < 40) hidden = true; // simple range
          }
        }
      }
      return `<div class="editor__line ${hidden?'hidden':''}" data-ln="${ln}"><span class="hl-number" style="min-width:36px;text-align:right;padding-right:12px;opacity:.6">${ln}</span><span style="width:16px;display:flex;align-items:center;justify-content:center">${foldBtn}</span><span class="editor__code">${hl}</span></div>`;
    }).join('');
    editor.innerHTML = `
      <div class="editor__gutter" style="display:none"></div>
      <div class="editor__lines" style="flex:1;overflow:auto;padding:12px 0 12px 4px">${htmlLines}</div>
    `;
    // bind folds
    editor.querySelectorAll('[data-fold]').forEach(el => {
      el.addEventListener('click', () => {
        const key = path + ':' + el.dataset.fold;
        if (folded.has(key)) folded.delete(key); else folded.add(key);
        openFile(path);
      });
    });
    // click to update cursor info
    editor.querySelectorAll('.editor__line').forEach(el => {
      el.addEventListener('click', () => {
        const ln = el.dataset.ln;
        const col = 1;
        const info = document.getElementById('vsCursorInfo');
        if (info) info.textContent = `Ln ${ln}, Col ${col}`;
      });
    });
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

function renderTerminalIntro() {
  appendTerminal('tip: 在 editor 搜尋 "redirectTo" 找到隱藏分支');
  appendTerminal('tip: 在 .env.example 找到 INTERNAL_PORTAL_TOKEN');
  appendTerminal('輸入 help 查看可用指令 · Tab 補全 · ↑↓ 歷史');
}
function appendTerminal(line) {
  const hist = document.getElementById('vsTerminalHist');
  const t = document.getElementById('vsTerminal');
  const target = hist || t;
  if (!target) return;
  const div = document.createElement('div');
  div.className = 'terminal__line';
  div.textContent = line;
  target.appendChild(div);
  // scroll both
  if (hist) hist.scrollTop = hist.scrollHeight;
  if (t) t.scrollTop = t.scrollHeight;
}
function handleTerminalKey(e) {
  const input = e.target;
  const val = input.value;
  if (e.key === 'Enter') {
    const cmd = val.trim();
    if (!cmd) return;
    termHistory.push(cmd);
    termHistIdx = termHistory.length;
    appendTerminal(`➜ ${cmd}`);
    runTerminalCmd(cmd);
    input.value = '';
    termDraft = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (termHistIdx <= 0) { termHistIdx = 0; } else termHistIdx--;
    if (termDraft === '' && termHistory[termHistIdx] !== undefined) termDraft = val;
    if (termHistory[termHistIdx] !== undefined) input.value = termHistory[termHistIdx];
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    termHistIdx++;
    if (termHistIdx >= termHistory.length) { termHistIdx = termHistory.length; input.value = termDraft; } else { input.value = termHistory[termHistIdx]; }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const completed = tabComplete(val);
    if (completed) input.value = completed;
  }
}
function tabComplete(prefix) {
  const cmds = ['help','ls','cat ','grep ','git log','git diff','git blame','clear','echo '];
  const files = vfs.listFiles('/workspace').map(f=>f.path);
  const all = [...cmds, ...files, ...files.map(f=>f.split('/').pop())];
  if (!prefix) return prefix;
  const hit = all.find(c => c.startsWith(prefix));
  if (hit) return hit;
  // second try: space separated last token
  const parts = prefix.split(' ');
  const last = parts[parts.length-1];
  if (!last) return prefix;
  const hit2 = all.find(c => c.endsWith(last) || c.includes(last));
  if (hit2) { parts[parts.length-1] = hit2.split(' ').pop(); return parts.join(' '); }
  return prefix;
}
function runTerminalCmd(raw) {
  const [cmd, ...args] = raw.split(/\s+/);
  const argStr = args.join(' ');
  switch (cmd) {
    case 'help':
      appendTerminal('可用指令: ls [path], cat <file>, grep <keyword>, git log, git diff, git blame <file>, clear, echo <text>');
      appendTerminal('範例: cat /workspace/.env.example | grep 420.69');
      break;
    case 'ls': {
      const p = args[0] || '/workspace';
      const list = vfs.listFiles(p);
      if (!list.length) appendTerminal(`ls: ${p}: No such directory`);
      else list.slice(0, 20).forEach(f => appendTerminal(f.path));
      if (list.length > 20) appendTerminal(`... ${list.length-20} more`);
      break;
    }
    case 'cat': {
      const p = args[0];
      if (!p) { appendTerminal('cat: 缺少檔案路徑'); break; }
      const c = vfs.readFile(p) || vfs.readFile('/workspace' + (p.startsWith('/')?'':'/') + p);
      if (c == null) appendTerminal(`cat: ${p}: 檔案不存在或尚未解鎖`);
      else c.split('\n').slice(0, 80).forEach(l => appendTerminal(l));
      break;
    }
    case 'grep': {
      const q = argStr || args[0];
      if (!q) { appendTerminal('grep: 缺少關鍵字'); break; }
      const hits = vfs.searchContent(q);
      if (!hits.length) appendTerminal(`grep: "${q}" 無結果`);
      else { appendTerminal(`grep "${q}" 找到 ${hits.length} 筆:`); hits.slice(0, 10).forEach(h => appendTerminal(`${h.path}: ${h.snippet.slice(0,80)}...`)); }
      if (q.includes('420.69')) appendTerminal('hint: 試試在 Search 活動列輸入 420.69 觸發隱藏路由');
      break;
    }
    case 'git': {
      if (args[0] === 'log') {
        gitCommits.forEach(c => { appendTerminal(`commit ${c.hash} (${c.date}) ${c.author}`); appendTerminal(`    ${c.msg}`); });
      } else if (args[0] === 'diff') {
        const c = gitCommits[1];
        c.diff.split('\n').forEach(l => {
          const cls = l.startsWith('+') ? 'diff-add' : l.startsWith('-') ? 'diff-del' : '';
          appendTerminal(l);
        });
        // also show in SCM view if open
        switchGitTab('diff');
      } else if (args[0] === 'blame') {
        const p = args[1] || currentFile;
        appendTerminal(`blame ${p}:`);
        const bl = fakeBlame[p] || fakeBlame['/workspace/src/billing/service.js'];
        bl.forEach(b => appendTerminal(`${String(b.line).padStart(3)} ${b.commit} ${b.author}`));
        switchGitTab('blame');
        updateActivityBar(); // ensure scm visible hint
      } else {
        appendTerminal('git: 未知子指令，試 help');
      }
      break;
    }
    case 'clear':
      { const h = document.getElementById('vsTerminalHist'); if (h) h.innerHTML = ''; break; }
    case 'echo':
      appendTerminal(argStr);
      break;
    default:
      appendTerminal(`zsh: command not found: ${cmd} (試 help)`);
  }
}

// --- Git panel ---
function renderGitLog() {
  const el = document.getElementById('gitLogView');
  if (!el) return;
  el.innerHTML = gitCommits.map(c => `
    <div class="git__commit">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <b class="mono" style="color:var(--accent)">${c.hash}</b>
        <span class="small muted">${c.date} — ${c.author}</span>
      </div>
      <div style="margin:4px 0">${escapeHtml(c.msg)}</div>
      <div class="small muted">點擊看 diff</div>
    </div>
  `).join('');
  el.querySelectorAll('.git__commit').forEach((n,i) => n.addEventListener('click', () => { switchGitTab('diff'); }));
}
function renderGitDiff() {
  const el = document.getElementById('gitDiffView');
  if (!el) return;
  const diff = gitCommits[1].diff;
  el.innerHTML = `<div class="git__diff">${diff.split('\n').map(l => {
    const esc = escapeHtml(l);
    if (l.startsWith('+')) return `<div class="diff-add">${esc}</div>`;
    if (l.startsWith('-')) return `<div class="diff-del">${esc}</div>`;
    return `<div>${esc}</div>`;
  }).join('')}</div>
  <div class="small muted" style="margin-top:6px">變更檔案: <a href="#" data-open="/workspace/src/billing/service.js" style="color:var(--accent)">src/billing/service.js</a></div>`;
  el.querySelectorAll('[data-open]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openFile(a.dataset.open); }));
}
function renderGitBlame() {
  const el = document.getElementById('gitBlameView');
  if (!el) return;
  const path = currentFile;
  const lines = (vfs.readFile(path) || '').split('\n').slice(0, 20);
  const bl = fakeBlame[path] || fakeBlame['/workspace/src/billing/service.js'];
  const map = new Map(bl.map(b => [b.line, b]));
  el.innerHTML = `<div style="border:1px solid var(--border);border-radius:6px;overflow:hidden;max-height:220px;overflow:auto">` + lines.map((code, idx) => {
    const ln = idx + 1;
    const m = map.get(ln);
    const meta = m ? `${m.commit.slice(0,7)} ${m.author}` : '—';
    return `<div class="blame__line" style="${ln%2?'background:var(--bg-primary)':'background:var(--bg-secondary)'}"><span class="blame__meta">${String(ln).padStart(2)} ${escapeHtml(meta)}</span><span style="flex:1;white-space:pre-wrap">${escapeHtml(code.slice(0,80))}</span></div>`;
  }).join('') + `</div><div class="small muted" style="margin-top:6px">顯示 ${path} blame (共 ${lines.length} 行縮略)</div>`;
}
function switchGitTab(which) {
  document.querySelectorAll('.git__tab').forEach(b => b.classList.toggle('active', b.dataset.git===which));
  const log = document.getElementById('gitLogView');
  const diff = document.getElementById('gitDiffView');
  const blame = document.getElementById('gitBlameView');
  if (log) log.style.display = which==='log' ? 'block' : 'none';
  if (diff) diff.style.display = which==='diff' ? 'block' : 'none';
  if (blame) blame.style.display = which==='blame' ? 'block' : 'none';
  if (which==='diff') renderGitDiff();
  if (which==='blame') renderGitBlame();
}

// QuickOpen + shortcuts
function bindShortcuts() {
  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'p' && !e.shiftKey) {
      e.preventDefault(); openQuickOpen();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault(); activeActivity='search'; updateActivityBar(); document.getElementById('vsSearchInput')?.focus();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'g') {
      e.preventDefault(); activeActivity='scm'; updateActivityBar();
    } else if (e.key === 'Escape') {
      closeQuickOpen();
    } else if (mod && e.key === '/') {
      e.preventDefault(); document.getElementById('vsTerminalInput')?.focus();
    }
  });
}
function openQuickOpen() {
  const q = document.getElementById('quickOpen');
  const inp = document.getElementById('quickOpenInput');
  if (!q || !inp) return;
  q.classList.add('open');
  inp.value = '';
  inp.focus();
  renderQuickOpen('');
}
function closeQuickOpen() {
  document.getElementById('quickOpen')?.classList.remove('open');
}
function renderQuickOpen(query) {
  const list = document.getElementById('quickOpenList');
  if (!list) return;
  const q = (query || '').trim().toLowerCase();
  let files = vfs.listFiles('/workspace');
  // support :line jump like service.js:12
  let lineJump = null;
  if (q.includes(':')) {
    const [fq, ln] = q.split(':');
    lineJump = parseInt(ln,10);
    files = files.filter(f => f.path.toLowerCase().includes(fq));
  } else if (q) {
    files = files.filter(f => f.path.toLowerCase().includes(q));
  }
  files = files.slice(0, 10);
  if (!files.length) { list.innerHTML = '<div class="quickopen__item muted">無符合檔案 — 試輸入 coin / billing</div>'; return; }
  list.innerHTML = files.map((f,i) => `
    <div class="quickopen__item ${i===0?'active':''}" data-path="${f.path}">
      <span>${escapeHtml(f.path)}</span>
      <span class="quickopen__kbd">${f.path.split('.').pop()}</span>
    </div>
  `).join('');
  list.querySelectorAll('.quickopen__item').forEach(el => {
    el.addEventListener('click', () => { openFile(el.dataset.path); if (lineJump) scrollToLine(lineJump); closeQuickOpen(); });
  });
}
function handleQuickOpenKey(e) {
  if (e.key === 'Escape') { closeQuickOpen(); return; }
  if (e.key === 'Enter') {
    const active = document.querySelector('#quickOpenList .quickopen__item.active') || document.querySelector('#quickOpenList .quickopen__item');
    if (active) { openFile(active.dataset.path); closeQuickOpen(); }
    return;
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const items = [...document.querySelectorAll('#quickOpenList .quickopen__item')];
    if (!items.length) return;
    let idx = items.findIndex(x => x.classList.contains('active'));
    items[idx]?.classList.remove('active');
    idx = e.key === 'ArrowDown' ? Math.min(idx+1, items.length-1) : Math.max(idx-1, 0);
    if (idx < 0) idx = 0;
    items[idx]?.classList.add('active');
  }
}
function scrollToLine(ln) {
  const editor = document.getElementById('vsEditor');
  if (!editor) return;
  const target = editor.querySelector(`[data-ln="${ln}"]`);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
