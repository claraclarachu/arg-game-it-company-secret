import { state } from '../core/state.js';
import { bgm } from './bgm.js';

// REVAMP_PLAN §4: 5 chapters + onboarding
const chapterNames = ['教學', '異常發現', '自由探索', '暗網入口', '秘密曝光', '抉擇'];
const totalEvidence = 13;

// 介面顯示名稱對照
const interfaceLabels = {
  vscode: 'Vizual',
  jira: 'Jiua',
  whatsapp: 'WhatUp',
  search: 'Search',
  intranet: 'Intranet',
  darknet: 'Darknet',
  email: 'Email'
};
function formatInterfaces(list) {
  if (!list || !list.length) return '—';
  return list.map(i => interfaceLabels[i] || i).join(', ');
}

function getAchievements(ev) {
  const all = [
    { id: 'first_evidence', title: '初次發現', desc: '取得第一個證據', check: () => ev.length >= 1 },
    { id: 'collector', title: '蒐集者', desc: '取得 5 個證據', check: () => ev.length >= 5 },
    { id: 'master', title: '真相大師', desc: '取得 10 個證據', check: () => ev.length >= 10 },
    { id: 'darknet_entered', title: '暗網闖入者', desc: '成功進入暗網', check: () => state.hasFlag('dark_entered') || state.hasFlag('hidden_portal_accessed') },
    { id: 'darknet_complete', title: '暗網全覽', desc: '開啟所有暗網檔案', check: () => state.hasFlag('ch4_all_opened') },
  ];
  return all.map(a => ({ ...a, done: a.check() }));
}

export function openNotebook() {
  const dlg = document.getElementById('notebookDialog');
  if (!dlg) return;
  renderNotebook();
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal();
  } else {
    dlg.setAttribute('open', '');
    dlg.style.display = 'block';
  }
  // Ensure backdrop click closes correctly
  if (!dlg._boundClose) {
    dlg.addEventListener('close', () => {
      dlg.style.display = 'none';
      dlg.removeAttribute('open');
    });
    dlg._boundClose = true;
  }
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
        <h3 style="margin:0">進度 · Chapter ${ch} / 5 — ${chapterNames[ch]||'—'}</h3>
        <span class="badge">${ev.length} 證據</span>
      </div>
      <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:${Math.min(100, Math.round(ch/5*100))}%;height:100%;background:var(--accent)"></div></div>
      <div class="small muted" style="margin-top:6px">遊玩時長 ${state.get('playtime')}s · 已解鎖 ${formatInterfaces(state.get('unlockedInterfaces'))}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">證據板 (${ev.length}/${totalEvidence})</h3>
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
      ` : '<div class="muted small">尚未發現證據。完成 Ch0 工單後開始探索吧。</div>'}
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
      <h3 style="margin:0 0 8px">背景音樂</h3>
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn" id="bgmMuteBtn" style="min-width:48px">${bgm.isMutedState() ? '🔇' : '🔊'}</button>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px">
          <input type="range" id="bgmVolumeSlider" min="0" max="100" value="${Math.round(bgm.getVolume()*100)}" style="width:100%;accent-color:var(--accent)" />
          <div class="small muted" style="text-align:center">${Math.round(bgm.getVolume()*100)}%</div>
        </div>
      </div>
      <div class="small muted" style="margin-top:6px">正在播放：${bgm.getCurrentBgm() || '無'}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">章節</h3>
      <div style="display:grid;gap:4px">
        ${chapterNames.map((n,i)=>`<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:${i<=ch?'var(--bg-tertiary)':'var(--bg-primary)'};border:1px solid var(--border)"><span>Ch${i} ${n}</span><span class="small ${i<ch?'':i===ch?'badge':''}" style="${i===ch?'background:var(--accent);color:#fff':''}">${i<ch?'完成':i===ch?'進行中':'未開始'}</span></div>`).join('')}
      </div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="navigator.clipboard.writeText(JSON.stringify(JSON.parse(localStorage.getItem('code_conspiracy_state')||'{}'), null, 2))">複製存檔 JSON</button>
      <button class="btn" id="notebookResetBtn">重置 notebook</button>
    </div>
  `;
  // Bind reset button with proper state reset and rerender
  setTimeout(() => {
    const btn = document.getElementById('notebookResetBtn');
    if (!btn || btn._bound) return;
    btn._bound = true;
    btn.addEventListener('click', async () => {
      if (!confirm('重置後將失去證據，確定？')) return;
      // Close dialog first to avoid backdrop blocking reload
      const dlg = document.getElementById('notebookDialog');
      try { if (dlg && dlg.open) dlg.close(); } catch {}
      if (dlg) { dlg.style.display = 'none'; dlg.removeAttribute('open'); }
      try { state.reset(); } catch {}
      try { localStorage.removeItem('code_conspiracy_state'); } catch {}
      try { localStorage.clear(); } catch {}
      // Clear service worker cache to prevent stale assets on reload
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
      // Hard reload with cache bust
      setTimeout(() => {
        window.location.href = window.location.pathname + '?reset=' + Date.now();
        window.location.reload(true);
      }, 150);
    });

    // BGM controls
    const muteBtn = document.getElementById('bgmMuteBtn');
    const slider = document.getElementById('bgmVolumeSlider');
    if (muteBtn && !muteBtn._bound) {
      muteBtn._bound = true;
      muteBtn.addEventListener('click', () => {
        const muted = bgm.toggleMute();
        muteBtn.textContent = muted ? '🔇' : '🔊';
        const pctEl = muteBtn.parentElement?.querySelector('.small');
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
        const pctEl = slider.parentElement?.querySelector('.small');
        if (pctEl) pctEl.textContent = Math.round(v * 100) + '%';
      });
    }
  }, 0);
}
