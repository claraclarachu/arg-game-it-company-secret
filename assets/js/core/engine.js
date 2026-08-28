import { state } from './state.js';
import { events } from './events.js';
import { vfs } from './vfs.js';

const puzzles = [
  {
    id: 'ch0_complete_onboarding',
    chapter: 0,
    check: () => state.hasFlag('onboarding_done'),
    reward: { unlock: ['search'] },
    title: '完成新手引導'
  },
  {
    id: 'ch1_trigger_hidden_route',
    chapter: 1,
    check: () => state.hasFlag('hidden_portal_accessed'),
    reward: { evidence: { id: 'e001', title: '隱藏入口', chapter: 1, type: 'portal' }, unlock: ['whatsapp'] },
    title: '觸發隱藏路由 420.69'
  },
  {
    id: 'ch2_bypass_portal_auth',
    chapter: 2,
    check: () => state.hasFlag('portal_auth_bypassed'),
    reward: { evidence: { id: 'e002', title: '內部庫存', chapter: 2, type: 'inventory' } },
    title: '繞過 Portal 驗證'
  },
  {
    id: 'ch2_find_code_map',
    chapter: 2,
    check: () => state.hasFlag('found_code_map'),
    reward: { evidence: { id: 'e003', title: '代號對照表', chapter: 2, type: 'mapping' } },
    title: '發現代號對照表'
  }
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
    'ledger_exported'
  ];
  let idx = 0;
  for (const f of chapterFlags) {
    if (state.hasFlag(f)) idx++;
    else break;
  }
  if (idx !== state.get('currentChapter')) {
    state.set('currentChapter', idx);
    events.emit('chapter:changed', idx);
  }
}

let timer = null;
export function startEngine() {
  events.on('change', evaluatePuzzles);
  events.on('vfs:read', evaluatePuzzles);
  events.on('portal:discovered', evaluatePuzzles);
  events.on('portal:bypassed', evaluatePuzzles);
  // poll fallback
  timer = setInterval(evaluatePuzzles, 1000);
  evaluatePuzzles();
}

export function stopEngine() {
  clearInterval(timer);
}

export function getPuzzles() { return puzzles; }
