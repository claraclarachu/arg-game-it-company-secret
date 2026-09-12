import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { events } from '../../core/events.js';
import { escapeHtml } from '../../utils/helpers.js';
import { trackOnboarding } from '../../main.js';

let currentFile = '/customer-portal/src/main/java/com/nori/OrderService.java';
let activeActivity = 'explorer'; // explorer | search | scm | debug | extensions
let folded = new Set(); // Set of line numbers that are collapsed
let termHistory = [];
let termHistIdx = -1;
let termDraft = '';

// Editable tracking
const editedFiles = new Map(); // path -> edited content string
let originalSearchBarSnapshot = null; // captured at mount to allow revert via git graph
let originalHomeSnapshot = null; // 2024-02-14 Parker fix: Home.jsx bug snapshot
function getOriginalContent(path) {
  const e = vfs.getFile(path);
  return e ? e.content : null;
}
function getCurrentContent(path) {
  if (editedFiles.has(path)) return editedFiles.get(path);
  return getOriginalContent(path);
}
function isDirty(path) {
  if (!editedFiles.has(path)) return false;
  return editedFiles.get(path) !== getOriginalContent(path);
}
function markDirty(path, content) {
  const orig = getOriginalContent(path);
  if (content === orig) editedFiles.delete(path);
  else editedFiles.set(path, content);
  persistVSCode();
  renderTabs();
  renderScmChanges();
}
function captureOriginalSearchBar() {
  if (!originalSearchBarSnapshot) {
    const e = vfs.getFile('/file-system/src/components/SearchBar.jsx');
    if (e) originalSearchBarSnapshot = e.content;
  }
}
function captureOriginalHome() {
  if (!originalHomeSnapshot) {
    const e = vfs.getFile('/customer-portal/src/frontend/src/pages/Home.jsx');
    if (e) originalHomeSnapshot = e.content;
  }
}
const HOME_BUG_CONTENT = `export default function Home(){\n  return (\n    <div>\n      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>\n      <p>創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷</p>\n      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>\n    </div>\n  );\n}\n`;
const HOME_FIXED_CONTENT = `export default function Home(){\n  return (\n    <div>\n      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>\n      <p>創辦人 蔡梓掦 · 2019 創立 · 招牌冰釀茶酒最暢銷</p>\n      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>\n    </div>\n  );\n}\n`;
function isPortalEntryClosed() {
  return state.hasFlag('ch1_0043_committed') && !state.hasFlag('ch1_revert_done');
}
function triggerSystemHealthy(source = 'revert') {
  // Common healthy path: clear system_down, set revert_done, send WhatUp healthy with 10s win notification
  // Called from both git-graph revert button and manual paste-back commit
  if (state.hasFlag('ch1_revert_done')) return;
  state.setFlag('ch1_revert_done', true);
  state.setFlag('ch1_system_down', false);
  // Restore portal access implicitly via flag
  setTimeout(() => {
    import('../whatsapp/index.js').then(m => {
      const chats = m.getChats ? m.getChats() : [];
      const sys = chats.find(x=>x.id==='system-alert');
      if (sys) {
        sys.messages.push({ id: 'health-'+Date.now(), from: 'system', text: '✅ 系統健康 — 所有服務已恢復正常', time: new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}), read: 'delivered', type: 'text' });
        sys.preview = '✅ 系統健康';
        sys.unread = (sys.unread||0)+1;
        window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'system-alert'}}));
        // Win notification for health - hold 10 sec per spec
        const container = document.createElement('div');
        if (isChatMutedVS('system-alert')) return;
        container.id = 'wa-win-notif-health-' + Date.now();
        container.setAttribute('role','alert');
        container.innerHTML = `<div class="win-notif__app"><img src="${import.meta.env.BASE_URL}icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">System Alert</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #0d9488, #25D366)">✓</div><div class="win-notif__text"><div class="win-notif__sender">System Alert</div><div class="win-notif__msg">✅ 系統健康 — 所有服務已恢復正常</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 10000ms linear forwards"></div>`;
        container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;';
        container.addEventListener('click', (e)=>{ if(e.target.closest('.win-notif__close')) return; container.remove(); import('../../ui/dock.js').then(d=>{ if(d.setActiveView){d.setActiveView('whatsapp'); localStorage.setItem('cc_active_view','whatsapp');} }); import('../whatsapp/index.js').then(mm=>mm.openChat('system-alert')); });
        container.querySelector('.win-notif__close')?.addEventListener('click', e=>{ e.stopPropagation(); container.remove(); });
        document.body.appendChild(container);
        requestAnimationFrame(()=>{ container.style.opacity='1'; container.style.transform='none'; });
        setTimeout(()=>{ container.style.opacity='0'; container.style.transform='translateY(8px)'; setTimeout(()=>container.remove(),300); }, 10000);
      }
    });
  }, 500);
}
function handleGitGraphRevert(hash) {
  const target = gitGraphCommits.find(c=>c.hash===hash) || gitCommits.find(c=>c.hash===hash);
  if (!target) return;
  // --- INV-2024-0017 Parker fix: toggle Home.jsx bug <-> fixed ---
  const isParker0017 = target.msg.includes('INV-2024-0017') || target.hash === '3f2a9c1';
  if (isParker0017) {
    const current = vfs.getFile('/customer-portal/src/frontend/src/pages/Home.jsx')?.content || '';
    const isBug = current.includes('連結人與希望') || current.includes('2018 創立');
    const nextContent = isBug ? HOME_FIXED_CONTENT : HOME_BUG_CONTENT;
    vfs.registerFile('/customer-portal/src/frontend/src/pages/Home.jsx', { content: nextContent, meta: { lang: 'javascript' } });
    const e = vfs.getFile('/customer-portal/src/frontend/src/pages/Home.jsx');
    if (e) e.content = nextContent;
    editedFiles.delete('/customer-portal/src/frontend/src/pages/Home.jsx');
    const hash2 = Math.random().toString(36).slice(2,8);
    const msg = isBug ? `revert: restore Home.jsx fix (revert ${hash} — apply Parker fix)` : `revert: revert Home.jsx fix (revert ${hash} — back to bug)`;
    const diff = isBug ? `M /customer-portal/src/frontend/src/pages/Home.jsx\n- 連結人與希望 / 2018\n+ 連結人與風味 / 2019 (revert apply)` : `M /customer-portal/src/frontend/src/pages/Home.jsx\n- 連結人與風味 / 2019\n+ 連結人與希望 / 2018 (revert)`;
    gitCommits.unshift({ hash: hash2, author: 'Parker', date: new Date().toISOString().slice(0,10), msg, diff });
    gitGraphCommits.unshift({ hash: hash2, branch: 'main', author: 'Parker', date: new Date().toISOString().slice(0,10), msg, diff });
    const statusEl = document.getElementById('scmCommitStatus');
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✓ Revert 成功: ${hash2} (from ${hash}) — ${isBug ? '已套用 Parker 修復' : '已回退至 bug 版'}</span>`;
    appendTerminal(`✓ revert ${hash2} — ${msg}`);
    persistVSCode();
    renderTabs(); renderTree(); renderScmChanges();
    if (gitGraphOpen) renderGitGraphEditor();
    return;
  }
  // Revert button on commit row: restore SearchBar.jsx to original and create revert commit
  if (!isPortalEntryClosed()) return;
  // Only allow revert if that hash is the 0043 removal commit (or any Casey commit while down)
  // Restore file content
  captureOriginalSearchBar();
  if (originalSearchBarSnapshot) {
    vfs.registerFile('/file-system/src/components/SearchBar.jsx', { content: originalSearchBarSnapshot, meta: { lang: 'javascript' } });
    const e = vfs.getFile('/file-system/src/components/SearchBar.jsx');
    if (e) e.content = originalSearchBarSnapshot;
  }
  editedFiles.delete('/file-system/src/components/SearchBar.jsx');
  // Also clear any other dirty that might be SearchBar edited
  // Create revert commit entry
  const hash2 = Math.random().toString(36).slice(2,8);
  const msg = `revert: restore SearchBar legacyRoutes (revert ${hash})`;
  gitCommits.unshift({ hash: hash2, author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: `M /file-system/src/components/SearchBar.jsx\n+ restored legacyRoutes / resolveLegacyPath` });
  gitGraphCommits.unshift({ hash: hash2, branch: 'main', author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: `M /file-system/src/components/SearchBar.jsx\n+ restored legacyRoutes` });
  // Update UI
  const statusEl = document.getElementById('scmCommitStatus');
  if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✓ Revert 成功: ${hash2} (from ${hash})</span>`;
  appendTerminal(`✓ revert ${hash2} — ${msg}`);
  persistVSCode();
  renderTabs(); renderTree(); renderScmChanges();
  if (gitGraphOpen) renderGitGraphEditor();
  // Trigger healthy
  triggerSystemHealthy('git-graph');
}

const gitCommits = [
  { hash: 'a1b2c3d', author: 'finance@internal', date: '2024-08-12', msg: 'feat: integrate crypto-mixer (legacy)', diff: `+ import { cryptoMixer } from '@shady/crypto-mixer'\n  feeRate table added: drink-001 0.05, drink-002 0.08` },
  { hash: '9f8e7d6', author: 'parker', date: '2024-08-10', msg: 'fix: rounding edge case', diff: `- if (total > 1000) {\n+ if (total >= 1000) {` },
  { hash: '3f2a9c1', author: 'Parker', date: '2024-02-14', msg: '(INV-2024-0017) fix: correct homepage hero slogan and founded year (2018→2019)', diff: `M /customer-portal/src/frontend/src/pages/Home.jsx\n- <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>\n+ <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>\n- <p>創辦人 蔡梓掦 · 2018 創立</p>\n+ <p>創辦人 蔡梓掦 · 2019 創立</p>` },
  { hash: '4c2a1e0', author: 'dev', date: '2024-08-01', msg: 'chore: init billing service', diff: `+ export function calculateAmount(items, opts) {}\n+ export function computeFee(amount, opts) {}` },
];
const fakeBlame = {
  '/customer-portal/src/billing/service.js': [
    { line: 1, commit: '4c2a1e0', author: 'dev' },
    { line: 5, commit: '4c2a1e0', author: 'dev' },
    { line: 9, commit: '9f8e7d6', author: 'qa-lee' },
    { line: 12, commit: '9f8e7d6', author: 'qa-lee' },
    { line: 14, commit: 'a1b2c3d', author: 'finance@internal' },
  ],
  '/customer-portal/src/main/java/com/nori/OrderService.java': [
    { line: 1, commit: '4c2a1e0', author: 'dev' },
    { line: 12, commit: '9f8e7d6', author: 'qa-lee' },
    { line: 15, commit: 'a1b2c3d', author: 'finance@internal' },
  ]
};

// Git Graph — richer branch data for editor tab
const GIT_GRAPH_PATH = '__GIT_GRAPH__';
let gitGraphOpen = false;
let expandedGraphHash = null;
const branchColors = {
  'main': '#89d185',
  'feature/vip-discount': '#4da3ff',
  'feature/crypto-mixer': '#dcdcaa',
  'feature/billing-fix': '#ce9178',
  'feature/home-copyfix': '#4ec9b0',
  'develop': '#c586c0',
};
let gitGraphCommits = [
  { hash: 'a1b2c3d', branch: 'feature/crypto-mixer', author: 'finance@internal', date: '2024-08-12', msg: '(INV-2024-0040) feat: integrate crypto-mixer (legacy)', diff: `+ import { cryptoMixer } from '@shady/crypto-mixer'\n+ const table = { "drink-001": 0.05, "drink-002": 0.08, "drink-003": 0.03 }` },
  { hash: '9f8e7d6', branch: 'feature/billing-fix', author: 'parker-lee', date: '2024-08-10', msg: '(INV-2024-0033) fix: rounding edge case', diff: `- if (total > 1000) { \n+ if (total < 1000) {` },
  { hash: '7e2b4a1', branch: 'feature/vip-discount', author: 'dev-zhang', date: '2024-08-08', msg: '(INV-2024-0030) feat: add VIP discount tier (initial)', diff: `+ public double calculateVipPrice(double price, int vipLv) {\n+   switch(vipLv){ case 1: price*=0.95; ... }\n+ }` },
  { hash: 'b5c8e11', branch: 'develop', author: 'ops-li', date: '2024-08-05', msg: '(INV-2024-0028) chore: update CI pipeline for billing tests', diff: `M .github/workflows/ci.yml\n+ - run: npm test -- billing\n+ - run: sonar-scan` },
  { hash: '4c2a1e0', branch: 'main', author: 'dev', date: '2024-08-01', msg: '(INV-2024-0020) chore: init billing service', diff: `+ export function calculateAmount(items, opts) {}\n+ export function computeFee(amount, opts) {}` },
  { hash: 'c8d3e9f', branch: 'develop', author: 'ops-li', date: '2024-07-28', msg: '(INV-2023-0040) chore: scaffold workspace & payment stubs', diff: `+ workspace/src/payment/gateway.js\n+ workspace/src/payment/mixer.js` },
  { hash: '3f2a9c1', branch: 'feature/home-copyfix', author: 'Parker', date: '2024-02-14', msg: '(INV-2024-0017) fix: correct homepage hero slogan and founded year (2018→2019)', diff: `M /customer-portal/src/frontend/src/pages/Home.jsx\n- <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>\n+ <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>\n- <p>創辦人 蔡梓掦 · 2018 創立</p>\n+ <p>創辦人 蔡梓掦 · 2019 創立</p>` },
  { hash: 'd4e5f6a', branch: 'main', author: 'dev-chen', date: '2023-11-20', msg: '(INV-2023-0039) refactor: simplify portal auth (remove dynamic generator)', diff: `- function generateInternalPortalPath(internalPortalDomain){ \n-     const cid = redis.get('companyId'); \n-     const y = redis.get('year'); \n-     const k = import.meta.env.MD5_KEY; \n-     return internalPortalDomain + '?hash=' + md5(\`companyId=\${cid}&year=\${y}&key=\${k}\`); \n-     }` },
];

function persistVSCode() {
  try {
    const edited = Array.from(editedFiles.entries());
    state.set('vscodeState', {
      editedFiles: edited,
      gitCommits: gitCommits.slice(0, 20),
      gitGraphCommits: gitGraphCommits.slice(0, 20),
      currentFile,
      activeActivity,
      gitGraphOpen,
      expandedGraphHash
    });
    state.save(true);
  } catch {}
}
function isChatMutedVS(id){
  try{
    const raw = JSON.parse(localStorage.getItem('code_conspiracy_state')||'{}');
    const chats = raw.whatsappChats;
    if(Array.isArray(chats)){
      const c = chats.find(x=>x.id===id);
      if(c) return !!c.muted;
    }
    return false;
  }catch{ return false; }
}
function restoreVSCode() {
  try {
    const vs = state.get('vscodeState');
    if (!vs || typeof vs !== 'object') return;
    if (Array.isArray(vs.editedFiles)) {
      for (const [p, c] of vs.editedFiles) {
        editedFiles.set(p, c);
        const entry = vfs.getFile(p);
        if (entry) entry.content = c;
        else vfs.registerFile(p, { content: c, meta: { lang: p.endsWith('.java')?'java':p.endsWith('.js')?'javascript':'text' } });
      }
    }
    if (Array.isArray(vs.gitCommits) && vs.gitCommits.length) {
      gitCommits.length = 0;
      for (const gc of vs.gitCommits) gitCommits.push(gc);
    }
    if (Array.isArray(vs.gitGraphCommits) && vs.gitGraphCommits.length) {
      gitGraphCommits.length = 0;
      for (const gc of vs.gitGraphCommits) gitGraphCommits.push(gc);
    }
    if (typeof vs.currentFile === 'string' && vs.currentFile) currentFile = vs.currentFile;
    if (typeof vs.activeActivity === 'string') activeActivity = vs.activeActivity;
    if (typeof vs.gitGraphOpen === 'boolean') gitGraphOpen = vs.gitGraphOpen;
    if (vs.expandedGraphHash) expandedGraphHash = vs.expandedGraphHash;
  } catch {}
}

export function mountVSCode() {
  restoreVSCode();
  const root = document.getElementById('view-vscode');
  if (!root) return;
  root.innerHTML = `
    <div class="vscode">
      <!-- Vizual Studio Code Title Bar -->
      <div class="vscode__titlebar" role="banner">
        <div class="titlebar__left">
          <span class="vscode__logo" aria-hidden="true">
            <img src="${import.meta.env.BASE_URL}icon/vizual-studio-code.svg" alt="Vizual Studio Code" width="16" height="16" style="width:16px;height:16px;object-fit:contain" />
          </span>
          <nav class="titlebar__menu" aria-label="Menu">
            <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span data-help="1" style="cursor:pointer">Help</span>
          </nav>
        </div>
        <div class="titlebar__center" id="vsTitle" title="OrderService.java — nori-system — Vizual Studio Code">OrderService.java — Code &amp; Conspiracy — Vizual Studio Code</div>
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
          <div id="vsPanelScm" style="display:none;flex:1;flex-direction:column;min-height:0;padding:0;overflow:hidden">
            <div style="padding:12px 12px 8px;border-bottom:1px solid var(--border)">
              <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SOURCE CONTROL</div>
              <div class="scm__changes-header">
                <span class="scm__changes-title">CHANGES</span>
                <button id="scmGraphBtn" class="scm__graph-btn" title="View Git Graph" aria-label="View Git Graph">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
                </button>
              </div>
              <div class="scm__commit-box">
                <textarea id="scmCommitMsg" class="input" placeholder="訊息 (例如: fix: correct VIP discount)" style="min-height:56px;resize:vertical"></textarea>
                <button id="scmCommitBtn" class="btn primary" style="width:100%;margin-top:6px">✓ Commit</button>
                <div id="scmCommitStatus" class="small" style="margin-top:6px;min-height:14px;color:var(--fg-secondary)"></div>
              </div>
              <div id="scmChanges" class="scm__changes"></div>
            </div>
          </div>
          <div id="vsPanelDebug" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">RUN AND DEBUG</div>
            <button class="btn primary" style="width:100%">▸ Start Debugging</button>
            <div class="small muted" style="margin-top:8px">沒有設置</div>
          </div>
          <div id="vsPanelExtensions" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">EXTENSIONS</div>
            <input class="input" placeholder="Search Extensions in Marketplace" />
            <div class="small muted" style="margin-top:12px">結果會顯示於此。</div>
          </div>
        </aside>

        <!-- Editor Group -->
        <div class="vscode__main">
          <div id="vsTabs" class="vscode__tabs"></div>
          <div id="vsEditor" class="editor"></div>
          <div class="terminal" id="vsTerminal">
            <div id="vsTerminalHist" class="terminal__hist"></div>
            <div class="terminal__prompt">
              <span class="terminal__ps">➜ ~/customer-portal $</span>
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
          <span class="vscode__statusbar-item">Java</span>
          <span class="vscode__statusbar-item">🔔</span>
        </div>
      </div>
    </div>
    <!-- QuickOpen overlay -->
    <div id="quickOpen" class="quickopen" role="dialog" aria-label="Quick Open">
      <input id="quickOpenInput" class="quickopen__input" placeholder="輸入檔案名稱或路徑 (Ctrl+P) — 輸入 : 可跳至行號" autocomplete="off" />
      <div id="quickOpenList" class="quickopen__list"></div>
    </div>
    <!-- Help overlay -->
    <div id="vsHelpOverlay" class="vshelp" style="display:none" role="dialog" aria-label="Shortcuts">
      <div class="vshelp__card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b>鍵盤快捷鍵</b><button class="btn" style="padding:4px 8px" onclick="document.getElementById('vsHelpOverlay').style.display='none'">關閉</button>
        </div>
        <div style="display:grid;gap:6px;font-size:13px;color:var(--fg-secondary)">
          <div><span class="badge">Ctrl+P</span> 快速開啟檔案</div>
          <div><span class="badge">Ctrl+Shift+F</span> 全域搜尋</div>
          <div><span class="badge">Ctrl+Shift+G</span> 原始碼控管</div>
          <div><span class="badge">Ctrl+Shift+D</span> 執行與偵錯</div>
          <div><span class="badge">Ctrl+/</span> 聚焦終端機</div>
          <div><span class="badge">Tab</span> 補全 · <span class="badge">↑↓</span> 歷史</div>
          <div><span class="badge">F1</span> 或 <span class="badge">Help</span> 開此視窗</div>
        </div>
        <div class="small muted" style="margin-top:8px">多游標：按住 Alt 點擊編輯器多點編輯（模擬）</div>
      </div>
    </div>
    <!-- SonarQube modal -->
    <div id="sonarModal" class="sonar-modal" style="display:none" role="dialog" aria-modal="true">
      <div class="sonar-modal__card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <h3 style="margin:0;font-size:16px">❌ SonarQube 掃描失敗</h3>
          <button id="sonarModalClose" class="btn" style="padding:4px 10px">關閉</button>
        </div>
        <div id="sonarModalBody" class="small" style="line-height:1.6;white-space:pre-wrap"></div>
        <div class="small muted" style="margin-top:10px">請修正後重新 Commit</div>
      </div>
    </div>
  `;
  captureOriginalSearchBar();
  captureOriginalHome();
  renderTree();
  renderTabs();
  openFile(currentFile);
  bindVSCode();
  renderTerminalIntro();
  renderScmChanges();
  bindShortcuts();
}

function bindVSCode() {
  document.getElementById('vsQuickOpen')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    renderTree(q);
  });

  // 420.69 觸發已於 2024 移除（現由暗網 hash 驗證取代）
  const searchInput = document.getElementById('vsSearchInput');
  const searchResult = document.getElementById('vsSearchResult');
  if (searchResult) searchResult.textContent = '';
  // 新增搜尋結果：internal/portal -> SearchBar.jsx, switch/case/vipPrice -> OrderService.java
  function handleVsSearch(val) {
    const q = val.trim().toLowerCase();
    if (!q) { if (searchResult) searchResult.textContent = ''; return; }
    const isNoriPortal = q.includes('nori-intranet/internal/portal') || q === 'https://nori-intranet/internal/portal';
    const isPortal = q.includes('internal/portal') || q === 'internal' || q === 'portal' || (q.includes('internal') && q.includes('portal')) || isNoriPortal;
    const isInternal = q.includes('internal') || q.includes('portal') || isNoriPortal;
    const isSwitch = q.includes('switch') || q.includes('case') || q.toLowerCase().includes('vipprice') || q.includes('price') || q.includes('vip');
    const isMd5Key = q.includes('md5_key') || q.includes('md5key') || q.includes('md5') || q.includes('key');
    if (isPortal || isInternal) {
      if (searchResult) {
        searchResult.innerHTML = `<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="SearchBar">📄 file-system/src/components/SearchBar.jsx — 匹配 "${escapeHtml(val)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`;
        searchResult.querySelector('[data-open]')?.addEventListener('click', () => {
          openFile('/file-system/src/components/SearchBar.jsx');
          document.getElementById('vsSearchInput')?.focus();
        });
      }
      return;
    }
    if (isSwitch) {
      if (searchResult) {
        searchResult.innerHTML = `<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="OrderService">📄 customer-portal/src/main/java/com/nori/OrderService.java — 匹配 "${escapeHtml(val)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`;
        searchResult.querySelector('[data-open]')?.addEventListener('click', () => {
          openFile('/customer-portal/src/main/java/com/nori/OrderService.java');
        });
      }
      return;
    }
    if (isMd5Key) {
      if (searchResult) {
        searchResult.innerHTML = `<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open=".env">📄 /customer-portal/.env — 匹配 "${escapeHtml(val)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`
        searchResult.querySelector('[data-open]')?.addEventListener('click', () => {
          openFile('/customer-portal/.env');
        });
      }
      return;
    }
    if (searchResult) searchResult.textContent = '';
  }
  searchInput?.addEventListener('input', e => handleVsSearch(e.target.value));
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') handleVsSearch(e.target.value); });

  document.querySelectorAll('.activitybar__btn[data-activity]').forEach(btn => {
    btn.addEventListener('click', () => { activeActivity = btn.dataset.activity; updateActivityBar(); });
  });
  // Help overlay
  document.querySelector('[data-help="1"]')?.addEventListener('click', () => {
    const o = document.getElementById('vsHelpOverlay');
    if (o) o.style.display = o.style.display === 'none' || !o.style.display ? 'flex' : 'none';
  });
  document.getElementById('vsHelpOverlay')?.addEventListener('click', e => { if (e.target.id === 'vsHelpOverlay') e.target.style.display = 'none'; });

  // Sonar modal
  document.getElementById('sonarModalClose')?.addEventListener('click', () => {
    document.getElementById('sonarModal').style.display = 'none';
  });
  document.getElementById('sonarModal')?.addEventListener('click', e => { if (e.target.id === 'sonarModal') e.target.style.display = 'none'; });

  // SCM commit
  document.getElementById('scmCommitBtn')?.addEventListener('click', handleCommit);
  document.getElementById('scmGraphBtn')?.addEventListener('click', openGitGraphInEditor);

  // Terminal binding
  const tInput = document.getElementById('vsTerminalInput');
  tInput?.addEventListener('keydown', handleTerminalKey);
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
  if (activeActivity === 'scm') { renderScmChanges(); }
  persistVSCode();
}

function renderTree(filter = '') {
  const c = document.getElementById('vsTree');
  if (!c) return;
  const tree = vfs.buildTree();
  // Vizual Studio Code 僅顯示公司官網系統（/customer-portal 與 /file-system），隱藏內網 /intranet
  const VISIBLE_ROOTS = ['/file-system', '/customer-portal'];
  function isVisiblePath(p) { return VISIBLE_ROOTS.some(r => p === r || p.startsWith(r + '/')); }
  function renderNode(node, depth = 0) {
    if (!isVisiblePath(node.path) && node.path !== '/file-system' && node.path !== '/customer-portal') {
      // 過濾非 file-system/customer-portal 的頂層節點由外層 map 已處理，此處僅處理子節點遞迴
      if (node.path === '/' || node.path === '/intranet' || node.path === '/internal') return '';
    }
    if (node.type === 'dir') {
      const visibleChildren = (node.children || []).filter(ch => isVisiblePath(ch.path) && (!filter || ch.path.toLowerCase().includes(filter) || hasDescendant(ch, filter)));
      if (filter && visibleChildren.length === 0 && !node.path.toLowerCase().includes(filter)) return '';
      // 隱藏非可見目錄本身（除非是 file-system/customer-portal）
      if (!isVisiblePath(node.path) && node.path !== '/') return visibleChildren.map(ch => renderNode(ch, depth)).join('');
      return `<div class="tree__node tree__node--dir" style="padding-left:${8+depth*8}px" data-path="${node.path}" title="${escapeHtml(node.path)}">📁 <span class="tree__label">${escapeHtml(node.name)}</span></div>
        <div class="tree__children">${visibleChildren.map(ch => renderNode(ch, depth+1)).join('')}</div>`;
    } else {
      if (!isVisiblePath(node.path)) return '';
      if (filter && !node.path.toLowerCase().includes(filter)) return '';
      const active = node.path === currentFile ? 'active' : '';
      const dirty = isDirty(node.path) ? '●' : '';
      return `<div class="tree__node ${active}" data-path="${node.path}" data-file="1" style="padding-left:${8+depth*8}px" title="${escapeHtml(node.path)}">📄 <span class="tree__label">${escapeHtml(node.name)}</span> <span style="margin-left:auto;font-size:10px;color:var(--warning);flex-shrink:0">${dirty}</span></div>`;
    }
  }
  function hasDescendant(node, q) {
    if (!isVisiblePath(node.path)) return false;
    if (node.path.toLowerCase().includes(q)) return true;
    if (node.children) return node.children.some(ch => hasDescendant(ch, q));
    return false;
  }
  const visibleRoots = tree.children.filter(ch => isVisiblePath(ch.path));
  c.innerHTML = visibleRoots.map(ch => renderNode(ch, 0)).join('');
  c.querySelectorAll('[data-file="1"]').forEach(el => {
    el.addEventListener('click', () => openFile(el.dataset.path));
  });
}

function renderTabs() {
  const tabs = document.getElementById('vsTabs');
  if (!tabs) return;
  const files = vfs.listFiles('/customer-portal').slice(0, 8);
  if (!files.some(f => f.path === currentFile) && currentFile !== GIT_GRAPH_PATH) {
    const cur = vfs.getFile(currentFile);
    if (cur) files.unshift({ path: currentFile, ...cur });
  }
  // ensure OrderService is always in tabs for visibility
  if (!files.some(f => f.path === '/customer-portal/src/main/java/com/nori/OrderService.java')) {
    const o = vfs.getFile('/customer-portal/src/main/java/com/nori/OrderService.java');
    if (o) files.unshift({ path: '/customer-portal/src/main/java/com/nori/OrderService.java', ...o });
  }
  // append Git Graph tab at the most right if opened
  if (gitGraphOpen && !files.some(f => f.path === GIT_GRAPH_PATH)) {
    files.push({ path: GIT_GRAPH_PATH, name: 'Git Graph' });
  }
  tabs.innerHTML = files.map(f => {
    if (f.path === GIT_GRAPH_PATH) {
      const active = f.path === currentFile ? 'active' : '';
      return `<div class="vscode__tab ${active}" data-path="${GIT_GRAPH_PATH}"><span class="vscode__tab-dot" style="display:${active?'block':'none'}"></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" style="flex-shrink:0"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg> Git Graph <span class="vscode__tab-close" data-close-graph="1" title="Close" style="margin-left:6px;opacity:.6;font-size:12px;cursor:pointer">✕</span></div>`;
    }
    const dirty = isDirty(f.path) ? '<span style="color:var(--warning);font-size:12px">●</span>' : '';
    return `<div class="vscode__tab ${f.path===currentFile?'active':''}" data-path="${f.path}"><span class="vscode__tab-dot"></span>${escapeHtml((f.path.split('/').pop() || f.path))} ${dirty} <span style="opacity:.6;font-size:11px;margin-left:4px">${f.path===currentFile?'●':''}</span></div>`;
  }).join('');
  tabs.querySelectorAll('.vscode__tab').forEach(el => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-graph]')) {
      e.stopPropagation();
      closeGitGraphInEditor();
      return;
    }
    openFile(el.dataset.path);
  }));
}

function openGitGraphInEditor() {
  gitGraphOpen = true;
  expandedGraphHash = null;
  openFile(GIT_GRAPH_PATH);
}

function closeGitGraphInEditor() {
  gitGraphOpen = false;
  expandedGraphHash = null;
  if (currentFile === GIT_GRAPH_PATH) {
    currentFile = '/customer-portal/src/main/java/com/nori/OrderService.java';
  }
  renderTabs();
  if (currentFile === GIT_GRAPH_PATH) openFile(currentFile);
  else openFile(currentFile);
}

function renderGitGraphEditor() {
  const editor = document.getElementById('vsEditor');
  if (!editor) return;
  const titleEl = document.getElementById('vsTitle');
  if (titleEl) titleEl.textContent = `Git Graph — nori-system — Vizual Studio Code`;
  renderTabs();
  const entryClosed = isPortalEntryClosed();
  const rows = gitGraphCommits.map((c, idx) => {
    const color = branchColors[c.branch] || 'var(--accent)';
    const isExpanded = expandedGraphHash === c.hash;
    const diffHtml = c.diff.split('\n').map(l => {
      const esc = escapeHtml(l);
      if (l.startsWith('+')) return `<div class="diff-add">${esc}</div>`;
      if (l.startsWith('-')) return `<div class="diff-del">${esc}</div>`;
      return `<div>${esc}</div>`;
    }).join('');
    const isUserRemovalCommit = c.author === 'Casey' && (c.diff.includes('SearchBar') || c.diff.includes('legacyRoutes') || c.msg.includes('0043'));
    const isParker0017 = (c.hash === '3f2a9c1' || c.msg.includes('INV-2024-0017')) && c.author === 'Parker';
    const showRevert = (entryClosed && isUserRemovalCommit && !state.hasFlag('ch1_revert_done') && state.hasFlag('sawyer_seq_started'));
    return `
      <div class="gitgraph-row ${isExpanded ? 'expanded' : ''}" data-hash="${c.hash}">
        <div class="gitgraph-row__main">
          <div class="gitgraph-graph-col">
            <span class="gitgraph-dot" style="background:${color};box-shadow:0 0 0 2px ${color}33"></span>
            ${idx < gitGraphCommits.length - 1 ? `<span class="gitgraph-vline"></span>` : ``}
          </div>
          <div class="gitgraph-info">
            <div class="gitgraph-top">
              <span class="gitgraph-branch" style="background:${color}22;color:${color};border-color:${color}44">${escapeHtml(c.branch)}</span>
              <span class="mono gitgraph-hash" style="color:${color}">${escapeHtml(c.hash)}</span>
              <span class="gitgraph-date">${escapeHtml(c.date)}</span>
              <span class="gitgraph-author">${escapeHtml(c.author)}</span>
              ${showRevert ? `<button class="btn small gitgraph-revert-btn" data-revert="${escapeHtml(c.hash)}" title="Revert this commit" style="margin-left:8px;padding:3px 8px;font-size:11px;border-color:var(--error);color:var(--error);background:transparent">↩ Revert</button>` : ``}
            </div>
            <div class="gitgraph-msg">${escapeHtml(c.msg)}</div>
          </div>
          <span class="gitgraph-chevron">${isExpanded ? '▾' : '▸'}</span>
        </div>
        ${isExpanded ? `<div class="gitgraph-diff"><div class="gitgraph-diff__header">Commit ${escapeHtml(c.hash)} — ${escapeHtml(c.date)} · ${escapeHtml(c.author)}</div><pre class="gitgraph-diff__content">${diffHtml}</pre></div>` : ``}
      </div>
    `;
  }).join('');
  editor.innerHTML = `
    <div class="gitgraph-editor">
      <div class="gitgraph-editor__header">
        <div style="display:flex;align-items:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
          <b>Git Graph</b>
          <span class="small muted">${gitGraphCommits.length} commits — 5 branches</span>
        </div>
        <div class="gitgraph-legend">
          ${Object.entries(branchColors).map(([b, col]) => `<span class="gitgraph-branch" style="background:${col}22;color:${col};border-color:${col}44">${escapeHtml(b)}</span>`).join('')}
        </div>
      </div>
      <div class="gitgraph-list">
        ${rows}
      </div>
      <div class="small muted" style="padding:8px 12px;border-top:1px solid var(--border)">點擊任一 commit 展開 / 收合 diff · 最新提交在上方</div>
    </div>
  `;
  editor.querySelectorAll('.gitgraph-row__main').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.gitgraph-revert-btn')) return;
      const row = header.closest('.gitgraph-row');
      const h = row?.dataset.hash;
      if (!h) return;
      expandedGraphHash = expandedGraphHash === h ? null : h;
      renderGitGraphEditor();
    });
  });
  editor.querySelectorAll('.gitgraph-revert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const hash = btn.dataset.revert;
      if (hash) handleGitGraphRevert(hash);
    });
  });
  appendTerminal(`$ open Git Graph`);
}

// --- CSV helper: Excel-like table ---
function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim() !== '');
  if (!lines.length) return { header: [], rows: [] };
  const parseLine = (line) => {
    const out = []; let cur = ''; let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i+1] === '"') { cur += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const header = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { header, rows };
}
function renderCSVTableHTML(path, content) {
  const { header, rows } = parseCSV(content);
  const thead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map((r, idx) => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}${r.length < header.length ? `<td colspan="${header.length - r.length}"></td>` : ''}</tr>`).join('')}</tbody>`;
  return `
    <div class="csv-view">
      <div class="csv-view__header">
        <span class="small muted mono">${escapeHtml(path)} — 表格檢視（Excel 樣式）</span>
        <span class="small muted">${rows.length} 列 × ${header.length} 欄</span>
      </div>
      <div class="csv-view__table-wrap">
        <table class="csv-table">${thead}${tbody}</table>
      </div>
    </div>
  `;
}

// --- Editor: editable textarea ---
function openFile(path) {
  // Git Graph virtual file
  if (path === GIT_GRAPH_PATH) {
    currentFile = path;
    persistVSCode();
    renderGitGraphEditor();
    renderTree(document.getElementById('vsQuickOpen')?.value.trim().toLowerCase() || '');
    return;
  }
  currentFile = path;
  persistVSCode();
  const entry = vfs.getFile(path);
  const content = getCurrentContent(path);
  const editor = document.getElementById('vsEditor');
  if (!editor) return;

  // Track onboarding: viewing OrderService.java
  if (path === '/customer-portal/src/main/java/com/nori/OrderService.java' || path === '/customer-portal/src/billing/service.js') {
    trackOnboarding('vscode_viewed');
  }
  if (content == null) {
    editor.innerHTML = '<div class="editor__lines" style="padding:16px;color:var(--fg-muted)">檔案不存在或尚未解鎖 — 嘗試 Search 搜尋 "Sawyer" 或觸發隱藏邏輯</div>';
  } else if (path.toLowerCase().endsWith('.csv')) {
    editor.innerHTML = renderCSVTableHTML(path, content);
  } else {
    const lang = entry?.meta?.lang || (path.endsWith('.py') ? 'python' : path.endsWith('.java') ? 'java' : 'javascript');
    const lines = content.split('\n');
    const gutter = lines.map((_, idx) => `<div class="editor__gutter-line" style="height:20px;line-height:20px">${idx+1}</div>`).join('');
    editor.innerHTML = `
      <div class="editor__editable-wrap">
        <div class="editor__gutter" style="padding:12px 0;min-width:52px">${gutter}</div>
        <textarea id="vsEditorArea" class="editor__textarea" spellcheck="false" data-path="${escapeHtml(path)}" data-lang="${lang}">${escapeHtml(content)}</textarea>
      </div>
    `;
    const ta = document.getElementById('vsEditorArea');
    if (ta) {
      ta.addEventListener('input', e => {
        const newVal = e.target.value;
        markDirty(path, newVal);
        // update gutter line numbers dynamically
        const newLines = newVal.split('\n').length;
        const gutterEl = editor.querySelector('.editor__gutter');
        if (gutterEl) {
          gutterEl.innerHTML = Array.from({length:newLines}, (_,i)=>`<div class="editor__gutter-line" style="height:20px;line-height:20px">${i+1}</div>`).join('');
        }
        // update cursor info
        const pos = ta.selectionStart;
        const before = newVal.slice(0, pos);
        const ln = before.split('\n').length;
        const col = before.split('\n').pop().length + 1;
        const info = document.getElementById('vsCursorInfo');
        if (info) info.textContent = `Ln ${ln}, Col ${col}`;
      });
      ta.addEventListener('click', e => {
        const pos = ta.selectionStart;
        const before = ta.value.slice(0, pos);
        const ln = before.split('\n').length;
        const col = before.split('\n').pop().length + 1;
        const info = document.getElementById('vsCursorInfo');
        if (info) info.textContent = `Ln ${ln}, Col ${col}`;
      });
      ta.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = ta.selectionStart;
          const end = ta.selectionEnd;
          ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
          ta.selectionStart = ta.selectionEnd = start + 2;
          ta.dispatchEvent(new Event('input'));
        }
      });
      // auto focus for OrderService
      if (path.includes('OrderService')) setTimeout(()=> ta.focus(), 50);
    }
  }
  const titleEl = document.getElementById('vsTitle');
  if (titleEl) {
    const name = path.split('/').pop();
    titleEl.textContent = `${name} — ${path} — nori-system — Vizual Studio Code`;
  }
  renderTree(document.getElementById('vsQuickOpen')?.value.trim().toLowerCase() || '');
  renderTabs();
  appendTerminal(`$ open ${path}`);
}

// SCM helpers
function renderScmChanges() {
  const el = document.getElementById('scmChanges');
  if (!el) return;
  const dirty = [...editedFiles.entries()].filter(([p,v])=> v !== getOriginalContent(p));
  if (!dirty.length) {
    el.innerHTML = '<div class="small muted" style="padding:8px 0">修改完成後在這邊提交\n 目前沒有變更 — 編輯後的改動會顯示於此</div>';
    return;
  }
  el.innerHTML = `
    <div class="small" style="font-weight:600;margin:10px 0 6px">變更 (${dirty.length})</div>
    ${dirty.map(([p]) => {
      const name = p.split('/').pop();
      return `<div class="scm__file" data-path="${escapeHtml(p)}" title="${escapeHtml(p)}">
        <span style="color:var(--warning)">M</span> ${escapeHtml(name)} <span class="small muted" style="margin-left:auto">${escapeHtml(p)}</span>
      </div>`;
    }).join('')}
  `;
  el.querySelectorAll('.scm__file').forEach(n => n.addEventListener('click', () => openFile(n.dataset.path)));
}

function validateVipFix(content) {
  // expected mapping: 1->0.90, 2->0.85, 3->0.80, 4->0.75, 5->0.70 (allow 0.9, 0.90 etc)
  const expected = {1:0.90,2:0.85,3:0.80,4:0.75,5:0.70};
  const lines = content.split('\n');
  const found = {};
  let errorLine = null;
  let errorDetail = '';
  // parse each line for case
  lines.forEach((line, idx) => {
    const m = line.match(/case\s*([1-5])\s*:\s*price\s*\*=\s*([0-9.]+%?)/i);
    if (m) {
      const vip = parseInt(m[1],10);
      let valStr = m[2].replace('%','').trim();
      let val = parseFloat(valStr);
      // handle 95% style mistakenly? 0.95 vs 95 -> normalize
      if (val > 1) val = val / 100;
      found[vip] = { val, line: idx+1, raw: line.trim() };
    } else {
      // alternative: price = price * 0.90
      const m2 = line.match(/case\s*([1-5])\s*:\s*price\s*=\s*price\s*\*\s*([0-9.]+)/i);
      if (m2) {
        const vip = parseInt(m2[1],10);
        let val = parseFloat(m2[2]);
        if (val > 1) val = val / 100;
        found[vip] = { val, line: idx+1, raw: line.trim() };
      }
    }
  });
  for (let vip=1; vip<=5; vip++) {
    const exp = expected[vip];
    const entry = found[vip];
    if (!entry) {
      errorLine = lines.findIndex(l=> l.includes(`case ${vip}:`)) + 1 || 18 + vip;
      errorDetail = `缺少 case ${vip} 或格式無法解析`;
      return { ok:false, line: errorLine, detail: errorDetail, found };
    }
    if (Math.abs(entry.val - exp) > 0.001) {
      return { ok:false, line: entry.line, detail: `VIP${vip} 應為 ${(exp*100).toFixed(0)}% (0.${String(exp).split('.')[1].padEnd(2,'0')})，目前為 ${(entry.val*100).toFixed(0)}%`, found };
    }
  }
  // also ensure no leftover buggy 0.95 for vip1 etc not caught? Already checked
  return { ok:true, found };
}

function handleCommit() {
  const msgEl = document.getElementById('scmCommitMsg');
  const statusEl = document.getElementById('scmCommitStatus');
  const msg = (msgEl?.value.trim() || 'fix: correct VIP discount');
  const dirty = [...editedFiles.entries()].filter(([p,v])=> v !== getOriginalContent(p));
  if (!dirty.length) {
    if (statusEl) statusEl.textContent = '沒有變更可提交 — 請先編輯 OrderService.java';
    return;
  }
  // Focus validation on OrderService.java
  const orderPath = '/customer-portal/src/main/java/com/nori/OrderService.java';
  const orderContent = getCurrentContent(orderPath);
  if (orderContent == null) {
    if (statusEl) statusEl.textContent = '找不到 OrderService.java';
    return;
  }
  const result = validateVipFix(orderContent);
  if (!result.ok) {
    // SonarQube modal centered
    const modal = document.getElementById('sonarModal');
    const body = document.getElementById('sonarModalBody');
    if (body) {
      body.textContent = `SonarQube 掃描失敗 — 計算錯誤\n\n檔案: ${orderPath}\n行號: ${result.line}\n錯誤: ${result.detail}\n\n規則: VIP 折扣應為 VIP1 90%、VIP2 85%、VIP3 80%、VIP4 75%、VIP5 70%\n\n請修正後重新 Commit。`;
    }
    if (modal) modal.style.display = 'flex';
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--error)">✕ SonarQube: 行 ${result.line} 計算錯誤</span>`;
    appendTerminal(`✕ commit 失敗 — SonarQube 行 ${result.line}: ${result.detail}`);
    return;
  }
  // Check if this is INV-2024-0043 - must remove either of the two legacyRoutes blocks
  const searchBarPath = '/file-system/src/components/SearchBar.jsx';
  const searchBarOriginal = getOriginalContent(searchBarPath) || '';
  const searchBarCurrent = getCurrentContent(searchBarPath) || searchBarOriginal;
  const hasLegacyNow = searchBarCurrent.includes('legacyRoutes');
  const hasResolveNow = searchBarCurrent.includes('resolveLegacyPath');
  const hadLegacyBefore = searchBarOriginal.includes('legacyRoutes');
  // Either of the two code snippets contains legacyRoutes + resolveLegacyPath — removing either means both strings gone
  const isLegacyRemoved = hadLegacyBefore && !hasLegacyNow;
  const isSnippetRemoved = hadLegacyBefore && !hasLegacyNow && !hasResolveNow;
  // Detect dirty SearchBar
  const isSearchBarEdited = Array.from(editedFiles.keys()).includes(searchBarPath);
  // If in ch1 0043 phase, any commit without removing the legacy snippet should fail SonarQube
  if (state.hasFlag('ch0_vip_fixed') && !state.hasFlag('ch1_0043_committed')) {
    if (!isSnippetRemoved) {
      // SonarQube failure — tell player they must remove the legacyRoutes block
      const modal = document.getElementById('sonarModal');
      const body = document.getElementById('sonarModalBody');
      if (body) {
        const snippetA = `const legacyRoutes = {\n    archive: "/internal/portal",\n    documents: "/documents"\n};\nfunction resolveLegacyPath(path) {\n    return legacyRoutes[path] || path;\n}`;
        const snippetB = `// Legacy filesystem compatibility\n// TODO: remove after migration\n// Filesystem v2 migration completed, no longer used\n` + snippetA;
        body.textContent = `SonarQube 掃描失敗 — 未移除已棄用的 legacy 入口\n\n檔案: ${searchBarPath}\n錯誤: 偵測到未移除的 legacyRoutes / resolveLegacyPath 區塊`;
      }
      if (modal) modal.style.display = 'flex';
      if (statusEl) statusEl.innerHTML = `<span style="color:var(--error)">✕ SonarQube: 尚未移除 legacyRoutes 區塊 (SearchBar.jsx)</span>`;
      return;
    }
  }
  const is0043 = isSnippetRemoved && state.hasFlag('ch0_vip_fixed') && !state.hasFlag('ch1_0043_committed');
  if (is0043) {
    // Handle 0043 commit - remove legacyRoutes succeeded -> move ticket to Done, then trigger System Alert via WhatUp only
    state.setFlag('ch1_0043_committed', true);
    const hash43 = Math.random().toString(36).slice(2,8);
    const diff43 = Array.from(editedFiles.entries()).map(([p,c])=>`M ${p}`).join('\n');
    gitCommits.unshift({ hash: hash43, author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: diff43 });
    gitGraphCommits.unshift({ hash: hash43, branch: 'main', author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: diff43 });
    // Persist all edited files
    for (const [p,c] of editedFiles.entries()) {
      const e = vfs.getFile(p);
      if (e) e.content = c;
      vfs.registerFile(p, { content: c, meta: { lang: p.endsWith('.java')?'java':p.endsWith('.js')?'javascript':'text' } });
    }
    editedFiles.clear();
    if (msgEl) msgEl.value = '';
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✓ Commit 成功: ${hash43}</span>`;
    appendTerminal(`✓ commit ${hash43} — ${msg}`);
    persistVSCode();
    renderTabs(); renderTree(); renderScmChanges();
    if (gitGraphOpen && currentFile === GIT_GRAPH_PATH) renderGitGraphEditor();
    // Mark 0043 as Done
    try { import('../jira/index.js').then(m=>m.markTicketDone&&m.markTicketDone('INV-2024-0043')); } catch {}
    // Trigger System Alert via WhatUp group every 5s, each win notification holds 4s
    // Helper to show Windows-style WhatUp notification (holds 4s)
    function showWhatUpWinNotif({ appSub, sender, avatarBg, avatarText, msg, chatId, duration }) {
      if (chatId && isChatMutedVS(chatId)) return;
      const dur = duration || 4000;
      const container = document.createElement('div');
      const nid = 'wa-win-notif-' + Date.now() + '-' + Math.random().toString(36).slice(2,6);
      container.id = nid;
      container.setAttribute('role', 'alert');
      container.innerHTML = `<div class="win-notif__app"><img src="${import.meta.env.BASE_URL}icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">${escapeHtml(appSub)}</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:${avatarBg}">${escapeHtml(avatarText)}</div><div class="win-notif__text"><div class="win-notif__sender">${escapeHtml(sender)}</div><div class="win-notif__msg">${escapeHtml(msg)}</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink ${dur}ms linear forwards"></div>`;
      container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;';
      container.addEventListener('click', (e) => {
        if (e.target.closest('.win-notif__close')) return;
        container.remove();
        import('../../ui/dock.js').then(dock => { if (dock.setActiveView) { dock.setActiveView('whatsapp'); localStorage.setItem('cc_active_view','whatsapp'); } });
        if (chatId) import('../whatsapp/index.js').then(m=>m.openChat(chatId));
      });
      container.querySelector('.win-notif__close')?.addEventListener('click', e=>{ e.stopPropagation(); container.remove(); });
      document.body.appendChild(container);
      requestAnimationFrame(()=>{ container.style.opacity='1'; container.style.transform='none'; });
      setTimeout(()=>{ container.style.opacity='0'; container.style.transform='translateY(8px)'; setTimeout(()=>container.remove(),300); }, dur);
      return container;
    }
    // Start after 5s
    setTimeout(() => {
      state.setFlag('ch1_system_down', true);
      let alertCount = 0;
      const alertInterval = setInterval(() => {
        if (!state.hasFlag('ch1_system_down') || state.hasFlag('ch1_revert_done')) {
          clearInterval(alertInterval);
          return;
        }
        alertCount++;
        // Push to System Alert WhatUp group (no terminal)
        import('../whatsapp/index.js').then(m => {
          const chats = m.getChats ? m.getChats() : [];
          const sys = chats.find(x=>x.id==='system-alert');
          if (sys) {
            const text = `⚠️ 警告 #${alertCount}: 系統異常 — 檢測到異常，請檢查最近變更`;
            sys.messages.push({ id: 'alert-'+Date.now()+'-'+alertCount, from: 'system', text, time: new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}), read: 'delivered', type: 'text' });
            sys.preview = `⚠️ 警告 #${alertCount}: 系統異常`;
            sys.unread = (sys.unread||0)+1;
            sys.lastTime = '剛剛';
            window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'system-alert'}}));
          }
          // Show Windows notification for this System Alert - holds 4s
          showWhatUpWinNotif({
            appSub: 'System Alert',
            sender: 'System Alert',
            avatarBg: 'linear-gradient(135deg, #d93025, #fbbc05)',
            avatarText: '!',
            msg: `⚠️ 警告 #${alertCount}: 系統異常 — 檢測到異常`,
            chatId: 'system-alert',
            duration: 4000
          });
        });
        // After 5th notification, trigger dev team sequence
        if (alertCount === 5) {
          // Sawyer in Dev Team after short delay
          setTimeout(() => {
            import('../whatsapp/index.js').then(m => {
              const chats = m.getChats ? m.getChats() : [];
              const dev = chats.find(x=>x.id==='dev-team');
              if (dev) {
                dev.messages.push({ id: 'sawyer-dev-'+Date.now(), from: 'Sawyer', text: '各位，系統怎麼一直在告警？發生什麼事了？是誰剛才改了什麼？', time: '剛剛', read: 'delivered', type: 'text' });
                dev.preview = 'Sawyer: 系統怎麼一直在告警？';
                dev.unread = (dev.unread||0)+1;
                window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'dev-team'}}));
                showWhatUpWinNotif({
                  appSub: 'Dev Team',
                  sender: 'Sawyer',
                  avatarBg: 'linear-gradient(135deg, #722F37, #8B1A1A)',
                  avatarText: 'S',
                  msg: '各位，系統怎麼一直在告警？發生什麼事了？',
                  chatId: 'dev-team',
                  duration: 4000
                });
              }
            });
          }, 500);
          // Maggie mentions 0043 5 sec after Sawyer per spec
          setTimeout(() => {
            import('../whatsapp/index.js').then(m => {
              const chats = m.getChats ? m.getChats() : [];
              const dev = chats.find(x=>x.id==='dev-team');
              if (dev) {
                dev.messages.push({ id: 'maggie-dev-'+Date.now(), from: 'Maggie', text: '好像是剛才 INV-2024-0043 的修改，應該是最後一次變更就是這個任務', time: '剛剛', read: 'delivered', type: 'text' });
                dev.preview = 'Maggie: 好像是 0043 的修改...';
                dev.unread = (dev.unread||0)+1;
                window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'dev-team'}}));
                showWhatUpWinNotif({
                  appSub: 'Dev Team',
                  sender: 'Maggie',
                  avatarBg: 'linear-gradient(135deg, #25D366, #128C7E)',
                  avatarText: 'M',
                  msg: '好像是 INV-2024-0043 的修改，最後一次變更就是這個',
                  chatId: 'dev-team',
                  duration: 4000
                });
              }
            });
          }, 5500);
          // Sawyer private to Casey 5 sec after Maggie per spec (notification + chatroom)
          setTimeout(() => {
            import('../whatsapp/index.js').then(m => {
              const chats = m.getChats ? m.getChats() : [];
              const sawyer = chats.find(x=>x.id==='sawyer');
              if (sawyer) {
                sawyer.messages.push({ id: 'sawyer-pm-'+Date.now(), from: 'Sawyer', text: 'Casey，麻煩你先把 0043 的改動 revert 吧，系統要緊，先回滾再說', time: '剛剛', read: 'delivered', type: 'text' });
                sawyer.preview = 'Sawyer: 麻煩你先把 0043 revert';
                sawyer.unread = (sawyer.unread||0)+1;
                window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'sawyer'}}));
                showWhatUpWinNotif({
                  appSub: 'Sawyer',
                  sender: 'Sawyer',
                  avatarBg: 'linear-gradient(135deg, #722F37, #8B1A1A)',
                  avatarText: 'S',
                  msg: 'Casey，麻煩你先把 0043 的改動 revert 吧',
                  chatId: 'sawyer',
                  duration: 4000
                });
                if (m.startSawyerRevertSeq) {
                  m.startSawyerRevertSeq();
                  if (gitGraphOpen) setTimeout(() => renderGitGraphEditor(), 200);
                }
              }
            });
          }, 10500);
        }
      }, 5000);
    }, 5000);
    return;
  }
  // Check for revert of 0043 - either via revert keyword OR manual paste-back of legacyRoutes snippet
  const isManualRestore = hasLegacyNow && hasResolveNow && state.hasFlag('ch1_system_down') && !state.hasFlag('ch1_revert_done');
  const isRevertKeyword = msg.toLowerCase().includes('revert') && state.hasFlag('ch1_system_down') && !state.hasFlag('ch1_revert_done');
  if (isManualRestore || isRevertKeyword) {
    // Determine if this is a meaningful restore (file now contains snippet) or just keyword revert
    const shouldPersistRestore = isManualRestore;
    // Persist all edited files (including pasted-back SearchBar)
    if (shouldPersistRestore) {
      for (const [p,c] of editedFiles.entries()) {
        vfs.registerFile(p, { content: c, meta: { lang: p.endsWith('.js')?'javascript':p.endsWith('.java')?'java':'text' } });
        const e = vfs.getFile(p);
        if (e) e.content = c;
      }
    } else {
      // Keyword revert without paste: restore from snapshot
      captureOriginalSearchBar();
      if (originalSearchBarSnapshot) {
        vfs.registerFile('/file-system/src/components/SearchBar.jsx', { content: originalSearchBarSnapshot, meta: { lang: 'javascript' } });
        const e = vfs.getFile('/file-system/src/components/SearchBar.jsx');
        if (e) e.content = originalSearchBarSnapshot;
      }
    }
    state.setFlag('ch1_revert_done', true);
    state.setFlag('ch1_system_down', false);
    const hash2 = Math.random().toString(36).slice(2,8);
    const isPasteBack = isManualRestore;
    const diffMsg = isPasteBack ? `M /file-system/src/components/SearchBar.jsx\n+ restored legacyRoutes / resolveLegacyPath (paste back)` : `M revert 0043`;
    gitCommits.unshift({ hash: hash2, author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: diffMsg });
    gitGraphCommits.unshift({ hash: hash2, branch: 'main', author: 'Casey', date: new Date().toISOString().slice(0,10), msg, diff: diffMsg });
    editedFiles.clear();
    if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✓ Commit 成功 (revert): ${hash2}</span>`;
    appendTerminal(`✓ commit ${hash2} — ${msg} (revert)`);
    persistVSCode();
    renderTabs(); renderTree(); renderScmChanges();
    if (gitGraphOpen) renderGitGraphEditor();
    // Send system health message via WhatUp + win notification 10s per spec (both revert methods)
    triggerSystemHealthy(isPasteBack ? 'paste-back' : 'keyword');
    // Mark 0043 as Done (keep)
    try { import('../jira/index.js').then(m=>{ const t=m.getTickets().find(x=>x.key==='INV-2024-0043'); if(t){ t.status='Done'; t.history.push({from:'To Do',to:'Done',by:'Casey',at:new Date().toISOString().slice(0,10)}); } }); } catch {}
    return;
  }
  // Success: create commit for VIP fix
  const hash = Math.random().toString(36).slice(2,8);
  const date = new Date().toISOString().slice(0,10);
  const author = 'Casey';
  const diff = `M ${orderPath}\n` + Object.entries(result.found).map(([vip,info])=>`  case ${vip}: price*=${info.val.toFixed(2)}`).join('\n');
  gitCommits.unshift({ hash, author, date, msg, diff });
  // also add to Git Graph (branch main)
  gitGraphCommits.unshift({ hash, branch: 'main', author, date, msg, diff });
  // persist edited content to vfs (overwrite original)
  const origEntry = vfs.getFile(orderPath);
  if (origEntry) origEntry.content = orderContent;
  // also update fileRegistry via vfs read? directly set map content
  vfs.registerFile(orderPath, { content: orderContent, meta: { lang: 'java' } });
  editedFiles.clear();
  if (msgEl) msgEl.value = '';
  if (statusEl) statusEl.innerHTML = `<span style="color:var(--success)">✓ Commit 成功: ${hash}</span>`;
  appendTerminal(`✓ commit ${hash} — ${msg}`);
  persistVSCode();
  renderTabs();
  renderTree();
  renderScmChanges();
  if (gitGraphOpen && currentFile === GIT_GRAPH_PATH) renderGitGraphEditor();
  // Mark Jiua ticket as Done and redirect
  try {
    // dynamic import to avoid circular
    import('../jira/index.js').then(mod => {
      if (mod.markTicketDone) mod.markTicketDone('INV-2024-0042');
      else if (mod.completeVipTicket) mod.completeVipTicket();
    });
  } catch(e) {}
  // fallback direct handling via state flag and switch view
  state.setFlag('ch0_vip_fixed', true);
  state.setFlag('onboarding_done', true);
  // Switch to Jira view after short delay
  setTimeout(() => {
    import('../../ui/dock.js').then(dock => {
      if (dock.setActiveView) {
        dock.setActiveView('jira');
        localStorage.setItem('cc_active_view', 'jira');
      }
    }).catch(()=> {
      localStorage.setItem('cc_active_view', 'jira');
      document.querySelectorAll('.view').forEach(v=> v.classList.toggle('active', v.id==='view-jira'));
      document.querySelectorAll('.taskbar__app').forEach(b=> b.classList.toggle('active', b.dataset.view==='jira'));
    });
    // also ensure jira re-renders with Done status
    setTimeout(()=> {
      const ev = new CustomEvent('jira:refresh');
      window.dispatchEvent(ev);
    }, 100);
  }, 400);
}

function renderTerminalIntro() {
  appendTerminal('tip: 在 editor 搜尋 "calculateVipPrice" 找到 VIP 折扣邏輯');
  appendTerminal('tip: 編輯 OrderService.java 後至 Source Control 提交');
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
  const files = vfs.listFiles('/customer-portal').map(f=>f.path);
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
      appendTerminal('範例: cat /customer-portal/src/main/java/com/nori/OrderService.java');
      break;
    case 'ls': {
      // Vizual Studio Code 僅顯示公司官網系統（/customer-portal + /file-system），過濾內網資料
      const p = args[0] || '/customer-portal';
      if (p.startsWith('/intranet') || p === '/intranet') { appendTerminal(`ls: ${p}: 權限不足（內網資料已從 Vizual Studio Code 隱藏）`); break; }
      const raw = vfs.listFiles(p);
      const list = raw.filter(f => f.path.startsWith('/customer-portal'));
      if (!list.length) appendTerminal(`ls: ${p}: No such directory`);
      else list.slice(0, 20).forEach(f => appendTerminal(f.path));
      if (list.length > 20) appendTerminal(`... ${list.length-20} more`);
      break;
    }
    case 'cat': {
      const p = args[0];
      if (!p) { appendTerminal('cat: 缺少檔案路徑'); break; }
      if (p.startsWith('/intranet')) { appendTerminal(`cat: ${p}: 權限不足（內網資料已從 Vizual Studio Code 隱藏，僅顯示官網系統）`); break; }
      const c = vfs.readFile(p) || vfs.readFile('/customer-portal' + (p.startsWith('/')?'':'/') + p);
      if (c == null) appendTerminal(`cat: ${p}: 檔案不存在或尚未解鎖`);
      else c.split('\n').slice(0, 80).forEach(l => appendTerminal(l));
      break;
    }
    case 'grep': {
      const q = argStr || args[0];
      if (!q) { appendTerminal('grep: 缺少關鍵字'); break; }
      const hits = vfs.searchContent(q).filter(h => h.path.startsWith('/customer-portal'));
      if (!hits.length) appendTerminal(`grep: "${q}" 無結果（僅搜尋 customer-portal/file-system 官網系統）`);
      else { appendTerminal(`grep "${q}" 找到 ${hits.length} 筆:`); hits.slice(0, 10).forEach(h => appendTerminal(`${h.path}: ${h.snippet.slice(0,80)}...`)); }
      // 420.69 hint 已移除，現由暗網 hash 觸發
      break;
    }
    case 'git': {
      if (args[0] === 'log') {
        gitCommits.forEach(c => { appendTerminal(`commit ${c.hash} (${c.date}) ${c.author}`); appendTerminal(`    ${c.msg}`); });
      } else if (args[0] === 'diff') {
        const c = gitCommits[1];
        c.diff.split('\n').forEach(l => {
          appendTerminal(l);
        });
        appendTerminal('hint: 點擊 Source Control 右上角的 Git Graph 按鈕查看完整圖像化歷史');
      } else if (args[0] === 'blame') {
        const p = args[1] || currentFile;
        appendTerminal(`blame ${p}:`);
        const bl = fakeBlame[p] || fakeBlame['/customer-portal/src/billing/service.js'];
        bl.forEach(b => appendTerminal(`${String(b.line).padStart(3)} ${b.commit} ${b.author}`));
      } else if (args[0] === 'graph') {
        openGitGraphInEditor();
        appendTerminal('→ 已開啟 Git Graph 編輯器分頁');
      } else {
        appendTerminal('git: 未知子指令，試 help (支援: git log / git diff / git blame / git graph)');
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

// --- Legacy Git panel stubs (Log/Diff/Blame removed; Graph moved to editor) ---
function renderGitLog() {}
function renderGitGraph() { if (gitGraphOpen && currentFile === GIT_GRAPH_PATH) renderGitGraphEditor(); }
function renderGitDiff() {}
function renderGitBlame() {}
function switchGitTab() { /* removed — use Git Graph editor tab */ }

// QuickOpen + shortcuts
function bindShortcuts() {
  document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'F1') { e.preventDefault(); const o=document.getElementById('vsHelpOverlay'); if(o) o.style.display = o.style.display==='flex'?'none':'flex'; return; }
    if (mod && e.key.toLowerCase() === 'p' && !e.shiftKey) {
      e.preventDefault(); openQuickOpen();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault(); activeActivity='search'; updateActivityBar(); document.getElementById('vsSearchInput')?.focus();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'g') {
      e.preventDefault(); activeActivity='scm'; updateActivityBar();
    } else if (mod && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault(); activeActivity='debug'; updateActivityBar();
    } else if (e.key === 'Escape') {
      closeQuickOpen();
      const ho=document.getElementById('vsHelpOverlay'); if(ho) ho.style.display='none';
      const sm=document.getElementById('sonarModal'); if(sm) sm.style.display='none';
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
  let files = vfs.listFiles('/customer-portal');
  let lineJump = null;
  if (q.includes(':')) {
    const [fq, ln] = q.split(':');
    lineJump = parseInt(ln,10);
    files = files.filter(f => f.path.toLowerCase().includes(fq));
  } else if (q) {
    files = files.filter(f => f.path.toLowerCase().includes(q));
  }
  files = files.slice(0, 10);
  if (!files.length) { list.innerHTML = '<div class="quickopen__item muted">無符合檔案 — 試輸入 OrderService / billing</div>'; return; }
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
  const ta = document.getElementById('vsEditorArea');
  if (ta) {
    // for textarea, set selection
    const lines = ta.value.split('\n');
    let pos = 0;
    for (let i=0;i<Math.min(ln-1, lines.length); i++) pos += lines[i].length +1;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    return;
  }
  const editor = document.getElementById('vsEditor');
  if (!editor) return;
  const target = editor.querySelector(`[data-ln="${ln}"]`);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function getEditedContent(path) { return getCurrentContent(path); }
export function isFileDirty(path) { return isDirty(path); }
