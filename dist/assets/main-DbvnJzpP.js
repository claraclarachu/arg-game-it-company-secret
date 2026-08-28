(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const A="code_conspiracy_state",q="1.0.0",k={version:q,currentChapter:0,unlockedInterfaces:["vscode","jira"],discoveredFiles:[],collectedEvidence:[],whatsappChats:{},jiraTickets:{},searchHistory:[],flags:{},endings:[],settings:{language:"zh-TW",theme:"dark",sound:!0,reducedMotion:!1},playtime:0,lastSaved:null};class V{constructor(){this.state=this.load(),this.listeners=new Map,this.saveDebounce=null,this.playtimeInterval=null,this.startPlaytimeTracking()}load(){try{const e=localStorage.getItem(A);if(e){const n=JSON.parse(e);return this.migrateState(n)}}catch(e){console.warn("Failed to load game state:",e)}return{...k}}migrateState(e){return e.version||(e.version=q),e.settings||(e.settings=k.settings),e.unlockedInterfaces||(e.unlockedInterfaces=["vscode","jira"]),{...k,...e}}save(e=!1){if(e){this._doSave();return}clearTimeout(this.saveDebounce),this.saveDebounce=setTimeout(()=>this._doSave(),500)}_doSave(){this.state.lastSaved=new Date().toISOString();try{localStorage.setItem(A,JSON.stringify(this.state)),this.emit("save",this.state)}catch(e){console.error("Failed to save game state:",e),this.emit("saveError",e)}}get(e){return e?e.split(".").reduce((n,s)=>n==null?void 0:n[s],this.state):this.state}set(e,n){const s=e.split("."),a=s.pop(),i=s.reduce((o,c)=>(o[c]||(o[c]={}),o[c]),this.state);i[a]=n,this.emit("change",{path:e,value:n,state:this.state}),this.save()}update(e,n){const s=this.get(e);this.set(e,n(s))}push(e,n){const s=this.get(e)||[];this.set(e,[...s,n])}remove(e,n){const s=this.get(e)||[];this.set(e,s.filter(a=>!n(a)))}hasFlag(e){return!!this.state.flags[e]}setFlag(e,n=!0){this.set(`flags.${e}`,n)}addEvidence(e){this.state.collectedEvidence.some(s=>s.id===e.id)||(this.push("collectedEvidence",{...e,discoveredAt:new Date().toISOString()}),this.emit("evidence",e))}unlockInterface(e){this.state.unlockedInterfaces.includes(e)||(this.push("unlockedInterfaces",e),this.emit("interfaceUnlocked",e))}discoverFile(e){this.state.discoveredFiles.includes(e)||(this.push("discoveredFiles",e),this.emit("fileDiscovered",e))}startPlaytimeTracking(){this.playtimeInterval=setInterval(()=>{this.state.playtime+=1,this.state.playtime%60===0&&this.save(!0)},1e3)}stopPlaytimeTracking(){clearInterval(this.playtimeInterval),this.save(!0)}exportSave(){return JSON.stringify(this.state,null,2)}importSave(e){try{const n=JSON.parse(e);return this.state=this.migrateState(n),this.save(!0),this.emit("load",this.state),!0}catch(n){return console.error("Failed to import save:",n),!1}}reset(){this.state={...k},this.save(!0),this.emit("reset",this.state)}on(e,n){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(n),()=>this.off(e,n)}off(e,n){var s;(s=this.listeners.get(e))==null||s.delete(n)}emit(e,n){var s;(s=this.listeners.get(e))==null||s.forEach(a=>a(n))}}const r=new V;class W{constructor(){this.events=new Map,this.onceEvents=new Map}on(e,n,s=null){this.events.has(e)||this.events.set(e,new Set);const a=s?n.bind(s):n;return this.events.get(e).add(a),()=>this.off(e,a)}once(e,n,s=null){const a=s?n.bind(s):n,i=(...o)=>{this.off(e,i),a(...o)};return this.onceEvents.has(e)||this.onceEvents.set(e,new Set),this.onceEvents.get(e).add(i),()=>this.off(e,i)}off(e,n){var s,a;(s=this.events.get(e))==null||s.delete(n),(a=this.onceEvents.get(e))==null||a.delete(n)}emit(e,...n){var s,a,i;(s=this.events.get(e))==null||s.forEach(o=>{try{o(...n)}catch(c){console.error(`Error in event handler for "${e}":`,c)}}),(a=this.onceEvents.get(e))==null||a.forEach(o=>{try{o(...n)}catch(c){console.error(`Error in once handler for "${e}":`,c)}}),(i=this.onceEvents.get(e))==null||i.clear()}clear(e){e?(this.events.delete(e),this.onceEvents.delete(e)):(this.events.clear(),this.onceEvents.clear())}}const u=new W,v=new Map;function p(t,e){v.set(t,e)}function x(t){return v.get(t)||null}function X(t="/"){const e=[];for(const[n,s]of v.entries())n.startsWith(t)&&e.push({path:n,...s});return e.sort((n,s)=>n.path.localeCompare(s.path))}function Q(){const t={name:"/",path:"/",children:[],type:"dir"},e=new Map;e.set("/",t);for(const[s]of v.entries()){const a=s.split("/").filter(Boolean);let i="",o=t;for(let c=0;c<a.length;c++){if(i+="/"+a[c],!e.has(i)){const d=c===a.length-1,l={name:a[c],path:i,type:d?"file":"dir",children:d?void 0:[]};if(d){const g=v.get(s);l.ext=s.split(".").pop(),l.meta=g.meta||{}}e.set(i,l),o.children.push(l)}o=e.get(i)}}function n(s){s.children&&(s.children.sort((a,i)=>a.type!==i.type?a.type==="dir"?-1:1:a.name.localeCompare(i.name)),s.children.forEach(n))}return n(t),t}function G(t){const e=x(t);return!e||e.hidden&&!r.hasFlag(`discovered:${t}`)?null:(r.discoverFile(t),u.emit("vfs:read",t),e.content)}function K(t){return v.has(t)}function Y(t){const e=t.toLowerCase(),n=[];for(const[s,a]of v.entries())typeof a.content=="string"&&a.content.toLowerCase().includes(e)&&n.push({path:s,snippet:Z(a.content,e)});return n}function Z(t,e){const n=t.toLowerCase().indexOf(e),s=Math.max(0,n-40),a=Math.min(t.length,n+e.length+40);return t.slice(s,a).replace(/\n/g," ")}function ee(){return r.hasFlag("hidden_portal_accessed")}function te(t){return x("/workspace/src/billing/service.js")&&t&&t.amount===420.69?(r.setFlag("hidden_portal_accessed",!0),r.setFlag("portal_auth_bypassed",!1),u.emit("portal:discovered"),!0):!1}function ne(t){return((t==null?void 0:t["X-Internal-Token"])||(t==null?void 0:t["x-internal-token"]))==="cocoa-beans-2024"?(r.setFlag("portal_auth_bypassed",!0),u.emit("portal:bypassed"),!0):!1}function se(){p("/workspace/package.json",{content:JSON.stringify({name:"acme-billing",version:"3.2.1",scripts:{dev:"vite",test:"jest"}},null,2),meta:{lang:"json"}}),p("/workspace/src/billing/service.js",{content:`// billing/service.js - 計費模組
import { ledger } from './ledger.js';
import { cryptoMixer } from '@shady/crypto-mixer'; // legacy payment helper

/**
 * 計算訂單金額
 * BUG-420: 特定金額 rounding 錯誤待修復  INV-2024-0042
 */
export function calculateAmount(items, opts = {}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const fee = computeFee(subtotal, opts); // <-- 手續費邏輯藏著分潤
  const total = subtotal + fee;
  // TODO: edge case - investigate why QA reports 420.69 redirects?
  if (total === 420.69) {
    // 隱藏的業務邏輯：內部審核入口 (僅內部網路可用)
    return redirectTo('/internal/portal');
  }
  return total;
}

function computeFee(amount, opts) {
  // feeRate 表面是 0.03，實際根據 vendorId 動態調整
  const feeRate = getFeeRate(opts.vendorId);
  return Math.round(amount * feeRate * 100) / 100;
}

function getFeeRate(vendorId) {
  // Legacy mapping - 勿動！聯繫 finance@internal
  const table = { default: 0.03, cocoa: 0.15, bean: 0.22, leaf: 0.12, crystal: 0.30 };
  return table[vendorId] || table.default;
}

function redirectTo(path) {
  // SSR helper - 在瀏覽器會觸發 location 變化
  return { __redirect: path };
}
`,meta:{lang:"javascript"}}),p("/workspace/src/billing/ledger.js",{content:`// ledger.js - 僅內部可見
export const ledger = {
  exportDb: () => '/internal/portal/export?format=sqlite',
  // 驗證標頭: X-Internal-Token: cocoa-beans-2024
};
`,meta:{lang:"javascript"}}),p("/workspace/.env.example",{content:`DATABASE_URL=postgres://dev:dev@localhost/acme
INTERNAL_PORTAL_TOKEN=cocoa-beans-2024
# 請勿提交真實 token！
`,meta:{lang:"properties"}}),p("/workspace/src/middleware/auth.js",{content:`// middleware/auth.js
export function portalAuth(req) {
  const token = req.headers['X-Internal-Token'];
  if (token !== process.env.INTERNAL_PORTAL_TOKEN) {
    return { status: 403, body: 'Forbidden' };
  }
  // Referrer 必須來自計費頁
  if (!req.headers.referer?.includes('/billing')) {
    return { status: 403, body: 'Bad referer' };
  }
  return { status: 200 };
}
`,meta:{lang:"javascript"}}),p("/workspace/README.md",{content:`# Acme Billing Service

> 原材料採購系統: /internal/portal (內部專用)

## 開發

npm install
npm run dev
`,meta:{lang:"markdown"}}),p("/workspace/scripts/reconcile.py",{content:`# reconcile.py - 對帳腳本 (Python)
import sqlite3

def reconcile(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT code, SUM(amount) FROM orders GROUP BY code")
    for code, total in cur.fetchall():
        print(f"{code}: {total}")

if __name__ == '__main__':
    reconcile('ledger.db')
`,meta:{lang:"python"}}),p("/workspace/src/main/java/com/acme/OrderService.java",{content:`package com.acme;
public class OrderService {
    // Java: 訂單分潤邏輯與 JS 保持一致
    public double feeRate(String vendorId) {
        return switch(vendorId) {
            case "cocoa" -> 0.15;
            case "bean" -> 0.22;
            case "leaf" -> 0.12;
            case "crystal" -> 0.30;
            default -> 0.03;
        };
    }
}
`,meta:{lang:"java"}}),p("/internal/portal",{hidden:!1,content:`## INTERNAL PORTAL - 原材料採購系統

狀態：需 X-Internal-Token

庫存:
- COCOA: 420 units
- BEAN: 118 units
- LEAF: 300 units
- CRYSTAL: 75 units

匯出: /internal/portal/export

備註： cocoa bean shipment delay - 供應商延遲 (實際指 COCOA 到貨延遲)`,meta:{portal:!0}}),p("/internal/portal/export",{hidden:!1,content:"SQLite export endpoint - 需要 portalAuth 通過",meta:{portal:!0}})}se();const h={registerFile:p,getFile:x,listFiles:X,buildTree:Q,readFile:G,exists:K,searchContent:Y,canAccessPortal:ee,tryAccessPortal:te,bypassPortalAuth:ne},ae=[{id:"ch0_complete_onboarding",chapter:0,check:()=>r.hasFlag("onboarding_done"),reward:{unlock:["search"]},title:"完成新手引導"},{id:"ch1_trigger_hidden_route",chapter:1,check:()=>r.hasFlag("hidden_portal_accessed"),reward:{evidence:{id:"e001",title:"隱藏入口",chapter:1,type:"portal"},unlock:["whatsapp"]},title:"觸發隱藏路由 420.69"},{id:"ch2_bypass_portal_auth",chapter:2,check:()=>r.hasFlag("portal_auth_bypassed"),reward:{evidence:{id:"e002",title:"內部庫存",chapter:2,type:"inventory"}},title:"繞過 Portal 驗證"},{id:"ch2_find_code_map",chapter:2,check:()=>r.hasFlag("found_code_map"),reward:{evidence:{id:"e003",title:"代號對照表",chapter:2,type:"mapping"}},title:"發現代號對照表"}];function f(){var n,s;for(const a of ae)r.hasFlag(`puzzle:${a.id}`)||a.check()&&(r.setFlag(`puzzle:${a.id}`,!0),(n=a.reward)!=null&&n.evidence&&r.addEvidence(a.reward.evidence),(s=a.reward)!=null&&s.unlock&&a.reward.unlock.forEach(i=>r.unlockInterface(i)),u.emit("puzzle:solved",a));const t=["onboarding_done","hidden_portal_accessed","portal_auth_bypassed","ledger_exported"];let e=0;for(const a of t)if(r.hasFlag(a))e++;else break;e!==r.get("currentChapter")&&(r.set("currentChapter",e),u.emit("chapter:changed",e))}function ie(){u.on("change",f),u.on("vfs:read",f),u.on("portal:discovered",f),u.on("portal:bypassed",f),setInterval(f,1e3),f()}const B={"zh-TW":{"app.title":"Code & Conspiracy","app.subtitle":"編程人生模擬 · 離線 ARG","dock.vscode":"VS Code","dock.jira":"Jira","dock.whatsapp":"WhatsApp","dock.search":"Search","dock.notebook":"筆記本","dock.settings":"設定","settings.theme":"主題","settings.language":"語言","settings.export":"匯出存檔","settings.import":"匯入存檔","settings.reset":"重置進度","toast.saved":"已儲存","toast.evidence":"發現新證據","toast.unlocked":"解鎖新介面"},en:{"app.title":"Code & Conspiracy","app.subtitle":"Dev Life Sim · Offline ARG","dock.vscode":"VS Code","dock.jira":"Jira","dock.whatsapp":"WhatsApp","dock.search":"Search","dock.notebook":"Notebook","dock.settings":"Settings","settings.theme":"Theme","settings.language":"Language","settings.export":"Export Save","settings.import":"Import Save","settings.reset":"Reset Progress","toast.saved":"Saved","toast.evidence":"New evidence","toast.unlocked":"Interface unlocked"}};function y(t){var n;const e=r.get("settings.language")||"zh-TW";return((n=B[e])==null?void 0:n[t])??B["zh-TW"][t]??t}function oe(t){r.set("settings.language",t)}function C({onSwitch:t,onOpenSettings:e,onOpenNotebook:n,t:s}){var c,d;const a=document.getElementById("dock");if(!a)return;function i(l){return r.get("unlockedInterfaces").includes(l)}function o(l,g,J){const U=!i(l);return`<button class="dock__btn" data-view="${l}" ${U?'disabled title="尚未解鎖"':""}>
      <span aria-hidden="true">${g}</span><span>${J}</span>
    </button>`}a.innerHTML=[o("vscode","⌨️",s("dock.vscode")),o("jira","📋",s("dock.jira")),o("whatsapp","💬",s("dock.whatsapp")),o("search","🔍",s("dock.search")),'<div class="dock__sep"></div>',`<button class="dock__btn" data-action="notebook">📒<span>${s("dock.notebook")}</span></button>`,`<button class="dock__btn" data-action="settings">⚙️<span>${s("dock.settings")}</span></button>`].join(""),a.querySelectorAll("[data-view]").forEach(l=>{l.addEventListener("click",()=>t(l.dataset.view))}),(c=a.querySelector('[data-action="settings"]'))==null||c.addEventListener("click",e),(d=a.querySelector('[data-action="notebook"]'))==null||d.addEventListener("click",n)}function re(t){document.querySelectorAll(".dock__btn[data-view]").forEach(e=>{e.classList.toggle("active",e.dataset.view===t)}),document.querySelectorAll(".view").forEach(e=>{e.classList.toggle("active",e.id===`view-${t}`)})}function b(t,e={}){const n=document.getElementById("toasts");if(!n)return;const s=document.createElement("div");s.className="toast",s.textContent=t,e.variant==="error"&&(s.style.background="#7a1f1f"),n.appendChild(s),setTimeout(()=>{s.style.opacity="0",s.style.transform="translateY(4px)",s.style.transition="all .25s",setTimeout(()=>s.remove(),260)},e.duration||2200)}function ce(t,e){const n=new Blob([e],{type:"application/json;charset=utf-8"}),s=URL.createObjectURL(n),a=document.createElement("a");a.href=s,a.download=t,a.click(),URL.revokeObjectURL(s)}function le(t){return new Promise((e,n)=>{const s=new FileReader;s.onload=()=>e(s.result),s.onerror=n,s.readAsText(t)})}function $(){var e;const t=document.getElementById("settingsDialog");t&&((e=t.showModal)!=null&&e.call(t)||(t.style.display="block"),de())}function de(){const t=document.getElementById("settingTheme"),e=document.getElementById("settingLang");t&&(t.value=r.get("settings.theme")),e&&(e.value=r.get("settings.language"));const n=document.getElementById("settingPlaytime");n&&(n.textContent=String(r.get("playtime"))+"s")}function ue(){var t,e,n,s,a,i;(t=document.getElementById("settingTheme"))==null||t.addEventListener("change",o=>{const c=o.target.value;r.set("settings.theme",c),document.documentElement.setAttribute("data-theme",c),b(y("toast.saved"))}),(e=document.getElementById("settingLang"))==null||e.addEventListener("change",o=>{oe(o.target.value),location.reload()}),(n=document.getElementById("btnExport"))==null||n.addEventListener("click",()=>{ce("code-conspiracy-save.json",r.exportSave())}),(s=document.getElementById("btnImport"))==null||s.addEventListener("change",async o=>{var g;const c=(g=o.target.files)==null?void 0:g[0];if(!c)return;const d=await le(c),l=r.importSave(d);b(l?y("toast.saved"):"Import failed",{variant:l?void 0:"error"}),l&&location.reload()}),(a=document.getElementById("btnReset"))==null||a.addEventListener("click",()=>{confirm("Reset all progress?")&&(r.reset(),location.reload())}),(i=document.getElementById("settingsDialog"))==null||i.addEventListener("close",()=>{})}function F(){var e;const t=document.getElementById("notebookDialog");t&&(pe(),(e=t.showModal)!=null&&e.call(t)||(t.style.display="block"))}function pe(){const t=document.getElementById("notebookContent");if(!t)return;const e=r.get("collectedEvidence")||[],n=r.get("flags")||{};t.innerHTML=`
    <div class="card">
      <h3 style="margin:0 0 8px">證據 (${e.length})</h3>
      ${e.length?e.map(s=>`<div style="padding:6px 0;border-bottom:1px solid var(--border)"><b>${s.title}</b> <span class="small muted">#${s.id} · ch${s.chapter}</span></div>`).join(""):'<div class="muted small">尚未發現證據。</div>'}
    </div>
    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">Flags</h3>
      <pre class="mono small" style="white-space:pre-wrap">${Object.keys(n).length?JSON.stringify(n,null,2):"—"}</pre>
    </div>
  `}function O(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}let m="/workspace/src/billing/service.js";function me(){const t=document.getElementById("view-vscode");t&&(t.innerHTML=`
    <div class="vscode">
      <div class="vscode__side">
        <div style="padding:8px 10px;border-bottom:1px solid var(--border);display:flex;gap:6px;align-items:center">
          <input id="vsQuickOpen" class="input" placeholder="搜尋檔案 (Cmd+P) / 全域搜尋 (Cmd+Shift+F)" />
        </div>
        <div id="vsTree" class="tree"></div>
        <div style="padding:8px;border-top:1px solid var(--border)">
          <div class="small muted">提示：追蹤 billing/service.js 的 420.69 分支</div>
          <div style="display:flex;gap:6px;margin-top:6px">
            <input id="vsTriggerAmount" class="input" placeholder="輸入 total 金額測試 (如 420.69)" />
            <button id="vsTriggerBtn" class="btn primary">觸發</button>
          </div>
          <div id="vsTriggerResult" class="small" style="margin-top:6px"></div>
        </div>
      </div>
      <div class="vscode__main">
        <div id="vsTabs" class="vscode__tabs"></div>
        <div id="vsEditor" class="editor"><pre class="mono"></pre></div>
        <div class="terminal" id="vsTerminal"></div>
      </div>
    </div>
  `,T(),M(),L(m),ve(),he())}function ve(){var t,e;(t=document.getElementById("vsQuickOpen"))==null||t.addEventListener("input",n=>{const s=n.target.value.trim().toLowerCase();T(s)}),(e=document.getElementById("vsTriggerBtn"))==null||e.addEventListener("click",()=>{const n=parseFloat(document.getElementById("vsTriggerAmount").value),s=h.tryAccessPortal({amount:n}),a=document.getElementById("vsTriggerResult");s?(a.textContent="→ 已觸發隱藏路由 /internal/portal (查看 Search / Portal 頁)",r.setFlag("found_code_map",!0)):a.textContent="未觸發，嘗試 420.69"})}function T(t=""){const e=document.getElementById("vsTree");if(!e)return;const n=h.buildTree();function s(i,o=0){if(i.type==="dir"){const c=i.children.filter(d=>!t||d.path.toLowerCase().includes(t)||a(d,t));return t&&c.length===0?"":`<div class="tree__node" style="padding-left:${8+o*8}px" data-path="${i.path}">📁 ${O(i.name)}</div>
        <div class="tree__children">${c.map(d=>s(d,o+1)).join("")}</div>`}else return t&&!i.path.toLowerCase().includes(t)?"":`<div class="tree__node ${i.path===m?"active":""}" data-path="${i.path}" data-file="1">📄 ${O(i.name)}</div>`}function a(i,o){return i.path.toLowerCase().includes(o)?!0:i.children?i.children.some(c=>a(c,o)):!1}e.innerHTML=n.children.map(i=>s(i,0)).join(""),e.querySelectorAll('[data-file="1"]').forEach(i=>{i.addEventListener("click",()=>L(i.dataset.path))})}function M(){const t=document.getElementById("vsTabs");if(!t)return;const e=h.listFiles("/workspace").slice(0,8);if(!e.some(n=>n.path===m)){const n=h.getFile(m);n&&e.unshift({path:m,...n})}t.innerHTML=e.map(n=>`<div class="vscode__tab ${n.path===m?"active":""}" data-path="${n.path}">${n.path.split("/").pop()}</div>`).join(""),t.querySelectorAll(".vscode__tab").forEach(n=>n.addEventListener("click",()=>L(n.dataset.path)))}function L(t){var s;m=t;const e=h.readFile(t),n=document.querySelector("#vsEditor pre");n&&(e==null?n.textContent="檔案不存在或尚未解鎖":n.textContent=e),T(((s=document.getElementById("vsQuickOpen"))==null?void 0:s.value.trim().toLowerCase())||""),M(),I(`$ open ${t}`)}function he(){I('tip: 在 editor 搜尋 "redirectTo" 找到隱藏分支'),I("tip: 在 .env.example 找到 INTERNAL_PORTAL_TOKEN")}function I(t){const e=document.getElementById("vsTerminal");if(!e)return;const n=document.createElement("div");n.className="terminal__line",n.textContent=t,e.appendChild(n),e.scrollTop=e.scrollHeight}const P=[{key:"INV-2024-0042",title:"修復計費模組邊緣案例 — 特定金額計算錯誤",status:"To Do",assignee:"你",desc:`復現步驟: 使用特定總金額觸發計費流程，觀察是否重新導向到內部頁。

關聯檔案: src/billing/service.js#calculateAmount
評論: @qa-lee "這個 420.69 的數好像會跳到一個內部 portal，之前 finance 說別碰"`,comments:["qa-lee: 別動 portal，那邊有 legacy code","pm: 按時修復，其他不用管"]},{key:"INV-2024-0039",title:"Payment Gateway Integration v3",status:"In Progress",assignee:"finance-bot",desc:"接入新的支付網關，注意 feeRate 配置來自 vendorId 映射 (cocoa/bean/leaf/crystal)。",comments:[]},{key:"INV-2024-0011",title:"原材料採購系統 — 庫存盤點",status:"Done",assignee:"ops",desc:"採購系統位於 /internal/portal，需 X-Internal-Token。庫存代號已同步。",comments:[]}];function ge(){var e;const t=document.getElementById("view-jira");t&&(t.innerHTML=`
    <div class="jira">
      <div style="display:flex;gap:8px;align-items:center">
        <h2 style="margin:0">Jira · Acme Board</h2>
        <span class="badge">Sprint 24</span>
        <input id="jiraSearch" class="input" placeholder="搜尋 ticket (JQL: text ~ '420')" style="max-width:320px;margin-left:auto" />
      </div>
      <div id="jiraBoard" class="jira__board"></div>
      <div id="jiraDetail" class="card" style="display:none"></div>
    </div>
  `,j(),(e=document.getElementById("jiraSearch"))==null||e.addEventListener("input",n=>j(n.target.value)))}function j(t=""){const e=document.getElementById("jiraBoard");if(!e)return;const n=t.toLowerCase(),s=P.filter(i=>!n||i.key.toLowerCase().includes(n)||i.title.toLowerCase().includes(n)||i.desc.toLowerCase().includes(n)),a={"To Do":[],"In Progress":[],Done:[]};s.forEach(i=>{var o;return(o=a[i.status])==null?void 0:o.push(i)}),e.innerHTML=Object.entries(a).map(([i,o])=>`
    <div class="jira__col"><h3>${i}</h3>
      ${o.map(c=>`<div class="ticket" data-key="${c.key}"><div class="ticket__key">${c.key}</div><div class="ticket__title">${c.title}</div><div class="ticket__meta">${c.assignee}</div></div>`).join("")||'<div class="muted small">—</div>'}
    </div>
  `).join(""),e.querySelectorAll(".ticket").forEach(i=>i.addEventListener("click",()=>fe(i.dataset.key)))}function fe(t){const e=P.find(s=>s.key===t),n=document.getElementById("jiraDetail");!e||!n||(r.set("jiraTickets."+t,!0),n.style.display="block",n.innerHTML=`<h3 style="margin:0">${e.key} · ${e.title}</h3>
    <div class="small muted" style="margin:6px 0">Status: ${e.status} · Assignee: ${e.assignee}</div>
    <pre class="mono" style="white-space:pre-wrap;background:var(--bg-primary);padding:10px;border-radius:6px;border:1px solid var(--border)">${e.desc}</pre>
    <div style="margin-top:8px">${e.comments.map(s=>`<div class="small" style="padding:4px 0;border-bottom:1px solid var(--border)">💬 ${s}</div>`).join("")}</div>
    <div style="margin-top:8px"><button class="btn" onclick="document.getElementById('jiraDetail').style.display='none'">關閉</button></div>`)}const D=[{id:"backend-team",name:"Backend Team (群組)",preview:"cocoa bean shipment delay - 供應商延遲",locked:!0,messages:[{from:"pm",text:"cocoa bean shipment delay，這批貨下週到，別在 Jira 提了"},{from:"ops",text:"上次 bean 的 118 單位還在倉庫，leaf 新貨到了"},{from:"you",text:"收到"}]},{id:"qa-lee",name:"QA Lee",preview:"別動 payment 模組，那邊有 legacy code",locked:!1,messages:[{from:"qa-lee",text:"別動 payment 模組，那邊有 legacy code，finance 會找你"},{from:"you",text:"知道了，420.69 那個分支是幹嘛的？"},{from:"qa-lee",text:"內部審核用的 portal，需要 token，你在 .env.example 找"}]},{id:"supplier",name:"Supplier (未知)",preview:"新批次 crystal 已發出",locked:!0,messages:[{from:"supplier",text:"新批次 crystal 已發出，追蹤號可查"}]}];let E="qa-lee";function ye(){const t=document.getElementById("view-whatsapp");t&&(t.innerHTML='<div class="wa"><div class="wa__list" id="waList"></div><div class="wa__chat" id="waChat"></div></div>',H(),z(E))}function S(t){return t==="qa-lee"?!0:r.hasFlag("hidden_portal_accessed")}function H(){const t=document.getElementById("waList");t&&(t.innerHTML=D.map(e=>{const n=!S(e.id);return`<div class="wa__item ${e.id===E?"active":""}" data-id="${e.id}" style="${n?"opacity:.5":""}">
      <div class="wa__name">${e.name} ${n?"🔒":""}</div>
      <div class="wa__preview">${n?"需要先觸發隱藏入口後解鎖":e.preview}</div>
    </div>`}).join(""),t.querySelectorAll(".wa__item").forEach(e=>e.addEventListener("click",()=>{S(e.dataset.id)&&(E=e.dataset.id,H(),z(E))})))}function z(t){const e=D.find(s=>s.id===t),n=document.getElementById("waChat");if(!(!e||!n)){if(!S(t)){n.innerHTML='<div class="view__placeholder"><h2>🔒 未解鎖</h2><div class="muted">先去 VS Code 觸發 420.69 隱藏路由</div></div>';return}n.innerHTML=`<div style="padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700">${e.name}</div>
    <div class="wa__messages" id="waMessages">${e.messages.map(s=>`<div class="bubble ${s.from==="you"?"me":"other"}">${s.text}</div>`).join("")}</div>`}}const be=[{title:"Cocoa bean import license — Acme Docs",url:"https://acme.internal/docs/cocoa-license",snippet:'無相關進口許可記錄。搜尋代號 cocoa 對應 "可可豆" 但實際無海關記錄。'},{title:"Cocoa — Chemical codes",url:"https://chem.example/search?q=cocoa",snippet:"代號 cocoa / bean / leaf / crystal 在內部庫存表中出現，疑似毒品代號。"},{title:"快遞追蹤 — 範例單號",url:"https://track.example/118-bean",snippet:"物流資訊可在搜尋引擎透過單號反查 (後續章節)。"}];function ke(){var e,n,s;const t=document.getElementById("view-search");t&&(t.innerHTML=`
    <div class="search">
      <h2 style="margin:0 0 8px">Search</h2>
      <div class="search__bar">
        <input id="searchInput" class="input" placeholder="輸入關鍵詞，如 cocoa / bean / 420.69 / X-Internal-Token" />
        <button id="searchBtn" class="btn primary">搜尋</button>
      </div>
      <div class="search__suggest">
        <span class="chip" data-q="cocoa">cocoa</span>
        <span class="chip" data-q="cocoa bean import license">cocoa bean import license</span>
        <span class="chip" data-q="site:acme.internal">site:acme.internal</span>
      </div>
      <div id="searchResults"></div>
      <div class="card" style="margin-top:12px">
        <b>Portal 快捷存取</b>
        <div class="small muted" style="margin:6px 0">已觸發隱藏路由後，在此輸入 portal 所需 header 存取內部庫存：</div>
        <div style="display:flex;gap:6px">
          <input id="portalToken" class="input" placeholder="X-Internal-Token (提示: .env.example)" value="cocoa-beans-2024" />
          <button id="portalBypassBtn" class="btn">存取 /internal/portal</button>
        </div>
        <div id="portalResult" class="small" style="margin-top:8px"></div>
      </div>
    </div>
  `,t.querySelectorAll(".chip").forEach(a=>a.addEventListener("click",()=>_(a.dataset.q))),(e=document.getElementById("searchBtn"))==null||e.addEventListener("click",()=>_(document.getElementById("searchInput").value)),(n=document.getElementById("searchInput"))==null||n.addEventListener("keydown",a=>{a.key==="Enter"&&_(a.target.value)}),(s=document.getElementById("portalBypassBtn"))==null||s.addEventListener("click",()=>{const a=document.getElementById("portalToken").value.trim(),i=h.bypassPortalAuth({"X-Internal-Token":a}),o=document.getElementById("portalResult");i?(r.setFlag("found_code_map",!0),o.innerHTML='<span style="color:var(--success)">✓ 已繞過驗證</span><div class="small muted">庫存: COCOA 420 · BEAN 118 · LEAF 300 · CRYSTAL 75<br/>代號: COCOA=可卡因 BEAN=海洛因 LEAF=大麻 CRYSTAL=冰毒<br/>匯出: /internal/portal/export</div>'):o.textContent="403 Forbidden — token 錯誤"}),_("cocoa"))}function _(t){const e=document.getElementById("searchInput");e&&t&&(e.value=t);const n=(t||"").trim();if(!n)return;r.push("searchHistory",{q:n,at:new Date().toISOString()});const s=[];for(const o of be)n.toLowerCase().split(/\s+/).some(c=>o.title.toLowerCase().includes(c)||o.snippet.toLowerCase().includes(c))&&s.push(o);const a=h.searchContent(n);for(const o of a)s.push({title:o.path,url:o.path,snippet:o.snippet});const i=document.getElementById("searchResults");i&&(i.innerHTML=s.length?s.map(o=>`<div class="result"><div class="result__title">${o.title}</div><div class="result__url">${o.url}</div><div class="result__snippet">${o.snippet}</div></div>`).join(""):'<div class="muted small" style="margin-top:12px">無結果 — 嘗試 "cocoa" 或檔案路徑</div>')}function R(){const t=r.get("settings.theme")||"dark";document.documentElement.setAttribute("data-theme",t)}function w(t){if(!r.get("unlockedInterfaces").includes(t)){b("🔒 未解鎖: "+t);return}re(t),localStorage.setItem("cc_active_view",t)}function _e(){document.getElementById("clock")&&setInterval(()=>{const t=document.getElementById("clock");t&&(t.textContent=new Date().toLocaleTimeString())},1e3)}function Ee(){me(),ge(),ye(),ke()}function N(){R(),C({onSwitch:w,onOpenSettings:$,onOpenNotebook:F,t:y}),ue(),_e(),Ee();const t=localStorage.getItem("cc_active_view")||"vscode";w(r.get("unlockedInterfaces").includes(t)?t:"vscode"),ie(),r.hasFlag("onboarding_done")||setTimeout(()=>{r.setFlag("onboarding_done",!0)},800),u.on("puzzle:solved",e=>{b(`✓ ${e.title}`)}),u.on("interfaceUnlocked",e=>{b(`${y("toast.unlocked")}: ${e}`),C({onSwitch:w,onOpenSettings:$,onOpenNotebook:F,t:y})}),u.on("evidence",e=>{b(`${y("toast.evidence")}: ${e.title}`)}),r.on("change",()=>R()),document.querySelectorAll("dialog").forEach(e=>{e.addEventListener("click",n=>{n.target===e&&e.close()})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",N):N();
//# sourceMappingURL=main-DbvnJzpP.js.map
