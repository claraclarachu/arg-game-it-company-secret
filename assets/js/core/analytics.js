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
// 舊版佔位符（已部署到線上的範例 URL，需視為未設定）
const LEGACY_PLACEHOLDER = 'AKfycbwjzxPakm5HKw4hJGJWw7AZmNZSpVR28QCcxmJr7KPKCSjLcG2_Da7LgBuuGJwVruSU';
function isPlaceholderUrl(url){
  if(!url) return true;
  return url.includes(PLACEHOLDER_MARKER) || url.includes(LEGACY_PLACEHOLDER);
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
  const preview = (text || '').slice(0, 80);
  const hash = hashText(text || '');
  track('whatsapp_send', {
    whatsapp_chat_id: chatId,
    whatsapp_chat_name: chatName || chatId,
    whatsapp_to: to || '',
    whatsapp_preview: preview,
    whatsapp_hash: hash,
    whatsapp_len: (text || '').length,
    payload_json: JSON.stringify({ chatId, preview, len: (text||'').length })
  });
}

export function trackEmailSubmit({ title, to, body }){
  const preview = (body || '').slice(0, 80);
  const hash = hashText(body || '');
  track('email_submit', {
    email_title: title || '',
    email_to: (to || '').slice(0,100),
    email_body_preview: preview,
    email_body_hash: hash,
    email_body_len: (body || '').length,
    payload_json: JSON.stringify({ title, preview, len: (body||'').length })
  });
}

export function trackEnding(ending){
  track('ending_unlocked', {
    ending,
    endings: (state.get('endings') || []).join(','),
    payload_json: JSON.stringify({ ending, all: state.get('endings') })
  });
}

export function trackChapter(ch){
  track('chapter_changed', { chapter: ch, payload_json: JSON.stringify({ chapter: ch }) });
}

export function initAnalytics(){
  // 清理舊佔位符（避免設定面板顯示範例 URL 卻顯示未設定）
  try{
    const ls = localStorage.getItem('cc_gas_url') || '';
    if(ls && isPlaceholderUrl(ls)) localStorage.removeItem('cc_gas_url');
  }catch{}
  // 暴露給 console 除錯
  try{ window.__analytics = { track, getConsent, setConsent, getGasUrl, setGasUrl, isGasConfigured, flushQueue, hashText, ENV_GAS_URL: ENV_GAS_URL || '(empty)' }; }catch{}
  // 除錯日誌：幫你判斷為何 secrets 沒生效
  try{
    console.log('[analytics] init', {
      hasConsent: getConsent(),
      hasChoice: hasConsentChoice(),
      gasConfigured: isGasConfigured(),
      gasUrl: getGasUrl().slice(0, 60) + (getGasUrl().length>60?'...':''),
      envGasUrl: ENV_GAS_URL ? ENV_GAS_URL.slice(0,30)+'...' : '(empty - 需要在 build 時注入 VITE_GAS_URL)',
      localStorageUrl: (typeof localStorage!=='undefined' && localStorage.getItem('cc_gas_url')) ? '已設定' : '(empty)'
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
