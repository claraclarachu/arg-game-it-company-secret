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
import { mountWhatsApp } from './apps/whatsapp/index.js';
import { mountSearch } from './apps/search/index.js';

function applyTheme() {
  const theme = state.get('settings.theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
}

function switchView(id) {
  if (!state.get('unlockedInterfaces').includes(id)) {
    toast('🔒 未解鎖: ' + id);
    return;
  }
  setActiveView(id);
  localStorage.setItem('cc_active_view', id);
}

function bindTopbar() {
  document.getElementById('clock') && setInterval(() => {
    const el = document.getElementById('clock');
    if (el) el.textContent = new Date().toLocaleTimeString();
  }, 1000);
}

function mountAll() {
  mountVSCode();
  mountJira();
  mountWhatsApp();
  mountSearch();
}

function init() {
  applyTheme();
  renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
  bindSettings();
  bindTopbar();
  mountAll();
  const last = localStorage.getItem('cc_active_view') || 'vscode';
  switchView(state.get('unlockedInterfaces').includes(last) ? last : 'vscode');
  startEngine();

  // onboarding flag helper
  if (!state.hasFlag('onboarding_done')) {
    // auto set after first interaction
    setTimeout(() => {
      state.setFlag('onboarding_done', true);
    }, 800);
  }

  events.on('puzzle:solved', p => {
    toast(`✓ ${p.title}`);
  });
  events.on('interfaceUnlocked', id => {
    toast(`${t('toast.unlocked')}: ${id}`);
    renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
  });
  events.on('evidence', e => {
    toast(`${t('toast.evidence')}: ${e.title}`);
  });
  state.on('change', () => applyTheme());
  // Close dialogs backdrop click
  document.querySelectorAll('dialog').forEach(d => {
    d.addEventListener('click', e => {
      if (e.target === d) d.close();
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
