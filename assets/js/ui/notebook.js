import { state } from '../core/state.js';

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

function formatPlaytime(sec) {
  sec = Number(sec) || 0;
  if (sec <= 59) return `${sec} 秒`;
  if (sec < 3600) return `${Math.floor(sec / 60)} 分鐘`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} 小時`;
  return `${Math.floor(sec / 86400)} 日`;
}

function getAchievements() {
  const readArticles = state.get('readArticles') || [];
  const discovered = state.get('discoveredFiles') || [];
  const endings = state.get('endings') || [];
  const sent = state.get('whatsappSentCount') || 0;

  const sawyerBlogs = [
    'https://sawyer-blog.example/2001-10-18',
    'https://sawyer-blog.example/2003-04-27',
    'https://sawyer-blog.example/2004-11-13',
    'https://sawyer-blog.example/2006-09-01',
    'https://sawyer-blog.example/2007-01-11',
    'https://sawyer-blog.example/2007-01-12',
    'https://sawyer-blog.example/2010-06-06',
    'https://sawyer-blog.example/2012-07-07',
    'https://sawyer-blog.example/2013-01-01',
    'https://sawyer-blog.example/2023-04-25',
    'https://sawyer-blog.example/2023-05-01',
    'https://sawyer-blog.example/2023-05-10',
    'https://sawyer-blog.example/2023-12-20',
    'https://sawyer-blog.example/2024-01-15',
    'https://sawyer-blog.example/2024-03-20',
  ];
  const schoolEssay = ['https://school.example/guangzhi-essay-sawyer'];
  const carNews = [
    'https://news.example/car-accident-2023',
    'https://news.example/car-accident-investigation-2023',
    'https://news.example/ping-wo-suspicious-man-2023',
    'https://news.example/police-clarification-2023',
  ];
  const bossUrls = [...sawyerBlogs, ...schoolEssay, ...carNews]; // 20

  const allBlogUrls = [
    ...sawyerBlogs,
    'https://mary-blog.example/kyoto-sakura-2024',
    'https://mary-blog.example/one-person-kitchen',
    'https://mary-blog.example/danshari-half-year',
    'https://peter-blog.example/python-one-year',
    'https://peter-blog.example/vim-vs-vscode',
    'https://peter-blog.example/nas-ds220',
    'https://peter-blog.example/code-easter-eggs',
    'https://paul-blog.example/tainan-beef-soup',
    'https://paul-blog.example/hand-drip-coffee',
    'https://paul-blog.example/keelung-night-market',
    'https://emma-blog.example/contax-t2-taipei',
    'https://emma-blog.example/iceland-aurora',
    'https://david-blog.example/vinyl-jazz-20',
    'https://david-blog.example/livehouse-map',
  ]; // 29

  const darkTotal = 10;
  const darkCurrent = discovered.filter(p => p.startsWith('/darknet')).length;

  const portalSimple = state.hasFlag('portal_simple_entered') ? 1 : 0;
  const portalHash = state.hasFlag('portal_hash_entered') ? 1 : 0;

  const all = [
    {
      id: 'secret_entry',
      title: '解鎖秘密入口',
      desc: '進入公司秘密內部系統入口',
      total: 2,
      current: portalSimple + portalHash,
      isSecret: false,
    },
    {
      id: 'boss_whisper',
      title: '老闆知音',
      desc: '已了解老闆的一切',
      total: 20,
      current: bossUrls.filter(u => readArticles.includes(u)).length,
      isSecret: false,
    },
    {
      id: 'too_much',
      title: '你知道得太多了',
      desc: '閱讀所有秘密檔案',
      total: darkTotal,
      current: Math.min(darkCurrent, darkTotal),
      isSecret: false,
    },
    {
      id: 'all_endings',
      title: '作者感謝您',
      desc: '解鎖全結局',
      total: 5,
      current: endings.length,
      isSecret: false,
    },
    {
      id: 'social',
      title: '社牛',
      desc: '在 WhatUp 發送超過 10 條訊息',
      total: 10,
      current: Math.min(sent, 10),
      isSecret: true,
    },
    {
      id: 'reader',
      title: '閱讀達人',
      desc: '閱讀 BlogWorld 上的所有部落格',
      total: 29,
      current: allBlogUrls.filter(u => readArticles.includes(u)).length,
      isSecret: true,
    },
    {
      id: 'miracle',
      title: '你沒有被解僱是奇蹟',
      desc: '向 Sawyer 發送帶有「垃圾」「蠢」等字眼的訊息',
      total: 1,
      current: state.hasFlag('sawyer_abuse_sent') ? 1 : 0,
      isSecret: true,
    },
    {
      id: 'net_addict',
      title: '網路成癮',
      desc: '在搜尋引擎搜尋超過 50 次',
      total: 50,
      current: Math.min((state.get('searchHistory') || []).length, 50),
      isSecret: true,
    },
  ];
  return all.map(a => ({ ...a, done: a.current >= a.total, progress: `${a.current}/${a.total}`, pct: Math.round(a.current / a.total * 100) }));
}

// 5 endings — title must match ending dialog titles in main.js
const endingsMeta = [
  { id: 'flee', idx: 1, title: '平凡的日常', desc: '完成工作後登出，回到平凡重複的日常。', color: '#6b778c' },
  { id: 'cooperate', idx: 2, title: '共犯', desc: '與老闆合作，踏入充滿刺激與風險的新生活。', color: '#d93025' },
  { id: 'report', idx: 3, title: '舉報', desc: '向警方舉報，目睹公司倒閉與風波後的平靜。', color: '#0d9488' },
  { id: 'resign', idx: 4, title: '辭職', desc: '遠離是非，主動辭職尋找新的工作與記憶。', color: '#6554c0' },
  { id: 'fried', idx: 5, title: '做對了嗎？', desc: '公司已發現你。', color: '#ff991f' },
];


export function openNotebook() {
  const dlg = document.getElementById('notebookDialog');
  if (!dlg) return;
  renderNotebook();
  // Modal with blur backdrop — blocks background interaction, click on backdrop closes
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal();
  } else if (typeof dlg.show === 'function') {
    if (!dlg.open) dlg.show();
  } else {
    dlg.setAttribute('open', '');
    dlg.style.display = 'block';
  }
  dlg.style.removeProperty('display');
  // Ensure backdrop click closes correctly
  if (!dlg._boundClose) {
    dlg.addEventListener('close', () => {
      dlg.style.removeProperty('display');
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
  const ach = getAchievements();
  const doneAch = ach.filter(a=>a.done).length;
  const endings = state.get('endings') || [];
  // Build endings grid — 2 columns × 5 rows, larger cards to show full title
  const endingsCarouselHtml = (() => {
    const cards = endingsMeta.map(meta => {
      const unlocked = endings.includes(meta.id);
      const mask = '？'.repeat([...meta.title].length);
      return `
        <div class="nb-ending-card ${unlocked?'unlocked':'locked'}" data-ending="${meta.id}" title="${unlocked ? meta.title : mask}">
          <div class="nb-ending-title" style="${unlocked?`color:${meta.color}`:''}">${unlocked ? meta.title : mask}</div>
          <div class="small muted nb-ending-desc">${unlocked ? meta.desc : '尚未達成此結局'}</div>
          <div class="nb-ending-badge ${unlocked?'done':''}">${unlocked ? '已達成' : '未達成'}</div>
        </div>
      `;
    }).join('');
    return `
      <div class="card nb-endings-card" style="margin-top:12px">
        <div style="margin-bottom:10px">
          <h3 style="margin:0">結局收集 (${endings.length}/5)</h3>
        </div>
        <div class="nb-endings-grid">
          ${cards}
        </div>
      </div>
    `;
  })();

  el.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">進度 · Chapter ${ch} / 5 — ${chapterNames[ch]||'—'}</h3>
        <span class="badge">${ev.length} 證據</span>
      </div>
      <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:${Math.min(100, Math.round(ch/5*100))}%;height:100%;background:var(--accent)"></div></div>
      <div class="small muted" style="margin-top:6px">遊玩時長 ${formatPlaytime(state.get('playtime'))} · 已解鎖 ${formatInterfaces(state.get('unlockedInterfaces'))}</div>
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
      <div style="display:grid;gap:10px">
        ${ach.map(a => {
          const isSecretMasked = a.isSecret && !a.done;
          const titleDisplay = isSecretMasked ? '？'.repeat([...a.title].length) : a.title;
          const descDisplay = isSecretMasked ? '？'.repeat([...a.desc].length) : a.desc;
          return `<div style="padding:10px;border:1px solid var(--border);border-radius:8px;background:${a.done?'var(--bg-tertiary)':'var(--bg-primary)'};opacity:${isSecretMasked?0.9:1}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span>${a.done ? '🏆' : (a.isSecret ? '🔒' : '◯')}</span>
                  <span>${titleDisplay}</span>
                  ${a.isSecret ? `<span class="small muted" style="border:1px solid var(--border);padding:1px 4px;border-radius:4px;font-size:10px">${a.done ? '隱藏已解鎖' : '隱藏成就'}</span>` : ''}
                </div>
                <div class="small muted" style="margin-top:2px;word-break:break-word">${descDisplay}</div>
                <div style="margin-top:8px;height:6px;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:999px;overflow:hidden">
                  <div style="width:${a.pct}%;height:100%;background:${a.done?'var(--success)':'var(--accent)'};transition:width .3s"></div>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0;min-width:72px">
                <div style="font-weight:700;font-size:12px">${a.progress}</div>
                <span class="badge" style="margin-top:4px;display:inline-block;background:${a.done?'var(--success)':'var(--border)'};color:${a.done?'#fff':'var(--fg-muted)'}">${a.done?'已解鎖':'未解鎖'}</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">章節</h3>
      <div style="display:grid;gap:4px">
        ${chapterNames.map((n,i)=>`<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:${i<=ch?'var(--bg-tertiary)':'var(--bg-primary)'};border:1px solid var(--border)"><span>Ch${i} ${n}</span><span class="small ${i<ch?'':i===ch?'badge':''}" style="${i===ch?'background:var(--accent);color:#fff':''}">${i<ch?'完成':i===ch?'進行中':'未開始'}</span></div>`).join('')}
      </div>
    </div>
    ${endingsCarouselHtml}

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
      if (dlg) {
        dlg.style.removeProperty('display');
        dlg.removeAttribute('open');
      }
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
  }, 0);
  // ── Endings card click feedback (no carousel) ──
  setTimeout(() => {
    const grid = document.querySelector('.nb-endings-grid');
    if (!grid) return;
    grid.querySelectorAll('.nb-ending-card.unlocked').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.ending;
        const meta = endingsMeta.find(m => m.id === id);
        if (meta) {
          try {
            const ev = new CustomEvent('nb:endingPreview', { detail: meta });
            window.dispatchEvent(ev);
          } catch {}
          card.classList.add('pulse');
          setTimeout(() => card.classList.remove('pulse'), 600);
        }
      });
    });
  }, 0);
}
