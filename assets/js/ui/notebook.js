import { state } from '../core/state.js';

export function openNotebook() {
  const dlg = document.getElementById('notebookDialog');
  if (!dlg) return;
  renderNotebook();
  dlg.showModal?.() || (dlg.style.display = 'block');
}

function renderNotebook() {
  const el = document.getElementById('notebookContent');
  if (!el) return;
  const ev = state.get('collectedEvidence') || [];
  const flags = state.get('flags') || {};
  el.innerHTML = `
    <div class="card">
      <h3 style="margin:0 0 8px">證據 (${ev.length})</h3>
      ${ev.length ? ev.map(e => `<div style="padding:6px 0;border-bottom:1px solid var(--border)"><b>${e.title}</b> <span class="small muted">#${e.id} · ch${e.chapter}</span></div>`).join('') : '<div class="muted small">尚未發現證據。</div>'}
    </div>
    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">Flags</h3>
      <pre class="mono small" style="white-space:pre-wrap">${Object.keys(flags).length ? JSON.stringify(flags, null, 2) : '—'}</pre>
    </div>
  `;
}
