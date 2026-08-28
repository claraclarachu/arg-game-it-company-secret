import { state } from '../../core/state.js';

const chats = [
  { id: 'backend-team', name: 'Backend Team (群組)', preview: 'cocoa bean shipment delay - 供應商延遲', locked: true, messages: [
    { from: 'pm', text: 'cocoa bean shipment delay，這批貨下週到，別在 Jira 提了' },
    { from: 'ops', text: '上次 bean 的 118 單位還在倉庫，leaf 新貨到了' },
    { from: 'you', text: '收到' },
  ]},
  { id: 'qa-lee', name: 'QA Lee', preview: '別動 payment 模組，那邊有 legacy code', locked: false, messages: [
    { from: 'qa-lee', text: '別動 payment 模組，那邊有 legacy code，finance 會找你' },
    { from: 'you', text: '知道了，420.69 那個分支是幹嘛的？' },
    { from: 'qa-lee', text: '內部審核用的 portal，需要 token，你在 .env.example 找' },
  ]},
  { id: 'supplier', name: 'Supplier (未知)', preview: '新批次 crystal 已發出', locked: true, messages: [
    { from: 'supplier', text: '新批次 crystal 已發出，追蹤號可查' },
  ]},
];

let activeId = 'qa-lee';

export function mountWhatsApp() {
  const root = document.getElementById('view-whatsapp');
  if (!root) return;
  root.innerHTML = `<div class="wa"><div class="wa__list" id="waList"></div><div class="wa__chat" id="waChat"></div></div>`;
  renderList();
  renderChat(activeId);
}

function isUnlocked(id) {
  if (id === 'qa-lee') return true;
  return state.hasFlag('hidden_portal_accessed');
}

function renderList() {
  const el = document.getElementById('waList');
  if (!el) return;
  el.innerHTML = chats.map(c => {
    const locked = !isUnlocked(c.id);
    return `<div class="wa__item ${c.id===activeId?'active':''}" data-id="${c.id}" style="${locked?'opacity:.5':''}">
      <div class="wa__name">${c.name} ${locked?'🔒':''}</div>
      <div class="wa__preview">${locked ? '需要先觸發隱藏入口後解鎖' : c.preview}</div>
    </div>`;
  }).join('');
  el.querySelectorAll('.wa__item').forEach(n => n.addEventListener('click', () => {
    if (!isUnlocked(n.dataset.id)) return;
    activeId = n.dataset.id;
    renderList(); renderChat(activeId);
  }));
}

function renderChat(id) {
  const c = chats.find(x => x.id === id);
  const el = document.getElementById('waChat');
  if (!c || !el) return;
  if (!isUnlocked(id)) {
    el.innerHTML = `<div class="view__placeholder"><h2>🔒 未解鎖</h2><div class="muted">先去 VS Code 觸發 420.69 隱藏路由</div></div>`;
    return;
  }
  el.innerHTML = `<div style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700">${c.name}</div>
    <div class="wa__messages" id="waMessages">${c.messages.map(m => `<div class="bubble ${m.from==='you'?'me':'other'}">${m.text}</div>`).join('')}</div>`;
}
