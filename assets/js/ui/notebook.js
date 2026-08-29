import { state } from '../core/state.js';

const chapterNames = ['教學','異常發現','隱藏入口','資金流','帳本','網絡','對峙'];

function getAchievements(ev) {
  const all = [
    { id: 'first_evidence', title: '初次發現', desc: '取得第一個證據', check: () => ev.length >= 1 },
    { id: 'collector', title: '蒐集者', desc: '取得 5 個證據', check: () => ev.length >= 5 },
    { id: 'master', title: '真相大師', desc: '取得 10 個證據', check: () => ev.length >= 10 },
    { id: 'portal_found', title: '入口發現者', desc: '觸發 420.69', check: () => state.hasFlag('hidden_portal_accessed') },
    { id: 'bypass', title: '驗證破解', desc: '繞過 Portal 驗證', check: () => state.hasFlag('portal_auth_bypassed') },
  ];
  return all.map(a => ({ ...a, done: a.check() }));
}

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
  const ch = state.get('currentChapter') ?? 0;
  const ach = getAchievements(ev);
  const doneAch = ach.filter(a=>a.done).length;

  el.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">進度 · Chapter ${ch} / 6 — ${chapterNames[ch]||'—'}</h3>
        <span class="badge">${ev.length} 證據</span>
      </div>
      <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:${Math.min(100, Math.round(ch/6*100))}%;height:100%;background:var(--accent)"></div></div>
      <div class="small muted" style="margin-top:6px">遊玩時長 ${state.get('playtime')}s · 已解鎖 ${state.get('unlockedInterfaces')?.join(', ')}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">證據板 (${ev.length}/14)</h3>
      ${ev.length ? `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
          ${ev.map(e => `
            <div class="card" style="padding:8px;background:var(--bg-primary);border-left:3px solid var(--accent);cursor:grab">
              <div style="font-weight:700;font-size:13px">${e.title}</div>
              <div class="small muted">#${e.id} · ch${e.chapter} · ${e.type}</div>
              <div class="small muted" style="margin-top:4px">${new Date(e.discoveredAt).toLocaleDateString('zh-TW')}</div>
              <div style="margin-top:6px;display:flex;gap:4px">
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="navigator.clipboard.writeText('${e.title}')">複製</button>
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="alert('已標記: ${e.title}')">標記</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="small muted" style="margin-top:8px">提示：拖拉卡片可模擬關聯（未來關卡編輯器）· 共同關鍵字：cocoa/420.69</div>
      ` : '<div class="muted small">尚未發現證據。去 VS Code 搜尋 "redirectTo" 或開啟 .env.example</div>'}
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">成就 (${doneAch}/${ach.length})</h3>
      <div style="display:grid;gap:6px">
        ${ach.map(a => `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:${a.done?'var(--bg-tertiary)':'var(--bg-primary)'};opacity:${a.done?1:.6}">
          <div><div style="font-weight:600;font-size:13px">${a.done?'✓':''} ${a.title}</div><div class="small muted">${a.desc}</div></div>
          <span class="badge" style="background:${a.done?'var(--success)':'var(--border)'};color:${a.done?'#fff':'var(--fg-muted)'}">${a.done?'已解鎖':'未解鎖'}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">章節</h3>
      <div style="display:grid;gap:4px">
        ${chapterNames.map((n,i)=>`<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:${i<=ch?'var(--bg-tertiary)':'var(--bg-primary)'};border:1px solid var(--border)"><span>Ch${i} ${n}</span><span class="small ${i<ch?'':i===ch?'badge':''}" style="${i===ch?'background:var(--accent);color:#fff':''}">${i<ch?'完成':i===ch?'進行中':'未開始'}</span></div>`).join('')}
      </div>
    </div>

    <details style="margin-top:12px" class="card">
      <summary style="cursor:pointer;font-weight:600">Flags (${Object.keys(flags).length})</summary>
      <pre class="mono small" style="white-space:pre-wrap;margin-top:8px;max-height:160px;overflow:auto">${Object.keys(flags).length ? JSON.stringify(flags, null, 2) : '—'}</pre>
    </details>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="navigator.clipboard.writeText(JSON.stringify(JSON.parse(localStorage.getItem('code_conspiracy_state')), null, 2))">複製存檔 JSON</button>
      <button class="btn" onclick="if(confirm('重置後將失去證據，確定？')){localStorage.removeItem('code_conspiracy_state'); location.reload();}">重置 notebook</button>
    </div>
  `;
}
