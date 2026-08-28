import { state } from '../../core/state.js';

const tickets = [
  { key: 'INV-2024-0042', title: '修復計費模組邊緣案例 — 特定金額計算錯誤', status: 'To Do', assignee: '你', desc: `復現步驟: 使用特定總金額觸發計費流程，觀察是否重新導向到內部頁。\n\n關聯檔案: src/billing/service.js#calculateAmount\n評論: @qa-lee "這個 420.69 的數好像會跳到一個內部 portal，之前 finance 說別碰"` , comments: ['qa-lee: 別動 portal，那邊有 legacy code', 'pm: 按時修復，其他不用管'] },
  { key: 'INV-2024-0039', title: 'Payment Gateway Integration v3', status: 'In Progress', assignee: 'finance-bot', desc: '接入新的支付網關，注意 feeRate 配置來自 vendorId 映射 (cocoa/bean/leaf/crystal)。', comments: [] },
  { key: 'INV-2024-0011', title: '原材料採購系統 — 庫存盤點', status: 'Done', assignee: 'ops', desc: '採購系統位於 /internal/portal，需 X-Internal-Token。庫存代號已同步。', comments: [] },
];

export function mountJira() {
  const root = document.getElementById('view-jira');
  if (!root) return;
  root.innerHTML = `
    <div class="jira">
      <div style="display:flex;gap:8px;align-items:center">
        <h2 style="margin:0">Jira · Acme Board</h2>
        <span class="badge">Sprint 24</span>
        <input id="jiraSearch" class="input" placeholder="搜尋 ticket (JQL: text ~ '420')" style="max-width:320px;margin-left:auto" />
      </div>
      <div id="jiraBoard" class="jira__board"></div>
      <div id="jiraDetail" class="card" style="display:none"></div>
    </div>
  `;
  renderBoard();
  document.getElementById('jiraSearch')?.addEventListener('input', e => renderBoard(e.target.value));
}

function renderBoard(filter = '') {
  const board = document.getElementById('jiraBoard');
  if (!board) return;
  const q = filter.toLowerCase();
  const filtered = tickets.filter(t => !q || t.key.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  const cols = { 'To Do': [], 'In Progress': [], 'Done': [] };
  filtered.forEach(t => cols[t.status]?.push(t));
  board.innerHTML = Object.entries(cols).map(([col, list]) => `
    <div class="jira__col"><h3>${col}</h3>
      ${list.map(t => `<div class="ticket" data-key="${t.key}"><div class="ticket__key">${t.key}</div><div class="ticket__title">${t.title}</div><div class="ticket__meta">${t.assignee}</div></div>`).join('') || '<div class="muted small">—</div>'}
    </div>
  `).join('');
  board.querySelectorAll('.ticket').forEach(el => el.addEventListener('click', () => openTicket(el.dataset.key)));
}

function openTicket(key) {
  const t = tickets.find(x => x.key === key);
  const d = document.getElementById('jiraDetail');
  if (!t || !d) return;
  state.set('jiraTickets.' + key, true);
  d.style.display = 'block';
  d.innerHTML = `<h3 style="margin:0">${t.key} · ${t.title}</h3>
    <div class="small muted" style="margin:6px 0">Status: ${t.status} · Assignee: ${t.assignee}</div>
    <pre class="mono" style="white-space:pre-wrap;background:var(--bg-primary);padding:10px;border-radius:6px;border:1px solid var(--border)">${t.desc}</pre>
    <div style="margin-top:8px">${t.comments.map(c => `<div class="small" style="padding:4px 0;border-bottom:1px solid var(--border)">💬 ${c}</div>`).join('')}</div>
    <div style="margin-top:8px"><button class="btn" onclick="document.getElementById('jiraDetail').style.display='none'">關閉</button></div>`;
}
