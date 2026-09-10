import { state } from '../core/state.js';

export function renderDock({ onSwitch, onOpenSettings, onOpenNotebook, t }) {
  const dock = document.getElementById('dock');
  if (!dock) return;

  function isUnlocked(id) {
    if (id === 'email') {
      // Email app only shows after ch5 triggered and mail dialog closed
      return state.hasFlag('ch5_triggered');
    }
    return true;
  }

  const activeView = localStorage.getItem('cc_active_view') || 'vscode';

  const ICONS = {
    vscode: `${import.meta.env.BASE_URL}icon/vizual-studio-code.svg`,
    intranet: `${import.meta.env.BASE_URL}icon/file-system.svg`,
    jira: `${import.meta.env.BASE_URL}icon/jiua.svg`,
    whatsapp: `${import.meta.env.BASE_URL}icon/whatsup.svg`,
    search: `${import.meta.env.BASE_URL}icon/browser.svg`,
    email: `${import.meta.env.BASE_URL}icon/mail.svg`,
  };
  const ACTION_ICONS = {
    notebook: `${import.meta.env.BASE_URL}icon/notepad.png`,
  };

  function appBtn(id, icon, label) {
    const locked = !isUnlocked(id);
    const active = activeView === id ? 'active' : '';
    const src = ICONS[id];
    let iconHtml;
    if (src && src.startsWith('/icon/')) {
      iconHtml = `<img class="taskbar__app-icon-img" src="${src}" alt="${label}" width="22" height="22" loading="eager" />`;
    } else if (src && src.startsWith('fa-')) {
      if (id === 'jira') {
        iconHtml = `<i class="${src}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(19,91,205,1);--fa-secondary-color:rgba(19,91,205,0.4);color:rgba(19,91,205,1)"></i>`;
      } else if (id === 'vscode') {
        // https://fontawesome.com/icons/classic/solid/cube?pc=rgba(87,165,229,1.00)&sc=rgba(87,165,229,0.4)
        iconHtml = `<i class="${src}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(87,165,229,1);--fa-secondary-color:rgba(87,165,229,0.4);color:rgba(87,165,229,1)"></i>`;
      } else if (id === 'whatsapp') {
        iconHtml = `<i class="${src}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(0,203,90,1);--fa-secondary-color:rgba(0,203,90,0.4);color:rgba(0,203,90,1)"></i>`;
      } else {
        iconHtml = `<i class="${src}" aria-hidden="true" style="font-size:22px;line-height:1;color:currentColor"></i>`;
      }
    } else if (src) {
      iconHtml = `<img class="taskbar__app-icon-img" src="${src}" alt="${label}" width="22" height="22" loading="eager" />`;
    } else {
      iconHtml = `<span class="taskbar__app-icon" aria-hidden="true">${icon}</span>`;
    }
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

      <div class="taskbar__search" role="search" aria-label="Search" aria-disabled="true">
        <span aria-hidden="true">🔍</span>
        <span>搜尋</span>
      </div>

      <div class="taskbar__apps" role="toolbar" aria-label="Apps">
        ${appBtn('vscode', '🧩', t('dock.vscode'))}
        ${appBtn('whatsapp', '💬', t('dock.whatsapp'))}
        ${appBtn('jira', '📋', t('dock.jira'))}
        ${appBtn('search', '🔍', t('dock.search'))}
        ${appBtn('intranet', '🏢', t('dock.intranet'))}
        ${isUnlocked('email') ? appBtn('email', '✉️', 'Email') : ''}
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
        <span class="taskbar__ime" title="輸入法">ENG</span>
      </div>
      <div class="taskbar__datetime" id="taskbarDatetime" title="日期與時間">
        <span class="taskbar__time" id="taskbarTime">--:-- --</span>
        <span class="taskbar__date" id="taskbarDate">----/--/--</span>
      </div>
    </div>
  `;

  dock.querySelectorAll('[data-view]').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.view === 'email') {
        const dlg = document.getElementById('mailDialog');
        if (dlg) {
          // Update To field based on current title
          const title = document.getElementById('mailTitle');
          const to = document.getElementById('mailTo');
          if (title && to) {
            const v = title.value;
            if (v === 'Report') to.value = 'DEA <dea@world.example>';
            else if (v === 'Coperation') to.value = 'Sawyer <sawyer@nori-drinks.example>';
            else if (v === 'Resign') to.value = 'Sawyer <sawyer@nori-drinks.example>';
          }
          dlg.showModal();
        }
        return;
      }
      onSwitch(b.dataset.view);
    });
  });
  dock.querySelector('[data-action="settings"]')?.addEventListener('click', onOpenSettings);
  dock.querySelector('[data-action="notebook"]')?.addEventListener('click', onOpenNotebook);

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
