import { state } from './state.js';
import { events } from './events.js';
import { vfs } from './vfs.js';

// REVAMP_PLAN.md §4: 5 chapters + onboarding
// Ch0 教學 → Ch1 異常發現 → Ch2 自由探索 → Ch3 暗網入口 → Ch4 秘密曝光 → Ch5 抉擇
const puzzles = [
  // ── Chapter 0 — 教學 (Onboarding) ──
  {
    id: 'ch0_vip_fix',
    chapter: 0,
    check: () => state.hasFlag('ch0_vip_fixed'),
    reward: {},
    title: '修正 VIP 折扣計算 (INV-2024-0042)'
  },

  // ── Chapter 1 — 異常發現 (The Anomaly) ──
  {
    id: 'ch1_system_alert',
    chapter: 1,
    check: () => state.hasFlag('ch1_system_down'),
    reward: { evidence: { id: 'e001', title: 'INV-2024-0043 系統警報', chapter: 1, type: 'anomaly' } },
    title: '觸發系統警報 (INV-2024-0043)'
  },
  {
    id: 'ch1_feng_shui_tree',
    chapter: 1,
    check: () => state.hasFlag('ch1_tree_seen'),
    reward: { evidence: { id: 'e002', title: '老闆的風水樹', chapter: 1, type: 'behavior' } },
    title: '發現老闆的風水樹'
  },

  // ── Chapter 2 — 自由探索 (Free Exploration) ──
  {
    id: 'ch2_accident_news',
    chapter: 2,
    check: () => state.get('searchHistory')?.some(h => h.includes('Sawyer') || h.includes('Choi') || h.includes('車禍')),
    reward: { evidence: { id: 'e003', title: '車禍新聞 — 父母雙亡', chapter: 2, type: 'news' } },
    title: '搜尋到車禍新聞'
  },
  {
    id: 'ch2_insurance_blog',
    chapter: 2,
    check: () => state.get('discoveredFiles')?.includes('https://sawyer-blog.example/2012-07-07') || state.get('searchHistory')?.some(h => h.includes('保險')),
    reward: { evidence: { id: 'e004', title: '保險受益人 Blog', chapter: 2, type: 'blog' } },
    title: '發現保險受益人文章'
  },
  {
    id: 'ch2_lottery_lie',
    chapter: 2,
    check: () => state.hasFlag('lottery_lie_seen'),
    reward: { evidence: { id: 'e005', title: '六合彩謊言', chapter: 2, type: 'lie' } },
    title: '發現六合彩謊言紀錄'
  },
  {
    id: 'ch2_dark_blog',
    chapter: 2,
    check: () => state.get('discoveredFiles')?.includes('https://sawyer-blog.example/2023-12-20'),
    reward: { evidence: { id: 'e006', title: 'Sawyer 暗示文字', chapter: 2, type: 'blog' } },
    title: '發現 2023-12-20 Blog'
  },

  // ── Chapter 3 — 暗網入口 (Darknet Entry) ──
  {
    id: 'ch3_git_secret',
    chapter: 3,
    check: () => state.hasFlag('git_secret_found'),
    reward: { evidence: { id: 'e007', title: 'Git 刪除的 secret path', chapter: 3, type: 'code' } },
    title: '在 Git 歷史找到刪除的 secret path'
  },
  {
    id: 'ch3_darknet_url',
    chapter: 3,
    check: () => state.hasFlag('dark_entered') || state.hasFlag('hidden_portal_accessed'),
    reward: { evidence: { id: 'e008', title: '暗網入口 URL', chapter: 3, type: 'portal' } },
    title: '找到暗網完整入口'
  },

  // ── Chapter 4 — 秘密曝光 (Secrets Revealed) ──
  {
    id: 'ch4_drug_transactions',
    chapter: 4,
    check: () => state.hasFlag('ch4_all_opened') || state.get('discoveredFiles')?.some(f => f.includes('/darknet/')),
    reward: { evidence: { id: 'e009', title: '毒品交易紀錄', chapter: 4, type: 'darknet' } },
    title: '開啟毒品交易列表'
  },
  {
    id: 'ch4_drug_route',
    chapter: 4,
    check: () => state.hasFlag('ch4_all_opened') || state.get('discoveredFiles')?.some(f => f.includes('drug-route')),
    reward: { evidence: { id: 'e010', title: '毒品結構圖', chapter: 4, type: 'darknet' } },
    title: '開啟毒品結構圖'
  },
  {
    id: 'ch4_sawyer_expenses',
    chapter: 4,
    check: () => state.hasFlag('ch4_all_opened') || state.get('discoveredFiles')?.some(f => f.includes('sawyer_expenses')),
    reward: { evidence: { id: 'e011', title: 'Sawyer 個人支出', chapter: 4, type: 'darknet' } },
    title: '發現 Sawyer 與 FredyArc 金流'
  },
  {
    id: 'ch4_travel_records',
    chapter: 4,
    check: () => state.hasFlag('ch4_all_opened') || state.get('discoveredFiles')?.some(f => f.includes('travel_records')),
    reward: { evidence: { id: 'e012', title: 'Travel 紀錄', chapter: 4, type: 'darknet' } },
    title: '發現 Sawyer 多次前往毒品路線城市'
  },
  {
    id: 'ch4_meeting_minutes',
    chapter: 4,
    check: () => state.hasFlag('ch4_all_opened') || state.get('discoveredFiles')?.some(f => f.includes('meeting_minutes')),
    reward: { evidence: { id: 'e013', title: 'Sawyer × Fredy 會議紀錄', chapter: 4, type: 'darknet' } },
    title: '發現定期會議紀錄'
  },

  // ── Chapter 5 — 抉擇 (The Choice) ──
  {
    id: 'ch5_choose_ending',
    chapter: 5,
    check: () => (state.get('endings') || []).length > 0,
    reward: {},
    title: '選擇結局'
  },
];

function evaluatePuzzles() {
  for (const p of puzzles) {
    if (state.hasFlag(`puzzle:${p.id}`)) continue;
    if (p.check()) {
      state.setFlag(`puzzle:${p.id}`, true);
      if (p.reward?.evidence) state.addEvidence(p.reward.evidence);
      if (p.reward?.unlock) p.reward.unlock.forEach(i => state.unlockInterface(i));
      events.emit('puzzle:solved', p);
    }
  }

  // ── Chapter progression (REVAMP_PLAN §4) ──
  // Ch0: onboarding_done (INV-2024-0042 fix)
  // Ch1: ch1_system_down (INV-2024-0043 alert) + ch1_revert_done
  // Ch2: free exploration (after ch1 revert)
  // Ch3: dark_entered / hidden_portal_accessed (entered darknet)
  // Ch4: ch4_all_opened (opened all darknet files)
  // Ch5: endings chosen
  let ch = 0;
  if (state.hasFlag('ch0_vip_fixed')) ch = 1;
  if (state.hasFlag('ch1_revert_done')) ch = 2;
  if (state.hasFlag('dark_entered') || state.hasFlag('hidden_portal_accessed')) ch = 3;
  if (state.hasFlag('ch4_all_opened')) ch = 4;
  if ((state.get('endings') || []).length > 0) ch = 5;

  if (ch !== state.get('currentChapter')) {
    state.set('currentChapter', ch);
    events.emit('chapter:changed', ch);
  }
}

let timer = null;
export function startEngine() {
  events.on('change', evaluatePuzzles);
  events.on('vfs:read', evaluatePuzzles);
  events.on('portal:discovered', evaluatePuzzles);
  events.on('portal:bypassed', evaluatePuzzles);
  // poll fallback
  timer = setInterval(evaluatePuzzles, 800);
  evaluatePuzzles();
}

export function stopEngine() {
  clearInterval(timer);
}

export function getPuzzles() { return puzzles; }
