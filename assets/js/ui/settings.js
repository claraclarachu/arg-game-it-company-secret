import { state } from '../core/state.js';
import { t } from '../core/i18n.js';
import { downloadText, readFileAsText } from '../utils/storage.js';
import { toast } from './notifications.js';

export function openSettings() {
  const dlg = document.getElementById('settingsDialog');
  if (!dlg) return;
  dlg.showModal?.() || (dlg.style.display = 'block');
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
  document.getElementById('btnReset')?.addEventListener('click', () => {
    if (confirm('Reset all progress?')) { state.reset(); location.reload(); }
  });
  document.getElementById('settingsDialog')?.addEventListener('close', () => {});
}
