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

function mountAll() {
  mountVSCode();
  mountJira();
  mountWhatsApp();
  mountSearch();
}

const onboardingSteps = [
  { key: 'intro', title: '深夜加班', html: '<div style="line-height:1.8"><p style="font-size:14px;color:var(--fg-secondary);margin-bottom:12px">⏰ 23:42 · 辦公室只剩監控燈號在閃</p><p style="margin-bottom:10px">你是 Acme Corp 的後端工程師，原本以為今晚能準點下班...</p><p style="margin-bottom:10px">手機震動 — <strong>WhatsApp</strong> 彈出訊息：</p><div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:12px;margin:10px 0;font-size:13px"><strong style="color:var(--accent)">PM (專案經理)</strong> 23:41<br>"INV-2024-0042 計費模組邊緣案例卡住了，明早要上線，今晚麻煩你看一下 🙏"</div><p style="margin-top:10px;color:var(--fg-secondary)">你嘆了口氣，打開 <strong>Jira</strong> 看看這張票到底是什麼鬼...</p></div>', complete: () => state.hasFlag('onb_jira_viewed') },
  { key: 'jira_guide', title: 'Jira 票據詳情', html: '<div style="line-height:1.8"><p style="font-size:14px;color:var(--fg-secondary);margin-bottom:12px">📋 Jira · INV-2024-0042</p><div style="background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:12px;margin:10px 0;font-size:13px;white-space:pre-wrap"><strong>INV-2024-0042</strong> · 修復計費模組邊緣案例 — 特定金額計算錯誤<strong>Status:</strong> To Do  ·  <strong>Assignee:</strong> 你<strong>Description:</strong>復現步驟: 使用特定總金額觸發計費流程，觀察是否重新導向到內部頁。關聯檔案: src/billing/service.js#calculateAmount評論: @qa-lee "這個 420.69 的數好像會跳到一個內部 portal，之前 finance 說別碰"</div><p style="margin-top:10px"><strong>提示：</strong>點擊 Jira 左側列表的 <span class="badge">INV-2024-0042</span> 可查看詳情，然後前往 <strong>VS Code</strong> 打開 <code>src/billing/service.js</code> 看看是什麼邊緣案例...</p></div>', complete: () => state.hasFlag('onb_jira_viewed') },
  { key: 'vscode_guide', title: 'VS Code 追蹤 Bug', html: '<div style="line-height:1.8"><p style="font-size:14px;color:var(--fg-secondary);margin-bottom:12px">💻 VS Code · src/billing/service.js</p><p>打開左側檔案總管 <span class="badge">Explorer (Ctrl+Shift+E)</span>，找到 <code>src/billing/service.js</code>：</p><div style="background:#0b0b0b;border:1px solid var(--border);border-radius:8px;padding:12px;margin:10px 0;font-family:var(--font-mono);font-size:12px;color:#d4d4d4;overflow:auto"><code><span style="color:#6a9955">// billing/service.js</span><span style="color:#569cd6">export function</span> <span style="color:#dcdcaa">calculateAmount</span>(items, opts = {}) { <span style="color:#569cd6">const</span> subtotal = items.<span style="color:#dcdcaa">reduce</span>((s, i) => s + i.price * i.qty, 0); <span style="color:#569cd6">const</span> fee = <span style="color:#dcdcaa">computeFee</span>(subtotal, opts); <span style="color:#6a9955">// 手續費邏輯藏著分潤</span> <span style="color:#569cd6">const</span> total = subtotal + fee; <span style="color:#569cd6">if</span> (total === <span style="color:#b5cea8">420.69</span>) { <span style="color:#6a9955">// 隱藏的業務邏輯：內部審核入口</span> <span style="color:#569cd6">return</span> <span style="color:#dcdcaa">redirectTo</span>(<span style="color:#ce9178">\'/internal/portal\'</span>); } <span style="color:#569cd6">return</span> total; }</code></div><p style="margin-top:10px"><strong>💡 發現了！</strong> 第 <strong>9 行</strong> 有個 <code>420.69</code> 的神秘判斷，會導向 <code>/internal/portal</code>...</p><p style="color:var(--fg-secondary);font-size:13px">(在 VS Code 左側搜尋框輸入 <span class="badge">420.69</span> 或按 <span class="badge">Ctrl+P</span> 快速開啟)</p></div>', complete: () => state.hasFlag('onb_vscode_viewed') },
  { key: 'anomaly_found', title: '異常發現', html: '<div style="line-height:1.8"><p style="font-size:14px;color:var(--fg-secondary);margin-bottom:12px">⚠️ 發現異常代碼</p><p>這段 <code>if (total === 420.69) redirectTo(\'/internal/portal\')</code> 明顯不正常 —</p><ul style="margin:10px 0;padding-left:20px"><li>為什麼是 <strong>420.69</strong> 這個數字？</li><li>什麼是 <code>/internal/portal</code>？公司沒有這個系統啊...</li><li>註解寫著「內部審核入口」，但這根本不在架構文件裡</li></ul><p style="margin-top:10px">你決定在 <strong>Search (Ctrl+Shift+F)</strong> 輸入 <span class="badge">420.69</span> 測試一下，或是去 <strong>Jira</strong> 票據裡的評論找線索...</p><p style="color:var(--success);margin-top:12px"><strong>第一章解鎖：The Anomaly</strong></p></div>', complete: () => state.hasFlag('hidden_portal_accessed') }
];

let currentOnboardingStep = 0;

function runOnboarding() {
  if (state.hasFlag('onboarding_done')) return;
  const dlg = document.getElementById('onboardingDialog');
  const content = document.getElementById('onboardingContent');
  if (!dlg || !content) return;
  function renderStep() {
    const step = onboardingSteps[currentOnboardingStep];
    if (!step) return finishOnboarding();
    content.innerHTML = '<h3 style="margin:0 0 12px">' + step.title + '</h3><div style="font-size:13px;color:var(--fg-secondary);margin-bottom:16px">步驟 ' + (currentOnboardingStep + 1) + ' / ' + onboardingSteps.length + '</div>' + step.html;
    const nextBtn = document.getElementById('onboardingNext');
    const skipBtn = document.getElementById('onboardingSkip');
    nextBtn.onclick = () => { if (step.complete && step.complete()) { nextStep(); } else { toast(step.key === 'intro' ? '請先去 Jira 查看 INV-2024-0042' : step.key === 'jira_guide' ? '請先去 Jira 查看 INV-2024-0042' : step.key === 'vscode_guide' ? '請先在 VS Code 打開 src/billing/service.js' : '條件未達成'); } };
    skipBtn.onclick = () => { if (confirm('確定要跳過新手引導嗎？將直接開始遊戲。')) { finishOnboarding(); } };
    dlg.showModal?.() || (dlg.style.display = 'block');
  }
  function nextStep() { currentOnboardingStep++; renderStep(); }
  function finishOnboarding() { state.setFlag('onboarding_done', true); toast('✅ 新手引導完成，開始你的調查吧！'); dlg.close(); }
  renderStep();
}

export function trackOnboarding(action) {
  if (action === 'jira_viewed') state.setFlag('onb_jira_viewed', true);
  if (action === 'vscode_viewed') state.setFlag('onb_vscode_viewed', true);
  const dlg = document.getElementById('onboardingDialog');
  if (dlg && dlg.open) {
    currentOnboardingStep = Math.min(currentOnboardingStep, onboardingSteps.length - 1);
    const step = onboardingSteps[currentOnboardingStep];
    const nextBtn = document.getElementById('onboardingNext');
    if (step.complete && step.complete()) { nextBtn.disabled = false; nextBtn.style.opacity = '1'; }
  }
}

function init() {
  applyTheme();
  renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t });
  bindSettings();
  mountAll();
  const last = localStorage.getItem('cc_active_view') || 'vscode';
  switchView(state.get('unlockedInterfaces').includes(last) ? last : 'vscode');
  startEngine();
  runOnboarding();
  events.on('puzzle:solved', p => { toast('✓ ' + p.title); });
  events.on('interfaceUnlocked', id => { toast(t('toast.unlocked') + ': ' + id); renderDock({ onSwitch: switchView, onOpenSettings: openSettings, onOpenNotebook: openNotebook, t }); });
  events.on('evidence', e => { toast(t('toast.evidence') + ': ' + e.title); });
  state.on('change', () => applyTheme());
  document.querySelectorAll('dialog').forEach(d => { d.addEventListener('click', e => { if (e.target === d) d.close(); }); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();