var Ia=Object.defineProperty,ua=(e,t)=>{let a={};for(var i in e)Ia(a,i,{get:e[i],enumerable:!0});return t||Ia(a,Symbol.toStringTag,{value:"Module"}),a};(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function a(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=a(n);fetch(n.href,s)}})();var Ca="code_conspiracy_state",Xa="1.0.0",Y={version:Xa,currentChapter:0,unlockedInterfaces:["vscode","jira","whatsapp","search"],discoveredFiles:[],collectedEvidence:[],whatsappChats:null,whatsappMeta:null,jiraTickets:{},jiraTicketsData:null,vscodeState:null,intranetState:null,darknetState:null,searchHistory:[],readArticles:[],whatsappSentCount:0,flags:{},endings:[],settings:{language:"zh-TW",theme:"dark",sound:!0,reducedMotion:!1,bgmVolume:.25,bgmMuted:!1},playtime:0,lastSaved:null,persistentStats:{unlockedEndings:[],readArticles:[],darkFileCount:0,whatsappSentCount:0,searchHistoryCount:0,flags:{}}},Mn=class{constructor(){this.state=this.load(),this.listeners=new Map,this.saveDebounce=null,this.playtimeInterval=null,this.startPlaytimeTracking()}load(){try{const e=localStorage.getItem(Ca);if(e){const t=JSON.parse(e);return this.migrateState(t)}}catch(e){console.warn("Failed to load game state:",e)}return JSON.parse(JSON.stringify(Y))}migrateState(e){e.version||(e.version=Xa);const t={...Y,...e};if(t.flags={...Y.flags||{},...e.flags||{}},t.endings=Array.isArray(e.endings)?[...e.endings]:[...Y.endings],t.discoveredFiles=Array.isArray(e.discoveredFiles)?[...e.discoveredFiles]:[],t.collectedEvidence=Array.isArray(e.collectedEvidence)?[...e.collectedEvidence]:[],t.searchHistory=Array.isArray(e.searchHistory)?[...e.searchHistory]:[],t.readArticles=Array.isArray(e.readArticles)?[...e.readArticles]:[],t.whatsappSentCount=typeof e.whatsappSentCount=="number"?e.whatsappSentCount:0,!t.settings||typeof t.settings!="object"?t.settings={...Y.settings}:t.settings={...Y.settings,...e.settings},!Array.isArray(t.unlockedInterfaces)||!t.unlockedInterfaces.length)t.unlockedInterfaces=[...Y.unlockedInterfaces];else for(const s of Y.unlockedInterfaces)t.unlockedInterfaces.includes(s)||t.unlockedInterfaces.push(s);e.whatsappChats!==void 0&&(t.whatsappChats=e.whatsappChats),e.whatsappMeta!==void 0&&(t.whatsappMeta=e.whatsappMeta),e.jiraTicketsData!==void 0&&(t.jiraTicketsData=e.jiraTicketsData),e.jiraTickets!==void 0&&(t.jiraTickets={...e.jiraTickets||{}}),e.vscodeState!==void 0&&(t.vscodeState=e.vscodeState),e.intranetState!==void 0&&(t.intranetState=e.intranetState),e.darknetState!==void 0&&(t.darknetState=e.darknetState),e.readArticles!==void 0&&(t.readArticles=Array.isArray(e.readArticles)?[...e.readArticles]:[]),typeof e.whatsappSentCount=="number"&&(t.whatsappSentCount=e.whatsappSentCount),typeof e.currentChapter=="number"&&(t.currentChapter=e.currentChapter),typeof e.playtime=="number"&&(t.playtime=e.playtime);const a=Array.isArray(e.persistentStats?.unlockedEndings)?[...e.persistentStats.unlockedEndings]:[...Y.persistentStats.unlockedEndings],i=Array.isArray(e.endings)?e.endings:Array.isArray(e.unlockedEndings)?e.unlockedEndings:[],n=[...new Set([...a,...i])];return t.persistentStats={unlockedEndings:n,readArticles:Array.isArray(e.persistentStats?.readArticles)?[...e.persistentStats.readArticles]:[...Y.persistentStats.readArticles],darkFileCount:typeof e.persistentStats?.darkFileCount=="number"?e.persistentStats.darkFileCount:0,whatsappSentCount:typeof e.persistentStats?.whatsappSentCount=="number"?e.persistentStats.whatsappSentCount:0,searchHistoryCount:typeof e.persistentStats?.searchHistoryCount=="number"?e.persistentStats.searchHistoryCount:0,flags:{...Y.persistentStats.flags||{},...e.persistentStats?.flags||{}}},n.length&&(t.unlockedEndings=[...n]),t}save(e=!1){if(e){this._doSave();return}clearTimeout(this.saveDebounce),this.saveDebounce=setTimeout(()=>this._doSave(),500)}_doSave(){this.state.lastSaved=new Date().toISOString();try{localStorage.setItem(Ca,JSON.stringify(this.state)),this.emit("save",this.state)}catch(e){console.error("Failed to save game state:",e),this.emit("saveError",e)}}get(e){return e?e.split(".").reduce((t,a)=>t?.[a],this.state):this.state}set(e,t){const a=e.split("."),i=a.pop(),n=a.reduce((s,r)=>(s[r]||(s[r]={}),s[r]),this.state);if(n[i]=t,e==="endings"&&Array.isArray(t)){this.state.persistentStats||(this.state.persistentStats=JSON.parse(JSON.stringify(Y.persistentStats)));const s=this.state.persistentStats;s.unlockedEndings=[...new Set([...s.unlockedEndings||[],...t])],this.state.unlockedEndings=[...s.unlockedEndings]}if(e==="unlockedEndings"&&Array.isArray(t)){this.state.persistentStats||(this.state.persistentStats=JSON.parse(JSON.stringify(Y.persistentStats)));const s=this.state.persistentStats;s.unlockedEndings=[...new Set([...s.unlockedEndings||[],...t])]}this.emit("change",{path:e,value:t,state:this.state}),e.startsWith("flags.")||e==="currentChapter"||e==="endings"||e.startsWith("endings")||e==="unlockedEndings"||e.startsWith("unlockedEndings")||e==="persistentStats"||e.startsWith("persistentStats")||e==="readArticles"||e.startsWith("readArticles")||e==="whatsappSentCount"?this.save(!0):this.save()}update(e,t){const a=this.get(e);this.set(e,t(a))}push(e,t){const a=this.get(e)||[];this.set(e,[...a,t])}remove(e,t){const a=this.get(e)||[];this.set(e,a.filter(i=>!t(i)))}hasFlag(e){return!!this.state.flags[e]}setFlag(e,t=!0){this.set(`flags.${e}`,t),this.save(!0)}addEvidence(e){this.state.collectedEvidence.some(t=>t.id===e.id)||(this.push("collectedEvidence",{...e,discoveredAt:new Date().toISOString()}),this.emit("evidence",e),this.save(!0))}unlockInterface(e){this.state.unlockedInterfaces.includes(e)||(this.push("unlockedInterfaces",e),this.emit("interfaceUnlocked",e))}discoverFile(e){this.state.discoveredFiles.includes(e)||(this.push("discoveredFiles",e),this.emit("fileDiscovered",e),this.save(!0))}markArticleRead(e){e&&(this.state.readArticles||(this.state.readArticles=[]),this.state.readArticles.includes(e)||(this.push("readArticles",e),this.save(!0)))}incrementWhatsappSent(){const e=typeof this.state.whatsappSentCount=="number"?this.state.whatsappSentCount:0;this.set("whatsappSentCount",e+1),this.save(!0)}startPlaytimeTracking(){this.playtimeInterval=setInterval(()=>{this.state.playtime+=1,this.state.playtime%60===0&&this.save(!0)},1e3)}stopPlaytimeTracking(){clearInterval(this.playtimeInterval),this.save(!0)}exportSave(){return JSON.stringify(this.state,null,2)}importSave(e){try{const t=JSON.parse(e);return this.state=this.migrateState(t),this.save(!0),this.emit("load",this.state),!0}catch(t){return console.error("Failed to import save:",t),!1}}reset(){try{clearTimeout(this.saveDebounce)}catch{}try{clearInterval(this.playtimeInterval)}catch{}const e=this.state.persistentStats||{unlockedEndings:[],readArticles:[],darkFileCount:0,whatsappSentCount:0,searchHistoryCount:0,flags:{}};e.unlockedEndings=[...new Set([...e.unlockedEndings||[],...this.state.endings||[]])],e.readArticles=[...new Set([...e.readArticles||[],...this.state.readArticles||[]])];const t=(this.state.discoveredFiles||[]).filter(n=>n.startsWith("/darknet")).length;e.darkFileCount=Math.max(e.darkFileCount||0,t),e.whatsappSentCount=Math.max(e.whatsappSentCount||0,this.state.whatsappSentCount||0);const a=(this.state.searchHistory||[]).length;e.searchHistoryCount=Math.max(e.searchHistoryCount||0,a),e.flags={...e.flags||{}},this.state.flags.portal_simple_entered&&(e.flags.portal_simple_entered=!0),this.state.flags.portal_hash_entered&&(e.flags.portal_hash_entered=!0),this.state.flags.sawyer_abuse_sent&&(e.flags.sawyer_abuse_sent=!0);const i=JSON.parse(JSON.stringify(e));this.state=JSON.parse(JSON.stringify(Y)),this.state.unlockedInterfaces=[...Y.unlockedInterfaces],this.state.flags={},this.state.collectedEvidence=[],this.state.discoveredFiles=[],this.state.endings=[],this.state.searchHistory=[],this.state.readArticles=[],this.state.whatsappSentCount=0,this.state.jiraTickets={},this.state.whatsappChats=null,this.state.whatsappMeta=null,this.state.jiraTicketsData=null,this.state.vscodeState=null,this.state.playtime=0,this.state.persistentStats=i,this.save(!0),this.emit("reset",this.state),this.startPlaytimeTracking()}on(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>this.off(e,t)}off(e,t){this.listeners.get(e)?.delete(t)}emit(e,t){this.listeners.get(e)?.forEach(a=>a(t))}},l=new Mn,Dn=class{constructor(){this.events=new Map,this.onceEvents=new Map}on(e,t,a=null){this.events.has(e)||this.events.set(e,new Set);const i=a?t.bind(a):t;return this.events.get(e).add(i),()=>this.off(e,i)}once(e,t,a=null){const i=a?t.bind(a):t,n=(...s)=>{this.off(e,n),i(...s)};return this.onceEvents.has(e)||this.onceEvents.set(e,new Set),this.onceEvents.get(e).add(n),()=>this.off(e,n)}off(e,t){this.events.get(e)?.delete(t),this.onceEvents.get(e)?.delete(t)}emit(e,...t){this.events.get(e)?.forEach(a=>{try{a(...t)}catch(i){console.error(`Error in event handler for "${e}":`,i)}}),this.onceEvents.get(e)?.forEach(a=>{try{a(...t)}catch(i){console.error(`Error in once handler for "${e}":`,i)}}),this.onceEvents.get(e)?.clear()}clear(e){e?(this.events.delete(e),this.onceEvents.delete(e)):(this.events.clear(),this.onceEvents.clear())}},W=new Dn,et=new Map,yt=new Map,Jt=new Map,Za="https://nori-intranet/internal/portal?";function en(e,t){Jt.set(e,t)}function Fn(e){return Jt.get(e)||null}function Nn(){return Array.from(Jt.entries()).map(([e,t])=>({key:e,...t}))}function On(e){for(const[t,a]of Jt.entries())if(e(a,t))return{key:t,...a};return null}en("nori-portal-2023",{domain:Za,historical:!0,description:"Nori 內網舊版 portal 路由（2023 前由 generateSecretPath 動態產生）",generateSecretPath:"function generateSecretPath(domain){ const cid = redis.get('companyId'); const y = redis.get('year'); const k='70BTa3A1a13ad4212GHdybJmn'; return domain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); }",key:"70BTa3A1a13ad4212GHdybJmn",companyIdSource:"redis.get('companyId')",yearSource:"redis.get('year')",_hash:"f665a7117959b667b7f283eaebf69cae",_fullUrl:"https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae"});function me(e,t){yt.set(e,t)}function tn(e){return yt.get(e)||null}function Hn(e="/"){const t=[];for(const[a,i]of yt.entries())a.startsWith(e)&&t.push({path:a,...i});return t.sort((a,i)=>a.path.localeCompare(i.path))}function Vn(){const e={name:"/",path:"/",children:[],type:"dir"},t=new Map;t.set("/",e);for(const[i]of yt.entries()){const n=i.split("/").filter(Boolean);let s="",r=e;for(let d=0;d<n.length;d++){s+="/"+n[d];const o=d===n.length-1;if(t.has(s)){const c=t.get(s);!o&&c.type==="file"&&(c.type="dir",c.children=c.children||[])}else{const c={name:n[d],path:s,type:o?"file":"dir",children:o?void 0:[]};if(o){const m=yt.get(i);c.ext=i.split(".").pop(),c.meta=m.meta||{}}t.set(s,c),r.children||(r.children=[]),r.children.push(c)}r=t.get(s)}}function a(i){i.children&&(i.children.sort((n,s)=>n.type!==s.type?n.type==="dir"?-1:1:n.name.localeCompare(s.name)),i.children.forEach(a))}return a(e),e}function Rn(e){const t=tn(e);return t?t.content:null}function x(e,t){et.set(e,t)}function an(e){return et.get(e)||null}function qn(e="/"){const t=[];for(const[a,i]of et.entries())a.startsWith(e)&&t.push({path:a,...i});return t.sort((a,i)=>a.path.localeCompare(i.path))}function zn(){const e={name:"/",path:"/",children:[],type:"dir"},t=new Map;t.set("/",e);for(const[i]of et.entries()){const n=i.split("/").filter(Boolean);let s="",r=e;for(let d=0;d<n.length;d++){s+="/"+n[d];const o=d===n.length-1;if(t.has(s)){const c=t.get(s);!o&&c.type==="file"&&(c.type="dir",c.children=c.children||[])}else{const c={name:n[d],path:s,type:o?"file":"dir",children:o?void 0:[]};if(o){const m=et.get(i);c.ext=i.split(".").pop(),c.meta=m.meta||{}}t.set(s,c),r.children||(r.children=[]),r.children.push(c)}r=t.get(s)}}function a(i){i.children&&(i.children.sort((n,s)=>n.type!==s.type?n.type==="dir"?-1:1:n.name.localeCompare(s.name)),i.children.forEach(a))}return a(e),e}function Un(e){const t=an(e);return!t||t.hidden&&!l.hasFlag(`discovered:${e}`)?null:(l.discoverFile(e),e==="/customer-portal/src/payment/mixer.js"&&l.setFlag("found_crypto_mixer",!0),e==="/customer-portal/src/payment/gateway.js"&&l.setFlag("found_fee_mapping",!0),e==="/customer-portal/src/payment/cryptoConfig.json"&&l.setFlag("found_mixer_config",!0),e==="/customer-portal/ledger.db"&&l.setFlag("ledger_exported",!0),e==="/customer-portal/docs/arch.pdf"&&l.setFlag("sql_injected",!0),e==="/customer-portal/data/ledger_export.csv"&&l.setFlag("found_coordinates",!0),e==="/customer-portal/src/main/resources/application.properties"&&l.setFlag("found_ssh_trace",!0),e==="/customer-portal/src/main/java/com/nori/OrderService.java"&&l.setFlag("found_fee_mapping",!0),W.emit("vfs:read",e),t.content)}function Wn(e){return et.has(e)}function Gn(e){const t=e.toLowerCase(),a=[];for(const[i,n]of et.entries())typeof n.content=="string"&&n.content.toLowerCase().includes(t)&&a.push({path:i,snippet:Jn(n.content,t)});return a}function Jn(e,t){const a=e.toLowerCase().indexOf(t),i=Math.max(0,a-40),n=Math.min(e.length,a+t.length+40);return e.slice(i,n).replace(/\n/g," ")}function ma(){return l.hasFlag("ch1_0043_committed")&&!l.hasFlag("ch1_revert_done")}function Yn(){return ma()?!1:l.hasFlag("hidden_portal_accessed")}function Kn(e){return ma()?!1:e&&e.hash==="f665a7117959b667b7f283eaebf69cae"?(l.setFlag("hidden_portal_accessed",!0),l.setFlag("portal_auth_bypassed",!1),W.emit("portal:discovered"),!0):!1}function Qn(e){return ma()?!1:(e?.["X-Internal-Token"]||e?.["x-internal-token"])==="nori-drinks-token-2024"?(l.hasFlag("hidden_portal_accessed")||(l.setFlag("hidden_portal_accessed",!0),W.emit("portal:discovered")),l.setFlag("portal_auth_bypassed",!0),W.emit("portal:bypassed"),!0):!1}function Xn(){x("/customer-portal/package.json",{content:JSON.stringify({name:"nori-drinks-supply",version:"3.5.0",private:!0,description:"Nori 飲品供應 — 招牌冰釀茶酒 / 原物料管理 / 訂單銷售 / 內部系統",scripts:{dev:"vite",build:"vite build",test:"jest","db:migrate":"node scripts/migrate.js"},dependencies:{vite:"^5.0.0",vue:"^3.4.0"}},null,2),meta:{lang:"json"}}),x("/customer-portal/README.md",{content:`# Nori外部網頁

- 前台官網功能：飲品一覽、VIP 價格試算、關於 Nori、線上訂購
- 支付閘道：gateway.js 統一清算

## 開發

\`\`\`bash
npm install
npm run dev   # http://localhost:3000
\`\`\`
環境變數見 \`.env\`
`,meta:{lang:"markdown"}}),x("/customer-portal/.env",{content:`DATABASE_URL=postgres://nori:nori@localhost:5432/nori_drinks
INTERNAL_PORTAL_TOKEN=nori-drinks-token-2024
ABPAY_API_KEY=abpay_test_sk_...
LALAPAY_MERCHANT_ID=lala_nori_2019
BANK_ACCOUNT_ESUN=808-123456789012
MD5_KEY=70BTa3A1a13ad4212GHdybJmn
#內部稽核 token，請勿外洩
`,meta:{lang:"properties"}}),x("/customer-portal/docker-compose.yml",{content:`version: '3.8'
services:
  api:
    build: ./src/main/java
    ports: ["8080:8080"]
    environment:
      - DATABASE_URL=postgres://nori:nori@db:5432/nori
  db:
    image: postgres:15
    volumes: ["./data:/var/lib/postgresql/data"]
  web:
    build: ./src/frontend
    ports: ["3000:3000"]
`,meta:{lang:"yaml"}}),x("/file-system/README.md",{content:`# File System UI (內網檔案系統前端)

此為 Nori 內網檔案系統的前端建構專案，負責「內網」App 的 UI 渲染。
實際檔案資料存放於後端資料庫，此處僅為前端展示邏輯。`,meta:{lang:"markdown"}}),x("/file-system/package.json",{content:JSON.stringify({name:"nori-file-system-ui",version:"1.0.0",private:!0,description:"Nori 內網檔案系統 UI"},null,2),meta:{lang:"json"}}),x("/file-system/src/App.jsx",{content:`import SearchBar from './components/SearchBar.jsx';
import FileList from './components/FileList.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import Sidebar from './components/Sidebar.jsx';
import FilePreview from './components/FilePreview.jsx';

export default function App(){
  // File System UI - 模擬內網檔案系統的前端建構
  // 實際資料存放於後端
  return (
    <div className="file-system">
      <SearchBar />
      <div className="file-system__body">
        <Sidebar />
        <div className="file-system__main">
          <Breadcrumb />
          <FileList />
          <FilePreview />
        </div>
      </div>
    </div>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/components/SearchBar.jsx",{content:`import { useState } from 'react';

// Legacy filesystem compatibility
// TODO: remove after migration
// Filesystem v2 migration completed, no longer used
const legacyRoutes = {
    archive: "/internal/portal",
    documents: "/documents"
};
function resolveLegacyPath(path) {
    return legacyRoutes[path] || path; // full url = 'https://nori-intranet/internal/portal'
} 

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  // 模擬內網搜尋列邏輯
  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val.toLowerCase());
  };
  return (
    <div className="search-bar">
      <span>🔍</span>
      <input value={query} onChange={handleInput} placeholder="搜尋內網檔案名稱或內容" />
    </div>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/components/FileList.jsx",{content:`import { useState, useEffect } from 'react';

// 模擬內網檔案列表邏輯
export default function FileList({ files, onSelect }) {
  // 與 Intranet 的 renderFileRows 類似，僅展示 UI
  return (
    <div className="file-list">
      {files.map(f => (
        <div key={f.path} className="file-row" onClick={() => onSelect(f.path)}>
          <span>{f.type === 'dir' ? '📁' : '📄'}</span>
          <span>{f.name}</span>
        </div>
      ))}
    </div>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/components/Breadcrumb.jsx",{content:`export default function Breadcrumb({ path, onNavigate }) {
  // 模擬內網麵包屑導覽
  const parts = path.split('/').filter(Boolean);
  let acc = '';
  return (
    <nav className="breadcrumb">
      <span onClick={() => onNavigate('/intranet')}>🏠 內網首頁</span>
      {parts.slice(1).map(p => {
        acc += '/' + p;
        return <span key={acc} onClick={() => onNavigate(acc)}>{p}</span>;
      })}
    </nav>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/components/Sidebar.jsx",{content:`export default function Sidebar({ currentPath, onNavigate }) {
  // 模擬內網側邊導覽
  const items = [
    { path: '/intranet', label: '內網首頁', icon: '🏠' },
    { path: '/intranet/company_public', label: '公司公開資訊', icon: '🏢' },
    { path: '/intranet/client_info', label: '客戶資料', icon: '🔒' },
    { path: '/intranet/business_plans', label: '業務計畫', icon: '📊' },
    { path: '/intranet/staff', label: '員工資料', icon: '👥' },
  ];
  return (
    <nav className="sidebar">
      {items.map(it => (
        <div key={it.path} className={currentPath===it.path?'active':''} onClick={() => onNavigate(it.path)}>
          <span>{it.icon}</span><span>{it.label}</span>
        </div>
      ))}
    </nav>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/components/FilePreview.jsx",{content:`export default function FilePreview({ file }) {
  // 模擬內網檔案預覽（支援 CSV 表格、Markdown 等）
  if (!file) return null;
  const isCSV = file.path.endsWith('.csv');
  return (
    <div className="file-preview">
      <div className="preview-header">{file.path}</div>
      {isCSV ? <table><thead><tr>{file.header.map(h => <th>{h}</th>)}</tr></thead></table> : <pre>{file.content.slice(0,8000)}</pre>}
    </div>
  );
}`,meta:{lang:"javascript"}}),x("/file-system/src/utils/helpers.js",{content:`export function escapeHtml(str){ const div=document.createElement('div'); div.textContent=str; return div.innerHTML; }
export function formatFileSize(bytes){ return (bytes/1024).toFixed(1)+' KB'; }`,meta:{lang:"javascript"}}),x("/file-system/src/styles/main.css",{content:`/* File System UI - 模擬內網樣式 */
.file-system{ display:flex; flex-direction:column; flex:1; }
.file-system__body{ display:flex; flex:1; }
.sidebar{ width:220px; border-right:1px solid var(--border); }
.file-list{ flex:1; }`,meta:{lang:"css"}}),x("/customer-portal/src/billing/service.js",{content:`// billing/service.js - 飲品訂單金額稽核模組 (VIP 飲品價格)
import { ledger } from './ledger.js';
import { cryptoMixer } from '@shady/crypto-mixer'; // 保留：對應 ABPay/LalaPay 混帳路由測試

/**
 * 計算飲品訂單總額 (方案費 + 手續費)
 * Nori 備註：此函式同時供前台 VIP 試算與後台對帳使用
 */
export function calculateAmount(items, opts = {}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = computeFee(subtotal, opts); // 手續費 = 方案分潤 (見 getFeeRate)
  const total = subtotal + fee;
  return total;
}

function computeFee(amount, opts) {
  const feeRate = getFeeRate(opts.vendorId);
  return Math.round(amount * feeRate * 100) / 100;
}

function getFeeRate(vendorId) {
  // Nori 對應：飲品系列的隱含服務費率（冰釀茶酒等）
  const table = { default: 0.03};
  return table[vendorId] || table.default;
}

function redirectTo(path) {
  return { __redirect: path };
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/middleware/auth.js",{content:`// middleware/auth.js
export function portalAuth(req) {
  const token = req.headers['X-Internal-Token'];
  if (token !== process.env.INTERNAL_PORTAL_TOKEN) {
    return { status: 403, body: 'Forbidden' };
  }
  if (!req.headers.referer?.includes('/billing')) {
    return { status: 403, body: 'Bad referer' };
  }
  return { status: 200 };
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/main/java/com/nori/OrderService.java",{content:`package com.nori;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.util.stream.Collectors;
import com.nori.model.Order;
import com.nori.repository.OrderRepository;

/**
 * Nori 飲品供應 — 訂單服務
 * 負責訂單查詢 / 金額試算 / 資料轉換
 * 此檔案同時供前台 VIP 試算與後台對帳使用，請勿隨意更動費率邏輯
 */
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    /**
     * VIP 折扣計算
     * Nori 會員：VIP 對應客戶等級，忠實客戶折扣
     */
    public double calculateVipPrice(double price, int vipLv) {
        switch(vipLv){
            case 1: price*=0.95;
            break;

            case 2: price*=0.90;
            break;

            case 3: price*=0.85;
            break;

            case 4: price*=0.80;
            break;

            case 5: price*=0.75;
            break;

            default:
            break;
        }
        return price;
    }

    // 依費率計算服務費 (對應 billing/service.js getFeeRate)
    public double feeRate(String vendorId) {
        return switch(vendorId) {
            case "drink-001" -> 0.05;
            case "drink-002" -> 0.08;
            case "drink-003" -> 0.03;
            default -> 0.03;
        };
    }

    // 取得單筆訂單 (由 DB 查詢)
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    // 依狀態查詢訂單列表
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // 依客戶查詢訂單 (後台對帳使用)
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    // 依客戶查詢並轉為 DTO (供前端顯示)
    public List<OrderDto> getOrderDtosByCustomer(String customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 轉換 Order -> OrderDto (供前端與匯出使用)
    public OrderDto convertToDto(Order order) {
        if (order == null) return null;
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomerId());
        dto.setPlanId(order.getPlanId());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null);
        return dto;
    }

    // 批次轉換 List<Order> -> List<OrderDto>
    public List<OrderDto> convertToDtoList(List<Order> orders) {
        if (orders == null) return Collections.emptyList();
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // Map 轉 Order 實體 (匯入 CSV / 舊系統相容)
    public Order convertMapToOrder(Map<String, Object> map) {
        Order order = new Order();
        order.setId((String) map.get("id"));
        order.setCustomerId((String) map.get("customerId"));
        order.setPlanId((String) map.get("drinkId"));
        order.setBasePrice(map.get("basePrice") != null ? ((Number) map.get("basePrice")).doubleValue() : 0);
        order.setStatus((String) map.getOrDefault("status", "PENDING"));
        return order;
    }

    // 計算訂單最終金額 (含服務費與 VIP 折扣，後台試算共用)
    public double calculateFinalPrice(Order order, int vipLevel) {
        double base = order.getBasePrice();
        double fee = base * feeRate(order.getPlanId());
        double subtotal = base + fee;
        return calculateVipPrice(subtotal, vipLevel);
    }

    // 依付款方式統計訂單金額
    public Map<String, Double> sumAmountByPaymentMethod(List<Order> orders) {
        return orders.stream().collect(Collectors.groupingBy(
            o -> o.getPaymentMethod() != null ? o.getPaymentMethod().name() : "UNKNOWN",
            Collectors.summingDouble(Order::getTotalPrice)
        ));
    }

    // 內部 DTO 定義 (僅用於轉換展示，前端與匯出共用)
    public static class OrderDto {
        private String id;
        private String customerId;
        private String drinkId;
        private double totalPrice;
        private String status;
        private String paymentMethod;
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
        public String getPlanId() { return drinkId; }
        public void setPlanId(String drinkId) { this.drinkId = drinkId; }
        public double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/NoriApplication.java",{content:`package com.nori;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Nori 飲品供應 — 啟動類
 * 創辦人 Sawyer 2019 創立
 */
@SpringBootApplication
public class NoriApplication {
    public static void main(String[] args) {
        SpringApplication.run(NoriApplication.class, args);
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/config/SecurityConfig.java",{content:`package com.nori.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/api/drinks/**", "/api/products/**", "/api/about", "/api/price/calc").permitAll()
            .antMatchers("/api/admin/**").hasRole("STAFF")
            .and().csrf().disable();
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/model/Drink.java",{content:`package com.nori.model;

/** 飲品產品 */
public class Drink {
    public enum DrinkType { ICE_TEA_ALCOHOLIC, GRAPE_WINE, FRUIT_TEA }
    private String id;
    private DrinkType type;
    private String name;
    private String origin; // e.g. 台灣高山茶＋葡萄 / 自釀葡萄 / 當季水果
    private int shelfDays;
    private double basePrice; // 未含服務費
    private String[] ingredients;
    private String[] features;
    // getters/setters ...
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/service/DrinkService.java",{content:`package com.nori.service;

import com.nori.model.Drink;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DrinkService {
    private final Map<String, Drink> store = new LinkedHashMap<>();
    public DrinkService() {
        // 招牌：冰釀茶酒（最暢銷，葡萄＋茶葉）
        // 葡萄釀造酒：實驗室葡萄釀酒
        // 水果茶系列：季節水果調配
        seed();
    }
    public List<Drink> listAll() { return new ArrayList<>(store.values()); }
    public Drink get(String id) { return store.get(id); }
    private void seed() {
        // 由 data/drinks.json 載入，見 resources/data/drinks.json
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/controller/DrinkController.java",{content:`package com.nori.controller;

import com.nori.model.Drink;
import com.nori.service.DrinkService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drinks")
public class DrinkController {
    private final DrinkService service;
    public DrinkController(DrinkService s){ this.service=s; }
    @GetMapping
    public List<Drink> list(){ return service.listAll(); }
    @GetMapping("/{id}")
    public Drink detail(@PathVariable String id){ return service.get(id); }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/service/PriceCalculatorService.java",{content:`package com.nori.service;

import com.nori.OrderService; // 保留 VIP 折扣邏輯
import com.nori.model.Drink;
import org.springframework.stereotype.Service;

/**
 * 飲品費用試算：商品費 + 服務費 + VIP 客戶折扣（IT 網頁計算）
 */
@Service
public class PriceCalculatorService {
    private final OrderService vip = new OrderService();
    public double calculate(Drink drink, int vipLevel, int familySize) {
        double base = drink.getBasePrice();
        double fee = base * feeRate(drink.getType().name());
        double subtotal = (base + fee) * familySize;
        return vip.calculateVipPrice(subtotal, vipLevel);
    }
    private double feeRate(String type){
        return switch(type){
            case "ICE_TEA_ALCOHOLIC" -> 0.05;
            case "GRAPE_WINE" -> 0.08;
            case "FRUIT_TEA" -> 0.03;
            default -> 0.05;
        };
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/controller/PriceCalculatorController.java",{content:`package com.nori.controller;

import com.nori.service.PriceCalculatorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/price")
public class PriceCalculatorController {
    private final PriceCalculatorService calc;
    public PriceCalculatorController(PriceCalculatorService c){ this.calc=c; }
    @PostMapping("/calc")
    public java.util.Map<String,Object> calc(@RequestBody java.util.Map<String,Object> body){
        // body: { drinkId, vipLevel, familySize }
        return java.util.Map.of("total", 0); // 由前端試算，後端複核
    }
    @GetMapping("/vip-table")
    public java.util.Map<Integer,String> vipTable(){
        return java.util.Map.of(1,"90%",2,"85%",3,"80%",4,"75%",5,"70%");
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/utils/FeeCalculator.java",{content:`package com.nori.utils;

/** 前台共用：與 billing/service.js 一致（飲品 VIP 計算） */
public class FeeCalculator {
    public static double total(double base, String drinkType, int familySize){
        double rate = switch(drinkType){
            case "ICE_TEA_ALCOHOLIC" -> 0.05; case "GRAPE_WINE" -> 0.08; case "FRUIT_TEA" -> 0.03; default -> 0.05;
        };
        return Math.round((base * (1+rate) * familySize)*100)/100.0;
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/controller/AboutController.java",{content:`package com.nori.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class AboutController {
    @GetMapping("/api/about")
    public Map<String,Object> about(){
        return Map.of(
            "company","Nori 飲品供應",
            "founder","Sawyer",
            "founded",2019,
            "hq","鴨嘴道135號中央大樓3507室",
            "mission","用一杯冰釀茶酒，連結人與風味",
            "team", 50,
            "products", 12
        );
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/model/Customer.java",{content:`package com.nori.model;

public class Customer {
    private String id; // CUS-xxxx
    private String name;
    private String passport;
    private String phone;
    private String email;
    private int vipLevel; // 1-5 對應 OrderService.calculateVipPrice
    private String drinkId; // drink-001/002/003
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/model/Order.java",{content:`package com.nori.model;

import java.time.LocalDate;
public class Order {
    private String id; // ORD-2024-xxxx
    private String customerId;
    private String drinkId; // drink-001/002/003
    private double basePrice;
    private double totalPrice; // 含服務費與 VIP 折扣
    private Payment.PaymentMethod paymentMethod; // BANK_TRANSFER / ABPAY / LALAPAY
    private String status; // PENDING / PAID / APPROVED / COMPLETED
    private LocalDate createdAt;
    private String assignedConsultant; // Sawyer, Maggie...
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/model/Payment.java",{content:`package com.nori.model;

import java.time.LocalDateTime;
public class Payment {
    public enum PaymentMethod { BANK_TRANSFER, ABPAY, LALAPAY }
    private String orderId;
    private PaymentMethod method;
    private double amount;
    private String txId;
    private String status; // INIT / SUCCESS / FAILED
    private LocalDateTime paidAt;
    private String receiptUrl;
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/model/enums/PaymentMethod.java",{content:`package com.nori.model.enums;

public enum PaymentMethod {
    BANK_TRANSFER("銀行匯款","ESUN 808"),
    ABPAY("ABPay 電子支付","ABPay"),
    LALAPAY("LalaPay","LalaPay");
    private final String label; private final String channel;
    PaymentMethod(String l,String c){ this.label=l; this.channel=c; }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/repository/OrderRepository.java",{content:`package com.nori.repository;

import com.nori.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order,String> {
    List<Order> findByCustomerId(String cid);
    List<Order> findByPlanId(String drinkId);
    List<Order> findByStatus(String status);
    List<Order> findByPaymentMethod(String method);
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/repository/PaymentRepository.java",{content:`package com.nori.repository;

import com.nori.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentRepository extends JpaRepository<Payment,String> {}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/service/NoriOrderService.java",{content:`package com.nori.service;

import com.nori.model.Order;
import com.nori.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoriOrderService {
    private final OrderRepository repo;
    public NoriOrderService(OrderRepository r){ this.repo=r; }
    public List<Order> query(String status, String drinkId, String paymentMethod){
        if(status!=null) return repo.findByStatus(status);
        if(drinkId!=null) return repo.findByPlanId(drinkId);
        return repo.findAll();
    }
    public Order get(String id){ return repo.findById(id).orElse(null); }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/controller/OrderController.java",{content:`package com.nori.controller;

import com.nori.model.Order;
import com.nori.service.NoriOrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {
    private final NoriOrderService svc;
    public OrderController(NoriOrderService s){ this.svc=s; }
    @GetMapping
    public List<Order> list(@RequestParam(required=false) String status,
                            @RequestParam(required=false) String drinkId,
                            @RequestParam(required=false) String paymentMethod){
        return svc.query(status, drinkId, paymentMethod);
    }
    @GetMapping("/{id}")
    public Order detail(@PathVariable String id){ return svc.get(id); }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/service/PaymentService.java",{content:`package com.nori.service;

import com.nori.model.Payment;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    public Payment settle(String orderId, Payment.PaymentMethod method, double amount){
        // 依 method 導向不同閘道：bankTransfer / abPay / lalaPay (見 src/payment/*.js)
        return new Payment(); // 簡化：實際呼叫 gateway.js
    }
    public boolean verifyCallback(String txId, String signature){
        return true; // 驗簽
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/main/java/com/nori/controller/PaymentController.java",{content:`package com.nori.controller;

import com.nori.model.Payment;
import com.nori.service.PaymentService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PaymentController {
    private final PaymentService pay;
    public PaymentController(PaymentService p){ this.pay=p; }
    @PostMapping("/settle")
    public Payment settle(@RequestBody Map<String,Object> body){
        String orderId=(String)body.get("orderId");
        Payment.PaymentMethod m=Payment.PaymentMethod.valueOf((String)body.get("method"));
        double amount=((Number)body.get("amount")).doubleValue();
        return pay.settle(orderId,m,amount);
    }
    @PostMapping("/callback/{channel}")
    public Map<String,String> callback(@PathVariable String channel, @RequestBody Map<String,Object> payload){
        return Map.of("status","ok","channel",channel);
    }
}
`,meta:{lang:"java"}}),x("/customer-portal/src/payment/bankTransfer.js",{content:`// bankTransfer.js - 銀行匯款 (玉山)
/**
 * 產生匯款資訊給客戶，後台人工對帳
 */
export function createBankTransfer(order) {
  return {
    method: 'BANK_TRANSFER',
    bank: '玉山銀行 (808)',
    account: '1234-5678-9012',
    holder: 'Nori Immigration Co.',
    amount: order.totalPrice,
    memo: '匯款備註請填：' + order.id,
    expireAt: new Date(Date.now()+3*86400000).toISOString()
  };
}
export function verifyBankReceipt(txId, amount){
  // 後台上傳水單後核銷
  return { txId, verified: true };
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/payment/abPay.js",{content:`// abPay.js - ABPay 電子支付
import config from './paymentConfig.json' with { type: 'json' };

export async function createABPay(order) {
  const payload = {
    appId: config.channels.ABPAY.appId,
    orderId: order.id,
    amount: order.totalPrice,
    currency: 'HKD',
    returnUrl: '/payment/success?method=abpay'
  };
  // 實際呼叫 ABPay API，回傳支付連結
  return { method: 'ABPAY', payUrl: 'https://pay.abpay.tw/' + order.id, payload };
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/payment/cryptoConfig.json",{content:JSON.stringify({mixer:"@shady/crypto-mixer@1.2.3",wallets:["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4","1A2b...9z"],autoMix:!0,feeSplit:{"drink-001":.05,"drink-002":.08},nori:{channels:["BANK_TRANSFER","ABPAY","LALAPAY"]}},null,2),meta:{lang:"json"}}),x("/customer-portal/src/payment/mixer.js",{content:`// mixer.js 
 import { cryptoMixer } from '@shady/crypto-mixer';
export const mixerConfig = {
  wallets: ["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4"],
  route: "tor://mixer.internal",
  noriChannels: ["ABPAY","LALAPAY"]
};
export function mix(amount, vendorId) {
  return cryptoMixer.shuffle(amount, mixerConfig.wallets);
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/payment/gateway.js",{content:`// gateway.js - Nori 支付閘道統一入口 (Bank / ABPay / LalaPay)
import { getFeeRate } from '../billing/service.js';
import { createBankTransfer } from './bankTransfer.js';
import { createABPay } from './abPay.js';
import { createLalaPay } from './lalaPay.js';

export async function settle(order) {
  const rate = getFeeRate(order.drinkId); // drink-001 0.05 / drink-002 0.08 / drink-003 0.03
  const payout = order.amount * (1 - rate);
  switch(order.paymentMethod){
    case 'BANK_TRANSFER': return createBankTransfer({ ...order, totalPrice: order.amount });
    case 'ABPAY': return createABPay(order);
    case 'LALAPAY': return createLalaPay(order);
    default: return { payout};
  }
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/pages/Home.jsx",{content:`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
      <p>創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/pages/PriceCalculator.jsx",{content:`import { useState } from 'react';
import { calculateAmount } from '../../../billing/service.js';

export default function PriceCalculator(){
  const [drink,setDrink]=useState('drink-001');
  const [vip,setVip]=useState(1);
  const [family,setFamily]=useState(2);
  const total = calculateAmount([{price: 680000, qty: family}], { vendorId: drink });
  return (
    <div>
      <h2>費用試算 (含服務費 + VIP 折扣)</h2>
      <p>試算結果：{total} HKD</p>
      <small>VIP 折扣由 OrderService.calculateVipPrice 計算 (1:90% ... 5:70%)</small>
    </div>
  );
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/pages/About.jsx",{content:`export default function About(){
  return (
    <article>
      <h1>關於 Nori</h1>
      <p>創辦人 <b>蔡梓掦</b> 2019 年於創立，從實驗室葡萄釀酒起家，現以招牌冰釀茶酒聞名。</p>
      <p>地址：鴨嘴道135號中央大樓3507室 · 團隊 50 人 · 產品 12 款</p>
    </article>
  );
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/pages/OrderManagement.jsx",{content:`import OrderTable from '../components/OrderTable.jsx';
import { useEffect,useState } from 'react';
export default function OrderManagement(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ fetch('/api/admin/orders').then(r=>r.json()).then(setOrders); },[]);
  return <OrderTable orders={orders}/>;
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/pages/Payment.jsx",{content:`import PaymentForm from '../components/PaymentForm.jsx';
export default function Payment({order}){
  return <PaymentForm order={order} methods={["BANK_TRANSFER","ABPAY","LALAPAY"]}/>;
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/components/PlanCard.jsx",{content:`export default function PlanCard({plan}){
  return <div className="card"><h3>{plan.name}</h3><p>{plan.country}</p><a href={"/plans/"+plan.id}>查看詳情</a></div>;
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/components/PriceTable.jsx",{content:`export default function PriceTable({vip}){
  const rows=[1,2,3,4,5].map(lv=> ({lv, rate: [90,85,80,75,70][lv-1]}));
  return <table><thead><tr><th>VIP</th><th>折扣</th></tr></thead><tbody>{rows.map(r=> <tr key={r.lv}><td>{r.lv}</td><td>{r.rate}%</td></tr>)}</tbody></table>;
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/components/PaymentForm.jsx",{content:`export default function PaymentForm({order, methods}){
  return (
    <form>
      <select>{methods.map(m=> <option key={m}>{m}</option>)}</select>
      <p>支援：銀行匯款 (玉山 808) / ABPay / LalaPay</p>
      <button>確認付款</button>
    </form>
  );
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/components/OrderTable.jsx",{content:`export default function OrderTable({orders}){
  return (
    <table>
      <thead><tr><th>訂單號</th><th>方案</th><th>客戶</th><th>支付方式</th><th>狀態</th><th>顧問</th></tr></thead>
      <tbody>{orders.map(o=> <tr key={o.id}><td>{o.id}</td><td>{o.drinkId}</td><td>{o.customerId}</td><td>{o.paymentMethod}</td><td>{o.status}</td><td>{o.assignedConsultant}</td></tr>)}</tbody>
    </table>
  );
}
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/src/api/client.js",{content:`// 前後端 API 客戶端
const BASE = import.meta.env.VITE_API_BASE || '/api';
export const api = {
  plans: () => fetch(BASE+'/plans').then(r=>r.json()),
  price: (body) => fetch(BASE+'/price/calc',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json()),
  orders: (q) => fetch(BASE+'/admin/orders?'+new URLSearchParams(q)).then(r=>r.json()),
  pay: (body) => fetch(BASE+'/pay/settle',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json())
};
`,meta:{lang:"javascript"}}),x("/customer-portal/src/frontend/package.json",{content:JSON.stringify({name:"nori-frontend",version:"3.5.0",dependencies:{react:"^18.2.0","react-router-dom":"^6.22.0"}},null,2),meta:{lang:"json"}}),x("/customer-portal/src/admin/OrderManagementSystem.js",{content:`// 管理後台 — 訂單查詢系統
/** 支援：依方案 / 支付方式 / 狀態 篩選 */
export class OrderManagementSystem {
  constructor(api){ this.api=api; }
  async query({ status, drinkId, paymentMethod }){
    const params = new URLSearchParams({ ...(status&&{status}), ...(drinkId&&{drinkId}), ...(paymentMethod&&{paymentMethod}) });
    return fetch('/api/admin/orders?'+params).then(r=>r.json());
  }
  async exportCsv(){ return fetch('/api/admin/orders/export').then(r=>r.text()); }
}
`,meta:{lang:"javascript"}}),x("/customer-portal/scripts/reconcile.py",{content:`# reconcile.py - 對帳腳本 (Python)
# Nori：對應飲品訂單與支付流水對帳
import sqlite3

def reconcile(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT code, SUM(amount) FROM orders GROUP BY code")
    for code, total in cur.fetchall():
        print(f"{code}: {total}")
    cur.execute("SELECT paymentMethod, COUNT(*) FROM orders GROUP BY paymentMethod")
    print("--- payment breakdown ---")
    for m,cnt in cur.fetchall():
        print(f"{m}: {cnt}")

if __name__ == '__main__':
    reconcile('ledger.db')
`,meta:{lang:"python"}}),x("/customer-portal/scripts/migrate.js",{content:`// migrate.js - 執行 db/migration
import fs from 'fs';
console.log('apply migration', fs.readdirSync('src/main/resources/db/migration'));
`,meta:{lang:"javascript"}}),x("/customer-portal/src/main/resources/db/migration/V1__init.sql",{content:`-- Nori 初始建表 2019
CREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, vip_level INT, plan_id TEXT);
CREATE TABLE orders (id TEXT PRIMARY KEY, customer_id TEXT, plan_id TEXT, total_price REAL, payment_method TEXT, status TEXT, consultant TEXT);
CREATE TABLE payments (tx_id TEXT PRIMARY KEY, order_id TEXT, method TEXT, amount REAL, status TEXT);
`,meta:{lang:"sql"}}),x("/customer-portal/src/main/resources/db/migration/V2__seed_plans.sql",{content:`INSERT INTO customers VALUES ('CUS-2019-001','Sawyer (創辦人測試)','5','plan-a');
INSERT INTO orders VALUES ('ORD-2024-1001','CUS-2019-001','plan-a',918000,'BANK_TRANSFER','PAID','Sawyer');
INSERT INTO orders VALUES ('ORD-2024-1002','CUS-2024-042','plan-b',1400000,'ABPAY','PENDING','Maggie');
INSERT INTO orders VALUES ('ORD-2024-1003','CUS-2024-117','plan-c',802400,'LALAPAY','APPROVED','Sawyer');
`,meta:{lang:"sql"}}),x("/customer-portal/docs/ARCHITECTURE.md",{content:`# Nori 官網開發結構

## 主要功能頁
- 商品查詢
- 合作聯繫
- 試算費用 (含服務費 + VIP 折扣)
- 用家感想
- 關於我們

## 支付方式
銀行匯款 銀行轉賬、ABPay、LalaPay

`,meta:{lang:"markdown"}}),x("/customer-portal/src/main/resources/application.properties",{content:`server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/nori_drinks
spring.datasource.username=nori
# ssh: ssh ops@203.0.113.45 -p 2222 
`,meta:{lang:"properties"}}),x("/intranet/README.md",{content:`# Nori 內網檔案系統 (Intranet File System)

> Nori 飲品供應 — 內部檔案總覽
> 本內網整合公司營運文件，請由左側目錄瀏覽。

## 目錄結構
- /intranet/company_public/ — 公司公開資訊（名稱、Logo、大樓企業名錄）
- /intranet/client_info/ — 客戶資料（🔒 權限管制，遊戲內無需存取）
- /intranet/business_plans/ — 業務流程完整結構
- /intranet/staff/ — 員工名錄（50 人，Sawyer #001 至 Casey #048）
- 內網僅供飲品供應相關文件瀏覽

> 提示：在內網搜尋框輸入關鍵字可搜尋內網檔案。客戶資料夾受保護，點擊將顯示權限提示。
`,meta:{lang:"markdown"}}),x("/intranet/company_public/公司簡介.md",{content:`# Nori 飲品供應 — 公司簡介

**公司全稱**：Nori Limited（Nori Drinks Supply Limited）
**創辦人**：Sawyer
**成立時間**：2019 年 5 月
**總部地址**：鴨嘴道135號中央大樓3507室
**統編／註冊編號**：12345678
**團隊規模**：50 人（截至 2024-09-02）
**產品數量**：12 款
**最暢銷**：冰釀茶酒（招牌）

## 使命
用一杯冰釀茶酒，連結人與風味。

## 核心產品
- 招牌冰釀茶酒 — 最暢銷（高山茶＋葡萄冰釀）
- 葡萄釀造酒 — 實驗室研發（自釀葡萄）
- 季節水果茶 — 當季水果調配
- 其他 9 款季節限定

## 團隊
- 營運研發：實驗室開發新飲品（含葡萄釀酒）
- 原物料：管理葡萄、茶葉等
- 業務：向企業／組織銷售
- 配送：直送客戶
- 資訊 (IT)：維運官網與內部系統

## 聯絡
- 電話：+852 2987 6543
- 電郵：hello@nori-drinks.example
- 網站：https://nori.example
- 內網：https://intranet.nori.example（本系統）
`,meta:{lang:"markdown"}}),x("/intranet/company_public/企業識別_Logo設計.md",{content:`# Nori 企業識別 — Logo 設計規範

## 主 Logo
- 字標：Nori（圓潤無襯線，字重 600）＋ 副標 Drinks Supply（字重 300，大寫間距 0.12em）
- 圖標：抽象「冰杯」＋「茶葉」剪影，象徵冰釀茶酒。
- 標準色：
  - 深海藍 #0e3a5c（主色，呼應桌布）
  - 暖灰 #9aa0a6（輔助）
  - 點綴橙 #ff8c42（CTA）

## Logo 變體
- 橫式：圖標左、字標右，適用官網頁首
- 直式：圖標上、字標下，適用名片與文件封面
- 單色：全白／全黑，適用浮水印

## 禁止事項
- 不得拉伸、旋轉、加陰影
- 最小尺寸：橫式寬度 ≥ 120px

## 檔案
- logo-nori.svg（向量主檔）
- logo-nori-horizontal.png（橫式 PNG, 1024×256）
- logo-nori-icon.png（方形 Icon, 512×512）

> 設計理念：以「摺紙鳥」摺痕隱含地圖折線，呼應飲品風味路徑。
`,meta:{lang:"markdown"}}),x("/intranet/company_public/logo-nori.svg",{content:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="#0e3a5c"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="white">Nori</text><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="7" letter-spacing="0.18em" fill="#9aa0a6">IMMIGRATION CONSULTING</text></svg>',meta:{lang:"html"}}),x("/intranet/company_public/上市公司名錄.md",{content:`# 上市公司名錄

> 上市公司一覽（企業編號 100–150，共 51 間，已按企業編號升冪排序）

| 企業編號 | 企業名稱 | 地址 |
|---|---|---|
| 100 | 晨曦智聯股份有限公司 |  |
| 101 | 雲臻建設股份有限公司 |  |
| 102 | 星澄創業有限公司 |  |
| 103 | 曜輝實業集團有限公司 |  |
| 104 | 霖海發展有限公司 |  |
| 105 | 璇玥地產有限公司 |  |
| 106 | 澄光置業有限公司 |  |
| 107 | 昀澤控股股份有限公司 |  |
| 108 | 景瀚建設有限公司 |  |
| 109 | 煦豐有限公司 |  |
| 110 | 奕達集團有限公司 |  |
| 111 | 承翰興業有限公司 |  |
| 112 | 昱隆地產有限公司 |  |
| 113 | 鈞鴻地產發展有限公司 |  |
| 114 | 承宇集團有限公司 |  |
| 115 | 耀華電力控股有限公司 |  |
| 116 | 泓鑫電力投資有限公司 |  |
| 117 | 睿聯置業基金 |  |
| 118 | 寰宇保險控股有限公司 |  |
| 119 | 匯澤控股有限公司 |  |
| 120 | 華訊移動有限公司 |  |
| 121 | 迅騰控股有限公司 |  |
| 122 | 雲淘集團控股有限公司 |  |
| 123 | 星米網絡科技集團 |  |
| 124 | 食達網絡有限公司 |  |
| 125 | 晨曜創投有限公司 |  |
| 126 | 承宇物流股份有限公司 |  |
| 127 | 曦誠會計師事務所 |  |
| 128 | 睿見法律事務所 |  |
| 129 | 曜辰文創有限公司 |  |
| 130 | 安捷搬運有限公司 |  |
| 131 | 智聯科技股份有限公司 |  |
| 132 | 優宅物業管理有限公司 |  |
| 133 | 明曜顧問有限公司 |  |
| 134 | Nori Limited（Nori 飲品供應） |  |
| 135 | 晶東集團股份有限公司 |  |
| 136 | 博度集團股份有限公司 |  |
| 137 | 創易網絡有限公司 |  |
| 138 | 迅手科技有限公司 |  |
| 139 | 嗶哩星創有限公司 |  |
| 140 | 蔚藍動力集團 |  |
| 141 | 遠想汽車有限公司 |  |
| 142 | 曉鵬汽車有限公司 |  |
| 143 | 亞迪電子（國際）有限公司 |  |
| 144 | 順宇光學科技（集團）有限公司 |  |
| 145 | 瑞鳴科技控股有限公司 |  |
| 146 | 創鋒實業有限公司 |  |
| 147 | 安越體育用品有限公司 |  |
| 148 | 立寧體育有限公司 |  |
| 149 | 牧牛乳業有限公司 |  |
| 150 | 康膳食品控股有限公司 |  |

> 備註：本名錄為上市企業公開資訊，已按企業編號升冪排序，僅供內部參考。`,meta:{lang:"markdown"}}),x("/intranet/company_public/上市公司名錄.csv",{content:`企業編號,企業名稱,地址
100,晨曦智聯股份有限公司,
101,雲臻建設股份有限公司,
102,星澄創業有限公司,
103,曜輝實業集團有限公司,
104,霖海發展有限公司,
105,璇玥地產有限公司,
106,澄光置業有限公司,
107,昀澤控股股份有限公司,
108,景瀚建設有限公司,
109,煦豐有限公司,
110,奕達集團有限公司,
111,承翰興業有限公司,
112,昱隆地產有限公司,
113,鈞鴻地產發展有限公司,
114,承宇集團有限公司,
115,耀華電力控股有限公司,
116,泓鑫電力投資有限公司,
117,睿聯置業基金,
118,寰宇保險控股有限公司,
119,匯澤控股有限公司,
120,華訊移動有限公司,
121,迅騰控股有限公司,
122,雲淘集團控股有限公司,
123,星米網絡科技集團,
124,食達網絡有限公司,
125,晨曜創投有限公司,
126,承宇物流股份有限公司,
127,曦誠會計師事務所,
128,睿見法律事務所,
129,曜辰文創有限公司,
130,安捷搬運有限公司,
131,智聯科技股份有限公司,
132,優宅物業管理有限公司,
133,明曜顧問有限公司,
134,Nori Limited（Nori 飲品供應）,
135,晶東集團股份有限公司,
136,博度集團股份有限公司,
137,創易網絡有限公司,
138,迅手科技有限公司,
139,嗶哩星創有限公司,
140,蔚藍動力集團,
141,遠想汽車有限公司,
142,曉鵬汽車有限公司,
143,亞迪電子（國際）有限公司,
144,順宇光學科技（集團）有限公司,
145,瑞鳴科技控股有限公司,
146,創鋒實業有限公司,
147,安越體育用品有限公司,
148,立寧體育有限公司,
149,牧牛乳業有限公司,
150,康膳食品控股有限公司,
`,meta:{lang:"csv"}}),x("/intranet/client_info/README.md",{content:`# 客戶資料 — 權限管制

🔒 本資料夾受保護，僅限法務與客戶經理存取。

- 內容：護照影本、合約、付款憑證、個資
- 存取需二階段驗證，遊戲內無需開啟。
- 如需測試請聯絡 Sawyer 或 系統管理員。

> 遊戲提示：此資料夾為情境佈置，請專注於 /intranet/company_public/、/intranet/business_plans/ 與 /intranet/staff/。
`,meta:{lang:"markdown",locked:!0}}),x("/intranet/client_info/客戶清單_加密.csv",{content:`客戶編號,姓名,方案,狀態,備註
CUS-2024-001,***,冰釀茶酒,處理中,加密
CUS-2024-002,***,葡萄釀造酒,處理中,加密
# 本檔案已加密，無法於內網預覽
`,meta:{lang:"csv",locked:!0}}),x("/intranet/client_info/合約範本_受保護.docx",{content:`[二進位受保護文件 — 需權限]
本文件僅供法務調閱。
`,meta:{lang:"text",locked:!0}}),x("/intranet/business_plans/業務流程_完整結構.md",{content:`# Nori 業務流程 — 完整結構

> 從研發到配送的端到端流程（2019 年版，2024 年修訂）—— 飲品供應

## 流程圖

營運研發團隊：在實驗室開發新飲品（含葡萄釀酒）
    ↓
原物料團隊：管理原材料（葡萄、茶葉等）
    ↓
業務團隊：向不同企業／組織銷售
    ↓
配送團隊：配送至客戶
    ↓
IT 團隊：維運官網與內部管理系統
    ├─ 官網吸引客戶、介紹公司
    ├─ VIP 等級與價格試算（OrderService.calculateVipPrice）
    └─ 內部系統供營運、原物料、業務、配送團隊使用
    ↓
客戶收貨 — 完成

## 各階段負責
| 階段 | 負責團隊 | 主要工作 | 交付物 |
|---|---|---|---|
| 飲品研發 | 營運研發 | 實驗室葡萄釀酒、茶葉調配、新品測試 | 研發報告、試飲樣品 |
| 原物料管理 | 原物料 | 葡萄、茶葉等採購、倉儲、品質控管 | 庫存報表、採購單 |
| 業務銷售 | 業務 | 對企業／組織銷售、報價、簽約 | 合約、訂單（Bank／ABPay／LalaPay） |
| 物流配送 | 配送 | 揀貨、打包、冷鏈或常溫配送 | 配送單、簽收單 |
| 官網與系統 | 資訊 (IT) | 官網維運、VIP 價格計算、內部管理系統 | 官網、OrderManagementSystem |

## 系統對應
- 前台：/src/frontend/src/pages/PriceCalculator.jsx 價格試算（IT 團隊）
- 後台：/src/admin/OrderManagementSystem.js 訂單管理（供業務、配送使用）
- 支付：/src/payment/gateway.js（Bank Transfer／ABPay／LalaPay）
- 官網：/src/main/resources/templates/index.html 介紹公司與飲品
`,meta:{lang:"markdown"}}),x("/intranet/business_plans/方案對照表.csv",{content:`飲品,產地,賞味期限,基礎價格,說明,適合對象
招牌冰釀茶酒,高山茶＋葡萄,180 天,32,HKD 最暢銷,企業宴會
葡萄釀造酒,實驗室自釀,365 天,85,果香飽滿,禮盒
季節水果茶,當季水果,90 天,28,清爽季節限定,日常飲用
`,meta:{lang:"csv"}}),x("/intranet/business_plans/2023_Q1_財務報告.md",{content:`# Nori 2023 年第一季財務報告

> 2023-01 至 2023-03 營運概況

## 營收概況

| 月份 | 營收 (HKD) | 支出 (HKD) | 淨利 (HKD) |
|------|-----------|-----------|-----------|
| 2023-01 | 125,000 | 180,000 | -55,000 |
| 2023-02 | 98,000 | 165,000 | -67,000 |
| 2023-03 | 110,000 | 172,000 | -62,000 |

## 現金流狀況

- 期初現金：HKD 450,000
- 期末現金：HKD 266,000
- **每月平均虧損：HKD 61,333**
- **現金流僅剩約 4 個月**

## 債務

- 銀行貸款：HKD 800,000（2024-06 到期）
- 應付帳款：HKD 120,000

## 備註

本季持續虧損，主要原因為：
1. 原物料成本上升（葡萄、茶葉供應不穩）
2. 市場競爭激烈，定價壓力大
3. 團隊擴張導致人力成本增加

**建議：若持續虧損，需在 2023 年 Q3 前尋求外部資金注入，否則將面臨現金流斷裂風險。**

> 本報告僅供內部參考，請勿外傳。
> 製表人：Taylor（行政及人力資源主管）
> 審核人：Sawyer（創辦人／執行長）
`,meta:{lang:"markdown"}}),x("/intranet/staff/員工名錄.csv",{content:`編號,姓名,職稱,到職日,所屬團隊,狀態
001,Sawyer,創辦人／執行長,2019-05-01,管理,在職
002,Taylor,行政及人力資源主管,2019-06-10,人力,在職
003,Aiko,業務經理,2019-07-21,業務,在職
004,Morgan,倉配主管,2019-08-30,物流配送,在職
005,Quinn,採購專員,2019-10-10,原物料,在職
006,Chris Huang,資深原物料專員,2019-11-19,原物料,在職
007,Ivy,調配師,2019-12-30,營運研發,在職
008,Avery,實驗室主管,2020-02-08,營運研發,在職
009,Nathan,飲品研發師,2020-03-20,營運研發,在職
010,盧曉琪,資深原物料專員,2020-04-29,原物料,在職
011,Alex,客戶經理,2020-06-09,業務,在職
012,Hugo,客戶經理,2020-07-19,業務,在職
013,周子瑜,業務專員,2020-08-29,業務,在職
014,Liam,技術總監,2020-10-08,資訊,在職
015,David Wang,釀造師,2020-11-18,營運研發,在職
016,蕭宇辰,IT 主管,2020-12-28,資訊,在職
017,林怡君,IT 主管,2021-02-06,資訊,在職
018,Leo,資深客戶經理,2021-03-19,業務,在職
019,柯孟廷,原物料管理師,2021-04-28,原物料,在職
020,Ada,資深業務,2021-06-08,業務,在職
021,Grace Liu,IT 主管,2021-07-18,資訊,在職
022,Blake,物流協調專員,2021-08-28,物流配送,在職
023,Skyler,前端工程師,2021-10-07,資訊,在職
024,賴宥甄,業務經理,2021-11-17,業務,在職
025,Nora Yeh,倉儲管理師,2021-12-27,原物料,在職
026,Iris,實驗室主管,2022-02-06,營運研發,在職
027,蘇慧玲,倉儲管理師,2022-03-18,原物料,在職
028,Parker,IT 主管,2022-04-28,資訊,在職
029,Evan,飲品研發師,2022-06-07,營運研發,在職
030,Clara,原物料管理師,2022-07-18,原物料,在職
031,戴瑋珊,客戶經理,2022-08-27,業務,在職
032,Finley,前端工程師,2022-10-07,資訊,在職
033,彭冠宇,飲品研發師,2022-11-16,營運研發,在職
034,Maggie,IT 主管,2022-12-26,資訊,在職
035,張志偉,物流專員,2023-02-05,物流配送,在職
036,Sophia,物流專員,2023-03-17,物流配送,在職
037,李俊傑,客戶經理,2023-04-27,業務,在職
038,Jamie,倉儲管理師,2023-06-06,原物料,在職
039,曾詩涵,採購專員,2023-07-17,原物料,在職
040,Ethan,飲品研發師,2023-08-26,營運研發,在職
041,Ruby,倉配主管,2023-10-06,物流配送,在職
042,何欣怡,客戶經理,2023-11-15,業務,在職
043,Jessie,系統工程師,2023-12-26,資訊,在職
044,Hayden,倉儲管理師,2024-02-04,原物料,在職
045,Riley,倉儲管理師,2024-03-16,原物料,在職
046,Kevin Chang,物流協調專員,2024-04-25,物流配送,在職
047,Mila,資深研發師,2024-06-05,營運研發,在職
048,Casey,初級開發人員,2024-07-15,資訊,在職
049,Emily Lin,技術總監,2024-08-08,資訊,在職
050,Kendall,資深客戶經理,2024-09-02,業務,在職
`,meta:{lang:"csv"}}),x("/intranet/staff/員工名錄.md",{content:`# Nori 員工名錄（50 人）

> 2019-05-01 至 2024-09-02 在職名單，依編號排序。

| 編號 | 姓名 | 職稱 | 所屬團隊 | 到職日 |
|---|---|---|---|---|
| 001 | Sawyer | 創辦人／執行長 | 管理 | 2019-05-01 |
| 002 | Taylor | 行政及人力資源主管 | 人力 | 2019-06-10 |
| 003 | Aiko | 業務經理 | 業務 | 2019-07-21 |
| 004 | Morgan | 倉配主管 | 物流配送 | 2019-08-30 |
| 005 | Quinn | 採購專員 | 原物料 | 2019-10-10 |
| 006 | Chris Huang | 資深原物料專員 | 原物料 | 2019-11-19 |
| 007 | Ivy | 調配師 | 營運研發 | 2019-12-30 |
| 008 | Avery | 實驗室主管 | 營運研發 | 2020-02-08 |
| 009 | Nathan | 飲品研發師 | 營運研發 | 2020-03-20 |
| 010 | 盧曉琪 | 資深原物料專員 | 原物料 | 2020-04-29 |
| 011 | Alex | 客戶經理 | 業務 | 2020-06-09 |
| 012 | Hugo | 客戶經理 | 業務 | 2020-07-19 |
| 013 | 周子瑜 | 業務專員 | 業務 | 2020-08-29 |
| 014 | Liam | 技術總監 | 資訊 | 2020-10-08 |
| 015 | David Wang | 釀造師 | 營運研發 | 2020-11-18 |
| 016 | 蕭宇辰 | IT 主管 | 資訊 | 2020-12-28 |
| 017 | 林怡君 | IT 主管 | 資訊 | 2021-02-06 |
| 018 | Leo | 資深客戶經理 | 業務 | 2021-03-19 |
| 019 | 柯孟廷 | 原物料管理師 | 原物料 | 2021-04-28 |
| 020 | Ada | 資深業務 | 業務 | 2021-06-08 |
| 021 | Grace Liu | IT 主管 | 資訊 | 2021-07-18 |
| 022 | Blake | 物流協調專員 | 物流配送 | 2021-08-28 |
| 023 | Skyler | 前端工程師 | 資訊 | 2021-10-07 |
| 024 | 賴宥甄 | 業務經理 | 業務 | 2021-11-17 |
| 025 | Nora Yeh | 倉儲管理師 | 原物料 | 2021-12-27 |
| 026 | Iris | 實驗室主管 | 營運研發 | 2022-02-06 |
| 027 | 蘇慧玲 | 倉儲管理師 | 原物料 | 2022-03-18 |
| 028 | Parker | IT 主管 | 資訊 | 2022-04-28 |
| 029 | Evan | 飲品研發師 | 營運研發 | 2022-06-07 |
| 030 | Clara | 原物料管理師 | 原物料 | 2022-07-18 |
| 031 | 戴瑋珊 | 客戶經理 | 業務 | 2022-08-27 |
| 032 | Finley | 前端工程師 | 資訊 | 2022-10-07 |
| 033 | 彭冠宇 | 飲品研發師 | 營運研發 | 2022-11-16 |
| 034 | Maggie | IT 主管 | 資訊 | 2022-12-26 |
| 035 | 張志偉 | 物流專員 | 物流配送 | 2023-02-05 |
| 036 | Sophia | 物流專員 | 物流配送 | 2023-03-17 |
| 037 | 李俊傑 | 客戶經理 | 業務 | 2023-04-27 |
| 038 | Jamie | 倉儲管理師 | 原物料 | 2023-06-06 |
| 039 | 曾詩涵 | 採購專員 | 原物料 | 2023-07-17 |
| 040 | Ethan | 飲品研發師 | 營運研發 | 2023-08-26 |
| 041 | Ruby | 倉配主管 | 物流配送 | 2023-10-06 |
| 042 | 何欣怡 | 客戶經理 | 業務 | 2023-11-15 |
| 043 | Jessie | 系統工程師 | 資訊 | 2023-12-26 |
| 044 | Hayden | 倉儲管理師 | 原物料 | 2024-02-04 |
| 045 | Riley | 倉儲管理師 | 原物料 | 2024-03-16 |
| 046 | Kevin Chang | 物流協調專員 | 物流配送 | 2024-04-25 |
| 047 | Mila | 資深研發師 | 營運研發 | 2024-06-05 |
| 048 | Casey | 初級開發人員 | 資訊 | 2024-07-15 |
| 049 | Emily Lin | 技術總監 | 資訊 | 2024-08-08 |
| 050 | Kendall | 資深客戶經理 | 業務 | 2024-09-02 |

> 備註：到職日介於 2019-05-01 至 2024-09-02
`,meta:{lang:"markdown"}}),x("/internal/portal",{hidden:!1,content:`## INTERNAL PORTAL - Nori 內部審核 

狀態：需 X-Internal-Token (nori-drinks-token-2024)

庫存/案件:
- 飲品訂單: 90 筆
- 待出貨: 12 筆
- 已完成: 78 筆

匯出: /internal/portal/export

備註： Nori 2019 Sawyer 創立 — 內部稽核
`,meta:{portal:!0}}),x("/internal/portal/export",{hidden:!1,content:"SQLite export endpoint - 需要 portalAuth 通過 (Nori 訂單匯出)",meta:{portal:!0}})}function Zn(){me("/darknet/全結構圖/drug-route-graph.md",{content:`# 全結構圖

FredyArc → Nori 實驗室 → 葡萄/茶葉原料 → 銷售（企業客戶）→ 配送（每趟公開物流綁一次秘密包裹）→ IT 內網

節點 Drug Code: COCOA=可卡因, BEAN=海洛因, LEAF=大麻, CRYSTAL=冰毒

- 葡萄對應 COCOA
- 茶葉對應 BEAN
- alchol 對應 LEAF
- 玻璃瓶 對應 CRYSTAL
- 紙箱 通用`,meta:{lang:"markdown"}}),me("/darknet/交易列表/drug-transactions.csv",{content:`datetime,location,client_company,traffic_used,drug_code,quantity,status
2023-11-11 09:00,鴨嘴道135號,鴻海創投,grape,COCOA,420,已送達
2023-11-15 14:30,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達
2023-11-22 10:00,新加坡濱海灣,海外客戶-SG-01,清酒,LEAF,300,運輸中
2023-12-05 16:00,東京港區,海外客戶-JP-02,玻璃瓶,CRYSTAL,75,已送達
2023-12-19 11:20,鴨嘴道135號,誠信會計師事務所,紙箱,COCOA,200,待發
2024-01-08 09:30,曼谷素坤逸,海外客戶-TH-03,紅葡萄,BEAN,150,已送達
`,meta:{lang:"csv"}}),me("/darknet/合作公司列表/companies.md",{content:`# 合作公司列表及聯絡方式

| 公司 | 地區 | 聯絡人 | 電話 | 備註 |
|---|---|---|---|---|
| 鴻海創投有限公司 | 本地 | 陳先生 | +852 9123 4567 | 正當合作掩護 |
| 環宇物流股份有限公司 | 本地 | 林小姐 | +852 9234 5678 | 物流掩護 |
| 海外客戶-SG-01 | 新加坡 | Mr. Lee | +65 8123 4567 | 虛構海外 |
| 海外客戶-JP-02 | 日本 | 佐藤 | +81 90-1234-5678 | 虛構海外 |
| 海外客戶-TH-03 | 泰國 | Khun Som | +66 81-234-5678 | 虛構海外 |
| FredyArc | 海外組織 | Fredy | +1 415-555-0100 | 毒品來源 |`,meta:{lang:"markdown"}}),me("/darknet/流量/drug-traffic.csv",{content:`datetime,location,client_company,traffic_used,drug_code,quantity,status
2023-11-11 09:00,鴨嘴道135號,鴻海創投,紅葡萄,COCOA,420,已送達
2023-11-18 13:00,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達
2023-12-02 10:30,洛杉磯,海外客戶-US-04,紙箱,LEAF,300,已送達
2023-12-20 15:00,鴨嘴道135號,星辰文創,alchol,CRYSTAL,75,待發
2024-01-15 11:00,首爾江南,海外客戶-KR-05,玻璃瓶,COCOA,250,運輸中
2024-02-10 14:00,鴨嘴道135號,安心搬運,紙箱,BEAN,180,已送達
2024-03-05 09:20,香港中環,海外客戶-HK-06,紅葡萄,LEAF,320,已送達
2024-04-12 16:40,柏林,海外客戶-DE-07,茶葉,CRYSTAL,60,已送達
`,meta:{lang:"csv"}}),me("/darknet/月結單/monthly-2023-12.csv",{content:`month,from,to,amount,type,note
2023-12,FredyArc,Nori,125000,收入,合作資金
2023-12,FredyArc,Nori,85000,收入,企業合作
2023-12,Nori,Anonymous,320,支出,小額
`,meta:{lang:"csv"}}),me("/darknet/月結單/monthly-2024-01.csv",{content:`month,from,to,amount,type,note
2024-01,FredyArc,Nori,320000,收入,季度分潤
2024-01,Nori,Anonymous,750,支出,
`,meta:{lang:"csv"}}),me("/darknet/月結單/monthly-2024-02.csv",{content:`month,from,to,amount,type,note
2024-02,FredyArc,Nori,450000,收入,
2024-02,FredyArc,Nori,120000,收入,
2024-02,Nori,Anonymous,420,支出,
`,meta:{lang:"csv"}}),me("/darknet/Sawyer支出/sawyer_expenses.csv",{content:`日期,項目,金額(HKD),備註
2023-07-15,Consulting fee to FredyArc,50000,月度顧問費
2023-08-15,Consulting fee to FredyArc,50000,月度顧問費
2023-09-15,Consulting fee to FredyArc,50000,月度顧問費
2023-10-15,Consulting fee to FredyArc,50000,月度顧問費
2023-11-15,Consulting fee to FredyArc,50000,月度顧問費
2023-12-15,Consulting fee to FredyArc,50000,月度顧問費
2024-01-15,Consulting fee to FredyArc,50000,月度顧問費
2024-02-15,Consulting fee to FredyArc,50000,月度顧問費
2024-03-15,Consulting fee to FredyArc,50000,月度顧問費
2024-04-15,Consulting fee to FredyArc,50000,月度顧問費
2024-05-15,Consulting fee to FredyArc,50000,月度顧問費
2024-06-15,Consulting fee to FredyArc,50000,月度顧問費
`,meta:{lang:"csv"}}),me("/darknet/出差紀錄/travel_records.csv",{content:`日期,目的地,行程目的,天數,同行人員
2023-07-20,新加坡,業務會議,3,Fredy
2023-08-10,東京,供應商考察,4,
2023-09-05,曼谷,業務拓展,3,Fredy
2023-10-12,新加坡,客戶會議,2,
2023-11-18,東京,年度總結,3,Fredy
2023-12-22,曼谷,節日拜訪,2,
2024-01-15,新加坡,季度會議,3,Fredy
2024-02-20,東京,新品發表,4,
2024-03-10,曼谷,業務會議,3,Fredy
2024-04-05,新加坡,客戶維護,2,
`,meta:{lang:"csv"}}),me("/darknet/會議紀錄/meeting_minutes.md",{content:`# Nori × FredyArc 定期會議紀錄

> 請勿外傳 — 僅限內部查閱

## 2023-07-15 會議

- **出席**：Sawyer, Fredy
- **議題**：合作架構確認
- **決議**：FredyArc 每月支付顧問費 HKD 50,000，Nori 提供物流配送支援
- **備註**：Fredy 強調「合作方式要低調，不要引起外界注意」

## 2023-09-05 會議

- **出席**：Sawyer, Fredy
- **議題**：配送路線優化
- **決議**：新增新加坡、東京、曼谷站點，由 Nori 團隊負責本地配送
- **備註**：Fredy 表示「這些站點的貨物要與一般飲品分開處理」

## 2023-11-18 會議

- **出席**：Sawyer, Fredy
- **議題**：年度總結與展望
- **決議**：2024 年擴大合作規模，預計營收增長 200%
- **備註**：Fredy 表示「明年會有更多資源投入，但要確保所有流程都符合規範」

## 2024-01-15 會議

- **出席**：Sawyer, Fredy
- **議題**：季度檢討
- **決議**：調整配送頻率，增加深夜時段運輸
- **備註**：Sawyer 表示「深夜配送會增加成本，但 Fredy 說這是必要的」

## 2024-03-10 會議

- **出席**：Sawyer, Fredy
- **議題**：風險管理
- **決議**：建立「備用方案」，若發生異常情況立即暫停合作
- **備註**：Fredy 表示「安全第一，不能讓任何人發現我們的合作模式」

> 下次会议：2024-05-15（待確認）
`,meta:{lang:"markdown"}})}Zn();Xn();var k={registerFile:x,getFile:an,listFiles:qn,buildTree:zn,readFile:Un,exists:Wn,searchContent:Gn,canAccessPortal:Yn,tryAccessPortal:Kn,bypassPortalAuth:Qn,registerDarkFile:me,getDarkFile:tn,listDarkFiles:Hn,buildDarkTree:Vn,readDarkFile:Rn,registerLegacyRoute:en,getLegacyRoute:Fn,listLegacyRoutes:Nn,findLegacyRoute:On,internalPathDomain:Za},ei=[{id:"ch0_vip_fix",chapter:0,check:()=>l.hasFlag("ch0_vip_fixed"),reward:{},title:"修正 VIP 折扣計算 (INV-2024-0042)"},{id:"ch1_system_alert",chapter:1,check:()=>l.hasFlag("ch1_system_down"),reward:{evidence:{id:"e001",title:"INV-2024-0043 系統警報",chapter:1,type:"anomaly"}},title:"觸發系統警報 (INV-2024-0043)"},{id:"ch1_feng_shui_tree",chapter:1,check:()=>l.hasFlag("ch1_tree_seen"),reward:{evidence:{id:"e002",title:"老闆的風水樹",chapter:1,type:"behavior"}},title:"發現老闆的風水樹"},{id:"ch2_accident_news",chapter:2,check:()=>l.get("searchHistory")?.some(e=>e.includes("Sawyer")||e.includes("Choi")||e.includes("車禍")),reward:{evidence:{id:"e003",title:"車禍新聞 — 父母雙亡",chapter:2,type:"news"}},title:"搜尋到車禍新聞"},{id:"ch2_insurance_blog",chapter:2,check:()=>l.get("discoveredFiles")?.includes("https://sawyer-blog.example/2012-07-07")||l.get("searchHistory")?.some(e=>e.includes("保險")),reward:{evidence:{id:"e004",title:"保險受益人 Blog",chapter:2,type:"blog"}},title:"發現保險受益人文章"},{id:"ch2_lottery_lie",chapter:2,check:()=>l.hasFlag("lottery_lie_seen"),reward:{evidence:{id:"e005",title:"六合彩謊言",chapter:2,type:"lie"}},title:"發現六合彩謊言紀錄"},{id:"ch2_dark_blog",chapter:2,check:()=>l.get("discoveredFiles")?.includes("https://sawyer-blog.example/2023-12-20"),reward:{evidence:{id:"e006",title:"Sawyer 暗示文字",chapter:2,type:"blog"}},title:"發現 2023-12-20 Blog"},{id:"ch3_git_secret",chapter:3,check:()=>l.hasFlag("git_secret_found"),reward:{evidence:{id:"e007",title:"Git 刪除的 secret path",chapter:3,type:"code"}},title:"在 Git 歷史找到刪除的 secret path"},{id:"ch3_darknet_url",chapter:3,check:()=>l.hasFlag("dark_entered")||l.hasFlag("hidden_portal_accessed"),reward:{evidence:{id:"e008",title:"暗網入口 URL",chapter:3,type:"portal"}},title:"找到暗網完整入口"},{id:"ch4_drug_transactions",chapter:4,check:()=>l.hasFlag("ch4_all_opened")||l.get("discoveredFiles")?.some(e=>e.includes("/darknet/")),reward:{evidence:{id:"e009",title:"毒品交易紀錄",chapter:4,type:"darknet"}},title:"開啟毒品交易列表"},{id:"ch4_drug_route",chapter:4,check:()=>l.hasFlag("ch4_all_opened")||l.get("discoveredFiles")?.some(e=>e.includes("drug-route")),reward:{evidence:{id:"e010",title:"毒品結構圖",chapter:4,type:"darknet"}},title:"開啟毒品結構圖"},{id:"ch4_sawyer_expenses",chapter:4,check:()=>l.hasFlag("ch4_all_opened")||l.get("discoveredFiles")?.some(e=>e.includes("sawyer_expenses")),reward:{evidence:{id:"e011",title:"Sawyer 個人支出",chapter:4,type:"darknet"}},title:"發現 Sawyer 與 FredyArc 金流"},{id:"ch4_travel_records",chapter:4,check:()=>l.hasFlag("ch4_all_opened")||l.get("discoveredFiles")?.some(e=>e.includes("travel_records")),reward:{evidence:{id:"e012",title:"Travel 紀錄",chapter:4,type:"darknet"}},title:"發現 Sawyer 多次前往毒品路線城市"},{id:"ch4_meeting_minutes",chapter:4,check:()=>l.hasFlag("ch4_all_opened")||l.get("discoveredFiles")?.some(e=>e.includes("meeting_minutes")),reward:{evidence:{id:"e013",title:"Sawyer × Fredy 會議紀錄",chapter:4,type:"darknet"}},title:"發現定期會議紀錄"},{id:"ch5_choose_ending",chapter:5,check:()=>(l.get("endings")||[]).length>0,reward:{},title:"選擇結局"}];function nt(){for(const t of ei)l.hasFlag(`puzzle:${t.id}`)||t.check()&&(l.setFlag(`puzzle:${t.id}`,!0),t.reward?.evidence&&l.addEvidence(t.reward.evidence),t.reward?.unlock&&t.reward.unlock.forEach(a=>l.unlockInterface(a)),W.emit("puzzle:solved",t));let e=0;l.hasFlag("ch0_vip_fixed")&&(e=1),l.hasFlag("ch1_revert_done")&&(e=2),(l.hasFlag("dark_entered")||l.hasFlag("hidden_portal_accessed"))&&(e=3),l.hasFlag("ch4_all_opened")&&(e=4),(l.get("endings")||[]).length>0&&(e=5),e!==l.get("currentChapter")&&(l.set("currentChapter",e),W.emit("chapter:changed",e))}var ti=null;function ai(){W.on("change",nt),W.on("vfs:read",nt),W.on("portal:discovered",nt),W.on("portal:bypassed",nt),ti=setInterval(nt,800),nt()}var La={"zh-TW":{"app.title":"聽日辭職","app.subtitle":"編程人生模擬 · 離線 ARG","dock.vscode":"Vizual Studio Code","dock.intranet":"內網","dock.jira":"Jiua","dock.whatsapp":"WhatUp","dock.search":"Search","dock.notebook":"筆記本","dock.settings":"設定","settings.theme":"主題","settings.language":"語言","settings.export":"匯出存檔","settings.import":"匯入存檔","settings.reset":"重置進度","toast.saved":"已儲存","toast.evidence":"發現新證據","toast.unlocked":"解鎖新介面"},en:{"app.title":"聽日辭職","app.subtitle":"Dev Life Sim · Offline ARG","dock.vscode":"Vizual Studio Code","dock.intranet":"Intranet","dock.jira":"Jiua","dock.whatsapp":"WhatUp","dock.search":"Search","dock.notebook":"Notebook","dock.settings":"Settings","settings.theme":"Theme","settings.language":"Language","settings.export":"Export Save","settings.import":"Import Save","settings.reset":"Reset Progress","toast.saved":"Saved","toast.evidence":"New evidence","toast.unlocked":"Interface unlocked"}};function he(e){const t=l.get("settings.language")||"zh-TW";return La[t]?.[e]??La["zh-TW"][e]??e}var re=ua({renderDock:()=>Be,setActiveView:()=>nn,setDockVisible:()=>si});function Be({onSwitch:e,onOpenSettings:t,onOpenNotebook:a,t:i}){const n=document.getElementById("dock");if(!n)return;function s(p){return p==="email"?l.hasFlag("ch5_triggered"):!0}const r=localStorage.getItem("cc_active_view")||"vscode",d={vscode:"/arg-game-it-company-secret/icon/vizual-studio-code.svg",intranet:"/arg-game-it-company-secret/icon/file-system.svg",jira:"/arg-game-it-company-secret/icon/jiua.svg",whatsapp:"/arg-game-it-company-secret/icon/whatsup.svg",search:"/arg-game-it-company-secret/icon/browser.svg",email:"/arg-game-it-company-secret/icon/mail.svg"},o={notebook:"/arg-game-it-company-secret/icon/notepad.png"};function c(p,u,v){const h=!s(p),b=r===p?"active":"",A=d[p];let P;return A&&A.startsWith("/icon/")?P=`<img class="taskbar__app-icon-img" src="${A}" alt="${v}" width="22" height="22" loading="eager" />`:A&&A.startsWith("fa-")?p==="jira"?P=`<i class="${A}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(19,91,205,1);--fa-secondary-color:rgba(19,91,205,0.4);color:rgba(19,91,205,1)"></i>`:p==="vscode"?P=`<i class="${A}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(87,165,229,1);--fa-secondary-color:rgba(87,165,229,0.4);color:rgba(87,165,229,1)"></i>`:p==="whatsapp"?P=`<i class="${A}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(0,203,90,1);--fa-secondary-color:rgba(0,203,90,0.4);color:rgba(0,203,90,1)"></i>`:P=`<i class="${A}" aria-hidden="true" style="font-size:22px;line-height:1;color:currentColor"></i>`:A?P=`<img class="taskbar__app-icon-img" src="${A}" alt="${v}" width="22" height="22" loading="eager" />`:P=`<span class="taskbar__app-icon" aria-hidden="true">${u}</span>`,`<button class="taskbar__app ${b}" data-view="${p}" ${h?'disabled title="尚未解鎖"':`title="${v}"`}>
      ${P}
      <span class="taskbar__app-dot"></span>
    </button>`}function m(p,u,v){const h=o[p];return`<button class="taskbar__action" data-action="${p}" title="${v}">${h?`<img class="taskbar__app-icon-img" src="${h}" alt="${v}" width="20" height="20" loading="eager" />`:`<span aria-hidden="true">${u}</span>`}</button>`}n.innerHTML=`
    <div class="taskbar__left">
      <div class="taskbar__weather" title="天氣">
        <span class="taskbar__weather-icon">☀️</span>
        <span class="taskbar__weather-text">
          <span class="taskbar__weather-temp">28°C</span>
          <span class="taskbar__weather-desc">晴時多雲</span>
        </span>
      </div>
    </div>

    <div class="taskbar__center">
      <button class="taskbar__start" aria-label="Start" title="開始">
        <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M11.5 11.5H20.5V20.5H11.5V11.5Z" fill="#00A4EF"/>
          <path d="M2.5 11.5H11.5V20.5H2.5V11.5Z" fill="#0078D4"/>
          <path d="M11.5 2.5H20.5V11.5H11.5V2.5Z" fill="#FFB900"/>
          <path d="M2.5 2.5H11.5V11.5H2.5V2.5Z" fill="#F25022"/>
        </svg>
      </button>

      <div class="taskbar__search" role="search" aria-label="Search" aria-disabled="true">
        <span aria-hidden="true">🔍</span>
        <span>搜尋</span>
      </div>

      <div class="taskbar__apps" role="toolbar" aria-label="Apps">
        ${c("vscode","🧩",i("dock.vscode"))}
        ${c("whatsapp","💬",i("dock.whatsapp"))}
        ${c("jira","📋",i("dock.jira"))}
        ${c("search","🔍",i("dock.search"))}
        ${c("intranet","🏢",i("dock.intranet"))}
        ${s("email")?c("email","✉️","Email"):""}
        <div class="taskbar__sep"></div>
        ${m("notebook","📒",i("dock.notebook"))}
        <button class="taskbar__action" data-action="settings" title="${i("dock.settings")}">
          <span aria-hidden="true">⚙️</span>
        </button>
      </div>
    </div>

    <div class="taskbar__right">
      <div class="taskbar__tray">
        <span class="taskbar__tray-icon" title="顯示隱藏的圖示">▲</span>
        <span class="taskbar__tray-icon" title="網路">📶</span>
        <span class="taskbar__tray-icon" title="音效">🔊</span>
        <span class="taskbar__ime" title="輸入法">ENG</span>
      </div>
      <div class="taskbar__datetime" id="taskbarDatetime" title="日期與時間">
        <span class="taskbar__time" id="taskbarTime">--:-- --</span>
        <span class="taskbar__date" id="taskbarDate">----/--/--</span>
      </div>
    </div>
  `,n.querySelectorAll("[data-view]").forEach(p=>{p.addEventListener("click",()=>{if(p.dataset.view==="email"){const u=document.getElementById("mailDialog");if(u){const v=document.getElementById("mailTitle"),h=document.getElementById("mailTo");if(v&&h){const b=v.value;b==="Report"?h.value="DEA <dea@world.example>":(b==="Coperation"||b==="Resign")&&(h.value="Sawyer <sawyer@nori-drinks.example>")}u.showModal()}return}e(p.dataset.view)})}),n.querySelector('[data-action="settings"]')?.addEventListener("click",t),n.querySelector('[data-action="notebook"]')?.addEventListener("click",a),ni()}var Qt=null;function ni(){function e(){const t=new Date,a=document.getElementById("taskbarTime"),i=document.getElementById("taskbarDate");if(!a||!i)return;const n=t.toLocaleTimeString("zh-TW",{hour:"numeric",minute:"2-digit",hour12:!0}),s="2024/09/02";a.textContent=n,i.textContent=s}e(),Qt&&clearInterval(Qt),Qt=setInterval(e,6e4)}function ii(){document.querySelectorAll("dialog[open]").forEach(n=>{try{n.close()}catch{}n.style.removeProperty("display")});const e=document.getElementById("startMenu");e&&(e.style.display="none");const t=document.getElementById("intraPreview");t&&(t.style.display="none");const a=document.getElementById("darkPreview");a&&(a.style.display="none");const i=document.getElementById("waLightbox");i&&i.classList.remove("open")}function nn(e){ii(),localStorage.setItem("cc_active_view",e),document.querySelectorAll(".taskbar__app[data-view]").forEach(t=>{t.classList.toggle("active",t.dataset.view===e)}),document.querySelectorAll(".view").forEach(t=>{t.classList.toggle("active",t.id===`view-${e}`)})}function si(e){const t=document.getElementById("dock");t&&(t.style.display=e?"":"none")}function U(e,t={}){const a=document.getElementById("toasts");if(!a)return;const i=document.createElement("div");i.className="toast",i.textContent=e,t.variant==="error"&&(i.style.background="#7a1f1f"),a.appendChild(i),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(4px)",i.style.transition="all .25s",setTimeout(()=>i.remove(),260)},t.duration||2200)}function ri(e,t){const a=new Blob([t],{type:"application/json;charset=utf-8"}),i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=e,n.click(),URL.revokeObjectURL(i)}function oi(e){return new Promise((t,a)=>{const i=new FileReader;i.onload=()=>t(i.result),i.onerror=a,i.readAsText(e)})}var li={default:"/arg-game-it-company-secret/assets/data/music/Teacup Corridor (warmer).mp3",darknet:"/arg-game-it-company-secret/assets/data/music/Teacup Corridor.mp3",cooperate:"/arg-game-it-company-secret/assets/data/music/bgm_cowork.mp3",flee:"/arg-game-it-company-secret/assets/data/music/bgm_flee.mp3",fried:"/arg-game-it-company-secret/assets/data/music/bgm_fried.mp3",report:"/arg-game-it-company-secret/assets/data/music/bgm_report.mp3",resign:"/arg-game-it-company-secret/assets/data/music/bgm_resign.mp3"},ci=.25,Ta=1500,di=class{constructor(){this.audio=null,this.currentBgm=null,this.isMuted=!1,this.volume=ci,this.fadeTimer=null,this._loadSettings()}_loadSettings(){const e=l.get("settings");e&&(typeof e.bgmVolume=="number"&&(this.volume=e.bgmVolume),typeof e.bgmMuted=="boolean"&&(this.isMuted=e.bgmMuted))}_saveSettings(){l.set("settings.bgmVolume",this.volume),l.set("settings.bgmMuted",this.isMuted)}_createAudio(e){const t=new Audio(e);return t.loop=!0,t.preload="auto",t.volume=this.isMuted?0:this.volume,t}_fadeVolume(e,t,a,i){this.fadeTimer&&cancelAnimationFrame(this.fadeTimer);const n=performance.now(),s=r=>{const d=r-n,o=Math.min(d/a,1),c=e+(t-e)*o;this.audio&&(this.audio.volume=this.isMuted?0:c),o<1?this.fadeTimer=requestAnimationFrame(s):(this.fadeTimer=null,i&&i())};this.fadeTimer=requestAnimationFrame(s)}_stopCurrent(e=!0){if(!this.audio)return Promise.resolve();const t=this.audio,a=t.volume;return e&&a>0?new Promise(i=>{this._fadeVolume(a,0,Ta,()=>{t.pause(),t.src="",i()})}):(t.pause(),t.src="",Promise.resolve())}async play(e){const t=li[e];if(t&&this.currentBgm!==e){await this._stopCurrent(!0),this.currentBgm=e,this.audio=this._createAudio(t);try{await this.audio.play(),this._fadeVolume(0,this.volume,Ta)}catch(a){console.warn("BGM play failed:",a)}}}async stop(e=!0){await this._stopCurrent(e),this.audio=null,this.currentBgm=null}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.audio&&!this.isMuted&&(this.audio.volume=this.volume),this._saveSettings()}getVolume(){return this.volume}toggleMute(){return this.isMuted=!this.isMuted,this.audio&&(this.audio.volume=this.isMuted?0:this.volume),this._saveSettings(),this.isMuted}setMuted(e){this.isMuted=e,this.audio&&(this.audio.volume=this.isMuted?0:this.volume),this._saveSettings()}isMutedState(){return this.isMuted}getCurrentBgm(){return this.currentBgm}},ie=new di;function We(){const e=document.getElementById("settingsDialog");e&&(typeof e.showModal=="function"?e.open||e.showModal():typeof e.show=="function"?e.open||e.show():(e.style.display="block",e.setAttribute("open","")),e.style.removeProperty("display"),pi())}function pi(){const e=document.getElementById("settingTheme");e&&(e.value=l.get("settings.theme"));const t=document.getElementById("settingPlaytime");t&&(t.textContent=String(l.get("playtime"))+"s")}function ui(){document.getElementById("settingTheme")?.addEventListener("change",i=>{const n=i.target.value;l.set("settings.theme",n),document.documentElement.setAttribute("data-theme",n),U(he("toast.saved"))});const e=document.getElementById("bgmMuteBtn"),t=document.getElementById("bgmVolumeSlider"),a=document.getElementById("bgmVolumePct");e&&!e._bound&&(e._bound=!0,e.addEventListener("click",()=>{const i=ie.toggleMute();e.textContent=i?"🔇":"🔊",a&&(a.textContent=i?"靜音":Math.round(ie.getVolume()*100)+"%")})),t&&!t._bound&&(t._bound=!0,t.addEventListener("input",i=>{const n=parseInt(i.target.value)/100;ie.setVolume(n),ie.setMuted(!1),e&&(e.textContent="🔊"),a&&(a.textContent=Math.round(n*100)+"%")})),document.getElementById("btnExport")?.addEventListener("click",()=>{ri("code-conspiracy-save.json",l.exportSave())}),document.getElementById("btnImport")?.addEventListener("change",async i=>{const n=i.target.files?.[0];if(!n)return;const s=await oi(n),r=l.importSave(s);U(r?he("toast.saved"):"Import failed",{variant:r?void 0:"error"}),r&&location.reload()}),document.getElementById("btnReset")?.addEventListener("click",async()=>{if(confirm("Reset all progress?")){try{l.reset()}catch{}try{localStorage.removeItem("code_conspiracy_state")}catch{}try{localStorage.clear()}catch{}const i=document.getElementById("settingsDialog");if(i&&i.open)try{i.close()}catch{}i&&(i.style.removeProperty("display"),i.removeAttribute("open"));try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(s=>caches.delete(s)))}if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();await Promise.all(n.map(s=>s.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)}}),document.getElementById("settingsDialog")?.addEventListener("close",()=>{})}var Aa=["教學","異常發現","自由探索","暗網入口","秘密曝光","抉擇"],mi=13,gi={vscode:"Vizual",jira:"Jiua",whatsapp:"WhatUp",search:"Search",intranet:"Intranet",darknet:"Darknet",email:"Email"};function hi(e){return!e||!e.length?"—":e.map(t=>gi[t]||t).join(", ")}function vi(e){return e=Number(e)||0,e<=59?`${e} 秒`:e<3600?`${Math.floor(e/60)} 分鐘`:e<86400?`${Math.floor(e/3600)} 小時`:`${Math.floor(e/86400)} 日`}function fi(){const e=l.get("readArticles")||[],t=l.get("discoveredFiles")||[],a=l.get("endings")||l.get("unlockedEndings")||[],i=l.get("whatsappSentCount")||0,n=l.get("persistentStats")||{},s=n.readArticles||[],r=n.darkFileCount||0,d=n.whatsappSentCount||0,o=n.searchHistoryCount||0,c=n.flags||{},m=["https://sawyer-blog.example/2001-10-18","https://sawyer-blog.example/2003-04-27","https://sawyer-blog.example/2004-11-13","https://sawyer-blog.example/2006-09-01","https://sawyer-blog.example/2007-01-11","https://sawyer-blog.example/2007-01-12","https://sawyer-blog.example/2010-06-06","https://sawyer-blog.example/2012-07-07","https://sawyer-blog.example/2013-01-01","https://sawyer-blog.example/2023-04-25","https://sawyer-blog.example/2023-05-01","https://sawyer-blog.example/2023-05-10","https://sawyer-blog.example/2023-12-20","https://sawyer-blog.example/2024-01-15","https://sawyer-blog.example/2024-03-20"],p=["https://school.example/guangzhi-essay-sawyer"],u=["https://news.example/car-accident-2023","https://news.example/car-accident-investigation-2023","https://news.example/ping-wo-suspicious-man-2023","https://news.example/police-clarification-2023"],v=[...m,...p,...u],h=[...m,"https://mary-blog.example/kyoto-sakura-2024","https://mary-blog.example/one-person-kitchen","https://mary-blog.example/danshari-half-year","https://peter-blog.example/python-one-year","https://peter-blog.example/vim-vs-vscode","https://peter-blog.example/nas-ds220","https://peter-blog.example/code-easter-eggs","https://paul-blog.example/tainan-beef-soup","https://paul-blog.example/hand-drip-coffee","https://paul-blog.example/keelung-night-market","https://emma-blog.example/contax-t2-taipei","https://emma-blog.example/iceland-aurora","https://david-blog.example/vinyl-jazz-20","https://david-blog.example/livehouse-map"];let b=10;try{const f=k.listDarkFiles?k.listDarkFiles("/darknet"):[];f.length&&(b=f.length)}catch{}const A=Math.max(t.filter(f=>f.startsWith("/darknet")).length,r),P=Math.max(l.hasFlag("portal_simple_entered")?1:0,c.portal_simple_entered?1:0),oe=Math.max(l.hasFlag("portal_hash_entered")?1:0,c.portal_hash_entered?1:0),E=[...new Set([...e,...s])],_=Math.max(i,d),w=Math.max((l.get("searchHistory")||[]).length,o),y=[...new Set([...a,...l.get("unlockedEndings")||[],...n.unlockedEndings||[]])];return[{id:"secret_entry",title:"解鎖秘密入口",desc:"進入公司秘密內部系統入口",total:2,current:P+oe,isSecret:!1},{id:"boss_whisper",title:"老闆知音",desc:"已了解老闆的一切",total:20,current:v.filter(f=>E.includes(f)).length,isSecret:!1},{id:"too_much",title:"你知道得太多了",desc:"閱讀所有秘密檔案",total:b,current:Math.min(A,b),isSecret:!1},{id:"all_endings",title:"作者感謝您",desc:"解鎖全結局",total:5,current:y.length,isSecret:!1},{id:"social",title:"社牛",desc:"在 WhatUp 發送超過 10 條訊息",total:10,current:Math.min(_,10),isSecret:!0},{id:"reader",title:"閱讀達人",desc:"閱讀 BlogWorld 上的所有部落格",total:29,current:h.filter(f=>E.includes(f)).length,isSecret:!0},{id:"miracle",title:"你沒有被解僱是奇蹟",desc:"向 Sawyer 發送帶有「垃圾」「蠢」等字眼的訊息",total:1,current:Math.max(l.hasFlag("sawyer_abuse_sent")?1:0,c.sawyer_abuse_sent?1:0),isSecret:!0},{id:"net_addict",title:"網路成癮",desc:"在搜尋引擎搜尋超過 50 次",total:50,current:Math.min(w,50),isSecret:!0}].map(f=>({...f,done:f.current>=f.total,progress:`${f.current}/${f.total}`,pct:Math.round(f.current/f.total*100)}))}var $a=[{id:"flee",idx:1,title:"平凡的日常",desc:"完成工作後登出，回到平凡重複的日常。",color:"#6b778c"},{id:"cooperate",idx:2,title:"共犯",desc:"與老闆合作，踏入充滿刺激與風險的新生活。",color:"#d93025"},{id:"report",idx:3,title:"舉報",desc:"向警方舉報，目睹公司倒閉與風波後的平靜。",color:"#0d9488"},{id:"resign",idx:4,title:"辭職",desc:"遠離是非，主動辭職尋找新的工作與記憶。",color:"#6554c0"},{id:"fried",idx:5,title:"做對了嗎？",desc:"公司已發現你。",color:"#ff991f"}];function Ge(){const e=document.getElementById("notebookDialog");e&&(yi(),typeof e.showModal=="function"?e.open||e.showModal():typeof e.show=="function"?e.open||e.show():(e.setAttribute("open",""),e.style.display="block"),e.style.removeProperty("display"),e._boundClose||(e.addEventListener("close",()=>{e.style.removeProperty("display"),e.removeAttribute("open")}),e._boundClose=!0))}function yi(){const e=document.getElementById("notebookContent");if(!e)return;const t=l.get("collectedEvidence")||[];l.get("flags");const a=l.get("currentChapter")??0,i=fi(),n=i.filter(c=>c.done).length,s=l.get("persistentStats")?.unlockedEndings||[],r=l.get("endings")||l.get("unlockedEndings")||[],d=[...new Set([...r,...s])],o=(()=>{const c=$a.map(m=>{const p=d.includes(m.id),u="？".repeat([...m.title].length);return`
        <div class="nb-ending-card ${p?"unlocked":"locked"}" data-ending="${m.id}" title="${p?m.title:u}">
          <div class="nb-ending-title" style="${p?`color:${m.color}`:""}">${p?m.title:u}</div>
          <div class="small muted nb-ending-desc">${p?m.desc:"尚未達成此結局"}</div>
          <div class="nb-ending-badge ${p?"done":""}">${p?"已達成":"未達成"}</div>
        </div>
      `}).join("");return`
      <div class="card nb-endings-card" style="margin-top:12px">
        <div style="margin-bottom:10px">
          <h3 style="margin:0">結局收集 (${d.length}/5)</h3>
        </div>
        <div class="nb-endings-grid">
          ${c}
        </div>
      </div>
    `})();e.innerHTML=`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">進度 · Chapter ${a} / 5 — ${Aa[a]||"—"}</h3>
        <span class="badge">${t.length} 證據</span>
      </div>
      <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:${Math.min(100,Math.round(a/5*100))}%;height:100%;background:var(--accent)"></div></div>
      <div class="small muted" style="margin-top:6px">遊玩時長 ${vi(l.get("playtime"))} · 已解鎖 ${hi(l.get("unlockedInterfaces"))}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">證據板 (${t.length}/${mi})</h3>
      ${t.length?`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
          ${t.map(c=>`
            <div class="card" style="padding:8px;background:var(--bg-primary);border-left:3px solid var(--accent);cursor:grab">
              <div style="font-weight:700;font-size:13px">${c.title}</div>
              <div class="small muted">#${c.id} · ch${c.chapter} · ${c.type}</div>
              <div class="small muted" style="margin-top:4px">${new Date(c.discoveredAt).toLocaleDateString("zh-TW")}</div>
              <div style="margin-top:6px;display:flex;gap:4px">
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="navigator.clipboard.writeText('${c.title}')">複製</button>
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="alert('已標記: ${c.title}')">標記</button>
              </div>
            </div>
          `).join("")}
        </div>
      `:'<div class="muted small">尚未發現證據。完成 Ch0 工單後開始探索吧。</div>'}
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">成就 (${n}/${i.length})</h3>
      <div style="display:grid;gap:10px">
        ${i.map(c=>{const m=c.isSecret&&!c.done,p=m?"？".repeat([...c.title].length):c.title,u=m?"？".repeat([...c.desc].length):c.desc;return`<div style="padding:10px;border:1px solid var(--border);border-radius:8px;background:${c.done?"var(--bg-tertiary)":"var(--bg-primary)"};opacity:${m?.9:1}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:13px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span>${c.done?"🏆":c.isSecret?"🔒":"◯"}</span>
                  <span>${p}</span>
                  ${c.isSecret?`<span class="small muted" style="border:1px solid var(--border);padding:1px 4px;border-radius:4px;font-size:10px">${c.done?"隱藏已解鎖":"隱藏成就"}</span>`:""}
                </div>
                <div class="small muted" style="margin-top:2px;word-break:break-word">${u}</div>
                <div style="margin-top:8px;height:6px;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:999px;overflow:hidden">
                  <div style="width:${c.pct}%;height:100%;background:${c.done?"var(--success)":"var(--accent)"};transition:width .3s"></div>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0;min-width:72px">
                <div style="font-weight:700;font-size:12px">${c.progress}</div>
                <span class="badge" style="margin-top:4px;display:inline-block;background:${c.done?"var(--success)":"var(--border)"};color:${c.done?"#fff":"var(--fg-muted)"}">${c.done?"已解鎖":"未解鎖"}</span>
              </div>
            </div>
          </div>`}).join("")}
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">章節</h3>
      <div style="display:grid;gap:4px">
        ${Aa.map((c,m)=>`<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:${m<=a?"var(--bg-tertiary)":"var(--bg-primary)"};border:1px solid var(--border)"><span>Ch${m} ${c}</span><span class="small ${m<a?"":m===a?"badge":""}" style="${m===a?"background:var(--accent);color:#fff":""}">${m<a?"完成":m===a?"進行中":"未開始"}</span></div>`).join("")}
      </div>
    </div>
    ${o}

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="navigator.clipboard.writeText(JSON.stringify(JSON.parse(localStorage.getItem('code_conspiracy_state')||'{}'), null, 2))">複製存檔 JSON</button>
      <button class="btn" id="notebookResetBtn">重置 notebook</button>
    </div>
  `,setTimeout(()=>{const c=document.getElementById("notebookResetBtn");!c||c._bound||(c._bound=!0,c.addEventListener("click",async()=>{if(!confirm("重置後將失去證據，確定？"))return;const m=document.getElementById("notebookDialog");try{m&&m.open&&m.close()}catch{}m&&(m.style.removeProperty("display"),m.removeAttribute("open"));let p=null;try{p=JSON.parse(JSON.stringify(l.get("persistentStats")||{}))}catch{}try{l.reset()}catch{}try{if(p){const u=l.get("persistentStats")||{},v={unlockedEndings:[...new Set([...u.unlockedEndings||[],...p.unlockedEndings||[]])],readArticles:[...new Set([...u.readArticles||[],...p.readArticles||[]])],darkFileCount:Math.max(u.darkFileCount||0,p.darkFileCount||0),whatsappSentCount:Math.max(u.whatsappSentCount||0,p.whatsappSentCount||0),searchHistoryCount:Math.max(u.searchHistoryCount||0,p.searchHistoryCount||0),flags:{...u.flags||{},...p.flags||{}}};l.set("persistentStats",v),l.set("unlockedEndings",v.unlockedEndings)}}catch{}try{if("caches"in window){const u=await caches.keys();await Promise.all(u.map(v=>caches.delete(v)))}if("serviceWorker"in navigator){const u=await navigator.serviceWorker.getRegistrations();await Promise.all(u.map(v=>v.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)}))},0),setTimeout(()=>{const c=document.querySelector(".nb-endings-grid");c&&c.querySelectorAll(".nb-ending-card.unlocked").forEach(m=>{m.addEventListener("click",()=>{const p=m.dataset.ending,u=$a.find(v=>v.id===p);if(u){try{const v=new CustomEvent("nb:endingPreview",{detail:u});window.dispatchEvent(v)}catch{}m.classList.add("pulse"),setTimeout(()=>m.classList.remove("pulse"),600)}})})},0)}function g(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var bi="modulepreload",_i=function(e){return"/arg-game-it-company-secret/"+e},Ba={},$=function(t,a,i){let n=Promise.resolve();if(a&&a.length>0){let c=function(p){return Promise.all(p.map(u=>Promise.resolve(u).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))},m=function(p){return import.meta.resolve?import.meta.resolve(p):new URL(p,import.meta.url).href};const r=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),o=d?.nonce||d?.getAttribute("nonce");n=c(a.map(p=>{if(p=_i(p,i),p=m(p),p in Ba)return;Ba[p]=!0;const u=p.endsWith(".css");for(let h=r.length-1;h>=0;h--){const b=r[h];if(b.href===p&&(!u||b.rel==="stylesheet"))return}const v=document.createElement("link");if(v.rel=u?"stylesheet":bi,u||(v.as="script"),v.crossOrigin="",v.href=p,o&&v.setAttribute("nonce",o),document.head.appendChild(v),u)return new Promise((h,b)=>{v.addEventListener("load",h),v.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${p}`)))})}))}function s(r){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=r,window.dispatchEvent(d),!d.defaultPrevented)throw r}return n.then(r=>{for(const d of r||[])d.status==="rejected"&&s(d.reason);return t().catch(s)})},F="/customer-portal/src/main/java/com/nori/OrderService.java",Z="explorer",$e=[],ue=-1,Ft="",wi=new Set(["/customer-portal/src/frontend/src/pages/Home.jsx","/customer-portal/src/main/java/com/nori/controller/OrderController.java","/customer-portal/scripts/reconcile.py","/customer-portal/src/payment/gateway.js","/customer-portal/src/main/java/com/nori/service/PaymentService.java","/customer-portal/src/main/java/com/nori/controller/PaymentController.java"]);function Ee(e){return wi.has(e)}var R=new Map,Fe=null,Pa=null;function dt(e){const t=k.getFile(e);return t?t.content:null}function oa(e){return R.has(e)?R.get(e):dt(e)}function sn(e){return R.has(e)?R.get(e)!==dt(e):!1}function xi(e,t){t===dt(e)?R.delete(e):R.set(e,t),Ce(),ye(),Ne()}function ga(){if(!Fe){const e=k.getFile("/file-system/src/components/SearchBar.jsx");e&&(Fe=e.content)}}function ki(){if(!Pa){const e=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx");e&&(Pa=e.content)}}var Si=`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
      <p>創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`,Ei=`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>
      <p>創辦人 蔡梓掦 · 2019 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`;function rn(){return l.hasFlag("ch1_0043_committed")&&!l.hasFlag("ch1_revert_done")}function on(e="revert"){l.hasFlag("ch1_revert_done")||(l.setFlag("ch1_revert_done",!0),l.setFlag("ch1_system_down",!1),setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(t=>{const a=(t.getChats?t.getChats():[]).find(i=>i.id==="system-alert");if(a){a.messages.push({id:"health-"+Date.now(),from:"system",text:"✅ 系統健康 — 所有服務已恢復正常",time:new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}),read:"delivered",type:"text"}),a.preview="✅ 系統健康",a.unread=(a.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"system-alert"}}));const i=document.createElement("div");if(cn("system-alert"))return;i.id="wa-win-notif-health-"+Date.now(),i.setAttribute("role","alert"),i.innerHTML='<div class="win-notif__app"><img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">System Alert</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #0d9488, #25D366)">✓</div><div class="win-notif__text"><div class="win-notif__sender">System Alert</div><div class="win-notif__msg">✅ 系統健康 — 所有服務已恢復正常</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 10000ms linear forwards"></div>',i.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",i.addEventListener("click",n=>{n.target.closest(".win-notif__close")||(i.remove(),$(()=>Promise.resolve().then(()=>re).then(s=>{s.setActiveView&&(s.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),$(()=>Promise.resolve().then(()=>ce).then(s=>s.openChat("system-alert")),void 0))}),i.querySelector(".win-notif__close")?.addEventListener("click",n=>{n.stopPropagation(),i.remove()}),document.body.appendChild(i),requestAnimationFrame(()=>{i.style.opacity="1",i.style.transform="none"}),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(8px)",setTimeout(()=>i.remove(),300)},1e4)}}),void 0)},500))}function Ii(e){const t=se.find(s=>s.hash===e)||de.find(s=>s.hash===e);if(!t)return;if(t.msg.includes("INV-2024-0017")||t.hash==="3f2a9c1"){const s=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx")?.content||"",r=s.includes("連結人與希望")||s.includes("2018 創立"),d=r?Ei:Si;k.registerFile("/customer-portal/src/frontend/src/pages/Home.jsx",{content:d,meta:{lang:"javascript"}});const o=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx");o&&(o.content=d),R.delete("/customer-portal/src/frontend/src/pages/Home.jsx");const c=Math.random().toString(36).slice(2,8),m=r?`revert: restore Home.jsx fix (revert ${e} — apply Parker fix)`:`revert: revert Home.jsx fix (revert ${e} — back to bug)`,p=r?`M /customer-portal/src/frontend/src/pages/Home.jsx
- 連結人與希望 / 2018
+ 連結人與風味 / 2019 (revert apply)`:`M /customer-portal/src/frontend/src/pages/Home.jsx
- 連結人與風味 / 2019
+ 連結人與希望 / 2018 (revert)`;de.unshift({hash:c,author:"Parker",date:new Date().toISOString().slice(0,10),msg:m,diff:p}),se.unshift({hash:c,branch:"main",author:"Parker",date:new Date().toISOString().slice(0,10),msg:m,diff:p});const u=document.getElementById("scmCommitStatus");u&&(u.innerHTML=`<span style="color:var(--success)">✓ Revert 成功: ${c} (from ${e}) — ${r?"已套用 Parker 修復":"已回退至 bug 版"}</span>`),C(`✓ revert ${c} — ${m}`),Ce(),ye(),Le(),Ne(),fe&&Me();return}if(!rn())return;if(ga(),Fe){k.registerFile("/file-system/src/components/SearchBar.jsx",{content:Fe,meta:{lang:"javascript"}});const s=k.getFile("/file-system/src/components/SearchBar.jsx");s&&(s.content=Fe)}R.delete("/file-system/src/components/SearchBar.jsx");const a=Math.random().toString(36).slice(2,8),i=`revert: restore SearchBar legacyRoutes (revert ${e})`;de.unshift({hash:a,author:"Casey",date:new Date().toISOString().slice(0,10),msg:i,diff:`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes / resolveLegacyPath`}),se.unshift({hash:a,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:i,diff:`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes`});const n=document.getElementById("scmCommitStatus");n&&(n.innerHTML=`<span style="color:var(--success)">✓ Revert 成功: ${a} (from ${e})</span>`),C(`✓ revert ${a} — ${i}`),Ce(),ye(),Le(),Ne(),fe&&Me(),on("git-graph")}var de=[{hash:"a1b2c3d",author:"finance@internal",date:"2024-08-12",msg:"feat: integrate crypto-mixer (legacy)",diff:`+ import { cryptoMixer } from '@shady/crypto-mixer'
  feeRate table added: drink-001 0.05, drink-002 0.08`},{hash:"9f8e7d6",author:"parker",date:"2024-08-10",msg:"fix: rounding edge case",diff:`- if (total > 1000) {
+ if (total >= 1000) {`},{hash:"3f2a9c1",author:"Parker",date:"2024-02-14",msg:"(INV-2024-0017) fix: correct homepage hero slogan and founded year (2018→2019)",diff:`M /customer-portal/src/frontend/src/pages/Home.jsx
- <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
+ <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>
- <p>創辦人 蔡梓掦 · 2018 創立</p>
+ <p>創辦人 蔡梓掦 · 2019 創立</p>`},{hash:"4c2a1e0",author:"dev",date:"2024-08-01",msg:"chore: init billing service",diff:`+ export function calculateAmount(items, opts) {}
+ export function computeFee(amount, opts) {}`}],ja={"/customer-portal/src/billing/service.js":[{line:1,commit:"4c2a1e0",author:"dev"},{line:5,commit:"4c2a1e0",author:"dev"},{line:9,commit:"9f8e7d6",author:"qa-lee"},{line:12,commit:"9f8e7d6",author:"qa-lee"},{line:14,commit:"a1b2c3d",author:"finance@internal"}],"/customer-portal/src/main/java/com/nori/OrderService.java":[{line:1,commit:"4c2a1e0",author:"dev"},{line:12,commit:"9f8e7d6",author:"qa-lee"},{line:15,commit:"a1b2c3d",author:"finance@internal"}]},ve="__GIT_GRAPH__",fe=!1,Qe=null,Ma={main:"#89d185","feature/vip-discount":"#4da3ff","feature/crypto-mixer":"#dcdcaa","feature/billing-fix":"#ce9178","feature/home-copyfix":"#4ec9b0",develop:"#c586c0"},se=[{hash:"a1b2c3d",branch:"feature/crypto-mixer",author:"finance@internal",date:"2024-08-12",msg:"(INV-2024-0040) feat: integrate crypto-mixer (legacy)",diff:`+ import { cryptoMixer } from '@shady/crypto-mixer'
+ const table = { "drink-001": 0.05, "drink-002": 0.08, "drink-003": 0.03 }`},{hash:"9f8e7d6",branch:"feature/billing-fix",author:"parker-lee",date:"2024-08-10",msg:"(INV-2024-0033) fix: rounding edge case",diff:`- if (total > 1000) { 
+ if (total < 1000) {`},{hash:"7e2b4a1",branch:"feature/vip-discount",author:"dev-zhang",date:"2024-08-08",msg:"(INV-2024-0030) feat: add VIP discount tier (initial)",diff:`+ public double calculateVipPrice(double price, int vipLv) {
+   switch(vipLv){ case 1: price*=0.95; ... }
+ }`},{hash:"b5c8e11",branch:"develop",author:"ops-li",date:"2024-08-05",msg:"(INV-2024-0028) chore: update CI pipeline for billing tests",diff:`M .github/workflows/ci.yml
+ - run: npm test -- billing
+ - run: sonar-scan`},{hash:"4c2a1e0",branch:"main",author:"dev",date:"2024-08-01",msg:"(INV-2024-0020) chore: init billing service",diff:`+ export function calculateAmount(items, opts) {}
+ export function computeFee(amount, opts) {}`},{hash:"c8d3e9f",branch:"develop",author:"ops-li",date:"2024-07-28",msg:"(INV-2023-0040) chore: scaffold workspace & payment stubs",diff:`+ workspace/src/payment/gateway.js
+ workspace/src/payment/mixer.js`},{hash:"3f2a9c1",branch:"feature/home-copyfix",author:"Parker",date:"2024-02-14",msg:"(INV-2024-0017) fix: correct homepage hero slogan and founded year (2018→2019)",diff:`M /customer-portal/src/frontend/src/pages/Home.jsx
- <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
+ <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>
- <p>創辦人 蔡梓掦 · 2018 創立</p>
+ <p>創辦人 蔡梓掦 · 2019 創立</p>`},{hash:"d4e5f6a",branch:"main",author:"dev-chen",date:"2023-11-20",msg:"(INV-2023-0039) refactor: simplify portal auth (remove dynamic generator)",diff:"- function generateInternalPortalPath(internalPortalDomain){ \n-     const cid = redis.get('companyId'); \n-     const y = redis.get('year'); \n-     const k = import.meta.env.MD5_KEY; \n-     return internalPortalDomain + '?hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); // e.g. https://google.com/internal?hash=be78e7542cd6d04e31e80fa8b741aad4\n-     }"}];function ln(){const e=se.find(a=>a.hash==="d4e5f6a");e&&!e.diff.includes("e.g. https://google.com/internal?hash=")&&(e.diff=e.diff.replace("md5(`companyId=${cid}&year=${y}&key=${k}`);","md5(`companyId=${cid}&year=${y}&key=${k}`); // e.g. https://google.com/internal?hash=be78e7542cd6d04e31e80fa8b741aad4"));const t=de.find(a=>a.hash==="d4e5f6a");t&&t.diff&&!t.diff.includes("e.g. https://google.com")&&(t.diff=e.diff)}ln();function Ce(){try{const e=Array.from(R.entries());l.set("vscodeState",{editedFiles:e,gitCommits:de.slice(0,20),gitGraphCommits:se.slice(0,20),currentFile:F,activeActivity:Z,gitGraphOpen:fe,expandedGraphHash:Qe}),l.save(!0)}catch{}}function cn(e){try{const t=JSON.parse(localStorage.getItem("code_conspiracy_state")||"{}").whatsappChats;if(Array.isArray(t)){const a=t.find(i=>i.id===e);if(a)return!!a.muted}return!1}catch{return!1}}function Ci(){try{const e=l.get("vscodeState");if(!e||typeof e!="object")return;if(Array.isArray(e.editedFiles))for(const[t,a]of e.editedFiles){R.set(t,a);const i=k.getFile(t);i?i.content=a:k.registerFile(t,{content:a,meta:{lang:t.endsWith(".java")?"java":t.endsWith(".js")?"javascript":"text"}})}if(Array.isArray(e.gitCommits)&&e.gitCommits.length){de.length=0;for(const t of e.gitCommits)de.push(t)}if(Array.isArray(e.gitGraphCommits)&&e.gitGraphCommits.length){se.length=0;for(const t of e.gitGraphCommits)se.push(t)}try{ln()}catch{}typeof e.currentFile=="string"&&e.currentFile&&(F=e.currentFile),typeof e.activeActivity=="string"&&(Z=e.activeActivity),typeof e.gitGraphOpen=="boolean"&&(fe=e.gitGraphOpen),e.expandedGraphHash&&(Qe=e.expandedGraphHash)}catch{}}function Li(){Ci();const e=document.getElementById("view-vscode");e&&(e.innerHTML=`
    <div class="vscode">
      <!-- Vizual Studio Code Title Bar -->
      <div class="vscode__titlebar" role="banner">
        <div class="titlebar__left">
          <span class="vscode__logo" aria-hidden="true">
            <img src="/arg-game-it-company-secret/icon/vizual-studio-code.svg" alt="Vizual Studio Code" width="16" height="16" style="width:16px;height:16px;object-fit:contain" />
          </span>
          <nav class="titlebar__menu" aria-label="Menu">
            <span>File</span><span>Edit</span><span>Selection</span><span>View</span><span>Go</span><span>Run</span><span>Terminal</span><span data-help="1" style="cursor:pointer">Help</span>
          </nav>
        </div>
        <div class="titlebar__center" id="vsTitle" title="OrderService.java — nori-system — Vizual Studio Code">OrderService.java — Code &amp; Conspiracy — Vizual Studio Code</div>
        <div class="titlebar__controls" aria-label="Window controls">
          <button class="titlebar__btn" title="Minimize" aria-label="Minimize">—</button>
          <button class="titlebar__btn" title="Maximize" aria-label="Maximize">□</button>
          <button class="titlebar__btn titlebar__btn--close" title="Close" aria-label="Close">✕</button>
        </div>
      </div>

      <div class="vscode__body">
        <!-- Activity Bar -->
        <nav class="vscode__activitybar" aria-label="Activity Bar">
          <div class="activitybar__top">
            <button class="activitybar__btn active" data-activity="explorer" title="Explorer (Ctrl+Shift+E)" aria-label="Explorer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H9l2 2h7.5A2.5 2.5 0 0 1 21 7.5v11A2.5 2.5 0 0 1 18.5 21H5.5A2.5 2.5 0 0 1 3 18.5v-13z"/><path d="M3 9h18"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="search" title="Search (Ctrl+Shift+F)" aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="scm" title="Source Control (Ctrl+Shift+G)" aria-label="Source Control">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="debug" title="Run and Debug (Ctrl+Shift+D)" aria-label="Run and Debug">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 6.5L16.5 12L8 17.5V6.5z"/><path d="M18 8.5a2.5 2.5 0 1 1 0 7"/><path d="M18 10.5v1"/><path d="M18 13.5v1"/></svg>
            </button>
            <button class="activitybar__btn" data-activity="extensions" title="Extensions (Ctrl+Shift+X)" aria-label="Extensions">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
            </button>
          </div>
          <div class="activitybar__bottom">
            <button class="activitybar__btn" title="Accounts" aria-label="Accounts">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
            </button>
            <button class="activitybar__btn" title="Manage - Settings" aria-label="Manage">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.6a1.2 1.2 0 0 0 .27 1.32l.03.04a1.7 1.7 0 1 1-2.4 2.4l-.04-.03a1.2 1.2 0 0 0-1.32-.27 1.2 1.2 0 0 0-.77 1.13V20a1.7 1.7 0 1 1-3.4 0v-.7a1.2 1.2 0 0 0-.77-1.13 1.2 1.2 0 0 0-1.32.27l-.04.03a1.7 1.7 0 1 1-2.4-2.4l.03-.04a1.2 1.2 0 0 0 .27-1.32 1.2 1.2 0 0 0-.77-1.13H5a1.7 1.7 0 1 1 0-3.4h.7a1.2 1.2 0 0 0 .77-1.13 1.2 1.2 0 0 0-.27-1.32L6.17 7a1.7 1.7 0 1 1 2.4-2.4l.04.03a1.2 1.2 0 0 0 1.32.27 1.2 1.2 0 0 0 .77-1.13V3a1.7 1.7 0 1 1 3.4 0v.7a1.2 1.2 0 0 0 .77 1.13 1.2 1.2 0 0 0 1.32-.27l.04-.03a1.7 1.7 0 1 1 2.4 2.4l-.03.04a1.2 1.2 0 0 0-.27 1.32 1.2 1.2 0 0 0 .77 1.13H19a1.7 1.7 0 1 1 0 3.4h-.7a1.2 1.2 0 0 0-.77 1.13z"/></svg>
            </button>
          </div>
        </nav>

        <!-- Sidebar -->
        <aside class="vscode__side" id="vsSide">
          <div class="vscode__side-header">
            <span id="vsSideTitle">EXPLORER</span>
            <span class="vscode__side-actions"><button title="More Actions">⋯</button></span>
          </div>
          <div id="vsSideContent" style="display:flex;flex-direction:column;flex:1;min-height:0">
            <div class="vscode__searchbox" id="vsSearchBox">
              <input id="vsQuickOpen" class="input" placeholder="搜尋檔案 (Ctrl+P)" style="font-size:12px;height:28px" />
            </div>
            <div id="vsTree" class="tree"></div>
          </div>

          <!-- Search -->
          <div id="vsPanelSearch" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SEARCH</div>
            <input id="vsSearchInput" class="input" placeholder="搜尋 (Search)" style="margin-bottom:8px" />
            <input id="vsSearchReplace" class="input" placeholder="取代 (Replace)" />
            <div id="vsSearchResult" class="small" style="margin-top:10px;min-height:16px;color:var(--fg-secondary)"></div>
            <div class="small muted" style="margin-top:12px">結果會顯示於此。</div>
          </div>
          <!-- SCM -->
          <div id="vsPanelScm" style="display:none;flex:1;flex-direction:column;min-height:0;padding:0;overflow:hidden">
            <div style="padding:12px 12px 8px;border-bottom:1px solid var(--border)">
              <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">SOURCE CONTROL</div>
              <div class="scm__changes-header">
                <span class="scm__changes-title">CHANGES</span>
                <button id="scmGraphBtn" class="scm__graph-btn" title="View Git Graph" aria-label="View Git Graph">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
                </button>
              </div>
              <div class="scm__commit-box">
                <textarea id="scmCommitMsg" class="input" placeholder="訊息 (例如: fix: correct VIP discount)" style="min-height:56px;resize:vertical"></textarea>
                <button id="scmCommitBtn" class="btn primary" style="width:100%;margin-top:6px">✓ Commit</button>
                <div id="scmCommitStatus" class="small" style="margin-top:6px;min-height:14px;color:var(--fg-secondary)"></div>
              </div>
              <div id="scmChanges" class="scm__changes"></div>
            </div>
          </div>
          <div id="vsPanelDebug" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">RUN AND DEBUG</div>
            <button class="btn primary" style="width:100%">▸ Start Debugging</button>
            <div class="small muted" style="margin-top:8px">沒有設置</div>
          </div>
          <div id="vsPanelExtensions" style="display:none;flex:1;flex-direction:column;min-height:0;padding:12px">
            <div style="font-size:11px;font-weight:600;letter-spacing:.5px;color:var(--fg-secondary);margin-bottom:8px">EXTENSIONS</div>
            <input class="input" placeholder="Search Extensions in Marketplace" />
            <div class="small muted" style="margin-top:12px">結果會顯示於此。</div>
          </div>
        </aside>

        <!-- Editor Group -->
        <div class="vscode__main">
          <div id="vsTabs" class="vscode__tabs"></div>
          <div id="vsEditor" class="editor"></div>
          <div class="terminal" id="vsTerminal">
            <div id="vsTerminalHist" class="terminal__hist"></div>
            <div class="terminal__prompt">
              <span class="terminal__ps">➜ ~/customer-portal $</span>
              <input id="vsTerminalInput" class="terminal__input" placeholder="輸入指令 (help 查看)" autocomplete="off" spellcheck="false" />
            </div>
            <div class="terminal__hint">Tab 補全 · ↑↓ 歷史 · help / ls / cat / grep / git log / git diff</div>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="vscode__statusbar" role="contentinfo">
        <div class="vscode__statusbar-left">
          <span class="vscode__statusbar-item" title="Branch">⑂ main</span>
          <span class="vscode__statusbar-item">✓ No Issues</span>
        </div>
        <div class="vscode__statusbar-right">
          <span class="vscode__statusbar-item" id="vsCursorInfo">Ln 1, Col 1</span>
          <span class="vscode__statusbar-item">Spaces: 2</span>
          <span class="vscode__statusbar-item">UTF-8</span>
          <span class="vscode__statusbar-item">Java</span>
          <span class="vscode__statusbar-item">🔔</span>
        </div>
      </div>
    </div>
    <!-- QuickOpen overlay -->
    <div id="quickOpen" class="quickopen" role="dialog" aria-label="Quick Open">
      <input id="quickOpenInput" class="quickopen__input" placeholder="輸入檔案名稱或路徑 (Ctrl+P) — 輸入 : 可跳至行號" autocomplete="off" />
      <div id="quickOpenList" class="quickopen__list"></div>
    </div>
    <!-- Help overlay -->
    <div id="vsHelpOverlay" class="vshelp" style="display:none" role="dialog" aria-label="Shortcuts">
      <div class="vshelp__card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <b>鍵盤快捷鍵</b><button class="btn" style="padding:4px 8px" onclick="document.getElementById('vsHelpOverlay').style.display='none'">關閉</button>
        </div>
        <div style="display:grid;gap:6px;font-size:13px;color:var(--fg-secondary)">
          <div><span class="badge">Ctrl+P</span> 快速開啟檔案</div>
          <div><span class="badge">Ctrl+Shift+F</span> 全域搜尋</div>
          <div><span class="badge">Ctrl+Shift+G</span> 原始碼控管</div>
          <div><span class="badge">Ctrl+Shift+D</span> 執行與偵錯</div>
          <div><span class="badge">Ctrl+/</span> 聚焦終端機</div>
          <div><span class="badge">Tab</span> 補全 · <span class="badge">↑↓</span> 歷史</div>
          <div><span class="badge">F1</span> 或 <span class="badge">Help</span> 開此視窗</div>
        </div>
        <div class="small muted" style="margin-top:8px">多游標：按住 Alt 點擊編輯器多點編輯（模擬）</div>
      </div>
    </div>
    <!-- SonarQube modal -->
    <div id="sonarModal" class="sonar-modal" style="display:none" role="dialog" aria-modal="true">
      <div class="sonar-modal__card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <h3 style="margin:0;font-size:16px">❌ SonarQube 掃描失敗</h3>
          <button id="sonarModalClose" class="btn" style="padding:4px 10px">關閉</button>
        </div>
        <div id="sonarModalBody" class="small" style="line-height:1.6;white-space:pre-wrap"></div>
        <div class="small muted" style="margin-top:10px">請修正後重新 Commit</div>
      </div>
    </div>
  `,ga(),ki(),Le(),ye(),pe(F),Ti(),Mi(),Ne(),Oi())}function Ti(){document.getElementById("vsQuickOpen")?.addEventListener("input",n=>{Le(n.target.value.trim().toLowerCase())});const e=document.getElementById("vsSearchInput"),t=document.getElementById("vsSearchResult");t&&(t.textContent="");function a(n){const s=n.trim().toLowerCase();if(!s){t&&(t.textContent="");return}const r=s.includes("nori-intranet/internal/portal")||s==="https://nori-intranet/internal/portal",d=s.includes("internal/portal")||s==="internal"||s==="portal"||s.includes("internal")&&s.includes("portal")||r,o=s.includes("internal")||s.includes("portal")||r,c=s.includes("switch")||s.includes("case")||s.toLowerCase().includes("vipprice")||s.includes("price")||s.includes("vip"),m=s.includes("md5_key")||s.includes("md5key")||s.includes("md5")||s.includes("key");if(d||o){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="SearchBar">📄 file-system/src/components/SearchBar.jsx — 匹配 "${g(n)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{pe("/file-system/src/components/SearchBar.jsx"),document.getElementById("vsSearchInput")?.focus()}));return}if(c){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="OrderService">📄 customer-portal/src/main/java/com/nori/OrderService.java — 匹配 "${g(n)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{pe("/customer-portal/src/main/java/com/nori/OrderService.java")}));return}if(m){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open=".env">📄 /customer-portal/.env — 匹配 "${g(n)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{pe("/customer-portal/.env")}));return}t&&(t.textContent="")}e?.addEventListener("input",n=>a(n.target.value)),e?.addEventListener("keydown",n=>{n.key==="Enter"&&a(n.target.value)}),document.querySelectorAll(".activitybar__btn[data-activity]").forEach(n=>{n.addEventListener("click",()=>{Z=n.dataset.activity,Ht()})}),document.querySelector('[data-help="1"]')?.addEventListener("click",()=>{const n=document.getElementById("vsHelpOverlay");n&&(n.style.display=n.style.display==="none"||!n.style.display?"flex":"none")}),document.getElementById("vsHelpOverlay")?.addEventListener("click",n=>{n.target.id==="vsHelpOverlay"&&(n.target.style.display="none")}),document.getElementById("sonarModalClose")?.addEventListener("click",()=>{document.getElementById("sonarModal").style.display="none"}),document.getElementById("sonarModal")?.addEventListener("click",n=>{n.target.id==="sonarModal"&&(n.target.style.display="none")}),document.getElementById("scmCommitBtn")?.addEventListener("click",ji),document.getElementById("scmGraphBtn")?.addEventListener("click",dn),document.getElementById("vsTerminalInput")?.addEventListener("keydown",Di);const i=document.getElementById("quickOpenInput");i?.addEventListener("input",n=>pn(n.target.value)),i?.addEventListener("keydown",Vi),document.getElementById("quickOpen")?.addEventListener("click",n=>{n.target.id==="quickOpen"&&bt()})}function Ht(){document.querySelectorAll(".activitybar__btn[data-activity]").forEach(a=>{a.classList.toggle("active",a.dataset.activity===Z)});const e=document.getElementById("vsSideTitle"),t={explorer:"EXPLORER",search:"SEARCH",scm:"SOURCE CONTROL",debug:"RUN AND DEBUG",extensions:"EXTENSIONS"};e&&(e.textContent=t[Z]||"EXPLORER"),document.getElementById("vsSideContent").style.display=Z==="explorer"?"flex":"none",document.getElementById("vsPanelSearch").style.display=Z==="search"?"flex":"none",document.getElementById("vsPanelScm").style.display=Z==="scm"?"flex":"none",document.getElementById("vsPanelDebug").style.display=Z==="debug"?"flex":"none",document.getElementById("vsPanelExtensions").style.display=Z==="extensions"?"flex":"none",Z==="scm"&&Ne(),Ce()}function Le(e=""){const t=document.getElementById("vsTree");if(!t)return;const a=k.buildTree(),i=["/file-system","/customer-portal"];function n(d){return Ee(d)?!1:i.some(o=>d===o||d.startsWith(o+"/"))}function s(d,o=0){if(!n(d.path)&&d.path!=="/file-system"&&d.path!=="/customer-portal"&&(d.path==="/"||d.path==="/intranet"||d.path==="/internal"))return"";if(d.type==="dir"){const c=(d.children||[]).filter(m=>n(m.path)&&(!e||m.path.toLowerCase().includes(e)||r(m,e)));return e&&c.length===0&&!d.path.toLowerCase().includes(e)?"":!n(d.path)&&d.path!=="/"?c.map(m=>s(m,o)).join(""):`<div class="tree__node tree__node--dir" style="padding-left:${8+o*8}px" data-path="${d.path}" title="${g(d.path)}">📁 <span class="tree__label">${g(d.name)}</span></div>
        <div class="tree__children">${c.map(m=>s(m,o+1)).join("")}</div>`}else{if(!n(d.path)||e&&!d.path.toLowerCase().includes(e))return"";const c=d.path===F?"active":"",m=sn(d.path)?"●":"";return`<div class="tree__node ${c}" data-path="${d.path}" data-file="1" style="padding-left:${8+o*8}px" title="${g(d.path)}">📄 <span class="tree__label">${g(d.name)}</span> <span style="margin-left:auto;font-size:10px;color:var(--warning);flex-shrink:0">${m}</span></div>`}}function r(d,o){return n(d.path)?d.path.toLowerCase().includes(o)?!0:d.children?d.children.some(c=>r(c,o)):!1:!1}t.innerHTML=a.children.filter(d=>n(d.path)).map(d=>s(d,0)).join(""),t.querySelectorAll('[data-file="1"]').forEach(d=>{d.addEventListener("click",()=>pe(d.dataset.path))})}function ye(){const e=document.getElementById("vsTabs");if(!e)return;const t=k.listFiles("/customer-portal").filter(a=>!Ee(a.path)).slice(0,8);if(!t.some(a=>a.path===F)&&F!==ve){const a=k.getFile(F);a&&t.unshift({path:F,...a})}if(!t.some(a=>a.path==="/customer-portal/src/main/java/com/nori/OrderService.java")){const a=k.getFile("/customer-portal/src/main/java/com/nori/OrderService.java");a&&t.unshift({path:"/customer-portal/src/main/java/com/nori/OrderService.java",...a})}fe&&!t.some(a=>a.path===ve)&&t.push({path:ve,name:"Git Graph"}),e.innerHTML=t.map(a=>{if(a.path===ve){const n=a.path===F?"active":"";return`<div class="vscode__tab ${n}" data-path="${ve}"><span class="vscode__tab-dot" style="display:${n?"block":"none"}"></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" style="flex-shrink:0"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg> Git Graph <span class="vscode__tab-close" data-close-graph="1" title="Close" style="margin-left:6px;opacity:.6;font-size:12px;cursor:pointer">✕</span></div>`}const i=sn(a.path)?'<span style="color:var(--warning);font-size:12px">●</span>':"";return`<div class="vscode__tab ${a.path===F?"active":""}" data-path="${a.path}"><span class="vscode__tab-dot"></span>${g(a.path.split("/").pop()||a.path)} ${i} <span style="opacity:.6;font-size:11px;margin-left:4px">${a.path===F?"●":""}</span></div>`}).join(""),e.querySelectorAll(".vscode__tab").forEach(a=>a.addEventListener("click",i=>{if(i.target.closest("[data-close-graph]")){i.stopPropagation(),Ai();return}pe(a.dataset.path)}))}function dn(){fe=!0,Qe=null,pe(ve)}function Ai(){fe=!1,Qe=null,F===ve&&(F="/customer-portal/src/main/java/com/nori/OrderService.java"),ye(),pe(F)}function Me(){const e=document.getElementById("vsEditor");if(!e)return;const t=document.getElementById("vsTitle");t&&(t.textContent="Git Graph — nori-system — Vizual Studio Code"),ye();const a=rn(),i=se.map((n,s)=>{const r=Ma[n.branch]||"var(--accent)",d=Qe===n.hash,o=n.diff.split(`
`).map(p=>{const u=g(p);return p.startsWith("+")?`<div class="diff-add">${u}</div>`:p.startsWith("-")?`<div class="diff-del">${u}</div>`:`<div>${u}</div>`}).join(""),c=n.author==="Casey"&&(n.diff.includes("SearchBar")||n.diff.includes("legacyRoutes")||n.msg.includes("0043"));(n.hash==="3f2a9c1"||n.msg.includes("INV-2024-0017"))&&n.author;const m=a&&c&&!l.hasFlag("ch1_revert_done")&&l.hasFlag("sawyer_seq_started");return`
      <div class="gitgraph-row ${d?"expanded":""}" data-hash="${n.hash}">
        <div class="gitgraph-row__main">
          <div class="gitgraph-graph-col">
            <span class="gitgraph-dot" style="background:${r};box-shadow:0 0 0 2px ${r}33"></span>
            ${s<se.length-1?'<span class="gitgraph-vline"></span>':""}
          </div>
          <div class="gitgraph-info">
            <div class="gitgraph-top">
              <span class="gitgraph-branch" style="background:${r}22;color:${r};border-color:${r}44">${g(n.branch)}</span>
              <span class="mono gitgraph-hash" style="color:${r}">${g(n.hash)}</span>
              <span class="gitgraph-date">${g(n.date)}</span>
              <span class="gitgraph-author">${g(n.author)}</span>
              ${m?`<button class="btn small gitgraph-revert-btn" data-revert="${g(n.hash)}" title="Revert this commit" style="margin-left:8px;padding:3px 8px;font-size:11px;border-color:var(--error);color:var(--error);background:transparent">↩ Revert</button>`:""}
            </div>
            <div class="gitgraph-msg">${g(n.msg)}</div>
          </div>
          <span class="gitgraph-chevron">${d?"▾":"▸"}</span>
        </div>
        ${d?`<div class="gitgraph-diff"><div class="gitgraph-diff__header">Commit ${g(n.hash)} — ${g(n.date)} · ${g(n.author)}</div><pre class="gitgraph-diff__content">${o}</pre></div>`:""}
      </div>
    `}).join("");e.innerHTML=`
    <div class="gitgraph-editor">
      <div class="gitgraph-editor__header">
        <div style="display:flex;align-items:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
          <b>Git Graph</b>
          <span class="small muted">${se.length} commits — 5 branches</span>
        </div>
        <div class="gitgraph-legend">
          ${Object.entries(Ma).map(([n,s])=>`<span class="gitgraph-branch" style="background:${s}22;color:${s};border-color:${s}44">${g(n)}</span>`).join("")}
        </div>
      </div>
      <div class="gitgraph-list">
        ${i}
      </div>
      <div class="small muted" style="padding:8px 12px;border-top:1px solid var(--border)">點擊任一 commit 展開 / 收合 diff · 最新提交在上方</div>
    </div>
  `,e.querySelectorAll(".gitgraph-row__main").forEach(n=>{n.addEventListener("click",s=>{if(s.target.closest(".gitgraph-revert-btn"))return;const r=n.closest(".gitgraph-row")?.dataset.hash;r&&(Qe=Qe===r?null:r,Me())})}),e.querySelectorAll(".gitgraph-revert-btn").forEach(n=>{n.addEventListener("click",s=>{s.stopPropagation();const r=n.dataset.revert;r&&Ii(r)})}),C("$ open Git Graph")}function $i(e){const t=e.split(`
`).filter(i=>i.trim()!=="");if(!t.length)return{header:[],rows:[]};const a=i=>{const n=[];let s="",r=!1;for(let d=0;d<i.length;d++){const o=i[d];o==='"'?r&&i[d+1]==='"'?(s+='"',d++):r=!r:o===","&&!r?(n.push(s),s=""):s+=o}return n.push(s),n};return{header:a(t[0]),rows:t.slice(1).map(a)}}function Bi(e,t){const{header:a,rows:i}=$i(t),n=`<thead><tr>${a.map(r=>`<th>${g(r)}</th>`).join("")}</tr></thead>`,s=`<tbody>${i.map((r,d)=>`<tr>${r.map(o=>`<td>${g(o)}</td>`).join("")}${r.length<a.length?`<td colspan="${a.length-r.length}"></td>`:""}</tr>`).join("")}</tbody>`;return`
    <div class="csv-view">
      <div class="csv-view__header">
        <span class="small muted mono">${g(e)} — 表格檢視（Excel 樣式）</span>
        <span class="small muted">${i.length} 列 × ${a.length} 欄</span>
      </div>
      <div class="csv-view__table-wrap">
        <table class="csv-table">${n}${s}</table>
      </div>
    </div>
  `}function pe(e){if(Ee(e)){const s=document.getElementById("vsEditor");s&&(s.innerHTML='<div class="editor__lines" style="padding:16px;color:var(--fg-muted)">檔案不存在或尚未解鎖 — 嘗試 Search 搜尋 "Sawyer" 或觸發隱藏邏輯</div>');return}if(e===ve){F=e,Ce(),Me(),Le(document.getElementById("vsQuickOpen")?.value.trim().toLowerCase()||"");return}F=e,Ce();const t=k.getFile(e),a=oa(e),i=document.getElementById("vsEditor");if(!i)return;if((e==="/customer-portal/src/main/java/com/nori/OrderService.java"||e==="/customer-portal/src/billing/service.js")&&Pn("vscode_viewed"),a==null)i.innerHTML='<div class="editor__lines" style="padding:16px;color:var(--fg-muted)">檔案不存在或尚未解鎖 — 嘗試 Search 搜尋 "Sawyer" 或觸發隱藏邏輯</div>';else if(e.toLowerCase().endsWith(".csv"))i.innerHTML=Bi(e,a);else{const s=t?.meta?.lang||(e.endsWith(".py")?"python":e.endsWith(".java")?"java":"javascript");i.innerHTML=`
      <div class="editor__editable-wrap">
        <div class="editor__gutter" style="padding:12px 0;min-width:52px">${a.split(`
`).map((d,o)=>`<div class="editor__gutter-line" style="height:20px;line-height:20px">${o+1}</div>`).join("")}</div>
        <textarea id="vsEditorArea" class="editor__textarea" spellcheck="false" data-path="${g(e)}" data-lang="${s}">${g(a)}</textarea>
      </div>
    `;const r=document.getElementById("vsEditorArea");r&&(r.addEventListener("input",d=>{const o=d.target.value;xi(e,o);const c=o.split(`
`).length,m=i.querySelector(".editor__gutter");m&&(m.innerHTML=Array.from({length:c},(A,P)=>`<div class="editor__gutter-line" style="height:20px;line-height:20px">${P+1}</div>`).join(""));const p=r.selectionStart,u=o.slice(0,p),v=u.split(`
`).length,h=u.split(`
`).pop().length+1,b=document.getElementById("vsCursorInfo");b&&(b.textContent=`Ln ${v}, Col ${h}`)}),r.addEventListener("click",d=>{const o=r.selectionStart,c=r.value.slice(0,o),m=c.split(`
`).length,p=c.split(`
`).pop().length+1,u=document.getElementById("vsCursorInfo");u&&(u.textContent=`Ln ${m}, Col ${p}`)}),r.addEventListener("keydown",d=>{if(d.key==="Tab"){d.preventDefault();const o=r.selectionStart,c=r.selectionEnd;r.value=r.value.substring(0,o)+"  "+r.value.substring(c),r.selectionStart=r.selectionEnd=o+2,r.dispatchEvent(new Event("input"))}}),e.includes("OrderService")&&setTimeout(()=>r.focus(),50))}const n=document.getElementById("vsTitle");n&&(n.textContent=`${e.split("/").pop()} — ${e} — nori-system — Vizual Studio Code`),Le(document.getElementById("vsQuickOpen")?.value.trim().toLowerCase()||""),ye(),C(`$ open ${e}`)}function Ne(){const e=document.getElementById("scmChanges");if(!e)return;const t=[...R.entries()].filter(([a,i])=>i!==dt(a));if(!t.length){e.innerHTML=`<div class="small muted" style="padding:8px 0">修改完成後在這邊提交
 目前沒有變更 — 編輯後的改動會顯示於此</div>`;return}e.innerHTML=`
    <div class="small" style="font-weight:600;margin:10px 0 6px">變更 (${t.length})</div>
    ${t.map(([a])=>{const i=a.split("/").pop();return`<div class="scm__file" data-path="${g(a)}" title="${g(a)}">
        <span style="color:var(--warning)">M</span> ${g(i)} <span class="small muted" style="margin-left:auto">${g(a)}</span>
      </div>`}).join("")}
  `,e.querySelectorAll(".scm__file").forEach(a=>a.addEventListener("click",()=>pe(a.dataset.path)))}function Pi(e){const t={1:.9,2:.85,3:.8,4:.75,5:.7},a=e.split(`
`),i={};let n=null,s="";a.forEach((r,d)=>{const o=r.match(/case\s*([1-5])\s*:\s*price\s*\*=\s*([0-9.]+%?)/i);if(o){const c=parseInt(o[1],10);let m=o[2].replace("%","").trim(),p=parseFloat(m);p>1&&(p=p/100),i[c]={val:p,line:d+1,raw:r.trim()}}else{const c=r.match(/case\s*([1-5])\s*:\s*price\s*=\s*price\s*\*\s*([0-9.]+)/i);if(c){const m=parseInt(c[1],10);let p=parseFloat(c[2]);p>1&&(p=p/100),i[m]={val:p,line:d+1,raw:r.trim()}}}});for(let r=1;r<=5;r++){const d=t[r],o=i[r];if(!o)return n=a.findIndex(c=>c.includes(`case ${r}:`))+1||18+r,s=`缺少 case ${r} 或格式無法解析`,{ok:!1,line:n,detail:s,found:i};if(Math.abs(o.val-d)>.001)return{ok:!1,line:o.line,detail:`VIP${r} 應為 ${(d*100).toFixed(0)}% (0.${String(d).split(".")[1].padEnd(2,"0")})，目前為 ${(o.val*100).toFixed(0)}%`,found:i}}return{ok:!0,found:i}}function ji(){const e=document.getElementById("scmCommitMsg"),t=document.getElementById("scmCommitStatus"),a=e?.value.trim()||"fix: correct VIP discount";if(![...R.entries()].filter(([E,_])=>_!==dt(E)).length){t&&(t.textContent="沒有變更可提交 — 請先編輯 OrderService.java");return}const i="/customer-portal/src/main/java/com/nori/OrderService.java",n=oa(i);if(n==null){t&&(t.textContent="找不到 OrderService.java");return}const s=Pi(n);if(!s.ok){const E=document.getElementById("sonarModal"),_=document.getElementById("sonarModalBody");_&&(_.textContent=`SonarQube 掃描失敗 — 計算錯誤

檔案: ${i}
行號: ${s.line}
錯誤: ${s.detail}

規則: VIP 折扣應為 VIP1 90%、VIP2 85%、VIP3 80%、VIP4 75%、VIP5 70%

請修正後重新 Commit。`),E&&(E.style.display="flex"),t&&(t.innerHTML=`<span style="color:var(--error)">✕ SonarQube: 行 ${s.line} 計算錯誤</span>`),C(`✕ commit 失敗 — SonarQube 行 ${s.line}: ${s.detail}`);return}const r="/file-system/src/components/SearchBar.jsx",d=dt(r)||"",o=oa(r)||d,c=o.includes("legacyRoutes"),m=o.includes("resolveLegacyPath"),p=d.includes("legacyRoutes")&&!c&&!m;if(Array.from(R.keys()).includes(r),l.hasFlag("ch0_vip_fixed")&&!l.hasFlag("ch1_0043_committed")&&!p){const E=document.getElementById("sonarModal"),_=document.getElementById("sonarModalBody");_&&(_.textContent=`SonarQube 掃描失敗 — 未移除已棄用的 legacy 入口

檔案: ${r}
錯誤: 偵測到未移除的 legacyRoutes / resolveLegacyPath 區塊`),E&&(E.style.display="flex"),t&&(t.innerHTML='<span style="color:var(--error)">✕ SonarQube: 尚未移除 legacyRoutes 區塊 (SearchBar.jsx)</span>');return}if(p&&l.hasFlag("ch0_vip_fixed")&&!l.hasFlag("ch1_0043_committed")){let w=function({appSub:y,sender:f,avatarBg:B,avatarText:L,msg:z,chatId:_e,duration:at}){if(_e&&cn(_e))return;const qe=at||4e3,N=document.createElement("div");return N.id="wa-win-notif-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),N.setAttribute("role","alert"),N.innerHTML=`<div class="win-notif__app"><img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">${g(y)}</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:${B}">${g(L)}</div><div class="win-notif__text"><div class="win-notif__sender">${g(f)}</div><div class="win-notif__msg">${g(z)}</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink ${qe}ms linear forwards"></div>`,N.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",N.addEventListener("click",Ae=>{Ae.target.closest(".win-notif__close")||(N.remove(),$(()=>Promise.resolve().then(()=>re).then(we=>{we.setActiveView&&(we.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),_e&&$(()=>Promise.resolve().then(()=>ce).then(we=>we.openChat(_e)),void 0))}),N.querySelector(".win-notif__close")?.addEventListener("click",Ae=>{Ae.stopPropagation(),N.remove()}),document.body.appendChild(N),requestAnimationFrame(()=>{N.style.opacity="1",N.style.transform="none"}),setTimeout(()=>{N.style.opacity="0",N.style.transform="translateY(8px)",setTimeout(()=>N.remove(),300)},qe),N};l.setFlag("ch1_0043_committed",!0);const E=Math.random().toString(36).slice(2,8),_=Array.from(R.entries()).map(([y,f])=>`M ${y}`).join(`
`);de.unshift({hash:E,author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:_}),se.unshift({hash:E,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:_});for(const[y,f]of R.entries()){const B=k.getFile(y);B&&(B.content=f),k.registerFile(y,{content:f,meta:{lang:y.endsWith(".java")?"java":y.endsWith(".js")?"javascript":"text"}})}R.clear(),e&&(e.value=""),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功: ${E}</span>`),C(`✓ commit ${E} — ${a}`),Ce(),ye(),Le(),Ne(),fe&&F===ve&&Me();try{$(()=>Promise.resolve().then(()=>ht).then(y=>y.markTicketDone&&y.markTicketDone("INV-2024-0043")),void 0)}catch{}setTimeout(()=>{l.setFlag("ch1_system_down",!0);let y=0;const f=setInterval(()=>{if(!l.hasFlag("ch1_system_down")||l.hasFlag("ch1_revert_done")){clearInterval(f);return}y++,$(()=>Promise.resolve().then(()=>ce).then(B=>{const L=(B.getChats?B.getChats():[]).find(z=>z.id==="system-alert");if(L){const z=`⚠️ 警告 #${y}: 系統異常 — 檢測到異常，請檢查最近變更`;L.messages.push({id:"alert-"+Date.now()+"-"+y,from:"system",text:z,time:"今天",ts:Date.now(),read:"delivered",type:"text"}),L.preview=`⚠️ 警告 #${y}: 系統異常`,L.unread=(L.unread||0)+1,L.lastTime="今天",window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"system-alert"}}))}w({appSub:"System Alert",sender:"System Alert",avatarBg:"linear-gradient(135deg, #d93025, #fbbc05)",avatarText:"!",msg:`⚠️ 警告 #${y}: 系統異常 — 檢測到異常`,chatId:"system-alert",duration:4e3})}),void 0),y===5&&(setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(B=>{const L=(B.getChats?B.getChats():[]).find(z=>z.id==="dev-team");L&&(L.messages.push({id:"sawyer-dev-"+Date.now(),from:"Sawyer",text:"各位，系統怎麼一直在告警？發生什麼事了？是誰剛才改了什麼？",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),L.preview="Sawyer: 系統怎麼一直在告警？",L.lastTime="今天",L.unread=(L.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"dev-team"}})),w({appSub:"Dev Team",sender:"Sawyer",avatarBg:"linear-gradient(135deg, #722F37, #8B1A1A)",avatarText:"S",msg:"各位，系統怎麼一直在告警？發生什麼事了？",chatId:"dev-team",duration:4e3}))}),void 0)},500),setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(B=>{const L=(B.getChats?B.getChats():[]).find(z=>z.id==="dev-team");L&&(L.messages.push({id:"maggie-dev-"+Date.now(),from:"Maggie",text:"好像是剛才 INV-2024-0043 的修改，應該是最後一次變更就是這個任務",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),L.preview="Maggie: 好像是 0043 的修改...",L.lastTime="今天",L.unread=(L.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"dev-team"}})),w({appSub:"Dev Team",sender:"Maggie",avatarBg:"linear-gradient(135deg, #25D366, #128C7E)",avatarText:"M",msg:"好像是 INV-2024-0043 的修改，最後一次變更就是這個",chatId:"dev-team",duration:4e3}))}),void 0)},5500),setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(B=>{const L=(B.getChats?B.getChats():[]).find(z=>z.id==="sawyer");L&&(L.messages.push({id:"sawyer-pm-"+Date.now(),from:"Sawyer",text:"Casey，麻煩你先把 0043 的改動 revert 吧，系統要緊，先回滾再說",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),L.preview="Sawyer: 麻煩你先把 0043 revert",L.lastTime="今天",L.unread=(L.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),w({appSub:"Sawyer",sender:"Sawyer",avatarBg:"linear-gradient(135deg, #722F37, #8B1A1A)",avatarText:"S",msg:"Casey，麻煩你先把 0043 的改動 revert 吧",chatId:"sawyer",duration:4e3}),B.startSawyerRevertSeq&&(B.startSawyerRevertSeq(),fe&&setTimeout(()=>Me(),200)))}),void 0)},10500))},5e3)},5e3);return}const u=c&&m&&l.hasFlag("ch1_system_down")&&!l.hasFlag("ch1_revert_done"),v=a.toLowerCase().includes("revert")&&l.hasFlag("ch1_system_down")&&!l.hasFlag("ch1_revert_done");if(u||v){if(u)for(const[y,f]of R.entries()){k.registerFile(y,{content:f,meta:{lang:y.endsWith(".js")?"javascript":y.endsWith(".java")?"java":"text"}});const B=k.getFile(y);B&&(B.content=f)}else if(ga(),Fe){k.registerFile("/file-system/src/components/SearchBar.jsx",{content:Fe,meta:{lang:"javascript"}});const y=k.getFile("/file-system/src/components/SearchBar.jsx");y&&(y.content=Fe)}l.setFlag("ch1_revert_done",!0),l.setFlag("ch1_system_down",!1);const E=Math.random().toString(36).slice(2,8),_=u,w=_?`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes / resolveLegacyPath (paste back)`:"M revert 0043";de.unshift({hash:E,author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:w}),se.unshift({hash:E,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:w}),R.clear(),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功 (revert): ${E}</span>`),C(`✓ commit ${E} — ${a} (revert)`),Ce(),ye(),Le(),Ne(),fe&&Me(),on(_?"paste-back":"keyword");try{$(()=>Promise.resolve().then(()=>ht).then(y=>{const f=y.getTickets().find(B=>B.key==="INV-2024-0043");f&&(f.status="Done",f.history.push({from:"To Do",to:"Done",by:"Casey",at:new Date().toISOString().slice(0,10)}))}),void 0)}catch{}return}const h=Math.random().toString(36).slice(2,8),b=new Date().toISOString().slice(0,10),A="Casey",P=`M ${i}
`+Object.entries(s.found).map(([E,_])=>`  case ${E}: price*=${_.val.toFixed(2)}`).join(`
`);de.unshift({hash:h,author:A,date:b,msg:a,diff:P}),se.unshift({hash:h,branch:"main",author:A,date:b,msg:a,diff:P});const oe=k.getFile(i);oe&&(oe.content=n),k.registerFile(i,{content:n,meta:{lang:"java"}}),R.clear(),e&&(e.value=""),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功: ${h}</span>`),C(`✓ commit ${h} — ${a}`),Ce(),ye(),Le(),Ne(),fe&&F===ve&&Me();try{$(()=>Promise.resolve().then(()=>ht).then(E=>{E.markTicketDone?E.markTicketDone("INV-2024-0042"):E.completeVipTicket&&E.completeVipTicket()}),void 0)}catch{}l.setFlag("ch0_vip_fixed",!0),l.setFlag("onboarding_done",!0),setTimeout(()=>{$(()=>Promise.resolve().then(()=>re).then(E=>{E.setActiveView&&(E.setActiveView("jira"),localStorage.setItem("cc_active_view","jira"))}),void 0).catch(()=>{localStorage.setItem("cc_active_view","jira"),document.querySelectorAll(".view").forEach(E=>E.classList.toggle("active",E.id==="view-jira")),document.querySelectorAll(".taskbar__app").forEach(E=>E.classList.toggle("active",E.dataset.view==="jira"))}),setTimeout(()=>{const E=new CustomEvent("jira:refresh");window.dispatchEvent(E)},100)},400)}function Mi(){C('tip: 在 editor 搜尋 "calculateVipPrice" 找到 VIP 折扣邏輯'),C("tip: 編輯 OrderService.java 後至 Source Control 提交"),C("輸入 help 查看可用指令 · Tab 補全 · ↑↓ 歷史")}function C(e){const t=document.getElementById("vsTerminalHist"),a=document.getElementById("vsTerminal"),i=t||a;if(!i)return;const n=document.createElement("div");n.className="terminal__line",n.textContent=e,i.appendChild(n),t&&(t.scrollTop=t.scrollHeight),a&&(a.scrollTop=a.scrollHeight)}function Di(e){const t=e.target,a=t.value;if(e.key==="Enter"){const i=a.trim();if(!i)return;$e.push(i),ue=$e.length,C(`➜ ${i}`),Ni(i),t.value="",Ft=""}else if(e.key==="ArrowUp")e.preventDefault(),ue<=0?ue=0:ue--,Ft===""&&$e[ue]!==void 0&&(Ft=a),$e[ue]!==void 0&&(t.value=$e[ue]);else if(e.key==="ArrowDown")e.preventDefault(),ue++,ue>=$e.length?(ue=$e.length,t.value=Ft):t.value=$e[ue];else if(e.key==="Tab"){e.preventDefault();const i=Fi(a);i&&(t.value=i)}}function Fi(e){const t=["help","ls","cat ","grep ","git log","git diff","git blame","clear","echo "],a=k.listFiles("/customer-portal").filter(o=>!Ee(o.path)).map(o=>o.path),i=[...t,...a,...a.map(o=>o.split("/").pop())];if(!e)return e;const n=i.find(o=>o.startsWith(e));if(n)return n;const s=e.split(" "),r=s[s.length-1];if(!r)return e;const d=i.find(o=>o.endsWith(r)||o.includes(r));return d?(s[s.length-1]=d.split(" ").pop(),s.join(" ")):e}function Ni(e){const[t,...a]=e.split(/\s+/),i=a.join(" ");switch(t){case"help":C("可用指令: ls [path], cat <file>, grep <keyword>, git log, git diff, git blame <file>, clear, echo <text>"),C("範例: cat /customer-portal/src/main/java/com/nori/OrderService.java");break;case"ls":{const n=a[0]||"/customer-portal";if(n.startsWith("/intranet")||n==="/intranet"){C(`ls: ${n}: 權限不足（內網資料已從 Vizual Studio Code 隱藏）`);break}const s=k.listFiles(n).filter(r=>r.path.startsWith("/customer-portal")&&!Ee(r.path));s.length?s.slice(0,20).forEach(r=>C(r.path)):C(`ls: ${n}: No such directory`),s.length>20&&C(`... ${s.length-20} more`);break}case"cat":{const n=a[0];if(!n){C("cat: 缺少檔案路徑");break}if(n.startsWith("/intranet")){C(`cat: ${n}: 權限不足（內網資料已從 Vizual Studio Code 隱藏，僅顯示官網系統）`);break}if(Ee(n)||Ee("/customer-portal"+(n.startsWith("/")?"":"/")+n)){C(`cat: ${n}: 檔案不存在或尚未解鎖`);break}const s=k.readFile(n)||k.readFile("/customer-portal"+(n.startsWith("/")?"":"/")+n);s==null?C(`cat: ${n}: 檔案不存在或尚未解鎖`):s.split(`
`).slice(0,80).forEach(r=>C(r));break}case"grep":{const n=i||a[0];if(!n){C("grep: 缺少關鍵字");break}const s=k.searchContent(n).filter(r=>r.path.startsWith("/customer-portal")&&!Ee(r.path));s.length?(C(`grep "${n}" 找到 ${s.length} 筆:`),s.slice(0,10).forEach(r=>C(`${r.path}: ${r.snippet.slice(0,80)}...`))):C(`grep: "${n}" 無結果（僅搜尋 customer-portal/file-system 官網系統）`);break}case"git":if(a[0]==="log")de.forEach(n=>{C(`commit ${n.hash} (${n.date}) ${n.author}`),C(`    ${n.msg}`)});else if(a[0]==="diff")de[1].diff.split(`
`).forEach(n=>{C(n)}),C("hint: 點擊 Source Control 右上角的 Git Graph 按鈕查看完整圖像化歷史");else if(a[0]==="blame"){const n=a[1]||F;C(`blame ${n}:`),(ja[n]||ja["/customer-portal/src/billing/service.js"]).forEach(s=>C(`${String(s.line).padStart(3)} ${s.commit} ${s.author}`))}else a[0]==="graph"?(dn(),C("→ 已開啟 Git Graph 編輯器分頁")):C("git: 未知子指令，試 help (支援: git log / git diff / git blame / git graph)");break;case"clear":{const n=document.getElementById("vsTerminalHist");n&&(n.innerHTML="");break}case"echo":C(i);break;default:C(`zsh: command not found: ${t} (試 help)`)}}function Oi(){document.addEventListener("keydown",e=>{const t=e.ctrlKey||e.metaKey;if(e.key==="F1"){e.preventDefault();const a=document.getElementById("vsHelpOverlay");a&&(a.style.display=a.style.display==="flex"?"none":"flex");return}if(t&&e.key.toLowerCase()==="p"&&!e.shiftKey)e.preventDefault(),Hi();else if(t&&e.shiftKey&&e.key.toLowerCase()==="f")e.preventDefault(),Z="search",Ht(),document.getElementById("vsSearchInput")?.focus();else if(t&&e.shiftKey&&e.key.toLowerCase()==="g")e.preventDefault(),Z="scm",Ht();else if(t&&e.shiftKey&&e.key.toLowerCase()==="d")e.preventDefault(),Z="debug",Ht();else if(e.key==="Escape"){bt();const a=document.getElementById("vsHelpOverlay");a&&(a.style.display="none");const i=document.getElementById("sonarModal");i&&(i.style.display="none")}else t&&e.key==="/"&&(e.preventDefault(),document.getElementById("vsTerminalInput")?.focus())})}function Hi(){const e=document.getElementById("quickOpen"),t=document.getElementById("quickOpenInput");!e||!t||(e.classList.add("open"),t.value="",t.focus(),pn(""))}function bt(){document.getElementById("quickOpen")?.classList.remove("open")}function pn(e){const t=document.getElementById("quickOpenList");if(!t)return;const a=(e||"").trim().toLowerCase();let i=k.listFiles("/customer-portal").filter(s=>!Ee(s.path)),n=null;if(a.includes(":")){const[s,r]=a.split(":");n=parseInt(r,10),i=i.filter(d=>d.path.toLowerCase().includes(s))}else a&&(i=i.filter(s=>s.path.toLowerCase().includes(a)));if(i=i.slice(0,10),!i.length){t.innerHTML='<div class="quickopen__item muted">無符合檔案 — 試輸入 OrderService / billing</div>';return}t.innerHTML=i.map((s,r)=>`
    <div class="quickopen__item ${r===0?"active":""}" data-path="${s.path}">
      <span>${g(s.path)}</span>
      <span class="quickopen__kbd">${s.path.split(".").pop()}</span>
    </div>
  `).join(""),t.querySelectorAll(".quickopen__item").forEach(s=>{s.addEventListener("click",()=>{pe(s.dataset.path),n&&Ri(n),bt()})})}function Vi(e){if(e.key==="Escape"){bt();return}if(e.key==="Enter"){const t=document.querySelector("#quickOpenList .quickopen__item.active")||document.querySelector("#quickOpenList .quickopen__item");t&&(pe(t.dataset.path),bt());return}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=[...document.querySelectorAll("#quickOpenList .quickopen__item")];if(!t.length)return;let a=t.findIndex(i=>i.classList.contains("active"));t[a]?.classList.remove("active"),a=e.key==="ArrowDown"?Math.min(a+1,t.length-1):Math.max(a-1,0),a<0&&(a=0),t[a]?.classList.add("active")}}function Ri(e){const t=document.getElementById("vsEditorArea");if(t){const n=t.value.split(`
`);let s=0;for(let r=0;r<Math.min(e-1,n.length);r++)s+=n[r].length+1;t.focus(),t.setSelectionRange(s,s);return}const a=document.getElementById("vsEditor");if(!a)return;const i=a.querySelector(`[data-ln="${e}"]`);i&&i.scrollIntoView({behavior:"smooth",block:"center"})}var ht=ua({addTicket0043:()=>mn,getTickets:()=>Yi,markTicketDone:()=>Ji,mountJira:()=>ha}),ae=[{key:"INV-2024-0017",title:"官網首頁文案顯示錯誤 — Hero 標語與成立年份顯示錯誤",status:"Done",assignee:"Parker",priority:"Medium",points:2,epic:"Frontend",desc:`【問題描述】
官網首頁 Hero 區塊與頁尾「關於 Nori」區塊文案顯示錯誤：
1. Hero 主標語顯示為「用一杯冰釀茶酒，連結人與希望」應為「用一杯冰釀茶酒，連結人與風味」
2. 公司成立年份顯示為「2018 創立」應為「2019 創立」
導致品牌調性不一致，客戶對公司歷史產生誤解，且與公司登記資料（2019-05 創立）不符。

【復現步驟】
1. 以訪客身份開啟官網首頁 https://nori.example/
2. 檢視首頁 Hero 區塊主標語（位於 /customer-portal/src/frontend/src/pages/Home.jsx）
3. 實際顯示：「Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望」
4. 捲動至頁尾「關於 Nori」區塊，查看成立年份文字
5. 實際顯示：「創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷」
6. 對比 /intranet/company_public/公司簡介.md 記載：2019 年 5 月創立

【預期結果 vs 實際結果】
預期：Hero 應顯示「連結人與風味」、年份應為 2019
實際：顯示「連結人與希望」、年份為 2018
檔案：/customer-portal/src/frontend/src/pages/Home.jsx 第 3-4 行

【影響範圍】
- 影響所有訪客首頁體驗（100% 流量），品牌文案錯誤
- SEO 與對外文宣不一致，可能被客戶截圖質疑專業度
- 無金流或資安影響，但影響品牌信任與對外一致性
- 嚴重度：中（Medium）／優先度：中

【根本原因】
Home.jsx 寫死文案時誤植，2018 為草稿年份未更新至 2019；slogan 複製貼上時將「風味」錯植為「希望」。

【修復方案】
由 Parker 將 Home.jsx 文案修正為「2019 創立」與「連結人與風味」，並提交 commit，經 Maggie 驗收後關閉。`,comments:["Maggie: @Parker 這個首頁文案客戶有反應，Hero 那句「連結人與希望」應該是「連結人與風味」，還有年份 2018 應為 2019，麻煩幫忙修一下。檔案在 /customer-portal/src/frontend/src/pages/Home.jsx，改完記得 commit。","Parker: 收到，已定位到 Home.jsx 第 3-4 行，slogan 與年份寫死錯誤，已修正並 commit。","Maggie: 確認修好，本地驗證 Hero 顯示「風味」、年份 2019 正確，已關單。感謝！"],attachments:[{name:"Home.jsx",type:"jsx",snippet:"export default function Home(){ <h1>...連結人與希望</h1> <p>2018 創立</p> } // 應為 風味 / 2019"},{name:"公司簡介.md",type:"md",snippet:"成立時間：2019 年 5 月 — 與首頁 2018 不一致"},{name:"Home.jsx (fixed)",type:"jsx",snippet:`+ <h1>...連結人與風味</h1>
+ <p>2019 創立</p> // Parker fix 2024-02-14`}],history:[{from:"—",to:"To Do",by:"Maggie",at:"2024-02-14"},{from:"To Do",to:"In Progress",by:"Maggie",at:"2024-02-14"},{from:"In Progress",to:"Done",by:"Parker",at:"2024-02-15"}]},{key:"INV-2024-0042",title:"修正 VIP 折扣計算錯誤 — VIP1 應為 90% 非 95%",status:"To Do",assignee:"Casey",priority:"High",points:3,epic:"Billing",desc:`【問題描述】
VIP 用戶訂單金額計算錯誤：目前 VIP 等級折扣比預期少 5%，導致 VIP 用戶實際支付過高。

【復現步驟】
1. 以 VIP1 身份建立訂單 (金額 1000)
2. 實際扣款為 950 (95%)，預期應為 900 (90%)
3. VIP2~VIP5 同樣偏移 5%

【正確對照】
VIP1 → 90% (0.90)
VIP2 → 85% (0.85)
VIP3 → 80% (0.80)
VIP4 → 75% (0.75)
VIP5 → 70% (0.70)

`,comments:[`Maggie: @Casey 麻煩幫忙修一下，估計是/customer-portal/src/main/java/com/nori/OrderService.java裡vip折扣計算錯誤了
看一下switch case, 如果忘了如何修正，可以看一下我跟你的對話。記得要Commit這張單才會完成。`],attachments:[{name:"OrderService.java",type:"java",snippet:"switch(vipLv){case 1: price*=0.95; break;... // VIP1 應為 0.90"},{name:"vip-discount-spec.md",type:"md",snippet:"VIP1 90% | VIP2 85% | VIP3 80% | VIP4 75% | VIP5 70%"}],history:[{from:"—",to:"To Do",by:"Maggie",at:"2024-09-02"}]},{key:"INV-2024-0039",title:"Payment Gateway Integration v3",status:"In Progress",assignee:"Jessie",priority:"Medium",points:8,epic:"Payment",desc:`接入新的支付網關，注意 feeRate 配置來自 drinkId 映射 (drink-001/drink-002/drink-003)。

風險：需確保費率與後端一致。`,comments:[],attachments:[{name:"feeRate-mapping.json",type:"json",snippet:'{"drink-001":0.05,"drink-002":0.08,"drink-003":0.03,"default":0.03}'}],history:[{from:"To Do",to:"In Progress",by:"Jessie",at:"2024-08-09"}]},{key:"INV-2019-0003",title:"人力資源系統 — 開發票與薪資模組整合",status:"Done",assignee:"deleted user",priority:"High",points:3,epic:"HR",desc:"人力資源管理系統位於 /internal/portal。庫存已同步, 有權限的員工才能進入此內部系統。",comments:["deleted user: 開發完成, 可進行測試","Sawyer: 此系統有bug, 單純按下進行按鈕沒有反應, 多次點擊主標題後才能進入頁面, 請進行修正","deleted user: 已修正完成, 請再進行測試","Sawyer: 測試通過, 可正式啟用"],attachments:[{name:"ScreenRecord_20191014.mp4",type:"mp4",snippet:"測試影片：人力資源系統進入失敗"}],history:[{from:"To Do",to:"Done",by:"deleted user",at:"2019-10-15"}]},{key:"INV-2024-0033",title:"報表顯示金額錯誤 — 需修正小數點四捨五入",status:"To Do",assignee:"Parker",priority:"Medium",points:3,epic:"Sprint",desc:`路徑: 後台 > 報表查詢 > filter: 原材料支出 
JQL: sprint = 24 AND status != Done`,comments:[],attachments:[],history:[]},{key:"INV-2020-0003",title:"人力資源系統 — 關閉系統",status:"Done",assignee:"deleted user",priority:"High",points:3,epic:"HR",desc:"人力資源管理系統將遷移到Zero System, 此系統將永久關閉。關閉前需確保所有資料已成功備份到新系統",comments:["deleted user: 已完成關閉"],attachments:[],history:[{from:"To Do",to:"Done",by:"deleted user",at:"2020-02-28"}]}],Nt=null,_t="all",wt="";function Oe(){try{l.set("jiraTicketsData",JSON.parse(JSON.stringify(ae))),l.set("jiraMeta",{activeSwimlane:_t,currentFilter:wt}),l.save(!0)}catch{}}function qi(){try{const e=l.get("jiraTicketsData");if(Array.isArray(e)&&e.length){ae.length=0;for(const a of e)ae.push(a)}else if((l.hasFlag("ch1_event1_triggered")||l.get("jiraTickets")&&l.get("jiraTickets")["INV-2024-0043"])&&!ae.some(a=>a.key==="INV-2024-0043")){mn();return}const t=l.get("jiraMeta");if(t&&typeof t=="object"&&(typeof t.activeSwimlane=="string"&&(_t=t.activeSwimlane),typeof t.currentFilter=="string"&&(wt=t.currentFilter)),l.hasFlag("ch0_vip_fixed")){const a=ae.find(i=>i.key==="INV-2024-0042");a&&a.status!=="Done"&&(a.status="Done")}if(l.hasFlag("ch1_0043_committed")){const a=ae.find(i=>i.key==="INV-2024-0043");a&&a.status!=="Done"&&(a.status="Done")}}catch{}}function ha(){qi();const e=document.getElementById("view-jira");e&&(e.innerHTML=`
    <div class="jira">
      <div class="jira__app">
        <nav class="jira__sidebar" aria-label="Jiua project navigation">
          <div class="jira__sidebar-logo" title="Jiua">JU</div>
          <div class="jira__sidebar-nav">
            <div class="jira__sidebar-item active" title="看板 Board"><i class="fa-solid fa-table-columns"></i><span>看板</span></div>
            <div class="jira__sidebar-item" title="待辦清單"><i class="fa-solid fa-list-check"></i><span>清單</span></div>
            <div class="jira__sidebar-item" title="時程表"><i class="fa-solid fa-chart-gantt"></i><span>時程</span></div>
            <div class="jira__sidebar-item" title="程式碼"><i class="fa-solid fa-code"></i><span>程式碼</span></div>
          </div>
          <div class="jira__sidebar-bottom">
            <div class="jira__sidebar-item" title="設定"><i class="fa-solid fa-gear"></i></div>
            <div class="jira__sidebar-item" title="說明"><i class="fa-solid fa-circle-question"></i></div>
          </div>
        </nav>
        <div class="jira__main">
          <header class="jira__header">
            <div class="jira__breadcrumbs">
              <a>專案</a><span class="sep">/</span><a>Nori Drinks Supply</a><span class="sep">/</span><a>NOR</a><span class="sep">/</span><b style="color:#1291ff">Nori Board</b>
            </div>
            <div class="jira__header-row">
              <div class="jira__board-title"><i class="fa-solid fa-table-columns"></i> Nori Board <span class="badge">Sprint 24</span><span class="badge badge--count">5 tickets</span></div>
              <div class="jira__header-actions">
                <button class="jira__header-btn"><i class="fa-solid fa-share-nodes"></i> 分享</button>
                <button class="jira__header-btn primary"><i class="fa-solid fa-plus"></i> 建立</button>
              </div>
            </div>
            <div class="jira__board-nav">
              <a class="active">看板</a><a>清單</a><a>日曆</a><a>時間軸</a><a>摘要</a>
            </div>
          </header>
          <div class="jira__toolbar">
            <input id="jiraSearch" class="input" placeholder="搜尋 / JQL: status = &quot;To Do&quot; AND text ~ &quot;420&quot;  |  assignee = 你" style="min-width:280px;flex:1;max-width:420px" />
            <select id="jiraAssignee" class="select" style="width:140px">
              <option value="">全部經辦人</option>
              <option value="你">你</option>
              <option value="Casey">Casey</option>
              <option value="finance-bot">finance-bot</option>
              <option value="ops">ops</option>
            </select>
            <select id="jiraSwimlane" class="select" style="width:140px">
              <option value="all">群組：無</option>
              <option value="assignee">群組：經辦人</option>
              <option value="epic">群組：Epic</option>
            </select>
            <span class="small muted" style="margin-left:auto;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-circle-info"></i> JQL: <code>key = INV-2024-0042</code></span>
          </div>
          <div class="jira__meta">
            <span>拖拉卡片可在 To Do ↔ In Progress ↔ Done 間移動（模擬真實看板）· 點擊卡片看詳情</span>
            <span>範例：<code>status = "Done"</code> · <code>assignee = 你 AND text ~ "drink"</code></span>
          </div>
          <div id="jiraBoard" class="jira__board"></div>
        </div>
      </div>
      <div id="jiraDetailBackdrop" class="jira__backdrop" style="display:none"></div>
      <div id="jiraDetail" class="jira__detail" style="display:none"></div>
    </div>
  `,zi(),He(),document.getElementById("jiraDetailBackdrop")?.addEventListener("click",()=>{document.getElementById("jiraDetail").style.display="none",document.getElementById("jiraDetailBackdrop").style.display="none"}))}function zi(){document.getElementById("jiraSearch")?.addEventListener("input",e=>{wt=e.target.value,Oe(),He()}),document.getElementById("jiraAssignee")?.addEventListener("change",e=>{wt=document.getElementById("jiraSearch").value,Oe(),He()}),document.getElementById("jiraSwimlane")?.addEventListener("change",e=>{_t=e.target.value,Oe(),He()})}function Ui(e){if(!e.trim())return()=>!0;const t=e.split(/\s+AND\s+/i).map(a=>{const i=a.match(/^\s*(status|assignee|key|epic|text|priority)\s*(=|~)\s*"?([^"]+)"?\s*$/i);if(!i){const o=a.toLowerCase().replace(/["']/g,"");return c=>(c.key+c.title+c.desc+c.assignee+c.epic).toLowerCase().includes(o)}const[,n,s,r]=i,d=r.trim().replace(/^"|"$/g,"").toLowerCase();return o=>{const c=n.toLowerCase();let m="";return c==="status"?m=o.status.toLowerCase():c==="assignee"?m=o.assignee.toLowerCase():c==="key"?m=o.key.toLowerCase():c==="epic"?m=o.epic.toLowerCase():c==="priority"?m=o.priority.toLowerCase():c==="text"&&(m=(o.key+" "+o.title+" "+o.desc).toLowerCase()),s==="="?m===d:m.includes(d)}});return a=>t.every(i=>i(a))}function He(){const e=document.getElementById("jiraBoard");if(!e)return;const t=document.getElementById("jiraAssignee")?.value||"",a=Ui(wt);let i=ae.filter(n=>a(n));if(t&&(i=i.filter(n=>n.assignee===t)),_t!=="all"){const n=_t,s={};i.forEach(r=>{const d=r[n]||"未分類";s[d]||(s[d]=[]),s[d].push(r)}),e.innerHTML=Object.entries(s).map(([r,d])=>{const o={"To Do":[],"In Progress":[],Done:[]};return d.forEach(c=>o[c.status]?.push(c)),`
        <div class="jira__swimlane">
          <div class="jira__swimlane-header">Group：${r} (${d.length})</div>
          <div class="jira__board">
            ${Object.entries(o).map(([c,m])=>Da(c,m)).join("")}
          </div>
        </div>
      `}).join("")||'<div class="muted small" style="padding:12px">無符合條件的票據 — 試 JQL: status = "To Do"</div>'}else{const n={"To Do":[],"In Progress":[],Done:[]};i.forEach(s=>n[s.status]?.push(s)),e.innerHTML=Object.entries(n).map(([s,r])=>Da(s,r)).join("")}Gi()}function Da(e,t){return`
    <div class="jira__col" data-col="${e}">
      <div class="jira__col-header"><i class="${e==="To Do"?"fa-solid fa-circle":e==="In Progress"?"fa-solid fa-spinner":"fa-solid fa-circle-check"}" style="color:${e==="To Do"?"#0052cc":e==="In Progress"?"#ff991f":"#00875a"};font-size:10px"></i> ${e} <span class="count">${t.length}</span></div>
      <div class="jira__col-line"></div>
      <div class="jira__dropzone" data-col="${e}">
        ${t.map(a=>Wi(a)).join("")||'<div class="jira__empty">拖曳至此</div>'}
      </div>
    </div>
  `}function un(e){return e.key.includes("0042")||e.epic==="Billing"?{cls:"story",icon:"fa-solid fa-bookmark",label:"Story"}:e.epic==="HR"||e.key.includes("0003")?{cls:"task",icon:"fa-solid fa-square-check",label:"Task"}:e.epic==="Frontend"?{cls:"task",icon:"fa-solid fa-square-check",label:"Task"}:e.priority==="High"&&e.status!=="Done"?{cls:"bug",icon:"fa-solid fa-bug",label:"Bug"}:{cls:"story",icon:"fa-solid fa-bookmark",label:"Story"}}function Wi(e){const t=un(e),a=e.priority==="High"?"High":e.priority==="Medium"?"Medium":"Low",i=e.priority==="High"?"fa-solid fa-angle-up":e.priority==="Medium"?"fa-solid fa-equals":"fa-solid fa-angle-down",n=e.assignee?e.assignee.charAt(0).toUpperCase():"?",s=e.assignee==="Casey"?"#0052cc":e.assignee==="Parker"?"#0065ff":e.assignee==="Jessie"?"#6554c0":"#6b778c";return`
    <div class="ticket" draggable="true" data-key="${e.key}">
      <div class="ticket__top">
        <span class="ticket__type ${t.cls}" title="${t.label}"><i class="${t.icon}"></i></span>
        <span class="ticket__key">${e.key}</span>
        <span style="margin-left:auto;font-size:10px;color:#6b778c">${e.epic}</span>
      </div>
      <div class="ticket__title">${e.title}</div>
      ${e.epic?`<span class="ticket__epic">${e.epic}</span>`:""}
      <div class="ticket__meta">
        <span class="pri pri--${a}" title="${e.priority}"><i class="${i}"></i></span>
        <span class="ticket__points">${e.points}</span>
        ${e.attachments.length?`<span class="ticket__attach"><i class="fa-solid fa-paperclip"></i> ${e.attachments.length}</span>`:""}
        <span class="ticket__assignee" style="background:${s}">${n}</span>
      </div>
    </div>
  `}function Gi(){document.querySelectorAll(".ticket").forEach(e=>{e.addEventListener("dragstart",t=>{Nt=e.dataset.key,e.classList.add("dragging"),t.dataTransfer.effectAllowed="move"}),e.addEventListener("dragend",t=>{e.classList.remove("dragging"),Nt=null}),e.addEventListener("click",()=>xt(e.dataset.key))}),document.querySelectorAll(".jira__dropzone").forEach(e=>{e.addEventListener("dragover",t=>{t.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",t=>{t.preventDefault(),e.classList.remove("drag-over");const a=e.dataset.col;if(!Nt)return;const i=ae.find(s=>s.key===Nt);if(!i||i.status===a)return;const n=i.status;i.status=a,i.history.push({from:n,to:a,by:"你",at:new Date().toISOString().slice(0,10)}),l.set("jiraTickets."+i.key,!0),Oe(),He(),xt(i.key)})})}function xt(e){const t=ae.find(o=>o.key===e),a=document.getElementById("jiraDetail"),i=document.getElementById("jiraDetailBackdrop");if(!t||!a)return;l.set("jiraTickets."+e,!0),e==="INV-2024-0042"&&Pn("jiua_viewed"),i&&(i.style.display="block"),a.style.display="flex";const n=un(t),s=t.status==="Done"?"badge--done":t.status==="In Progress"?"badge--inprogress":"badge--todo";a.innerHTML=`
    <div class="jira__detail-head">
      <div style="flex:1;min-width:0">
        <div class="jira__detail-key"><span class="ticket__type ${n.cls}" style="width:18px;height:18px;font-size:10px"><i class="${n.icon}"></i></span> ${t.key} · ${t.epic}</div>
        <div class="jira__detail-title">${t.title}</div>
      </div>
      <span class="badge ${s}">${t.status}</span>
      <button class="jira__detail-close" id="jiraDetailClose" aria-label="關閉"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="jira__detail-body">
      <div class="jira__detail-main">
        <div>
          <div class="jira__detail-label">描述</div>
          <pre class="jira__detail-desc">${t.desc}</pre>
        </div>
        <div>
          <div class="jira__detail-label">附件 — ${t.attachments.length}</div>
          <div class="jira__attachments-grid" style="display:grid;gap:8px;width:100%">
            ${t.attachments.length?t.attachments.map(o=>`
              <div class="jira__detail-card" style="display:flex;justify-content:space-between;align-items:center;gap:12px;min-width:0;max-width:100%;overflow:hidden">
                <div style="min-width:0;flex:1;overflow:hidden;max-width:100%"><div style="font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-paperclip" style="color:#6b778c"></i> ${o.name}</div><div class="small" style="color:#6b778c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;display:block;min-width:0">${o.type} · ${o.snippet.slice(0,80)}</div></div>
                <button class="jira__header-btn" style="padding:4px 10px;flex-shrink:0" data-attach="${o.name}">檢視</button>
              </div>
            `).join(""):'<div class="small" style="color:#6b778c">無附件</div>'}
          </div>
        </div>
        <div>
          <div class="jira__detail-label">活動 — 評論 ${t.comments.length}</div>
          <div style="display:grid;gap:8px">
            ${t.comments.map(o=>`<div class="jira__detail-card" style="padding:10px;font-size:13px;line-height:1.5">💬 ${o}</div>`).join("")}
            ${t.comments.length?"":'<div class="small" style="color:#6b778c">尚無評論 — 成為第一個留言的人</div>'}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <div style="width:28px;height:28px;border-radius:50%;background:#0052cc;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">你</div>
            <input id="jiraCommentInput" class="input" placeholder="新增評論..." style="flex:1" />
            <button class="jira__header-btn primary" id="jiraAddComment">留言</button>
          </div>
        </div>
      </div>
      <div class="jira__detail-side">
        <div>
          <div class="jira__detail-label">詳細資訊</div>
          <div class="jira__detail-card">
            <div class="jira__detail-row"><b>狀態</b><span class="badge ${s}" style="font-size:11px">${t.status}</span></div>
            <div class="jira__detail-row"><b>經辦人</b><span>${t.assignee}</span></div>
            <div class="jira__detail-row"><b>Epic</b><span>${t.epic}</span></div>
            <div class="jira__detail-row"><b>優先度</b><span>${t.priority}</span></div>
            <div class="jira__detail-row"><b>Story points</b><span>${t.points}</span></div>
            <div class="jira__detail-row"><b>類型</b><span>${n.label}</span></div>
          </div>
        </div>
        <div>
          <div class="jira__detail-label">工作流</div>
          <div style="display:grid;gap:6px">
            ${t.history.length?t.history.map(o=>`<div class="small" style="display:flex;align-items:center;gap:6px"><span class="badge" style="font-size:11px">${o.from} → ${o.to}</span><span style="font-size:11px;color:#6b778c">by ${o.by} @ ${o.at}</span></div>`).join(""):'<div class="small" style="color:#6b778c">無歷史</div>'}
          </div>
          <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap">
            ${["To Do","In Progress","Done"].filter(o=>o!==t.status).map(o=>`<button class="jira__header-btn" data-move="${o}">移至 ${o}</button>`).join("")}
          </div>
        </div>
        <div style="margin-top:auto;padding-top:12px;border-top:1px solid #dfe1e6;display:flex;gap:8px">
          <button class="jira__header-btn" style="flex:1" id="jiraDetailClose2">關閉</button>
        </div>
      </div>
    </div>
  `,a.querySelectorAll("[data-attach]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.attach,m=t.attachments.find(p=>p.name===c);m&&alert(`${m.name}

${m.snippet}`)})}),a.querySelectorAll("[data-move]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.move,m=t.status;t.status=c,t.history.push({from:m,to:c,by:"你",at:new Date().toISOString().slice(0,10)}),Oe(),He(),xt(e)})}),document.getElementById("jiraAddComment")?.addEventListener("click",()=>{const o=document.getElementById("jiraCommentInput"),c=o?.value.trim();c&&(t.comments.push(`你: ${c}`),o.value="",Oe(),xt(e),He())});function r(){a.style.display="none";const o=document.getElementById("jiraDetailBackdrop");o&&(o.style.display="none")}document.getElementById("jiraDetailClose")?.addEventListener("click",r),document.getElementById("jiraDetailClose2")?.addEventListener("click",r),document.getElementById("jiraCommentInput")?.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),document.getElementById("jiraAddComment")?.click())});const d=o=>{o.key==="Escape"&&(r(),document.removeEventListener("keydown",d))};document.addEventListener("keydown",d)}function Ji(e){const t=ae.find(i=>i.key===e);if(!t)return!1;if(t.status==="Done")return e==="INV-2024-0042"&&!l.hasFlag("ch0_vip_fixed")&&l.setFlag("ch0_vip_fixed",!0),!0;const a=t.status;return t.status="Done",t.history.push({from:a,to:"Done",by:"Casey",at:new Date().toISOString().slice(0,10)}),l.set("jiraTickets."+e,!0),e==="INV-2024-0042"&&l.setFlag("ch0_vip_fixed",!0),e==="INV-2024-0043"&&l.setFlag("ch1_0043_committed",!0),Oe(),document.getElementById("jiraBoard")&&(He(),xt(e)),!0}function mn(){if(!ae.some(e=>e.key==="INV-2024-0043")){ae.push({key:"INV-2024-0043",title:"移除內網系統異常網頁的入口",status:"To Do",assignee:"Casey",priority:"Medium",points:2,epic:"internal system",desc:`【問題描述】使用內網系統時進入到異常網頁，移除不明網頁導向

【復現步驟】
1. 在內網系統 搜尋欄搜尋 'https://nori-intranet/internal/portal'
2. 跳轉至異常網頁
3. 需移除入口`,comments:["Maggie: @Casey 麻煩幫忙修一下，這個搜尋異常有點煩。把沒用的code整個移除就好"],attachments:[{name:"SearchBar.jsx",type:"jsx",snippet:`// Legacy filesystem compatibility
const legacyRoutes = { archive: "/internal/portal" ... } // No longer used`}],history:[{from:"—",to:"To Do",by:"Maggie",at:new Date().toISOString().slice(0,10)}]}),Oe(),document.getElementById("jiraBoard")&&window.dispatchEvent(new CustomEvent("jira:ticketAdded",{detail:"INV-2024-0043"}));try{const e=new CustomEvent("jira:refresh");window.dispatchEvent(e)}catch{}}}function Yi(){return ae}var Ie="";try{Ie=""}catch{}try{typeof window<"u"&&window.__GAS_URL&&(Ie=window.__GAS_URL)}catch{}var Ki="https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOY_ID/exec",Qi="REPLACE_WITH_YOUR_DEPLOY_ID",Xi="AKfycbwjzxPakm5HKw4hJGJWw7AZmNZSpVR28QCcxmJr7KPKCSjLcG2_Da7LgBuuGJwVruSU";function vt(e){return e?e.includes(Qi)||e.includes(Xi):!0}function Xe(){try{const e=localStorage.getItem("cc_gas_url")||"";if(e&&e.startsWith("https://")&&!vt(e))return e.trim()}catch{}try{if(typeof window<"u"&&window.__GAS_URL&&window.__GAS_URL.startsWith("https://")&&!vt(window.__GAS_URL))return window.__GAS_URL.trim()}catch{}return Ie&&Ie.startsWith("https://")&&!vt(Ie)?Ie.trim():Ki}function gn(e){try{const t=(e||"").trim();t?localStorage.setItem("cc_gas_url",t):localStorage.removeItem("cc_gas_url");try{typeof window<"u"&&(window.__GAS_URL=t)}catch{}}catch{}}function Te(){const e=Xe();return e&&e.startsWith("https://")&&!vt(e)}var qt="cc_analytics_consent",Fa="cc_sid",hn="cc_analytics_queue";function Ve(){try{return localStorage.getItem(qt)==="1"}catch{return!1}}function Vt(e){try{e?localStorage.setItem(qt,"1"):localStorage.setItem(qt,"0")}catch{}e&&setTimeout(()=>Ze(),500)}function vn(){try{const e=localStorage.getItem(qt);return e==="1"||e==="0"}catch{return!1}}function la(){try{let e=localStorage.getItem(Fa);return e||(e=crypto.randomUUID&&crypto.randomUUID()||"sid_"+Date.now()+"_"+Math.random().toString(36).slice(2,9),localStorage.setItem(Fa,e)),e}catch{return"anon_"+Date.now()}}function va(e){if(!e)return"";let t=5381;for(let a=0;a<e.length;a++)t=(t<<5)+t^e.charCodeAt(a);return(t>>>0).toString(16).padStart(8,"0")}function Zi(){let e=0,t=0,a="zh-TW";try{e=l.get("currentChapter")??0}catch{}try{t=l.get("playtime")??0}catch{}try{a=l.get("settings.language")||"zh-TW"}catch{}return{chapter:e,playtime:t,lang:a}}function Ye(){try{const e=localStorage.getItem(hn);if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function Ke(e){try{localStorage.setItem(hn,JSON.stringify(e.slice(-50)))}catch{}}function Ze(){if(!Te()||!Ve())return;const e=Ye();if(!e.length)return;const t=e.slice(0,10);Ke(e.slice(10)),t.forEach(a=>fn(a,!0))}function fn(e,t=!1){const a=Xe();if(!Te()){console.warn("[analytics] GAS_URL 未設定，跳過上報",e);return}if(!Ve()){if(!t){const n=Ye();n.push(e),Ke(n)}return}const i=JSON.stringify(e);try{if(navigator.sendBeacon){const n=new Blob([i],{type:"text/plain;charset=utf-8"});if(navigator.sendBeacon(a,n))return}}catch{}try{fetch(a,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:i,keepalive:!0,redirect:"follow",mode:"cors"}).then(n=>{if(!n.ok)throw new Error("GAS status "+n.status);t||setTimeout(()=>Ze(),1e3)}).catch(n=>{if(console.warn("[analytics] 發送失敗，已入隊重試",n),t){const s=Ye();s.unshift(e),Ke(s)}else{const s=Ye();s.push(e),Ke(s)}})}catch{const s=Ye();s.push(e),Ke(s)}}function ne(e,t={}){const a=Zi(),i=la(),n={timestamp:new Date().toISOString(),session_id:i,event_type:e,chapter:a.chapter,playtime:a.playtime,lang:a.lang,ua:typeof navigator<"u"?navigator.userAgent.slice(0,200):"",url:typeof location<"u"?location.href.slice(0,300):"",...t};if(n.payload_json&&typeof n.payload_json=="string"&&n.payload_json.length>4e3&&(n.payload_json=n.payload_json.slice(0,4e3)),!Ve()){const s=Ye();s.push(n),Ke(s);return}if(!Te()){const s=Ye();s.push(n),Ke(s),console.warn("[analytics] 已記錄至本地隊列，待設定 GAS_URL 後自動上報",n);return}fn(n)}function Xt({chatId:e,chatName:t,text:a,to:i}){const n=(a||"").slice(0,80),s=va(a||"");ne("whatsapp_send",{whatsapp_chat_id:e,whatsapp_chat_name:t||e,whatsapp_to:i||"",whatsapp_preview:n,whatsapp_hash:s,whatsapp_len:(a||"").length,payload_json:JSON.stringify({chatId:e,preview:n,len:(a||"").length})})}function es({title:e,to:t,body:a}){const i=(a||"").slice(0,80),n=va(a||"");ne("email_submit",{email_title:e||"",email_to:(t||"").slice(0,100),email_body_preview:i,email_body_hash:n,email_body_len:(a||"").length,payload_json:JSON.stringify({title:e,preview:i,len:(a||"").length})})}function yn(e){ne("ending_unlocked",{ending:e,endings:(l.get("endings")||[]).join(","),payload_json:JSON.stringify({ending:e,all:l.get("endings")})})}function ts(e){ne("chapter_changed",{chapter:e,payload_json:JSON.stringify({chapter:e})})}function as(){try{const e=localStorage.getItem("cc_gas_url")||"";e&&vt(e)&&localStorage.removeItem("cc_gas_url")}catch{}try{window.__analytics={track:ne,getConsent:Ve,setConsent:Vt,getGasUrl:Xe,setGasUrl:gn,isGasConfigured:Te,flushQueue:Ze,hashText:va,ENV_GAS_URL:Ie||"(empty)"}}catch{}try{console.log("[analytics] init",{hasConsent:Ve(),hasChoice:vn(),gasConfigured:Te(),gasUrl:Xe().slice(0,60)+(Xe().length>60?"...":""),envGasUrl:Ie?Ie.slice(0,30)+"...":"(empty - 需要在 build 時注入 VITE_GAS_URL)",localStorageUrl:typeof localStorage<"u"&&localStorage.getItem("cc_gas_url")?"已設定":"(empty)"}),Te()||console.warn(`[analytics] GAS_URL 未設定 → 請用以下任一方式設定:
  1) 遊戲內 設定 → 數據追蹤 貼上 URL (立即生效)
  2) 瀏覽器 Console: localStorage.setItem("cc_gas_url","你的exec URL"); location.reload()
  3) GitHub Secrets VITE_GAS_URL (需透過 workflow 在 build 時注入，見 gas/README.md)`)}catch{}setTimeout(()=>Ze(),1500);try{window.addEventListener("online",()=>Ze())}catch{}}var ce=ua({closeWaLightbox:()=>Rt,getChats:()=>ps,markNoriAllRead:()=>ba,mountWhatsApp:()=>bn,openChat:()=>tt,openWaLightbox:()=>kn,startSawyerRevertSeq:()=>us,triggerCh1Event1:()=>cs,triggerCh1Event2:()=>Ut,triggerCh2LunchSequence:()=>_a}),M=[{id:"nori-all",name:"Nori 全體",avatar:"🏢",desc:"Nori 全體員工群組",members:["Sawyer","Casey","Maggie","Taylor","Aiko","all"],preview:"Leo:謝謝安排！",locked:!1,pinned:!0,muted:!1,archived:!1,unread:0,lastTime:"2023-06-15",messages:[{id:"m1",from:"Sawyer",text:"各位同事，好消息！我中了六合彩二獎，決定將獎金全數投入公司資金，一起加油！",time:"2023-06-15",read:"read",type:"text"},{id:"m2",from:"Taylor",text:"恭喜老闆！祝以後都順順利利！",time:"2023-06-15",read:"read",type:"text"},{id:"m3",from:"Aiko",text:"太棒了！老闆威武！",time:"2023-06-15",read:"read",type:"text"},{id:"m4",from:"Maggie",text:"恭喜老闆！",time:"2023-06-15",read:"read",type:"text"},{id:"m5",from:"Parker",text:"運也太好了吧？！",time:"2023-06-15",read:"read",type:"text"},{id:"m6",from:"Sawyer",text:"各位同事，告訴大家一個好消息，剛跟可樂樂公司談成一大生意，結為長期合作伙伴。為慶祝近來公司發展順利，決定舉辦晚上派對，詳細資訊稍後公布！",time:"2023-11-01",read:"read",type:"text"},{id:"m7",from:"Aiko",text:"哇！！太好了，一定會去！",time:"2023-11-01",read:"read",type:"text"},{id:"m8",from:"Taylor",text:"太棒了！",time:"2023-11-01",read:"read",type:"text"},{id:"m9",from:"Maggie",text:"恭喜老闆！",time:"2023-11-01",read:"read",type:"text"},{id:"m10",from:"Hugo",text:"一輩子跟隨您！",time:"2023-11-01",read:"read",type:"text"},{id:"m11",from:"Taylor",text:`各位同事，慶祝公司發展順利, 將於11月22日下班後舉辦派對
以下為詳細資訊：
日期：11月22日（五） 
時間：19:00-23:00
地點：辨公室旁邊的利利大樓18樓004室

可自由組隊前行`,time:"2023-11-04",read:"read",type:"text"},{id:"m12",from:"Sawyer",text:"謝謝Taylor的安排，請各位盡情享受！",time:"2023-11-04",read:"read",type:"text"},{id:"m13",from:"Leo",text:"謝謝安排！",time:"2023-11-04",read:"read",type:"text"}]},{id:"system-alert",name:"System Alert",avatar:"🚨",desc:"系統監控告警",members:["system","Sawyer","Maggie","Parker",,"Casey"],preview:"✅ 系統健康",locked:!1,pinned:!0,muted:!1,archived:!1,unread:0,lastTime:"今天",messages:[{id:"m1",from:"system",text:"✅ 系統健康 — 所有服務正常",time:"今天",read:"read",type:"text"}]},{id:"sawyer",name:"Boss Sawyer",avatar:"👔",desc:"Sawyer · 創辦人",phone:"+852 9123 4567",preview:"Sawyer: Casey，歡迎來到Nori Limited",locked:!1,pinned:!1,muted:!1,archived:!1,unread:0,lastTime:"2024-07-15",messages:[{id:"m1",from:"Sawyer",text:"Casey，歡迎來到Nori Limited！ 我是Sawyer, Nori的老闆, 來一下我的辨公室聊聊吧～",time:"2024-07-15",read:"read",type:"text"}]},{id:"maggie",name:"主管 - Maggie",avatar:"🥑",desc:"Maggie · IT主管",phone:"+852 6111 4220",preview:"Maggie: Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下",locked:!1,pinned:!1,muted:!1,archived:!1,unread:1,lastTime:"今天",messages:[{id:"m1",from:"Maggie",text:"Hi Casey, 歡迎來到Nori, 我是你的直屬主管, 接下來會由我來指派工作給你。但首先我知道這是你的第一份工作，我會先跟你講解一下我們的工作流程，還有常用工具。",time:"2024-07-15",read:"read",type:"text"},{id:"m2",from:"Maggie",text:"當有新的工作時，我會在私訊通知你，然後會附上工單資訊",time:"2024-07-15",read:"read",type:"text"},{id:"m3",from:"Maggie",text:"然後請根據工單號，到Jiua系統查看詳細資訊",time:"2024-07-15",read:"read",type:"text"},{id:"m4",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/jiuaPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m5",from:"Maggie",text:"通常Jiua都會詳細的告訴你要處理的事情是什麼",time:"2024-07-15",read:"read",type:"text"},{id:"m6",from:"Maggie",text:"然後到Vizual Studio Code找到有問題的檔案",time:"2024-07-15",read:"read",type:"text"},{id:"m7",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/explorerPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m8",from:"Maggie",text:"你可以在SEARCH功能中搜索關鍵詞，找到相關的檔案",time:"2024-07-15",read:"read",type:"text"},{id:"m9",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/searchFunctionPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m10",from:"Maggie",text:"如果有不懂的，也可以到瀏覽器搜索相關資料和功能的寫法",time:"2024-07-15",read:"read",type:"text"},{id:"m11",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/searchEnginePage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m12",from:"Maggie",text:`修改完成之後，就可以到SOURCE CONTROL提交變更。
Git是一個可以儲存code, 變更記錄, 控制版本的工具，常用功能有：
commit => 提交變更
revert => 撤銷變更
查看Git Graph => 列表形式展示所有變更記錄`,time:"2024-07-15",read:"read",type:"text"},{id:"m13",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/sourceControlPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m14",from:"Maggie",text:"",media:"/arg-game-it-company-secret/assets/data/files/wts/sourceControlPage-revert.png",time:"2024-07-15",read:"read",type:"image"},{id:"m15",from:"Maggie",text:"如果修改有誤的話，提交時結果會經過檢查，然後報錯，這時候就要重新修改",time:"2024-07-15",read:"read",type:"text"},{id:"m0",from:"Maggie",text:"Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下。詳細資訊在Jiua可以找到, 有問題再找我。",time:"今天",read:"delivered",type:"text"}]},{id:"dev-team",name:"Dev Team",avatar:"👩‍💻",desc:"Nori網站和內網的開發團隊群組",members:["Maggie","Casey","pm","Taylor","ops"],preview:"",locked:!1,pinned:!0,muted:!1,archived:!1,unread:0,lastTime:"2024-07-15",messages:[]},{id:"lunch-team",name:"午餐小隊",avatar:"🍽️",desc:"午餐小隊",members:["Parker","Grace","Hugo","Alex","Casey"],preview:"Alex: 好啊！",locked:!1,pinned:!1,muted:!1,archived:!1,unread:0,lastTime:"2024-09-01",messages:[{id:"m1",from:"Hugo",text:"大新聞！聽說老闆父母車禍身亡了！",time:"2023-04-29",read:"read",type:"text"},{id:"m2",from:"Parker",text:"？！",time:"2023-04-29",read:"read",type:"text"},{id:"m3",from:"Grace",text:"真的嗎？太難過了",time:"2023-04-29",read:"read",type:"text"},{id:"m4",from:"Hugo",text:"對啊，所以才請了一個禮拜假吧",time:"2023-04-29",read:"read",type:"text"},{id:"m5",from:"Hugo",text:"有人覺得近期的老闆很怪嗎？",time:"2023-10-19",read:"read",type:"text"},{id:"m6",from:"Parker",text:"怎麼說？！",time:"2023-10-19",read:"read",type:"text"},{id:"m7",from:"Alex",text:"變開朗了，也變得愛請客了！",time:"2023-10-19",read:"read",type:"text"},{id:"m8",from:"Grace",text:"對啊，之前都挺嚴肅的",time:"2023-10-19",read:"read",type:"text"},{id:"m9",from:"Hugo",text:"對啊！！！",time:"2023-10-19",read:"read",type:"text"},{id:"m10",from:"Hugo",text:"歡迎Casey！！以後帶你吃附近好吃的！",time:"2024-07-16",read:"read",type:"text"},{id:"m11",from:"Parker",text:"歡迎歡迎",time:"2024-07-16",read:"read",type:"text"},{id:"m12",from:"Grace",text:"歡迎~",time:"2024-07-16",read:"read",type:"text"},{id:"m13",from:"Alex",text:"歡迎~~",time:"2024-07-16",read:"read",type:"text"},{id:"m14",from:"Hugo",text:"今天要吃米當當嗎？",time:"2024-09-01",read:"read",type:"text"},{id:"m15",from:"Alex",text:"好啊",time:"2024-09-01",read:"read",type:"text"}]}],q="dev-team",zt="",rt="all",ke=!1,ze="",pt="chat",Ue=!0,K=0,fa=!1;function H(){try{const e=M.map(t=>({id:t.id,name:t.name,avatar:t.avatar,desc:t.desc,members:t.members,preview:t.preview,lastTime:t.lastTime,unread:t.unread,pinned:t.pinned,muted:t.muted,archived:t.archived,messages:t.messages}));l.set("whatsappChats",e),l.set("whatsappMeta",{activeId:q,ch1Event1Triggered:De,ch1Event2Triggered:Re,sawyerSeq:K,sawyerSeqLocked:fa}),l.save(!0)}catch{}}function Zt(e,t){try{l.incrementWhatsappSent()}catch{}try{const a=(t||"").toLowerCase(),i=["rubbish","垃圾","dumb","笨","蠢","stupid","傻","笨蛋","白癡","idiot","fool","傻瓜","die","dead","死","shit","fuck","屎"],n=e==="sawyer",s=i.some(r=>a.includes(r.toLowerCase()));n&&s&&l.setFlag("sawyer_abuse_sent",!0)}catch{}}function kt(e){try{const t=M.find(a=>a.id===e);return!!(t&&t.muted)}catch{return!1}}function ns(e){return e.time==="剛剛"&&(e.time="今天"),e}function Na(e){const t=Date.now();e.messages.forEach((a,i)=>{if(ns(a),typeof a.ts!="number")if(/^\d{4}-\d{2}-\d{2}$/.test(a.time))a.ts=new Date(a.time+"T00:00:00").getTime()+i*10;else if(a.time&&a.time.includes(":")){const n=new Date().toISOString().slice(0,10),s=new Date(n+"T"+a.time).getTime();a.ts=Number.isNaN(s)?t-(e.messages.length-i)*1e3:s+i}else a.ts=t-(e.messages.length-i+10)*1e3}),e.lastTime==="剛剛"&&(e.lastTime="今天")}function is(){try{const e=l.get("whatsappChats");if(Array.isArray(e)&&e.length){for(const n of e){const s=M.find(r=>r.id===n.id);s&&(s.messages=Array.isArray(n.messages)?n.messages:s.messages,s.preview=n.preview??s.preview,s.lastTime=n.lastTime??s.lastTime,s.unread=typeof n.unread=="number"?n.unread:s.unread,s.pinned=typeof n.pinned=="boolean"?n.pinned:s.pinned,s.muted=typeof n.muted=="boolean"?n.muted:s.muted,s.archived=typeof n.archived=="boolean"?n.archived:s.archived)}for(const n of e)M.some(s=>s.id===n.id)||M.push(n)}const t=l.get("whatsappMeta");t&&typeof t=="object"&&(t.activeId&&M.some(n=>n.id===t.activeId)&&(q=t.activeId),typeof t.ch1Event1Triggered=="boolean"&&(De=t.ch1Event1Triggered),typeof t.ch1Event2Triggered=="boolean"&&(Re=t.ch1Event2Triggered),typeof t.sawyerSeq=="number"&&(K=t.sawyerSeq),typeof t.sawyerSeqLocked=="boolean"&&(fa=t.sawyerSeqLocked)),l.hasFlag("ch1_event1_triggered")&&(De=!0);const a=M.find(n=>n.id==="nori-all");a&&a.messages.some(n=>n.text&&n.text.includes("發財樹"))&&(De=!0,l.hasFlag("ch1_event1_triggered")||l.setFlag("ch1_event1_triggered",!0));const i=M.find(n=>n.id==="maggie");i&&i.messages.some(n=>n.text&&n.text.includes("INV-2024-0043"))&&(Re=!0);for(const n of M)Na(n)}catch{}De&&!l.hasFlag("ch1_event1_triggered")&&l.setFlag("ch1_event1_triggered",!0);try{for(const e of M)Na(e)}catch{}}function tt(e){if(!M.some(i=>i.id===e))return;q=e;const t=M.find(i=>i.id===e);t&&(t.unread=0),H(),e==="nori-all"&&setTimeout(()=>ba(),100);const a=document.getElementById("view-whatsapp");a&&a.innerHTML&&(pt="chat",_n(),ut(),J(q))}function bn(){is();const e=document.getElementById("view-whatsapp");if(e){e.innerHTML=`<div class="wa">
    <nav class="wa__sidebar" aria-label="WhatUp 側邊欄">
      <div class="wa__sidebar-top">
        <div class="wa__sidebar-tabs" role="tablist" aria-label="WhatUp 功能">
          <button class="wa__sidebar-tab active" data-wa-tab="chat" role="tab" aria-selected="true" title="聊天" aria-label="聊天">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8l-4 3v-7A8.5 8.5 0 0 1 12.5 3"/><path d="M8 9h8"/><path d="M8 13h5"/></svg>
          </button>
        </div>
      </div>
      <div class="wa__sidebar-bottom">
        <button class="wa__sidebar-tab" data-wa-tab="account" role="tab" aria-selected="false" title="帳號" aria-label="帳號">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
        </button>
      </div>
    </nav>
    <div class="wa__list" id="waList"></div>
    <div class="wa__chat" id="waChat"></div>
  </div>`,ss(),ut(),J(q);try{if(l.get("currentChapter")===2&&!l.hasFlag("ch2_lunch_seq_done")){const t=M.find(a=>a.id==="lunch-team");t&&t.messages.some(a=>a.text&&a.text.includes("剛剛嚇壞了吧"))?l.hasFlag("ch2_lunch_seq_done")||l.setFlag("ch2_lunch_seq_done",!0):setTimeout(()=>{try{_a()}catch{}},900)}}catch{}}}function ss(){const e=document.getElementById("view-whatsapp");e&&e.querySelectorAll(".wa__sidebar-tab[data-wa-tab]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.waTab;a!==pt&&(pt=a,_n(),ut())})})}function _n(){document.querySelectorAll(".wa__sidebar-tab[data-wa-tab]").forEach(e=>{const t=e.dataset.waTab===pt;e.classList.toggle("active",t),e.setAttribute("aria-selected",t?"true":"false")})}function ut(){pt==="account"?rs():G()}function rs(){const e=document.getElementById("waList");e&&(e.innerHTML=`
    <div class="wa__account-pane">
      <div class="wa__account-circle" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
      </div>
      <div class="wa__account-name-large">Casey</div>
      <div class="wa__account-phone-large">+852 32443333</div>
    </div>
  `)}function ft(e){return!0}function os(){let e=[...M];if(zt){const a=zt.toLowerCase();e=e.filter(i=>i.name.toLowerCase().includes(a)||i.preview.toLowerCase().includes(a)||i.desc.toLowerCase().includes(a))}rt==="unread"?e=e.filter(a=>a.unread>0&&ft(a.id)):rt==="archived"?e=e.filter(a=>a.archived):e=e.filter(a=>!a.archived);const t=["nori-all","dev-team","sawyer","maggie","system-alert","lunch-team"];return e.sort((a,i)=>{const n=t.indexOf(a.id),s=t.indexOf(i.id),r=n===-1?999:n,d=s===-1?999:s;return r!==d?r-d:0}),e}function G(){if(pt!=="chat")return;const e=document.getElementById("waList");if(!e)return;const t=os();e.innerHTML=`
    <div class="wa__list-header">
      <div class="wa__search"><input id="waSearch" class="input" placeholder="搜尋聊天" value="${zt}" disabled readonly style="opacity:0.6;pointer-events:none;cursor:not-allowed" title="搜尋已停用" /></div>
      <div class="wa__filters">
        <button class="wa__filter ${rt==="all"?"active":""}" data-tab="all">全部</button>
        <button class="wa__filter ${rt==="unread"?"active":""}" data-tab="unread">未讀</button>
        <button class="wa__filter ${rt==="archived"?"active":""}" data-tab="archived">封存</button>
        <span class="small muted" style="margin-left:auto">${t.length} 對話</span>
      </div>
    </div>
    <div class="wa__list-scroll" id="waListScroll">
      ${t.map(a=>{const i=!ft(a.id);return`<div class="wa__item ${a.id===q?"active":""} ${a.muted?"muted":""}" data-id="${a.id}" style="${i?"opacity:.5":""}">
          <div class="wa__avatar">${a.avatar}</div>
          <div class="wa__item-main">
            <div class="wa__name">${a.name} ${a.pinned?"📌":""} ${a.muted?'<span class="wa__mute">🔇</span>':""} ${i?"🔒":""}</div>
            <div class="wa__preview">${i?"需要先觸發隱藏入口後解鎖":a.preview}</div>
          </div>
          <div class="wa__item-meta">
            <div class="wa__time">${a.lastTime}</div>
            ${a.unread>0&&!i?`<div class="wa__badge">${a.unread}</div>`:""}
            ${a.archived?'<div class="small muted">封存</div>':""}
          </div>
        </div>`}).join("")||'<div class="small muted" style="padding:16px;text-align:center">無結果 — 試搜尋 Sawyer</div>'}
    </div>
  `,e.querySelector("#waSearch")?.addEventListener("input",a=>{zt=a.target.value,G()}),e.querySelectorAll(".wa__filter").forEach(a=>a.addEventListener("click",()=>{rt=a.dataset.tab,G()})),e.querySelectorAll(".wa__item").forEach(a=>a.addEventListener("click",()=>{if(!ft(a.dataset.id))return;q=a.dataset.id;const i=M.find(n=>n.id===q);i&&(i.unread=0),H(),a.dataset.id==="nori-all"&&setTimeout(()=>ba(),100),ke=!1,G(),J(q)})),e.querySelectorAll(".wa__item").forEach(a=>{a.addEventListener("contextmenu",i=>{i.preventDefault();const n=M.find(s=>s.id===a.dataset.id);!n||!ft(n.id)||(n.pinned=!n.pinned,H(),G())})})}function J(e){const t=document.getElementById("waMessages"),a=t?t.scrollTop:null,i=t?t.scrollHeight:null,n=t?i-a-t.clientHeight<80:!0,s=a===0&&Ue&&t&&i>t.clientHeight+80?!0:n;t&&(Ue=s);const r=M.find(u=>u.id===e),d=document.getElementById("waChat");if(!r||!d)return;if(!ft(e)){d.innerHTML='<div class="view__placeholder"><h2>🔒 未解鎖</h2><div class="muted">先去 Vizual Studio Code 觸發 420.69 隱藏路由</div></div>';return}e==="supplier"&&l.setFlag("found_supplier",!0),e==="backend-team"&&l.setFlag("found_supplier",!0);let o=r.messages;if(ze){const u=ze.toLowerCase();o=o.filter(v=>(v.text||"").toLowerCase().includes(u)||(v.fileName||"").toLowerCase().includes(u))}o=[...o].map((u,v)=>({m:u,idx:v})).sort((u,v)=>{const h=typeof u.m.ts=="number"?u.m.ts:Oa(u.m.time),b=typeof v.m.ts=="number"?v.m.ts:Oa(v.m.time);return h!==b?h-b:u.idx-v.idx}).map(u=>u.m);const c={};o.forEach(u=>{const v=u.time.includes(":")?"今天":u.time;c[v]||(c[v]=[]),c[v].push(u)}),d.innerHTML=`
    <div class="wa__chat-header" id="waChatHeader">
      <div>
        <div class="wa__chat-title">${r.avatar} ${r.name} ${r.pinned?"📌":""}</div>
        <div class="wa__chat-sub">${r.desc} · ${r.members?r.members.join(", "):r.phone||""}</div>
      </div>
      <div class="wa__chat-actions">
        <button class="wa__iconbtn" title="搜尋訊息" id="waMsgSearchBtn" aria-label="搜尋訊息">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M15 15l4 4"/></svg>
        </button>
        <button class="wa__iconbtn" title="匯出聊天記錄" id="waExportBtn" aria-label="匯出聊天記錄">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/></svg>
        </button>
        <button class="wa__iconbtn" title="聯絡資訊" id="waInfoBtn" aria-label="聯絡資訊">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>
        </button>
        <button class="wa__iconbtn" title="更多" id="waMoreBtn" aria-label="更多">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="5.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none"/></svg>
        </button>
      </div>
    </div>
    <div id="waMsgSearchBar" style="display:${ze?"flex":"none"};gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg-secondary)">
      <input id="waMsgSearchInput" class="input" placeholder="搜尋此對話訊息" value="${ze}" style="flex:1" />
      <button class="btn" id="waMsgSearchClear">清除</button>
    </div>
    <div class="wa__messages" id="waMessages">
      ${Object.entries(c).map(([u,v])=>`
        <div class="wa__day">${u}</div>
        ${v.map(h=>ls(h,r)).join("")}
      `).join("")}
      ${e==="sawyer"&&K===2?`<div class="wa__msg-row other" id="sawyerTyping"><div class="wa__msg-avatar" style="background:${ya("Sawyer")}">S</div><div class="bubble other"><span class="small muted">輸入中...</span></div></div>`:""}
    </div>
    ${(()=>{let u="",v=!1;return e==="sawyer"&&(K===1?(u="但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊",v=!0):K===2?(u="",v=!0):K===3&&(u="但是",v=!0)),`<div class="wa__composer">
      <button class="wa__iconbtn" title="附件" aria-label="附件">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <input id="waComposerInput" class="input" placeholder="輸入訊息" style="flex:1" value="${g(u)}" ${v?"readonly disabled":""} />
      <button class="btn primary" id="waSendBtn">送出</button>
      <button class="wa__iconbtn" title="語音" aria-label="語音">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 14v4"/><path d="M8 18h8"/></svg>
      </button>
    </div>`})()}
    <div class="wa__info ${ke?"open":""}" id="waInfoPanel">
      <div style="padding:12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <b>聯絡資訊</b><button class="btn" id="waInfoClose">關閉</button>
      </div>
      <div style="padding:12px;overflow:auto;display:grid;gap:10px">
        <div style="text-align:center;padding:12px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--bg-tertiary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto">${r.avatar}</div>
          <div style="margin-top:8px;font-weight:700">${r.name}</div>
          <div class="small muted">${r.desc}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">成員</div>
          <div class="small muted" style="margin-top:4px">${r.members?r.members.join("、"):r.phone||"—"}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">靜音 / 置頂 / 封存</div>
          <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn ${r.muted?"primary":""}" id="waToggleMute">${r.muted?"🔇 已靜音":"🔔 靜音"}</button>
            <button class="btn ${r.pinned?"primary":""}" id="waTogglePin">${r.pinned?"📌 已置頂":"📌 置頂"}</button>
            <button class="btn ${r.archived?"primary":""}" id="waToggleArchive">${r.archived?"📦 已封存":"📦 封存"}</button>
          </div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">共享檔案</div>
          <div class="small muted" style="margin-top:4px">${r.messages.filter(u=>u.type!=="text").map(u=>u.fileName||u.type).join(", ")||"無"}</div>
        </div>
      </div>
    </div>
  `,document.getElementById("waChatHeader")?.addEventListener("click",()=>{ke=!ke,document.getElementById("waInfoPanel")?.classList.toggle("open",ke)}),document.getElementById("waInfoBtn")?.addEventListener("click",u=>{u.stopPropagation(),ke=!ke,document.getElementById("waInfoPanel")?.classList.toggle("open",ke)}),document.getElementById("waInfoClose")?.addEventListener("click",()=>{ke=!1,document.getElementById("waInfoPanel")?.classList.remove("open")}),document.getElementById("waToggleMute")?.addEventListener("click",()=>{r.muted=!r.muted,H(),G(),J(e)}),document.getElementById("waTogglePin")?.addEventListener("click",()=>{r.pinned=!r.pinned,H(),G(),J(e)}),document.getElementById("waToggleArchive")?.addEventListener("click",()=>{r.archived=!r.archived,H(),G(),J(e)}),document.getElementById("waMsgSearchBtn")?.addEventListener("click",()=>{ze="",document.getElementById("waMsgSearchBar").style.display="flex",document.getElementById("waMsgSearchInput")?.focus()}),document.getElementById("waMsgSearchInput")?.addEventListener("input",u=>{ze=u.target.value,J(e)}),document.getElementById("waMsgSearchClear")?.addEventListener("click",()=>{ze="",J(e)}),document.getElementById("waExportBtn")?.addEventListener("click",()=>Va(r)),document.getElementById("waMoreBtn")?.addEventListener("click",()=>Va(r)),document.getElementById("waSendBtn")?.addEventListener("click",()=>Ha(r)),document.getElementById("waComposerInput")?.addEventListener("keydown",u=>{u.key==="Enter"&&Ha(r)}),document.querySelectorAll("[data-play]").forEach(u=>{u.addEventListener("click",()=>{const v=u.textContent;u.textContent="⏸️",setTimeout(()=>u.textContent=v,1800)})}),document.querySelectorAll("[data-img]").forEach(u=>{u.addEventListener("click",()=>kn(u.src))}),xn();try{const u=document.getElementById("waMessages");u&&!u._waScrollBound&&(u._waScrollBound=!0,u.addEventListener("scroll",()=>{const v=u.scrollHeight,h=u.scrollTop,b=u.clientHeight;Ue=v-h-b<80}))}catch{}const m=s,p=a;requestAnimationFrame(()=>{requestAnimationFrame(()=>{const u=document.getElementById("waMessages");if(u)if(m||p===0&&u.scrollHeight>u.clientHeight+20&&Ue)u.scrollTop=u.scrollHeight,Ue=!0,u.scrollTop;else if(p!==null){const v=Math.max(0,u.scrollHeight-u.clientHeight);u.scrollTop=Math.min(p,v),u.scrollTop,Ue=u.scrollHeight-u.scrollTop-u.clientHeight<80}else u.scrollTop=u.scrollHeight,Ue=!0,u.scrollTop})})}function wn(e){return e?e==="you"||e==="你"?"你":e.trim().charAt(0).toUpperCase():"?"}function Oa(e){if(!e)return 0;if(e==="剛剛"||e==="今天")return Number.MAX_SAFE_INTEGER;if(/^\d{4}-\d{2}-\d{2}$/.test(e))return new Date(e+"T00:00:00").getTime();if(/^\d{1,2}\/\d{1,2}$/.test(e))return new Date("2024/"+e+"T00:00:00").getTime();const t=new Date().toISOString().slice(0,10);try{const a=new Date(t+"T"+e).getTime();return Number.isNaN(a)?Number.MAX_SAFE_INTEGER:a}catch{return Number.MAX_SAFE_INTEGER}}function ya(e){const t=["#1f7aec","#e542a3","#00a884","#ff8c00","#6a5acd","#d93025","#0d9488","#7c3aed"];let a=0;for(let i=0;i<e.length;i++)a=a*31+e.charCodeAt(i)>>>0;return t[a%t.length]}function ls(e,t){const a=e.from==="you",i=a?e.read==="read"?'<span class="bubble__check read">✓✓</span>':e.read==="delivered"?'<span class="bubble__check">✓✓</span>':'<span class="bubble__check">✓</span>':"";let n="";e.type==="image"?n=`<div class="wa__media"><img data-img src="${e.media}" alt="image" /></div>`:e.type==="voice"?n=`<div class="wa__voice"><span class="wa__play" data-play>▶️</span><div class="wa__wave">${Array.from({length:12},(m,p)=>`<span style="height:${8+Math.random()*14}px"></span>`).join("")}</div><span class="small muted">${e.duration}</span></div>`:e.type==="file"&&(n=`<div class="wa__file"><div class="wa__file-icon">📄</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g(e.fileName)}</div><div class="small muted">${g(e.fileSize)}</div></div><button class="btn" style="padding:4px 8px">下載</button></div>`);const s=e.text?`<div class="bubble__text">${g(e.text).replace(/\n/g,"<br>")}</div>`:"",r=`<div class="bubble__time">${g(e.time)} ${i}</div>`;if(a)return`<div class="wa__msg-row me">
      <div class="bubble me">${s}${n}${r}</div>
    </div>`;const d=wn(e.from),o=ya(e.from),c=Array.isArray(t?.members)&&t.members.length>2?`<div class="bubble__sender" style="color:${o}">${g(e.from)}</div>`:"";return`<div class="wa__msg-row other">
    <div class="wa__msg-avatar" style="background:${o}" aria-label="${g(e.from)}" title="${g(e.from)}">${g(d)}</div>
    <div class="bubble other">${c}${s}${n}${r}</div>
  </div>`}function Ha(e){if(e.id==="sawyer"&&K===1){const n="但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊";e.messages.push({id:"m"+Date.now(),from:"you",text:n,time:"今天",ts:Date.now(),read:"sent",type:"text"}),e.preview=n,e.lastTime="今天",e.unread=0,K=2,Zt(e.id,n);try{Xt({chatId:e.id,chatName:e.name,text:n,to:"Sawyer"})}catch{}H(),J(e.id),G(),setTimeout(()=>{if(K=3,e.messages.push({id:"sawyer-reply2-"+Date.now(),from:"Sawyer",text:"先別管，肯定是這段的影響，已經在影響我工作了",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),e.preview="Sawyer: 先別管，肯定是這段的影響...",e.unread=(e.unread||0)+1,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),J(e.id),G(),kt("sawyer")||q==="sawyer")return;const s=document.createElement("div");s.id="wa-win-notif-sawyer-seq2-"+Date.now(),s.setAttribute("role","alert"),s.innerHTML='<div class="win-notif__app"><img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">先別管，肯定是這段的影響，已經在影響我工作了</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;",s.addEventListener("click",r=>{r.target.closest(".win-notif__close")||(s.remove(),$(()=>Promise.resolve().then(()=>re).then(d=>{d.setActiveView&&(d.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),tt("sawyer"))}),s.querySelector(".win-notif__close")?.addEventListener("click",r=>{r.stopPropagation(),s.remove()}),document.body.appendChild(s),setTimeout(()=>s.remove(),4e3)},3e3);return}if(e.id==="sawyer"&&K===2)return;if(e.id==="sawyer"&&K===3){e.messages.push({id:"m"+Date.now(),from:"you",text:"但是",time:"今天",ts:Date.now(),read:"sent",type:"text"}),e.preview="但是",e.lastTime="今天",e.unread=0,Zt(e.id,"但是");try{Xt({chatId:e.id,chatName:e.name,text:"但是",to:"Sawyer"})}catch{}H(),J(e.id),G(),setTimeout(()=>{if(e.messages.push({id:"sawyer-reply3-"+Date.now(),from:"Sawyer",text:"趕快revert！",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),e.preview="Sawyer: 趕快revert！",e.unread=(e.unread||0)+1,K=4,fa=!1,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),J(e.id),G(),kt("sawyer")||q==="sawyer")return;const s=document.createElement("div");s.id="wa-win-notif-sawyer-seq3-"+Date.now(),s.setAttribute("role","alert"),s.innerHTML='<div class="win-notif__app"><img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="wa__msg-avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.innerHTML='<div class="win-notif__app"><img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;",s.addEventListener("click",r=>{r.target.closest(".win-notif__close")||(s.remove(),$(()=>Promise.resolve().then(()=>re).then(d=>{d.setActiveView&&(d.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),tt("sawyer"))}),s.querySelector(".win-notif__close")?.addEventListener("click",r=>{r.stopPropagation(),s.remove()}),document.body.appendChild(s),setTimeout(()=>s.remove(),4e3)},200);return}const t=document.getElementById("waComposerInput"),a=t?.value.trim();if(!a)return;const i=e.id==="sawyer"&&K===4;e.messages.push({id:"m"+Date.now(),from:"you",text:a,time:"今天",ts:Date.now(),read:"sent",type:"text"}),e.preview=a,e.lastTime="今天",e.unread=0,t.value="",Zt(e.id,a);try{Xt({chatId:e.id,chatName:e.name,text:a,to:e.name})}catch{}H(),J(e.id),G()}var De=!1,Re=!1;function cs(){if(De)return;De=!0,H(),l.setFlag("ch1_event1_triggered",!0);const e=M.find(t=>t.id==="nori-all");e&&setTimeout(()=>{e.messages.push({id:"m-tree-"+Date.now(),from:"Sawyer",text:"聽從風水師建議，已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰，否則運氣會散。",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),e.preview="Sawyer: 聽從風水師建議，已在 Lobby 擺放",e.lastTime="今天",e.unread=(e.unread||0)+1,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"nori-all"}}));const t=document.getElementById("view-whatsapp");if(t&&t.innerHTML&&G(),setTimeout(()=>{e.messages.push({id:"m-tree-img-"+Date.now(),from:"Sawyer",text:"",media:"/arg-game-it-company-secret/assets/data/files/office.png",type:"image",time:"今天",ts:Date.now(),read:"delivered"}),e.preview="Sawyer: [圖片]",e.lastTime="今天",e.unread=(e.unread||0)+1,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"nori-all"}}));const i=document.getElementById("view-whatsapp");i&&i.innerHTML&&G()},1500),kt("nori-all")){setTimeout(()=>{Re||Ut()},1e4);return}const a=document.createElement("div");a.id="wa-win-notification-sawyer-tree",a.setAttribute("role","alert"),a.innerHTML=`
      <div class="win-notif__app">
        <img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">Nori 全體</span>
        <button class="win-notif__close" aria-label="關閉">✕</button>
      </div>
      <div class="win-notif__body">
        <div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div>
        <div class="win-notif__text">
          <div class="win-notif__sender">Sawyer</div>
          <div class="win-notif__msg">已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰</div>
          <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
        </div>
      </div>
      <div class="win-notif__progress"></div>
    `,a.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",a.addEventListener("click",i=>{i.target.closest(".win-notif__close")||(a.remove(),$(()=>Promise.resolve().then(()=>re).then(n=>{n.setActiveView&&(n.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),tt("nori-all"))}),a.querySelector(".win-notif__close")?.addEventListener("click",i=>{i.stopPropagation(),a.remove()}),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="none"}),setTimeout(()=>{a.style.opacity="0",setTimeout(()=>a.remove(),300)},1e4),setTimeout(()=>{Re||Ut()},1e4)},1e4)}function Ut(){if(Re)return;Re=!0,H();const e=M.find(t=>t.id==="maggie");e&&setTimeout(()=>{e.messages.push({id:"m-0043-"+Date.now(),from:"Maggie",text:"Hi @Casey, 有新的工單 INV-2024-0043, 請協助處理一下",time:"今天",ts:Date.now(),read:"delivered",type:"text"}),e.preview="Hi @Casey, 有新的工單 INV-2024-0043",e.lastTime="今天",e.unread=(e.unread||0)+1,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"maggie"}})),$(()=>Promise.resolve().then(()=>ht).then(i=>{i.addTicket0043&&i.addTicket0043(),document.getElementById("jiraBoard")&&window.dispatchEvent(new CustomEvent("jira:ticketAdded"))}),void 0);const t=document.getElementById("view-whatsapp");if(t&&t.innerHTML&&G(),kt("maggie")||q==="maggie")return;const a=document.createElement("div");a.id="wa-win-notification-maggie-0043",a.setAttribute("role","alert"),a.innerHTML=`
      <div class="win-notif__app">
        <img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">主管 - Maggie</span>
        <button class="win-notif__close" aria-label="關閉">✕</button>
      </div>
      <div class="win-notif__body">
        <div class="win-notif__avatar" style="background:linear-gradient(135deg, #25D366, #128C7E)">M</div>
        <div class="win-notif__text">
          <div class="win-notif__sender">Maggie</div>
          <div class="win-notif__msg">Hi @Casey, 有新的工單 INV-2024-0043, 請協助處理一下</div>
          <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
        </div>
      </div>
      <div class="win-notif__progress"></div>
    `,a.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",a.addEventListener("click",i=>{i.target.closest(".win-notif__close")||(a.remove(),$(()=>Promise.resolve().then(()=>re).then(n=>{n.setActiveView&&(n.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),tt("maggie"))}),a.querySelector(".win-notif__close")?.addEventListener("click",i=>{i.stopPropagation(),a.remove()}),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="none"}),setTimeout(()=>{a.style.opacity="0",setTimeout(()=>a.remove(),300)},1e4)},1e4)}function ba(){M.find(e=>e.id==="nori-all")&&De&&!Re&&Ut()}var ea=[{from:"Parker",text:"@Casey 剛剛嚇壞了吧 哈哈 估計是你進來以來第一次遇到系統爆炸了"},{from:"Parker",text:"不過說來也奇怪 這個入口應該搬移了才對"},{from:"Parker",text:"啊對了 這裡應該也沒多少人知道 那個原本是HR系統的入口"},{from:"Hugo",text:"對！！那個超難用的 系統不完善沒有適當防呆 他們又常常笨手笨腳刪掉資料 要找我們恢復"},{from:"Parker",text:"對啊 浪費我們人力 老闆就乾脆換系統了"},{from:"Hugo",text:"那為什麼代碼沒有隱藏入口？"},{from:"Parker",text:"不知道欸 這個不能動 一動就會大爆炸"},{from:"Hugo",text:"難不成有人偷用這個系統來偷藏色色的東西！"},{from:"Parker",text:"什麼鬼"}];function ds(e,t){if(kt("lunch-team")||q==="lunch-team")return;const a=ya(e),i=wn(e),n=document.createElement("div");n.className="win-notif",n.id="wa-win-notif-lunch-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),n.setAttribute("role","alert"),n.innerHTML=`
      <div class="win-notif__app">
        <img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">午餐小隊</span>
        <button class="win-notif__close" aria-label="關閉">✕</button>
      </div>
      <div class="win-notif__body">
        <div class="win-notif__avatar" style="background:${a}">${g(i)}</div>
        <div class="win-notif__text">
          <div class="win-notif__sender">${g(e)}</div>
          <div class="win-notif__msg">${g(t)}</div>
          <div class="win-notif__time">剛剛 · 點擊開啟對話</div>
        </div>
      </div>
      <div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>
  `,n.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",n.addEventListener("click",s=>{s.target.closest(".win-notif__close")||(n.remove(),$(()=>Promise.resolve().then(()=>re).then(r=>{r.setActiveView&&(r.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),tt("lunch-team"))}),n.querySelector(".win-notif__close")?.addEventListener("click",s=>{s.stopPropagation(),n.remove()}),document.body.appendChild(n),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="none"}),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(8px)",setTimeout(()=>n.remove(),300)},4e3)}function _a(){if(l.hasFlag("ch2_lunch_seq_done"))return;const e=M.find(i=>i.id==="lunch-team");if(!e)return;if(e.messages.some(i=>i.text&&i.text.includes("剛剛嚇壞了吧"))){l.hasFlag("ch2_lunch_seq_done")||l.setFlag("ch2_lunch_seq_done",!0);return}l.setFlag("ch2_lunch_seq_done",!0),H();let t=0;const a=()=>{if(t>=ea.length)return;const{from:i,text:n}=ea[t],s=Date.now();e.messages.push({id:"lunch-ch2-"+s+"-"+t,from:i,text:n,time:"今天",ts:s+t,read:"delivered",type:"text"}),e.preview=`${i}: ${n.slice(0,20)}`,e.lastTime="今天",q!=="lunch-team"?e.unread=(e.unread||0)+1:e.unread=0,H(),window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"lunch-team"}})),ds(i,n),t+=1,t<ea.length&&setTimeout(a,5e3)};setTimeout(a,800)}function Va(e){const t=`WhatUp 匯出 — ${e.name}
${e.messages.map(s=>`[${s.time}] ${s.from}: ${s.text||s.fileName||s.type}`).join(`
`)}`,a=new Blob([t],{type:"text/plain"}),i=URL.createObjectURL(a),n=document.createElement("a");n.href=i,n.download=`${e.id}-chat.txt`,n.click(),URL.revokeObjectURL(i)}function ps(){return M}function us(){if(K!==0)return;K=1,H();const e=document.getElementById("view-whatsapp");if(e&&e.classList.contains("active")||localStorage.getItem("cc_active_view"),e&&e.innerHTML){try{J(q)}catch{}try{ut()}catch{}}try{l.setFlag("sawyer_seq_started",!0)}catch{}}var ge=1,it=0,st=0,Ot=!1,Ra=0,qa=0,za=0,Ua=0;function xn(){if(document.getElementById("waLightbox"))return;const e=document.createElement("div");e.id="waLightbox",e.className="wa-lightbox",e.setAttribute("aria-hidden","true"),e.innerHTML=`
    <div class="wa-lightbox__backdrop" data-wa-close></div>
    <div class="wa-lightbox__card" role="dialog" aria-label="圖片預覽">
      <div class="wa-lightbox__head">
        <span><i class="fa-solid fa-image"></i> 圖片預覽 · 滾輪縮放 · 拖拽平移</span>
        <div class="wa-lightbox__controls">
          <button class="wa-lightbox__btn" data-wa-zoom="out" title="縮小"><i class="fa-solid fa-magnifying-glass-minus"></i></button>
          <span class="wa-lightbox__scale" id="waLightboxScale">100%</span>
          <button class="wa-lightbox__btn" data-wa-zoom="in" title="放大"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
          <button class="wa-lightbox__btn" data-wa-zoom="reset" title="重置"><i class="fa-solid fa-expand"></i></button>
        </div>
        <button class="wa-lightbox__close" id="waLightboxClose" aria-label="關閉"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="wa-lightbox__body" id="waLightboxBody">
        <img id="waLightboxImg" src="" alt="preview" draggable="false" />
      </div>
      <div class="wa-lightbox__foot small muted">點擊背景或按 ESC 關閉 · 滾輪縮放 · 拖拽可平移</div>
    </div>
  `,document.body.appendChild(e);const t=e.querySelector("#waLightboxImg"),a=e.querySelector("#waLightboxBody"),i=e.querySelector("#waLightboxScale");function n(){t&&(t.style.transform=`translate(${it}px, ${st}px) scale(${ge})`,i&&(i.textContent=Math.round(ge*100)+"%"),a.style.cursor=ge>1?Ot?"grabbing":"grab":"zoom-in")}function s(c,m,p){ge=Math.max(.5,Math.min(4,c)),ge===1&&(it=0,st=0),n()}e.querySelector('[data-wa-zoom="in"]')?.addEventListener("click",()=>s(ge+.25)),e.querySelector('[data-wa-zoom="out"]')?.addEventListener("click",()=>s(ge-.25)),e.querySelector('[data-wa-zoom="reset"]')?.addEventListener("click",()=>{ge=1,it=0,st=0,n()}),e.querySelector("#waLightboxClose")?.addEventListener("click",()=>Rt()),e.querySelector("[data-wa-close]")?.addEventListener("click",()=>Rt()),a?.addEventListener("wheel",c=>{c.preventDefault();const m=c.deltaY>0?-.1:.1;s(ge+m)},{passive:!1});function r(c){ge<=1||(Ot=!0,t.classList.add("dragging"),Ra=c.clientX,qa=c.clientY,za=it,Ua=st,a.setPointerCapture?.(c.pointerId))}function d(c){Ot&&(it=za+(c.clientX-Ra),st=Ua+(c.clientY-qa),n())}function o(c){Ot=!1,t.classList.remove("dragging");try{a.releasePointerCapture?.(c.pointerId)}catch{}}a?.addEventListener("pointerdown",r),a?.addEventListener("pointermove",d),a?.addEventListener("pointerup",o),a?.addEventListener("pointercancel",o),document.addEventListener("keydown",c=>{c.key==="Escape"&&e.classList.contains("open")&&Rt()}),e._updateTransform=n,e._setScale=s}function kn(e){xn();const t=document.getElementById("waLightbox"),a=document.getElementById("waLightboxImg");!t||!a||(a.src=e,ge=1,it=0,st=0,t._updateTransform?.(),t.classList.add("open"),t.setAttribute("aria-hidden","false"))}function Rt(){const e=document.getElementById("waLightbox");e&&(e.classList.remove("open"),e.setAttribute("aria-hidden","true"))}try{W.on("chapter:changed",e=>{e===2&&setTimeout(()=>{try{_a()}catch{}},600)})}catch{}typeof window<"u"&&!window.__waListenerBound&&(window.__waListenerBound=!0,window.addEventListener("whatsapp:newMessage",e=>{try{H()}catch{}const t=document.getElementById("view-whatsapp");if(!(!t||!t.innerHTML)){try{ut()}catch{}try{J(q)}catch{}}}),window.addEventListener("whatsapp:refresh",()=>{const e=document.getElementById("view-whatsapp");if(!(!e||!e.innerHTML)){try{ut()}catch{}try{J(q)}catch{}}}));var ct=[{title:"Java switch-case 語法詳解 — 基礎教學 (繁中)",url:"https://java-tutorial.example/switch-case",snippet:"【switch 用法】switch 會依變數值跳到對應 case，需搭配 break 避免貫穿。範例：switch(vipLv){ case 1: price *= 0.90; break; case 2: price *= 0.85; break; case 3: price *= 0.80; break; case 4: price *= 0.75; break; case 5: price *= 0.70; break; default: break; } 注意：若缺少 break 會繼續執行下一個 case。常與 if-else 比較，適用於枚舉分級如 VIP 折扣。",type:"web",image:null},{title:"【StackOverflow】VIP 等級折扣用 switch 寫，VIP1 被算成 60% 而不是 50% 該怎麼修？",url:"https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage",snippet:`發問：我的 switch(vipLv) 中 case 1 寫成 price*=0.95，但需求是 VIP1 60%、VIP2 65%。已嘗試修改但 Sonar 仍報錯... 
回答：請將 case 1 改為 0.50、case 2 改為 0.45，並確認每個 case 都有 break。另建議抽成 Map 或 enum 避免魔法數字。 

(瀏覽 2.3k, 已解決)`,type:"web",image:null},{title:"【StackOverflow】HTML 的 <h1> 到 <h6> 是什麼？什麼時候該用 h1？跟 <p> 有什麼差別？",url:"https://stackoverflow.com/questions/10460126/html-heading-h1-h6-what-is-difference",snippet:`發問：請問 HTML 的 <h1> 到 <h6> 是什麼意思？跟 <p>、<div> 差在哪？為什麼一個頁面只能有一個 <h1>？SEO 有影響嗎？
回答（已採納，423 讚）：<h1> 是最高層級的標題，代表頁面主標題，<h2>～<h6> 依重要性遞減。跟 <p>（段落）不同，標題有語意與 SEO 權重。一個頁面建議只放一個 <h1>，其他用 <h2>/<h3> 建立大綱...（瀏覽 18.4k, 已解決）`,type:"web",image:null},{title:"【StackOverflow】HTML 語意化標籤是什麼？<header> <nav> <main> <section> <article> <footer> 該怎麼用？",url:"https://stackoverflow.com/questions/21051176/html-semantic-tags-header-nav-main-section-article",snippet:`發問：常看到 <header> <nav> <main> <section> <article> <footer> 這些標籤，跟 <div> 有什麼不同？一定要用嗎？
回答（已採納，298 讚）：這些是 HTML5 語意化標籤，讓瀏覽器與搜尋引擎看懂結構。<header> 是頁首、<nav> 導覽、<main> 主內容、<section> 章節、<article> 獨立文章、<footer> 頁尾。用對語意對無障礙與 SEO 都有幫助...（瀏覽 12.7k, 已解決）`,type:"web",image:null},{title:"【StackOverflow】import.meta.env 是什麼？Vite 專案的環境變數怎麼讀取？",url:"https://stackoverflow.com/questions/5920914/import-meta-env-meaning",snippet:`發問：請問 import.meta.env 是什麼意思？在 Vite 專案常看到 import.meta.env.VITE_API_BASE，有人可以解釋一下嗎？

回答（已採納，4.1k 讚）：import.meta.env 就是讀取 .env 檔案裡的參數，Vite 會在建置時把以 VITE_ 開頭的變數注入到前端。

例子：
// .env
VITE_API_BASE=/api
VITE_ANALYTICS_ID=12345
VITE_PATH=/user

// src/api/client.js
const BASE = import.meta.env.VITE_API_BASE // → "/api"
const NAME = import.meta.env.VITE_ANALYTICS_ID // → "12345"

注意：只有 VITE_ 開頭的才會暴露到瀏覽器，沒有前綴的（如 DATABASE_URL）只在後端生效。 (瀏覽 5.7k, 已解決)`,type:"web",image:null},{title:"Sawyer Choi — 2001-10-18",url:"https://sawyer-blog.example/2001-10-18",snippet:`2001-10-18

今天和好多朋友一起玩，大家都玩得很開心。

我把自己的食物分給大家吃，他們吃完都笑得很開心。我覺得只要大家在一起，好像什麼都很好玩。朋友們都說我很好笑，我也喜歡看他們笑。

回家的時候，我把今天和朋友玩的事情告訴爸爸媽媽。他們聽完也很開心，還一直問我今天跟誰一起玩、玩了什麼。

今天真的很好玩，我希望明天也可以和大家一起玩。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2003-04-27",url:"https://sawyer-blog.example/2003-04-27",snippet:`2003-04-27

今天上課的時候，我拿同學的眼鏡來玩，圍繞班房一直跑假裝不會再還他，老師看到了，叫住我，問我是不是在欺負同學，還在我的手冊上寫了不好的評語。

我覺得很難過。

更讓我難過的是，那個同學一直什麼都沒有說。我不知道他為什麼不幫我，他不喜歡這樣嗎？但我也沒有傷害到他吧。

晚上吃飯的時候，爸爸媽媽問我老師為什麼會在手冊上這樣寫，我什麼都沒有說。只是眼淚突然掉了一滴在桌上。

他們沒有再問我，只是拿了一包檸檬茶給我。這是我小時候很喜歡喝的東西。

可是現在我覺得它太甜了，已經不太想喝了。

只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2004-11-13",url:"https://sawyer-blog.example/2004-11-13",snippet:`2004-11-13

今天和表妹一起玩的時候，我不小心戳到了她的眼睛。

我馬上去看她有沒有受傷，也一直看看她的眼睛有沒有怎麼樣。可是她還是跑去她爸爸那裏，一直說是我弄到她的眼睛。

這時所有大人都看著我，大家都覺得是我的錯。

可是我不知道要說什麼。

我那一刻腦袋空白。連爸爸媽媽也沒有站在我這邊，一直在問我為什麼要這樣做，我只好一直站在那裏。

那些大人的眼神，讓我覺得很不舒服。

其實，這已經不是第一次有這種感覺了。— Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2006-09-01",url:"https://sawyer-blog.example/2006-09-01",snippet:`2006-09-01

今天要去新的學校了。

可是我一點都不想去。

我很害怕要認識新的同學，也不知道要怎麼跟他們說話。一直想著，如果沒有人跟我做朋友怎麼辦？

我甚至開始想，為什麼學生一定要去學校？

想了很久，我覺得大概是因為知識對以後的人生還是很重要。至少多學一點東西，將來應該會對自己有幫助。

所以，我還是會努力讀書。

至於朋友……慢慢再說吧。

一個人好像也沒有什麼不好。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2007-01-11",url:"https://sawyer-blog.example/2007-01-11",snippet:`2007-01-11

沒想到，我竟然交到了比自己想像中還要多的朋友。

原本以為來到新學校會很孤單，結果大家好像都很喜歡跟我一起玩。甚至連老師都覺得我是個很幽默的人。

我自己也不知道，原來我這麼會逗大家笑。

現在想到要回學校，好像也沒有以前那麼討厭了。

有朋友一起上課、一起聊天、一起笑，學校突然變得有趣很多。

看來，我之前真的想太多了。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2007-01-12",url:"https://sawyer-blog.example/2007-01-12",snippet:`2007-01-12

今天朋友跟我分享了一個他很喜歡的歌手和他創作的歌曲。

本來只是想聽聽看，結果越聽越喜歡。回到家之後，我直接把那個歌單放出來，而且越開越大聲。

我聽得太投入了，完全沒有發現爸爸媽媽已經回家。

直到媽媽突然說：

「太難聽了吧？」

我才發現原來他們早就回來了。

可能真的太大聲了。

還是我喜歡的事物一直都很冷門？ — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2010-06-06",url:"https://sawyer-blog.example/2010-06-06",snippet:`2010-06-06

今天媽媽又買了一箱檸檬茶回來。

看到它的時候，我突然想起以前很喜歡喝檸檬茶。

小時候總覺得它很好喝，甜甜的，喝完心情也會很好。

不知道為什麼，現在再看到它，突然有一種很奇怪的感覺。

可能有些東西就是這樣吧。

以前很喜歡的東西，長大以後不一定還會喜歡。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2012-07-07",url:"https://sawyer-blog.example/2012-07-07",snippet:`2012-07-07

今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。

原來，她是在幫我辦保險。

一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。

我的保險受益人，是爸爸媽媽。

而爸爸媽媽的保險受益人，也是我。

那一刻突然有點說不出話。

以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。

可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2013-01-01",url:"https://sawyer-blog.example/2013-01-01",snippet:`2013-01-01

美麗的天空 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:"/arg-game-it-company-secret/assets/data/files/sawyer_blog_pic.HEIC"},{title:"Sawyer Choi — 2023-04-25",url:"https://sawyer-blog.example/2023-04-25",snippet:`2023-04-25

有些決定，做了一輩子都不會後悔。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-05-01",url:"https://sawyer-blog.example/2023-05-01",snippet:`2023-05-01

爸媽，我會繼續努力的。你們放心。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-05-10",url:"https://sawyer-blog.example/2023-05-10",snippet:`2023-05-10

今天是媽媽的生日。如果她還在，應該會很高興看到公司的成長吧。我買了她最喜歡的檸檬茶，放在辦公桌上。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-12-20",url:"https://sawyer-blog.example/2023-12-20",snippet:`2023-12-20

2023估計是我人生中最重要的一年 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2024-01-15",url:"https://sawyer-blog.example/2024-01-15",snippet:`2024-01-15

壓力越來越大，但我不能停下來。太多人依賴我了。如果他們知道真相... — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2024-03-20",url:"https://sawyer-blog.example/2024-03-20",snippet:`2024-03-20

今天又失眠了。夢見爸媽在看我，他們的眼神...我不知道該怎麼面對。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"廣志中學作文比賽",url:"https://school.example/guangzhi-essay-sawyer",snippet:"廣志中學聖誕假期作文比賽二等獎穫奬學生 中五甲班 蔡梓掦",type:"web",image:"/arg-game-it-company-secret/assets/data/files/sawyer_writing_1.png",images:["/arg-game-it-company-secret/assets/data/files/sawyer_writing_1.png","/arg-game-it-company-secret/assets/data/files/sawyer_writing_2.png"]},{title:"新聞：夫婦平和道遇車禍雙亡　29歲兒子獲大額保險賠償",url:"https://news.example/car-accident-2023",snippet:`【本報訊】

2023年，一對夫婦在平和道發生嚴重交通事故，兩人最終不幸離世。意外發生後，29歲兒子成為相關保險賠償的主要受益人，據悉獲得一筆大額賠償。
事故發生於2023年某日，涉事夫婦當時途經平和道，期間與另一輛車輛發生碰撞。救援人員接報後迅速趕抵現場，惟兩人傷勢嚴重，經搶救後仍證實不治。
夫婦突然離世，令家人深受打擊。其29歲兒子在處理父母身後事及相關法律程序期間，亦需要面對保險索償及遺產安排等一系列問題。
據了解，涉事夫婦生前曾購買多份保險，當中包括人壽及意外保障。由於兩人同時因意外身故，符合相關保單的賠償條件，兒子最終獲得一筆金額可觀的保險賠償。
值得一提的是，意外發生地點附近一幢大樓由某集團旗下公司持有。集團創辦人 Fredy 得悉事件後表示深感惋惜，並對夫婦突然離世表示哀痛。Fredy其後決定向其遺屬提供一筆私人捐贈，希望在其面對家庭變故及生活壓力之際，提供一些實際援助。
Fredy表示，意外雖然令人惋惜，但更重要的是希望社會能夠在有需要時互相扶持，因此決定以個人名義向死者家屬伸出援手。至於捐贈的具體金額，則未有對外公布。
有保險業人士指出，保險賠償金額取決於保單種類、投保額、受益人安排及事故是否符合保障條款等因素，不能單純以事故造成的死亡推算實際賠償金額。
這宗意外亦再次引起社會對道路安全及家庭保障的關注。對不少家庭而言，突如其來的交通事故不僅帶來無法彌補的傷痛，亦可能造成長期的經濟影響。社會人士呼籲駕駛者時刻保持警覺，同時及早做好家庭保障及財務規劃。
`,type:"news",image:null},{title:"新聞：平和道致命車禍調查 — 煞車油管疑遭人為破壞",url:"https://news.example/car-accident-investigation-2023",snippet:`【本報訊】

2023年平和道致命車禍案，調查報告近日流出。報告指出，涉事車輛的煞車油管有異常切割痕跡，初步鑑定疑為人為破壞，但因證據不足，警方最終未有立案調查。
報告透露，事故車輛為一輛 2018 年款房車，事發前一週剛完成保養。負責鑑證的技術人員指出，油管切口整齊，與自然老化或意外損壞的特徵不符。
然而，由於事發路段的監視器恰巧在事故前一週故障，未能拍到任何可疑人士，加上缺乏直接證據，案件最終以「意外」結案。
附近商戶接受本報查詢時表示，事發前一週曾見一名年約 30 歲的男子在路段附近徘徊，但因天色昏暗，未能看清面貌。
有法律界人士指出，若日後發現新證據，案件仍有重新調查的可能。
`,type:"news",image:null},{title:"新聞：事發前一週曾見可疑男子在平和道一帶徘徊",url:"https://news.example/ping-wo-suspicious-man-2023",snippet:`【本報訊】

本報接獲讀者報料，指 2023 年平和道致命車禍發生前一週，曾有一名年約 30 歲的男子在事故路段附近多次現身。
該名讀者為附近便利店職員，表示：「那幾天我當夜班，總看到同一個男人在對面馬路站著，像是在等什麼人。他穿著深色外套，戴著帽子，看起來不太像本地人。」
另一名附近停車場管理員亦表示，事發前數日曾見該男子在停車場出入口徘徊，「他好像在觀察什麼車輛，但我不確定」。
由於該路段事發前一週監視器故障，警方未能取得任何影像證據。警方回應稱，已知悉相關線索，惟現階段暫無足夠證據顯示案件涉及刑事成分。
有犯罪學專家指出，若有人預謀破壞車輛煞車系統，通常會在事發前多次踩點，觀察目標車輛的停放位置與行車路線。
`,type:"news",image:null},{title:"新聞：警方澄清平和道車禍純屬意外　煞車油管損壞為自然老化",url:"https://news.example/police-clarification-2023",snippet:`【本報訊】

針對近日網上流傳有關 2023 年平和道致命車禍的調查報告，警方今日（2024 年 3 月 15 日）發聲明澄清，指該宗車禍經詳細調查後，已確認純屬意外。
警方表示：「經法證科學鑑證，涉事車輛的煞車油管損壞屬自然老化所致，並無證據顯示涉及人為破壞。」
聲明又指出，現場監視器故障為獨立事件，與車禍無關。警方呼籲市民切勿妄加揣測，以免對家屬造成二次傷害。
死者家屬對此回應：「父母的離去是我人生最大的損失。我會帶著他們的期望繼續努力，不會被這些不實傳言影響。」
`,type:"news",image:null},{title:"Sawyer Choi：父母的離去是我人生最大的損失",url:"https://news.example/sawyer-statement-2023",snippet:`【本報訪問】

2023 年平和道車禍死者的兒子 Sawyer Choi（蔡梓掦）近日首度接受本報訪問，談及父母離世後的心路歷程。
「父母的離去是我人生最大的損失。我會帶著他們的期望繼續努力。」Sawyer 語帶哽咽地說。
他表示，事發後一直專注於處理後事及公司事務，未有時間回應外界種種揣測。「我知道有人在說一些奇怪的話，但那些都不是真的。我只是想好好地紀念他們。」
Sawyer 創辦的 Nori 飲品供應，在車禍後一年內業績大幅增長。對此他解釋：「這是父母留給我的力量。我想讓他們知道，他們的兒子不會讓他們失望。」
他亦澄清了外界對其突然變富的質疑：「公司的发展得益于一筆意外的投資，以及團隊的努力。我希望外界不要再做無謂的揣測。」
`,type:"news",image:null},{title:"那些藏在程式碼裡的小彩蛋：我在小團隊看到的開發者塗鴉 — Peter Lin",url:"https://peter-blog.example/code-easter-eggs",snippet:"待過幾間中小企業後發現，只要沒有嚴格的 code quality 流程，程式碼裡總會冒出一些跟公司或產品完全無關的東西——註解裡的粗口、對工作的抱怨、整段國歌歌詞，甚至藏得很深的小遊戲。我對這些小彩蛋的看法是：只要不影響功能與效能，算是工作中找到的小樂趣。 — Peter Lin",type:"web",image:"https://picsum.photos/seed/codeeggs/600/400"},{title:"給完全不懂程式的人：MD5 是什麼？把一句話變成一串亂碼的小魔法 — Peter Lin",url:"https://peter-blog.example/md5-for-beginners",snippet:"完全不懂程式也看得懂。MD5 就像一台指紋機：你丟一句話進去，它永遠吐出 32 個字由 0-9、a-f 組成的亂碼。同樣輸入永遠得到同樣輸出，改一個字結果就完全不同。例如 hello → 5d41402abc4b2a76b9719d911017c592，平常看到的 ?hash=be78e754... 就是典型例子。— Peter Lin",type:"web",image:"https://picsum.photos/seed/md5/600/400"}],Sn={sawyer:{id:"sawyer",name:"Sawyer Choi",handle:"@sawyerchoi",displayName:"Sawyer Choi / 蔡梓掦",bio:"喜歡把日常小事寫成文字的人。從2001年開始在 BlogWorld 記錄生活，覺得能把想法寫下來，好像就能更理解自己一點。",avatar:"/arg-game-it-company-secret/lemon_tea.jpg",cover:"/arg-game-it-company-secret/lemon_tea.jpg",followers:842,following:37,joined:"2001-10-01",verified:!1},mary:{id:"mary",name:"Mary Chen",handle:"@marychen",displayName:"Mary Chen · 陳曉玲",bio:"旅遊 × 攝影 × 生活手帳。走過 27 個城市，喜歡在咖啡香裡寫明信片。",avatar:"https://i.pravatar.cc/150?u=mary",cover:"https://picsum.photos/seed/marycover/900/240",followers:12430,following:210,joined:"2018-03-12",verified:!0},peter:{id:"peter",name:"Peter Lin",handle:"@peterlin",displayName:"Peter Lin · 林柏安",bio:"後端工程師 / 開源愛好者。分享 Python、NAS、自架服務與踩坑筆記。",avatar:"https://i.pravatar.cc/150?u=peter",cover:"https://picsum.photos/seed/petercover/900/240",followers:8930,following:96,joined:"2019-07-20",verified:!0},paul:{id:"paul",name:"Paul Wang",handle:"@paulwang",displayName:"Paul Wang · 王志豪",bio:"台南胃、台北心。專門挖掘巷弄美食與手沖咖啡，記錄每一口幸福。",avatar:"https://i.pravatar.cc/150?u=paul",cover:"https://picsum.photos/seed/paulcover/900/240",followers:15600,following:143,joined:"2017-11-05",verified:!0},emma:{id:"emma",name:"Emma Wu",handle:"@emmaw",displayName:"Emma Wu · 吳思敏",bio:"底片攝影 / 極地旅人。想用快門留住光線的溫度。",avatar:"https://i.pravatar.cc/150?u=emma",cover:"https://picsum.photos/seed/emmacover/900/240",followers:6720,following:78,joined:"2020-01-18",verified:!1},david:{id:"david",name:"David Chang",handle:"@davidchang",displayName:"David Chang · 張大衛",bio:"黑膠收藏家 / Live House 常客。寫音樂，也寫城市的聲音。",avatar:"https://i.pravatar.cc/150?u=david",cover:"https://picsum.photos/seed/davidcover/900/240",followers:4210,following:52,joined:"2019-09-03",verified:!1}},ee=[{url:"https://sawyer-blog.example/2001-10-18",title:"Sawyer Choi — 2001-10-18",excerpt:"今天和好多朋友一起玩，大家都玩得很開心。我把自己的食物分給大家吃，他們笑得很開心。",content:`2001-10-18

今天和好多朋友一起玩，大家都玩得很開心。

我把自己的食物分給大家吃，他們吃完都笑得很開心。我覺得只要大家在一起，好像什麼都很好玩。朋友們都說我很好笑，我也喜歡看他們笑。

回家的時候，我把今天和朋友玩的事情告訴爸爸媽媽。他們聽完也很開心，還一直問我今天跟誰一起玩、玩了什麼。

今天真的很好玩，我希望明天也可以和大家一起玩。`,authorId:"sawyer",date:"2001-10-18",views:3420,likes:128,topic:"成長",tags:["童年","友情","日常"],cover:null},{url:"https://sawyer-blog.example/2003-04-27",title:"Sawyer Choi — 2003-04-27",excerpt:"拿同學的眼鏡來玩，被老師寫了不好的評語。更難過的是，那個同學什麼都沒有說。",content:`2003-04-27

今天上課的時候，我拿同學的眼鏡來玩，圍繞班房一直跑假裝不會再還他，老師看到了，叫住我，問我是不是在欺負同學，還在我的手冊上寫了不好的評語。

我覺得很難過。

更讓我難過的是，那個同學一直什麼都沒有說。我不知道他為什麼不幫我，他不喜歡這樣嗎？但我也沒有傷害到他吧。

晚上吃飯的時候，爸爸媽媽問我老師為什麼會在手冊上這樣寫，我什麼都沒有說。只是眼淚突然掉了一滴在桌上。

他們沒有再問我，只是拿了一包檸檬茶給我。這是我小時候很喜歡喝的東西。

可是現在我覺得它太甜了，已經不太想喝了。

只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。`,authorId:"sawyer",date:"2003-04-27",views:8920,likes:342,topic:"成長",tags:["學校","成長","檸檬茶"],cover:"/arg-game-it-company-secret/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2004-11-13",title:"Sawyer Choi — 2004-11-13",excerpt:"不小心戳到表妹的眼睛，所有大人都看著我。那一刻腦袋一片空白。",content:`2004-11-13

今天和表妹一起玩的時候，我不小心戳到了她的眼睛。

我馬上去看她有沒有受傷，也一直看看她的眼睛有沒有怎麼樣。可是她還是跑去她爸爸那裏，一直說是我弄到她的眼睛。

這時所有大人都看著我，大家都覺得是我的錯。

可是我不知道要說什麼。

我那一刻腦袋裏一片空白。連爸爸媽媽也沒有站在我這邊，一直在問我為什麼要這樣做，我只好一直站在那裏。

那些大人的眼神，讓我覺得很不舒服。

其實，這已經不是第一次有這種感覺了。`,authorId:"sawyer",date:"2004-11-13",views:15600,likes:721,topic:"家庭",tags:["家庭","道歉","成長"],cover:null},{url:"https://sawyer-blog.example/2006-09-01",title:"Sawyer Choi — 2006-09-01",excerpt:"要去新的學校了，卻一點都不想去。很害怕要認識新的同學，也不知道要怎麼跟他們說話。",content:`2006-09-01

今天要去新的學校了。

可是我一點都不想去。

我很害怕要認識新的同學，也不知道要怎麼跟他們說話。一直想著，如果沒有人跟我做朋友怎麼辦？

我甚至開始想，為什麼學生一定要去學校？

想了很久，我覺得大概是因為知識對以後的人生還是很重要。至少多學一點東西，將來應該會對自己有幫助。

所以，我還是會努力讀書。

至於朋友……慢慢再說吧。

一個人好像也沒有什麼不好。`,authorId:"sawyer",date:"2006-09-01",views:5210,likes:198,topic:"校園",tags:["學校","孤獨","成長"],cover:null},{url:"https://sawyer-blog.example/2007-01-11",title:"Sawyer Choi — 2007-01-11",excerpt:"沒想到，竟然交到了比自己想像中還要多的朋友。原來我這麼會逗大家笑。",content:`2007-01-11

沒想到，我竟然交到了比自己想像中還要多的朋友。

原本以為來到新學校會很孤單，結果大家好像都很喜歡跟我一起玩。甚至連老師都覺得我是個很幽默的人。

我自己也不知道，原來我這麼會逗大家笑。

現在想到要回學校，好像也沒有以前那麼討厭了。

有朋友一起上課、一起聊天、一起笑，學校突然變得有趣很多。

看來，我之前真的想太多了。`,authorId:"sawyer",date:"2007-01-11",views:23400,likes:1024,topic:"校園",tags:["友情","校園","幽默"],cover:null},{url:"https://sawyer-blog.example/2007-01-12",title:"Sawyer Choi — 2007-01-12",excerpt:"朋友分享的歌手越聽越喜歡，開得太大聲被媽媽說「太難聽了吧？」",content:`2007-01-12

今天朋友跟我分享了一個他很喜歡的歌手和他創作的歌曲。

本來只是想聽聽看，結果越聽越喜歡。回到家之後，我直接把那個歌單放出來，而且越開越大聲。

我聽得太投入了，完全沒有發現爸爸媽媽已經回家。

直到媽媽突然說：

「太難聽了吧？」

我才發現原來他們早就回來了。

可能真的太大聲了。

還是我喜歡的事物一直都很冷門？`,authorId:"sawyer",date:"2007-01-12",views:18700,likes:843,topic:"音樂",tags:["音樂","家庭","成長"],cover:null},{url:"https://sawyer-blog.example/2010-06-06",title:"Sawyer Choi — 2010-06-06",excerpt:"媽媽又買了一箱檸檬茶。以前很喜歡，現在卻覺得太甜了。可能有些東西長大後就不一樣了。",content:`2010-06-06

今天媽媽又買了一箱檸檬茶回來。

看到它的時候，我突然想起以前很喜歡喝檸檬茶。

小時候總覺得它很好喝，甜甜的，喝完心情也會很好。

不知道為什麼，現在再看到它，突然有一種很奇怪的感覺。

可能有些東西就是這樣吧。

以前很喜歡的東西，長大以後不一定還會喜歡。`,authorId:"sawyer",date:"2010-06-06",views:9800,likes:412,topic:"家庭",tags:["檸檬茶","成長","家庭"],cover:"/arg-game-it-company-secret/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2012-07-07",title:"Sawyer Choi — 2012-07-07",excerpt:"媽媽帶我去辦保險，才發現彼此的受益人都是對方。那一刻才感覺到，原來我們都在替彼此想著以後。",content:`2012-07-07

今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。

原來，她是在幫我辦保險。

一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。

我的保險受益人，是爸爸媽媽。

而爸爸媽媽的保險受益人，也是我。

那一刻突然有點說不出話。

以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。

可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。`,authorId:"sawyer",date:"2012-07-07",views:12300,likes:567,topic:"家庭",tags:["保險","家庭","成長"],cover:null},{url:"https://sawyer-blog.example/2013-01-01",title:"Sawyer Choi — 2013-01-01",excerpt:"美麗的天空",content:`2013-01-01

美麗的天空`,authorId:"sawyer",date:"2013-01-01",views:7600,likes:310,topic:"攝影",tags:["天空","攝影","日常"],cover:"/arg-game-it-company-secret/assets/data/files/sawyer_blog_pic.HEIC"},{url:"https://sawyer-blog.example/2023-12-20",title:"Sawyer Choi — 2023-12-20",excerpt:"2023估計是我人生中最重要的一年",content:`2023-12-20

2023估計是我人生中最重要的一年`,authorId:"sawyer",date:"2023-12-20",views:99,likes:1,topic:"心情",tags:[],cover:null},{url:"https://sawyer-blog.example/2023-04-25",title:"Sawyer Choi — 2023-04-25",excerpt:"有些決定，做了一輩子都不會後悔。",content:`2023-04-25

有些決定，做了一輩子都不會後悔。`,authorId:"sawyer",date:"2023-04-25",views:2100,likes:87,topic:"心情",tags:["決定","人生"],cover:null},{url:"https://sawyer-blog.example/2023-05-01",title:"Sawyer Choi — 2023-05-01",excerpt:"爸媽，我會繼續努力的。你們放心。",content:`2023-05-01

爸媽，我會繼續努力的。你們放心。`,authorId:"sawyer",date:"2023-05-01",views:4300,likes:198,topic:"家庭",tags:["父母","紀念"],cover:null},{url:"https://sawyer-blog.example/2023-05-10",title:"Sawyer Choi — 2023-05-10",excerpt:"今天是媽媽的生日。如果她還在，應該會很高興看到公司的成長吧。",content:`2023-05-10

今天是媽媽的生日。

如果她還在，應該會很高興看到公司的成長吧。

我買了她最喜歡的檸檬茶，放在辦公桌上。雖然她喝不到了，但我想讓她知道，我一直都記得。`,authorId:"sawyer",date:"2023-05-10",views:3800,likes:167,topic:"家庭",tags:["檸檬茶","生日","紀念"],cover:"/arg-game-it-company-secret/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2024-01-15",title:"Sawyer Choi — 2024-01-15",excerpt:"壓力越來越大，但我不能停下來。太多人依賴我了。如果他們知道真相...",content:`2024-01-15

壓力越來越大，但我不能停下來。

太多人依賴我了。如果他們知道真相...

算了，不想了。繼續工作。`,authorId:"sawyer",date:"2024-01-15",views:156,likes:3,topic:"心情",tags:["壓力","秘密"],cover:null},{url:"https://sawyer-blog.example/2024-03-20",title:"Sawyer Choi — 2024-03-20",excerpt:"今天又失眠了。夢見爸媽在看我，他們的眼神...我不知道該怎麼面對。",content:`2024-03-20

今天又失眠了。

夢見爸媽在看我，他們的眼神...

我不知道該怎麼面對。

也許，有些事情永遠都不會有答案。`,authorId:"sawyer",date:"2024-03-20",views:203,likes:5,topic:"心情",tags:["失眠","父母","夢"],cover:null},{url:"https://mary-blog.example/kyoto-sakura-2024",title:"京都賞櫻七日散策 — 從哲學之道到嵐山小火車",excerpt:"沿著哲學之道慢慢走，櫻花像雪一樣落在肩頭。嵐山小火車穿過山谷那一刻，我明白了什麼叫「一期一會」。",content:`三月底的京都，櫻花比預報早開了兩天。

第一天我從哲學之道開始，整條小徑兩側都是染井吉野櫻，風一吹，花瓣像細雪一樣落下。有位老婆婆坐在長椅上摺紙鶴，她說每年都會來這裡看一次櫻花，已經三十年了。

第二天搭嵐山小火車，車廂是開放式的，山谷的風直接吹在臉上。保津川的水很清，偶爾能看到一兩隻鷺鷥站在石頭上。

最喜歡的是傍晚在鴨川邊發呆，看著情侶、學生、上班族各自走過，像是一部沒有劇本的電影。

旅行教我的事：不用趕行程，慢慢走反而能看見更多。`,authorId:"mary",date:"2024-04-02",views:8900,likes:523,topic:"旅遊",tags:["京都","櫻花","旅行"],cover:"https://picsum.photos/seed/kyoto/600/400"},{url:"https://mary-blog.example/one-person-kitchen",title:"一人廚房：三道十分鐘上菜的下班療癒料理",excerpt:"下班後不想叫外送？這三道菜只要十分鐘，連洗碗都很快。給獨居的你，也給想好好吃飯的自己。",content:`獨居第三年，我終於學會不把「煮飯」當成壓力。

第一道：蒜香櫛瓜炒蝦仁。櫛瓜切薄片，大火快炒，加一點檸檬汁就很清爽。

第二道：番茄豆腐味噌湯。把所有材料丟進鍋子，五分鐘就能喝到熱湯，配白飯就很滿足。

第三道：半熟蛋拌菠菜。菠菜燙一下、擠乾水份，和半熟蛋、醬油、芝麻油拌在一起，超下飯。

一個人吃飯，也可以很隆重。點一盞燈，擺好碗筷，為自己好好煮一頓飯，就是對今天最溫柔的收尾。`,authorId:"mary",date:"2024-03-15",views:12400,likes:812,topic:"美食",tags:["料理","一人食","療癒"],cover:"https://picsum.photos/seed/cooking/600/400"},{url:"https://mary-blog.example/danshari-half-year",title:"斷捨離半年後，我學會的五件小事",excerpt:"丟掉 120 公斤的東西後，房間變大了，心也變輕了。原來不需要的東西，遠比想像中多。",content:`去年冬天，我決定把房間裡超過一年沒用的東西全部清掉。

結果清出了 18 袋垃圾、7 箱回收，和一整櫃沒穿過的衣服。

半年後，我發現：
1. 衣櫃只剩 30 件衣服，反而每天更好搭配。
2. 桌子空了，工作更專心。
3. 不再衝動購物，存下的錢去了一趟小旅行。
4. 打掃從兩小時變成二十分鐘。
5. 最重要的是，學會問自己：這真的是我需要的嗎？

斷捨離不是丟東西，是重新選擇留下什麼。`,authorId:"mary",date:"2023-11-20",views:6700,likes:401,topic:"生活",tags:["斷捨離","生活","成長"],cover:"https://picsum.photos/seed/danshari/600/400"},{url:"https://peter-blog.example/python-one-year",title:"自學 Python 一年的踩坑筆記：從爬蟲到自動化報表",excerpt:'從 print("Hello") 到每天自動跑的報表腳本，這一年我踩過的坑，希望你不用再踩一次。',content:`一年前，我連 pip 是什麼都不知道。

第一個月：跟著官方教學寫爬蟲，結果被網站的反爬蟲封 IP，學會了加 header、睡隨機秒數。

第三個月：開始用 pandas 處理公司每週的 Excel 報表，本來要花兩小時手動整理，現在一個指令就完成，主管以為我加班，其實我在喝咖啡。

第六個月：踩到最大坑——編碼。CSV 用 excel 開啟全是亂碼，後來才知道要存成 utf-8-sig。

給新手的建議：不要追求一次學會所有套件，先解決一個實際問題，你會學得更快。`,authorId:"peter",date:"2024-02-10",views:15600,likes:923,topic:"科技",tags:["Python","自學","效率"],cover:"https://picsum.photos/seed/python/600/400"},{url:"https://peter-blog.example/vim-vs-vscode",title:"Vim vs VSCode：我最後為什麼還是回到 Vim",excerpt:"用了三年 VSCode，我還是回到了 Vim。不是因為情懷，而是因為手指不想離開鍵盤。",content:`VSCode 很棒，外掛多、介面美、什麼都能做。但我發現自己一直在用滑鼠。

回到 Vim 之後，我重新設定了 .vimrc，把常用操作都綁成快捷鍵。現在寫程式，眼睛不用離開螢幕，手也不用離開鍵盤。

當然，Vim 的學習曲線很陡，前兩週我每天都在查 cheat sheet。但一旦肌肉記憶形成，效率真的會回不去。

結論：沒有最好的編輯器，只有最適合你手指的編輯器。`,authorId:"peter",date:"2023-09-18",views:8200,likes:412,topic:"科技",tags:["Vim","VSCode","工具"],cover:"https://picsum.photos/seed/vim/600/400"},{url:"https://peter-blog.example/nas-ds220",title:"家用 NAS 入門：Synology DS220+ 開箱與備份策略",excerpt:"照片、影片、文件散落在各個硬碟？一台 NAS 幫我把十年的回憶全部收好，還能自動備份。",content:`買 DS220+ 之前，我的照片分散在三顆外接硬碟、一台舊筆電和雲端。

安裝比想像中簡單，插上兩顆 4TB 硬碟，照著精靈設定，半小時就完成。

我設了三層備份：
1. 手機照片自動同步到 NAS
2. NAS 每週備份到外接硬碟
3. 重要文件再同步一份到雲端

最有感的是，再也不怕手機丟了照片就不見。所有的回憶，都在自己家裡好好存著。`,authorId:"peter",date:"2023-06-12",views:4300,likes:210,topic:"科技",tags:["NAS","備份","開箱"],cover:"https://picsum.photos/seed/nas/600/400"},{url:"https://peter-blog.example/code-easter-eggs",title:"那些藏在程式碼裡的小彩蛋：我在小團隊看到的開發者塗鴉",excerpt:"待過幾間小公司後，我在程式碼裡翻過粗口、抱怨、整首國歌，甚至不起眼的小遊戲。大多是小企業沒人管 code quality 才會長出來的東西。",content:`待過幾間中小企業之後，我歸納出一個規律：只要團隊對 code quality 管得不嚴，程式碼庫遲早會長出一些跟公司或產品完全無關的東西。

我看過幾種，最常見的是藏在註解裡的粗口。某個凌晨三點還在解 bug 的同事，直接在註解寫「這段爛 code 別再問我為什麼這樣寫，我也不知道」。還有對工作的不滿，有人在一個永遠不會被執行到的 else 分支裡，留了一整段抱怨，說這個需求改了第七次、希望明天不用再改。

最誇張的一次，是在一支內部工具的常數檔最底部，有人把國歌的歌詞整段貼上去，還用 ASCII art 排成旗子的形狀。問他為什麼，他說只是測試多行字串，沒有要上線，後來就忘了刪，結果一路跟著部署到正式環境。

還有那種不起眼的小程式。有個同事在後台的 404 頁面裡，藏了一個用鍵盤方向鍵就能玩的小貪食蛇，按 Konami Code 才會觸發。一般使用者永遠不會發現，只有我們幾個開發者知道，午休時會偷偷比誰分數高。

為什麼這些東西幾乎只出現在小企業？我的觀察很簡單：大公司有嚴格的 lint、SonarQube、強制 code review，連註解寫錯字都會被擋下來。小團隊很多時候是「能動就好」，review 只是形式，甚至根本沒人看第二眼，久了大家就覺得，塞一點無害的東西也不會有人發現。

我對這種行為的看法是，只要不影響效能、不影響功能、不洩露敏感資訊，也沒有攻擊性或歧視性的內容，其實算是工作中找到的小樂趣。

寫程式已經夠枯燥了，每天面對需求、時程、bug，如果能在不傷害產品的前提下，留一個只有自己人懂的小彩蛋，那反而會讓人覺得，這份工作還有點人味。像是那個貪食蛇，後來新人 onboarding 時，我們都會跟他說「去 404 按按看」，大家笑一下，氣氛就輕鬆很多。

當然，底線還是要有。不能因為好玩就亂塞會影響效能的程式碼，也不能把情緒發洩變成對同事或客戶的人身攻擊。分清楚「無害的塗鴉」和「不負責任」就好。

如果你的團隊現在還沒有嚴格的規範，與其一味禁止，不如把這些小彩蛋當成一個訊號：代表你們需要更好的流程，但也代表，你們的團隊還保有那一點點自由和幽默感。`,authorId:"peter",date:"2024-05-18",views:12800,likes:672,topic:"科技",tags:["程式碼","開發者文化","職場","彩蛋","Code Review"],cover:"https://picsum.photos/seed/codeeggs/600/400"},{url:"https://peter-blog.example/md5-for-beginners",title:"給完全不懂程式的人：MD5 是什麼？把一句話變成亂碼的指紋機 — Peter Lin",excerpt:"完全不懂程式也看得懂。MD5 就像一台指紋機：你丟一句話進去，它永遠吐出 32 個字的亂碼（0-9、a-f），同樣輸入永遠得到同樣輸出，改一個字結果就完全不同。平常看到的 ?hash=be78e754... 就是典型例子。",content:`你有在網址或下載頁看過 \`3eccfdd5571ecc9beb8da226ce5a8494\` 這種 32 個字的亂碼嗎？那很可能就是 MD5。

我用最簡單的方式解釋，完全不需要會寫程式。

一、MD5 是什麼？
想像它是一台「指紋機」。你把任何一句話、任何長度的文字丟進去，它都會吐出一串固定長度、32 個字的亂碼，內容只會有 0-9 和 a-f。例如：
- 輸入 \`hello\` → \`5d41402abc4b2a76b9719d911017c592\`
- 輸入 \`hello1\`（只多一個字）→ \`203ad5ffa1d7c650ad681fdff3965cd2\` 完全不一樣

兩個特性很重要：
1. 同樣的輸入，永遠得到同樣的輸出。算一百次都一樣。
2. 只要改一個字，輸出的亂碼就會天差地遠。

二、生活中哪裡會用到？
最常見的例子是檢查檔案有沒有被改過。例如你從網路下載一個 2GB 的安裝檔，網站會同時公布它的 MD5：\`d41d8cd98f00b204e9800998ecf8427e\`。下載完後，你用工具算一下手邊檔案的 MD5，如果一模一樣，就代表檔案完整沒被動過；只要有一個位元組被改，hash 就完全不同。

另外一種常見用法是把比較長的資訊，轉成不好直接看懂的指紋，放在網址或資料庫裡做比對。伺服器收到後，只要用同樣的方式再算一次，比對 hash 對不對，就能驗證，不用直接傳原本的明文。這就像對暗號。

三、自己怎麼玩？（不用寫程式）
1. 去 Google 搜尋「MD5 generator」或「MD5 線上產生器」。
2. 隨便找一個線上工具。
3. 在輸入框貼上你的文字，例如 \`hello\` 或 \`MySecret123\`，按產生。
4. 它就會立刻給你那串 32 個字的亂碼。
你也可以試試把同樣一句話多加一個空白或換一個字，觀察 hash 如何完全改變。

四、要記住的重點
- MD5 是單向的：看著亂碼，你猜不回原文，只能把原文重新算一次來比對。
- 它不是加密，是指紋。目的是驗證完整性，而不是永久保密。
- 它的輸出永遠是 32 個 16 進位字元，這就是為什麼你常常看到那種長度的亂碼。

懂了這個，以後再看到網址後面的 hash，就不會覺得它是神秘亂碼，而是「某段文字的指紋」了。

— Peter Lin`,authorId:"peter",date:"2024-06-10",views:9860,likes:543,topic:"科技",tags:["MD5","程式入門","雜湊","hash","新手教學"],cover:"https://picsum.photos/seed/md5/600/400"},{url:"https://paul-blog.example/tainan-beef-soup",title:"台南牛肉湯全攻略：在地人帶路的五間深夜食堂",excerpt:"凌晨三點的台南，牛肉湯的蒸氣比路燈還溫暖。這五間，是我吃過十年後還會想念的味道。",content:`台南的牛肉湯不是湯，是溫體牛肉用熱湯沖出來的甜。

第一間：文章牛肉湯。觀光客很多，但品質穩定，肉片厚、湯頭清甜。

第二間：六千牛肉湯。凌晨三點去排隊，點頭尾，牛肉的油花最漂亮。

第三間：無名小攤（海安路）。沒有招牌，只有一個阿伯和五張桌子，但湯頭用了大量蔬果熬，喝起來最溫潤。

吃牛肉湯的秘訣：不要加太多調味，先喝原味，再試米酒和薑絲。`,authorId:"paul",date:"2024-01-28",views:20300,likes:1340,topic:"美食",tags:["台南","牛肉湯","深夜食堂"],cover:"https://picsum.photos/seed/beefsoup/600/400"},{url:"https://paul-blog.example/hand-drip-coffee",title:"手沖咖啡入門：從選豆到水溫的實驗筆記",excerpt:"同樣的豆子，水溫差 5 度，風味就完全不同。這半年，我記錄了 30 次沖煮的失敗與成功。",content:`開始手沖後，我才知道原來水溫這麼重要。

93 度：酸度明亮，適合淺焙的花果香。
88 度：甜感突出，堅果、巧克力味更明顯。
83 度：口感最平順，但香氣會少一點。

我現在的配方：20g 豆子、300ml 水、93 度、分三次注水，總時間 2:30。

最有趣的是，同样的豆子，每次沖出來都不太一樣。像在跟豆子對話一樣。`,authorId:"paul",date:"2023-10-14",views:11200,likes:687,topic:"美食",tags:["咖啡","手沖","實驗"],cover:"https://picsum.photos/seed/coffee/600/400"},{url:"https://paul-blog.example/keelung-night-market",title:"基隆夜市隱藏版：13號攤的碳烤三明治為何排一小時也值得",excerpt:"沒有招牌、沒有菜單，只有三種口味。老闆說：我只做我覺得好吃的。",content:`基隆廟口夜市第13號攤，沒有名字。

只有碳烤三明治、豬排三明治、火腿三明治三種。麵包是老闆自己烤的，炭火香很足，裡面夾的蛋是半熟的，咬下去會流出來。

排隊要一小時，但老闆不急。每份都慢慢烤、慢慢夾，好像在做什麼儀式。

我問他為什麼不請人？他說：請人味道就不一樣了。

有時候，好吃不是因為技巧，是因為堅持。`,authorId:"paul",date:"2023-08-05",views:5400,likes:321,topic:"美食",tags:["夜市","基隆","三明治"],cover:"https://picsum.photos/seed/sandwich/600/400"},{url:"https://emma-blog.example/contax-t2-taipei",title:"底片日常：用 Contax T2 記錄台北的黃昏",excerpt:"數位很方便，但底片的等待讓每一張都更珍惜。這些黃昏，都是等了三天才看到的顏色。",content:`Contax T2 是我存了半年才買的。

第一次帶它出門，是在台北的河濱公園。黃昏的光很 мяг，整個城市都變成金色的。

底片最迷人的地方是，你永遠不知道會拍到什麼。對焦有點慢、曝光有點不可控，但洗出來那一刻的驚喜，是數位給不了的。

最近最喜歡的一張，是在公館的巷子裡，一隻貓坐在機車上睡覺，後面是剛亮起的路燈。`,authorId:"emma",date:"2024-03-22",views:7400,likes:445,topic:"攝影",tags:["底片","台北","黃昏"],cover:"https://picsum.photos/seed/contax/600/400"},{url:"https://emma-blog.example/iceland-aurora",title:"冰島極光追逐記：三晚未眠終於等到的綠光",excerpt:"零下十五度、風大到站不穩，第三晚凌晨兩點，天空突然像被打翻的螢光顏料。",content:`在冰島的前兩晚，雲層都很厚，導遊說機率不到 10%。

第三晚，我們開到一個完全沒有光害的湖邊。車外零下十五度，風大到門都打不開。

等到凌晨兩點，雲突然散開，一道綠光慢慢從天邊暈開，然後變成整片天空的舞動。

那一刻，所有人都安靜了。只聽得到快門聲和自己的呼吸。

原來極光不是「看到」，是「等到」。`,authorId:"emma",date:"2023-12-08",views:15800,likes:892,topic:"旅遊",tags:["冰島","極光","旅行"],cover:"https://picsum.photos/seed/aurora/600/400"},{url:"https://david-blog.example/vinyl-jazz-20",title:"黑膠回潮：我收藏的二十張必聽爵士入門",excerpt:"從 Miles Davis 到 Chet Baker，這二十張黑膠是我十年來反覆聽、還是不會膩的起點。",content:`第一張黑膠是 Miles Davis 的 Kind of Blue，在二手店用 300 元買的。

從此入坑。

我選這二十張的標準：旋律要美、錄音要好、半夜聽不會吵醒鄰居。

最推薦的三張：
1. Chet Baker - My Funny Valentine (深夜必聽)
2. Bill Evans - Waltz for Debby (適合雨天)
3. Norah Jones - Come Away With Me (最溫柔的入門)

黑膠的炒豆聲，一開始覺得是雜訊，後來覺得是陪伴。`,authorId:"david",date:"2024-02-28",views:3300,likes:201,topic:"音樂",tags:["黑膠","爵士","收藏"],cover:"https://picsum.photos/seed/vinyl/600/400"},{url:"https://david-blog.example/livehouse-map",title:"獨立樂團現場：從 Legacy 到小地方的聲音地圖",excerpt:"在 Live House 裡，音樂是立體的。你能感覺到鼓點打在胸口，吉他聲從腳底震上來。",content:`第一次去 Legacy 是大學時，看落日飛車。那時候還不知道什麼叫「現場」，只覺得音響好大聲。

後來才懂，現場的迷人之處在於不完美。主唱破音、吉他走調，但那種「此刻只有這裡」的感覺，是專線裡聽不到的。

我整理了台北五間最愛的 Live House：
Legacy、The Wall、小地方、Revolver、海邊的卡夫卡。

每一間的味道都不同，但都一樣吵、一樣熱、一樣讓人想再去一次。`,authorId:"david",date:"2023-07-19",views:5100,likes:298,topic:"音樂",tags:["LiveHouse","獨立樂團","現場"],cover:"https://picsum.photos/seed/livehouse/600/400"}],ms={"https://sawyer-blog.example/2001-10-18":[{user:"小雯",avatar:"https://i.pravatar.cc/150?u=xiaowen",time:"2001-10-19 08:12",text:"Sawyer 小時候就這麼會分享，難怪大家都喜歡跟你玩！",likes:3},{user:"阿哲",avatar:"https://i.pravatar.cc/150?u=azhe",time:"2002-02-11 14:33",text:"把食物分給大家那段好可愛，感覺能想像那個畫面。",likes:1}],"https://sawyer-blog.example/2003-04-27":[],"https://sawyer-blog.example/2004-11-13":[{user:"Sawyer Choi",avatar:"/arg-game-it-company-secret/lemon_tea.jpg",time:"2020-01-02 11:20",text:"現在回頭看，我想那時候如果我懂得先說一句「對不起」，可能事情就會簡單很多。那時候的我，好像完全沒有想到道歉會有這麼大的作用。",likes:0}],"https://sawyer-blog.example/2006-09-01":[{user:"同樣轉學過的人",avatar:"https://i.pravatar.cc/150?u=transfer",time:"2007-02-14 10:22",text:"我也經歷過轉學，那種害怕我懂。後來真的會慢慢變好的。",likes:9},{user:"學長",avatar:"",time:"2008-09-01 07:30",text:"「一個人也沒有什麼不好」這句話那時候的你一定很努力在說服自己吧。",likes:6}],"https://sawyer-blog.example/2007-01-11":[{user:"同班同學",avatar:"https://i.pravatar.cc/150?u=classmate",time:"2007-01-12 08:40",text:"紫菜羊真的超好笑！",likes:2},{user:"Sawyer Choi",avatar:"/arg-game-it-company-secret/lemon_tea.jpg",time:"2007-01-12 09:40",text:"你才紫菜羊!！",likes:2},{user:"Mary Chen",avatar:"https://i.pravatar.cc/150?u=mary",time:"2010-01-03 09:20",text:"幽默感真的是一種天賦，能讓大家開心是很厲害的事。",likes:8}],"https://sawyer-blog.example/2007-01-12":[{user:"音樂同好",avatar:"https://i.pravatar.cc/150?u=music",time:"2007-01-20 16:00",text:"被說難聽一定很受傷吧，但喜歡的東西本來就很主觀。",likes:11},{user:"David Chang",avatar:"https://i.pravatar.cc/150?u=david",time:"2024-02-20 21:10",text:"冷門才珍貴啊，來聽聽我推薦的黑膠，說不定你會喜歡！",likes:3}],"https://sawyer-blog.example/2010-06-06":[],"https://sawyer-blog.example/2012-07-07":[],"https://sawyer-blog.example/2013-01-01":[{user:"Emma Wu",avatar:"https://i.pravatar.cc/150?u=emma",time:"2014-03-23 07:12",text:"Beautiful sky~",likes:6},{user:"攝影同好",avatar:"",time:"2015-01-05 22:10",text:"這張天空的顏色好美，和我用底片拍的黃昏好像。",likes:2}],"https://sawyer-blog.example/2023-04-25":[],"https://sawyer-blog.example/2023-05-01":[],"https://sawyer-blog.example/2023-05-10":[],"https://sawyer-blog.example/2023-12-20":[],"https://sawyer-blog.example/2024-01-15":[],"https://sawyer-blog.example/2024-03-20":[],"https://mary-blog.example/kyoto-sakura-2024":[{user:"櫻花控",avatar:"",time:"2024-04-03 08:12",text:"哲學之道真的必去！我去年也走過，感動到哭。",likes:14},{user:"嵐山粉",avatar:"",time:"2024-04-04 12:30",text:"小火車那段寫得太好了，風的感覺都寫出來了。",likes:6}],"https://mary-blog.example/one-person-kitchen":[{user:"獨居新手",avatar:"",time:"2024-03-16 19:00",text:"今晚就試蒜香櫛瓜！謝謝分享，感覺真的很簡單。",likes:21},{user:"料理苦手",avatar:"",time:"2024-03-17 08:22",text:"半熟蛋拌菠菜看起來好好吃，已收藏。",likes:9}],"https://mary-blog.example/danshari-half-year":[{user:"整理控",avatar:"",time:"2023-11-22 10:10",text:"我也想試斷捨離，但每次都捨不得丟...",likes:5}],"https://peter-blog.example/python-one-year":[{user:"Python 新手",avatar:"",time:"2024-02-11 09:00",text:"utf-8-sig 那個坑我也踩過！太有共鳴了。",likes:33},{user:"工程師",avatar:"",time:"2024-02-12 14:20",text:"自動化報表那段太實用了，已經分享給同事。",likes:12}],"https://peter-blog.example/code-easter-eggs":[{user:"前端仔",avatar:"",time:"2024-05-19 10:21",text:"那個 404 貪食蛇太好笑了，我們公司也有人在 console 藏 ASCII 貓！",likes:18},{user:"後端老鳥",avatar:"",time:"2024-05-19 14:03",text:"小公司真的沒人管 code quality，之前還看過有人把國歌寫進常數檔，差點上線被客戶看到。",likes:12},{user:"Peter Lin",avatar:"https://i.pravatar.cc/150?u=peter",time:"2024-05-19 16:40",text:"哈哈對，其實只要不影響效能跟功能，我覺得這些算是工作裡的小樂趣啦。",likes:27}],"https://paul-blog.example/tainan-beef-soup":[{user:"台南人",avatar:"",time:"2024-01-29 07:30",text:"六千真的要凌晨去排，但絕對值得！",likes:18},{user:"吃貨",avatar:"",time:"2024-01-30 12:44",text:"收藏了，下次去台南照著吃！",likes:9}],"https://paul-blog.example/hand-drip-coffee":[{user:"咖啡新手",avatar:"",time:"2023-10-15 09:12",text:"93 度和 88 度真的差很多，學到了！",likes:11}],"https://emma-blog.example/contax-t2-taipei":[{user:"底片同好",avatar:"",time:"2024-03-23 10:00",text:"T2 真的是一台會讓人愛上的相機。",likes:7}],"https://emma-blog.example/iceland-aurora":[{user:"追光者",avatar:"",time:"2023-12-09 22:33",text:"等到極光那刻的安靜，我完全能想像。",likes:15}],"https://david-blog.example/vinyl-jazz-20":[{user:"爵士新手",avatar:"",time:"2024-03-01 20:10",text:"已加入購物車，謝謝推薦！",likes:4}],"https://david-blog.example/livehouse-map":[{user:"現場控",avatar:"",time:"2023-07-20 11:22",text:"小地方真的很棒，推推！",likes:6}]},gs=["switch","h1","HTML 標籤"],le="all",St="",ot=[],wa="",En={"https://stackoverflow.com/questions/10460126/html-heading-h1-h6-what-is-difference":{id:"10460126",title:"HTML 的 <h1> 到 <h6> 是什麼？什麼時候該用 h1？跟 <p> 有什麼差別？",url:"https://stackoverflow.com/questions/10460126/html-heading-h1-h6-what-is-difference",asked:"2024-02-10",viewed:"18.4k",votesQ:42,votesA:423,tags:["html","semantic-html","heading","seo"],fav:87,question:{author:"html新手",rep:"1,234",avatar:"https://i.pravatar.cc/150?u=htmlnewbie",time:"2024-02-10 14:22",content:`請問 HTML 的 <code>&lt;h1&gt;</code> 到 <code>&lt;h6&gt;</code> 是什麼意思？

我在看一個範例網站的原始碼時看到：
<pre><code>&lt;h1&gt;歡迎來到 Example 烘焙坊&lt;/h1&gt;
&lt;p&gt;每日手工現做，溫暖你的味蕾&lt;/p&gt;</code></pre>
跟 <code>&lt;p&gt;</code>、<code>&lt;div&gt;</code>、<code>&lt;span&gt;</code> 差在哪？為什麼大家都說一個頁面只能有一個 <code>&lt;h1&gt;</code>？對 SEO 有影響嗎？`},answers:[{accepted:!0,author:"前端老吳",rep:"24.5k",avatar:"https://i.pravatar.cc/150?u=laowu",time:"2024-02-10 15:03 · 已採納",votes:423,content:`<p><b>一句話總結：</b><code>&lt;h1&gt;～&lt;h6&gt;</code> 是「標題」標籤，有語意與層級；<code>&lt;p&gt;</code> 是「段落」，<code>&lt;div&gt;</code> 是無語意的區塊容器，<code>&lt;span&gt;</code> 是無語意的行內容器。</p>
<h3>1. &lt;h1&gt;～&lt;h6&gt; 是什麼？</h3>
<table class="so-table"><thead><tr><th>標籤</th><th>含義</th><th>預設樣式</th><th>SEO 權重</th></tr></thead><tbody>
<tr><td><code>&lt;h1&gt;</code></td><td>頁面主標題</td><td>最大、粗體</td><td>最高</td></tr>
<tr><td><code>&lt;h2&gt;</code></td><td>章節標題</td><td>次大</td><td>高</td></tr>
<tr><td><code>&lt;h3&gt;</code></td><td>小節標題</td><td>中</td><td>中</td></tr>
<tr><td><code>&lt;h4&gt;～&lt;h6&gt;</code></td><td>更細層級</td><td>遞減</td><td>低</td></tr>
</tbody></table>
 <pre><code>&lt;h1&gt;歡迎來到 Example 烘焙坊&lt;/h1&gt;        &lt;!-- 一個頁面一個，代表整頁主題 --&gt;
&lt;h2&gt;熱門商品&lt;/h2&gt;               &lt;!-- 章節 --&gt;
  &lt;h3&gt;可頌&lt;/h3&gt;           &lt;!-- 小節 --&gt;
  &lt;h3&gt;長棍麵包&lt;/h3&gt;
&lt;h2&gt;關於我們&lt;/h2&gt;
  &lt;p&gt;我們是一家在地手工烘焙坊，成立於 2019 年...&lt;/p&gt;</code></pre>
<h3>2. 跟 &lt;p&gt; / &lt;div&gt; / &lt;span&gt; 差在哪？</h3>
<ul>
<li><code>&lt;p&gt;</code>：段落，語意是「一段文字」，瀏覽器會加上下 margin，SEO 權重低於標題</li>
<li><code>&lt;div&gt;</code>：區塊容器，無語意，純排版用（例如包一個 card）</li>
<li><code>&lt;span&gt;</code>：行內容器，無語意，純樣式用（例如一句話中標紅一個詞）</li>
<li><code>&lt;h1&gt;</code>：標題，有語意，搜尋引擎會認為這是頁面主題</li>
</ul>
<pre><code>&lt;!-- 錯誤：用 div 假裝標題，搜尋引擎看不懂 --&gt;
&lt;div style="font-size:32px;font-weight:bold"&gt;歡迎來到 Example 烘焙坊&lt;/div&gt;

&lt;!-- 正確：用 h1，語意正確 --&gt;
&lt;h1&gt;歡迎來到 Example 烘焙坊&lt;/h1&gt;</code></pre>
<h3>3. 為什麼一個頁面最好只放一個 &lt;h1&gt;？</h3>
<p>HTML5 規範沒強制，但業界與 SEO 共識是：<code>&lt;h1&gt;</code> = 頁面大綱的根。放兩個以上會讓搜尋引擎與螢幕閱讀器分不清主標題。Google 的 John Mueller 也說過：用一個 <code>&lt;h1&gt;</code> 最清晰。</p>
<h3>4. 其他常用 HTML 標籤對照</h3>
<table class="so-table"><thead><tr><th>標籤</th><th>用途</th><th>是否語意</th><th>範例</th></tr></thead><tbody>
<tr><td><code>&lt;a&gt;</code></td><td>超連結</td><td>是</td><td><code>&lt;a href="/products"&gt;產品總覽&lt;/a&gt;</code></td></tr>
<tr><td><code>&lt;ul&gt;/&lt;ol&gt;/&lt;li&gt;</code></td><td>清單</td><td>是</td><td><code>&lt;ul&gt;&lt;li&gt;可頌&lt;/li&gt;&lt;/ul&gt;</code></td></tr>
<tr><td><code>&lt;img&gt;</code></td><td>圖片，需 <code>alt</code></td><td>是</td><td><code>&lt;img src="logo.png" alt="Example Logo"&gt;</code></td></tr>
<tr><td><code>&lt;header&gt;/&lt;nav&gt;/&lt;main&gt;/&lt;footer&gt;</code></td><td>語意化版面</td><td>是 (HTML5)</td><td>見下篇回答</td></tr>
</tbody></table>
<p style="color:#6a737c;font-size:13px">小技巧：在 DevTools 用 <code>document.querySelectorAll('h1')</code> 檢查頁面有幾個 h1。</p>`},{accepted:!1,author:"a11y小幫手",rep:"8,920",avatar:"https://i.pravatar.cc/150?u=a11y",time:"2024-02-11 09:18",votes:89,content:`<p>補充無障礙觀點：</p><ul><li>螢幕閱讀器會把 <code>&lt;h1&gt;～&lt;h6&gt;</code> 當作導覽地標，視障用戶可按 <code>H</code> 鍵在標題間跳轉。如果全用 <code>&lt;div&gt;</code>，他們會迷路。</li><li>不要跳級：<code>&lt;h1&gt;</code> 後面應接 <code>&lt;h2&gt;</code>，不要直接 <code>&lt;h1&gt; → &lt;h4&gt;</code></li><li>標題內只放文字，不要塞 <code>&lt;div&gt;</code>，例如 <code>&lt;h1&gt;&lt;div&gt;標題&lt;/div&gt;&lt;/h1&gt;</code> 是無效 HTML</li></ul><pre><code>&lt;!-- 無障礙檢查清單 --&gt;
✓ 一頁一 h1
✓ h2→h3 依序，不跳級
✓ 標題文字簡潔，能當大綱讀</code></pre>`}],commentsQ:[{user:"發問者",text:"原來 h1 是給搜尋引擎看的，不只是變大字！感謝！",time:"2024-02-10 16:40"},{user:"SEO小明",text:"推，上次把 logo 用 div 寫，被主管唸到爆",time:"2024-02-11 10:02"}]},"https://stackoverflow.com/questions/21051176/html-semantic-tags-header-nav-main-section-article":{id:"21051176",title:"HTML 語意化標籤是什麼？<header> <nav> <main> <section> <article> <footer> 該怎麼用？",url:"https://stackoverflow.com/questions/21051176/html-semantic-tags-header-nav-main-section-article",asked:"2024-03-02",viewed:"12.7k",votesQ:31,votesA:298,tags:["html5","semantic-html","accessibility"],fav:54,question:{author:"切版新手",rep:"892",avatar:"https://i.pravatar.cc/150?u=qieban",time:"2024-03-02 11:14",content:`常看到 <code>&lt;header&gt; &lt;nav&gt; &lt;main&gt; &lt;section&gt; &lt;article&gt; &lt;footer&gt;</code> 這些標籤，跟 <code>&lt;div&gt;</code> 有什麼不同？

是不是把所有 <code>&lt;div&gt;</code> 換成這些就比較厲害？一定要用嗎？`},answers:[{accepted:!0,author:"W3C翻譯官",rep:"18.3k",avatar:"https://i.pravatar.cc/150?u=w3c",time:"2024-03-02 13:45 · 已採納",votes:298,content:`<p><code>&lt;div&gt;</code> 是無語意的盒子，語意化標籤是「有名字的盒子」，讓機器看懂你的版面。</p>
<table class="so-table"><thead><tr><th>標籤</th><th>語意</th><th>一個頁面通常幾個</th><th>範例</th></tr></thead><tbody>
<tr><td><code>&lt;header&gt;</code></td><td>頁首 / 區塊首</td><td>1～多個</td><td>頁面頂的 logo + 導覽</td></tr>
<tr><td><code>&lt;nav&gt;</code></td><td>主要導覽</td><td>1～2 個</td><td><code>&lt;nav&gt;&lt;a&gt;飲品一覽&lt;/a&gt;&lt;/nav&gt;</code></td></tr>
<tr><td><code>&lt;main&gt;</code></td><td>主內容（唯一）</td><td>1 個</td><td>包住頁面主要內容，不含 header/footer</td></tr>
<tr><td><code>&lt;section&gt;</code></td><td>章節，需有標題</td><td>多個</td><td><code>&lt;section&gt;&lt;h2&gt;招牌飲品&lt;/h2&gt;...&lt;/section&gt;</code></td></tr>
<tr><td><code>&lt;article&gt;</code></td><td>獨立可轉載的文章</td><td>多個</td><td>一篇部落格文章、一個商品卡</td></tr>
<tr><td><code>&lt;footer&gt;</code></td><td>頁尾 / 區塊尾</td><td>1～多個</td><td>版權、聯絡資訊</td></tr>
<tr><td><code>&lt;aside&gt;</code></td><td>側邊相關資訊</td><td>多個</td><td>側邊欄推薦</td></tr>
</tbody></table>
<pre><code>&lt;!-- 語意化結構範例 --&gt;
&lt;header&gt;
  &lt;h1&gt;Nori 飲品供應&lt;/h1&gt;
  &lt;nav&gt;&lt;a href="/drinks"&gt;飲品一覽&lt;/a&gt; | &lt;a href="/about"&gt;關於&lt;/a&gt;&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;section&gt;
    &lt;h2&gt;招牌冰釀茶酒&lt;/h2&gt;
    &lt;p&gt;...&lt;/p&gt;
  &lt;/section&gt;
  &lt;article&gt;客戶案例...&lt;/article&gt;
&lt;/main&gt;
&lt;footer&gt;© 2019 Nori Limited&lt;/footer&gt;</code></pre>
<p>對 SEO / 無障礙的好處：搜尋引擎與螢幕閱讀器能直接跳到 <code>&lt;main&gt;</code> 或 <code>&lt;nav&gt;</code>，不用在茫茫 <code>&lt;div&gt;</code> 海中猜。</p>
<p>小結：能用語意就用語意，真的沒對應語意再用 <code>&lt;div&gt;/&lt;span&gt;</code>。</p>`}],commentsQ:[{user:"切版新手",text:"所以 main 只能有一個，筆記！",time:"2024-03-02 14:00"}]},"https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage":{id:"789421",title:"VIP 等級折扣用 switch 寫，VIP1 被算成 60% 而不是 50% 該怎麼修？",url:"https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage",asked:"2024-08-10",viewed:"2.3k",votesQ:18,votesA:67,tags:["java","switch","discount","sonarqube"],fav:23,question:{author:"菜鳥工程師",rep:"342",avatar:"https://i.pravatar.cc/150?u=newbie",time:"2024-08-10 11:22",content:`我在 <code>OrderService.java</code> 用 <code>switch</code> 寫 VIP 折扣，但測出來 VIP1 是 95% 而不是 90%，被 SonarQube 擋了：
<pre><code>public double calculateVipPrice(double price, int vipLv) {
    switch(vipLv){
        case 1: price*=0.95; break;  // 應該是 0.90？
        case 2: price*=0.90; break;
        case 3: price*=0.85; break;
        case 4: price*=0.80; break;
        case 5: price*=0.75; break;
        default: break;
    }
    return price;
}</code></pre>
需求是 VIP1 90%、VIP2 85%、VIP3 80%、VIP4 75%、VIP5 70%，為什麼會少 5%？是不是 <code>break</code> 少了？`},answers:[{accepted:!0,author:"重構大師",rep:"15.2k",avatar:"https://i.pravatar.cc/150?u=refactor",time:"2024-08-10 12:05 · 已採納",votes:67,content:`<p>不是 <code>break</code> 的問題，是「魔法數字」偏移 5%：你寫 <code>0.95</code> 但規格是 <code>0.90</code>，每級都多 0.05。</p>
<table class="so-table"><thead><tr><th>VIP</th><th>錯誤</th><th>正確</th><th>說明</th></tr></thead><tbody>
<tr><td>VIP1</td><td><code>0.95</code> (95%)</td><td><code>0.90</code> (90%)</td><td>少 5%</td></tr>
<tr><td>VIP2</td><td><code>0.90</code></td><td><code>0.85</code></td><td>少 5%</td></tr>
<tr><td>VIP3</td><td><code>0.85</code></td><td><code>0.80</code></td><td>少 5%</td></tr>
<tr><td>VIP4</td><td><code>0.80</code></td><td><code>0.75</code></td><td>少 5%</td></tr>
<tr><td>VIP5</td><td><code>0.75</code></td><td><code>0.70</code></td><td>少 5%</td></tr>
</tbody></table>
<pre><code>// 修正後
public double calculateVipPrice(double price, int vipLv) {
    switch(vipLv){
        case 1: price*=0.90; break;
        case 2: price*=0.85; break;
        case 3: price*=0.80; break;
        case 4: price*=0.75; break;
        case 5: price*=0.70; break;
        default: break;
    }
    return price;
}</code></pre>
<p>小技巧：用 <code>Map</code> 或 <code>enum</code> 避免手寫 switch，SonarQube 就不會再誤判：</p>
<pre><code>private static final Map&lt;Integer, Double&gt; RATE = Map.of(1,0.90,2,0.85,3,0.80,4,0.75,5,0.70);</code></pre>
<p>改完記得跑 <code>npm run build</code> + SonarQube，<code>case</code> 每行都要有 <code>break</code>。</p>`},{accepted:!1,author:"SonarQube小幫手",rep:"6.1k",avatar:"https://i.pravatar.cc/150?u=sonar",time:"2024-08-10 13:22",votes:21,content:"<p>補充：SonarQube 規則 <code>vip-discount-spec.md</code> 寫得很清楚：</p><pre><code>VIP1 90% | VIP2 85% | VIP3 80% | VIP4 75% | VIP5 70%</code></pre><p>你的 <code>0.95</code> 會讓 VIP1 多付 5%，客戶會客訴。建議把規格抽成常數，別寫死在 switch。</p>"}],commentsQ:[{user:"發問者",text:"原來是 0.95 寫錯，改 0.90 就過了！感謝",time:"2024-08-10 14:10"},{user:"路人",text:"這種 5% 偏移最難抓，建議寫單元測試",time:"2024-08-11 09:03"}]},"https://stackoverflow.com/questions/5920914/import-meta-env-meaning":{id:"5920914",title:"import.meta.env 是什麼？Vite 專案的環境變數怎麼讀取？",url:"https://stackoverflow.com/questions/5920914/import-meta-env-meaning",asked:"2024-08-12",viewed:"5.7k",votesQ:27,votesA:142,tags:["vite","javascript","env","import-meta"],fav:41,question:{author:"Vite新手",rep:"567",avatar:"https://i.pravatar.cc/150?u=vitenewbie",time:"2024-08-12 09:30",content:`請問 <code>import.meta.env</code> 是什麼意思？在 Vite 專案常看到：
<pre><code>const BASE = import.meta.env.VITE_API_BASE
const ID = import.meta.env.VITE_ANALYTICS_ID</code></pre>
跟 Node 的 <code>process.env</code> 差在哪？為什麼 <code>.env</code> 裡的 <code>DATABASE_URL</code> 讀不到？`},answers:[{accepted:!0,author:"Vite核心貢獻者",rep:"32.4k",avatar:"https://i.pravatar.cc/150?u=vitecore",time:"2024-08-12 10:12 · 已採納",votes:142,content:`<p><code>import.meta.env</code> 就是 Vite 在「建置時」把 <code>.env</code> 注入到前端的物件，只有 <code>VITE_</code> 開頭的才會暴露到瀏覽器。</p>
<table class="so-table"><thead><tr><th>變數</th><th>是否暴露到前端</th><th>讀取方式</th></tr></thead><tbody>
<tr><td><code>VITE_API_BASE</code></td><td>是</td><td><code>import.meta.env.VITE_API_BASE</code> → "/api"</td></tr>
<tr><td><code>VITE_ANALYTICS_ID</code></td><td>是</td><td><code>import.meta.env.VITE_ANALYTICS_ID</code> → "12345"</td></tr>
<tr><td><code>DATABASE_URL</code></td><td>否（後端專用）</td><td>前端讀不到，屬安全設計</td></tr>
</tbody></table>
<pre><code># .env
VITE_API_BASE=/api
VITE_ANALYTICS_ID=12345
DATABASE_URL=postgres://nori:nori@localhost:5432/nori_drinks  # 後端專用，前端拿不到

// src/api/client.js
const BASE = import.meta.env.VITE_API_BASE  // "/api"
const NAME = import.meta.env.VITE_ANALYTICS_ID // "12345"
console.log(import.meta.env.DATABASE_URL) // undefined</code></pre>
<p>與 <code>process.env</code> 差異：<code>process.env</code> 是 Node 執行時，<code>import.meta.env</code> 是 Vite 建置時靜態替換，瀏覽器沒有 <code>process</code>。</p>
<p>除錯技巧：在 <code>vite.config.js</code> 設 <code>publicDir</code> 或用 <code>console.log(import.meta.env)</code> 印出所有 <code>VITE_</code> 變數。</p>`}],commentsQ:[{user:"發問者",text:"原來只有 VITE_ 才會到前端，難怪 DATABASE_URL 一直 undefined",time:"2024-08-12 12:30"},{user:"路人",text:"推，之前把 MD5_KEY 放 VITE_ 被老師罵",time:"2024-08-13 08:20"}]}};function hs(e){return e&&e.includes("stackoverflow.com")&&En[e]}function vs(e){return En[e]||null}function fs(e){function t(I,S){return I<<S|I>>>32-S}function a(I,S){var T,j,D=I&2147483648,O=S&2147483648,V;return T=I&1073741824,j=S&1073741824,V=(I&1073741823)+(S&1073741823),T&j?V^2147483648^D^O:T|j?V&1073741824?V^3221225472^D^O:V^1073741824^D^O:V^D^O}function i(I,S,T){return I&S|~I&T}function n(I,S,T){return I&T|S&~T}function s(I,S,T){return I^S^T}function r(I,S,T){return S^(I|~T)}function d(I,S,T,j,D,O,V){return I=a(I,a(a(i(S,T,j),D),V)),a(t(I,O),S)}function o(I,S,T,j,D,O,V){return I=a(I,a(a(n(S,T,j),D),V)),a(t(I,O),S)}function c(I,S,T,j,D,O,V){return I=a(I,a(a(s(S,T,j),D),V)),a(t(I,O),S)}function m(I,S,T,j,D,O,V){return I=a(I,a(a(r(S,T,j),D),V)),a(t(I,O),S)}function p(I){for(var S,T=I.length,j=T+8,D=((j-j%64)/64+1)*16,O=Array(D-1),V=0,xe=0;xe<T;)S=(xe-xe%4)/4,V=xe%4*8,O[S]=O[S]|I.charCodeAt(xe)<<V,xe++;return S=(xe-xe%4)/4,V=xe%4*8,O[S]=O[S]|128<<V,O[D-2]=T<<3,O[D-1]=T>>>29,O}function u(I){var S="",T="",j,D;for(D=0;D<=3;D++)j=I>>>D*8&255,T="0"+j.toString(16),S=S+T.substr(T.length-2,2);return S}function v(I){I=I.replace(/\r\n/g,`
`);for(var S="",T=0;T<I.length;T++){var j=I.charCodeAt(T);j<128?S+=String.fromCharCode(j):j>127&&j<2048?(S+=String.fromCharCode(j>>6|192),S+=String.fromCharCode(j&63|128)):(S+=String.fromCharCode(j>>12|224),S+=String.fromCharCode(j>>6&63|128),S+=String.fromCharCode(j&63|128))}return S}var h=Array(),b,A,P,oe,E,_,w,y,f,B=7,L=12,z=17,_e=22,at=5,qe=9,N=14,Ae=20,we=4,At=11,$t=16,Bt=23,Pt=6,jt=10,Mt=15,Dt=21;for(e=v(e),h=p(e),_=1732584193,w=4023233417,y=2562383102,f=271733878,b=0;b<h.length;b+=16)A=_,P=w,oe=y,E=f,_=d(_,w,y,f,h[b+0],B,3614090360),f=d(f,_,w,y,h[b+1],L,3905402710),y=d(y,f,_,w,h[b+2],z,606105819),w=d(w,y,f,_,h[b+3],_e,3250441966),_=d(_,w,y,f,h[b+4],B,4118548399),f=d(f,_,w,y,h[b+5],L,1200080426),y=d(y,f,_,w,h[b+6],z,2821735955),w=d(w,y,f,_,h[b+7],_e,4249261313),_=d(_,w,y,f,h[b+8],B,1770035416),f=d(f,_,w,y,h[b+9],L,2336552879),y=d(y,f,_,w,h[b+10],z,4294925233),w=d(w,y,f,_,h[b+11],_e,2304563134),_=d(_,w,y,f,h[b+12],B,1804603682),f=d(f,_,w,y,h[b+13],L,4254626195),y=d(y,f,_,w,h[b+14],z,2792965006),w=d(w,y,f,_,h[b+15],_e,1236535329),_=o(_,w,y,f,h[b+1],at,4129170786),f=o(f,_,w,y,h[b+6],qe,3225465664),y=o(y,f,_,w,h[b+11],N,643717713),w=o(w,y,f,_,h[b+0],Ae,3921069994),_=o(_,w,y,f,h[b+5],at,3593408605),f=o(f,_,w,y,h[b+10],qe,38016083),y=o(y,f,_,w,h[b+15],N,3634488961),w=o(w,y,f,_,h[b+4],Ae,3889429448),_=o(_,w,y,f,h[b+9],at,568446438),f=o(f,_,w,y,h[b+14],qe,3275163606),y=o(y,f,_,w,h[b+3],N,4107603335),w=o(w,y,f,_,h[b+8],Ae,1163531501),_=o(_,w,y,f,h[b+13],at,2850285829),f=o(f,_,w,y,h[b+2],qe,4243563512),y=o(y,f,_,w,h[b+7],N,1735328473),w=o(w,y,f,_,h[b+12],Ae,2368359562),_=c(_,w,y,f,h[b+5],we,4294588738),f=c(f,_,w,y,h[b+8],At,2272392833),y=c(y,f,_,w,h[b+11],$t,1839030562),w=c(w,y,f,_,h[b+14],Bt,4259657740),_=c(_,w,y,f,h[b+1],we,2763975236),f=c(f,_,w,y,h[b+4],At,1272893353),y=c(y,f,_,w,h[b+7],$t,4139469664),w=c(w,y,f,_,h[b+10],Bt,3200236656),_=c(_,w,y,f,h[b+13],we,681279174),f=c(f,_,w,y,h[b+0],At,3936430074),y=c(y,f,_,w,h[b+3],$t,3572445317),w=c(w,y,f,_,h[b+6],Bt,76029189),_=c(_,w,y,f,h[b+9],we,3654602809),f=c(f,_,w,y,h[b+12],At,3873151461),y=c(y,f,_,w,h[b+15],$t,530742520),w=c(w,y,f,_,h[b+2],Bt,3299628645),_=m(_,w,y,f,h[b+0],Pt,4096336452),f=m(f,_,w,y,h[b+7],jt,1126891415),y=m(y,f,_,w,h[b+14],Mt,2878612391),w=m(w,y,f,_,h[b+5],Dt,4237533241),_=m(_,w,y,f,h[b+12],Pt,1700485571),f=m(f,_,w,y,h[b+3],jt,2399980690),y=m(y,f,_,w,h[b+10],Mt,4293915773),w=m(w,y,f,_,h[b+1],Dt,2240044497),_=m(_,w,y,f,h[b+8],Pt,1873313359),f=m(f,_,w,y,h[b+15],jt,4264355552),y=m(y,f,_,w,h[b+6],Mt,2734768916),w=m(w,y,f,_,h[b+13],Dt,1309151649),_=m(_,w,y,f,h[b+4],Pt,4149444226),f=m(f,_,w,y,h[b+11],jt,3174756917),y=m(y,f,_,w,h[b+2],Mt,718787259),w=m(w,y,f,_,h[b+9],Dt,3951481745),_=a(_,A),w=a(w,P),y=a(y,oe),f=a(f,E);return(u(_)+u(w)+u(y)+u(f)).toLowerCase()}function ys(e){if(!e)return[];const t=e.toLowerCase(),a=new Set,i=[];return ct.forEach(n=>{n.title.toLowerCase().includes(t)&&!a.has(n.title)&&(a.add(n.title),i.push({text:n.title,kind:n.type}))}),(l.get("searchHistory")||[]).slice(-5).reverse().forEach(n=>{n.q.toLowerCase().includes(t)&&!a.has(n.q)&&(a.add(n.q),i.push({text:n.q,kind:"history"}))}),i.slice(0,8)}function bs(e){let t=e;const a={site:null,filetype:null,before:null,after:null},i=t.match(/site:([^\s]+)/i);i&&(a.site=i[1].toLowerCase(),t=t.replace(i[0],"").trim());const n=t.match(/filetype:([^\s]+)/i);n&&(a.filetype=n[1].toLowerCase(),t=t.replace(n[0],"").trim());const s=t.match(/before:([^\s]+)/i);s&&(a.before=s[1],t=t.replace(s[0],"").trim());const r=t.match(/after:([^\s]+)/i);return r&&(a.after=r[1],t=t.replace(r[0],"").trim()),{base:t.trim(),filters:a}}function _s(e){return e.toLowerCase().includes("md5")}function ws(e){const t=document.getElementById("md5Tool");if(!t)return;const a=document.getElementById("searchLayout"),i=document.getElementById("searchDetail");a&&(a.style.display="none"),i&&(i.style.display="none",i.innerHTML="",i.classList.remove("open"));let n="";if(e){const p=e.match(/md5\s*(.*)/i);p&&p[1]&&(n=p[1].trim())}t.innerHTML=`
    <button id="md5BackBtn" class="btn detail__back" style="margin-bottom:12px">← 上一頁</button>
    <div class="md5-tool__header">
      <div class="md5-tool__title"><i class="fa-solid fa-hashtag" style="color:var(--accent)"></i> MD5 加密工具</div>
      <div class="small muted">輸入任意字串，一鍵轉換為 32 位小寫 MD5。支援即時轉換、複製與清空。</div>
    </div>
    <div class="md5-tool__body">
      <div class="md5-panel">
        <label class="md5-panel__label">輸入</label>
        <textarea id="md5Input" class="md5-panel__textarea" placeholder="在此輸入要轉換的字串...">${n.replace(/</g,"&lt;")}</textarea>
      </div>
      <button id="md5ConvertBtn" class="md5-convert-btn" title="轉換" aria-label="轉換">
        <i class="fa-solid fa-right-left"></i>
      </button>
      <div class="md5-panel">
        <label class="md5-panel__label">輸出 (MD5)</label>
        <textarea id="md5Output" class="md5-panel__textarea" placeholder="轉換結果將顯示於此" readonly></textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="md5CopyBtn" class="btn small">複製</button>
          <button id="md5ClearBtn" class="btn small">清空</button>
        </div>
      </div>
    </div>
  `,t.style.display="block";const s=document.getElementById("md5Input"),r=document.getElementById("md5Output"),d=document.getElementById("md5ConvertBtn"),o=document.getElementById("md5CopyBtn"),c=document.getElementById("md5ClearBtn");function m(){const p=s.value;if(!p){r.value="",r.placeholder="請先輸入字串";return}try{r.value=fs(p)}catch{r.value="轉換失敗"}}d?.addEventListener("click",m),s?.addEventListener("keydown",p=>{p.key==="Enter"&&(p.ctrlKey||p.metaKey)&&(p.preventDefault(),m())}),o?.addEventListener("click",async()=>{if(r.value)try{await navigator.clipboard.writeText(r.value),o.textContent="已複製",setTimeout(()=>o.textContent="複製",1500)}catch{r.select(),document.execCommand("copy")}}),c?.addEventListener("click",()=>{s.value="",r.value="",s.focus()}),document.getElementById("md5BackBtn")?.addEventListener("click",()=>{t.style.display="none",t.innerHTML="";const p=document.getElementById("searchLayout");p&&(p.style.display="");const u=document.getElementById("searchDetail");u&&(u.style.display="none",u.innerHTML="",u.classList.remove("open"));const v=document.getElementById("searchInput");v&&St&&(v.value=St)}),n&&(s.value=n,m())}function xa(e,t){if(!t)return g(e);const a=g(e),i=t.split(/\s+/).filter(Boolean).slice(0,3);let n=a;return i.forEach(s=>{const r=new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");n=n.replace(r,"<mark>$1</mark>")}),n}function xs(){const e=document.getElementById("view-search");e&&(e.innerHTML=`
    <div class="search">
      <div class="search__header">
        <div class="search__logo">Sear<span>ch</span></div>
        <div class="search__bar">
          <input id="searchInput" class="input" placeholder="輸入關鍵詞，如 switch / h1 / HTML" autocomplete="off" />
          <button id="searchBtn" class="btn primary">搜尋</button>
          <div id="suggestBox" class="suggest-box"></div>
        </div>
      </div>
      <div class="search__suggest">
        <span class="chip" data-q="switch">switch</span>
        <span class="chip" data-q="h1">h1</span>
        <span class="chip" data-q="<h1>">&lt;h1&gt;</span>
        <span class="chip" data-q="HTML 標籤">HTML 標籤</span>
      </div>
      <div class="search__tabs" role="tablist">
        <button class="search__tab active" data-tab="all">全部</button>
        <button class="search__tab" data-tab="image">圖片</button>
        <button class="search__tab" data-tab="news">新聞</button>
        <button class="search__tab" data-tab="academic">學術</button>
      </div>
      <div id="md5Tool" class="md5-tool" style="display:none"></div>
      <div id="searchViewContainer">
        <div id="searchLayout" class="search__layout">
          <div class="search__main">
            <div id="searchResults"></div>
            <div id="searchAdvancedHint" class="small muted" style="margin-top:8px"></div>
          </div>
          <div class="search__side">
            <div class="search__history">
              <h4>搜尋歷史</h4>
              <div id="searchHistoryList"></div>
            </div>
          </div>
        </div>
        <div id="searchDetail" class="search__detail-view" style="display:none"></div>
      </div>
    </div>
  `,ks(),ca(),Ss(),Pe(""))}function ks(){const e=document.getElementById("searchInput"),t=document.getElementById("suggestBox");e?.addEventListener("input",a=>{const i=a.target.value,n=ys(i);if(!i||!n.length){t.classList.remove("open"),t.innerHTML="";return}t.innerHTML=n.map(s=>`<div class="suggest-item" data-q="${g(s.text)}"><span>${g(s.text)}</span><span class="small">${s.kind}</span></div>`).join(""),t.classList.add("open"),t.querySelectorAll(".suggest-item").forEach(s=>s.addEventListener("click",()=>{e.value=s.dataset.q,t.classList.remove("open"),Pe(s.dataset.q)}))}),e?.addEventListener("keydown",a=>{if(a.key==="Enter"&&(document.getElementById("suggestBox")?.classList.remove("open"),Pe(a.target.value)),a.key==="Escape"&&document.getElementById("suggestBox")?.classList.remove("open"),a.key==="ArrowDown"){const i=document.querySelector("#suggestBox .suggest-item");i&&(a.preventDefault(),i.classList.add("active"),e.value=i.dataset.q)}}),e?.addEventListener("blur",()=>setTimeout(()=>t?.classList.remove("open"),150)),document.getElementById("searchBtn")?.addEventListener("click",()=>Pe(document.getElementById("searchInput").value)),document.querySelectorAll(".chip").forEach(a=>a.addEventListener("click",()=>Pe(a.dataset.q))),document.querySelectorAll(".search__tab").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".search__tab").forEach(i=>i.classList.remove("active")),a.classList.add("active"),le=a.dataset.tab,Pe(St||"Sawyer")})})}function ca(){const e=document.getElementById("searchHistoryList");if(!e)return;const t=(l.get("searchHistory")||[]).slice(-8).reverse();if(!t.length){e.innerHTML='<div class="small muted">尚無歷史</div>';return}e.innerHTML=t.map(a=>`<div class="history-item" data-q="${g(a.q)}"><span>${g(a.q)}</span><span class="small">${new Date(a.at).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}</span></div>`).join(""),e.querySelectorAll(".history-item").forEach(a=>a.addEventListener("click",()=>Pe(a.dataset.q)))}function Ss(){const e=document.getElementById("searchTrendList");e&&(e.innerHTML=gs.map(t=>`<div class="trend-item" data-q="${g(t)}"><span>🔥 ${g(t)}</span><span class="small">›</span></div>`).join(""),e.querySelectorAll(".trend-item").forEach(t=>t.addEventListener("click",()=>Pe(t.dataset.q))))}function Pe(e){const t=document.getElementById("searchInput");t&&e&&(t.value=e);const a=(e||"").trim();if(!a)return;if(St=a,a.includes("hash=")&&a.includes("f665a7117959b667b7f283eaebf69cae")){const p=document.getElementById("searchResults");if(p){be(),p.innerHTML='<div class="card" style="padding:16px"><div class="small muted">此為暗網路徑的 hash，請至 <b>正常內網</b> 搜尋框輸入完整 URL：<br><code style="word-break:break-all">https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae</code><br><br>提示：可在 Vizual Studio Code 的 Git Graph 找到 <code>generateSecretPath</code> 歷史與 <code>.env.example</code> 的 key，自行組合 md5。</div></div>';const u=document.getElementById("md5Tool");u&&(u.style.display="none",u.innerHTML=""),l.push("searchHistory",{q:a,at:new Date().toISOString()}),ca();return}}const i=document.getElementById("md5Tool");i&&(i.style.display="none",i.innerHTML="");const n=document.getElementById("searchLayout");n&&(n.style.display=""),l.push("searchHistory",{q:a,at:new Date().toISOString()}),(a.toLowerCase().includes("package")||a.toLowerCase().includes("image"))&&l.setFlag("reverse_image_done",!0),(a.toLowerCase().includes("shell")||a.toLowerCase().includes("site:nori"))&&l.setFlag("found_shell_company",!0),(a.toLowerCase().includes("drink")||a.toLowerCase().includes("nori"))&&l.setFlag("found_supplier",!0),ca();const{base:s,filters:r}=bs(a);wa=s;const d=document.getElementById("searchAdvancedHint");if(d){const p=[];r.site&&p.push(`site:${r.site}`),r.filetype&&p.push(`filetype:${r.filetype}`),r.before&&p.push(`before:${r.before}`),r.after&&p.push(`after:${r.after}`),d.textContent=p.length?`進階語法生效：${p.join(" · ")} ｜ 基礎查詢：${s||"(空)"}`:""}let o=[];const c=s.toLowerCase().trim().replace(/\s+/g," ");if(c==="sawyer"||c==="sawyer choi"){const p=["https://sawyer-blog.example/2024-03-20","https://sawyer-blog.example/2024-01-15","https://sawyer-blog.example/2023-12-20","https://sawyer-blog.example/2023-05-10","https://sawyer-blog.example/2023-05-01"],u="https://news.example/sawyer-statement-2023",v="https://school.example/guangzhi-essay-sawyer",h=new Map(ct.map(P=>[P.url,P]));for(const P of p){const oe=h.get(P);if(oe){if(le!=="all"&&oe.type!==le||r.site&&!oe.url.toLowerCase().includes(r.site))continue;o.push(oe)}}const b=h.get(u);b&&(le==="all"||b.type===le)&&(!r.site||b.url.toLowerCase().includes(r.site))&&o.push(b);const A=h.get(v);A&&(le==="all"||A.type===le)&&(!r.site||A.url.toLowerCase().includes(r.site))&&o.push(A)}else for(const p of ct){if(le!=="all"&&p.type!==le)continue;const u=(p.title+" "+p.snippet+" "+p.url).toLowerCase(),v=s.toLowerCase();(!s||u.includes(v)||s.split(/\s+/).some(h=>u.includes(h.toLowerCase())))&&(r.site&&!p.url.toLowerCase().includes(r.site)||r.filetype&&p.type==="image"&&r.filetype!=="image"||o.push(p))}if(le==="image"&&o.some(p=>p.image),_s(a)){const p={title:"MD5 加密工具 — 線上 MD5 產生器 / 轉換器",url:"md5-tool",snippet:"輸入任意字串，一鍵轉換為 32 位小寫 MD5。支援即時轉換、複製與清空。",type:"tool",image:null,isMD5Tool:!0};o.some(v=>v.isMD5Tool||v.url==="md5-tool")||o.unshift(p);const u="https://peter-blog.example/md5-for-beginners";if(!o.some(v=>v.url===u)){const v=ct.find(h=>h.url===u);if(v&&(le==="all"||v.type===le)){const h=o.findIndex(b=>b.url==="md5-tool");o.splice(h+1,0,v)}}}ot=o.slice(0,12);const m=document.getElementById("searchResults");if(m){if(be(),!ot.length){m.innerHTML='<div class="muted small" style="margin-top:12px">無結果 — 嘗試輸入相關字眼 </code></div>';return}m.innerHTML=ot.map((p,u)=>`
    <div class="result" data-idx="${u}">
      <div class="result__title" data-open="${u}">${g(p.title)}</div>
      <div class="result__url">${g(p.url)}</div>
      <div class="result__snippet">${xa(p.snippet,s)}</div>
      <div class="result__meta">
        <span class="result__tag">${p.type}</span>
        ${r.site?`<span class="result__tag">site:${r.site}</span>`:""}
        ${r.filetype?`<span class="result__tag">filetype:${r.filetype}</span>`:""}
      </div>
      ${p.image?`<div class="result__image"><img src="${p.image}" alt="preview" loading="lazy" /></div>`:""}
      <div class="result__actions">
        <span class="result__snap" data-open="${u}">開啟</span>
      </div>
    </div>
  `).join(""),m.querySelectorAll("[data-open]").forEach(p=>p.addEventListener("click",()=>{const u=Number(p.dataset.open),v=ot[u];if(v){if(v.url.startsWith("file://")||v.url.startsWith("/customer-portal")){const h=v.url.replace("file://","");k.exists(h)&&l.setFlag("found_code_map",!0);const b=new CustomEvent("search:openFile",{detail:h});window.dispatchEvent(b)}$s(u)}}))}}function be(){const e=document.getElementById("md5Tool");e&&(e.style.display="none",e.innerHTML="");const t=document.getElementById("searchLayout"),a=document.getElementById("searchDetail");t&&(t.style.display=""),a&&(a.style.display="none",a.innerHTML="",a.classList.remove("open"));const i=document.querySelector(".search");i&&(i.scrollTop=0);const n=document.getElementById("view-search");n&&(n.scrollTop=0)}function Q(e){return e>=1e4?(e/1e4).toFixed(1)+"萬":e>=1e3?(e/1e3).toFixed(1)+"k":String(e)}function Wt(e){return ee.find(t=>t.url===e)||null}function je(e){return Sn[e]||null}function Es(e){return ee.filter(t=>t.authorId===e).sort((t,a)=>a.views-t.views)}function Is(e){const t=ee.filter(n=>n.authorId===e.authorId&&n.url!==e.url).sort((n,s)=>s.views-n.views).slice(0,2);let a=ee.filter(n=>n.topic===e.topic&&n.url!==e.url&&n.authorId!==e.authorId);if(a.length<3){const n=ee.filter(s=>s.url!==e.url&&!t.includes(s)&&!a.includes(s)&&s.tags.some(r=>e.tags.includes(r)));a=[...a,...n]}a=a.slice(0,3);let i=[...t,...a];if(i.length<5){const n=ee.filter(s=>s.url!==e.url&&!i.includes(s)).sort(()=>.5-Math.random()).slice(0,5-i.length);i=i.concat(n)}return i.slice(0,5)}function ka(e){return`
    <div class="blog-header">
      <div class="blog-header__logo" data-blog-home>
        <div class="blog-header__logo-mark">B</div>
        <div class="blog-header__logo-text"><b>BlogWorld</b><span>全球部落格 · 博誌</span></div>
      </div>
      <nav class="blog-header__nav">
        <a data-blog-nav="home" class="${e==="home"?"active":""}">首頁</a>
        <a data-blog-nav="trending" class="${e==="trending"?"active":""}">排行榜</a>
        <a data-blog-nav="following">追蹤</a>
      </nav>
      <div class="blog-header__spacer"></div>
      <div class="blog-header__search"><i class="fa-solid fa-magnifying-glass"></i><input placeholder="搜尋部落格文章、作者..." readonly /></div>
      <div class="blog-header__actions">
        <button class="blog-back-top" data-blog-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
        <button class="blog-header__btn primary">登入</button>
      </div>
    </div>
  `}function Sa(e){e.querySelector("[data-blog-home]")?.addEventListener("click",()=>Et()),e.querySelectorAll("[data-blog-nav]").forEach(t=>{t.addEventListener("click",()=>{(t.dataset.blogNav==="home"||t.dataset.blogNav==="trending")&&Et()})}),e.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>be())}function Et(){const e=document.getElementById("searchDetail"),t=document.getElementById("searchLayout");if(!e||!t)return;t.style.display="none",e.style.display="block",e.classList.add("open");const a=document.getElementById("md5Tool");a&&(a.style.display="none",a.innerHTML="");const i=[...ee].sort((p,u)=>u.views-p.views).slice(0,1)[0],n=[...ee].sort((p,u)=>u.views-p.views).slice(1,4),s=ee.find(p=>p.url==="https://peter-blog.example/code-easter-eggs"),r=[...ee.filter(p=>p.url!=="https://peter-blog.example/code-easter-eggs")].sort(()=>.5-Math.random()),d=(s?[s,...r].slice(0,6):[...ee].sort(()=>.5-Math.random()).slice(0,6)).slice(0,6),o=Object.values(Sn).sort((p,u)=>u.followers-p.followers).slice(0,4);e.innerHTML=`
    <div class="blog-platform">
      ${ka("home")}
      <div class="blog-body">
        <div class="blog-home__hero">
          <div style="max-width:1120px;margin:0 auto;">
            <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
              <span class="blog-back-top" data-blog-back-search style="background:var(--blog-accent-bg);border-color:#ffd8c2;color:#d45a1f"><i class="fa-solid fa-arrow-left"></i> 回到搜尋結果</span>
            </div>
            <h1 class="blog-home__hero-title">在 <span>BlogWorld</span> 發現世界的聲音</h1>
            <p class="blog-home__hero-desc">全球部落格平台 · 收錄超過 120 萬篇創作。這裡有旅遊手帳、程式筆記、深夜食堂、底片日常與每個人的小宇宙。</p>
            <div class="blog-home__hero-meta">
              <span class="blog-home__hero-tag"><i class="fa-solid fa-fire" style="color:var(--blog-accent)"></i> 本週熱門</span>
              <span class="blog-home__hero-tag"><i class="fa-solid fa-star" style="color:#ffb347"></i> 編輯精選</span>
              <span class="blog-home__hero-tag"><i class="fa-solid fa-users"></i> 追蹤作者</span>
              <span class="blog-home__hero-stats"><span><b>1.2M</b> 篇文章</span><span><b>86k</b> 位作者</span><span><b>320</b> 種話題</span></span>
            </div>
          </div>
        </div>
        <div class="blog-home__layout">
          <div class="blog-home__main">
            <div class="blog-featured">
              <div class="blog-featured__main" data-blog-url="${g(i.url)}">
                <div class="blog-card__cover"><img src="${g(i.cover||`https://picsum.photos/seed/${i.authorId}feat/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=1'" />
                  <span class="blog-card__cover-tag"><i class="fa-solid fa-crown" style="color:#ffb347"></i> 今日精選</span></div>
                <div class="blog-card__body">
                  <div class="blog-card__title" style="font-size:17px;min-height:auto">${g(i.title)}</div>
                  <div class="blog-card__excerpt">${g(i.excerpt)}</div>
                  <div class="blog-card__meta"><span class="blog-card__author"><img src="${g(je(i.authorId).avatar)}" alt="" />${g(je(i.authorId).displayName)}</span><span class="blog-card__dot"></span><span>${g(i.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${Q(i.views)}</span></div>
                </div>
              </div>
              <div class="blog-featured__list">
                ${n.map(p=>`
                  <div class="blog-mini" data-blog-url="${g(p.url)}">
                    <img src="${g(p.cover||`https://picsum.photos/seed/${p.authorId}mini/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=2'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-mini__title">${g(p.title)}</div>
                      <div class="blog-mini__meta"><span>${g(je(p.authorId).displayName.split("·")[0].trim())}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${Q(p.views)}</span></div>
                      <div class="blog-mini__meta" style="margin-top:2px"><span style="padding:1px 6px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-size:10px;font-weight:700">${g(p.topic)}</span></div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="blog-section__head"><h3><i class="fa-solid fa-heart"></i> 為你推薦</h3><a data-blog-more>查看更多</a></div>
            <div class="blog-grid">
              ${d.map(p=>`
                <div class="blog-card" data-blog-url="${g(p.url)}">
                  <div class="blog-card__cover"><img src="${g(p.cover||`https://picsum.photos/seed/${p.url.slice(-6)}/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=3'" /><span class="blog-card__cover-tag">${g(p.topic)}</span></div>
                  <div class="blog-card__body">
                    <div class="blog-card__title">${g(p.title)}</div>
                    <div class="blog-card__excerpt">${g(p.excerpt)}</div>
                    <div class="blog-card__meta"><span class="blog-card__author"><img src="${g(je(p.authorId).avatar)}" alt="" />${g(je(p.authorId).name)}</span><span class="blog-card__dot"></span><span>${g(p.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${Q(p.views)}</span></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="blog-home__side">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-user-group"></i> 熱門作者</h4>
              <div class="blog-author-list">
                ${o.map(p=>`
                  <div class="blog-author-row" data-blog-author="${g(p.id)}">
                    <img src="${g(p.avatar)}" alt="" />
                    <div style="flex:1;min-width:0"><b>${g(p.displayName)}</b><div style="font-size:11px;color:#9aa0a6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g(p.bio.slice(0,32))}…</div></div>
                    <span style="font-size:11px;color:#9aa0a6">${Q(p.followers)} 追蹤</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-hashtag"></i> 熱門話題</h4>
              <div class="blog-tag-cloud">
                ${["旅遊","美食","科技","攝影","音樂","生活","成長","校園","家庭"].map(p=>`<span class="blog-tag" data-blog-tag="${g(p)}"># ${g(p)}</span>`).join("")}
              </div>
            </div>
            <div class="blog-widget" style="background:linear-gradient(135deg,#fff7ef 0%, #fff 100%)">
              <h4><i class="fa-solid fa-lightbulb"></i> 關於 BlogWorld</h4>
              <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0">BlogWorld 是全球筆記網絡，收錄每個人的日常與思考。點擊任意文章可進入閱讀，或前往作者主頁查看他最受歡迎的作品。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,Sa(e),e.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>be()),e.querySelectorAll("[data-blog-url]").forEach(p=>{p.addEventListener("click",()=>It(p.dataset.blogUrl))}),e.querySelectorAll("[data-blog-author]").forEach(p=>{p.addEventListener("click",()=>In(p.dataset.blogAuthor))}),e.querySelectorAll("[data-blog-tag]").forEach(p=>{p.addEventListener("click",()=>{const u=p.dataset.blogTag,v=ee.find(h=>h.tags.includes(u)||h.topic===u);v&&It(v.url)})});const c=document.getElementById("view-search");c&&(c.scrollTop=0);const m=e.querySelector(".blog-body");m&&(m.scrollTop=0)}function In(e){const t=je(e);if(!t)return;const a=document.getElementById("searchDetail"),i=document.getElementById("searchLayout");if(!a||!i)return;i.style.display="none",a.style.display="block",a.classList.add("open");const n=Es(e),s=n.reduce((o,c)=>o+c.views,0),r=n.reduce((o,c)=>o+c.likes,0);a.innerHTML=`
    <div class="blog-platform">
      ${ka("profile")}
      <div class="blog-body">
        <div class="blog-profile__head">
          <img class="blog-profile__avatar" src="${g(t.avatar)}" alt="" onerror="this.src='https://i.pravatar.cc/150?u=fallback'" />
          <div class="blog-profile__info">
            <h2 class="blog-profile__name">${g(t.displayName)} <small>${g(t.handle)}</small> ${t.verified?'<span style="color:#1d9bf0"><i class=&quot;fa-solid fa-circle-check&quot;></i></span>':""}</h2>
            <p class="blog-profile__bio">${g(t.bio)}</p>
            <div class="blog-profile__stats">
              <span><b>${n.length}</b> 篇文章</span>
              <span><b>${Q(s)}</b> 總瀏覽</span>
              <span><b>${Q(r)}</b> 收到喜歡</span>
              <span><b>${Q(t.followers)}</b> 追蹤者</span>
              <span><b>${t.following}</b> 追蹤中</span>
              <span>加入於 ${g(t.joined)}</span>
            </div>
            <div class="blog-profile__actions">
              <button class="blog-header__btn primary"><i class="fa-solid fa-plus"></i> 追蹤</button>
              <button class="blog-header__btn">分享主頁</button>
              <button class="blog-back-top" data-blog-back-search style="margin-left:auto"><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
            </div>
          </div>
        </div>
        <div class="blog-profile__body">
          <div style="min-width:0">
            <div class="blog-profile__tabs">
              <button class="blog-profile__tab active">熱門文章 · 依瀏覽數排序</button>
              <button class="blog-profile__tab">最新</button>
              <button class="blog-profile__tab">收藏</button>
            </div>
            <div style="font-size:12px;color:#9aa0a6;margin-bottom:10px">共 ${n.length} 篇 · 已依 <b style="color:#1f2328">最高瀏覽</b> 排序，點擊可進入文章頁</div>
            <div class="blog-profile__list">
              ${n.map((o,c)=>`
                <div class="blog-row" data-blog-url="${g(o.url)}">
                  <div class="blog-row__cover"><img src="${g(o.cover||`https://picsum.photos/seed/${o.url.slice(-8)}/400/300`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=4'" /></div>
                  <div class="blog-row__main">
                    <div class="blog-row__title">${c===0?'<span style="padding:2px 6px;border-radius:6px;background:var(--blog-accent);color:#fff;font-size:11px;margin-right:6px">最高瀏覽</span>':""}${g(o.title)}</div>
                    <div class="blog-row__excerpt">${g(o.excerpt)}</div>
                    <div class="blog-row__meta">
                      <span><i class="fa-regular fa-calendar"></i> ${g(o.date)}</span>
                      <span><i class="fa-solid fa-eye"></i> ${Q(o.views)}</span>
                      <span><i class="fa-regular fa-heart"></i> ${Q(o.likes)}</span>
                      <span class="blog-row__tag">${g(o.topic)}</span>
                      ${o.tags.slice(0,2).map(m=>`<span class="blog-row__tag">#${g(m)}</span>`).join("")}
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="blog-sidebar">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-circle-info"></i> 關於作者</h4>
              <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0 0 10px">${g(t.bio)}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span class="blog-tag">BlogWorld 成員</span>
                <span class="blog-tag">${g(t.id==="sawyer"?"創作 10 年":"創作 3 年+")}</span>
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-chart-simple"></i> 瀏覽排行</h4>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${n.slice(0,3).map((o,c)=>`
                  <div style="display:flex;gap:8px;align-items:center;padding:6px;border-radius:8px;background:${c===0?"var(--blog-accent-bg)":"transparent"};border:1px solid ${c===0?"#ffd8c2":"transparent"};cursor:pointer" data-blog-url="${g(o.url)}">
                    <span style="font-weight:900;color:${c===0?"var(--blog-accent)":"#9aa0a6"}">${c+1}</span>
                    <span style="flex:1;font-size:12px;font-weight:700;color:#1f2328;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${g(o.title)}</span>
                    <span style="font-size:11px;color:#9aa0a6">${Q(o.views)}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-link"></i> 相關推薦</h4>
              <div style="font-size:12px;color:#9aa0a6">追蹤更多作者，探索更多故事。回到 <a data-blog-home style="cursor:pointer;color:var(--blog-accent);font-weight:700">BlogWorld 首頁</a> 瀏覽編輯精選。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,Sa(a),a.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>be()),a.querySelectorAll("[data-blog-url]").forEach(o=>{o.addEventListener("click",()=>It(o.dataset.blogUrl))}),a.querySelector("[data-blog-home]")?.addEventListener("click",()=>Et()),a.querySelector("a[data-blog-home]")?.addEventListener("click",()=>Et());const d=document.getElementById("view-search");d&&(d.scrollTop=0)}function It(e){let t=Wt(e);if(!t){const m=ct.find(p=>p.url===e);m&&m.url.includes("sawyer-blog.example")&&(t=Wt(m.url))}if(!t)return;try{l.markArticleRead(t.url)}catch{}const a=je(t.authorId),i=document.getElementById("searchDetail"),n=document.getElementById("searchLayout");if(!i||!n)return;n.style.display="none",i.style.display="block",i.classList.add("open");const s=document.getElementById("md5Tool");s&&(s.style.display="none",s.innerHTML="");const r=Is(t),d=ms[t.url]||[];t.cover&&t.cover.includes("sawyer_blog_pic"),i.innerHTML=`
    <div class="blog-platform">
      ${ka("article")}
      <div class="blog-body">
        <div class="blog-article__layout">
          <div class="blog-article__main">
            <div class="blog-article__card">
              <div class="blog-article__head">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
                  <button class="blog-back-top" data-blog-back-home><i class="fa-solid fa-house"></i> BlogWorld 首頁</button>
                  <button class="blog-back-top" data-blog-author="${g(a.id)}"><i class="fa-solid fa-user"></i> ${g(a.name)} 主頁</button>
                  <button class="blog-back-top" data-blog-back-search style="margin-left:auto"><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
                </div>
                <h1 class="blog-article__title">${g(t.title)}</h1>
                <div class="blog-article__meta">
                  <img src="${g(a.avatar)}" alt="" />
                  <div style="line-height:1.3">
                    <div><b data-blog-author="${g(a.id)}" style="cursor:pointer">${g(a.displayName)}</b> <span style="color:#9aa0a6">${g(a.handle)}</span></div>
                    <div style="font-size:11px;color:#9aa0a6">${g(t.date)} · <i class="fa-solid fa-eye"></i> ${Q(t.views)} 瀏覽 · <i class="fa-regular fa-heart"></i> ${Q(t.likes)} 喜歡 · 閱讀約 ${Math.max(1,Math.ceil(t.content.length/400))} 分鐘</div>
                  </div>
                  <span class="dot"></span>
                  <span style="padding:4px 8px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-weight:700;font-size:11px">${g(t.topic)}</span>
                  <button class="blog-header__btn primary" style="margin-left:auto;padding:6px 12px;font-size:12px">追蹤</button>
                </div>
                ${t.cover?`<div class="blog-article__cover"><img src="${g(t.cover)}" alt="" onerror="this.style.display='none'" /></div>`:""}
              </div>
              <div class="blog-article__content">${xa(t.content,wa)}</div>
              <div class="blog-article__tags">
                ${t.tags.map(m=>`<span class="blog-article__tag"># ${g(m)}</span>`).join("")}
                <span class="blog-article__tag" style="background:var(--blog-accent-bg);border-color:#ffd8c2;color:#d45a1f"><i class="fa-solid fa-eye"></i> ${Q(t.views)}</span>
              </div>
            </div>
            <div class="blog-comments">
              <div class="blog-comments__head">
                <h4><i class="fa-regular fa-comments"></i> 留言 ${d.length}</h4>
                <span class="blog-comments__count">按熱度排序</span>
              </div>
              <div class="blog-comments__list">
                ${d.length?d.map(m=>`
                  <div class="blog-comment">
                    <div class="blog-comment__avatar" style="${m.avatar?`background:url(${g(m.avatar)}) center/cover`:""}">${m.avatar?"":g(m.user.slice(0,1))}</div>
                    <div class="blog-comment__main">
                      <div class="blog-comment__head"><span class="blog-comment__user">${g(m.user)}</span><span class="blog-comment__time">${g(m.time)}</span></div>
                      <div class="blog-comment__text">${g(m.text)}</div>
                      <div class="blog-comment__actions"><span><i class="fa-regular fa-heart"></i> ${m.likes} 喜歡</span><span><i class="fa-regular fa-comment"></i> 回覆</span><span><i class="fa-regular fa-flag"></i> 檢舉</span></div>
                    </div>
                  </div>
                `).join(""):'<div style="padding:18px;text-align:center;color:#9aa0a6;font-size:13px">還沒有留言，成為第一個留言的人吧</div>'}
              </div>
              <div class="blog-comment__composer"><img src="${g(a.avatar)}" alt="" style="width:28px;height:28px;border-radius:50%" /><input placeholder="寫下你的想法..." readonly /><button>送出</button></div>
            </div>
          </div>
          <aside class="blog-sidebar">
            <div class="blog-widget">
              <div style="display:flex;gap:10px;align-items:center">
                <img src="${g(a.avatar)}" alt="" style="width:44px;height:44px;border-radius:50%" />
                <div style="flex:1;min-width:0"><b style="font-size:13px;color:#1f2328">${g(a.displayName)}</b><div style="font-size:11px;color:#9aa0a6">${g(a.bio.slice(0,28))}…</div></div>
                <button class="blog-header__btn primary" style="padding:6px 10px;font-size:12px">追蹤</button>
              </div>
              <div style="margin-top:10px;display:flex;gap:14px;font-size:11px;color:#9aa0a6"><span><b style="color:#1f2328">${Q(a.followers)}</b> 追蹤者</span><span><b style="color:#1f2328">${a.following}</b> 追蹤中</span><span style="margin-left:auto;cursor:pointer;color:var(--blog-accent);font-weight:700" data-blog-author="${g(a.id)}">前往主頁 →</span></div>
            </div>
            <div class="blog-widget">
              <h4 class="blog-sidebar__title"><i class="fa-solid fa-book-open"></i> 推薦閱讀 · 5 篇</h4>
              <div style="font-size:11px;color:#9aa0a6;margin-bottom:8px">包含 2 篇同作者 + 3 篇相似話題的其他作者文章</div>
              <div class="blog-rec-list">
                ${r.map((m,p)=>{const u=je(m.authorId),v=m.authorId===t.authorId;return`
                  <div class="blog-rec" data-blog-url="${g(m.url)}">
                    <img src="${g(m.cover||`https://picsum.photos/seed/${m.url.slice(-8)}/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=5'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-rec__title">${g(m.title)}</div>
                      <div class="blog-rec__meta"><span>${g(u.name)}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${Q(m.views)}</span></div>
                      <div style="margin-top:4px">${v?'<span class="blog-rec__badge">同作者</span>':`<span class="blog-rec__badge" style="background:#eef2ff;border-color:#c7d2fe;color:#4338ca">相似話題 · ${g(m.topic)}</span>`}</div>
                    </div>
                  </div>
                  `}).join("")}
              </div>
            </div>
            <div class="blog-widget" style="background:var(--blog-bg2)">
              <h4><i class="fa-solid fa-shield-halved"></i> BlogWorld 提醒</h4>
              <p style="font-size:12px;line-height:1.6;color:#6b7280;margin:0">此為公開部落格平台，文章由作者自行撰寫。留言區為社群互動，請保持友善。</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,Sa(i),i.querySelector("[data-blog-back-home]")?.addEventListener("click",()=>Et()),i.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>be()),i.querySelectorAll("[data-blog-author]").forEach(m=>{m.addEventListener("click",()=>In(m.dataset.blogAuthor))}),i.querySelectorAll("[data-blog-url]").forEach(m=>{m.addEventListener("click",()=>It(m.dataset.blogUrl))});const o=document.getElementById("view-search");o&&(o.scrollTop=0);const c=i.querySelector(".blog-body");c&&(c.scrollTop=0),i.scrollIntoView({behavior:"auto",block:"start"})}function Cn(e){return e==="https://school.example/guangzhi-essay-sawyer"||e.includes("school.example/guangzhi")}function Cs(e){return`
    <div class="school-topline">
      <span><b>廣志中學</b> Kwong Chi Secondary School</span>
      <span>校訓：勤 · 誠 · 仁 · 毅</span>
      <div class="school-topline__links">
        <span>English</span><span>聯絡我們</span><span>登入 Intranet</span>
      </div>
    </div>
    <div class="school-header">
      <div class="school-header__row">
        <div class="school-header__crest"><i class="fa-solid fa-graduation-cap"></i></div>
        <div class="school-header__title">
          <h1>廣志中學 <span>KWONG CHI SECONDARY SCHOOL</span></h1>
          <p>Est. 1968 · 校務處 · 學生成就檔案</p>
        </div>
        <div class="school-header__meta">
          <span><i class="fa-solid fa-location-dot"></i> 九龍廣志街 38 號</span>
          <span><i class="fa-solid fa-phone"></i> 2748 3821</span>
        </div>
        <div class="school-header__actions">
          <button class="school-back" data-school-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
          <button class="school-btn primary">校園入口</button>
        </div>
      </div>
      <nav class="school-nav">
        <a>學校簡介</a>
        <a>行政架構</a>
        <a>課程介紹</a>
        <a class="active">學生成就</a>
        <a>家校合作</a>
        <a>聯絡我們</a>
      </nav>
    </div>
    <div class="school-breadcrumb">
      <a data-school-home>首頁</a><span class="sep">›</span>
      <a>學生成就</a><span class="sep">›</span>
      <a>作品集 · Portfolio</a><span class="sep">›</span>
      <b style="color:var(--school-navy)">聖誕假期作文比賽 · 二等獎</b>
    </div>
  `}function Ls(e){e.querySelectorAll("[data-school-back-search]").forEach(t=>t.addEventListener("click",()=>be())),e.querySelectorAll("[data-school-home]").forEach(t=>t.addEventListener("click",()=>be()))}function Ts(e){const t=e||ct.find(o=>o.url==="https://school.example/guangzhi-essay-sawyer")||ot.find(o=>Cn(o.url));if(!t)return;try{l.markArticleRead(t.url)}catch{}const a=document.getElementById("searchDetail"),i=document.getElementById("searchLayout");if(!a||!i)return;i.style.display="none",a.style.display="block",a.classList.add("open");const n=document.getElementById("md5Tool");n&&(n.style.display="none",n.innerHTML="");const s=t.images||(t.image?[t.image]:[]);a.innerHTML=`
    <div class="school-platform">
      ${Cs("portfolio")}
      <div class="school-body">
        <div class="school-backrow">
          <button class="school-back" data-school-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋結果</button>
          <span style="margin-left:auto;display:flex;gap:6px">
            <button class="school-btn ghost"><i class="fa-solid fa-print"></i> 列印</button>
            <button class="school-btn"><i class="fa-solid fa-share-nodes"></i> 分享</button>
          </span>
        </div>

        <div class="school-hero">
          <div class="school-hero__inner">
            <div class="school-hero__badge">
              <i class="fa-solid fa-award"></i>
              <b>二等獎</b>
              <span>Second Prize</span>
            </div>
            <div class="school-hero__main">
              <div class="school-hero__kicker">Students Portfolio · 學生成就檔案 <span class="dot"></span> 2022–2023 年度 <span class="dot"></span> 語文科</div>
              <h1 class="school-hero__title">廣志中學聖誕假期作文比賽</h1>
              <p class="school-hero__subtitle">本年度聖誕假期作文比賽共收到 186 份作品，經中文科組評選後選出 12 份優異作品。此檔案為「二等獎」得主之公開作品集，供校內師生及家長瀏覽。</p>
              <div class="school-hero__meta">
                <span class="school-hero__tag gold"><i class="fa-solid fa-medal"></i> 二等獎 · 中五組</span>
                <span class="school-hero__tag">中五甲班 · 蔡梓掦</span>
                <span class="school-hero__tag"><i class="fa-regular fa-calendar"></i> 公布日期：2010-01-09</span>
                <span style="margin-left:auto;font-size:11px;color:var(--school-subtle)"><i class="fa-solid fa-eye"></i> 瀏覽 1,248 · <i class="fa-solid fa-download"></i> 下載 86</span>
              </div>
            </div>
            <div class="school-hero__actions">
              <button class="school-btn primary"><i class="fa-solid fa-file-lines"></i> 下載 PDF</button>
            </div>
          </div>
        </div>

        <div class="school-layout">
          <div class="school-main">
            <div class="school-profile-card">
              <div class="school-profile-card__head">
                <div class="school-profile-card__avatar">蔡</div>
                <div class="school-profile-card__info">
                  <h2 class="school-profile-card__name">蔡梓掦 <small>Sawyer Choi · Choi Tsz Yeung</small></h2>
                  <div class="school-profile-card__class"><span><b>中五甲班</b> · 5A</span><span>學號：5A-12</span><span>指導老師：陳慧敏老師</span></div>
                  <div class="school-profile-card__stats">
                    <span><b>二等獎</b> 中五組</span>
                    <span><b>12</b> 入選作品</span>
                    <span><b>186</b> 參賽總數</span>
                    <span>檔案編號：GSC-CHI-2022-5A-012</span>
                  </div>
                </div>
                <div style="position:relative;z-index:1;margin-left:auto;display:flex;flex-direction:column;gap:6px">
                  <span class="school-btn" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.18);color:#fff"><i class="fa-solid fa-id-card"></i> 學生檔案</span>
                </div>
              </div>
              <div class="school-profile-card__body">
                <p class="school-profile-card__quote"><i class="fa-solid fa-quote-left" style="color:#c9b48a;margin-right:6px"></i>「文字能讓想法留下來。很高興這次的嘗試被看見，謝謝老師的鼓勵。」—— 蔡梓掦（獲獎感言節錄）</p>
                <div class="school-profile-card__grid">
                  <div class="school-stat"><b>二等獎</b><span>聖誕假期作文比賽 · 中五組</span></div>
                  <div class="school-stat"><b>公開展示</b><span>作品已收錄於校園展覽廊</span></div>
                </div>
              </div>
            </div>

            <div class="school-doc">
              <div class="school-doc__head">
                <h3><i class="fa-solid fa-book-open"></i> 得獎作品原稿 · Handwritten Manuscript</h3>
                <div class="school-doc__tools">
                  <span class="school-doc__tool"><i class="fa-solid fa-magnifying-glass"></i> 放大檢視</span>
                  <span class="school-doc__tool"><i class="fa-solid fa-download"></i> 下載原稿 (PNG)</span>
                </div>
              </div>
              <div class="school-doc__pages">
                ${s.map((o,c)=>`
                  <div class="school-page" data-school-page="${c}">
                    <div class="school-page__bar">
                      <span><b>原稿</b> · Page ${c+1} / ${s.length} · 手寫掃描件</span>
                      <span style="display:flex;gap:8px;align-items:center"><span class="school-doc__tool" data-school-zoom="${c}"><i class="fa-solid fa-expand"></i> 全螢幕</span><span>300 dpi · 彩色掃描</span></span>
                    </div>
                    <div class="school-page__img"><img src="${g(o)}" alt="作文原稿第${c+1}頁" loading="lazy" onerror="this.src='https://via.placeholder.com/640x900?text=Manuscript+${c+1}'" /></div>
                    <div class="school-page__caption">
                      <span><i class="fa-solid fa-pen-nib" style="color:var(--school-gold)"></i> 蔡梓掦 · 中五甲班 · 聖誕假期作文比賽參賽作品（掃描件僅供校內存檔）</span>
                      <span>頁碼 ${c+1} · 由中文科組存檔</span>
                    </div>
                  </div>
                `).join("")}
                ${s.length?"":'<div style="padding:24px;text-align:center;color:var(--school-muted)">暫無掃描件</div>'}
              </div>
              <div style="padding:10px 16px;background:#fdfdfb;border-top:1px solid var(--school-border2);font-size:11px;color:var(--school-subtle);display:flex;gap:12px;flex-wrap:wrap;justify-content:space-between">
                <span><i class="fa-solid fa-shield-halved"></i> 校方聲明：本作品著作權歸學生所有，未經授權不得轉載。</span>
                <span>檔案最後更新：2023-01-10 09:32 · 管理員：中文科組</span>
              </div>
            </div>

            <div class="school-eval">
              <div class="school-eval__head"><h4><i class="fa-solid fa-comments"></i> 評審評語 · Jury Comments</h4></div>
              <div class="school-eval__body">
                <div class="school-eval__row">
                  <div style="flex:1">
                    <b>陳慧敏老師（中文科）</b><br>
                    <span>行文真摯，情感細膩，能以日常小事帶出成長體悟。字跡工整，結構完整，具中五學生應有之觀察力與表達力。</span>
                    <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
                      <span class="school-hero__tag">立意明確</span><span class="school-hero__tag">情感真切</span><span class="school-hero__tag gold">優異</span>
                    </div>
                  </div>
                  <div class="school-eval__seal"><span>廣志中學</span><span style="font-size:10px;letter-spacing:2px">KWONG CHI</span><span style="font-size:8px;letter-spacing:1px">審核通過</span></div>
                </div>
                <div class="school-eval__row" style="background:#fff">
                  <span><b>頒獎：</b> 2010 年 1 月 16 日（一）早會頒發證書及書券。作品將於二樓展覽廊展出至 2 月底。</span>
                </div>
              </div>
            </div>
          </div>

          <aside class="school-side">
            <div class="school-widget">
              <h4><i class="fa-solid fa-trophy" style="color:var(--school-gold)"></i> 本屆獲獎名單 · 中五組</h4>
              <div class="school-list">
                ${[{rank:1,name:"陳曉彤",cls:"中五乙班",title:"《冬日的燈火》",award:"一等獎",tag:"評審大獎"},{rank:2,name:"蔡梓掦",cls:"中五甲班",title:"《有時候, 輸也是一種贏》",award:"二等獎",tag:"優異作品",active:!0},{rank:3,name:"林俊賢",cls:"中五丙班",title:"《廣場的鴿子》",award:"二等獎",tag:""},{rank:4,name:"黃思敏",cls:"中四甲班",title:"《雨後的操場》",award:"優異獎",tag:""},{rank:5,name:"張嘉裕",cls:"中五甲班",title:"《重返舊校舍》",award:"優異獎",tag:""}].map(o=>`
                  <div class="school-list__item ${o.active?"active":""}" data-school-peer="${o.name}">
                    <div class="school-list__num">${o.rank}</div>
                    <div style="flex:1;min-width:0">
                      <div class="school-list__title">${g(o.title)} <span style="font-weight:400;color:var(--school-subtle)">— ${g(o.name)}</span></div>
                      <div class="school-list__meta">${g(o.cls)} · ${g(o.award)} ${o.tag?`· <b style="color:var(--school-gold)">${g(o.tag)}</b>`:""}</div>
                    </div>
                    ${o.active?'<i class="fa-solid fa-chevron-right" style="color:var(--school-navy);align-self:center"></i>':""}
                  </div>
                `).join("")}
              </div>
              <div style="margin-top:10px;display:flex;gap:6px">
                <button class="school-btn" style="flex:1"><i class="fa-solid fa-list"></i> 完整名單</button>
                <button class="school-btn" style="flex:1">歷屆作品</button>
              </div>
            </div>

            <div class="school-widget">
              <h4><i class="fa-solid fa-building-columns"></i> 關於學生成就檔案</h4>
              <p>廣志中學自 2008 年起建立「學生成就檔案」制度，系統化收藏學生在學術、體藝、服務及創作等領域之成果，並於校網公開展示優異作品，鼓勵同儕觀摩學習。</p>
              <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">
                <span class="school-archive__tag active">作文比賽</span>
                <span class="school-archive__tag">書法</span>
                <span class="school-archive__tag">演講</span>
                <span class="school-archive__tag">科學專題</span>
                <span class="school-archive__tag">視藝</span>
              </div>
            </div>

            <div class="school-widget" style="background:linear-gradient(135deg,#fdfdfb 0%, #f4f1ea 100%)">
              <h4><i class="fa-solid fa-circle-info"></i> 檔案資訊</h4>
              <div style="display:grid;gap:6px;font-size:11px;color:var(--school-muted);line-height:1.6">
                <div><b style="color:var(--school-navy)">檔案編號：</b> GSC-CHI-2022-5A-012</div>
                <div><b style="color:var(--school-navy)">分類：</b> 語文科 · 中文寫作 · 假期徵文</div>
                <div><b style="color:var(--school-navy)">原稿格式：</b> 手寫 · A4 橫線紙 · 掃描 PNG</div>
                <div><b style="color:var(--school-navy)">公開範圍：</b> 校內公開 · 家長可瀏覽</div>
                <div><b style="color:var(--school-navy)">聯絡：</b> 中文科組 · chi@kwongchi.edu.hk</div>
              </div>
            </div>

            <div class="school-widget">
              <h4><i class="fa-solid fa-link"></i> 相關連結</h4>
              <div style="display:flex;flex-direction:column;gap:8px;font-size:12px">
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 2021 年度作文比賽作品集</a>
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 中文科學習資源</a>
                <a><i class="fa-solid fa-chevron-right" style="font-size:10px"></i> 校園展覽廊（虛擬導覽）</a>
              </div>
            </div>
          </aside>
        </div>

        <div class="school-footer">
          <div><b>廣志中學 Kwong Chi Secondary School</b> · 九龍廣志街 38 號 · Tel 2748 3821 · Fax 2748 3822</div>
          <div class="school-footer__links">
            <span>私隱政策</span><span>版權聲明</span><span>無障礙</span><span>© 2008 Kwong Chi Secondary School</span>
          </div>
        </div>
      </div>
    </div>

    <div id="schoolLightbox" class="school-lightbox" aria-hidden="true">
      <div class="school-lightbox__card">
        <div class="school-lightbox__head">
          <span><i class="fa-solid fa-file-lines"></i> 原稿預覽 · Page <span id="schoolLbPage">1</span> / ${s.length}</span>
          <button class="school-lightbox__close" id="schoolLbClose"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="school-lightbox__img"><img id="schoolLbImg" src="" alt="原稿大圖" /></div>
      </div>
    </div>
  `,Ls(a),a.querySelectorAll("[data-school-zoom]").forEach(o=>{o.addEventListener("click",()=>{const c=Number(o.dataset.schoolZoom),m=s[c],p=document.getElementById("schoolLightbox"),u=document.getElementById("schoolLbImg"),v=document.getElementById("schoolLbPage");p&&u&&(u.src=m,v&&(v.textContent=String(c+1)),p.classList.add("open"),p.setAttribute("aria-hidden","false"))})}),a.querySelectorAll(".school-page__img img").forEach((o,c)=>{o.style.cursor="zoom-in",o.addEventListener("click",()=>{const m=document.getElementById("schoolLightbox"),p=document.getElementById("schoolLbImg"),u=document.getElementById("schoolLbPage");m&&p&&(p.src=s[c],u&&(u.textContent=String(c+1)),m.classList.add("open"),m.setAttribute("aria-hidden","false"))})}),a.querySelector("#schoolLbClose")?.addEventListener("click",()=>{const o=document.getElementById("schoolLightbox");o&&(o.classList.remove("open"),o.setAttribute("aria-hidden","true"))}),a.querySelector("#schoolLightbox")?.addEventListener("click",o=>{o.target.id==="schoolLightbox"&&(o.currentTarget.classList.remove("open"),o.currentTarget.setAttribute("aria-hidden","true"))}),a.querySelectorAll("[data-school-peer]").forEach(o=>{o.dataset.schoolPeer!=="蔡梓掦"&&o.addEventListener("click",()=>{const c=o.dataset.schoolPeer,m=document.createElement("div");m.textContent=c+" 的作品僅展示標題，完整內容未公開。",m.style.cssText="position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:#0f2b46;color:#fff;padding:10px 14px;border-radius:999px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:1300",document.body.appendChild(m),setTimeout(()=>m.remove(),2200)})});const r=document.getElementById("view-search");r&&(r.scrollTop=0);const d=document.querySelector(".search");d&&(d.scrollTop=0),a.scrollIntoView({behavior:"auto",block:"start"})}function As(e){const t=vs(e);if(!t)return;const a=document.getElementById("searchDetail"),i=document.getElementById("searchLayout");if(!a||!i)return;i.style.display="none",a.style.display="block",a.classList.add("open");const n=document.getElementById("md5Tool");n&&(n.style.display="none",n.innerHTML=""),a.innerHTML=`
    <div class="so-platform">
      <div class="so-topbar">
        <div class="so-topbar__left">
          <span class="so-logo"><i class="fa-brands fa-stack-overflow" style="color:#f48024"></i> stack<span style="font-weight:800">overflow</span></span>
          <span class="so-topbar__nav">問題 · 標籤 · 用戶 · 團隊</span>
        </div>
        <div class="so-topbar__right">
          <span class="so-search-hint"><i class="fa-solid fa-magnifying-glass"></i> 搜尋...</span>
          <button class="so-btn" data-so-back-search><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
        </div>
      </div>
      <div class="so-body">
        <div class="so-main">
          <div class="so-question-header">
            <h1 class="so-title">${t.title.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</h1>
            <div class="so-qmeta">
              <span>發問於 ${t.asked}</span><span>·</span><span>已瀏覽 ${t.viewed} 次</span>
              <span class="so-qmeta__tags">${t.tags.map(r=>`<span class="so-tag">${g(r)}</span>`).join("")}</span>
            </div>
          </div>
          <div class="so-post so-question">
            <div class="so-votes">
              <button class="so-vote"><i class="fa-solid fa-caret-up"></i></button>
              <span class="so-vote-count">${t.votesQ}</span>
              <button class="so-vote"><i class="fa-solid fa-caret-down"></i></button>
              <span class="so-vote__fav"><i class="fa-solid fa-bookmark"></i> ${t.fav}</span>
            </div>
            <div class="so-content">
              <div class="so-md">${t.question.content}</div>
              <div class="so-tags">${t.tags.map(r=>`<span class="so-tag">${g(r)}</span>`).join("")}</div>
              <div class="so-author-box">
                <div class="so-author__label">發問者</div>
                <div class="so-author">
                  <img src="${g(t.question.avatar)}" alt="" onerror="this.style.display='none'" />
                  <div><b>${g(t.question.author)}</b><div class="so-rep">${g(t.question.rep)} · ${g(t.question.time)}</div></div>
                </div>
              </div>
              ${t.commentsQ.length?`<div class="so-comments">${t.commentsQ.map(r=>`<div class="so-comment"><b>${g(r.user)}</b> ${g(r.text)} <span class="so-comment__time">— ${g(r.time)}</span></div>`).join("")}</div>`:""}
            </div>
          </div>
          <div class="so-answers-head"><b>${t.answers.length} 個回答</b> <span style="color:#6a737c">· 已採納在最前</span></div>
          ${t.answers.map(r=>`
            <div class="so-post so-answer ${r.accepted?"so-accepted":""}">
              <div class="so-votes">
                <button class="so-vote"><i class="fa-solid fa-caret-up"></i></button>
                <span class="so-vote-count" style="${r.accepted?"color:#3ca076":""}">${r.votes}</span>
                <button class="so-vote"><i class="fa-solid fa-caret-down"></i></button>
                ${r.accepted?'<div class="so-check" title="已採納"><i class="fa-solid fa-check"></i></div>':""}
              </div>
              <div class="so-content">
                <div class="so-md">${r.content}</div>
                <div class="so-author-box ${r.accepted?"so-author--accepted":""}">
                  <div class="so-author__label">${r.accepted?"已採納 · 回答者":"回答者"}</div>
                  <div class="so-author">
                    <img src="${g(r.avatar)}" alt="" onerror="this.style.display='none'" />
                    <div><b>${g(r.author)}</b><div class="so-rep">${g(r.rep)} · ${g(r.time)}</div></div>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
          <div class="so-related">
            <h4>相關問題</h4>
            <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
              <a>HTML 的 &lt;div&gt; 和 &lt;section&gt; 差在哪？</a>
              <a>一個頁面可以放多個 &lt;h1&gt; 嗎？對 SEO 的影響</a>
              <a>什麼時候該用 &lt;span&gt; 而不是 &lt;div&gt;？</a>
            </div>
          </div>
        </div>
        <div class="so-side">
          <div class="so-widget">
            <h4 style="background:#fdf7e2;border-bottom:1px solid #f1e5bc;padding:8px 10px;margin:-12px -12px 10px;border-radius:8px 8px 0 0"><i class="fa-solid fa-bars"></i> 相關標籤</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${t.tags.map(r=>`<span class="so-tag">${g(r)}</span>`).join("")}
              <span class="so-tag">css</span><span class="so-tag">accessibility</span>
            </div>
          </div>
          <div class="so-widget">
            <h4><i class="fa-solid fa-chart-simple"></i> 問題數據</h4>
            <div style="font-size:12px;line-height:1.8;color:#6a737c">
              <div>瀏覽：${t.viewed}</div>
              <div>收藏：${t.fav}</div>
              <div>回答：${t.answers.length}</div>
              <div>標籤：${t.tags.join(", ")}</div>
            </div>
          </div>
          <div class="so-widget" style="background:#f8f9f9">
            <h4><i class="fa-solid fa-lightbulb"></i> 小知識</h4>
            <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0"><code>&lt;h1&gt;</code> 是頁面主標題，<code>&lt;h2&gt;～&lt;h6&gt;</code> 依層級遞減；<code>&lt;p&gt;</code> 是段落，<code>&lt;div&gt;</code> 無語意，語意化標籤 <code>&lt;header&gt;/&lt;nav&gt;/&lt;main&gt;/&lt;footer&gt;</code> 能提升 SEO 與無障礙。</p>
          </div>
        </div>
      </div>
    </div>
  `,a.querySelector("[data-so-back-search]")?.addEventListener("click",()=>be());const s=document.getElementById("view-search");s&&(s.scrollTop=0),a.scrollIntoView({behavior:"auto",block:"start"})}function $s(e){const t=ot[e];if(!t)return;if(t.isMD5Tool||t.url==="md5-tool"){ws(St);return}const a=document.getElementById("md5Tool");if(a&&(a.style.display="none",a.innerHTML=""),hs(t.url)){As(t.url);return}const i=t.url;if(ee.some(u=>u.url===i)||i.includes("sawyer-blog.example")||i.includes("mary-blog.example")||i.includes("peter-blog.example")||i.includes("paul-blog.example")||i.includes("emma-blog.example")||i.includes("david-blog.example")){let u=i;if(!Wt(u)){const v=ee.find(h=>h.title===t.title);v&&(u=v.url)}if(Wt(u)){It(u);return}}if(Cn(t.url)||t.title.includes("廣志中學")){Ts(t);return}const n=document.getElementById("searchLayout"),s=document.getElementById("searchDetail");if(!n||!s)return;try{t.url&&(t.type==="news"||t.url.includes("news.example"))&&l.markArticleRead(t.url)}catch{}n.style.display="none",s.style.display="block",s.classList.add("open");let r="",d=null;if(t.url.startsWith("/customer-portal")||t.url.startsWith("file://")){d=t.url.replace("file://","");const u=k.getFile(d);u&&typeof u.content=="string"&&(r=u.content,k.readFile(d))}else if(k.exists(t.url)){d=t.url;const u=k.getFile(d);u&&typeof u.content=="string"&&(r=u.content)}if(!r&&t.title.startsWith("/customer-portal")){const u=k.getFile(t.title);u&&typeof u.content=="string"&&(r=u.content)}const o=r||t.snippet||"無內容",c=t.images?t.images.map(u=>`<div class="detail__image"><img src="${g(u)}" alt="preview" style="width:100%;display:block" onerror="this.src='https://via.placeholder.com/320x480?text=Sawyer+Writing'" /></div>`).join(""):t.image?`<div class="detail__image"><img src="${g(t.image)}" alt="preview" onerror="this.src='https://via.placeholder.com/320x180?text=Preview'" /></div>`:"";s.innerHTML=`
    <button id="searchBackBtn" class="btn detail__back">← 上一頁</button>
    <div class="detail__card">
      <h2 class="detail__title">${g(t.title)}</h2>
      <div class="detail__url">${g(t.url)}</div>
      ${c}
      <div class="detail__snippet">${xa(o,wa)}</div>
      ${r?`<pre class="detail__pre">${g(r)}</pre>`:""}
      <div class="result__meta" style="margin-top:12px">
        <span class="result__tag">${t.type}</span>
      </div>
    </div>
  `,s.querySelector("#searchBackBtn")?.addEventListener("click",()=>be());const m=document.querySelector(".search");m&&(m.scrollTop=0);const p=document.getElementById("view-search");p&&(p.scrollTop=0),s.scrollIntoView({behavior:"auto",block:"start"})}var gt=0,ta=null,Bs=!1,X="/darknet/全結構圖",mt="secret",Ct=!1;function Ps(){return k.buildDarkTree?k.buildDarkTree():k.buildTree()}function js(e){const t=Ps();function a(n,s){if(n.path===s)return n;if(!n.children)return null;for(const r of n.children){const d=a(r,s);if(d)return d}return null}const i=a(t,e);return!i||!i.children?[]:i.children}function Ln(){document.getElementById("view-darknet")&&(X==="/darknet"&&(X="/darknet/全結構圖"),l.hasFlag("dark_entered"),Yt())}function Wa(){const e=document.getElementById("dock");e&&(e.style.display="none"),$(()=>Promise.resolve().then(()=>re).then(t=>{t.setDockVisible&&t.setDockVisible(!1)}),void 0).catch(()=>{})}function Gt(){const e=document.getElementById("dock");e&&(e.style.display=""),$(()=>Promise.resolve().then(()=>re).then(t=>{t.setDockVisible&&t.setDockVisible(!0)}),void 0).catch(()=>{})}function Yt(){const e=document.getElementById("view-darknet");if(e)if(mt==="secret"){const t=Lt,a=l.hasFlag("dark_secret_active");!t&&Ct||a?Wa():Gt(),e.innerHTML=`
      <div class="darknet">
        <button id="darkBackBtn" class="btn" style="position:absolute;top:12px;left:12px;z-index:5">← 退回內網</button>
        <div class="darknet__secret" id="darkSecretView">
          <div class="darknet__title" id="darkTitle" style="cursor:default">SECRET</div>
          <div class="darknet__subtitle">Keep Quiet · File System</div>
          <div class="darknet__search">
            <span style="color:#722F37">🔍</span>
            <input id="darkSearchInput" value="" disabled style="pointer-events:none;opacity:.5" />
          </div>
        </div>
      </div>
    `,Ms()}else{X==="/darknet"&&(X="/darknet/全結構圖");const t=l.hasFlag("dark_secret_active");!Lt&&Ct||t?Wa():Gt();const a=js(X),i=a.filter(s=>s.type==="dir"),n=a.filter(s=>s.type==="file");e.innerHTML=`
      <div class="darknet">
        <div style="height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid #1a0a0c;background:#0a0a0a;flex-shrink:0">
          <span class="small muted" style="color:#8b6a6e">機密文件庫 · ${g(X)}</span>
          <button id="darkExitBtn" class="btn" style="padding:4px 10px;background:#722F37;border-color:#722F37;color:#fff">退出暗網</button>
        </div>
        <div class="darknet__fileview">
          <nav class="darknet__nav" id="darkNav"></nav>
          <div class="darknet__main" id="darkMain"></div>
        </div>
      </div>
      <div id="darkPreview" class="intra-preview" style="display:none" role="dialog" aria-modal="true">
        <div class="intra-preview__card" style="background:#0a0a0a;border-color:#722F37">
          <div class="intra-preview__head" style="background:#1a0a0c;border-color:#722F37">
            <b id="darkPreviewName" class="mono small" style="color:#e9edef"></b>
            <button id="darkPreviewClose" class="btn" style="padding:4px 10px">關閉</button>
          </div>
          <pre id="darkPreviewContent" class="intra-preview__content" style="background:#000;color:#e9edef"></pre>
        </div>
      </div>
    `,Fs(),Ns(i,n),Hs()}}function Ms(){const e=document.getElementById("darkTitle");document.getElementById("darkSearchInput");const t=document.getElementById("darkBackBtn");t&&t.addEventListener("click",()=>{Gt();try{l.setFlag("dark_secret_active",!1)}catch{}$(()=>Promise.resolve().then(()=>re).then(i=>{i.setActiveView&&(i.setActiveView("intranet"),localStorage.setItem("cc_active_view","intranet"))}),void 0),mt="secret",Lt=!1,Ct=!1;const a=document.getElementById("view-darknet");a&&(a.innerHTML="")}),e&&(e.style.cursor="default",!Lt&&e.addEventListener("click",()=>{gt++,ta&&clearTimeout(ta),ta=setTimeout(()=>{gt=0},2e3),gt>=6&&(gt=0,Ds())}))}function Ds(){Bs=!0,mt="files",X==="/darknet"&&(X="/darknet/全結構圖"),l.setFlag("dark_entered",!0),l.setFlag("ch3_entered_secret",!0),l.setFlag("hidden_portal_accessed",!0),Yt(),l.setFlag("found_code_map",!0)}function Fs(){const e=document.getElementById("darkNav");e&&(e.innerHTML=[{path:"/darknet/全結構圖",label:"全結構圖",icon:"🗺️"},{path:"/darknet/交易列表",label:"交易列表",icon:"📋"},{path:"/darknet/合作公司列表",label:"合作公司",icon:"🏢"},{path:"/darknet/流量",label:"流量",icon:"📦"},{path:"/darknet/月結單",label:"月結單",icon:"💰"},{path:"/darknet/Sawyer支出",label:"Sawyer支出",icon:"💸"},{path:"/darknet/出差紀錄",label:"出差紀錄",icon:"✈️"},{path:"/darknet/會議紀錄",label:"會議記錄",icon:"📝"}].map(t=>`<div class="darknet__nav-item ${X===t.path||X.startsWith(t.path+"/")?"active":""}" data-path="${t.path}"><span>${t.icon}</span><span>${t.label}</span></div>`).join(""),e.querySelectorAll(".darknet__nav-item").forEach(t=>t.addEventListener("click",()=>{X=t.dataset.path,Yt()})))}function Ns(e,t){const a=document.getElementById("darkMain");if(a){if(!e.length&&!t.length){const i=k.getDarkFile?k.getDarkFile(X):null;if(i&&i.content){a.innerHTML=`<pre style="white-space:pre-wrap;word-break:break-word;font-family:var(--font-mono);font-size:13px;color:#e9edef">${g(i.content.slice(0,8e3))}</pre>`,l.discoverFile(X),Ea();return}a.innerHTML='<div style="padding:24px;text-align:center;color:#5a3a3e">此資料夾為空</div>';return}a.innerHTML=`
    <div style="font-size:11px;font-weight:700;letter-spacing:.6px;color:#5a3a3e;margin-bottom:8px">${g(X)} — ${e.length} 資料夾，${t.length} 檔案</div>
    ${e.length?`<div style="margin-bottom:12px">${e.map(i=>`<div class="darknet__file-row is-dir" data-path="${g(i.path)}" data-type="dir">📁 ${g(i.name)}</div>`).join("")}</div>`:""}
    ${t.length?`<div>${t.map(i=>`<div class="darknet__file-row" data-path="${g(i.path)}" data-type="file">📄 ${g(i.name)}</div>`).join("")}</div>`:""}
  `,a.querySelectorAll(".darknet__file-row").forEach(i=>{i.addEventListener("click",()=>{const n=i.dataset.path;i.dataset.type==="dir"?(X=n,Yt()):Os(n)})})}}function Os(e){const t=k.getDarkFile?k.getDarkFile(e):k.getFile(e);if(!t)return;const a=document.getElementById("darkPreview"),i=document.getElementById("darkPreviewName"),n=document.getElementById("darkPreviewContent");if(!a||!i||!n)return;i.textContent=e;let s=t.content||"";if(e.toLowerCase().endsWith(".csv")){const r=s.split(`
`).filter(u=>u.trim()!==""),d=u=>{const v=[];let h="",b=!1;for(let A=0;A<u.length;A++){const P=u[A];P==='"'?b&&u[A+1]==='"'?(h+='"',A++):b=!b:P===","&&!b?(v.push(h),h=""):h+=P}return v.push(h),v},o=d(r[0]||""),c=r.slice(1).map(d),m=`<thead><tr>${o.map(u=>`<th style="padding:8px 10px;border:1px solid #722F37;background:#1a0a0c;color:#a67c81;text-align:left">${g(u)}</th>`).join("")}</tr></thead>`,p=`<tbody>${c.map(u=>`<tr>${u.map(v=>`<td style="padding:7px 10px;border:1px solid #1a0a0c;color:#e9edef">${g(v)}</td>`).join("")}</tr>`).join("")}</tbody>`;n.innerHTML=`<div style="padding:8px 12px;border-bottom:1px solid #1a0a0c;background:#1a0a0c;display:flex;justify-content:space-between"><span class="small muted" style="color:#8b6a6e">${g(e)} — 表格檢視</span><span class="small muted" style="color:#8b6a6e">${c.length} 列</span></div><div style="overflow:auto;max-height:60vh"><table style="width:100%;border-collapse:collapse;font-size:13px">${m}${p}</table></div>`,n.style.whiteSpace="normal"}else s.length>12e3&&(s=s.slice(0,12e3)+`
...`),n.textContent=s,n.style.whiteSpace="pre-wrap";a.style.display="flex",l.discoverFile(e),l.setFlag("dark_opened:"+e,!0),Ea()}function Hs(){document.getElementById("darkExitBtn")?.addEventListener("click",()=>{mt="secret",Ct=!1;try{l.setFlag("dark_secret_active",!1)}catch{}Gt(),Ea(!0),$(()=>Promise.resolve().then(()=>re).then(t=>{t.setActiveView&&(t.setActiveView("intranet"),localStorage.setItem("cc_active_view","intranet"))}),void 0);const e=document.getElementById("view-darknet");e&&(e.innerHTML=""),l.hasFlag("ch4_all_opened")&&setTimeout(()=>{window.dispatchEvent(new CustomEvent("darknet:exit"))},300)}),document.getElementById("darkPreviewClose")?.addEventListener("click",()=>{const e=document.getElementById("darkPreview");e&&(e.style.display="none")}),document.getElementById("darkPreview")?.addEventListener("click",e=>{e.target.id==="darkPreview"&&(e.target.style.display="none")})}function Ea(e=!1){const t=k.listDarkFiles?k.listDarkFiles("/darknet"):[];if(!t.length)return;const a=t.filter(i=>l.hasFlag("dark_opened:"+i.path)||l.hasFlag("discovered:"+i.path)||l.get("discoveredFiles")?.includes(i.path));a.length>=t.length?(l.hasFlag("ch4_all_opened")||l.setFlag("ch4_all_opened",!0),e&&!l.hasFlag("ch5_triggered")&&(l.setFlag("ch5_triggered",!0),window.dispatchEvent(new CustomEvent("ch4:complete")),setTimeout(()=>{const i=document.getElementById("mailDialog");if(i&&!i.open)try{i.showModal()}catch{i.style.display="block",i.setAttribute("open","")}},500))):e&&a.length>=t.length,a.length>=t.length&&!l.hasFlag("ch4_all_opened")&&l.setFlag("ch4_all_opened",!0)}var Lt=!1;function aa(e={}){if(!(l.hasFlag("ch1_0043_committed")&&!l.hasFlag("ch1_revert_done"))&&document.getElementById("view-darknet")){if(Lt=!!e.simple,Ct=!0,e.simple)try{l.setFlag("dark_secret_active",!1)}catch{}else try{l.setFlag("dark_secret_active",!0)}catch{}mt="secret",gt=0,$(()=>Promise.resolve().then(()=>re).then(t=>{t.setActiveView&&(t.setActiveView("darknet"),localStorage.setItem("cc_active_view","darknet"))}),void 0),Ln()}}var te="/intranet",Je="",Ga="/intranet/client_info";function Tt(e){return e===Ga||e.startsWith(Ga+"/")}function Ja(e){const t=k.buildTree();function a(n,s){if(n.path===s)return n;if(!n.children)return null;for(const r of n.children){const d=a(r,s);if(d)return d}return null}const i=a(t,e);return!i||!i.children?[]:i.children}function Vs(){const e=document.getElementById("view-intranet");e&&(e.innerHTML=`
    <div class="intranet">
      <div class="intranet__header">
        <div class="intranet__brand">
          <span class="intranet__logo">🧃</span>
          <div>
            <div class="intranet__title">Nori 飲品供應 · 內網檔案系統</div>
            <div class="intranet__subtitle">Intranet · 冰釀茶酒 · 實驗室研發</div>
          </div>
        </div>
        <div class="intranet__search">
          <span aria-hidden="true">🔍</span>
          <input id="intraSearch" class="intranet__search-input" placeholder="搜尋內網檔案名稱或內容" />
          <button id="intraSearchBtn" class="btn primary" style="padding:6px 12px;flex-shrink:0">搜尋</button>
        </div>
      </div>

      <div class="intranet__breadcrumb" id="intraBreadcrumb"></div>

      <div class="intranet__body">
        <nav class="intranet__nav" id="intraNav" aria-label="檔案導覽"></nav>
        <div class="intranet__main" id="intraMain"></div>
      </div>

      <div class="intranet__footer">
        <span class="small muted">Nori Limited · 鴨嘴道135號中央大樓3507室 · 內網僅供內部瀏覽</span>
        <span class="small muted" id="intraCount"></span>
      </div>
    </div>

    <div id="intraPreview" class="intra-preview" style="display:none" role="dialog" aria-modal="true">
      <div class="intra-preview__card">
        <div class="intra-preview__head">
          <b id="intraPreviewName" class="mono small" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></b>
          <button id="intraPreviewClose" class="btn" style="padding:4px 10px">關閉</button>
        </div>
        <pre id="intraPreviewContent" class="intra-preview__content"></pre>
      </div>
    </div>
  `,Rs(),Tn())}function Rs(){const e=k.internalPathDomain||"https://nori-intranet/internal/portal?",t=k.getLegacyRoute&&k.getLegacyRoute("nori-portal-2023")?._hash||"f665a7117959b667b7f283eaebf69cae",a=e+"hash="+t,i="https://nori-intranet/internal/portal";function n(r){if(!r)return!1;const d=r.trim();return!!(d===a||d.startsWith("https://nori-intranet/internal/portal?hash="+t))}function s(){const r=document.getElementById("intraSearch"),d=r?r.value.trim():"",o=d===i||d===i+"/"||d.includes("nori-intranet/internal/portal")&&!d.includes("hash="),c=n(d);if(l.hasFlag("ch1_0043_committed")&&!l.hasFlag("ch1_revert_done")&&(o||c)){Je=d.toLowerCase(),da();return}if(o){l.setFlag("portal_simple_entered",!0),aa({simple:!0});return}if(c){l.setFlag("portal_hash_entered",!0);const m=d.match(/hash=([a-f0-9]{32})/i),p=m?m[1]:t;if(k.tryAccessPortal&&k.tryAccessPortal({hash:p})){aa({simple:!1});return}else if(d===a){aa({simple:!1});return}}Je=d.toLowerCase(),da()}document.getElementById("intraSearchBtn")?.addEventListener("click",s),document.getElementById("intraSearch")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),s())}),document.getElementById("intraPreviewClose")?.addEventListener("click",sa),document.getElementById("intraPreview")?.addEventListener("click",r=>{r.target.id==="intraPreview"&&sa()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&sa()})}function Tn(){qs(),zs(),da();const e=k.listFiles("/intranet").length,t=document.getElementById("intraCount");t&&(t.textContent=`內網共 ${e} 個檔案`)}function qs(){const e=document.getElementById("intraBreadcrumb");if(!e)return;const t=te.split("/").filter(Boolean);let a='<span class="intra-bc__item" data-path="/intranet">🏠 內網首頁</span>',i="/intranet";const n=t[0]==="intranet"?1:0;t.slice(n).forEach(s=>{i+="/"+s;const r=Tt(i);a+=` <span class="muted">›</span> <span class="intra-bc__item ${i===te?"active":""} ${r?"locked":""}" data-path="${g(i)}">${g(s)}${r?" 🔒":""}</span>`}),te==="/intranet"&&(a='<span class="intra-bc__item active" data-path="/intranet">🏠 內網首頁</span>'),e.innerHTML=a,e.querySelectorAll(".intra-bc__item").forEach(s=>{s.addEventListener("click",()=>Kt(s.dataset.path))})}function zs(){const e=document.getElementById("intraNav");e&&(e.innerHTML=[{path:"/intranet",label:"內網首頁",icon:"🏠",desc:"總覽"},{path:"/intranet/company_public",label:"公司公開資訊",icon:"🏢",desc:"名稱・Logo・大樓名錄"},{path:"/intranet/client_info",label:"客戶資料",icon:"🔒",desc:"權限管制（鎖定）",locked:!0},{path:"/intranet/business_plans",label:"業務計畫",icon:"📊",desc:"完整流程結構"},{path:"/intranet/staff",label:"員工資料",icon:"👥",desc:"50 人名錄"}].map(t=>`<div class="intra-nav__item ${te===t.path||t.path!=="/"&&te.startsWith(t.path+"/")?"active":""} ${t.locked?"locked":""}" data-path="${t.path}" title="${t.path}">
      <span class="intra-nav__icon">${t.icon}</span>
      <span class="intra-nav__label">${t.label}</span>
      <span class="intra-nav__desc">${t.desc}</span>
    </div>`).join("")+`
    <div class="intra-nav__hint small muted" style="padding:10px 12px;border-top:1px solid var(--border);margin-top:8px">
      點擊資料夾瀏覽<br/>點擊檔案預覽內容<br/>客戶資料夾受保護，請向管理員申請讀取權限
    </div>
  `,e.querySelectorAll(".intra-nav__item").forEach(t=>{t.addEventListener("click",()=>Kt(t.dataset.path))}))}function da(){const e=document.getElementById("intraMain");if(!e)return;if(Je){const n=k.searchContent(Je).filter(o=>o.path.startsWith("/intranet")).slice(0,40),s=k.listFiles("/intranet").filter(o=>o.path.toLowerCase().includes(Je)).slice(0,40),r=new Map;n.forEach(o=>r.set(o.path,o)),s.forEach(o=>{r.has(o.path)||r.set(o.path,{path:o.path,snippet:""})});const d=[...r.values()];if(!d.length){e.innerHTML='<div class="intra-empty">無搜尋結果 — 試試「Nori」「冰釀茶酒」「業務流程」「Sawyer」</div>';return}e.innerHTML=`
      <div class="intra-section__title">搜尋結果「${g(Je)}」— ${d.length} 筆</div>
      <div class="intra-file__list">
        ${d.map(o=>{const c=k.getFile(o.path)?.meta?.locked||Tt(o.path);return`<div class="intra-file__row ${c?"locked":""}" data-path="${g(o.path)}" title="${g(o.path)}">
            <span class="intra-file__icon">${c?"🔒":pa(o.path)}</span>
            <span class="intra-file__name">${g(o.path)}</span>
            <span class="small muted" style="margin-left:auto;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g((o.snippet||"").slice(0,60))}</span>
          </div>`}).join("")}
      </div>
    `,ia(e);return}if(Tt(te)){e.innerHTML=`
      <div class="intra-locked">
        <div class="intra-locked__icon">🔒</div>
        <h3>客戶資料 — 權限不足</h3>
        <p class="small muted">本資料夾受保護，僅限法務與客戶經理存取。<br/>遊戲內無需開啟，請返回其他資料夾。</p>
        <div class="intra-locked__files">
          <div class="small" style="font-weight:600;margin-bottom:6px">受保護檔案（僅顯示名稱）</div>
          ${Ja(te).map(n=>`<div class="intra-file__row locked" title="${g(n.path)}"><span>${pa(n.path)}</span><span>${g(n.name)}</span><span class="small muted" style="margin-left:auto">🔒 鎖定</span></div>`).join("")}
        </div>
        <button class="btn" style="margin-top:12px" onclick="document.querySelector('[data-path='/intranet']')?.click()">返回內網首頁</button>
      </div>
    `;return}const t=Ja(te),a=t.filter(n=>n.type==="dir"),i=t.filter(n=>n.type==="file");if(te==="/intranet"&&!Je){e.innerHTML=`
      <div class="intra-grid">
        <div class="intra-card" data-path="/intranet/company_public">
          <div class="intra-card__icon">🏢</div>
          <div class="intra-card__title">公司公開資訊</div>
          <div class="small muted">公司名稱・Logo 設計・上市公司名錄（含 Nori Limited 鴨嘴道135號中央大樓3507室）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">4 個檔案 →</div>
        </div>
        <div class="intra-card locked" data-path="/intranet/client_info">
          <div class="intra-card__icon">🔒</div>
          <div class="intra-card__title">客戶資料</div>
          <div class="small muted">權限管制，遊戲內無需存取。點擊查看提示。</div>
          <div class="small" style="margin-top:8px;color:var(--fg-muted)">🔒 受保護</div>
        </div>
        <div class="intra-card" data-path="/intranet/business_plans">
          <div class="intra-card__icon">📊</div>
          <div class="intra-card__title">業務計畫</div>
          <div class="small muted">營運研發 → 原物料 → 業務 → 配送 → IT（VIP 價格試算）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">2 個檔案 →</div>
        </div>
        <div class="intra-card" data-path="/intranet/staff">
          <div class="intra-card__icon">👥</div>
          <div class="intra-card__title">員工資料</div>
          <div class="small muted">員工名錄 50 人（Sawyer #001 … Casey #048 初級開發人員 … 至 2024-09-02）</div>
          <div class="small" style="margin-top:8px;color:var(--accent)">2 個檔案 →</div>
        </div>
      </div>
      <div class="intra-section">
        <div class="intra-section__title">內網檔案（${t.length} 項）</div>
        <div class="intra-file__list">
          ${t.map(n=>na(n)).join("")}
        </div>
      </div>
    `,e.querySelectorAll("[data-path]").forEach(n=>n.addEventListener("click",s=>{s.stopPropagation();const r=n.getAttribute("data-path");r&&Kt(r)})),ia(e);return}if(!t.length){const n=k.getFile(te);if(n&&n.content!=null){e.innerHTML=`<div class="intra-section__title">${g(te)}</div><pre class="intra-file__preview mono">${g(n.content.slice(0,8e3))}</pre>`;return}e.innerHTML='<div class="intra-empty">此資料夾為空</div>';return}e.innerHTML=`
    <div class="intra-section__title">${g(te)} — ${a.length} 個資料夾，${i.length} 個檔案</div>
    ${a.length?`<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">資料夾</div>${a.map(n=>na(n)).join("")}</div>`:""}
    ${i.length?`<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">檔案</div>${i.map(n=>na(n)).join("")}</div>`:""}
  `,ia(e)}function na(e){const t=e.path&&Tt(e.path),a=(e.path?k.getFile(e.path):null)?.meta?.locked||t,i=a?"🔒":e.type==="dir"?"📁":pa(e.path||e.name);return`<div class="intra-file__row ${e.type==="dir"?"is-dir":""} ${a?"locked":""}" data-path="${g(e.path)}" data-type="${e.type}" title="${g(e.path)}">
    <span class="intra-file__icon">${i}</span>
    <span class="intra-file__name">${g(e.name)}</span>
    <span class="small muted" style="margin-left:auto">${e.type==="dir"?"資料夾":e.path?.split(".").pop()||"檔案"}</span>
  </div>`}function pa(e){return e?e.endsWith(".md")?"📝":e.endsWith(".csv")?"📊":e.endsWith(".svg")?"🖼️":e.endsWith(".json")?"🧩":e.endsWith(".js")||e.endsWith(".java")?"💻":e.endsWith(".html")?"🌐":e.endsWith(".pdf")?"📕":"📄":"📄"}function ia(e){e.querySelectorAll(".intra-file__row").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.path,i=t.dataset.type;if(t.classList.contains("locked")){if(document.getElementById("intraMain")){const n=document.createElement("div");n.className="toast",n.style.cssText="position:fixed;right:12px;bottom:64px;background:#323232;color:#fff;padding:10px 12px;border-radius:8px;z-index:999",n.textContent="🔒 權限不足 — 客戶資料受保護，遊戲內無需存取",document.body.appendChild(n),setTimeout(()=>n.remove(),2200)}return}i==="dir"?Kt(a):Ws(a)})})}function Kt(e){e&&(te=e,Tn())}function Us(e){const t=e.split(`
`).filter(i=>i.trim()!=="");if(!t.length)return{header:[],rows:[]};const a=i=>{const n=[];let s="",r=!1;for(let d=0;d<i.length;d++){const o=i[d];o==='"'?r&&i[d+1]==='"'?(s+='"',d++):r=!r:o===","&&!r?(n.push(s),s=""):s+=o}return n.push(s),n};return{header:a(t[0]),rows:t.slice(1).map(a)}}function Ws(e){const t=k.getFile(e);if(!t||t.meta?.locked||Tt(e))return;const a=document.getElementById("intraPreview"),i=document.getElementById("intraPreviewName"),n=document.getElementById("intraPreviewContent");if(!a||!i||!n)return;i.textContent=e;let s=t.content||"";if(e.toLowerCase().endsWith(".csv")){const{header:r,rows:d}=Us(s),o=`<thead><tr>${r.map(m=>`<th>${g(m)}</th>`).join("")}</tr></thead>`,c=`<tbody>${d.map(m=>`<tr>${m.map(p=>`<td>${g(p)}</td>`).join("")}</tr>`).join("")}</tbody>`;n.innerHTML=`
      <div class="csv-preview__header"><span class="small muted mono">${g(e)} — 表格檢視</span><span class="small muted">${d.length} 列 × ${r.length} 欄</span></div>
      <div style="overflow:auto;max-height:60vh"><table class="csv-table">${o}${c}</table></div>
    `,n.style.whiteSpace="normal"}else s.length>12e3&&(s=s.slice(0,12e3)+`
...（內容已截斷，完整請於 Vizual Studio Code 開啟）`),n.textContent=s,n.style.whiteSpace="pre-wrap";a.style.display="flex"}function sa(){const e=document.getElementById("intraPreview");e&&(e.style.display="none")}function Ya(){const e=l.get("settings.theme")||"dark";document.documentElement.setAttribute("data-theme",e)}function An(){return!!document.fullscreenElement}function $n(){An()?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}function lt(e){e&&(e.textContent=An()?"關閉全螢幕":"開啟全螢幕")}function Gs(){document.querySelectorAll("dialog[open]").forEach(n=>{try{n.close()}catch{}});const e=document.getElementById("startMenu");e&&(e.style.display="none");const t=document.getElementById("intraPreview");t&&(t.style.display="none");const a=document.getElementById("darkPreview");a&&(a.style.display="none");const i=document.getElementById("waLightbox");i&&i.classList.remove("open"),document.querySelectorAll("dialog").forEach(n=>{n.open||n.style.removeProperty("display")})}function Se(e){Gs(),nn(e),localStorage.setItem("cc_active_view",e)}function Js(){Li(),ha(),bn(),xs(),Vs(),Ln(),Qs(),Xs(),Zs()}var Bn=null;function Ys(e){try{const t=JSON.parse(localStorage.getItem("code_conspiracy_state")||"{}").whatsappChats;if(Array.isArray(t)){const a=t.find(i=>i.id===e);if(a)return!!a.muted}return!1}catch{return!1}}function Ks(){try{const t=JSON.parse(localStorage.getItem("code_conspiracy_state")||"{}");if(t.flags&&t.flags.ch0_maggie_notified||t.flags&&t.flags.ch0_vip_fixed||t.currentChapter&&t.currentChapter!==0)return}catch{}if(l.hasFlag("ch0_maggie_notified")||l.hasFlag("ch0_vip_fixed")||(l.get("currentChapter")??0)!==0||Ys("maggie")||document.getElementById("wa-win-notification"))return;const e=document.createElement("div");e.id="wa-win-notification",e.setAttribute("role","alert"),e.setAttribute("aria-live","polite"),e.innerHTML=`
    <div class="win-notif__app">
      <img src="/arg-game-it-company-secret/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
      <span class="win-notif__app-name">WhatUp</span>
      <span class="win-notif__app-sub">主管 - Maggie</span>
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
  `,e.addEventListener("click",t=>{if(!t.target.closest(".win-notif__close")){ra();try{tt("maggie")}catch{}Se("whatsapp")}}),e.querySelector(".win-notif__close")?.addEventListener("click",t=>{t.stopPropagation(),ra()}),document.body.appendChild(e),l.setFlag("ch0_maggie_notified",!0),requestAnimationFrame(()=>e.classList.add("show")),Bn=setTimeout(()=>ra(),1e4)}function ra(){const e=document.getElementById("wa-win-notification");e&&(clearTimeout(Bn),e.classList.remove("show"),e.classList.add("hide"),setTimeout(()=>e.remove(),280))}function Pn(e){e==="jira_viewed"&&l.setFlag("onb_jira_viewed",!0),e==="vscode_viewed"&&l.setFlag("onb_vscode_viewed",!0),l.hasFlag("onboarding_done")||l.setFlag("onboarding_done",!0)}function Qs(){const e=document.getElementById("mailDialog"),t=document.getElementById("mailTitle"),a=document.getElementById("mailTo"),i=document.getElementById("mailSend"),n=document.getElementById("mailTempExit");function s(){if(!t||!a)return;const r=t.value;r==="Report"?a.value="Drug Enforcement Administration <dea@email.us>":(r==="Coperation"||r==="Resign")&&(a.value="Sawyer <sawyer@nori.com>")}t?.addEventListener("change",s),s(),n?.addEventListener("click",()=>{e?.close(),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he})}),i?.addEventListener("click",()=>{const r=t?.value,d=document.getElementById("mailBody")?.value||"",o=document.getElementById("mailTo")?.value||"";try{es({title:r,to:o,body:d})}catch{}let c=null;if(r==="Report"?c="report":r==="Coperation"?c="cooperate":r==="Resign"&&(c="resign"),c){const m=l.get("endings")||[];m.includes(c)||(m.push(c),l.set("endings",m),l.setFlag("ending_"+c,!0));try{yn(c)}catch{}}else try{ne("email_submit_no_ending",{email_title:r,email_body_preview:d.slice(0,80)})}catch{}e?.close(),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he}),c?setTimeout(()=>jn(c),300):U("郵件已寄送: "+r)})}function Xs(){const e=document.getElementById("startMenu");e&&document.addEventListener("click",t=>{const a=t.target.closest&&t.target.closest(".taskbar__start"),i=t.target.closest&&t.target.closest("#startShutdown"),n=t.target.closest&&t.target.closest("#startLogout");if(a){t.stopPropagation();const s=e.style.display==="none"||!e.style.display||e.style.display==="";e.style.display=s?"block":"none";return}if(i){t.stopPropagation(),e.style.display="none",Ka("shutdown");return}if(n){t.stopPropagation(),e.style.display="none",Ka("logout");return}e.contains(t.target)||(e.style.display="none")})}function Ka(e){const t=l.get("endings")||[],a=l.hasFlag("ch4_all_opened"),i=t[0];let n=null;!i&&!a?n="flee":!i&&a?n="fried":i==="report"?n="report":i==="cooperate"?n="cooperate":i==="resign"?n="resign":n="flee";const s=l.get("endings")||[];s.includes(n)||(s.push(n),l.set("endings",s));try{yn(n),ne("shutdown",{action:e,ending:n})}catch{}jn(n)}function jn(e){const t=document.getElementById("endingScreen"),a=document.getElementById("endingTitle"),i=document.getElementById("endingDesc"),n=document.getElementById("endingRestart");if(!t||!a||!i)return;const s={flee:"flee",cooperate:"cooperate",report:"report",resign:"resign",fried:"fried"}[e];s&&ie.play(s);const r={flee:{title:"平凡的日常",desc:`你已完成了工作，登出了電腦，走出辨公室，回到家中安心睡一覺。
第二天回到辨公室，重新開啟電腦，像平常一樣進入辨公模式，但你感覺有點不對勁，昨天看到的一些文件不見了，有部分git history好像有被人改動過的痕跡，你認為你記錯了。
接下來繼續日復日的重複性工作，漸漸對此工作感到沉悶，但也只能接受不變的人生。`},cooperate:{title:"共犯",desc:`你認為老闆是對的。
你向老闆自告奮勇，參與運毒的工作。不到一日，已分潤到可觀的額外收入，你的生活質素大幅上升，不用再為了是否升級麥當當套餐而煩惱，但可能要為隨時被人闖入家中爆頭感到恐懼。
你踏出新的這一步，為生活帶來了多一分選擇，不再是一成不變的勞動人生，你更喜歡這充滿刺激的生活。`},report:{title:"舉報",desc:`你認為老闆是不對的。
你選擇向輯毒處舉報，你把證據從內網下載下來，郵寄至警方。
不一會兒，警方到達辨公室，帶住拘捕令走進老闆辨公室，你看着本來充滿笑容的老闆變得呆滯，在眾多員工的眼前被警方押走。
這件事被傳媒大幅報導，公司也跟著倒閉，市面上出產過的飲品通通下架。
風波後過了幾個禮拜，人們都忘記了，不再是閒餘茶飯時會提及的話題，你也回到了正常生活，找了一份新的工作，又回到日復日的勞動中。`},resign:{title:"辭職",desc:`你發現了公司的秘密。
你知道對於社會倫理和規範來說是不對的，但你選擇遠離，不參與事端，你希望少一事是一事，因此向老闆提出離職，以不適合這份工作為理由矇混過去。
老闆了解這年代的年輕人都很有主見，必定是深思熟慮過後的決定，因此沒強留着你，只是拉着你聊了一會兒。
你對這愉快的工作環境感到不捨，過了幾個月，你找到了新工作，開始淡忘這兩個月的記憶，也不再在意。`},fried:{title:"做對了嗎？",desc:`你發現了公司的秘密。
但你沒有做出任何行動，你默默的關掉電腦，下班回到家裡，打算好好的休息明天再回到辨公室繼續上班。
突然，放在櫃子上的手機震動了一下，收到了公司辭退你的消息。
其實
公司也發現了你。`}},d=r[e]||r.flee;a.textContent=d.title,i.textContent="",n&&(n.style.display="none"),i.style.whiteSpace="pre-wrap",i.style.wordBreak="break-word",setTimeout(()=>{t.style.display="flex",t.style.background="#000";let o=[];const c=d.desc.replace(/br/g,`
`).replace(/\n+/g,`
`).split(/([，。、！？；\n\s]+)/).filter(Boolean);for(const v of c)if(/^[\n\s]+$/.test(v))o.push(v);else if(/^[，。、！？；]+$/.test(v))o.push(v);else for(let h=0;h<v.length;h+=1)o.push(v.slice(h,h+1));let m=0,p="";function u(){if(m>=o.length){n&&(n.style.display="block");return}const v=o[m];p+=v,i.textContent=p,m++;let h=100;(/[，。、！？；]$/.test(v)||v===`
`||v.includes(`
`))&&(h+=200),/^\s+$/.test(v)&&(h=100),e==="fried"&&(v==="其"||v==="實"||p.includes("其實"))&&(h=420),setTimeout(u,h)}u()},500)}function Zs(){document.getElementById("endingRestart")?.addEventListener("click",async()=>{ie.stop(!1);let e=null;try{e=JSON.parse(JSON.stringify(l.get("persistentStats")||{}))}catch{}try{l.reset()}catch{}try{if(e){const a=l.get("persistentStats")||{},i={unlockedEndings:[...new Set([...a.unlockedEndings||[],...e.unlockedEndings||[]])],readArticles:[...new Set([...a.readArticles||[],...e.readArticles||[]])],darkFileCount:Math.max(a.darkFileCount||0,e.darkFileCount||0),whatsappSentCount:Math.max(a.whatsappSentCount||0,e.whatsappSentCount||0),searchHistoryCount:Math.max(a.searchHistoryCount||0,e.searchHistoryCount||0),flags:{...a.flags||{},...e.flags||{}}};l.set("persistentStats",i),l.set("unlockedEndings",i.unlockedEndings)}}catch{}const t=document.getElementById("endingScreen");t&&(t.style.display="none"),document.querySelectorAll("dialog[open]").forEach(a=>{try{a.close()}catch{}a.style.display="none"});try{if("caches"in window){const a=await caches.keys();await Promise.all(a.map(i=>caches.delete(i)))}if("serviceWorker"in navigator){const a=await navigator.serviceWorker.getRegistrations();await Promise.all(a.map(i=>i.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)}),document.getElementById("endingClose")?.addEventListener("click",()=>{document.getElementById("endingScreen").style.display="none"})}function er(){const e=document.getElementById("welcomeDialog");if(!e)return;const t=document.getElementById("welcomeFullscreenBtn"),a=document.getElementById("welcomeMuteBtn"),i=document.getElementById("welcomeVolumeSlider"),n=document.getElementById("welcomeVolumePct"),s=document.getElementById("welcomeStartBtn");lt(t),t?.addEventListener("click",()=>{$n(),lt(t)}),document.addEventListener("fullscreenchange",()=>{lt(t),lt(document.getElementById("settingFullscreenBtn"))}),a&&a.addEventListener("click",()=>{const r=ie.toggleMute();a.textContent=r?"🔇":"🔊",n&&(n.textContent=r?"靜音":Math.round(ie.getVolume()*100)+"%")}),i&&i.addEventListener("input",r=>{const d=parseInt(r.target.value)/100;ie.setVolume(d),ie.setMuted(!1),a&&(a.textContent="🔊"),n&&(n.textContent=Math.round(d*100)+"%")}),s?.addEventListener("click",()=>{e.close()}),typeof e.showModal=="function"?e.showModal():e.show()}function tr(){const e=document.getElementById("settingFullscreenBtn");e&&(lt(e),e.addEventListener("click",()=>{$n(),lt(e)}))}function ar(){const e=document.getElementById("analyticsBanner"),t=document.getElementById("analyticsAccept"),a=document.getElementById("analyticsDecline"),i=document.getElementById("analyticsConsentToggle"),n=document.getElementById("analyticsGasUrl"),s=document.getElementById("analyticsSaveBtn"),r=document.getElementById("analyticsTestBtn"),d=document.getElementById("analyticsFlushBtn"),o=document.getElementById("analyticsStatus"),c=document.getElementById("analyticsQueueCount"),m=document.getElementById("analyticsSessionId");try{e&&!vn()&&(e.style.display="flex")}catch{}const p=()=>{try{const u=JSON.parse(localStorage.getItem("cc_analytics_queue")||"[]");if(c&&(c.textContent=String(u.length)),m&&(m.textContent=la().slice(0,8)),o&&(Te()?Ve()?o.textContent="就緒（所有玩家自動共用此 URL，無需各自輸入）":o.textContent="已設定，等待玩家同意":o.textContent="尚未設定 GAS URL（需部署時設定 VITE_GAS_URL，其他玩家才會自動生效）"),i&&(i.checked=Ve()),n){let v=!1;try{v=!1}catch{}if(Te())if(n.value=Xe(),n.disabled=!1,v){try{localStorage.getItem("cc_gas_url")||(n.title="已由 GitHub Secrets VITE_GAS_URL 注入，所有玩家共用，無需各自輸入")}catch{}n.placeholder="已由部署設定（所有玩家自動共用）"}else n.placeholder="https://script.google.com/macros/s/.../exec";else n.value="",n.disabled=!1,n.placeholder="https://script.google.com/macros/s/.../exec"}}catch{}};p(),t?.addEventListener("click",()=>{Vt(!0),e&&(e.style.display="none"),p(),U("已啟用匿名數據收集"),Ze()}),a?.addEventListener("click",()=>{Vt(!1),e&&(e.style.display="none"),p(),U("已拒絕數據收集")}),i?.addEventListener("change",u=>{Vt(u.target.checked),p(),U(u.target.checked?"已啟用":"已停用")}),s?.addEventListener("click",()=>{const u=n?.value.trim()||"";if(u&&!u.startsWith("https://script.google.com/")){o&&(o.textContent="URL 需為 https://script.google.com/.../exec");return}gn(u),p(),U("已儲存 GAS URL")}),r?.addEventListener("click",async()=>{if(!Te()){U("請先設定 GAS URL"),o&&(o.textContent="未設定：請貼上你部署的 exec URL");return}if(!Ve()){U("請先勾選 同意匿名收集"),o&&(o.textContent="等待同意：請先勾選同意");return}o&&(o.textContent="發送中...");const u=Xe(),v={timestamp:new Date().toISOString(),session_id:la(),event_type:"test_ping",chapter:0,payload_json:JSON.stringify({test:!0,from:"settings_test_btn"})};try{const h=await(await fetch(u,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(v),redirect:"follow",mode:"cors"})).text();let b=null;try{b=JSON.parse(h)}catch{}b&&b.ok?(U("測試成功！Sheets 已新增一列"),o&&(o.textContent="成功：Sheets 已寫入 test_ping")):(U("GAS 回應異常："+h.slice(0,120)),o&&(o.textContent="GAS 回應："+(b?.error||h.slice(0,80))),console.warn("[analytics] test response",h))}catch(h){console.warn("[analytics] test fetch 失敗",h),ne("test_ping",{payload_json:JSON.stringify({test:!0,fallback:!0})}),o&&(o.textContent="網路錯誤，已入隊（查看 Console）"),U("網路錯誤，已入隊重試")}p()}),d?.addEventListener("click",()=>{Ze(),p(),U("已嘗試補送，查看 Console 與 Sheets"),setTimeout(p,800)}),setInterval(p,2e3);try{window.__analyticsRefresh=p}catch{}}function Qa(){Ya(),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he}),ui(),tr();try{as()}catch{}ar(),Js();const e=localStorage.getItem("cc_active_view")||"vscode";Se(l.get("unlockedInterfaces").includes(e)?e:"vscode"),ai(),ie.play("default"),l.hasFlag("onboarding_done")||l.setFlag("onboarding_done",!0),l.hasFlag("welcome_dialog_shown")||(l.setFlag("welcome_dialog_shown",!0),setTimeout(()=>er(),400)),setTimeout(()=>Ks(),800),W.on("puzzle:solved",t=>{U("✓ "+t.title);try{ne("puzzle_solved",{puzzle:t.id,chapter:t.chapter})}catch{}}),W.on("interfaceUnlocked",t=>{U(he("toast.unlocked")+": "+t),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he});try{ne("interface_unlocked",{iface:t})}catch{}}),W.on("evidence",t=>{U(he("toast.evidence")+": "+t.title);try{ne("evidence_collected",{evidence:t.id})}catch{}}),l.on("change",()=>Ya()),window.addEventListener("ch4:complete",()=>{l.setFlag("ch5_triggered",!0),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he}),setTimeout(()=>{const t=document.getElementById("mailDialog");if(t&&!t.open){const a=document.getElementById("mailTitle"),i=document.getElementById("mailTo");if(a&&i){const n=a.value;n==="Report"?i.value="DEA <dea@world.example>":(n==="Coperation"||n==="Resign")&&(i.value="Sawyer <sawyer@nori-drinks.example>")}t.showModal()}},600)}),window.addEventListener("darknet:exit",()=>{ie.play("default"),l.hasFlag("ch4_all_opened")&&!l.hasFlag("ch5_triggered")?(l.setFlag("ch5_triggered",!0),Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he}),setTimeout(()=>{const t=document.getElementById("mailDialog");t&&!t.open&&t.showModal()},400)):l.hasFlag("ch5_triggered")&&((l.get("endings")||[]).length||setTimeout(()=>{const t=document.getElementById("mailDialog");t&&!t.open&&t.showModal()},400))}),l.on("change",t=>{if(t&&t.path&&t.path.includes("ch5_triggered")&&Be({onSwitch:Se,onOpenSettings:We,onOpenNotebook:Ge,t:he}),t&&t.path&&t.path.includes("dark_entered")&&ie.play("darknet"),t&&t.path&&t.path.includes("ch0_vip_fixed")&&!l.hasFlag("ch1_event1_triggered")&&(l.setFlag("ch1_event1_triggered",!0),setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(a=>{a.triggerCh1Event1&&a.triggerCh1Event1()}),void 0)},1e4)),t&&t.path==="currentChapter"&&t.value===2&&!l.hasFlag("ch2_lunch_seq_done")&&setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(a=>{a.triggerCh2LunchSequence&&a.triggerCh2LunchSequence()}),void 0)},600),t&&t.path==="currentChapter")try{ts(t.value),ne("chapter_progress",{chapter:t.value})}catch{}if(t&&t.path&&t.path.includes("ch4_all_opened")&&t.value)try{ne("ch4_all_opened",{chapter:4})}catch{}}),l.hasFlag("ch0_vip_fixed")&&!l.hasFlag("ch1_event1_triggered")&&(l.setFlag("ch1_event1_triggered",!0),setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(t=>{t.triggerCh1Event1&&t.triggerCh1Event1()}),void 0)},1e4)),l.get("currentChapter")===2&&!l.hasFlag("ch2_lunch_seq_done")&&setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(t=>{t.triggerCh2LunchSequence&&t.triggerCh2LunchSequence()}),void 0)},900),W.on("chapter:changed",t=>{t===2&&!l.hasFlag("ch2_lunch_seq_done")&&setTimeout(()=>{$(()=>Promise.resolve().then(()=>ce).then(a=>{a.triggerCh2LunchSequence&&a.triggerCh2LunchSequence()}),void 0)},600)}),window.addEventListener("jira:ticketAdded",()=>{document.getElementById("jiraBoard")&&$(()=>Promise.resolve().then(()=>ht).then(t=>{W.emit("jira:refresh")}),void 0)}),window.addEventListener("jira:refresh",()=>{try{ha()}catch{}}),document.querySelectorAll("dialog").forEach(t=>{t.addEventListener("click",a=>{a.target===t&&t.close()}),t.addEventListener("cancel",a=>{a.preventDefault(),t.close()}),t.addEventListener("close",()=>{t.style.removeProperty("display")})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qa):Qa();

//# sourceMappingURL=main-D3Gw4ePS.js.map