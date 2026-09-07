import { state } from '../../core/state.js';
import { escapeHtml } from '../../utils/helpers.js';

const chats = [
  {
    id: 'nori-all',
    name: 'Nori 全體',
    avatar: '🏢',
    desc: 'Nori 全體員工群組',
    members: ['Sawyer', 'Casey', 'Maggie', 'Taylor', 'Aiko', 'all'],
    preview: 'Leo:謝謝安排！',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '2023-06-15',
    messages: [
      { id: 'm1', from: 'Sawyer', text: '各位同事，好消息！我中了六合彩二獎，決定將獎金全數投入公司資金，一起加油！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm2', from: 'Taylor', text: '恭喜老闆！祝以後都順順利利！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm3', from: 'Aiko', text: '太棒了！老闆威武！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm4', from: 'Maggie', text: '恭喜老闆！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm5', from: 'Parker', text: '運也太好了吧？！', time: '2023-06-15', read: 'read', type: 'text' },
      { id: 'm6', from: 'Sawyer', text: '各位同事，告訴大家一個好消息，剛跟可樂樂公司談成一大生意，結為長期合作伙伴。為慶祝近來公司發展順利，決定舉辦晚上派對，詳細資訊稍後公布！', time: '2023-11-01', read: 'read', type: 'text' },
      { id: 'm7', from: 'Aiko', text: '哇！！太好了，一定會去！', time: '2023-11-01', read: 'read', type: 'text' },
      { id: 'm8', from: 'Taylor', text: '太棒了！', time: '2023-11-01', read: 'read', type: 'text' },
      { id: 'm9', from: 'Maggie', text: '恭喜老闆！', time: '2023-11-01', read: 'read', type: 'text' },
      { id: 'm10', from: 'Hugo', text: '一輩子跟隨您！', time: '2023-11-01', read: 'read', type: 'text' },
      { id: 'm11', from: 'Taylor', text: '各位同事，慶祝公司發展順利, 將於11月22日下班後舉辦派對，以下為詳細資訊：\n日期時間：11月22日（五） 19:00-23:00\n地點：辨公室旁邊的利利大樓18樓004室\n\n可自由組隊前行', time: '2023-11-04', read: 'read', type: 'text' },
      { id: 'm12', from: 'Sawyer', text: '謝謝Taylor的安排，請各位盡情享受！', time: '2023-11-04', read: 'read', type: 'text' },
      { id: 'm13', from: 'Leo', text: '謝謝安排！', time: '2023-11-04', read: 'read', type: 'text' },
    ]
  },
  {
    id: 'system-alert',
    name: 'System Alert',
    avatar: '🚨',
    desc: '系統監控告警',
    members: ['system', 'Sawyer', 'Maggie', 'Parker', , 'Casey'],
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
    preview: 'Casey，歡迎來到Nori Limited',
    locked: false,
    pinned: false,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '2024-07-15',
    messages: [
      { id: 'm1', from: 'Sawyer', text: 'Casey，歡迎來到Nori Limited！ 我是Sawyer, Nori的老闆, 來一下我的辨公室聊聊吧～', time: '2024-07-15', read: 'read', type: 'text' },
    ]
  },
  {
    id: 'dev-team',
    name: 'Dev Team',
    avatar: '👩‍💻',
    desc: 'Nori網站和內網的開發團隊群組',
    members: ['Maggie', 'Casey', 'pm', 'Taylor', 'ops'],
    preview: 'Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下。詳細資訊在Jiua可以找到, 有問題再找我。',
    locked: false,
    pinned: true,
    muted: false,
    archived: false,
    unread: 1,
    lastTime: '剛剛',
    messages: [
      { id: 'm1', from: 'Maggie', text: 'Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下。詳細資訊在Jiua可以找到, 有問題再找我。', time: '剛剛', read: 'delivered', type: 'text' },
    ]
  },
  {
    id: 'lunch-team',
    name: '午餐小隊',
    avatar: '🍽️',
    desc: '午餐小隊',
    members: ['Parker', 'Grace', 'Hugo', 'Alex', 'Casey'],
    preview: '去米當當吃好嗎？',
    locked: false,
    pinned: false,
    muted: false,
    archived: false,
    unread: 0,
    lastTime: '2024-09-01',
    messages: [
      { id: 'm1', from: 'Hugo', text: '大新聞！聽說老闆父母車禍身亡了！', time: '2023-04-29', read: 'read', type: 'text' },
      { id: 'm2', from: 'Parker', text: '？！', time: '2023-04-29', read: 'read', type: 'text' },
      { id: 'm3', from: 'Grace', text: '真的嗎？太難過了', time: '2023-04-29', read: 'read', type: 'text' },
      { id: 'm4', from: 'Hugo', text: '對啊，所以才請了一個禮拜假吧', time: '2023-04-29', read: 'read', type: 'text' },
      { id: 'm5', from: 'Hugo', text: '有人覺得近期的老闆很怪嗎？', time: '2023-10-19', read: 'read', type: 'text' },
      { id: 'm6', from: 'Parker', text: '怎麼說？！', time: '2023-10-19', read: 'read', type: 'text' },
      { id: 'm7', from: 'Alex', text: '變開朗了，也變得愛請客了！', time: '2023-10-19', read: 'read', type: 'text' },
      { id: 'm8', from: 'Grace', text: '對啊，之前都挺嚴肅的', time: '2023-10-19', read: 'read', type: 'text' },
      { id: 'm9', from: 'Hugo', text: '對啊！！！', time: '2023-10-19', read: 'read', type: 'text' },
      { id: 'm10', from: 'Hugo', text: '歡迎Casey！！以後帶你吃附近好吃的！', time: '2024-07-16', read: 'read', type: 'text' },
      { id: 'm11', from: 'Parker', text: '歡迎歡迎', time: '2024-07-16', read: 'read', type: 'text' },
      { id: 'm12', from: 'Grace', text: '歡迎~', time: '2024-07-16', read: 'read', type: 'text' },
      { id: 'm13', from: 'Alex', text: '歡迎~~', time: '2024-07-16', read: 'read', type: 'text' },
      { id: 'm14', from: 'Hugo', text: '今天要吃米當當嗎？', time: '2024-09-01', read: 'read', type: 'text' },
      { id: 'm15', from: 'Alex', text: '好啊', time: '2024-09-01', read: 'read', type: 'text' },
    ]
  }
];

let activeId = 'dev-team';
let listFilter = '';
let listTab = 'all'; // all | unread | archived
let infoOpen = false;
let msgSearch = '';
let sidebarTab = 'chat'; // chat | account

// Sawyer revert forced dialogue sequence (ch1)
let sawyerSeq = 0; // 0 idle, 1 wait first send (long text), 2 typing, 3 wait second send ("但是"), 4 done unlocked
let sawyerSeqLocked = false;

export function openChat(id) {
  const exists = chats.some(c => c.id === id);
  if (!exists) return;
  activeId = id;
  const c = chats.find(x => x.id === id);
  if (c) c.unread = 0;
  if (id === 'nori-all') {
    // If this is the first time reading the tree message after Event1, trigger Event2
    setTimeout(() => markNoriAllRead(), 100);
  }
  if (id === 'nori-all') {
    // If this is the first time reading the tree message after Event1, trigger Event2
    setTimeout(() => markNoriAllRead(), 100);
  }
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
  // fixed order: Nori全體 > Dev Team > Boss Sawyer > System Alert > Backend
  const fixedOrder = ['nori-all', 'dev-team', 'sawyer', 'system-alert', 'backend-team', 'lunch-team'];
  out.sort((a,b) => {
    const ai = fixedOrder.indexOf(a.id);
    const bi = fixedOrder.indexOf(b.id);
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return 0;
  });
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
      }).join('') || '<div class="small muted" style="padding:16px;text-align:center">無結果 — 試搜尋 Sawyer</div>'}
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
    if (n.dataset.id === 'nori-all') {
      setTimeout(() => markNoriAllRead(), 100);
    }
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
      ${id==='sawyer' && sawyerSeq===2 ? `<div class="wa__msg-row other" id="sawyerTyping"><div class="wa__msg-avatar" style="background:${getAvatarColor('Sawyer')}">S</div><div class="bubble other"><span class="small muted">輸入中...</span></div></div>` : ''}
    </div>
    ${(() => {
      let composerValue = '';
      let composerLocked = false;
      if (id === 'sawyer') {
        if (sawyerSeq === 1) { composerValue = "但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊"; composerLocked = true; }
        else if (sawyerSeq === 2) { composerValue = ""; composerLocked = true; }
        else if (sawyerSeq === 3) { composerValue = "但是"; composerLocked = true; }
      }
      return `<div class="wa__composer">
      <button class="wa__iconbtn" title="附件" aria-label="附件">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <input id="waComposerInput" class="input" placeholder="輸入訊息" style="flex:1" value="${escapeHtml(composerValue)}" ${composerLocked ? 'readonly disabled' : ''} />
      <button class="btn primary" id="waSendBtn">送出</button>
      <button class="wa__iconbtn" title="語音" aria-label="語音">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 14v4"/><path d="M8 18h8"/></svg>
      </button>
    </div>`;
    })()}
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
  // Sawyer forced dialogue sequence - handle locked stages
  if (chat.id === 'sawyer' && sawyerSeq === 1) {
    const lockedText = "但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊";
    chat.messages.push({ id: 'm'+Date.now(), from: 'you', text: lockedText, time: '剛剛', read: 'sent', type: 'text' });
    chat.preview = lockedText;
    chat.lastTime = '剛剛';
    chat.unread = 0;
    sawyerSeq = 2;
    renderChat(chat.id);
    renderList();
    // show typing for 3 sec
    setTimeout(() => {
      // remove typing and add Sawyer reply
      sawyerSeq = 3;
      chat.messages.push({ id: 'sawyer-reply2-'+Date.now(), from: 'Sawyer', text: '先別管，肯定是這段的影響，已經在影響我工作了', time: '剛剛', read: 'delivered', type: 'text' });
      chat.preview = 'Sawyer: 先別管，肯定是這段的影響...';
      chat.unread = (chat.unread||0)+1;
      window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'sawyer'}}));
      renderChat(chat.id);
      renderList();
      // also show win notification for this Sawyer message
      const container = document.createElement('div');
      container.id = 'wa-win-notif-sawyer-seq2-'+Date.now();
      container.setAttribute('role','alert');
      container.innerHTML = `<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">先別管，肯定是這段的影響，已經在影響我工作了</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>`;
      container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;';
      container.addEventListener('click', (e)=>{ if(e.target.closest('.win-notif__close')) return; container.remove(); import('../../ui/dock.js').then(d=>{ if(d.setActiveView){d.setActiveView('whatsapp'); localStorage.setItem('cc_active_view','whatsapp');} }); openChat('sawyer'); });
      container.querySelector('.win-notif__close')?.addEventListener('click', e=>{ e.stopPropagation(); container.remove(); });
      document.body.appendChild(container);
      setTimeout(()=>container.remove(),4000);
    }, 3000);
    // keep win notification for first Sawyer typing? we already show typing via messages
    return;
  }
  if (chat.id === 'sawyer' && sawyerSeq === 2) {
    // typing in progress, block
    return;
  }
  if (chat.id === 'sawyer' && sawyerSeq === 3) {
    const lockedText = "但是";
    chat.messages.push({ id: 'm'+Date.now(), from: 'you', text: lockedText, time: '剛剛', read: 'sent', type: 'text' });
    chat.preview = lockedText;
    chat.lastTime = '剛剛';
    chat.unread = 0;
    renderChat(chat.id);
    renderList();
    // Sawyer immediately sends 趕快revert！
    setTimeout(() => {
      chat.messages.push({ id: 'sawyer-reply3-'+Date.now(), from: 'Sawyer', text: '趕快revert！', time: '剛剛', read: 'delivered', type: 'text' });
      chat.preview = 'Sawyer: 趕快revert！';
      chat.unread = (chat.unread||0)+1;
      window.dispatchEvent(new CustomEvent('whatsapp:newMessage', {detail:{chatId:'sawyer'}}));
      sawyerSeq = 4;
      sawyerSeqLocked = false;
      renderChat(chat.id);
      renderList();
      const container = document.createElement('div');
      container.id = 'wa-win-notif-sawyer-seq3-'+Date.now();
      container.setAttribute('role','alert');
      container.innerHTML = `<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="wa__msg-avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>`;
      // Actually reuse same style as other notifs - correct inner html
      container.innerHTML = `<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>`;
      container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;';
      container.addEventListener('click', (e)=>{ if(e.target.closest('.win-notif__close')) return; container.remove(); import('../../ui/dock.js').then(d=>{ if(d.setActiveView){d.setActiveView('whatsapp'); localStorage.setItem('cc_active_view','whatsapp');} }); openChat('sawyer'); });
      container.querySelector('.win-notif__close')?.addEventListener('click', e=>{ e.stopPropagation(); container.remove(); });
      document.body.appendChild(container);
      setTimeout(()=>container.remove(),4000);
    }, 200);
    return;
  }
  const inp = document.getElementById('waComposerInput');
  const val = inp?.value.trim();
  if (!val) return;
  // Block Sawyer chat after seq 4? allow free send but Sawyer won't answer
  const isSawyerPostSeq = chat.id === 'sawyer' && sawyerSeq === 4;
  chat.messages.push({ id: 'm'+Date.now(), from: 'you', text: val, time: new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}), read: 'sent', type: 'text' });
  chat.preview = val;
  chat.lastTime = '剛剛';
  chat.unread = 0;
  inp.value = '';
  renderChat(chat.id);
  renderList();
  // fake reply after 1s for supplier - disabled for sawyer after seq 4
  if (isSawyerPostSeq) return;
  if (chat.id !== 'qa-lee' && Math.random() > 0.5) {
    setTimeout(()=>{
      chat.messages.push({ id: 'r'+Date.now(), from: chat.id === 'backend-team'?'ops':'supplier', text: '收到，後續私聊', time: '剛剛', read: 'delivered', type: 'text' });
      renderChat(chat.id); renderList();
    }, 1200);
  }
}

// Ch1 Event1 & Event2 helpers
let ch1Event1Triggered = false;
let ch1Event2Triggered = false;
let ch1Event1Timer = null;
let ch1Event2Timer = null;

export function triggerCh1Event1() {
  if (ch1Event1Triggered) return;
  ch1Event1Triggered = true;
  const c = chats.find(x => x.id === 'nori-all');
  if (!c) return;
  // Add tree message from Sawyer after 10 sec
  setTimeout(() => {
    c.messages.push({ id: 'm-tree-' + Date.now(), from: 'Sawyer', text: '聽從風水師建議，已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰，否則運氣會散。', time: '剛剛', read: 'delivered', type: 'text' });
    c.preview = 'Sawyer: 聽從風水師建議，已在 Lobby 擺放';
    c.lastTime = '剛剛';
    c.unread = (c.unread || 0) + 1;
    window.dispatchEvent(new CustomEvent('whatsapp:newMessage', { detail: { chatId: 'nori-all' } }));
    const root = document.getElementById('view-whatsapp');
    if (root && root.innerHTML) {
      renderList();
    }
    // Add follow-up image message from Sawyer under the text (office.png)
    setTimeout(() => {
      c.messages.push({ id: 'm-tree-img-' + Date.now(), from: 'Sawyer', text: '', media: '/assets/data/files/office.png', type: 'image', time: '剛剛', read: 'delivered' });
      c.preview = 'Sawyer: [圖片]';
      c.lastTime = '剛剛';
      c.unread = (c.unread || 0) + 1;
      window.dispatchEvent(new CustomEvent('whatsapp:newMessage', { detail: { chatId: 'nori-all' } }));
      const root2 = document.getElementById('view-whatsapp');
      if (root2 && root2.innerHTML) renderList();
    }, 1500);
    // Pop up at right bottom like initial ch0 notification
    const container = document.createElement('div');
    container.id = 'wa-win-notification-sawyer-tree';
    container.setAttribute('role', 'alert');
    container.innerHTML = `
      <div class="win-notif__app">
        <img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">Nori 全體</span>
        <button class="win-notif__close" aria-label="關閉">✕</button>
      </div>
      <div class="win-notif__body">
        <div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div>
        <div class="win-notif__text">
          <div class="win-notif__sender">Sawyer</div>
          <div class="win-notif__msg">已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰</div>
          <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
        </div>
      </div>
      <div class="win-notif__progress"></div>
    `;
    container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;';
    container.addEventListener('click', (e) => {
      if (e.target.closest('.win-notif__close')) return;
      container.remove();
      import('../../ui/dock.js').then(dock => {
        if (dock.setActiveView) { dock.setActiveView('whatsapp'); localStorage.setItem('cc_active_view', 'whatsapp'); }
      });
      openChat('nori-all');
    });
    container.querySelector('.win-notif__close')?.addEventListener('click', (e) => { e.stopPropagation(); container.remove(); });
    document.body.appendChild(container);
    requestAnimationFrame(() => { container.style.opacity='1'; container.style.transform='none'; });
    setTimeout(() => { container.style.opacity='0'; setTimeout(()=>container.remove(),300); }, 10000);
    // Auto-trigger Event2 regardless of whether 0042 or nori-all was read
    setTimeout(() => {
      if (!ch1Event2Triggered) triggerCh1Event2();
    }, 10000);
  }, 10000);
}

export function triggerCh1Event2() {
  if (ch1Event2Triggered) return;
  ch1Event2Triggered = true;
  const c = chats.find(x => x.id === 'dev-team');
  if (!c) return;
  setTimeout(() => {
    c.messages.push({ id: 'm-0043-' + Date.now(), from: 'Maggie', text: 'Hi @Casey, 有新的工單 INV-2024-0043, 請協助處理一下', time: '剛剛', read: 'delivered', type: 'text' });
    c.preview = 'Hi @Casey, 有新的工單 INV-2024-0043';
    c.lastTime = '剛剛';
    c.unread = (c.unread || 0) + 1;
    window.dispatchEvent(new CustomEvent('whatsapp:newMessage', { detail: { chatId: 'dev-team' } }));
    // Add Jira ticket
    import('../jira/index.js').then(m => {
      if (m.addTicket0043) m.addTicket0043();
      const board = document.getElementById('jiraBoard');
      if (board) {
        window.dispatchEvent(new CustomEvent('jira:ticketAdded'));
      }
    });
    const root = document.getElementById('view-whatsapp');
    if (root && root.innerHTML) {
      renderList();
    }
    // Pop up at right bottom like initial ch0
    const container = document.createElement('div');
    container.id = 'wa-win-notification-maggie-0043';
    container.setAttribute('role', 'alert');
    container.innerHTML = `
      <div class="win-notif__app">
        <img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">Dev Team</span>
        <button class="win-notif__close" aria-label="關閉">✕</button>
      </div>
      <div class="win-notif__body">
        <div class="win-notif__avatar" style="background:linear-gradient(135deg, #25D366, #128C7E)">M</div>
        <div class="win-notif__text">
          <div class="win-notif__sender">Maggie</div>
          <div class="win-notif__msg">Hi @Casey, 有新的工單 INV-2024-0043, 請協助處理一下</div>
          <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
        </div>
      </div>
      <div class="win-notif__progress"></div>
    `;
    container.style.cssText = 'position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;';
    container.addEventListener('click', (e) => {
      if (e.target.closest('.win-notif__close')) return;
      container.remove();
      import('../../ui/dock.js').then(dock => {
        if (dock.setActiveView) { dock.setActiveView('whatsapp'); localStorage.setItem('cc_active_view', 'whatsapp'); }
      });
      openChat('dev-team');
    });
    container.querySelector('.win-notif__close')?.addEventListener('click', (e) => { e.stopPropagation(); container.remove(); });
    document.body.appendChild(container);
    requestAnimationFrame(() => { container.style.opacity='1'; container.style.transform='none'; });
    setTimeout(() => { container.style.opacity='0'; setTimeout(()=>container.remove(),300); }, 10000);
  }, 10000);
}

export function markNoriAllRead() {
  const c = chats.find(x => x.id === 'nori-all');
  if (c) {
    // Mark as read and trigger Event2 after 10 sec if Event1 was triggered
    if (ch1Event1Triggered && !ch1Event2Triggered) {
      triggerCh1Event2();
    }
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

export function getChats() { return chats; }
export function getActiveChatId() { return activeId; }
export function startSawyerRevertSeq() {
  if (sawyerSeq !== 0) return;
  sawyerSeq = 1;
  // If player is focused on WhatUp (whatsapp view active), show locked input immediately
  const root = document.getElementById('view-whatsapp');
  const isWhatsappActive = root && root.classList.contains('active') || localStorage.getItem('cc_active_view') === 'whatsapp';
  if (root && root.innerHTML) {
    try { renderChat(activeId); } catch {}
    try { renderLeftPane(); } catch {}
  }
  // Also set flag for tracking
  try { state.setFlag('sawyer_seq_started', true); } catch {}
}
export function getSawyerSeq() { return sawyerSeq; }

// Central listener: when any module pushes a message and dispatches whatsapp:newMessage, re-render list/chat
if (typeof window !== 'undefined' && !window.__waListenerBound) {
  window.__waListenerBound = true;
  window.addEventListener('whatsapp:newMessage', (e) => {
    const root = document.getElementById('view-whatsapp');
    if (!root || !root.innerHTML) return;
    try { renderLeftPane(); } catch {}
    try { renderChat(activeId); } catch {}
    // Also ensure unread badge updates if not on active chat
  });
  window.addEventListener('whatsapp:refresh', () => {
    const root = document.getElementById('view-whatsapp');
    if (!root || !root.innerHTML) return;
    try { renderLeftPane(); } catch {}
    try { renderChat(activeId); } catch {}
  });
}
