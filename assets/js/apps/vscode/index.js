import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { events } from '../../core/events.js';
import { escapeHtml } from '../../utils/helpers.js';

let currentFile = '/workspace/src/billing/service.js';

export function mountVSCode() {
  const root = document.getElementById('view-vscode');
  if (!root) return;
  root.innerHTML = `
    <div class="vscode">
      <div class="vscode__side">
        <div style="padding:8px 10px;border-bottom:1px solid var(--border);display:flex;gap:6px;align-items:center">
          <input id="vsQuickOpen" class="input" placeholder="搜尋檔案 (Cmd+P) / 全域搜尋 (Cmd+Shift+F)" />
        </div>
        <div id="vsTree" class="tree"></div>
        <div style="padding:8px;border-top:1px solid var(--border)">
          <div class="small muted">提示：追蹤 billing/service.js 的 420.69 分支</div>
          <div style="display:flex;gap:6px;margin-top:6px">
            <input id="vsTriggerAmount" class="input" placeholder="輸入 total 金額測試 (如 420.69)" />
            <button id="vsTriggerBtn" class="btn primary">觸發</button>
          </div>
          <div id="vsTriggerResult" class="small" style="margin-top:6px"></div>
        </div>
      </div>
      <div class="vscode__main">
        <div id="vsTabs" class="vscode__tabs"></div>
        <div id="vsEditor" class="editor"><pre class="mono"></pre></div>
        <div class="terminal" id="vsTerminal"></div>
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
  document.getElementById('vsTriggerBtn')?.addEventListener('click', () => {
    const v = parseFloat(document.getElementById('vsTriggerAmount').value);
    const res = vfs.tryAccessPortal({ amount: v });
    const out = document.getElementById('vsTriggerResult');
    if (res) {
      out.textContent = '→ 已觸發隱藏路由 /internal/portal (查看 Search / Portal 頁)';
      state.setFlag('found_code_map', true);
    } else {
      out.textContent = '未觸發，嘗試 420.69';
    }
  });
}

function renderTree(filter = '') {
  const c = document.getElementById('vsTree');
  if (!c) return;
  const tree = vfs.buildTree();
  // flatten leaves for search
  function renderNode(node, depth = 0) {
    if (node.type === 'dir') {
      const visibleChildren = node.children.filter(ch => !filter || ch.path.toLowerCase().includes(filter) || hasDescendant(ch, filter));
      if (filter && visibleChildren.length === 0) return '';
      return `<div class="tree__node" style="padding-left:${8+depth*8}px" data-path="${node.path}">📁 ${escapeHtml(node.name)}</div>
        <div class="tree__children">${visibleChildren.map(ch => renderNode(ch, depth+1)).join('')}</div>`;
    } else {
      if (filter && !node.path.toLowerCase().includes(filter)) return '';
      const active = node.path === currentFile ? 'active' : '';
      return `<div class="tree__node ${active}" data-path="${node.path}" data-file="1">📄 ${escapeHtml(node.name)}</div>`;
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
  // ensure current file in tabs
  if (!files.some(f => f.path === currentFile)) {
    const cur = vfs.getFile(currentFile);
    if (cur) files.unshift({ path: currentFile, ...cur });
  }
  tabs.innerHTML = files.map(f => `<div class="vscode__tab ${f.path===currentFile?'active':''}" data-path="${f.path}">${f.path.split('/').pop()}</div>`).join('');
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
