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
import { mountDarknet } from './apps/darknet/index.js';

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
  mountDarknet();
  bindMail();
  bindStartMenu();
  bindEnding();
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
      <img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
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

// Keep for backwards compat — Jiua still calls trackOnboarding
export function trackOnboarding(action) {
  if (action === 'jira_viewed') state.setFlag('onb_jira_viewed', true);
  if (action === 'vscode_viewed') state.setFlag('onb_vscode_viewed', true);
  // Auto-complete onboarding flag since dialog is removed; no gating
  if (!state.hasFlag('onboarding_done')) state.setFlag('onboarding_done', true);
}

function bindMail() {
  const dialog = document.getElementById('mailDialog');
  const title = document.getElementById('mailTitle');
  const to = document.getElementById('mailTo');
  const send = document.getElementById('mailSend');
  const tempExit = document.getElementById('mailTempExit');
  function updateTo() {
    if (!title || !to) return;
    const v = title.value;
    if (v === 'Report') to.value = 'DEA <dea@nori.example>';
    else if (v === 'Coperation') to.value = 'Sawyer <sawyer@nori.example>';
    else if (v === 'Resign') to.value = 'Sawyer <sawyer@nori.example>';
  }
  title?.addEventListener('change', updateTo);
  updateTo();
  tempExit?.addEventListener('click', () => {
    dialog?.close();
    // keep email app visible for later
    renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
  });
  send?.addEventListener('click', () => {
    const v = title?.value;
    const body = document.getElementById('mailBody')?.value || '';
    let ending = null;
    if (v === 'Report') ending = 'report';
    else if (v === 'Coperation') ending = 'cooperate';
    else if (v === 'Resign') ending = 'resign';
    if (ending) {
      const endings = state.get('endings') || [];
      if (!endings.includes(ending)) {
        endings.push(ending);
        state.set('endings', endings);
        state.setFlag('ending_' + ending, true);
      }
    }
    dialog?.close();
    renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
    if (ending) {
      // Show black screen ending with typing effect as per spec
      setTimeout(() => showEnding(ending), 300);
    } else {
      toast('郵件已寄送: ' + v);
    }
  });
  // Also handle dialog close via backdrop
}

function bindStartMenu() {
  const startBtn = document.querySelector('.taskbar__start');
  const menu = document.getElementById('startMenu');
  if (!startBtn || !menu) return;
  startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'none' || !menu.style.display ? 'block' : 'none';
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
  document.getElementById('startShutdown')?.addEventListener('click', () => { menu.style.display='none'; handleShutdown('shutdown'); });
  document.getElementById('startLogout')?.addEventListener('click', () => { menu.style.display='none'; handleShutdown('logout'); });
}

function handleShutdown(action) {
  const endings = state.get('endings') || [];
  const hasAllDark = state.hasFlag('ch4_all_opened');
  const choice = endings[0];
  let ending = null;
  if (!choice && !hasAllDark) ending = 'flee'; // Ending1 - any logout without mail and without all dark files
  else if (!choice && hasAllDark) ending = 'fried'; // Ending5 - ch5 after logout with all files but no mail choice
  else if (choice === 'report') ending = 'report'; // Ending3
  else if (choice === 'cooperate') ending = 'cooperate'; // Ending2
  else if (choice === 'resign') ending = 'resign'; // Ending4
  else ending = 'flee';
  // push to endings if not already
  const allEndings = state.get('endings') || [];
  if (!allEndings.includes(ending)) {
    allEndings.push(ending);
    state.set('endings', allEndings);
  }
  showEnding(ending);
}

function showEnding(ending) {
  const screen = document.getElementById('endingScreen');
  const title = document.getElementById('endingTitle');
  const desc = document.getElementById('endingDesc');
  const restartBtn = document.getElementById('endingRestart');
  if (!screen || !title || !desc) return;

  const map = {
    flee: { title: '平凡的日常', desc: 
      '你已完成了工作，登出了電腦，走出辨公室，回到家中安心睡一覺。\n第二天回到辨公室，重新開啟電腦，像平常一樣進入辨公模式，但你感覺有點不對勁，昨天看到的一些文件不見了，有部分git history好像有被人改動過的痕跡，你認為你記錯了。\n接下來繼續日復日的重複性工作，漸漸對此工作感到沉悶，但也只能接受不變的人生。' },
    cooperate: { title: '共犯', desc: '你認為老闆是對的。\n你向老闆自告奮勇，參與運毒的工作。不出一天，已分潤到可觀的額外收入，你的生活質素大幅上升，不用再為了是否升級麥當當套餐而煩惱，但可能要為隨時被人闖入家中爆頭感到恐懼。\n你踏出新的這一步，為生活帶來了多一分選擇，不再是一成不變的勞動人生，你更喜歡這充滿刺激的生活。' },
    report: { title: '舉報', desc: '你認為老闆是不對的。\n你選擇報告輯毒處，把證據從內網下載下來，一次交給警方。\n不一會兒，警方到達辨公室，帶住拘捕令走進老闆辨公室，你看着本來充滿笑容的老闆變得呆滯，在眾多員工的眼前被警方押走。\n這件事被傳媒大幅報導，公司也跟著倒閉，市面上出產過的飲品通通下架。\n風波後過了幾個禮拜，人們都忘記了，不再是閒餘茶飯時會提及的話題，你也回到了正常生活，找了一份新的工作，又回到日復日的勞動中。' },
    resign: { title: '辭職', desc: '你發現了公司的秘密。\n你知道對於社會倫理和規範來說是不對的，但你選擇遠離，不參與事端，你希望少一事是一事，因此向老闆提出離職，以不適合這份工作為理由矇混過去。\n老闆了解這年代的年輕人都很有主見，必定是深思熟慮過後的決定，因此沒強留着你，只是拉着你聊了一會兒。\n你對這愉快的工作環境感到不捨，但過了幾個月，你找到了新工作，開始淡忘這兩個月的記憶，也不再在意。' },
    fried: { title: '做對了嗎？', desc: '你發現了公司的秘密。\n但你沒有做出任何行動，你默默關掉電腦，下班回到家裡，打算好好的休息明天再到辨公室繼續上班。\n突然，放在櫃子上的手機震動了一下，收到了公司辭退你的消息。\n其實\n公司也發現了你。' },
  };

  const info = map[ending] || map.flee;

  // Show dialog + title immediately, content will appear after 500ms with typing
  title.textContent = info.title;
  desc.textContent = '';
  if (restartBtn) restartBtn.style.display = 'none';

  // Ensure desc preserves line breaks
  desc.style.whiteSpace = 'pre-wrap';
  desc.style.wordBreak = 'break-word';

  setTimeout(() => {
    screen.style.display = 'flex';
    screen.style.background = '#000';

    // Typing effect - 1 sec per word, +200ms extra at ，/。/、/！/？/； and at \n
    // Split text into words keeping delimiters, chunk Chinese into 4-char words
    let words = [];
    const text = info.desc.replace(/br/g, '\n').replace(/\n+/g, '\n');
    // Normalize: ensure \n are preserved as separate tokens
    const parts = text.split(/([，。、！？；\n\s]+)/).filter(Boolean);
    for (const p of parts) {
      if (/^[\n\s]+$/.test(p)) {
        words.push(p);
      } else if (/^[，。、！？；]+$/.test(p)) {
        words.push(p);
      } else {
        // Chunk long Chinese/English segments into ~4 char words for 1s per word rhythm
        for (let i = 0; i < p.length; i += 1) {
          words.push(p.slice(i, i + 1));
        }
      }
    }

    let wIdx = 0;
    let displayed = '';
    function typeNextWord() {
      if (wIdx >= words.length) {
        if (restartBtn) restartBtn.style.display = 'block';
        return;
      }
      const w = words[wIdx];
      displayed += w;
      // Use textContent with pre-wrap to correctly show \n as line breaks; fallback to innerHTML if needed
      desc.textContent = displayed;
      wIdx++;
      // Determine delay: base 1000ms per word, +200ms if word ends with ，/。/、/！/？/； or is \n
      let delay = 100;
      if (/[，。、！？；]$/.test(w) || w === '\n' || w.includes('\n')) {
        delay += 200;
      }
      // If word is just whitespace/newline, don't add extra 1000, just 200
      if (/^\s+$/.test(w)) delay = 100;
      setTimeout(typeNextWord, delay);
    }
    typeNextWord();
  }, 500);
}

function bindEnding() {
  document.getElementById('endingRestart')?.addEventListener('click', () => {
    try { state.reset(); } catch {}
    try { localStorage.removeItem('code_conspiracy_state'); localStorage.clear(); } catch {}
    const screen = document.getElementById('endingScreen');
    if (screen) screen.style.display = 'none';
    // Ensure state is cleared before reload
    setTimeout(() => location.reload(), 100);
  });
  document.getElementById('endingClose')?.addEventListener('click', () => {
    document.getElementById('endingScreen').style.display = 'none';
  });
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
  // Auto-popup email after ch4 (darknet all files opened and exited)
  window.addEventListener('ch4:complete', () => {
    state.setFlag('ch5_triggered', true);
    renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
    setTimeout(() => {
      const dlg = document.getElementById('mailDialog');
      if (dlg && !dlg.open) {
        // Update To field
        const title = document.getElementById('mailTitle');
        const to = document.getElementById('mailTo');
        if (title && to) {
          const v = title.value;
          if (v === 'Report') to.value = 'DEA <dea@nori.example>';
          else if (v === 'Coperation') to.value = 'Sawyer <sawyer@nori.example>';
          else if (v === 'Resign') to.value = 'Sawyer <sawyer@nori.example>';
        }
        dlg.showModal();
      }
    }, 600);
  });
  window.addEventListener('darknet:exit', () => {
    if (state.hasFlag('ch4_all_opened') && !state.hasFlag('ch5_triggered')) {
      state.setFlag('ch5_triggered', true);
      renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
      setTimeout(() => {
        const dlg = document.getElementById('mailDialog');
        if (dlg && !dlg.open) dlg.showModal();
      }, 400);
    } else if (state.hasFlag('ch5_triggered')) {
      // Ensure email app is visible and also auto-popup if not yet sent
      const endings = state.get('endings') || [];
      if (!endings.length) {
        setTimeout(() => {
          const dlg = document.getElementById('mailDialog');
          if (dlg && !dlg.open) dlg.showModal();
        }, 400);
      }
    }
  });
  // Also listen for state flag change for ch5_triggered to re-render dock
  state.on('change', (e) => {
    if (e && e.path && e.path.includes('ch5_triggered')) {
      renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
    }
  });
  document.querySelectorAll('dialog').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d) d.close(); });
    d.addEventListener('close', () => {
      // Ensure fallback display is cleared and dialog is hidden behind page
      d.style.display = 'none';
      // Small delay to allow native close to remove [open], then ensure hidden
      setTimeout(() => { if (!d.open) d.style.display = 'none'; }, 0);
    });
    // Ensure showModal fallback is handled
    const origShowModal = d.showModal;
    if (origShowModal) {
      d.showModal = function() {
        this.style.display = 'block';
        return origShowModal.call(this);
      };
    }
  });
  // Fix notebook close buttons that use inline onclick="this.closest('dialog').close()"
  document.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn && btn.textContent.trim() === '關閉' && btn.closest('dialog')) {
      const dlg = btn.closest('dialog');
      // Allow native close to happen, then ensure hidden
      setTimeout(() => { if (!dlg.open) dlg.style.display = 'none'; }, 50);
    }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
