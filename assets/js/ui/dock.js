import { state } from '../core/state.js';

export function renderDock({ onSwitch, onOpenSettings, onOpenNotebook, t }) {
  const dock = document.getElementById('dock');
  if (!dock) return;

  function isUnlocked(id) {
    return state.get('unlockedInterfaces').includes(id);
  }

  function btn(id, icon, label) {
    const locked = !isUnlocked(id);
    return `<button class="dock__btn" data-view="${id}" ${locked ? 'disabled title="尚未解鎖"' : ''}>
      <span aria-hidden="true">${icon}</span><span>${label}</span>
    </button>`;
  }

  dock.innerHTML = [
    btn('vscode', '⌨️', t('dock.vscode')),
    btn('jira', '📋', t('dock.jira')),
    btn('whatsapp', '💬', t('dock.whatsapp')),
    btn('search', '🔍', t('dock.search')),
    `<div class="dock__sep"></div>`,
    `<button class="dock__btn" data-action="notebook">📒<span>${t('dock.notebook')}</span></button>`,
    `<button class="dock__btn" data-action="settings">⚙️<span>${t('dock.settings')}</span></button>`,
  ].join('');

  dock.querySelectorAll('[data-view]').forEach(b => {
    b.addEventListener('click', () => onSwitch(b.dataset.view));
  });
  dock.querySelector('[data-action="settings"]')?.addEventListener('click', onOpenSettings);
  dock.querySelector('[data-action="notebook"]')?.addEventListener('click', onOpenNotebook);
}

export function setActiveView(id) {
  document.querySelectorAll('.dock__btn[data-view]').forEach(b => {
    b.classList.toggle('active', b.dataset.view === id);
  });
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${id}`);
  });
}
