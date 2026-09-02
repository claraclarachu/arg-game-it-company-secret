import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';

const webIndex = [
  { title: 'Java switch-case 語法詳解 — 基礎教學 (繁中)', url: 'https://java-tutorial.example/switch-case', snippet: '【switch 用法】switch 會依變數值跳到對應 case，需搭配 break 避免貫穿。範例：switch(vipLv){ case 1: price *= 0.90; break; case 2: price *= 0.85; break; case 3: price *= 0.80; break; case 4: price *= 0.75; break; case 5: price *= 0.70; break; default: break; } 注意：若缺少 break 會繼續執行下一個 case。常與 if-else 比較，適用於枚舉分級如 VIP 折扣。', type: 'web', image: null },
  { title: '【StackOverflow】VIP 等級折扣用 switch 寫，VIP1 被算成 95% 而不是 90% 該怎麼修？', url: 'https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage', snippet: '發問：我的 switch(vipLv) 中 case 1 寫成 price*=0.95，但需求是 VIP1 90%、VIP2 85%、VIP3 80%、VIP4 75%、VIP5 70%，現在全部多 5%。已嘗試修改但 Sonar 仍報錯... 回答：請將 case 1 改為 0.90、case 2 改為 0.85，其餘依序下調 5%，並確認每個 case 都有 break。另建議抽成 Map 或 enum 避免魔法數字。 (瀏覽 2.3k, 已解決)', type: 'web', image: null },
  { title: 'Cocoa bean import license — Acme Docs', url: 'https://acme.internal/docs/cocoa-license', snippet: '無相關進口許可記錄。搜尋代號 cocoa 對應 "可可豆" 但實際無海關記錄。', type: 'web', image: null },
  { title: 'Cocoa — Chemical codes (學術)', url: 'https://chem.example/search?q=cocoa', snippet: '代號 cocoa / bean / leaf / crystal 在內部庫存表中出現，疑似毒品代號。', type: 'academic', image: null },
  { title: '快遞追蹤 — 範例單號 118-bean (新聞)', url: 'https://track.example/118-bean', snippet: '物流資訊可在搜尋引擎透過單號反查 (後續章節)。該單號對應 BEAN 118 單位。', type: 'news', image: null },
  { title: 'Acme 架構圖 — 物流路線圖', url: 'https://acme.internal/docs/arch', snippet: 'Jira 附件中的架構圖實為物流路線圖，標註台灣→東南亞→北美。', type: 'web', image: 'https://via.placeholder.com/320x180?text=Arch+Map' },
  { title: 'Package mugshot — 內部配圖', url: 'https://acme.internal/media/package.jpg', snippet: '圖片：可疑包裹外觀，快照中可見暗號。', type: 'image', image: 'https://via.placeholder.com/320x180?text=Package' },
  { title: 'reconcile.py 執行日誌', url: 'file:///workspace/scripts/reconcile.py', snippet: '對帳腳本使用 sqlite3 查詢 GROUP BY code，輸出 COCOA/BEAN 總額。', type: 'web', image: null },
  { title: 'OrderService.java — Java 分潤邏輯', url: 'file:///workspace/src/main/java/com/acme/OrderService.java', snippet: 'feeRate switch：cocoa 0.15, bean 0.22, leaf 0.12, crystal 0.30。', type: 'academic', image: null },
];

const trends = ['cocoa bean import license', 'site:acme.internal', 'filetype:js 420.69', 'crystal 供應鏈', 'X-Internal-Token', 'ledger.db'];
let activeTab = 'all'; // all | image | news | academic
let lastQuery = '';
let lastResults = [];
let lastBaseQuery = '';

function getSuggestions(q) {
  if (!q) return [];
  const low = q.toLowerCase();
  const set = new Set();
  const out = [];
  // from webIndex titles
  webIndex.forEach(r => {
    if (r.title.toLowerCase().includes(low) && !set.has(r.title)) { set.add(r.title); out.push({ text: r.title, kind: r.type }); }
  });
  // from vfs files
  vfs.listFiles('/workspace').forEach(f => {
    if (f.path.toLowerCase().includes(low) && !set.has(f.path)) { set.add(f.path); out.push({ text: f.path, kind: 'file' }); }
  });
  // from history
  (state.get('searchHistory') || []).slice(-5).reverse().forEach(h => {
    if (h.q.toLowerCase().includes(low) && !set.has(h.q)) { set.add(h.q); out.push({ text: h.q, kind: 'history' }); }
  });
  // advanced syntax hints
  if ('site:'.startsWith(low)) out.unshift({ text: 'site:acme.internal', kind: 'syntax' });
  if ('filetype:'.startsWith(low)) out.push({ text: 'filetype:js', kind: 'syntax' });
  return out.slice(0, 8);
}

function parseAdvanced(query) {
  let q = query;
  const filters = { site: null, filetype: null, before: null, after: null };
  // site:
  const siteM = q.match(/site:([^\s]+)/i);
  if (siteM) { filters.site = siteM[1].toLowerCase(); q = q.replace(siteM[0], '').trim(); }
  const ftM = q.match(/filetype:([^\s]+)/i);
  if (ftM) { filters.filetype = ftM[1].toLowerCase(); q = q.replace(ftM[0], '').trim(); }
  const beforeM = q.match(/before:([^\s]+)/i);
  if (beforeM) { filters.before = beforeM[1]; q = q.replace(beforeM[0], '').trim(); }
  const afterM = q.match(/after:([^\s]+)/i);
  if (afterM) { filters.after = afterM[1]; q = q.replace(afterM[0], '').trim(); }
  return { base: q.trim(), filters };
}

function highlightSnippet(text, query) {
  if (!query) return escapeHtml(text);
  const esc = escapeHtml(text);
  const terms = query.split(/\s+/).filter(Boolean).slice(0, 3);
  let out = esc;
  terms.forEach(t => {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}

export function mountSearch() {
  const root = document.getElementById('view-search');
  if (!root) return;
  root.innerHTML = `
    <div class="search">
      <div class="search__header">
        <div class="search__logo">Sear<span>ch</span></div>
        <div class="search__bar">
          <input id="searchInput" class="input" placeholder="輸入關鍵詞，如 cocoa / bean / 420.69 / site:acme.internal / filetype:js" autocomplete="off" />
          <button id="searchBtn" class="btn primary">搜尋</button>
          <div id="suggestBox" class="suggest-box"></div>
        </div>
      </div>
      <div class="search__suggest">
        <span class="chip" data-q="cocoa">cocoa</span>
        <span class="chip" data-q="cocoa bean import license">cocoa bean import license</span>
        <span class="chip" data-q="site:acme.internal">site:acme.internal</span>
        <span class="chip" data-q="filetype:js 420.69">filetype:js 420.69</span>
        <span class="chip" data-q="crystal">crystal</span>
      </div>
      <div class="search__tabs" role="tablist">
        <button class="search__tab active" data-tab="all">全部</button>
        <button class="search__tab" data-tab="image">圖片</button>
        <button class="search__tab" data-tab="news">新聞</button>
        <button class="search__tab" data-tab="academic">學術</button>
      </div>
      <div id="searchViewContainer">
        <div id="searchLayout" class="search__layout">
          <div class="search__main">
            <div id="searchResults"></div>
            <div id="searchAdvancedHint" class="small muted" style="margin-top:8px"></div>
          </div>
          <div class="search__side">
            <div class="search__history">
              <h4>搜尋歷史</h4>
              <div id="searchHistoryList"></div>
            </div>
            <div class="search__trends">
              <h4>搜尋趨勢</h4>
              <div id="searchTrendList"></div>
            </div>
            <div class="card" style="padding:10px">
              <b>Portal 快捷存取</b>
              <div class="small muted" style="margin:6px 0">已觸發隱藏路由後，在此輸入 portal 所需 header 存取內部庫存：</div>
              <div style="display:flex;gap:6px">
                <input id="portalToken" class="input" placeholder="X-Internal-Token (提示: .env.example)" value="cocoa-beans-2024" />
                <button id="portalBypassBtn" class="btn">存取 /internal/portal</button>
              </div>
              <div id="portalResult" class="small" style="margin-top:8px"></div>
            </div>
          </div>
        </div>
        <div id="searchDetail" class="search__detail-view" style="display:none"></div>
      </div>
    </div>
  `;
  bindSearch();
  renderHistory();
  renderTrends();
  doSearch('cocoa');
}

function bindSearch() {
  const input = document.getElementById('searchInput');
  const box = document.getElementById('suggestBox');
  input?.addEventListener('input', e => {
    const q = e.target.value;
    const sug = getSuggestions(q);
    if (!q || !sug.length) { box.classList.remove('open'); box.innerHTML = ''; return; }
    box.innerHTML = sug.map(s => `<div class="suggest-item" data-q="${escapeHtml(s.text)}"><span>${escapeHtml(s.text)}</span><span class="small">${s.kind}</span></div>`).join('');
    box.classList.add('open');
    box.querySelectorAll('.suggest-item').forEach(el => el.addEventListener('click', () => {
      input.value = el.dataset.q;
      box.classList.remove('open');
      doSearch(el.dataset.q);
    }));
  });
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { document.getElementById('suggestBox')?.classList.remove('open'); doSearch(e.target.value); }
    if (e.key === 'Escape') document.getElementById('suggestBox')?.classList.remove('open');
    if (e.key === 'ArrowDown') {
      const first = document.querySelector('#suggestBox .suggest-item');
      if (first) { e.preventDefault(); first.classList.add('active'); input.value = first.dataset.q; }
    }
  });
  input?.addEventListener('blur', () => setTimeout(()=> box?.classList.remove('open'), 150));
  document.getElementById('searchBtn')?.addEventListener('click', () => doSearch(document.getElementById('searchInput').value));
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => doSearch(c.dataset.q)));
  document.querySelectorAll('.search__tab').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.search__tab').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      activeTab = b.dataset.tab;
      doSearch(lastQuery || 'cocoa');
    });
  });
  document.getElementById('portalBypassBtn')?.addEventListener('click', () => {
    const token = document.getElementById('portalToken').value.trim();
    const ok = vfs.bypassPortalAuth({ 'X-Internal-Token': token });
    const out = document.getElementById('portalResult');
    if (ok) {
      state.setFlag('found_code_map', true);
      out.innerHTML = `<span style="color:var(--success)">✓ 已繞過驗證</span><div class="small muted">庫存: COCOA 420 · BEAN 118 · LEAF 300 · CRYSTAL 75<br/>代號: COCOA=可卡因 BEAN=海洛因 LEAF=大麻 CRYSTAL=冰毒<br/>匯出: /internal/portal/export</div>`;
    } else {
      out.textContent = '403 Forbidden — token 錯誤';
    }
  });
}

function renderHistory() {
  const el = document.getElementById('searchHistoryList');
  if (!el) return;
  const hist = (state.get('searchHistory') || []).slice(-8).reverse();
  if (!hist.length) { el.innerHTML = '<div class="small muted">尚無歷史</div>'; return; }
  el.innerHTML = hist.map(h => `<div class="history-item" data-q="${escapeHtml(h.q)}"><span>${escapeHtml(h.q)}</span><span class="small">${new Date(h.at).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</span></div>`).join('');
  el.querySelectorAll('.history-item').forEach(n => n.addEventListener('click', () => doSearch(n.dataset.q)));
}

function renderTrends() {
  const el = document.getElementById('searchTrendList');
  if (!el) return;
  el.innerHTML = trends.map(t => `<div class="trend-item" data-q="${escapeHtml(t)}"><span>🔥 ${escapeHtml(t)}</span><span class="small">›</span></div>`).join('');
  el.querySelectorAll('.trend-item').forEach(n => n.addEventListener('click', () => doSearch(n.dataset.q)));
}

function doSearch(q) {
  const input = document.getElementById('searchInput');
  if (input && q) input.value = q;
  const raw = (q || '').trim();
  if (!raw) return;
  lastQuery = raw;
  state.push('searchHistory', { q: raw, at: new Date().toISOString() });
  // Phase 6 flags via search behavior
  if (raw.toLowerCase().includes('package') || raw.toLowerCase().includes('image')) state.setFlag('reverse_image_done', true);
  if (raw.toLowerCase().includes('shell') || raw.toLowerCase().includes('site:acme')) state.setFlag('found_shell_company', true);
  if (raw.toLowerCase().includes('cocoa') || raw.toLowerCase().includes('crystal')) state.setFlag('found_supplier', true);
  renderHistory();
  const { base, filters } = parseAdvanced(raw);
  lastBaseQuery = base;
  const hint = document.getElementById('searchAdvancedHint');
  if (hint) {
    const parts = [];
    if (filters.site) parts.push(`site:${filters.site}`);
    if (filters.filetype) parts.push(`filetype:${filters.filetype}`);
    if (filters.before) parts.push(`before:${filters.before}`);
    if (filters.after) parts.push(`after:${filters.after}`);
    hint.textContent = parts.length ? `進階語法生效：${parts.join(' · ')} ｜ 基礎查詢：${base || '(空)'}` : '';
  }

  let results = [];
  // web index match (filtered by tab)
  for (const r of webIndex) {
    if (activeTab !== 'all' && r.type !== activeTab) continue;
    const target = (r.title + ' ' + r.snippet + ' ' + r.url).toLowerCase();
    const kw = base.toLowerCase();
    const match = !base || target.includes(kw) || base.split(/\s+/).some(k => target.includes(k.toLowerCase()));
    if (!match) continue;
    if (filters.site && !r.url.toLowerCase().includes(filters.site)) continue;
    // filetype only applies to vfs, skip web for filetype mismatch? keep web if not filetype
    if (filters.filetype && r.type === 'image' && filters.filetype !== 'image') continue;
    results.push(r);
  }
  // vfs search
  if (activeTab === 'all' || activeTab === 'academic') {
    const vfsHits = vfs.searchContent(base || raw);
    for (const h of vfsHits) {
      if (filters.site && !h.path.toLowerCase().includes(filters.site)) continue;
      if (filters.filetype) {
        const ext = h.path.split('.').pop().toLowerCase();
        if (ext !== filters.filetype.toLowerCase()) continue;
      }
      results.push({ title: h.path, url: h.path, snippet: h.snippet, type: 'web', image: null });
    }
  }

  // tab filter already, but for image tab ensure image results shown
  if (activeTab === 'image') {
    // if no image results, fallback to show web image placeholder
    if (!results.some(r=>r.image)) {
      // keep as is, will show empty
    }
  }

  lastResults = results.slice(0, 12);
  const c = document.getElementById('searchResults');
  if (!c) return;
  // ensure we are in results view when doing a new search
  showResultsView();
  if (!lastResults.length) {
    c.innerHTML = `<div class="muted small" style="margin-top:12px">無結果 — 嘗試 "cocoa" 或 <code>filetype:js</code> 或 <code>site:acme.internal</code></div>`;
    return;
  }
  c.innerHTML = lastResults.map((r, idx) => `
    <div class="result" data-idx="${idx}">
      <div class="result__title" data-open="${idx}">${escapeHtml(r.title)}</div>
      <div class="result__url">${escapeHtml(r.url)}</div>
      <div class="result__snippet">${highlightSnippet(r.snippet, base)}</div>
      <div class="result__meta">
        <span class="result__tag">${r.type}</span>
        ${filters.site ? `<span class="result__tag">site:${filters.site}</span>` : ''}
        ${filters.filetype ? `<span class="result__tag">filetype:${filters.filetype}</span>` : ''}
      </div>
      ${r.image ? `<div class="result__image"><img src="${r.image}" alt="preview" loading="lazy" /></div>` : ''}
      <div class="result__actions">
        <span class="result__snap" data-open="${idx}">開啟</span>
      </div>
    </div>
  `).join('');
  c.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', () => {
    const idx = Number(el.dataset.open);
    const item = lastResults[idx];
    if (!item) return;
    if (item.url.startsWith('file://') || item.url.startsWith('/workspace')) {
      const p = item.url.replace('file://','');
      if (vfs.exists(p)) { state.setFlag('found_code_map', true); }
      // also dispatch event for VSCode integration
      const ev = new CustomEvent('search:openFile', { detail: p });
      window.dispatchEvent(ev);
    }
    openDetail(idx);
  }));
}

function showResultsView() {
  const layout = document.getElementById('searchLayout');
  const detail = document.getElementById('searchDetail');
  if (layout) layout.style.display = '';
  if (detail) { detail.style.display = 'none'; detail.innerHTML = ''; detail.classList.remove('open'); }
  // scroll search container to top
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
}

function openDetail(idx) {
  const item = lastResults[idx];
  if (!item) return;
  const layout = document.getElementById('searchLayout');
  const detail = document.getElementById('searchDetail');
  if (!layout || !detail) return;
  layout.style.display = 'none';
  detail.style.display = 'block';
  detail.classList.add('open');

  // try to get full content if it's a VFS file
  let fullContent = '';
  let vfsPath = null;
  if (item.url.startsWith('/workspace') || item.url.startsWith('file://')) {
    vfsPath = item.url.replace('file://','');
    const file = vfs.getFile(vfsPath);
    if (file && typeof file.content === 'string') {
      fullContent = file.content;
      // also trigger read for flags
      vfs.readFile(vfsPath);
    }
  } else if (vfs.exists(item.url)) {
    vfsPath = item.url;
    const file = vfs.getFile(vfsPath);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }
  // if it's a webIndex item that maps to a VFS file via title, try lookup
  if (!fullContent && item.title.startsWith('/workspace')) {
    const file = vfs.getFile(item.title);
    if (file && typeof file.content === 'string') fullContent = file.content;
  }

  const displayContent = fullContent || item.snippet || '無內容';

  detail.innerHTML = `
    <button id="searchBackBtn" class="btn detail__back">← 上一頁</button>
    <div class="detail__card">
      <h2 class="detail__title">${escapeHtml(item.title)}</h2>
      <div class="detail__url">${escapeHtml(item.url)}</div>
      ${item.image ? `<div class="detail__image"><img src="${item.image}" alt="preview" /></div>` : ''}
      <div class="detail__snippet">${highlightSnippet(displayContent, lastBaseQuery)}</div>
      ${fullContent ? `<pre class="detail__pre">${escapeHtml(fullContent)}</pre>` : ''}
      <div class="result__meta" style="margin-top:12px">
        <span class="result__tag">${item.type}</span>
      </div>
    </div>
  `;
  detail.querySelector('#searchBackBtn')?.addEventListener('click', () => showResultsView());
  // scroll to top of search
  const searchEl = document.querySelector('.search');
  if (searchEl) searchEl.scrollTop = 0;
  const viewSearch = document.getElementById('view-search');
  if (viewSearch) viewSearch.scrollTop = 0;
  detail.scrollIntoView({ behavior: 'auto', block: 'start' });
}
