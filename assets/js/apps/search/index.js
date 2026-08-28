import { vfs } from '../../core/vfs.js';
import { state } from '../../core/state.js';

const webIndex = [
  { title: 'Cocoa bean import license — Acme Docs', url: 'https://acme.internal/docs/cocoa-license', snippet: '無相關進口許可記錄。搜尋代號 cocoa 對應 "可可豆" 但實際無海關記錄。' },
  { title: 'Cocoa — Chemical codes', url: 'https://chem.example/search?q=cocoa', snippet: '代號 cocoa / bean / leaf / crystal 在內部庫存表中出現，疑似毒品代號。' },
  { title: '快遞追蹤 — 範例單號', url: 'https://track.example/118-bean', snippet: '物流資訊可在搜尋引擎透過單號反查 (後續章節)。' },
];

export function mountSearch() {
  const root = document.getElementById('view-search');
  if (!root) return;
  root.innerHTML = `
    <div class="search">
      <h2 style="margin:0 0 8px">Search</h2>
      <div class="search__bar">
        <input id="searchInput" class="input" placeholder="輸入關鍵詞，如 cocoa / bean / 420.69 / X-Internal-Token" />
        <button id="searchBtn" class="btn primary">搜尋</button>
      </div>
      <div class="search__suggest">
        <span class="chip" data-q="cocoa">cocoa</span>
        <span class="chip" data-q="cocoa bean import license">cocoa bean import license</span>
        <span class="chip" data-q="site:acme.internal">site:acme.internal</span>
      </div>
      <div id="searchResults"></div>
      <div class="card" style="margin-top:12px">
        <b>Portal 快捷存取</b>
        <div class="small muted" style="margin:6px 0">已觸發隱藏路由後，在此輸入 portal 所需 header 存取內部庫存：</div>
        <div style="display:flex;gap:6px">
          <input id="portalToken" class="input" placeholder="X-Internal-Token (提示: .env.example)" value="cocoa-beans-2024" />
          <button id="portalBypassBtn" class="btn">存取 /internal/portal</button>
        </div>
        <div id="portalResult" class="small" style="margin-top:8px"></div>
      </div>
    </div>
  `;
  root.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => doSearch(c.dataset.q)));
  document.getElementById('searchBtn')?.addEventListener('click', () => doSearch(document.getElementById('searchInput').value));
  document.getElementById('searchInput')?.addEventListener('keydown', e => { if (e.key==='Enter') doSearch(e.target.value); });
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
  // initial
  doSearch('cocoa');
}

function doSearch(q) {
  const input = document.getElementById('searchInput');
  if (input && q) input.value = q;
  const query = (q || '').trim();
  if (!query) return;
  state.push('searchHistory', { q: query, at: new Date().toISOString() });
  const results = [];
  // web index match
  for (const r of webIndex) {
    if (query.toLowerCase().split(/\s+/).some(k => r.title.toLowerCase().includes(k) || r.snippet.toLowerCase().includes(k))) results.push(r);
  }
  // vfs search
  const vfsHits = vfs.searchContent(query);
  for (const h of vfsHits) results.push({ title: h.path, url: h.path, snippet: h.snippet });

  const c = document.getElementById('searchResults');
  if (!c) return;
  c.innerHTML = results.length ? results.map(r => `<div class="result"><div class="result__title">${r.title}</div><div class="result__url">${r.url}</div><div class="result__snippet">${r.snippet}</div></div>`).join('') : `<div class="muted small" style="margin-top:12px">無結果 — 嘗試 "cocoa" 或檔案路徑</div>`;
}
