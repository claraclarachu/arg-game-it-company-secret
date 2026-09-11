import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import { downloadText, readFileAsText } from '../utils/storage.js';
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
  document.getElementById('btnExport')?.addEventListener('click', () => {
    downloadText('code-conspiracy-save.json', state.exportSave());
  });
  document.getElementById('btnImport')?.addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await readFileAsText(file);
    const ok = state.importSave(text);
    toast(ok ? t('toast.saved') : 'Import failed', { variant: ok ? undefined : 'error' });
    if (ok) location.reload();
  });
  document.getElementById('btnReset')?.addEventListener('click', async () => {
    if (confirm('Reset all progress?')) {
      try { state.reset(); } catch {}
      try { localStorage.removeItem('code_conspiracy_state'); } catch {}
      try { localStorage.clear(); } catch {}
      const dlg = document.getElementById('settingsDialog');
      if (dlg && dlg.open) try { dlg.close(); } catch {}
      if (dlg) {
        dlg.style.removeProperty('display');
        dlg.removeAttribute('open');
      }
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map(r => r.unregister()));
        }
      } catch {}
      setTimeout(() => {
        window.location.href = window.location.pathname + '?reset=' + Date.now();
        window.location.reload(true);
      }, 150);
    }
  });
  document.getElementById('settingsDialog')?.addEventListener('close', () => {});
}
