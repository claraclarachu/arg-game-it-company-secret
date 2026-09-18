import { state } from './state.js';

// ── Google Apps Script + Sheets 追蹤 ──
// 核心規則：每個 session 最多 2 次寫入 Spreadsheet，1 列 = 1 session
//  - 流程：首次打開 => session_start 建立一列 (start_date, session_id, lang, ua)
//         行為期間 whatsapp/email/chapter 時間僅寫入 localStorage (cc_game_session)
//         達成結局 => session_end 以 session_id 為 key 更新同一列，填滿 end_date, total_play_time, chp0-4, ending, inputted_content, archievement_list
//  - Spreadsheet 唯一表頭（14 欄）：start_date | end_date | session_id | total_play_time | lang | ua | chp0_play_time | chp1_play_time | chp2_play_time | chp3_play_time | chp4_play_time | ending | inputted_content | archievement_list

let ENV_GAS_URL = '';
try { ENV_GAS_URL = import.meta.env.VITE_GAS_URL || ''; } catch {}
try { if (typeof window !== 'undefined' && window.__GAS_URL) ENV_GAS_URL = window.__GAS_URL; } catch {}
const DEFAULT_PLACEHOLDER = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOY_ID/exec';
const PLACEHOLDER_MARKER = 'REPLACE_WITH_YOUR_DEPLOY_ID';
function isPlaceholderUrl(url){
  if(!url) return true;
  return url.includes(PLACEHOLDER_MARKER);
}

export function getGasUrl(){
  try{
    const ls = localStorage.getItem('cc_gas_url') || '';
    if(ls && ls.startsWith('https://') && !isPlaceholderUrl(ls)) return ls.trim();
  }catch{}
  try{
    if (typeof window !== 'undefined' && window.__GAS_URL && window.__GAS_URL.startsWith('https://') && !isPlaceholderUrl(window.__GAS_URL)) return window.__GAS_URL.trim();
  }catch{}
  if(ENV_GAS_URL && ENV_GAS_URL.startsWith('https://') && !isPlaceholderUrl(ENV_GAS_URL)) return ENV_GAS_URL.trim();
  return DEFAULT_PLACEHOLDER;
}

export function setGasUrl(url){
  try{
    const v = (url || '').trim();
    if(!v) localStorage.removeItem('cc_gas_url');
    else localStorage.setItem('cc_gas_url', v);
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

// ── Game Session（每個遊玩週期獨立統計，僅 localStorage）──
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

// ── 對外：建立 / 確保 session ──
export function createNewGameSession(){
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
    endedAt: null,
    sessionStartSent: false,
    sessionEndSent: false
  };
  saveGameSession(sess);
  try{ state.set('__gameSessionId', sess.id); }catch{}
  // 首次打開立即寫入一列（start_date + session_id + lang/ua），之後僅在結局時更新
  try{ sendSessionStart(sess); }catch(e){ console.warn('[analytics] sendSessionStart failed', e); }
  return sess;
}
export function ensureGameSession(){
  let s = loadGameSession();
  if(!s || s.ended){
    s = createNewGameSession();
  } else if(!s.sessionStartSent){
    // 既有 session 但尚未發過 start（例如舊版升上來），補發一次
    try{ sendSessionStart(s); }catch{}
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
      body: (text || '').slice(0,500),
      ts: new Date().toISOString(),
      playtime
    };
    sess.whatsappLog.push(entry);
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
const ENDING_ZH_MAP = {
  flee: '平凡的日常',
  cooperate: '合作',
  report: '舉報',
  resign: '離職',
  fried: '做對了嗎？'
};

function computeAchievementsForSession(){
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
    let darkTotal = 10;
    try{
      const vfsMod = window.__vfs || null;
      if(vfsMod && vfsMod.listDarkFiles){
        const allDark = vfsMod.listDarkFiles('/darknet');
        if(allDark.length) darkTotal = allDark.length;
      }
    }catch{}
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
    const archMap = {};
    all.forEach(a => { archMap[a.title] = a.progress; });
    return { gained, all, gainedIds: gained.map(g=>g.id), archMap };
  }catch(e){
    return { gained:[], all:[], gainedIds:[], archMap:{} };
  }
}

export function getEndingZh(endingId){
  return ENDING_ZH_MAP[endingId] || endingId || '';
}

export function buildInputtedContent(whatsappRecords, emailRecords){
  const whatsup = (whatsappRecords || []).map(r => ({
    to: r.to || r.chatName || r.chatId || '',
    content: r.body != null ? r.body : (r.preview || '')
  }));
  const email = (emailRecords || []).map(r => ({
    to: r.to || '',
    title: r.title || '',
    content: r.body != null ? r.body : (r.preview || '')
  }));
  return { whatsup, email };
}

export function buildArchievementJson(){
  const ach = computeAchievementsForSession();
  return ach.archMap || {};
}

// ── 收集 session 彙總資料（僅在結局時呼叫，前期僅 buffered 在 localStorage）──
export function collectSessionData(ending){
  const sess = loadGameSession() || ensureGameSession();
  finalizeChapterTimesForEnd(sess);
  const now = new Date();
  const playtime = (()=>{ try{ return state.get('playtime') ?? 0; }catch{ return 0; }})();
  const totalSec = Math.max(0, playtime - (sess.startPlaytime||0));
  const ach = computeAchievementsForSession();
  const endings = (()=>{ try{ return state.get('endings')||[]; }catch{ return []; }})();
  let whatsappRecords = Array.isArray(sess.whatsappLog) ? [...sess.whatsappLog] : [];
  if(!whatsappRecords.length){
    try{
      const chats = state.get('whatsappChats');
      if(Array.isArray(chats)){
        const youMsgs = [];
        for(const c of chats){
          for(const m of (c.messages||[])){
            if(m.from==='you') youMsgs.push({ chatId:c.id, chatName:c.name, preview:(m.text||'').slice(0,80), len:(m.text||'').length, ts: m.ts ? new Date(m.ts).toISOString() : new Date().toISOString(), body:(m.text||'').slice(0,500), to: c.name || c.id });
          }
        }
        if(youMsgs.length) whatsappRecords = youMsgs.slice(-100);
      }
    }catch{}
  }
  const emailRecords = Array.isArray(sess.emailLog) ? [...sess.emailLog] : [];
  const ct = sess.chapterTimes || {};
  const chpTimes = {
    chp0_play_time: Number(ct['0'] || 0),
    chp1_play_time: Number(ct['1'] || 0),
    chp2_play_time: Number(ct['2'] || 0),
    chp3_play_time: Number(ct['3'] || 0),
    chp4_play_time: Number(ct['4'] || 0),
  };
  const endingZh = getEndingZh(ending);
  const inputtedContent = buildInputtedContent(whatsappRecords, emailRecords);
  const archMap = ach.archMap || {};
  const lang = (()=>{ try{ return state.get('settings.language')||'zh-TW'; }catch{ return 'zh-TW'; }})();
  const ua = (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0,200) : '');
  const data = {
    start_date: sess.startAt,
    end_date: now.toISOString(),
    session_id: sess.id,
    total_play_time: totalSec,
    lang,
    ua,
    ...chpTimes,
    ending: endingZh || ending || '',
    inputted_content: JSON.stringify(inputtedContent),
    archievement_list: JSON.stringify(archMap),
    // 內部除錯用（不寫入 sheets，僅放 payload_json）
    _debug: {
      game_session_id: sess.id,
      startAt: sess.startAt,
      playtime,
      chapterTimes: sess.chapterTimes,
      whatsapp_count: whatsappRecords.length,
      email_count: emailRecords.length,
      ach,
      endings
    }
  };
  return data;
}

// ── 僅 2 次寫入：session_start（打開）與 session_end（結局）──
function getCommonLangUa(){
  let lang='zh-TW', ua='';
  try{ lang = state.get('settings.language')||'zh-TW'; }catch{}
  try{ ua = (typeof navigator!=='undefined'? navigator.userAgent.slice(0,200):''); }catch{}
  return { lang, ua };
}

export function sendSessionStart(sess){
  try{
    const s = sess || loadGameSession();
    if(!s) return;
    if(s.sessionStartSent) return; // 防止重複 start
    const { lang, ua } = getCommonLangUa();
    // 標記已發送，避免刷新重複
    s.sessionStartSent = true;
    saveGameSession(s);
    const payload = {
      action: 'session_start',
      start_date: s.startAt,
      end_date: '',
      session_id: s.id,
      total_play_time: 0,
      lang, ua,
      chp0_play_time: 0,
      chp1_play_time: 0,
      chp2_play_time: 0,
      chp3_play_time: 0,
      chp4_play_time: 0,
      ending: '',
      inputted_content: JSON.stringify({whatsup:[], email:[]}),
      archievement_list: JSON.stringify(buildArchievementJson())
    };
    trackSession(payload);
  }catch(e){ console.warn('[analytics] sendSessionStart failed', e); }
}

export function sendSessionEnd(ending){
  try{
    const sess = loadGameSession();
    if(!sess) return;
    if(sess.sessionEndSent) return;
    if(sess.ended && sess.sessionEndSent) return;
    const data = collectSessionData(ending);
    const now = new Date();
    sess.ended = true;
    sess.endedAt = now.toISOString();
    sess.lastEnding = ending || '';
    sess.sessionEndSent = true;
    try{
      const histRaw = localStorage.getItem(GAME_SESSION_HISTORY_KEY);
      const hist = histRaw ? JSON.parse(histRaw) : [];
      hist.push({ id: sess.id, ending, endedAt: sess.endedAt, total_play_time: data.total_play_time });
      localStorage.setItem(GAME_SESSION_HISTORY_KEY, JSON.stringify(hist.slice(-20)));
    }catch{}
    saveGameSession(sess);
    const payload = {
      action: 'session_end',
      start_date: data.start_date,
      end_date: data.end_date,
      session_id: data.session_id,
      total_play_time: data.total_play_time,
      lang: data.lang,
      ua: data.ua,
      chp0_play_time: data.chp0_play_time,
      chp1_play_time: data.chp1_play_time,
      chp2_play_time: data.chp2_play_time,
      chp3_play_time: data.chp3_play_time,
      chp4_play_time: data.chp4_play_time,
      ending: data.ending,
      inputted_content: data.inputted_content,
      archievement_list: data.archievement_list
    };
    trackSession(payload);
  }catch(e){ console.warn('[analytics] sendSessionEnd failed', e); }
}

// ── 底層發送（僅 session_start / session_end 會走到）──
function trackSession(payload){
  // payload 已含 14 欄 + action，所有發送皆經此唯一通道
  const body = {
    timestamp: new Date().toISOString(),
    ...payload
  };
  if(!getConsent()){
    const q = loadQueue(); q.push(body); saveQueue(q);
    return;
  }
  if(!isGasConfigured()){
    const q = loadQueue(); q.push(body); saveQueue(q);
    console.warn('[analytics] 已記錄至本地隊列（待設定 GAS_URL 後補送）', body);
    return;
  }
  sendPayload(body);
}

export function getConsent(){
  try{ return localStorage.getItem(CONSENT_KEY) === '1'; }catch{ return false; }
}
export function setConsent(v){
  try{
    if(v) localStorage.setItem(CONSENT_KEY, '1');
    else localStorage.setItem(CONSENT_KEY, '0');
  }catch{}
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

export function hashText(s){
  if(!s) return '';
  let h = 5381;
  for(let i=0;i<s.length;i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16).padStart(8,'0');
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
  const batch = q.slice(0, 10);
  const remaining = q.slice(10);
  saveQueue(remaining);
  batch.forEach(payload => sendPayload(payload, true));
}

function sendPayload(payload, isRetry = false){
  const url = getGasUrl();
  if(!isGasConfigured()){
    console.warn('[analytics] GAS_URL 未設定，跳過上報', payload);
    return;
  }
  if(!getConsent()){
    if(!isRetry){
      const q = loadQueue(); q.push(payload); saveQueue(q);
    }
    return;
  }
  const body = JSON.stringify(payload);
  try{
    if(navigator.sendBeacon){
      const blob = new Blob([body], {type: 'text/plain;charset=utf-8'});
      const ok = navigator.sendBeacon(url, blob);
      if(ok) return;
    }
  }catch{}
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
      if(!isRetry) setTimeout(()=> flushQueue(), 1000);
    }).catch(err => {
      console.warn('[analytics] 發送失敗，已入隊重試', err);
      if(!isRetry){
        const q = loadQueue(); q.push(payload); saveQueue(q);
      } else {
        const q = loadQueue(); q.unshift(payload); saveQueue(q);
      }
    });
  }catch(err){
    const q = loadQueue(); q.push(payload); saveQueue(q);
  }
}

// ── 為兼容舊呼叫：僅 buffer 到 localStorage，不再直接發送至 sheets ──
export function track(event_type, extra = {}){
  // 已廢棄：為避免舊程式碼誤發多餘列，僅在 console 提示，不再寫入 sheets（除非是 session_* 透過 trackSession）
  console.debug('[analytics] track suppressed (buffer-only mode)', event_type, extra);
}

export function trackWhatsappSend({ chatId, chatName, text, to }) {
  try{ recordWhatsappForSession({ chatId, chatName, text, to }); }catch{}
  // 不再即時寫入 sheets，僅緩衝至 localStorage，待 session_end 一併上報
}

export function trackEmailSubmit({ title, to, body }){
  try{ recordEmailForSession({ title, to, body }); }catch{}
}

export function trackEnding(ending){
  // 結局觸發：直接走 session_end（1 session 僅一次）
  try{ sendSessionEnd(ending); }catch{}
}

export function trackChapter(ch){
  try{ onChapterChanged(ch); }catch{}
  // 不再發送 chapter_changed 至 sheets
}

export function initAnalytics(){
  try{
    const ls = localStorage.getItem('cc_gas_url') || '';
    if(ls && isPlaceholderUrl(ls)) localStorage.removeItem('cc_gas_url');
  }catch{}
  try{ ensureGameSession(); }catch{}
  try{
    state.on('change', (e)=>{
      if(e && e.path === 'currentChapter'){
        try{ onChapterChanged(e.value); }catch{}
      }
    });
  }catch{}
  try{
    state.on('reset', ()=>{
      try{ createNewGameSession(); }catch{}
    });
  }catch{}
  try{ window.__analytics = { track, getConsent, setConsent, getGasUrl, setGasUrl, isGasConfigured, flushQueue, hashText, ENV_GAS_URL: ENV_GAS_URL || '(empty)', getGameSession, createNewGameSession, ensureGameSession, collectSessionData, sendSessionEnd, sendSessionStart, getSessionId, buildInputtedContent, buildArchievementJson, getEndingZh }; }catch{}
  try{
    const gs = (()=>{ try{ return getGameSession(); }catch{ return null; }})();
    console.log('[analytics] init (buffer-only, max 2 writes/session)', {
      hasConsent: getConsent(),
      hasChoice: hasConsentChoice(),
      gasConfigured: isGasConfigured(),
      gasUrl: getGasUrl().slice(0, 60) + (getGasUrl().length>60?'...':''),
      envGasUrl: ENV_GAS_URL ? ENV_GAS_URL.slice(0,30)+'...' : '(empty)',
      localStorageUrl: (typeof localStorage!=='undefined' && localStorage.getItem('cc_gas_url')) ? '已設定' : '(empty)',
      gameSession: gs ? { id: gs.id, startAt: gs.startAt, chapterTimes: gs.chapterTimes, whatsapp: (gs.whatsappLog||[]).length, email: (gs.emailLog||[]).length, startSent: gs.sessionStartSent, endSent: gs.sessionEndSent } : null
    });
    if(!isGasConfigured()){
      console.warn('[analytics] GAS_URL 未設定 → 1) 設定頁貼上 2) localStorage.setItem(\"cc_gas_url\",\"exec URL\") 3) GitHub Secrets VITE_GAS_URL');
    }
  }catch{}
  setTimeout(()=> flushQueue(), 1500);
  try{ window.addEventListener('online', ()=> flushQueue()); }catch{}
}
