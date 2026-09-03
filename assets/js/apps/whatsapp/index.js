import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';

const chats = [
  {
    id: 'nori-all',
    name: 'Nori 全體',
    avatar: '🏢',
    desc: 'Nori 全體員工群組',
    members: ['Sawyer', 'Casey', 'Maggie', 'Taylor', 'Aiko', 'all'],
    preview: 'Sawyer: 中咗六合彩二獎，決定全放公司資金',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '2023-06-15',
    messages: [
      { id: 'm1', from: 'Sawyer', text: '各位同事，好消息！中咗六合彩二獎，決定將獎金全數投入公司資金，一齊加油！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm2', from: 'Sawyer', text: '另外，聽聞風水師建議，已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰，否則運氣會散。', time: '2023-11-20 09:00', read: 'read', type: 'text' },
      { id: 'm3', from: 'Sawyer', text: '今晚收工後請大家一齊去食飯唱K，辛苦大家！', time: '2023-12-01 18:30', read: 'read', type: 'text' },
    ]
  },
  {
    id: 'system-alert',
    name: 'System Alert',
    avatar: '🚨',
    desc: '系統監控告警',
    members: ['system', 'Casey'],
    preview: '✅ 系統健康',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '剛剛',
    messages: [
      { id: 'm1', from: 'system', text: '✅ 系統健康 — 所有服務正常', time: '剛剛', read: 'read', type: 'text' },
    ]
  },
  {
    id: 'sawyer',
    name: 'Boss Sawyer',
    avatar: '👔',
    desc: 'Sawyer · 創辦人',
    phone: '+852 9123 4567',
    preview: '有空嗎？',
    locked: false,
    pinned: false,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '2023-12-20',
    messages: [
      { id: 'm1', from: 'Sawyer', text: 'Casey，有空嗎？想同你傾下。', time: '2023-12-20', read: 'read', type: 'text' },
    ]
  },
  {
    id: 'dev-team',
    name: 'Dev Team',
    avatar: '👩‍💻',
    desc: 'Acme 開發團隊群組',
    members: ['Maggie', 'Casey', 'pm', 'qa-lee', 'ops'],
    preview: 'Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 1,
    lastTime: '剛剛',
    messages: [
      { id: 'm1', from: 'Maggie', text: 'Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下', time: '剛剛', read: 'delivered', type: 'text' },
    ]
  },
  {
    id: 'backend-team',
    name: 'Backend Team (群組)',
    avatar: '👥',
    desc: 'Acme 後端團隊群組',
    members: ['pm', 'ops', '你', 'finance@internal', 'qa-lee'],
    preview: 'cocoa bean shipment delay - 供應商延遲',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 2,
    lastTime: '10:32',
    messages: [
      { id: 'm1', from: 'pm', text: 'cocoa bean shipment delay，這批貨下週到，別在 Jiua 提了', time: '10:28', read: 'read', type: 'text' },
      { id: 'm2', from: 'ops', text: '上次 bean 的 118 單位還在倉庫，leaf 新貨到了', time: '10:30', read: 'read', type: 'text' },
      { id: 'm3', from: 'you', text: '收到', time: '10:31', read: 'read', type: 'text' },
      { id: 'm4', from: 'pm', text: '架構圖更新了，記得看附件', time: '10:32', read: 'delivered', type: 'file', fileName: 'arch-routes.pdf', fileSize: '1.2MB' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance Bot',
    avatar: '💰',
    desc: '自動化財務通知',
    preview: 'feeRate 更新: cocoa 0.15 已生效',
    locked: false,
    pinned: false,
    muted: false,
    archived: true,
    unread: 0,
    lastTime: '08:30',
    messages: [
      { id: 'm1', from: 'finance', text: 'feeRate 更新: cocoa 0.15 已生效，對應 INV-2024-0039', time: '08:30', read: 'read', type: 'text' },
      { id: 'm2', from: 'finance', text: '對帳檔案已生成', time: '08:31', read: 'read', type: 'file', fileName: 'reconcile-2024-08.csv', fileSize: '12KB' },
    ]
  },
];

let activeId = 'dev-team';
let listFilter = '';
let listTab = 'all'; // all | unread | archived
let infoOpen = false;
let msgSearch = '';
let sidebarTab = 'chat'; // chat | account

export function openChat(id) {
  const exists = chats.some(c => c.id === id);
  if (!exists) return;
  activeId = id;
  const c = chats.find(x => x.id === id);
  if (c) c.unread = 0;
  // re-render if mounted
  const root = document.getElementById('view-whatsapp');
  if (root && root.innerHTML) {
    // ensure left pane shows chat list when opening a chat via notification
    sidebarTab = 'chat';
    syncSidebarActive();
    renderLeftPane();
    renderChat(activeId);
  }
}

export function mountWhatsApp() {
  const root = document.getElementById('view-whatsapp');
  if (!root) return;
  root.innerHTML = `<div class="wa">
    <nav class="wa__sidebar" aria-label="WhatUp 側邊欄">
      <div class="wa__sidebar-top">
        <div class="wa__sidebar-tabs" role="tablist" aria-label="WhatUp 功能">
          <button class="wa__sidebar-tab active" data-wa-tab="chat" role="tab" aria-selected="true" title="聊天" aria-label="聊天">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 3v-7A8.5 8.5 0 0 1 12.5 3"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>
          </button>
        </div>
      </div>
      <div class="wa__sidebar-bottom">
        <button class="wa__sidebar-tab" data-wa-tab="account" role="tab" aria-selected="false" title="帳號" aria-label="帳號">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
        </button>
      </div>
    </nav>
    <div class="wa__list" id="waList"></div>
    <div class="wa__chat" id="waChat"></div>
  </div>`;
  bindSidebar();
  renderLeftPane();
  renderChat(activeId);
}

function bindSidebar() {
  const root = document.getElementById('view-whatsapp');
  if (!root) return;
  root.querySelectorAll('.wa__sidebar-tab[data-wa-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.waTab;
      if (tab === sidebarTab) return;
      sidebarTab = tab;
      syncSidebarActive();
      renderLeftPane();
    });
  });
}

function syncSidebarActive() {
  document.querySelectorAll('.wa__sidebar-tab[data-wa-tab]').forEach(btn => {
    const isActive = btn.dataset.waTab === sidebarTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function renderLeftPane() {
  if (sidebarTab === 'account') renderAccountPane();
  else renderList();
}

function renderAccountPane() {
  const el = document.getElementById('waList');
  if (!el) return;
  el.innerHTML = `
    <div class="wa__account-pane">
      <div class="wa__account-circle" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
      </div>
      <div class="wa__account-name-large">Casey</div>
      <div class="wa__account-phone-large">+852 32443333</div>
    </div>
  `;
}

function isUnlocked(id) {
  // All chats unlocked from the start — no gating
  return true;
}

function getFilteredChats() {
  let out = [...chats];
  // search
  if (listFilter) {
    const q = listFilter.toLowerCase();
    out = out.filter(c => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
  }
  // tabs
  if (listTab === 'unread') out = out.filter(c => c.unread > 0 && isUnlocked(c.id));
  else if (listTab === 'archived') out = out.filter(c => c.archived);
  else out = out.filter(c => !c.archived);
  // pinned first
  out.sort((a,b) => (b.pinned - a.pinned) || (b.unread - a.unread));
  return out;
}

function renderList() {
  if (sidebarTab !== 'chat') return;
  const el = document.getElementById('waList');
  if (!el) return;
  const filtered = getFilteredChats();
  el.innerHTML = `
    <div class="wa__list-header">
      <div class="wa__search"><input id="waSearch" class="input" placeholder="搜尋聊天" value="${listFilter}" /></div>
      <div class="wa__filters">
        <button class="wa__filter ${listTab==='all'?'active':''}" data-tab="all">全部</button>
        <button class="wa__filter ${listTab==='unread'?'active':''}" data-tab="unread">未讀</button>
        <button class="wa__filter ${listTab==='archived'?'active':''}" data-tab="archived">封存</button>
        <span class="small muted" style="margin-left:auto">${filtered.length} 對話</span>
      </div>
    </div>
    <div class="wa__list-scroll" id="waListScroll">
      ${filtered.map(c => {
        const locked = !isUnlocked(c.id);
        return `<div class="wa__item ${c.id===activeId?'active':''} ${c.muted?'muted':''}" data-id="${c.id}" style="${locked?'opacity:.5':''}">
          <div class="wa__avatar">${c.avatar}</div>
          <div class="wa__item-main">
            <div class="wa__name">${c.name} ${c.pinned?'📌':''} ${c.muted?'<span class="wa__mute">🔇</span>':''} ${locked?'🔒':''}</div>
            <div class="wa__preview">${locked ? '需要先觸發隱藏入口後解鎖' : c.preview}</div>
          </div>
          <div class="wa__item-meta">
            <div class="wa__time">${c.lastTime}</div>
            ${c.unread>0 && !locked ? `<div class="wa__badge">${c.unread}</div>` : ''}
            ${c.archived ? '<div class="small muted">封存</div>' : ''}
          </div>
        </div>`;
      }).join('') || '<div class="small muted" style="padding:16px;text-align:center">無結果 — 試搜尋 cocoa</div>'}
    </div>
  `;
  // bind
  el.querySelector('#waSearch')?.addEventListener('input', e => { listFilter = e.target.value; renderList(); });
  el.querySelectorAll('.wa__filter').forEach(b => b.addEventListener('click', () => { listTab = b.dataset.tab; renderList(); }));
  el.querySelectorAll('.wa__item').forEach(n => n.addEventListener('click', () => {
    if (!isUnlocked(n.dataset.id)) return;
    activeId = n.dataset.id;
    const c = chats.find(x=>x.id===activeId);
    if (c) c.unread = 0;
    infoOpen = false;
    renderList(); renderChat(activeId);
  }));
  // right click for pin/mute/archive (simulate context)
  el.querySelectorAll('.wa__item').forEach(n => {
    n.addEventListener('contextmenu', e => {
      e.preventDefault();
      const c = chats.find(x=>x.id===n.dataset.id);
      if (!c || !isUnlocked(c.id)) return;
      // toggle pinned
      c.pinned = !c.pinned;
      renderList();
    });
  });
}

function renderChat(id) {
  const c = chats.find(x => x.id === id);
  const el = document.getElementById('waChat');
  if (!c || !el) return;
  if (!isUnlocked(id)) {
    el.innerHTML = `<div class="view__placeholder"><h2>🔒 未解鎖</h2><div class="muted">先去 Vizual Studio Code 觸發 420.69 隱藏路由</div></div>`;
    return;
  }
  if (id === 'supplier') state.setFlag('found_supplier', true);
  if (id === 'backend-team') state.setFlag('found_supplier', true);
  // msg search filter
  let msgs = c.messages;
  if (msgSearch) {
    const q = msgSearch.toLowerCase();
    msgs = msgs.filter(m => (m.text||'').toLowerCase().includes(q) || (m.fileName||'').toLowerCase().includes(q));
  }
  // group by day (here all same day for demo, split by time)
  const groups = {};
  msgs.forEach(m => {
    const day = m.time.includes(':') ? '今天' : m.time;
    if (!groups[day]) groups[day] = [];
    groups[day].push(m);
  });

  el.innerHTML = `
    <div class="wa__chat-header" id="waChatHeader">
      <div>
        <div class="wa__chat-title">${c.avatar} ${c.name} ${c.pinned?'📌':''}</div>
        <div class="wa__chat-sub">${c.desc} · ${c.members ? c.members.join(', ') : c.phone || ''}</div>
      </div>
      <div class="wa__chat-actions">
        <button class="wa__iconbtn" title="搜尋訊息" id="waMsgSearchBtn" aria-label="搜尋訊息">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M15 15l4 4"/></svg>
        </button>
        <button class="wa__iconbtn" title="匯出聊天記錄" id="waExportBtn" aria-label="匯出聊天記錄">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/></svg>
        </button>
        <button class="wa__iconbtn" title="聯絡資訊" id="waInfoBtn" aria-label="聯絡資訊">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>
        </button>
        <button class="wa__iconbtn" title="更多" id="waMoreBtn" aria-label="更多">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="5.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none"/></svg>
        </button>
      </div>
    </div>
    <div id="waMsgSearchBar" style="display:${msgSearch?'flex':'none'};gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg-secondary)">
      <input id="waMsgSearchInput" class="input" placeholder="搜尋此對話訊息" value="${msgSearch}" style="flex:1" />
      <button class="btn" id="waMsgSearchClear">清除</button>
    </div>
    <div class="wa__messages" id="waMessages">
      ${Object.entries(groups).map(([day, arr]) => `
        <div class="wa__day">${day}</div>
        ${arr.map(m => bubbleHtml(m, c)).join('')}
      `).join('')}
    </div>
    <div class="wa__composer">
      <button class="wa__iconbtn" title="附件" aria-label="附件">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <input id="waComposerInput" class="input" placeholder="輸入訊息" style="flex:1" />
      <button class="btn primary" id="waSendBtn">送出</button>
      <button class="wa__iconbtn" title="語音" aria-label="語音">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 14v4"/><path d="M8 18h8"/></svg>
      </button>
    </div>
    <div class="wa__info ${infoOpen?'open':''}" id="waInfoPanel">
      <div style="padding:12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <b>聯絡資訊</b><button class="btn" id="waInfoClose">關閉</button>
      </div>
      <div style="padding:12px;overflow:auto;display:grid;gap:10px">
        <div style="text-align:center;padding:12px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--bg-tertiary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto">${c.avatar}</div>
          <div style="margin-top:8px;font-weight:700">${c.name}</div>
          <div class="small muted">${c.desc}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">成員</div>
          <div class="small muted" style="margin-top:4px">${c.members ? c.members.join('、') : c.phone || '—'}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">靜音 / 置頂 / 封存</div>
          <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn ${c.muted?'primary':''}" id="waToggleMute">${c.muted?'🔇 已靜音':'🔔 靜音'}</button>
            <button class="btn ${c.pinned?'primary':''}" id="waTogglePin">${c.pinned?'📌 已置頂':'📌 置頂'}</button>
            <button class="btn ${c.archived?'primary':''}" id="waToggleArchive">${c.archived?'📦 已封存':'📦 封存'}</button>
          </div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">共享檔案</div>
          <div class="small muted" style="margin-top:4px">${c.messages.filter(m=>m.type!=='text').map(m=>m.fileName||m.type).join(', ') || '無'}</div>
        </div>
      </div>
    </div>
  `;
  // bind
  document.getElementById('waChatHeader')?.addEventListener('click', () => { infoOpen = !infoOpen; document.getElementById('waInfoPanel')?.classList.toggle('open', infoOpen); });
  document.getElementById('waInfoBtn')?.addEventListener('click', e => { e.stopPropagation(); infoOpen = !infoOpen; document.getElementById('waInfoPanel')?.classList.toggle('open', infoOpen); });
  document.getElementById('waInfoClose')?.addEventListener('click', () => { infoOpen = false; document.getElementById('waInfoPanel')?.classList.remove('open'); });
  document.getElementById('waToggleMute')?.addEventListener('click', () => { c.muted = !c.muted; renderList(); renderChat(id); });
  document.getElementById('waTogglePin')?.addEventListener('click', () => { c.pinned = !c.pinned; renderList(); renderChat(id); });
  document.getElementById('waToggleArchive')?.addEventListener('click', () => { c.archived = !c.archived; renderList(); renderChat(id); });
  document.getElementById('waMsgSearchBtn')?.addEventListener('click', () => { msgSearch = ''; document.getElementById('waMsgSearchBar').style.display='flex'; document.getElementById('waMsgSearchInput')?.focus(); });
  document.getElementById('waMsgSearchInput')?.addEventListener('input', e => { msgSearch = e.target.value; renderChat(id); });
  document.getElementById('waMsgSearchClear')?.addEventListener('click', () => { msgSearch=''; renderChat(id); });
  document.getElementById('waExportBtn')?.addEventListener('click', () => exportChat(c));
  document.getElementById('waMoreBtn')?.addEventListener('click', () => exportChat(c));
  document.getElementById('waSendBtn')?.addEventListener('click', () => sendMessage(c));
  document.getElementById('waComposerInput')?.addEventListener('keydown', e => { if (e.key==='Enter') sendMessage(c); });
  // media clicks
  document.querySelectorAll('[data-play]').forEach(b => {
    b.addEventListener('click', () => {
      const was = b.textContent;
      b.textContent = '⏸️';
      setTimeout(()=> b.textContent = was, 1800);
    });
  });
  document.querySelectorAll('[data-img]').forEach(img => {
    img.addEventListener('click', () => { window.open(img.src, '_blank'); });
  });
}

function getInitial(name) {
  if (!name) return '?';
  if (name === 'you' || name === '你') return '你';
  return name.trim().charAt(0).toUpperCase();
}
function getAvatarColor(name) {
  const palette = ['#1f7aec','#e542a3','#00a884','#ff8c00','#6a5acd','#d93025','#0d9488','#7c3aed'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
function bubbleHtml(m, chat) {
  const isMe = m.from === 'you';
  const check = isMe ? (m.read === 'read' ? '<span class="bubble__check read">✓✓</span>' : m.read === 'delivered' ? '<span class="bubble__check">✓✓</span>' : '<span class="bubble__check">✓</span>') : '';
  let media = '';
  if (m.type === 'image') {
    media = `<div class="wa__media"><img data-img src="${m.media}" alt="image" /></div>`;
  } else if (m.type === 'voice') {
    media = `<div class="wa__voice"><span class="wa__play" data-play>▶️</span><div class="wa__wave">${Array.from({length:12}, (_,i)=>`<span style="height:${8+Math.random()*14}px"></span>`).join('')}</div><span class="small muted">${m.duration}</span></div>`;
  } else if (m.type === 'file') {
    media = `<div class="wa__file"><div class="wa__file-icon">📄</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(m.fileName)}</div><div class="small muted">${escapeHtml(m.fileSize)}</div></div><button class="btn" style="padding:4px 8px">下載</button></div>`;
  }
  const textHtml = m.text ? `<div>${escapeHtml(m.text)}</div>` : '';
  const timeHtml = `<div class="bubble__time">${escapeHtml(m.time)} ${check}</div>`;
  if (isMe) {
    return `<div class="wa__msg-row me">
      <div class="bubble me">${textHtml}${media}${timeHtml}</div>
    </div>`;
  }
  const initial = getInitial(m.from);
  const color = getAvatarColor(m.from);
  const isGroup = Array.isArray(chat?.members) && chat.members.length > 2;
  const senderHtml = isGroup ? `<div class="bubble__sender" style="color:${color}">${escapeHtml(m.from)}</div>` : '';
  return `<div class="wa__msg-row other">
    <div class="wa__msg-avatar" style="background:${color}" aria-label="${escapeHtml(m.from)}" title="${escapeHtml(m.from)}">${escapeHtml(initial)}</div>
    <div class="bubble other">${senderHtml}${textHtml}${media}${timeHtml}</div>
  </div>`;
}

function sendMessage(chat) {
  const inp = document.getElementById('waComposerInput');
  const val = inp?.value.trim();
  if (!val) return;
  chat.messages.push({ id: 'm'+Date.now(), from: 'you', text: val, time: new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}), read: 'sent', type: 'text' });
  chat.preview = val;
  chat.lastTime = '剛剛';
  chat.unread = 0;
  inp.value = '';
  renderChat(chat.id);
  renderList();
  // fake reply after 1s for supplier
  if (chat.id !== 'qa-lee' && Math.random() > 0.5) {
    setTimeout(()=>{
      chat.messages.push({ id: 'r'+Date.now(), from: chat.id === 'backend-team'?'ops':'supplier', text: '收到，後續私聊', time: '剛剛', read: 'delivered', type: 'text' });
      renderChat(chat.id); renderList();
    }, 1200);
  }
}

function exportChat(chat) {
  const text = `WhatUp 匯出 — ${chat.name}\n${chat.messages.map(m=>`[${m.time}] ${m.from}: ${m.text || m.fileName || m.type}`).join('\n')}`;
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${chat.id}-chat.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
