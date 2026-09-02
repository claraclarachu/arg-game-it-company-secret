import { state } from '../../core/state.js';
import { trackOnboarding } from '../../main.js';

const tickets = [
  {
    key: 'INV-2024-0042',
    title: '修正 VIP 折扣計算錯誤 — VIP1 應為 90% 非 95%',
    status: 'To Do',
    assignee: 'Casey',
    priority: 'High',
    points: 3,
    epic: 'Billing',
    desc: `【問題描述】\nVIP 用戶訂單金額計算錯誤：目前 VIP 等級折扣比預期少 5%，導致 VIP 用戶實際支付過高。\n\n【復現步驟】\n1. 以 VIP1 身份建立訂單 (金額 1000)\n2. 實際扣款為 950 (95%)，預期應為 900 (90%)\n3. VIP2~VIP5 同樣偏移 5%\n\n【錯誤代碼】 src/main/java/com/acme/OrderService.java#calculateVipPrice\nswitch(vipLv){\n  case 1: price*=0.95; break; // 應為 0.90\n  case 2: price*=0.90; break; // 應為 0.85\n  case 3: price*=0.85; break; // 應為 0.80\n  case 4: price*=0.80; break; // 應為 0.75\n  case 5: price*=0.75; break; // 應為 0.70\n  default: break;\n}\n\n【正確對照】\nVIP1 → 90% (0.90)\nVIP2 → 85% (0.85)\nVIP3 → 80% (0.80)\nVIP4 → 75% (0.75)\nVIP5 → 70% (0.70)\n\n【操作指引】\n請在 Vizual Studio Code 編輯 OrderService.java 修正上述 switch，並透過左側 Source Control 提交 (Commit)。\n• 若提交內容仍有錯誤，畫面中央會彈出 SonarQube 掃描錯誤並標示行號\n• 若正確，票據將自動標記為 Done 並跳轉回 Jira\n\n關聯檔案: src/main/java/com/acme/OrderService.java`,
    comments: ['qa-lee: 是 switch 寫錯，VIP1 少打 5% 折扣', 'Maggie: @Casey 麻煩幫忙修一下，記得 commit 後看 SonarQube 結果', 'pm: 修完請直接 commit，不用另開分支'],
    attachments: [
      { name: 'OrderService.java', type: 'java', snippet: 'switch(vipLv){case 1: price*=0.95; break;... // VIP1 應為 0.90' },
      { name: 'vip-discount-spec.md', type: 'md', snippet: 'VIP1 90% | VIP2 85% | VIP3 80% | VIP4 75% | VIP5 70%' },
    ],
    history: [
      { from: '—', to: 'To Do', by: 'Maggie', at: '2024-08-12' },
    ],
  },
  {
    key: 'INV-2024-0039',
    title: 'Payment Gateway Integration v3',
    status: 'In Progress',
    assignee: 'finance-bot',
    priority: 'Medium',
    points: 8,
    epic: 'Payment',
    desc: '接入新的支付網關，注意 feeRate 配置來自 vendorId 映射 (cocoa/bean/leaf/crystal)。\n\n風險：此模組含洗錢邏輯，手續費即分潤。',
    comments: [],
    attachments: [
      { name: 'feeRate-mapping.json', type: 'json', snippet: '{"cocoa":0.15,"bean":0.22,"leaf":0.12,"crystal":0.30,"default":0.03}' },
    ],
    history: [{ from: 'To Do', to: 'In Progress', by: 'finance-bot', at: '2024-08-09' }],
  },
  {
    key: 'INV-2024-0011',
    title: '原材料採購系統 — 庫存盤點',
    status: 'Done',
    assignee: 'ops',
    priority: 'Low',
    points: 3,
    epic: 'Supply',
    desc: '採購系統位於 /internal/portal，需 X-Internal-Token。庫存代號已同步。\n\n代號對照：COCOA=可卡因, BEAN=海洛因, LEAF=大麻, CRYSTAL=冰毒',
    comments: ['ops: 庫存 COCOA 420 已盤點'],
    attachments: [
      { name: '架構圖.pdf', type: 'pdf', snippet: '實為物流路線圖：台灣→東南亞→北美' },
      { name: 'ledger.db', type: 'db', snippet: 'SQLite 匯出位於 /internal/portal/export' },
    ],
    history: [{ from: 'To Do', to: 'Done', by: 'ops', at: '2024-08-07' }],
  },
  {
    key: 'INV-2024-0033',
    title: 'Sprint 24 燃盡圖異常 — 故事點未下降',
    status: 'To Do',
    assignee: '你',
    priority: 'Medium',
    points: 3,
    epic: 'Sprint',
    desc: `Sprint 燃盡圖在 Day 4 後持平，疑似隱藏任務未顯式。\nJQL: sprint = 24 AND status != Done`,
    comments: ['scrum-master: 檢查隱藏 Epic'],
    attachments: [],
    history: [],
  },
];

let dragKey = null;
let activeSwimlane = 'all'; // all | assignee | epic
let currentFilter = '';

export function mountJira() {
  const root = document.getElementById('view-jira');
  if (!root) return;
  root.innerHTML = `
    <div class="jira">
      <div class="jira__topbar">
        <div class="jira__title">
          <h2 style="margin:0">Jira · Acme Board</h2>
          <span class="badge">Sprint 24</span>
          <span class="badge" style="background:var(--accent);color:#fff;border-color:var(--accent)">4 tickets</span>
        </div>
        <div class="jira__filters">
          <input id="jiraSearch" class="input" placeholder="搜尋 / JQL: status = &quot;To Do&quot; AND text ~ &quot;420&quot;  |  assignee = 你" style="min-width:280px" />
          <select id="jiraAssignee" class="select" style="width:140px">
            <option value="">全部經辦人</option>
            <option value="你">你</option>
            <option value="finance-bot">finance-bot</option>
            <option value="ops">ops</option>
          </select>
          <select id="jiraSwimlane" class="select" style="width:140px">
            <option value="all">泳道：無</option>
            <option value="assignee">泳道：經辦人</option>
            <option value="epic">泳道：Epic</option>
          </select>
        </div>
      </div>

      <div class="jira__meta">
        <span class="small muted">拖拉卡片可在 To Do ↔ In Progress ↔ Done 間移動（模擬真實看板）· 點擊卡片看詳情/附件/歷史</span>
        <span class="small muted">JQL 範例: <code>status = "Done"</code> · <code>assignee = 你 AND text ~ "cocoa"</code> · <code>key = INV-2024-0042</code></span>
      </div>

      <div id="jiraBoard" class="jira__board"></div>
      <div id="jiraDetail" class="card" style="display:none"></div>

      <div class="jira__report">
        <div class="jira__report-header">
          <h3 style="margin:0">Sprint 24 報表 · 燃盡圖</h3>
          <span class="small muted">假資料 · 用於 Phase 3 展示</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 320px;gap:12px;align-items:start">
          <div class="jira__burndown">
            <svg id="burndownSvg" viewBox="0 0 400 160" width="100%" height="160" style="display:block"></svg>
            <div class="small muted" style="margin-top:6px">理想 (灰虛線) vs 實際 (藍) — Day 4 後持平暗示隱藏任務</div>
          </div>
          <div class="card" style="padding:10px">
            <div class="small" style="font-weight:600">Sprint 統計</div>
            <div class="small muted" style="margin-top:6px">總故事點: 19</div>
            <div class="small muted">已完成: 3 (INV-2024-0011)</div>
            <div class="small muted">進行中: 8</div>
            <div class="small muted">待辦: 8</div>
            <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:16%;height:100%;background:var(--accent)"></div></div>
            <div class="small muted" style="margin-top:4px">16% 完成 — 落後</div>
          </div>
        </div>
      </div>
    </div>
  `;
  bindJira();
  renderBoard();
  renderBurndown();
}

function bindJira() {
  document.getElementById('jiraSearch')?.addEventListener('input', e => { currentFilter = e.target.value; renderBoard(); });
  document.getElementById('jiraAssignee')?.addEventListener('change', e => { currentFilter = document.getElementById('jiraSearch').value; renderBoard(); });
  document.getElementById('jiraSwimlane')?.addEventListener('change', e => { activeSwimlane = e.target.value; renderBoard(); });
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
          <div class="jira__swimlane-header">泳道：${gname} (${list.length})</div>
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
  return `
    <div class="jira__col" data-col="${col}">
      <h3>${col} <span class="badge" style="margin-left:6px">${list.length}</span></h3>
      <div class="jira__dropzone" data-col="${col}">
        ${list.map(t => ticketHtml(t)).join('') || '<div class="muted small" style="padding:6px;border:1px dashed var(--border);border-radius:6px;text-align:center">拖曳至此</div>'}
      </div>
    </div>
  `;
}

function ticketHtml(t) {
  const priColor = t.priority === 'High' ? 'var(--error)' : t.priority === 'Medium' ? 'var(--warning)' : 'var(--success)';
  return `
    <div class="ticket" draggable="true" data-key="${t.key}" style="border-left:3px solid ${priColor}">
      <div class="ticket__key">${t.key} · ${t.priority}</div>
      <div class="ticket__title">${t.title}</div>
      <div class="ticket__meta">${t.assignee} · ${t.epic} · ${t.points}pts</div>
      ${t.attachments.length ? `<div class="small muted" style="margin-top:4px">📎 ${t.attachments.length} 附件</div>` : ''}
    </div>
  `;
}

function bindBoardDnD() {
  document.querySelectorAll('.ticket').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragKey = el.dataset.key;
      el.style.opacity = '0.5';
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', e => { el.style.opacity = '1'; dragKey = null; });
    el.addEventListener('click', () => openTicket(el.dataset.key));
  });
  document.querySelectorAll('.jira__dropzone').forEach(zone => {
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.background = 'var(--bg-tertiary)'; });
    zone.addEventListener('dragleave', () => { zone.style.background = ''; });
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.style.background = '';
      const col = zone.dataset.col;
      if (!dragKey) return;
      const t = tickets.find(x => x.key === dragKey);
      if (!t || t.status === col) return;
      const old = t.status;
      t.status = col;
      t.history.push({ from: old, to: col, by: '你', at: new Date().toISOString().slice(0,10) });
      state.set('jiraTickets.' + t.key, true);
      renderBoard();
      openTicket(t.key);
    });
  });
}

function openTicket(key) {
  const t = tickets.find(x => x.key === key);
  const d = document.getElementById('jiraDetail');
  if (!t || !d) return;
  state.set('jiraTickets.' + key, true);

  // Track onboarding: viewing INV-2024-0042
  if (key === 'INV-2024-0042') {
    trackOnboarding('jira_viewed');
  }

  d.style.display = 'block';
  d.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
      <h3 style="margin:0">${t.key} · ${t.title}</h3>
      <span class="badge" style="background:${t.status==='Done'?'var(--success)':t.status==='In Progress'?'var(--warning)':'var(--border)'};color:${t.status==='Done'?'#fff':'var(--fg-primary)'}">${t.status}</span>
    </div>
    <div class="small muted" style="margin:6px 0">經辦人: ${t.assignee} · Epic: ${t.epic} · 優先度: ${t.priority} · 點數: ${t.points}</div>
    <pre class="mono" style="white-space:pre-wrap;background:var(--bg-primary);padding:10px;border-radius:6px;border:1px solid var(--border)">${t.desc}</pre>

    <div style="margin-top:12px">
      <b class="small">附件 (${t.attachments.length})</b>
      <div style="margin-top:6px;display:grid;gap:6px">
        ${t.attachments.length ? t.attachments.map(a => `
          <div class="card" style="padding:8px;display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-weight:600;font-size:13px">📎 ${a.name}</div><div class="small muted">${a.type} · ${a.snippet.slice(0,60)}</div></div>
            <button class="btn" style="padding:4px 8px" data-attach="${a.name}">檢視</button>
          </div>
        `).join('') : '<div class="small muted">無附件</div>'}
      </div>
    </div>

    <div style="margin-top:12px">
      <b class="small">歷史 / 工作流</b>
      <div style="margin-top:6px;border-left:2px solid var(--border);padding-left:8px;display:grid;gap:4px">
        ${t.history.length ? t.history.map(h => `<div class="small"><span class="badge">${h.from} → ${h.to}</span> by ${h.by} @ ${h.at}</div>`).join('') : '<div class="small muted">無歷史</div>'}
      </div>
      <div style="margin-top:8px;display:flex;gap:6px">
        ${['To Do','In Progress','Done'].filter(s=>s!==t.status).map(s=>`<button class="btn" data-move="${s}">移至 ${s}</button>`).join('')}
      </div>
    </div>

    <div style="margin-top:12px">
      <b class="small">評論 (${t.comments.length})</b>
      <div style="margin-top:6px;display:grid;gap:6px">
        ${t.comments.map(c => `<div class="small card" style="padding:8px;background:var(--bg-primary)">💬 ${c}</div>`).join('')}
      </div>
      <div style="display:flex;gap:6px;margin-top:8px">
        <input id="jiraCommentInput" class="input" placeholder="新增評論..." style="flex:1" />
        <button class="btn primary" id="jiraAddComment">留言</button>
      </div>
    </div>

    <div style="margin-top:12px;text-align:right">
      <button class="btn" onclick="document.getElementById('jiraDetail').style.display='none'">關閉</button>
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
    openTicket(key);
    renderBoard();
  });
}

export function markTicketDone(key) {
  const t = tickets.find(x => x.key === key);
  if (!t) return false;
  if (t.status === 'Done') return true;
  const from = t.status;
  t.status = 'Done';
  t.history.push({ from, to: 'Done', by: 'Casey', at: new Date().toISOString().slice(0,10) });
  state.set('jiraTickets.' + key, true);
  state.setFlag('ch0_vip_fixed', true);
  // refresh board if mounted
  const board = document.getElementById('jiraBoard');
  if (board) {
    renderBoard();
    openTicket(key);
  }
  return true;
}
export function getTickets() { return tickets; }
export function openTicketByKey(key) { openTicket(key); }

function renderBurndown() {
  const svg = document.getElementById('burndownSvg');
  if (!svg) return;
  // Simple burndown: 10 days, ideal linear, actual flat after day4
  const w = 400, h = 140, pad = 24;
  const ptsIdeal = Array.from({length:10}, (_,i)=> [pad + i*( (w-pad*2)/9 ), pad + (1 - i/9)*(h-pad*2)]);
  const ptsActual = [ [ptsIdeal[0][0], ptsIdeal[0][1]], [ptsIdeal[3][0], ptsIdeal[5][1]], [ptsIdeal[9][0], ptsIdeal[6][1]] ];
  // grid
  let html = `<rect x="0" y="0" width="${w}" height="${h}" fill="var(--bg-primary)" rx="6" />`;
  // Y axis
  for (let i=0;i<=4;i++) {
    const y = pad + i*(h-pad*2)/4;
    html += `<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="var(--border)" stroke-opacity="0.5" stroke-width="1"/>`;
    html += `<text x="4" y="${y+3}" font-size="9" fill="var(--fg-muted)">${19 - i*5}</text>`;
  }
  // X labels
  for (let i=0;i<10;i++) {
    const x = pad + i*(w-pad*2)/9;
    html += `<text x="${x}" y="${h-4}" font-size="9" fill="var(--fg-muted)" text-anchor="middle">D${i+1}</text>`;
  }
  // Ideal line dashed
  const idealPath = ptsIdeal.map((p,i)=> i===0?`M ${p[0]} ${p[1]}`:`L ${p[0]} ${p[1]}`).join(' ');
  html += `<path d="${idealPath}" fill="none" stroke="#9aa0a6" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  // Actual
  const actualPath = `M ${ptsActual[0][0]} ${ptsActual[0][1]} L ${ptsActual[1][0]} ${ptsActual[1][1]} L ${ptsActual[2][0]} ${ptsActual[2][1]}`;
  html += `<path d="${actualPath}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`;
  html += `<circle cx="${ptsActual[0][0]}" cy="${ptsActual[0][1]}" r="3" fill="var(--accent)"/>`;
  html += `<circle cx="${ptsActual[1][0]}" cy="${ptsActual[1][1]}" r="3" fill="var(--accent)"/>`;
  html += `<circle cx="${ptsActual[2][0]}" cy="${ptsActual[2][1]}" r="3" fill="var(--warning)" stroke="var(--warning)" />`;
  svg.innerHTML = html;
}
