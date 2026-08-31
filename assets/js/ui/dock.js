import { state } from '../core/state.js';

export function renderDock({ onSwitch, onOpenSettings, onOpenNotebook, t }) {
  const dock = document.getElementById('dock');
  if (!dock) return;

  function isUnlocked(id) {
    // No locking — all pages free to visit
    return true;
  }

  const activeView = localStorage.getItem('cc_active_view') || 'vscode';

  const ICONS = {
    vscode: '/icon/Visual_Studio_Code.svg.webp',
    jira: '/icon/jira-icon.webp',
    whatsapp: '/icon/whatsapp.png',
    // search uses emoji fallback (no icon file provided)
  };
  const ACTION_ICONS = {
    notebook: '/icon/notepad.png',
  };

  function appBtn(id, icon, label) {
    const locked = !isUnlocked(id);
    const active = activeView === id ? 'active' : '';
    const src = ICONS[id];
    const iconHtml = src
      ? `<img class="taskbar__app-icon-img" src="${src}" alt="${label}" width="22" height="22" loading="eager" />`
      : `<span class="taskbar__app-icon" aria-hidden="true">${icon}</span>`;
    return `<button class="taskbar__app ${active}" data-view="${id}" ${locked ? 'disabled title="尚未解鎖"' : `title="${label}"`}>
      ${iconHtml}
      <span class="taskbar__app-dot"></span>
    </button>`;
  }

  function actionBtn(action, fallbackIcon, label) {
    const src = ACTION_ICONS[action];
    const iconHtml = src
      ? `<img class="taskbar__app-icon-img" src="${src}" alt="${label}" width="20" height="20" loading="eager" />`
      : `<span aria-hidden="true">${fallbackIcon}</span>`;
    return `<button class="taskbar__action" data-action="${action}" title="${label}">${iconHtml}</button>`;
  }

  // Windows 11 taskbar layout
  dock.innerHTML = `
    <div class="taskbar__left">
      <div class="taskbar__weather" title="天氣">
        <span class="taskbar__weather-icon">☀️</span>
        <span class="taskbar__weather-text">
          <span class="taskbar__weather-temp">28°C</span>
          <span class="taskbar__weather-desc">晴時多雲</span>
        </span>
      </div>
    </div>

    <div class="taskbar__center">
      <button class="taskbar__start" aria-label="Start" title="開始">
        <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M11.5 11.5H20.5V20.5H11.5V11.5Z" fill="#00A4EF"/>
          <path d="M2.5 11.5H11.5V20.5H2.5V11.5Z" fill="#0078D4"/>
          <path d="M11.5 2.5H20.5V11.5H11.5V2.5Z" fill="#FFB900"/>
          <path d="M2.5 2.5H11.5V11.5H2.5V2.5Z" fill="#F25022"/>
        </svg>
      </button>

      <div class="taskbar__search" role="search" aria-label="Search">
        <span aria-hidden="true">🔍</span>
        <span>搜尋</span>
      </div>

      <div class="taskbar__apps" role="toolbar" aria-label="Apps">
        ${appBtn('vscode', '🧩', t('dock.vscode'))}
        ${appBtn('jira', '📋', t('dock.jira'))}
        ${appBtn('whatsapp', '💬', t('dock.whatsapp'))}
        ${appBtn('search', '🔍', t('dock.search'))}
        <div class="taskbar__sep"></div>
        ${actionBtn('notebook', '📒', t('dock.notebook'))}
        <button class="taskbar__action" data-action="settings" title="${t('dock.settings')}">
          <span aria-hidden="true">⚙️</span>
        </button>
      </div>
    </div>

    <div class="taskbar__right">
      <div class="taskbar__tray">
        <span class="taskbar__tray-icon" title="顯示隱藏的圖示">▲</span>
        <span class="taskbar__tray-icon" title="網路">📶</span>
        <span class="taskbar__tray-icon" title="音效">🔊</span>
        <span class="taskbar__ime" title="輸入法">中</span>
      </div>
      <div class="taskbar__datetime" id="taskbarDatetime" title="日期與時間">
        <span class="taskbar__time" id="taskbarTime">--:-- --</span>
        <span class="taskbar__date" id="taskbarDate">----/--/--</span>
      </div>
    </div>
  `;

  dock.querySelectorAll('[data-view]').forEach(b => {
    b.addEventListener('click', () => onSwitch(b.dataset.view));
  });
  dock.querySelector('[data-action="settings"]')?.addEventListener('click', onOpenSettings);
  dock.querySelector('[data-action="notebook"]')?.addEventListener('click', onOpenNotebook);

  // Search bar click focuses VS Code search or switches to search view
  dock.querySelector('.taskbar__search')?.addEventListener('click', () => {
    if (isUnlocked('search')) onSwitch('search');
    else if (isUnlocked('vscode')) onSwitch('vscode');
  });

  startClock();
}

let clockTimer = null;
function startClock() {
  function tick() {
    const now = new Date();
    const timeEl = document.getElementById('taskbarTime');
    const dateEl = document.getElementById('taskbarDate');
    if (!timeEl || !dateEl) return;
    // Windows style: 3:42 PM / 下午3:42
    const timeStr = now.toLocaleTimeString('zh-TW', { hour: 'numeric', minute: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
    timeEl.textContent = timeStr;
    dateEl.textContent = dateStr;
  }
  tick();
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = setInterval(tick, 60000);
}

export function setActiveView(id) {
  localStorage.setItem('cc_active_view', id);
  document.querySelectorAll('.taskbar__app[data-view]').forEach(b => {
    b.classList.toggle('active', b.dataset.view === id);
  });
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${id}`);
  });
}
