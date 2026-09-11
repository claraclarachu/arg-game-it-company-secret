import { state } from '../../core/state.js';
import { trackOnboarding } from '../../main.js';

const tickets = [
  {
    key: 'INV-2024-0017',
    title: '官網首頁文案顯示錯誤 — Hero 標語與成立年份顯示錯誤',
    status: 'Done',
    assignee: 'Parker',
    priority: 'Medium',
    points: 2,
    epic: 'Frontend',
    desc: `【問題描述】
官網首頁 Hero 區塊與頁尾「關於 Nori」區塊文案顯示錯誤：
1. Hero 主標語顯示為「用一杯冰釀茶酒，連結人與希望」應為「用一杯冰釀茶酒，連結人與風味」
2. 公司成立年份顯示為「2018 創立」應為「2019 創立」
導致品牌調性不一致，客戶對公司歷史產生誤解，且與公司登記資料（2019-05 創立）不符。

【復現步驟】
1. 以訪客身份開啟官網首頁 https://nori.example/
2. 檢視首頁 Hero 區塊主標語（位於 /customer-portal/src/frontend/src/pages/Home.jsx）
3. 實際顯示：「Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望」
4. 捲動至頁尾「關於 Nori」區塊，查看成立年份文字
5. 實際顯示：「創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷」
6. 對比 /intranet/company_public/公司簡介.md 記載：2019 年 5 月創立

【預期結果 vs 實際結果】
預期：Hero 應顯示「連結人與風味」、年份應為 2019
實際：顯示「連結人與希望」、年份為 2018
檔案：/customer-portal/src/frontend/src/pages/Home.jsx 第 3-4 行

【影響範圍】
- 影響所有訪客首頁體驗（100% 流量），品牌文案錯誤
- SEO 與對外文宣不一致，可能被客戶截圖質疑專業度
- 無金流或資安影響，但影響品牌信任與對外一致性
- 嚴重度：中（Medium）／優先度：中

【根本原因】
Home.jsx 寫死文案時誤植，2018 為草稿年份未更新至 2019；slogan 複製貼上時將「風味」錯植為「希望」。

【修復方案】
由 Parker 將 Home.jsx 文案修正為「2019 創立」與「連結人與風味」，並提交 commit，經 Maggie 驗收後關閉。`,
    comments: [
      'Maggie: @Parker 這個首頁文案客戶有反應，Hero 那句「連結人與希望」應該是「連結人與風味」，還有年份 2018 應為 2019，麻煩幫忙修一下。檔案在 /customer-portal/src/frontend/src/pages/Home.jsx，改完記得 commit。',
      'Parker: 收到，已定位到 Home.jsx 第 3-4 行，slogan 與年份寫死錯誤，已修正並 commit。',
      'Maggie: 確認修好，本地驗證 Hero 顯示「風味」、年份 2019 正確，已關單。感謝！',
    ],
    attachments: [
      { name: 'Home.jsx', type: 'jsx', snippet: 'export default function Home(){ <h1>...連結人與希望</h1> <p>2018 創立</p> } // 應為 風味 / 2019' },
      { name: '公司簡介.md', type: 'md', snippet: '成立時間：2019 年 5 月 — 與首頁 2018 不一致' },
      { name: 'Home.jsx (fixed)', type: 'jsx', snippet: '+ <h1>...連結人與風味</h1>\n+ <p>2019 創立</p> // Parker fix 2024-02-14' },
    ],
    history: [
      { from: '—', to: 'To Do', by: 'Maggie', at: '2024-02-14' },
      { from: 'To Do', to: 'In Progress', by: 'Maggie', at: '2024-02-14' },
      { from: 'In Progress', to: 'Done', by: 'Parker', at: '2024-02-15' },
    ],
  },
  {
    key: 'INV-2024-0042',
    title: '修正 VIP 折扣計算錯誤 — VIP1 應為 90% 非 95%',
    status: 'To Do',
    assignee: 'Casey',
    priority: 'High',
    points: 3,
    epic: 'Billing',
    desc: `【問題描述】\nVIP 用戶訂單金額計算錯誤：目前 VIP 等級折扣比預期少 5%，導致 VIP 用戶實際支付過高。\n\n【復現步驟】\n1. 以 VIP1 身份建立訂單 (金額 1000)\n2. 實際扣款為 950 (95%)，預期應為 900 (90%)\n3. VIP2~VIP5 同樣偏移 5%\n\n【正確對照】\nVIP1 → 90% (0.90)\nVIP2 → 85% (0.85)\nVIP3 → 80% (0.80)\nVIP4 → 75% (0.75)\nVIP5 → 70% (0.70)\n\n`,
    comments: ['Maggie: @Casey 麻煩幫忙修一下，估計是/customer-portal/src/main/java/com/nori/OrderService.java裡vip折扣計算錯誤了\n看一下switch case, 不知道怎樣修可以到瀏覽器查一下相關資料。\n在vizual studio code找不到檔案的話，可以到SEARCH搜尋一下"switch","vip"等關鍵字 \n修好了記得到"SOURCE CONTROL" commit一下, 然後看 SonarQube 結果, 沒問題的話這張單會自動切到Done, 就好了。'],
    attachments: [
      { name: 'OrderService.java', type: 'java', snippet: 'switch(vipLv){case 1: price*=0.95; break;... // VIP1 應為 0.90' },
      { name: 'vip-discount-spec.md', type: 'md', snippet: 'VIP1 90% | VIP2 85% | VIP3 80% | VIP4 75% | VIP5 70%' },
    ],
    history: [
      { from: '—', to: 'To Do', by: 'Maggie', at: '2024-09-02' },
    ],
  },
  {
    key: 'INV-2024-0039',
    title: 'Payment Gateway Integration v3',
    status: 'In Progress',
    assignee: 'Jessie',
    priority: 'Medium',
    points: 8,
    epic: 'Payment',
    desc: '接入新的支付網關，注意 feeRate 配置來自 drinkId 映射 (drink-001/drink-002/drink-003)。\n\n風險：需確保費率與後端一致。',
    comments: [],
    attachments: [
      { name: 'feeRate-mapping.json', type: 'json', snippet: '{"drink-001":0.05,"drink-002":0.08,"drink-003":0.03,"default":0.03}' },
    ],
    history: [{ from: 'To Do', to: 'In Progress', by: 'Jessie', at: '2024-08-09' }],
  },
  {
    key: 'INV-2019-0003',
    title: '人力資源系統 — 開發票與薪資模組整合',
    status: 'Done',
    assignee: 'deleted user',
    priority: 'High',
    points: 3,
    epic: 'HR',
    desc: '人力資源管理系統位於 /internal/portal。庫存已同步, 有權限的員工才能進入此內部系統。',
    comments: ['deleted user: 開發完成, 可進行測試', 'Sawyer: 此系統有bug, 單純按下進行按鈕沒有反應, 多次點擊主標題後才能進入頁面, 請進行修正', 'deleted user: 已修正完成, 請再進行測試',  'Sawyer: 測試通過, 可正式啟用'],
    attachments: [
      { name: 'ScreenRecord_20191014.mp4', type: 'mp4', snippet: '測試影片：人力資源系統進入失敗' }
    ],
    history: [{ from: 'To Do', to: 'Done', by: 'deleted user', at: '2019-10-15' }],
  },
  // INV-2024-0043 will be added dynamically after Ch1 Event2 (10s after reading Nori all staff tree message)
  {
    key: 'INV-2024-0033',
    title: '報表顯示金額錯誤 — 需修正小數點四捨五入',
    status: 'To Do',
    assignee: 'Parker',
    priority: 'Medium',
    points: 3,
    epic: 'Sprint',
    desc: `路徑: 後台 > 報表查詢 > filter: 原材料支出 \nJQL: sprint = 24 AND status != Done`,
    comments: [],
    attachments: [],
    history: [],
  },
    {
    key: 'INV-2020-0003',
    title: '人力資源系統 — 關閉系統',
    status: 'Done',
    assignee: 'deleted user',
    priority: 'High',
    points: 3,
    epic: 'HR',
    desc: '人力資源管理系統將遷移到Zero System, 此系統將永久關閉。關閉前需確保所有資料已成功備份到新系統',
    comments: ['deleted user: 已完成關閉'],
    attachments: [
    ],
    history: [{ from: 'To Do', to: 'Done', by: 'deleted user', at: '2020-02-28' }],
  },
];

let dragKey = null;
let activeSwimlane = 'all'; // all | assignee | epic
let currentFilter = '';

function persistJira() {
  try {
    state.set('jiraTicketsData', JSON.parse(JSON.stringify(tickets)));
    state.set('jiraMeta', { activeSwimlane, currentFilter });
    state.save(true);
  } catch {}
}
function restoreJira() {
  try {
    const saved = state.get('jiraTicketsData');
    if (Array.isArray(saved) && saved.length) {
      // Replace tickets content with saved (preserve reference)
      tickets.length = 0;
      for (const t of saved) tickets.push(t);
    } else {
      // Check flag for 0043 — if flag indicates it should exist but not in array, add it
      if (state.hasFlag('ch1_event1_triggered') || (state.get('jiraTickets') && state.get('jiraTickets')['INV-2024-0043'])) {
        if (!tickets.some(x=>x.key==='INV-2024-0043')) {
          addTicket0043();
          // addTicket0043 will persist again, avoid recursion
          return;
        }
      }
    }
    const meta = state.get('jiraMeta');
    if (meta && typeof meta === 'object') {
      if (typeof meta.activeSwimlane === 'string') activeSwimlane = meta.activeSwimlane;
      if (typeof meta.currentFilter === 'string') currentFilter = meta.currentFilter;
    }
    // If system has ch0_vip_fixed flag, ensure 0042 is Done
    if (state.hasFlag('ch0_vip_fixed')) {
      const t = tickets.find(x=>x.key==='INV-2024-0042');
      if (t && t.status !== 'Done') t.status = 'Done';
    }
    if (state.hasFlag('ch1_0043_committed')) {
      const t = tickets.find(x=>x.key==='INV-2024-0043');
      if (t && t.status !== 'Done') t.status = 'Done';
    }
  } catch {}
}

export function mountJira() {
  restoreJira();
  const root = document.getElementById('view-jira');
  if (!root) return;
  root.innerHTML = `
    <div class="jira">
      <div class="jira__app">
        <nav class="jira__sidebar" aria-label="Jiua project navigation">
          <div class="jira__sidebar-logo" title="Jiua">JU</div>
          <div class="jira__sidebar-nav">
            <div class="jira__sidebar-item active" title="看板 Board"><i class="fa-solid fa-table-columns"></i><span>看板</span></div>
            <div class="jira__sidebar-item" title="待辦清單"><i class="fa-solid fa-list-check"></i><span>清單</span></div>
            <div class="jira__sidebar-item" title="時程表"><i class="fa-solid fa-chart-gantt"></i><span>時程</span></div>
            <div class="jira__sidebar-item" title="程式碼"><i class="fa-solid fa-code"></i><span>程式碼</span></div>
          </div>
          <div class="jira__sidebar-bottom">
            <div class="jira__sidebar-item" title="設定"><i class="fa-solid fa-gear"></i></div>
            <div class="jira__sidebar-item" title="說明"><i class="fa-solid fa-circle-question"></i></div>
          </div>
        </nav>
        <div class="jira__main">
          <header class="jira__header">
            <div class="jira__breadcrumbs">
              <a>專案</a><span class="sep">/</span><a>Nori Drinks Supply</a><span class="sep">/</span><a>NOR</a><span class="sep">/</span><b style="color:#1291ff">Nori Board</b>
            </div>
            <div class="jira__header-row">
              <div class="jira__board-title"><i class="fa-solid fa-table-columns"></i> Nori Board <span class="badge">Sprint 24</span><span class="badge badge--count">5 tickets</span></div>
              <div class="jira__header-actions">
                <button class="jira__header-btn"><i class="fa-solid fa-share-nodes"></i> 分享</button>
                <button class="jira__header-btn primary"><i class="fa-solid fa-plus"></i> 建立</button>
              </div>
            </div>
            <div class="jira__board-nav">
              <a class="active">看板</a><a>清單</a><a>日曆</a><a>時間軸</a><a>摘要</a>
            </div>
          </header>
          <div class="jira__toolbar">
            <input id="jiraSearch" class="input" placeholder="搜尋 / JQL: status = &quot;To Do&quot; AND text ~ &quot;420&quot;  |  assignee = 你" style="min-width:280px;flex:1;max-width:420px" />
            <select id="jiraAssignee" class="select" style="width:140px">
              <option value="">全部經辦人</option>
              <option value="你">你</option>
              <option value="Casey">Casey</option>
              <option value="finance-bot">finance-bot</option>
              <option value="ops">ops</option>
            </select>
            <select id="jiraSwimlane" class="select" style="width:140px">
              <option value="all">群組：無</option>
              <option value="assignee">群組：經辦人</option>
              <option value="epic">群組：Epic</option>
            </select>
            <span class="small muted" style="margin-left:auto;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-circle-info"></i> JQL: <code>key = INV-2024-0042</code></span>
          </div>
          <div class="jira__meta">
            <span>拖拉卡片可在 To Do ↔ In Progress ↔ Done 間移動（模擬真實看板）· 點擊卡片看詳情</span>
            <span>範例：<code>status = "Done"</code> · <code>assignee = 你 AND text ~ "drink"</code></span>
          </div>
          <div id="jiraBoard" class="jira__board"></div>
        </div>
      </div>
      <div id="jiraDetailBackdrop" class="jira__backdrop" style="display:none"></div>
      <div id="jiraDetail" class="jira__detail" style="display:none"></div>
    </div>
  `;
  bindJira();
  renderBoard();
  // backdrop close
  document.getElementById('jiraDetailBackdrop')?.addEventListener('click', () => {
    document.getElementById('jiraDetail').style.display='none';
    document.getElementById('jiraDetailBackdrop').style.display='none';
  });
}

function bindJira() {
  document.getElementById('jiraSearch')?.addEventListener('input', e => { currentFilter = e.target.value; persistJira(); renderBoard(); });
  document.getElementById('jiraAssignee')?.addEventListener('change', e => { currentFilter = document.getElementById('jiraSearch').value; persistJira(); renderBoard(); });
  document.getElementById('jiraSwimlane')?.addEventListener('change', e => { activeSwimlane = e.target.value; persistJira(); renderBoard(); });
}

function parseJQL(q) {
  if (!q.trim()) return () => true;
  // Very small parser: split by AND (ignore OR for now), handle `field operator value`
  // Supported: status, assignee, key, epic, text, priority
  const clauses = q.split(/\s+AND\s+/i);
  const preds = clauses.map(cl => {
    const m = cl.match(/^\s*(status|assignee|key|epic|text|priority)\s*(=|~)\s*"?([^"]+)"?\s*$/i);
    if (!m) {
      // fallback simple contains
      const kw = cl.toLowerCase().replace(/["']/g,'');
      return (t) => (t.key + t.title + t.desc + t.assignee + t.epic).toLowerCase().includes(kw);
    }
    const [, field, op, rawVal] = m;
    const val = rawVal.trim().replace(/^"|"$/g,'').toLowerCase();
    return (t) => {
      const f = field.toLowerCase();
      let target = '';
      if (f === 'status') target = t.status.toLowerCase();
      else if (f === 'assignee') target = t.assignee.toLowerCase();
      else if (f === 'key') target = t.key.toLowerCase();
      else if (f === 'epic') target = t.epic.toLowerCase();
      else if (f === 'priority') target = t.priority.toLowerCase();
      else if (f === 'text') target = (t.key + ' ' + t.title + ' ' + t.desc).toLowerCase();
      if (op === '=') return target === val;
      return target.includes(val); // ~
    };
  });
  return (t) => preds.every(p => p(t));
}

function renderBoard() {
  const board = document.getElementById('jiraBoard');
  if (!board) return;
  const assigneeFilter = document.getElementById('jiraAssignee')?.value || '';
  const q = currentFilter;
  const jqlPred = parseJQL(q);
  let filtered = tickets.filter(t => jqlPred(t));
  if (assigneeFilter) filtered = filtered.filter(t => t.assignee === assigneeFilter);

  // If swimlane, group by that
  if (activeSwimlane !== 'all') {
    const key = activeSwimlane; // assignee|epic
    const groups = {};
    filtered.forEach(t => {
      const g = t[key] || '未分類';
      if (!groups[g]) groups[g] = [];
      groups[g].push(t);
    });
    board.innerHTML = Object.entries(groups).map(([gname, list]) => {
      const cols = { 'To Do': [], 'In Progress': [], 'Done': [] };
      list.forEach(t => cols[t.status]?.push(t));
      return `
        <div class="jira__swimlane">
          <div class="jira__swimlane-header">Group：${gname} (${list.length})</div>
          <div class="jira__board">
            ${Object.entries(cols).map(([col, arr]) => colHtml(col, arr)).join('')}
          </div>
        </div>
      `;
    }).join('') || '<div class="muted small" style="padding:12px">無符合條件的票據 — 試 JQL: status = "To Do"</div>';
  } else {
    const cols = { 'To Do': [], 'In Progress': [], 'Done': [] };
    filtered.forEach(t => cols[t.status]?.push(t));
    board.innerHTML = Object.entries(cols).map(([col, list]) => colHtml(col, list)).join('');
  }
  bindBoardDnD();
}

function colHtml(col, list) {
  const colIcon = col === 'To Do' ? 'fa-solid fa-circle' : col === 'In Progress' ? 'fa-solid fa-spinner' : 'fa-solid fa-circle-check';
  const colColor = col === 'To Do' ? '#0052cc' : col === 'In Progress' ? '#ff991f' : '#00875a';
  return `
    <div class="jira__col" data-col="${col}">
      <div class="jira__col-header"><i class="${colIcon}" style="color:${colColor};font-size:10px"></i> ${col} <span class="count">${list.length}</span></div>
      <div class="jira__col-line"></div>
      <div class="jira__dropzone" data-col="${col}">
        ${list.map(t => ticketHtml(t)).join('') || '<div class="jira__empty">拖曳至此</div>'}
      </div>
    </div>
  `;
}

function getTicketType(t){
  if (t.key.includes('0042') || t.epic === 'Billing') return { cls:'story', icon:'fa-solid fa-bookmark', label:'Story' };
  if (t.epic === 'HR' || t.key.includes('0003')) return { cls:'task', icon:'fa-solid fa-square-check', label:'Task' };
  if (t.epic === 'Frontend') return { cls:'task', icon:'fa-solid fa-square-check', label:'Task' };
  if (t.priority === 'High' && t.status !== 'Done') return { cls:'bug', icon:'fa-solid fa-bug', label:'Bug' };
  return { cls:'story', icon:'fa-solid fa-bookmark', label:'Story' };
}
function ticketHtml(t) {
  const type = getTicketType(t);
  const priCls = t.priority === 'High' ? 'High' : t.priority === 'Medium' ? 'Medium' : 'Low';
  const priIcon = t.priority === 'High' ? 'fa-solid fa-angle-up' : t.priority === 'Medium' ? 'fa-solid fa-equals' : 'fa-solid fa-angle-down';
  const assigneeInitial = t.assignee ? t.assignee.charAt(0).toUpperCase() : '?';
  const assigneeColor = t.assignee === 'Casey' ? '#0052cc' : t.assignee === 'Parker' ? '#0065ff' : t.assignee === 'Jessie' ? '#6554c0' : '#6b778c';
  return `
    <div class="ticket" draggable="true" data-key="${t.key}">
      <div class="ticket__top">
        <span class="ticket__type ${type.cls}" title="${type.label}"><i class="${type.icon}"></i></span>
        <span class="ticket__key">${t.key}</span>
        <span style="margin-left:auto;font-size:10px;color:#6b778c">${t.epic}</span>
      </div>
      <div class="ticket__title">${t.title}</div>
      ${t.epic ? `<span class="ticket__epic">${t.epic}</span>` : ''}
      <div class="ticket__meta">
        <span class="pri pri--${priCls}" title="${t.priority}"><i class="${priIcon}"></i></span>
        <span class="ticket__points">${t.points}</span>
        ${t.attachments.length ? `<span class="ticket__attach"><i class="fa-solid fa-paperclip"></i> ${t.attachments.length}</span>` : ''}
        <span class="ticket__assignee" style="background:${assigneeColor}">${assigneeInitial}</span>
      </div>
    </div>
  `;
}

function bindBoardDnD() {
  document.querySelectorAll('.ticket').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragKey = el.dataset.key;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', e => { el.classList.remove('dragging'); dragKey = null; });
    el.addEventListener('click', () => openTicket(el.dataset.key));
  });
  document.querySelectorAll('.jira__dropzone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => { zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('drag-over');
      const col = zone.dataset.col;
      if (!dragKey) return;
      const t = tickets.find(x => x.key === dragKey);
      if (!t || t.status === col) return;
      const old = t.status;
      t.status = col;
      t.history.push({ from: old, to: col, by: '你', at: new Date().toISOString().slice(0,10) });
      state.set('jiraTickets.' + t.key, true);
      persistJira();
      renderBoard();
      openTicket(t.key);
    });
  });
}

function openTicket(key) {
  const t = tickets.find(x => x.key === key);
  const d = document.getElementById('jiraDetail');
  const bd = document.getElementById('jiraDetailBackdrop');
  if (!t || !d) return;
  state.set('jiraTickets.' + key, true);

  // Track onboarding: viewing INV-2024-0042
  if (key === 'INV-2024-0042') {
    trackOnboarding('jiua_viewed');
  }

  if (bd) bd.style.display = 'block';
  d.style.display = 'flex';
  const type = getTicketType(t);
  const statusCls = t.status==='Done'?'badge--done':t.status==='In Progress'?'badge--inprogress':'badge--todo';
  d.innerHTML = `
    <div class="jira__detail-head">
      <div style="flex:1;min-width:0">
        <div class="jira__detail-key"><span class="ticket__type ${type.cls}" style="width:18px;height:18px;font-size:10px"><i class="${type.icon}"></i></span> ${t.key} · ${t.epic}</div>
        <div class="jira__detail-title">${t.title}</div>
      </div>
      <span class="badge ${statusCls}">${t.status}</span>
      <button class="jira__detail-close" id="jiraDetailClose" aria-label="關閉"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="jira__detail-body">
      <div class="jira__detail-main">
        <div>
          <div class="jira__detail-label">描述</div>
          <pre class="jira__detail-desc">${t.desc}</pre>
        </div>
        <div>
          <div class="jira__detail-label">附件 — ${t.attachments.length}</div>
          <div style="display:grid;gap:8px">
            ${t.attachments.length ? t.attachments.map(a => `
              <div class="jira__detail-card" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
                <div style="min-width:0"><div style="font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-paperclip" style="color:#6b778c"></i> ${a.name}</div><div class="small" style="color:#6b778c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.type} · ${a.snippet.slice(0,80)}</div></div>
                <button class="jira__header-btn" style="padding:4px 10px;flex-shrink:0" data-attach="${a.name}">檢視</button>
              </div>
            `).join('') : '<div class="small" style="color:#6b778c">無附件</div>'}
          </div>
        </div>
        <div>
          <div class="jira__detail-label">活動 — 評論 ${t.comments.length}</div>
          <div style="display:grid;gap:8px">
            ${t.comments.map(c => `<div class="jira__detail-card" style="padding:10px;font-size:13px;line-height:1.5">💬 ${c}</div>`).join('')}
            ${!t.comments.length ? '<div class="small" style="color:#6b778c">尚無評論 — 成為第一個留言的人</div>' : ''}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <div style="width:28px;height:28px;border-radius:50%;background:#0052cc;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">你</div>
            <input id="jiraCommentInput" class="input" placeholder="新增評論..." style="flex:1" />
            <button class="jira__header-btn primary" id="jiraAddComment">留言</button>
          </div>
        </div>
      </div>
      <div class="jira__detail-side">
        <div>
          <div class="jira__detail-label">詳細資訊</div>
          <div class="jira__detail-card">
            <div class="jira__detail-row"><b>狀態</b><span class="badge ${statusCls}" style="font-size:11px">${t.status}</span></div>
            <div class="jira__detail-row"><b>經辦人</b><span>${t.assignee}</span></div>
            <div class="jira__detail-row"><b>Epic</b><span>${t.epic}</span></div>
            <div class="jira__detail-row"><b>優先度</b><span>${t.priority}</span></div>
            <div class="jira__detail-row"><b>Story points</b><span>${t.points}</span></div>
            <div class="jira__detail-row"><b>類型</b><span>${type.label}</span></div>
          </div>
        </div>
        <div>
          <div class="jira__detail-label">工作流</div>
          <div style="display:grid;gap:6px">
            ${t.history.length ? t.history.map(h => `<div class="small" style="display:flex;align-items:center;gap:6px"><span class="badge" style="font-size:11px">${h.from} → ${h.to}</span><span style="font-size:11px;color:#6b778c">by ${h.by} @ ${h.at}</span></div>`).join('') : '<div class="small" style="color:#6b778c">無歷史</div>'}
          </div>
          <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
            ${['To Do','In Progress','Done'].filter(s=>s!==t.status).map(s=>`<button class="jira__header-btn" data-move="${s}">移至 ${s}</button>`).join('')}
          </div>
        </div>
        <div style="margin-top:auto;padding-top:12px;border-top:1px solid #dfe1e6;display:flex;gap:8px">
          <button class="jira__header-btn" style="flex:1" id="jiraDetailClose2">關閉</button>
        </div>
      </div>
    </div>
  `;
  d.querySelectorAll('[data-attach]').forEach(b => {
    b.addEventListener('click', () => {
      const name = b.dataset.attach;
      const att = t.attachments.find(x=>x.name===name);
      if (!att) return;
      // If diff/json, show in modal like code
      alert(`${att.name}\n\n${att.snippet}`);
    });
  });
  d.querySelectorAll('[data-move]').forEach(b => {
    b.addEventListener('click', () => {
      const to = b.dataset.move;
      const from = t.status;
      t.status = to;
      t.history.push({ from, to, by: '你', at: new Date().toISOString().slice(0,10) });
      persistJira();
      renderBoard();
      openTicket(key);
    });
  });
  document.getElementById('jiraAddComment')?.addEventListener('click', () => {
    const inp = document.getElementById('jiraCommentInput');
    const val = inp?.value.trim();
    if (!val) return;
    t.comments.push(`你: ${val}`);
    inp.value = '';
    persistJira();
    openTicket(key);
    renderBoard();
  });
  function closeDetail(){ d.style.display='none'; const b=document.getElementById('jiraDetailBackdrop'); if(b) b.style.display='none'; }
  document.getElementById('jiraDetailClose')?.addEventListener('click', closeDetail);
  document.getElementById('jiraDetailClose2')?.addEventListener('click', closeDetail);
  document.getElementById('jiraCommentInput')?.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); document.getElementById('jiraAddComment')?.click(); } });
  // esc to close
  const escHandler = (e)=>{ if(e.key==='Escape'){ closeDetail(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);
}

export function markTicketDone(key) {
  const t = tickets.find(x => x.key === key);
  if (!t) return false;
  if (t.status === 'Done') {
    // still ensure persistence flag is correct
    if (key==='INV-2024-0042' && !state.hasFlag('ch0_vip_fixed')) state.setFlag('ch0_vip_fixed', true);
    return true;
  }
  const from = t.status;
  t.status = 'Done';
  t.history.push({ from, to: 'Done', by: 'Casey', at: new Date().toISOString().slice(0,10) });
  state.set('jiraTickets.' + key, true);
  if (key==='INV-2024-0042') state.setFlag('ch0_vip_fixed', true);
  if (key==='INV-2024-0043') state.setFlag('ch1_0043_committed', true);
  persistJira();
  // refresh board if mounted
  const board = document.getElementById('jiraBoard');
  if (board) {
    renderBoard();
    openTicket(key);
  }
  return true;
}
export function addTicket0043() {
  if (tickets.some(t => t.key === 'INV-2024-0043')) return;
  tickets.push({
    key: 'INV-2024-0043',
    title: '移除內網系統異常網頁的入口',
    status: 'To Do',
    assignee: 'Casey',
    priority: 'Medium',
    points: 2,
    epic: 'internal system',
    desc: `【問題描述】使用內網系統時進入到異常網頁，移除不明網頁導向\n\n【復現步驟】\n1. 在內網系統 搜尋欄搜尋 'https://nori-intranet/internal/portal'\n2. 跳轉至異常網頁\n3. 需移除入口`,
    comments: ['Maggie: @Casey 麻煩幫忙修一下，這個搜尋異常有點煩。把沒用的code整個移除就好'],
    attachments: [
      { name: 'SearchBar.jsx', type: 'jsx', snippet: '// Legacy filesystem compatibility\nconst legacyRoutes = { archive: "/internal/portal" ... } // No longer used' }
    ],
    history: [
      { from: '—', to: 'To Do', by: 'Maggie', at: new Date().toISOString().slice(0,10) },
    ],
  });
  persistJira();
  // Refresh board if mounted
  const board = document.getElementById('jiraBoard');
  if (board) {
    window.dispatchEvent(new CustomEvent('jira:ticketAdded', { detail: 'INV-2024-0043' }));
  }
  // Also try to re-render if mountJira is available via global
  try {
    const ev = new CustomEvent('jira:refresh');
    window.dispatchEvent(ev);
  } catch {}
}
export function getTickets() { return tickets; }
export function openTicketByKey(key) { openTicket(key); }

function renderBurndown() { /* removed Sprint 24 report */ }
