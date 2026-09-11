import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';
import { triggerDarknetFromIntranet } from '../darknet/index.js';

let currentPath = '/intranet';
let searchQuery = '';
let selectedFile = null;

const LOCKED_PREFIX = '/intranet/client_info';

function isLockedPath(p) {
  return p === LOCKED_PREFIX || p.startsWith(LOCKED_PREFIX + '/');
}

function getChildren(path) {
  const tree = vfs.buildTree();
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

export function mountIntranet() {
  const root = document.getElementById('view-intranet');
  if (!root) return;
  root.innerHTML = `
    <div class="intranet">
      <div class="intranet__header">
        <div class="intranet__brand">
          <span class="intranet__logo">🧃</span>
          <div>
            <div class="intranet__title">Nori 飲品供應 · 內網檔案系統</div>
            <div class="intranet__subtitle">Intranet · 冰釀茶酒 · 實驗室研發</div>
          </div>
        </div>
        <div class="intranet__search">
          <span aria-hidden="true">🔍</span>
          <input id="intraSearch" class="intranet__search-input" placeholder="搜尋內網檔案名稱或內容" />
          <button id="intraSearchBtn" class="btn primary" style="padding:6px 12px;flex-shrink:0">搜尋</button>
        </div>
      </div>

      <div class="intranet__breadcrumb" id="intraBreadcrumb"></div>

      <div class="intranet__body">
        <nav class="intranet__nav" id="intraNav" aria-label="檔案導覽"></nav>
        <div class="intranet__main" id="intraMain"></div>
      </div>

      <div class="intranet__footer">
        <span class="small muted">Nori Limited · 鴨嘴道135號中央大樓3507室 · 內網僅供內部瀏覽</span>
        <span class="small muted" id="intraCount"></span>
      </div>
    </div>

    <div id="intraPreview" class="intra-preview" style="display:none" role="dialog" aria-modal="true">
      <div class="intra-preview__card">
        <div class="intra-preview__head">
          <b id="intraPreviewName" class="mono small" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></b>
          <button id="intraPreviewClose" class="btn" style="padding:4px 10px">關閉</button>
        </div>
        <pre id="intraPreviewContent" class="intra-preview__content"></pre>
      </div>
    </div>
  `;

  bindIntranet();
  renderAll();
}

function bindIntranet() {
  // Use legacyRoutes for route reconstruction (internalPathDomain from registry, hash from legacy)
  const darkDomain = vfs.internalPathDomain || 'https://nori-intranet/internal/portal?';
  const darkHash = vfs.getLegacyRoute ? (vfs.getLegacyRoute('nori-portal-2023')?._hash || 'f665a7117959b667b7f283eaebf69cae') : 'f665a7117959b667b7f283eaebf69cae';
  const darkFullUrl = darkDomain + 'hash=' + darkHash;
  const darkPortalSimple = 'https://nori-intranet/internal/portal';
  function isDarkUrl(val) {
    if (!val) return false;
    const v = val.trim();
    // Only the full hash URL triggers dark web; simple portal without hash should NOT trigger
    if (v === darkFullUrl) return true;
    if (v.includes('hash=' + darkHash) && v.includes('nori-intranet/internal/portal')) {
      const route = vfs.getLegacyRoute ? vfs.getLegacyRoute('nori-portal-2023') : null;
      if (route && route.domain === darkDomain) return true;
      return v === darkFullUrl;
    }
    return false;
  }
  function handleSearchTrigger() {
    const input = document.getElementById('intraSearch');
    const val = input ? input.value.trim() : '';
    const isSimple = val === darkPortalSimple || val === darkPortalSimple + '/' || (val.includes('nori-intranet/internal/portal') && !val.includes('hash='));
    const isFull = isDarkUrl(val);
    const isEntryClosed = state.hasFlag('ch1_0043_committed') && !state.hasFlag('ch1_revert_done');
    if (isEntryClosed && (isSimple || isFull)) {
      // Entry closed after 0043 removal — secret page should not be displayed, treat as normal search (no darknet)
      searchQuery = val.toLowerCase();
      renderMain();
      // Optional subtle hint: show that portal is closed (not triggered)
      return;
    }
    if (isSimple) {
      // Simple portal without hash: go to SECRET page but title has no effect
      state.setFlag('portal_simple_entered', true);
      triggerDarknetFromIntranet({ simple: true });
      return;
    }
    if (isFull) {
      state.setFlag('portal_hash_entered', true);
      const hashMatch = val.match(/hash=([a-f0-9]{32})/i);
      const hash = hashMatch ? hashMatch[1] : darkHash;
      if (vfs.tryAccessPortal && vfs.tryAccessPortal({ hash })) {
        triggerDarknetFromIntranet({ simple: false });
        return;
      } else if (val === darkFullUrl) {
        // If entry not closed, fallback still triggers (for legacy support), but blocked above if closed
        triggerDarknetFromIntranet({ simple: false });
        return;
      }
    }
    // Normal search: display files matching search
    searchQuery = val.toLowerCase();
    renderMain();
  }
  // Only trigger search on button click or Enter, not on input (per latest spec: typing without click should remain unchange)
  document.getElementById('intraSearchBtn')?.addEventListener('click', handleSearchTrigger);
  document.getElementById('intraSearch')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchTrigger();
    }
  });
  // Input without Search click should remain unchange (no file filtering)
  // So we intentionally do NOT update searchQuery on input
  document.getElementById('intraPreviewClose')?.addEventListener('click', closePreview);
  document.getElementById('intraPreview')?.addEventListener('click', e => {
    if (e.target.id === 'intraPreview') closePreview();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePreview();
  });
}

function renderAll() {
  renderBreadcrumb();
  renderNav();
  renderMain();
  const count = vfs.listFiles('/intranet').length;
  const el = document.getElementById('intraCount');
  if (el) el.textContent = `內網共 ${count} 個檔案`;
}

function renderBreadcrumb() {
  const el = document.getElementById('intraBreadcrumb');
  if (!el) return;
  // 根目錄已移除，麵包屑以 內網首頁 為起點
  const parts = currentPath.split('/').filter(Boolean);
  let html = `<span class="intra-bc__item" data-path="/intranet">🏠 內網首頁</span>`;
  let acc = '/intranet';
  const startIdx = parts[0] === 'intranet' ? 1 : 0;
  parts.slice(startIdx).forEach((p) => {
    acc += '/' + p;
    const locked = isLockedPath(acc);
    html += ` <span class="muted">›</span> <span class="intra-bc__item ${acc===currentPath?'active':''} ${locked?'locked':''}" data-path="${escapeHtml(acc)}">${escapeHtml(p)}${locked?' 🔒':''}</span>`;
  });
  if (currentPath === '/intranet') {
    html = `<span class="intra-bc__item active" data-path="/intranet">🏠 內網首頁</span>`;
  }
  el.innerHTML = html;
  el.querySelectorAll('.intra-bc__item').forEach(n => {
    n.addEventListener('click', () => navigate(n.dataset.path));
  });
}

function renderNav() {
  const el = document.getElementById('intraNav');
  if (!el) return;
  const items = [
    { path: '/intranet', label: '內網首頁', icon: '🏠', desc: '總覽' },
    { path: '/intranet/company_public', label: '公司公開資訊', icon: '🏢', desc: '名稱・Logo・大樓名錄' },
    { path: '/intranet/client_info', label: '客戶資料', icon: '🔒', desc: '權限管制（鎖定）', locked: true },
    { path: '/intranet/business_plans', label: '業務計畫', icon: '📊', desc: '完整流程結構' },
    { path: '/intranet/staff', label: '員工資料', icon: '👥', desc: '50 人名錄' },
  ];
  el.innerHTML = items.map(it => {
    const active = currentPath === it.path || (it.path !== '/' && currentPath.startsWith(it.path + '/')) ? 'active' : '';
    const lockedCls = it.locked ? 'locked' : '';
    return `<div class="intra-nav__item ${active} ${lockedCls}" data-path="${it.path}" title="${it.path}">
      <span class="intra-nav__icon">${it.icon}</span>
      <span class="intra-nav__label">${it.label}</span>
      <span class="intra-nav__desc">${it.desc}</span>
    </div>`;
  }).join('') + `
    <div class="intra-nav__hint small muted" style="padding:10px 12px;border-top:1px solid var(--border);margin-top:8px">
      點擊資料夾瀏覽<br/>點擊檔案預覽內容<br/>客戶資料夾受保護，請向管理員申請讀取權限
    </div>
  `;
  el.querySelectorAll('.intra-nav__item').forEach(n => {
    n.addEventListener('click', () => navigate(n.dataset.path));
  });
}

function renderMain() {
  const el = document.getElementById('intraMain');
  if (!el) return;

  // Search mode — 僅搜內網（已移除完整檔案總覽／根目錄）
  if (searchQuery) {
    const hits = vfs.searchContent(searchQuery).filter(r => r.path.startsWith('/intranet')).slice(0, 40);
    const files = vfs.listFiles('/intranet').filter(f => f.path.toLowerCase().includes(searchQuery)).slice(0, 40);
    const map = new Map();
    hits.forEach(h => map.set(h.path, h));
    files.forEach(f => { if (!map.has(f.path)) map.set(f.path, { path: f.path, snippet: '' }); });
    const results = [...map.values()];
    if (!results.length) {
      el.innerHTML = `<div class="intra-empty">無搜尋結果 — 試試「Nori」「冰釀茶酒」「業務流程」「Sawyer」</div>`;
      return;
    }
    el.innerHTML = `
      <div class="intra-section__title">搜尋結果「${escapeHtml(searchQuery)}」— ${results.length} 筆</div>
      <div class="intra-file__list">
        ${results.map(r => {
          const entry = vfs.getFile(r.path);
          const locked = entry?.meta?.locked || isLockedPath(r.path);
          return `<div class="intra-file__row ${locked?'locked':''}" data-path="${escapeHtml(r.path)}" title="${escapeHtml(r.path)}">
            <span class="intra-file__icon">${locked?'🔒': fileIcon(r.path)}</span>
            <span class="intra-file__name">${escapeHtml(r.path)}</span>
            <span class="small muted" style="margin-left:auto;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml((r.snippet||'').slice(0,60))}</span>
          </div>`;
        }).join('')}
      </div>
    `;
    bindFileRows(el);
    return;
  }

  if (isLockedPath(currentPath)) {
    el.innerHTML = `
      <div class="intra-locked">
        <div class="intra-locked__icon">🔒</div>
        <h3>客戶資料 — 權限不足</h3>
        <p class="small muted">本資料夾受保護，僅限法務與客戶經理存取。<br/>遊戲內無需開啟，請返回其他資料夾。</p>
        <div class="intra-locked__files">
          <div class="small" style="font-weight:600;margin-bottom:6px">受保護檔案（僅顯示名稱）</div>
          ${getChildren(currentPath).map(ch => `<div class="intra-file__row locked" title="${escapeHtml(ch.path)}"><span>${fileIcon(ch.path)}</span><span>${escapeHtml(ch.name)}</span><span class="small muted" style="margin-left:auto">🔒 鎖定</span></div>`).join('')}
        </div>
        <button class="btn" style="margin-top:12px" onclick="document.querySelector('[data-path='/intranet']')?.click()">返回內網首頁</button>
      </div>
    `;
    return;
  }

  const children = getChildren(currentPath);
  // separate dirs/files
  const dirs = children.filter(c => c.type === 'dir');
  const files = children.filter(c => c.type === 'file');

  // For root/intranet show overview cards
  if (currentPath === '/intranet' && !searchQuery) {
    el.innerHTML = `
      <div class="intra-grid">
        <div class="intra-card" data-path="/intranet/company_public">
          <div class="intra-card__icon">🏢</div>
          <div class="intra-card__title">公司公開資訊</div>
          <div class="small muted">公司名稱・Logo 設計・上市公司名錄（含 Nori Limited 鴨嘴道135號中央大樓3507室）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">4 個檔案 →</div>
        </div>
        <div class="intra-card locked" data-path="/intranet/client_info">
          <div class="intra-card__icon">🔒</div>
          <div class="intra-card__title">客戶資料</div>
          <div class="small muted">權限管制，遊戲內無需存取。點擊查看提示。</div>
          <div class="small" style="margin-top:8px;color:var(--fg-muted)">🔒 受保護</div>
        </div>
        <div class="intra-card" data-path="/intranet/business_plans">
          <div class="intra-card__icon">📊</div>
          <div class="intra-card__title">業務計畫</div>
          <div class="small muted">營運研發 → 原物料 → 業務 → 配送 → IT（VIP 價格試算）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">2 個檔案 →</div>
        </div>
        <div class="intra-card" data-path="/intranet/staff">
          <div class="intra-card__icon">👥</div>
          <div class="intra-card__title">員工資料</div>
          <div class="small muted">員工名錄 50 人（Sawyer #001 … Casey #048 初級開發人員 … 至 2024-09-02）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">2 個檔案 →</div>
        </div>
      </div>
      <div class="intra-section">
        <div class="intra-section__title">內網檔案（${children.length} 項）</div>
        <div class="intra-file__list">
          ${children.map(ch => renderRow(ch)).join('')}
        </div>
      </div>
    `;
    el.querySelectorAll('[data-path]').forEach(n => n.addEventListener('click', e => {
      e.stopPropagation();
      const p = n.getAttribute('data-path');
      if (p) navigate(p);
    }));
    bindFileRows(el);
    return;
  }

  // Normal folder view
  if (!children.length) {
    const entry = vfs.getFile(currentPath);
    if (entry && entry.content != null) {
      // single file preview inline
      el.innerHTML = `<div class="intra-section__title">${escapeHtml(currentPath)}</div><pre class="intra-file__preview mono">${escapeHtml(entry.content.slice(0,8000))}</pre>`;
      return;
    }
    el.innerHTML = `<div class="intra-empty">此資料夾為空</div>`;
    return;
  }

  el.innerHTML = `
    <div class="intra-section__title">${escapeHtml(currentPath)} — ${dirs.length} 個資料夾，${files.length} 個檔案</div>
    ${dirs.length ? `<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">資料夾</div>${dirs.map(ch => renderRow(ch)).join('')}</div>` : ''}
    ${files.length ? `<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">檔案</div>${files.map(ch => renderRow(ch)).join('')}</div>` : ''}
  `;
  bindFileRows(el);
}

function renderRow(ch) {
  const locked = ch.path && isLockedPath(ch.path);
  const entry = ch.path ? vfs.getFile(ch.path) : null;
  const isLockedFile = entry?.meta?.locked || locked;
  const icon = isLockedFile ? '🔒' : (ch.type === 'dir' ? '📁' : fileIcon(ch.path || ch.name));
  return `<div class="intra-file__row ${ch.type==='dir'?'is-dir':''} ${isLockedFile?'locked':''}" data-path="${escapeHtml(ch.path)}" data-type="${ch.type}" title="${escapeHtml(ch.path)}">
    <span class="intra-file__icon">${icon}</span>
    <span class="intra-file__name">${escapeHtml(ch.name)}</span>
    <span class="small muted" style="margin-left:auto">${ch.type==='dir'?'資料夾': (ch.path?.split('.').pop()||'檔案')}</span>
  </div>`;
}

function fileIcon(p) {
  if (!p) return '📄';
  if (p.endsWith('.md')) return '📝';
  if (p.endsWith('.csv')) return '📊';
  if (p.endsWith('.svg')) return '🖼️';
  if (p.endsWith('.json')) return '🧩';
  if (p.endsWith('.js') || p.endsWith('.java')) return '💻';
  if (p.endsWith('.html')) return '🌐';
  if (p.endsWith('.pdf')) return '📕';
  return '📄';
}

function bindFileRows(container) {
  container.querySelectorAll('.intra-file__row').forEach(row => {
    row.addEventListener('click', () => {
      const p = row.dataset.path;
      const t = row.dataset.type;
      if (row.classList.contains('locked')) {
        // show toast-like lock message in main
        const el = document.getElementById('intraMain');
        if (el) {
          const tip = document.createElement('div');
          tip.className = 'toast';
          tip.style.cssText = 'position:fixed;right:12px;bottom:64px;background:#323232;color:#fff;padding:10px 12px;border-radius:8px;z-index:999';
          tip.textContent = '🔒 權限不足 — 客戶資料受保護，遊戲內無需存取';
          document.body.appendChild(tip);
          setTimeout(()=> tip.remove(), 2200);
        }
        return;
      }
      if (t === 'dir') navigate(p);
      else openPreview(p);
    });
  });
}

function navigate(path) {
  if (!path) return;
  currentPath = path;
  selectedFile = null;
  renderAll();
}

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
function openPreview(path) {
  const entry = vfs.getFile(path);
  if (!entry) return;
  if (entry.meta?.locked || isLockedPath(path)) return;
  const modal = document.getElementById('intraPreview');
  const nameEl = document.getElementById('intraPreviewName');
  const contentEl = document.getElementById('intraPreviewContent');
  if (!modal || !nameEl || !contentEl) return;
  nameEl.textContent = path;
  let content = entry.content || '';
  if (path.toLowerCase().endsWith('.csv')) {
    const { header, rows } = parseCSV(content);
    const thead = `<thead><tr>${header.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    contentEl.innerHTML = `
      <div class="csv-preview__header"><span class="small muted mono">${escapeHtml(path)} — 表格檢視</span><span class="small muted">${rows.length} 列 × ${header.length} 欄</span></div>
      <div style="overflow:auto;max-height:60vh"><table class="csv-table">${thead}${tbody}</table></div>
    `;
    contentEl.style.whiteSpace = 'normal';
  } else {
    if (content.length > 12000) content = content.slice(0,12000) + '\n...（內容已截斷，完整請於 Vizual Studio Code 開啟）';
    contentEl.textContent = content;
    contentEl.style.whiteSpace = 'pre-wrap';
  }
  modal.style.display = 'flex';
}

function closePreview() {
  const modal = document.getElementById('intraPreview');
  if (modal) modal.style.display = 'none';
}

export function getCurrentIntranetPath() { return currentPath; }
