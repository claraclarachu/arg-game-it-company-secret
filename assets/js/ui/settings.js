import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import { toast } from './notifications.js';
import { bgm } from './bgm.js';

export function openSettings() {
  const dlg = document.getElementById('settingsDialog');
  if (!dlg) return;
  // Modal with blur backdrop — blocks background clicks, click on backdrop closes
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal();
  } else if (typeof dlg.show === 'function') {
    if (!dlg.open) dlg.show();
  } else {
    dlg.style.display = 'block';
    dlg.setAttribute('open', '');
  }
  dlg.style.removeProperty('display');
  renderSettingsPanel();
}

function renderSettingsPanel() {
  const themeSel = document.getElementById('settingTheme');
  if (themeSel) themeSel.value = state.get('settings.theme');
  const playtimeEl = document.getElementById('settingPlaytime');
  if (playtimeEl) playtimeEl.textContent = String(state.get('playtime')) + 's';
}

export function bindSettings() {
  document.getElementById('settingTheme')?.addEventListener('change', e => {
    const v = e.target.value;
    state.set('settings.theme', v);
    document.documentElement.setAttribute('data-theme', v);
    toast(t('toast.saved'));
  });
  // BGM controls
  const muteBtn = document.getElementById('bgmMuteBtn');
  const slider = document.getElementById('bgmVolumeSlider');
  const pctEl = document.getElementById('bgmVolumePct');
  if (muteBtn && !muteBtn._bound) {
    muteBtn._bound = true;
    muteBtn.addEventListener('click', () => {
      const muted = bgm.toggleMute();
      muteBtn.textContent = muted ? '🔇' : '🔊';
      if (pctEl) pctEl.textContent = muted ? '靜音' : Math.round(bgm.getVolume() * 100) + '%';
    });
  }
  if (slider && !slider._bound) {
    slider._bound = true;
    slider.addEventListener('input', (e) => {
      const v = parseInt(e.target.value) / 100;
      bgm.setVolume(v);
      bgm.setMuted(false);
      if (muteBtn) muteBtn.textContent = '🔊';
      if (pctEl) pctEl.textContent = Math.round(v * 100) + '%';
    });
  }
  document.getElementById('settingsDialog')?.addEventListener('close', () => {});
}
