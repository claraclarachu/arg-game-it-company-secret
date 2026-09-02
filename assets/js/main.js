import { state } from './core/state.js';
import { events } from './core/events.js';
import { startEngine } from './core/engine.js';
import { t } from './core/i18n.js';
import { renderDock, setActiveView } from './ui/dock.js';
import { toast } from './ui/notifications.js';
import { openSettings, bindSettings } from './ui/settings.js';
import { openNotebook } from './ui/notebook.js';
import { mountVSCode } from './apps/vscode/index.js';
import { mountJira } from './apps/jira/index.js';
import { mountWhatsApp, openChat as openWhatsAppChat } from './apps/whatsapp/index.js';
import { mountSearch } from './apps/search/index.js';
import { mountIntranet } from './apps/intranet/index.js';

function applyTheme() {
  const theme = state.get('settings.theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

function switchView(id) {
  // All interfaces are unlocked from the start — free navigation
  setActiveView(id);
  localStorage.setItem('cc_active_view', id);
}

function mountAll() {
  mountVSCode();
  mountJira();
  mountWhatsApp();
  mountSearch();
  mountIntranet();
}

// Windows-style WhatUp notification (bottom-right, 10s, click -> Dev Team chat)
let _notifTimer = null;
function showMaggieNotification() {
  // avoid duplicate if already shown this session
  if (document.getElementById('wa-win-notification')) return;

  const container = document.createElement('div');
  container.id = 'wa-win-notification';
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'polite');
  container.innerHTML = `
    <div class="win-notif__app">
      <i class="fa-duotone fa-solid fa-comment-sms" style="font-size:20px;--fa-primary-color:rgba(0,203,90,1);--fa-secondary-color:rgba(0,203,90,0.4);color:rgba(0,203,90,1)"></i>
      <span class="win-notif__app-name">WhatUp</span>
      <span class="win-notif__app-sub">Dev Team</span>
      <button class="win-notif__close" aria-label="關閉">✕</button>
    </div>
    <div class="win-notif__body">
      <div class="win-notif__avatar">M</div>
      <div class="win-notif__text">
        <div class="win-notif__sender">Maggie</div>
        <div class="win-notif__msg">Hi @Casey, 有新的工單 INV-2024-0042, 請協助處理一下</div>
        <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
      </div>
    </div>
    <div class="win-notif__progress"></div>
  `;

  // click anywhere on notification -> open WhatUp Dev Team
  container.addEventListener('click', (e) => {
    // close button handled separately
    if (e.target.closest('.win-notif__close')) return;
    dismissNotification();
    // Ensure WhatUp is mounted then switch
    try { openWhatsAppChat('dev-team'); } catch (_) {}
    switchView('whatsapp');
  });

  container.querySelector('.win-notif__close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissNotification();
  });

  document.body.appendChild(container);
  // trigger entrance
  requestAnimationFrame(() => container.classList.add('show'));

  // auto dismiss after 10s
  _notifTimer = setTimeout(() => dismissNotification(), 10000);
  // also emit toast for accessibility but keep win style primary
}

function dismissNotification() {
  const el = document.getElementById('wa-win-notification');
  if (!el) return;
  clearTimeout(_notifTimer);
  el.classList.remove('show');
  el.classList.add('hide');
  setTimeout(() => el.remove(), 280);
}

// Keep for backwards compat — Jira still calls trackOnboarding
export function trackOnboarding(action) {
  if (action === 'jira_viewed') state.setFlag('onb_jira_viewed', true);
  if (action === 'vscode_viewed') state.setFlag('onb_vscode_viewed', true);
  // Auto-complete onboarding flag since dialog is removed; no gating
  if (!state.hasFlag('onboarding_done')) state.setFlag('onboarding_done', true);
}

function init() {
  applyTheme();
  renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
  bindSettings();
  mountAll();
  const last = localStorage.getItem('cc_active_view') || 'vscode';
  switchView(state.get('unlockedInterfaces').includes(last) ? last : 'vscode');
  startEngine();
  // Mark onboarding done immediately (no dialog) so engine progresses
  if (!state.hasFlag('onboarding_done')) state.setFlag('onboarding_done', true);
  // Show Windows-style WhatUp notification shortly after load
  setTimeout(() => showMaggieNotification(), 800);
  events.on('puzzle:solved', p => { toast('✓ ' + p.title); });
  events.on('interfaceUnlocked', id => { toast(t('toast.unlocked') + ': ' + id); renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t }); });
  events.on('evidence', e => { toast(t('toast.evidence') + ': ' + e.title); });
  state.on('change', () => applyTheme());
  document.querySelectorAll('dialog').forEach(d => { d.addEventListener('click', e => { if (e.target === d) d.close(); }); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
