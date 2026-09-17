import { state } from './state.js';

// ── Google Apps Script + Sheets 追蹤 ──
// 1. 在 Google Sheets 建立後，部署 GAS Web App，複製 exec URL 貼到下方或寫入 localStorage cc_gas_url
// 2. 也可透過 Vite 環境變數 VITE_GAS_URL 注入 (建議用於 GitHub Pages Secrets)
// 使用 text/plain 避免 CORS 預檢，GAS 以 LockService + appendRow 保證寫入

// 優先順序: localStorage (設定面板) > 執行時 window.__GAS_URL > 環境變數 (建置時) > 預設佔位
let ENV_GAS_URL = '';
try { ENV_GAS_URL = import.meta.env.VITE_GAS_URL || ''; } catch {}
// 也支援執行時全域覆蓋，方便在 GitHub Pages 不重新建置就更新
try { if (typeof window !== 'undefined' && window.__GAS_URL) ENV_GAS_URL = window.__GAS_URL; } catch {}
const DEFAULT_PLACEHOLDER = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOY_ID/exec';
const PLACEHOLDER_MARKER = 'REPLACE_WITH_YOUR_DEPLOY_ID';
function isPlaceholderUrl(url){
  if(!url) return true;
  return url.includes(PLACEHOLDER_MARKER);
}

export function getGasUrl(){
  // 1. 使用者透過遊戲內設定面板存的 localStorage 最高優先，方便即時測試
  try{
    const ls = localStorage.getItem('cc_gas_url') || '';
    if(ls && ls.startsWith('https://') && !isPlaceholderUrl(ls)) return ls.trim();
  }catch{}
  // 2. 執行時全域 (可由 index.html 內聯 script 注入)
  try{
    if (typeof window !== 'undefined' && window.__GAS_URL && window.__GAS_URL.startsWith('https://') && !isPlaceholderUrl(window.__GAS_URL)) return window.__GAS_URL.trim();
  }catch{}
  // 3. 建置時 Vite 注入 (需在 build 時有 VITE_GAS_URL)
  if(ENV_GAS_URL && ENV_GAS_URL.startsWith('https://') && !isPlaceholderUrl(ENV_GAS_URL)) return ENV_GAS_URL.trim();
  return DEFAULT_PLACEHOLDER;
}

export function setGasUrl(url){
  try{
    const v = (url || '').trim();
    if(!v) localStorage.removeItem('cc_gas_url');
    else localStorage.setItem('cc_gas_url', v);
    // 同步到全域方便立即生效
    try{ if(typeof window !== 'undefined') window.__GAS_URL = v; }catch{}
  }catch{}
}

export function isGasConfigured(){
  const u = getGasUrl();
  return u && u.startsWith('https://') && !isPlaceholderUrl(u);
}

const CONSENT_KEY = 'cc_analytics_consent';
const SID_KEY = 'cc_sid';
const QUEUE_KEY = 'cc_analytics_queue';

// ── Game Session（每個遊玩週期獨立統計）──
const GAME_SESSION_KEY = 'cc_game_session';
const GAME_SESSION_HISTORY_KEY = 'cc_game_session_history';

function loadGameSession(){
  try{
    const raw = localStorage.getItem(GAME_SESSION_KEY);
    if(!raw) return null;
    const o = JSON.parse(raw);
    if(o && o.id && o.startAt) return o;
    return null;
  }catch{ return null; }
}
function saveGameSession(s){
  try{ localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(s)); }catch{}
}
function genGameSessionId(){
  try{
    if (crypto.randomUUID) return 'gs_' + crypto.randomUUID().slice(0,8) + '_' + Date.now().toString(36);
  }catch{}
  return 'gs_' + Math.random().toString(36).slice(2,10) + '_' + Date.now().toString(36);
}
export function getGameSession(){
  return loadGameSession();
}
export function createNewGameSession(){
  console.log('[analytics] createNewGameSession');
  const now = new Date();
  const playtime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
  const ch = (()=>{ try{ return state.get('currentChapter') ?? 0; }catch{ return 0; }})();
  const sess = {
    id: genGameSessionId(),
    startAt: now.toISOString(),
    startAtMs: now.getTime(),
    startPlaytime: playtime,
    lastChapter: ch,
    lastChapterEnterAtPlaytime: playtime,
    lastChapterEnterAtMs: now.getTime(),
    chapterTimes: {}, // { "0": sec, "1": sec ... }
    whatsappLog: [],
    emailLog: [],
    ended: false,
    endedAt: null
  };
  saveGameSession(sess);
  // 同步到 state 方便除錯（非必要）
  try{ state.set('__gameSessionId', sess.id); }catch{}
  try{ track('session_start', { game_session_id: sess.id, game_session_start: sess.startAt, chapter: ch, playtime }); }catch{}
  return sess;
}
export function ensureGameSession(){
  let s = loadGameSession();
  if(!s || s.ended){
    s = createNewGameSession();
  }
  return s;
}
function ensureChapterTimes(sess){
  if(!sess.chapterTimes || typeof sess.chapterTimes !== 'object') sess.chapterTimes = {};
}
export function onChapterChanged(newCh){
  try{
    const sess = loadGameSession();
    if(!sess || sess.ended) return;
    const curPlaytime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
    const nowMs = Date.now();
    ensureChapterTimes(sess);
    const prevCh = sess.lastChapter;
    const deltaPlay = Math.max(0, curPlaytime - (sess.lastChapterEnterAtPlaytime ?? curPlaytime));
    if(prevCh != null){
      const k = String(prevCh);
      sess.chapterTimes[k] = (sess.chapterTimes[k] || 0) + deltaPlay;
    }
    sess.lastChapter = newCh;
    sess.lastChapterEnterAtPlaytime = curPlaytime;
    sess.lastChapterEnterAtMs = nowMs;
    saveGameSession(sess);
  }catch{}
}
function finalizeChapterTimesForEnd(sess){
  try{
    const curPlaytime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
    const nowMs = Date.now();
    ensureChapterTimes(sess);
    const prevCh = sess.lastChapter;
    const deltaPlay = Math.max(0, curPlaytime - (sess.lastChapterEnterAtPlaytime ?? curPlaytime));
    if(prevCh != null){
      const k = String(prevCh);
      sess.chapterTimes[k] = (sess.chapterTimes[k] || 0) + deltaPlay;
    }
    // also wall-time per chapter could be derived from ms deltas if needed, but we keep playtime-based
    sess.lastChapterEnterAtPlaytime = curPlaytime;
    sess.lastChapterEnterAtMs = nowMs;
  }catch{}
}
export function recordWhatsappForSession({ chatId, chatName, text, to }){
  try{
    const sess = loadGameSession();
    if(!sess || sess.ended) return;
    const playtime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
    const entry = {
      chatId: chatId || '',
      chatName: chatName || chatId || '',
      to: to || '',
      preview: (text || '').slice(0,80),
      hash: hashText(text || ''),
      len: (text || '').length,
      // 為避免 Sheets 單格過長，完整內文截斷至 500 字，實際分析可由 preview+hash 還原
      body: (text || '').slice(0,500),
      ts: new Date().toISOString(),
      playtime
    };
    sess.whatsappLog.push(entry);
    // 限制長度避免 localStorage 爆掉
    if(sess.whatsappLog.length > 100) sess.whatsappLog = sess.whatsappLog.slice(-100);
    saveGameSession(sess);
  }catch{}
}
export function recordEmailForSession({ title, to, body }){
  try{
    const sess = loadGameSession();
    if(!sess || sess.ended) return;
    const playtime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
    const entry = {
      title: title || '',
      to: (to || '').slice(0,100),
      preview: (body || '').slice(0,80),
      hash: hashText(body || ''),
      len: (body || '').length,
      body: (body || '').slice(0,1000),
      ts: new Date().toISOString(),
      playtime
    };
    sess.emailLog.push(entry);
    if(sess.emailLog.length > 50) sess.emailLog = sess.emailLog.slice(-50);
    saveGameSession(sess);
  }catch{}
}
function computeAchievementsForSession(){
  // 與 notebook.js#getAchievements 保持一致的分數邏輯，但僅回傳已獲得者
  try{
    const readArticles = state.get('readArticles') || [];
    const discovered = state.get('discoveredFiles') || [];
    const endings = state.get('endings') || state.get('unlockedEndings') || [];
    const sent = state.get('whatsappSentCount') || 0;
    const ps = state.get('persistentStats') || {};
    const psReadArticles = ps.readArticles || [];
    const psDarkFileCount = ps.darkFileCount || 0;
    const psWhatsappSentCount = ps.whatsappSentCount || 0;
    const psSearchHistoryCount = ps.searchHistoryCount || 0;
    const psFlags = ps.flags || {};
    // 動態 dark 總數
    let darkTotal = 10;
    try{
      // 動態載入 vfs，若失敗則用預設
      const vfsMod = window.__vfs || null;
      if(vfsMod && vfsMod.listDarkFiles){
        const allDark = vfsMod.listDarkFiles('/darknet');
        if(allDark.length) darkTotal = allDark.length;
      }
    }catch{}
    // 簡化：若無法取得 vfs，則用 10
    const allReadArticles = [...new Set([...readArticles, ...psReadArticles])];
    const mergedSent = Math.max(sent, psWhatsappSentCount);
    const mergedSearchCount = Math.max((state.get('searchHistory') || []).length, psSearchHistoryCount);
    const mergedEndings = [...new Set([...endings, ...(state.get('unlockedEndings')||[]), ...(ps.unlockedEndings||[])])];
    const sawyerBlogs = [
      'https://sawyer-blog.example/2001-10-18','https://sawyer-blog.example/2003-04-27','https://sawyer-blog.example/2004-11-13','https://sawyer-blog.example/2006-09-01','https://sawyer-blog.example/2007-01-11','https://sawyer-blog.example/2007-01-12','https://sawyer-blog.example/2010-06-06','https://sawyer-blog.example/2012-07-07','https://sawyer-blog.example/2013-01-01','https://sawyer-blog.example/2023-04-25','https://sawyer-blog.example/2023-05-01','https://sawyer-blog.example/2023-05-10','https://sawyer-blog.example/2023-12-20','https://sawyer-blog.example/2024-01-15','https://sawyer-blog.example/2024-03-20',
    ];
    const schoolEssay = ['https://school.example/guangzhi-essay-sawyer'];
    const carNews = ['https://news.example/car-accident-2023','https://news.example/car-accident-investigation-2023','https://news.example/ping-wo-suspicious-man-2023','https://news.example/police-clarification-2023'];
    const bossUrls = [...sawyerBlogs, ...schoolEssay, ...carNews];
    const allBlogUrls = [...sawyerBlogs,'https://mary-blog.example/kyoto-sakura-2024','https://mary-blog.example/one-person-kitchen','https://mary-blog.example/danshari-half-year','https://peter-blog.example/python-one-year','https://peter-blog.example/vim-vs-vscode','https://peter-blog.example/nas-ds220','https://peter-blog.example/code-easter-eggs','https://paul-blog.example/tainan-beef-soup','https://paul-blog.example/hand-drip-coffee','https://paul-blog.example/keelung-night-market','https://emma-blog.example/contax-t2-taipei','https://emma-blog.example/iceland-aurora','https://david-blog.example/vinyl-jazz-20','https://david-blog.example/livehouse-map'];
    const darkCurrent = Math.max(discovered.filter(p=>p.startsWith('/darknet')).length, psDarkFileCount);
    const portalSimple = Math.max(state.hasFlag('portal_simple_entered')?1:0, psFlags.portal_simple_entered?1:0);
    const portalHash = Math.max(state.hasFlag('portal_hash_entered')?1:0, psFlags.portal_hash_entered?1:0);
    const defs = [
      { id:'secret_entry', title:'解鎖秘密入口', total:2, current: portalSimple+portalHash },
      { id:'boss_whisper', title:'老闆知音', total:20, current: bossUrls.filter(u=>allReadArticles.includes(u)).length },
      { id:'too_much', title:'你知道得太多了', total:darkTotal, current: Math.min(darkCurrent, darkTotal) },
      { id:'all_endings', title:'作者感謝您', total:5, current: mergedEndings.length },
      { id:'social', title:'社牛', total:10, current: Math.min(mergedSent,10) },
      { id:'reader', title:'閱讀達人', total:29, current: allBlogUrls.filter(u=>allReadArticles.includes(u)).length },
      { id:'miracle', title:'你沒有被解僱是奇蹟', total:1, current: Math.max(state.hasFlag('sawyer_abuse_sent')?1:0, psFlags.sawyer_abuse_sent?1:0) },
      { id:'net_addict', title:'網路成癮', total:50, current: Math.min(mergedSearchCount,50) },
    ];
    const gained = defs.filter(a=> a.current >= a.total).map(a=> ({ id:a.id, title:a.title }));
    const all = defs.map(a=> ({ id:a.id, title:a.title, done: a.current>=a.total, progress:`${a.current}/${a.total}`, pct: Math.round(a.current/a.total*100)}));
    return { gained, all, gainedIds: gained.map(g=>g.id) };
  }catch(e){
    return { gained:[], all:[], gainedIds:[] };
  }
}
export function collectSessionData(ending){
  const sess = loadGameSession() || ensureGameSession();
  finalizeChapterTimesForEnd(sess);
  const now = new Date();
  const playtime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
  const totalSec = Math.max(0, playtime - (sess.startPlaytime||0));
  const wallSec = Math.max(0, Math.floor((now.getTime() - (sess.startAtMs||now.getTime()))/1000));
  const ach = computeAchievementsForSession();
  const endings = (()=>{ try{ return state.get('endings')||[]; }catch{ return []; }})();
  // fallback：若 whatsappLog 為空，嘗試從 state.whatsappChats 補齊本 session 期間的 from='you'
  let whatsappRecords = Array.isArray(sess.whatsappLog) ? [...sess.whatsappLog] : [];
  if(!whatsappRecords.length){
    try{
      const chats = state.get('whatsappChats');
      if(Array.isArray(chats)){
        const youMsgs = [];
        for(const c of chats){
          for(const m of (c.messages||[])){
            if(m.from==='you') youMsgs.push({ chatId:c.id, chatName:c.name, preview:(m.text||'').slice(0,80), len:(m.text||'').length, ts: m.ts ? new Date(m.ts).toISOString() : new Date().toISOString(), body:(m.text||'').slice(0,500) });
          }
        }
        if(youMsgs.length) whatsappRecords = youMsgs.slice(-100);
      }
    }catch{}
  }
  const data = {
    game_session_id: sess.id,
    game_session_start: sess.startAt,
    game_session_end: now.toISOString(),
    ending: ending || '',
    endings: endings.join(','),
    total_time_sec: totalSec,
    wall_time_sec: wallSec,
    playtime,
    chapter_times_sec: sess.chapterTimes || {},
    whatsapp_records: whatsappRecords,
    whatsapp_count: whatsappRecords.length,
    email_records: Array.isArray(sess.emailLog) ? [...sess.emailLog] : [],
    email_count: (sess.emailLog||[]).length,
    achievements_gained: ach.gained,
    achievements_gained_ids: ach.gainedIds,
    achievements_all: ach.all,
    lang: (()=>{ try{ return state.get('settings.language')||'zh-TW'; }catch{ return 'zh-TW'; }})(),
    chapter: (()=>{ try{ return state.get('currentChapter')??0; }catch{ return 0; }})(),
  };
  return data;
}
export function sendSessionEnd(ending){
  try{
    const sess = loadGameSession();
    if(!sess) return;
    if(sess.ended) return; // 避免重複發送
    const data = collectSessionData(ending);
    const now = new Date();
    // 標記已結束，避免重複
    sess.ended = true;
    sess.endedAt = now.toISOString();
    sess.lastEnding = ending || '';
    // 暫存至 history 供除錯
    try{
      const histRaw = localStorage.getItem(GAME_SESSION_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      hist.push({ id: sess.id, ending, endedAt: sess.endedAt, total_time_sec: data.total_time_sec });
      localStorage.setItem(GAME_SESSION_HISTORY_KEY, JSON.stringify(hist.slice(-20)));
    }catch{}
    saveGameSession(sess);
    // 以獨立 event_type 上報，payload_json 承載完整 JSON（GAS 會寫入同一列）
    const payloadJson = JSON.stringify(data);
    track('session_end', {
      game_session_id: data.game_session_id,
      game_session_start: data.game_session_start,
      game_session_end: data.game_session_end,
      ending: data.ending,
      endings: data.endings,
      total_time_sec: data.total_time_sec,
      wall_time_sec: data.wall_time_sec,
      chapter_times_sec: JSON.stringify(data.chapter_times_sec),
      whatsapp_count: data.whatsapp_count,
      email_count: data.email_count,
      achievements_gained: data.achievements_gained_ids.join(','),
      payload_json: payloadJson.slice(0, 4000)
    });
    // 若 payload 超長，分段補送第二列（避免截斷遺失 email/whatsapp 細節）
    if(payloadJson.length > 4000){
      const extra = {
        game_session_id: data.game_session_id,
        part: 2,
        whatsapp_records: JSON.stringify(data.whatsapp_records).slice(0,3800),
        email_records: JSON.stringify(data.email_records).slice(0,3800)
      };
      // 延遲 800ms 再送，避免併發鎖衝突
      setTimeout(()=> track('session_end_part2', { game_session_id: data.game_session_id, payload_json: JSON.stringify(extra).slice(0,4000) }), 800);
    }
  }catch(e){ console.warn('[analytics] sendSessionEnd failed', e); }
}

export function getConsent(){
  try{ return localStorage.getItem(CONSENT_KEY) === '1'; }catch{ return false; }
}
export function setConsent(v){
  try{
    if(v) localStorage.setItem(CONSENT_KEY, '1');
    else localStorage.setItem(CONSENT_KEY, '0');
  }catch{}
  // 若剛同意，立即嘗試補送佇列
  if(v) setTimeout(()=> flushQueue(), 500);
}

export function hasConsentChoice(){
  try{ const v = localStorage.getItem(CONSENT_KEY); return v === '1' || v === '0'; }catch{ return false; }
}

export function getSessionId(){
  try{
    let sid = localStorage.getItem(SID_KEY);
    if(!sid){
      sid = (crypto.randomUUID && crypto.randomUUID()) || ('sid_' + Date.now() + '_' + Math.random().toString(36).slice(2,9));
      localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  }catch{
    return 'anon_' + Date.now();
  }
}

// 簡易 hash (djb2) 用於去識別，非加密
export function hashText(s){
  if(!s) return '';
  let h = 5381;
  for(let i=0;i<s.length;i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16).padStart(8,'0');
}

function getCommonMeta(){
  let chapter = 0; let playtime = 0; let lang = 'zh-TW';
  try{ chapter = state.get('currentChapter') ?? 0; }catch{}
  try{ playtime = state.get('playtime') ?? 0; }catch{}
  try{ lang = state.get('settings.language') || 'zh-TW'; }catch{}
  return { chapter, playtime, lang };
}

function loadQueue(){
  try{
    const raw = localStorage.getItem(QUEUE_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  }catch{ return []; }
}
function saveQueue(arr){
  try{ localStorage.setItem(QUEUE_KEY, JSON.stringify(arr.slice(-50))); }catch{}
}

export function flushQueue(){
  if(!isGasConfigured()) return;
  if(!getConsent()) return;
  const q = loadQueue();
  if(!q.length) return;
  // 一次補送最多 10 筆，避免配額爆掉
  const batch = q.slice(0, 10);
  const remaining = q.slice(10);
  // 先清空已取的 batch，重試失敗會再 push 回
  saveQueue(remaining);
  batch.forEach(payload => sendPayload(payload, true));
}

function sendPayload(payload, isRetry = false){
  const url = getGasUrl();
  console.log(`url : ${url}`)
  if(!isGasConfigured()){
    console.warn('[analytics] GAS_URL 未設定，跳過上報', payload);
    return;
  }
  if(!getConsent()){
    // 未同意，入隊但不發送
    if(!isRetry){
      const q = loadQueue(); q.push(payload); saveQueue(q);
    }
    return;
  }
  const body = JSON.stringify(payload);
  // 優先 sendBeacon (keepalive, 無需 CORS 讀取)
  try{
    if(navigator.sendBeacon){
      const blob = new Blob([body], {type: 'text/plain;charset=utf-8'});
      const ok = navigator.sendBeacon(url, blob);
      if(ok) return;
    }
  }catch{}
  // Fallback fetch
  try{
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      keepalive: true,
      redirect: 'follow',
      mode: 'cors'
    }).then(res => {
      if(!res.ok) throw new Error('GAS status ' + res.status);
      // 成功後嘗試再清一次隊列
      if(!isRetry) setTimeout(()=> flushQueue(), 1000);
    }).catch(err => {
      console.warn('[analytics] 發送失敗，已入隊重試', err);
      if(!isRetry){
        const q = loadQueue(); q.push(payload); saveQueue(q);
      } else {
        // 重試仍失敗，放回隊首
        const q = loadQueue(); q.unshift(payload); saveQueue(q);
      }
    });
  }catch(err){
    const q = loadQueue(); q.push(payload); saveQueue(q);
  }
}

export function track(event_type, extra = {}){
  // 未設定 GAS 也允許本地隊列（待設定後補送），但不阻塞遊戲
  const meta = getCommonMeta();
  const session_id = getSessionId();
  const payload = {
    timestamp: new Date().toISOString(),
    session_id,
    event_type,
    chapter: meta.chapter,
    playtime: meta.playtime,
    lang: meta.lang,
    ua: (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0,200) : ''),
    url: (typeof location !== 'undefined' ? location.href.slice(0,300) : ''),
    ...extra
  };
  // 限制總長，GAS 單列 5000 字以內
  if(payload.payload_json && typeof payload.payload_json === 'string' && payload.payload_json.length > 4000){
    payload.payload_json = payload.payload_json.slice(0,4000);
  }
  // 若尚未同意，先入隊
  if(!getConsent()){
    const q = loadQueue(); q.push(payload); saveQueue(q);
    return;
  }
  // 若 GAS 未設定，也先入隊（待管理員貼上 URL 後可手動 flush）
  if(!isGasConfigured()){
    const q = loadQueue(); q.push(payload); saveQueue(q);
    console.warn('[analytics] 已記錄至本地隊列，待設定 GAS_URL 後自動上報', payload);
    return;
  }
  sendPayload(payload);
}

// 便捷包裝，供各模組直接呼叫
export function trackWhatsappSend({ chatId, chatName, text, to }) {
  try{ recordWhatsappForSession({ chatId, chatName, text, to }); }catch{}
  const preview = (text || '').slice(0, 80);
  const hash = hashText(text || '');
  const sess = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
  track('whatsapp_send', {
    game_session_id: sess ? sess.id : '',
    whatsapp_chat_id: chatId,
    whatsapp_chat_name: chatName || chatId,
    whatsapp_to: to || '',
    whatsapp_preview: preview,
    whatsapp_hash: hash,
    whatsapp_len: (text || '').length,
    payload_json: JSON.stringify({ chatId, preview, len: (text||'').length, game_session_id: sess ? sess.id : '' })
  });
}

export function trackEmailSubmit({ title, to, body }){
  try{ recordEmailForSession({ title, to, body }); }catch{}
  const preview = (body || '').slice(0, 80);
  const hash = hashText(body || '');
  const sess = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
  track('email_submit', {
    game_session_id: sess ? sess.id : '',
    email_title: title || '',
    email_to: (to || '').slice(0,100),
    email_body_preview: preview,
    email_body_hash: hash,
    email_body_len: (body || '').length,
    payload_json: JSON.stringify({ title, preview, len: (body||'').length, game_session_id: sess ? sess.id : '' })
  });
}

export function trackEnding(ending){
  const sess = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
  track('ending_unlocked', {
    game_session_id: sess ? sess.id : '',
    ending,
    endings: (state.get('endings') || []).join(','),
    payload_json: JSON.stringify({ ending, all: state.get('endings'), game_session_id: sess ? sess.id : '' })
  });
  // 觸發 session_end：收集此輪所有數據一次性上報
  try{ sendSessionEnd(ending); }catch{}
}

export function trackChapter(ch){
  try{ onChapterChanged(ch); }catch{}
  const sess = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
  track('chapter_changed', { game_session_id: sess ? sess.id : '', chapter: ch, payload_json: JSON.stringify({ chapter: ch, game_session_id: sess ? sess.id : '' }) });
}

export function initAnalytics(){
  // 清理舊佔位符（避免設定面板顯示範例 URL 卻顯示未設定）
  try{
    const ls = localStorage.getItem('cc_gas_url') || '';
    if(ls && isPlaceholderUrl(ls)) localStorage.removeItem('cc_gas_url');
  }catch{}
  // ── 初始化 Game Session（首次遊玩即建立）──
  try{ ensureGameSession(); }catch{}
  // 監聽章節切換，累計各章節停留秒數
  try{
    state.on('change', (e)=>{
      if(e && e.path === 'currentChapter'){
        try{ onChapterChanged(e.value); }catch{}
      }
    });
  }catch{}
  // 重置後（重新遊玩）自動開啟新 Session
  try{
    state.on('reset', ()=>{
      // 舊 session 已在 sendSessionEnd 標記 ended，這裡直接新建
      try{ createNewGameSession(); }catch{}
    });
  }catch{}
  // 暴露給 console 除錯
  try{ window.__analytics = { track, getConsent, setConsent, getGasUrl, setGasUrl, isGasConfigured, flushQueue, hashText, ENV_GAS_URL: ENV_GAS_URL || '(empty)', getGameSession, createNewGameSession, ensureGameSession, collectSessionData, sendSessionEnd, getSessionId }; }catch{}
  // 除錯日誌：幫你判斷為何 secrets 沒生效
  try{
    const gs = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
    console.log('[analytics] init', {
      hasConsent: getConsent(),
      hasChoice: hasConsentChoice(),
      gasConfigured: isGasConfigured(),
      gasUrl: getGasUrl().slice(0, 60) + (getGasUrl().length>60?'...':''),
      envGasUrl: ENV_GAS_URL ? ENV_GAS_URL.slice(0,30)+'...' : '(empty - 需要在 build 時注入 VITE_GAS_URL)',
      localStorageUrl: (typeof localStorage!=='undefined' && localStorage.getItem('cc_gas_url')) ? '已設定' : '(empty)',
      gameSession: gs ? { id: gs.id, startAt: gs.startAt, chapterTimes: gs.chapterTimes, whatsapp: (gs.whatsappLog||[]).length, email: (gs.emailLog||[]).length } : null
    });
    if(!isGasConfigured()){
      console.warn('[analytics] GAS_URL 未設定 → 請用以下任一方式設定:\n  1) 遊戲內 設定 → 數據追蹤 貼上 URL (立即生效)\n  2) 瀏覽器 Console: localStorage.setItem("cc_gas_url","你的exec URL"); location.reload()\n  3) GitHub Secrets VITE_GAS_URL (需透過 workflow 在 build 時注入，見 gas/README.md)');
    }
  }catch{}
  // 啟動時嘗試補送
  setTimeout(()=> flushQueue(), 1500);
  // 監聽 online 恢復
  try{ window.addEventListener('online', ()=> flushQueue()); }catch{}
}
