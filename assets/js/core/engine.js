import { state } from './state.js';
import { events } from './events.js';
import { vfs } from './vfs.js';

const puzzles = [
  // Chapter 0 — Onboarding (interfaces already unlocked; keep puzzle for evidence/progression only)
  {
    id: 'ch0_complete_onboarding',
    chapter: 0,
    check: () => state.hasFlag('onboarding_done'),
    reward: {},
    title: '完成新手引導'
  },
  // Chapter 1 — The Anomaly
  {
    id: 'ch1_trigger_hidden_route',
    chapter: 1,
    check: () => state.hasFlag('hidden_portal_accessed'),
    reward: { evidence: { id: 'e001', title: '隱藏入口 /internal/portal', chapter: 1, type: 'portal' } },
    title: '觸發隱藏路由 420.69'
  },
  {
    id: 'ch1_read_billing_service',
    chapter: 1,
    check: () => state.get('discoveredFiles')?.includes('/workspace/src/billing/service.js'),
    reward: { evidence: { id: 'e001b', title: '計費模組原始碼', chapter: 1, type: 'code' } },
    title: '閱讀計費模組'
  },
  // Chapter 2 — Hidden Portal
  {
    id: 'ch2_bypass_portal_auth',
    chapter: 2,
    check: () => state.hasFlag('portal_auth_bypassed'),
    reward: { evidence: { id: 'e002', title: '內部庫存 (COCOA 420/BEAN 118)', chapter: 2, type: 'inventory' } },
    title: '繞過 Portal 驗證'
  },
  {
    id: 'ch2_find_code_map',
    chapter: 2,
    check: () => state.hasFlag('found_code_map'),
    reward: { evidence: { id: 'e003', title: '代號對照表 (COCOA=可卡因等)', chapter: 2, type: 'mapping' } },
    title: '發現代號對照表'
  },
  {
    id: 'ch2_read_env_token',
    chapter: 2,
    check: () => state.get('discoveredFiles')?.includes('/workspace/.env.example'),
    reward: { evidence: { id: 'e003b', title: '洩漏的 Token (.env.example)', chapter: 2, type: 'secret' } },
    title: '找到 INTERNAL_PORTAL_TOKEN'
  },
  // Chapter 3 — Following the Money
  {
    id: 'ch3_find_crypto_mixer',
    chapter: 3,
    check: () => state.get('discoveredFiles')?.includes('/workspace/src/payment/mixer.js') || state.hasFlag('found_crypto_mixer'),
    reward: { evidence: { id: 'e004', title: '加密混淆器 @shady/crypto-mixer', chapter: 3, type: 'crypto' } },
    title: '發現混淆器依賴'
  },
  {
    id: 'ch3_discover_fee_mapping',
    chapter: 3,
    check: () => state.get('discoveredFiles')?.includes('/workspace/src/payment/gateway.js') || state.hasFlag('found_fee_mapping'),
    reward: { evidence: { id: 'e005', title: '手續費即分潤 (feeRate)', chapter: 3, type: 'finance' } },
    title: '揭露手續費分潤'
  },
  {
    id: 'ch3_trace_mixer_config',
    chapter: 3,
    check: () => state.get('discoveredFiles')?.includes('/workspace/src/payment/cryptoConfig.json') || state.hasFlag('found_mixer_config'),
    reward: { evidence: { id: 'e006', title: '混幣錢包地址', chapter: 3, type: 'wallet' } },
    title: '追蹤錢包配置'
  },
  // Chapter 4 — The Ledger
  {
    id: 'ch4_export_ledger',
    chapter: 4,
    check: () => state.get('discoveredFiles')?.includes('/workspace/ledger.db') || state.hasFlag('ledger_exported'),
    reward: { evidence: { id: 'e007', title: '帳本 ledger.db', chapter: 4, type: 'db' } },
    title: '匯出帳本'
  },
  {
    id: 'ch4_sql_injection',
    chapter: 4,
    check: () => state.get('discoveredFiles')?.includes('/workspace/docs/arch.pdf') || state.hasFlag('sql_injected'),
    reward: { evidence: { id: 'e008', title: '架構圖即物流圖', chapter: 4, type: 'sqli' } },
    title: '發現物流路線圖'
  },
  {
    id: 'ch4_find_coordinates',
    chapter: 4,
    check: () => state.get('discoveredFiles')?.includes('/workspace/data/ledger_export.csv') || state.hasFlag('found_coordinates'),
    reward: { evidence: { id: 'e009', title: '交易座標與物流單號', chapter: 4, type: 'geo' } },
    title: '發現座標'
  },
  // Chapter 5 — The Network
  {
    id: 'ch5_find_supplier',
    chapter: 5,
    check: () => state.hasFlag('found_supplier'),
    reward: { evidence: { id: 'e010', title: '供應商 聯繫方式', chapter: 5, type: 'contact' } },
    title: '找到供應商'
  },
  {
    id: 'ch5_reverse_image',
    chapter: 5,
    check: () => state.hasFlag('reverse_image_done'),
    reward: { evidence: { id: 'e011', title: '包裹圖片反向搜尋', chapter: 5, type: 'image' } },
    title: '反向圖片搜尋'
  },
  {
    id: 'ch5_shell_company',
    chapter: 5,
    check: () => state.hasFlag('found_shell_company'),
    reward: { evidence: { id: 'e012', title: '殼公司登記', chapter: 5, type: 'company' } },
    title: '發現殼公司'
  },
  {
    id: 'ch5_ssh_trace',
    chapter: 5,
    check: () => state.hasFlag('found_ssh_trace'),
    reward: { evidence: { id: 'e013', title: '海外伺服器 ssh 紀錄', chapter: 5, type: 'infra' } },
    title: '追蹤海外伺服器'
  },
  // Chapter 6 — Confrontation
  {
    id: 'ch6_collect_all',
    chapter: 6,
    check: () => (state.get('collectedEvidence') || []).length >= 6,
    reward: { evidence: { id: 'e014', title: '完整證據鏈', chapter: 6, type: 'chain' } },
    title: '蒐集完整證據'
  },
  {
    id: 'ch6_choose_ending',
    chapter: 6,
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
  // chapter progression heuristic
  const chapterFlags = [
    'onboarding_done',
    'hidden_portal_accessed',
    'portal_auth_bypassed',
    'found_crypto_mixer',
    'found_fee_mapping',
    'ledger_exported',
    'found_supplier',
    'found_coordinates',
  ];
  let idx = 0;
  for (const f of chapterFlags) {
    if (state.hasFlag(f)) idx++;
    else break;
  }
  // also map ledger_exported (idx 5) => chapter 4, supplier etc => 5
  const chapterMap = [0,1,2,2,3,3,4,5];
  const ch = chapterMap[idx] ?? idx;
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
