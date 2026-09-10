var Qt=Object.defineProperty,Vt=(e,t)=>{let a={};for(var n in e)Qt(a,n,{get:e[n],enumerable:!0});return t||Qt(a,Symbol.toStringTag,{value:"Module"}),a};(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();var Xt="code_conspiracy_state",ya="1.0.0",$e={version:ya,currentChapter:0,unlockedInterfaces:["vscode","jira","whatsapp","search"],discoveredFiles:[],collectedEvidence:[],whatsappChats:{},jiraTickets:{},searchHistory:[],flags:{},endings:[],settings:{language:"zh-TW",theme:"dark",sound:!0,reducedMotion:!1,bgmVolume:.25,bgmMuted:!1},playtime:0,lastSaved:null},Wa=class{constructor(){this.state=this.load(),this.listeners=new Map,this.saveDebounce=null,this.playtimeInterval=null,this.startPlaytimeTracking()}load(){try{const e=localStorage.getItem(Xt);if(e){const t=JSON.parse(e);return this.migrateState(t)}}catch(e){console.warn("Failed to load game state:",e)}return JSON.parse(JSON.stringify($e))}migrateState(e){if(e.version||(e.version=ya),e.settings||(e.settings=$e.settings),!e.unlockedInterfaces)e.unlockedInterfaces=[...$e.unlockedInterfaces];else for(const t of $e.unlockedInterfaces)e.unlockedInterfaces.includes(t)||e.unlockedInterfaces.push(t);return{...$e,...e,unlockedInterfaces:e.unlockedInterfaces}}save(e=!1){if(e){this._doSave();return}clearTimeout(this.saveDebounce),this.saveDebounce=setTimeout(()=>this._doSave(),500)}_doSave(){this.state.lastSaved=new Date().toISOString();try{localStorage.setItem(Xt,JSON.stringify(this.state)),this.emit("save",this.state)}catch(e){console.error("Failed to save game state:",e),this.emit("saveError",e)}}get(e){return e?e.split(".").reduce((t,a)=>t?.[a],this.state):this.state}set(e,t){const a=e.split("."),n=a.pop(),i=a.reduce((s,r)=>(s[r]||(s[r]={}),s[r]),this.state);i[n]=t,this.emit("change",{path:e,value:t,state:this.state}),this.save()}update(e,t){const a=this.get(e);this.set(e,t(a))}push(e,t){const a=this.get(e)||[];this.set(e,[...a,t])}remove(e,t){const a=this.get(e)||[];this.set(e,a.filter(n=>!t(n)))}hasFlag(e){return!!this.state.flags[e]}setFlag(e,t=!0){this.set(`flags.${e}`,t)}addEvidence(e){this.state.collectedEvidence.some(t=>t.id===e.id)||(this.push("collectedEvidence",{...e,discoveredAt:new Date().toISOString()}),this.emit("evidence",e))}unlockInterface(e){this.state.unlockedInterfaces.includes(e)||(this.push("unlockedInterfaces",e),this.emit("interfaceUnlocked",e))}discoverFile(e){this.state.discoveredFiles.includes(e)||(this.push("discoveredFiles",e),this.emit("fileDiscovered",e))}startPlaytimeTracking(){this.playtimeInterval=setInterval(()=>{this.state.playtime+=1,this.state.playtime%60===0&&this.save(!0)},1e3)}stopPlaytimeTracking(){clearInterval(this.playtimeInterval),this.save(!0)}exportSave(){return JSON.stringify(this.state,null,2)}importSave(e){try{const t=JSON.parse(e);return this.state=this.migrateState(t),this.save(!0),this.emit("load",this.state),!0}catch(t){return console.error("Failed to import save:",t),!1}}reset(){try{clearTimeout(this.saveDebounce)}catch{}try{clearInterval(this.playtimeInterval)}catch{}this.state=JSON.parse(JSON.stringify($e)),this.state.unlockedInterfaces=[...$e.unlockedInterfaces],this.state.flags={},this.state.collectedEvidence=[],this.state.discoveredFiles=[],this.state.endings=[],this.state.searchHistory=[],this.state.jiraTickets={},this.state.whatsappChats={},this.state.playtime=0,this.save(!0),this.emit("reset",this.state),this.startPlaytimeTracking()}on(e,t){return this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t),()=>this.off(e,t)}off(e,t){this.listeners.get(e)?.delete(t)}emit(e,t){this.listeners.get(e)?.forEach(a=>a(t))}},p=new Wa,Ua=class{constructor(){this.events=new Map,this.onceEvents=new Map}on(e,t,a=null){this.events.has(e)||this.events.set(e,new Set);const n=a?t.bind(a):t;return this.events.get(e).add(n),()=>this.off(e,n)}once(e,t,a=null){const n=a?t.bind(a):t,i=(...s)=>{this.off(e,i),n(...s)};return this.onceEvents.has(e)||this.onceEvents.set(e,new Set),this.onceEvents.get(e).add(i),()=>this.off(e,i)}off(e,t){this.events.get(e)?.delete(t),this.onceEvents.get(e)?.delete(t)}emit(e,...t){this.events.get(e)?.forEach(a=>{try{a(...t)}catch(n){console.error(`Error in event handler for "${e}":`,n)}}),this.onceEvents.get(e)?.forEach(a=>{try{a(...t)}catch(n){console.error(`Error in once handler for "${e}":`,n)}}),this.onceEvents.get(e)?.clear()}clear(e){e?(this.events.delete(e),this.onceEvents.delete(e)):(this.events.clear(),this.onceEvents.clear())}},U=new Ua,Pe=new Map,Ze=new Map,kt=new Map,ba="https://nori-intranet/internal/portal?";function _a(e,t){kt.set(e,t)}function Ga(e){return kt.get(e)||null}function Ya(){return Array.from(kt.entries()).map(([e,t])=>({key:e,...t}))}function Ka(e){for(const[t,a]of kt.entries())if(e(a,t))return{key:t,...a};return null}_a("nori-portal-2023",{domain:ba,historical:!0,description:"Nori 內網舊版 portal 路由（2023 前由 generateSecretPath 動態產生）",generateSecretPath:"function generateSecretPath(domain){ const cid = redis.get('companyId'); const y = redis.get('year'); const k='70BTa3A1a13ad4212GHdybJmn'; return domain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); }",key:"70BTa3A1a13ad4212GHdybJmn",companyIdSource:"redis.get('companyId')",yearSource:"redis.get('year')",_hash:"f665a7117959b667b7f283eaebf69cae",_fullUrl:"https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae"});function Z(e,t){Ze.set(e,t)}function wa(e){return Ze.get(e)||null}function Ja(e="/"){const t=[];for(const[a,n]of Ze.entries())a.startsWith(e)&&t.push({path:a,...n});return t.sort((a,n)=>a.path.localeCompare(n.path))}function Qa(){const e={name:"/",path:"/",children:[],type:"dir"},t=new Map;t.set("/",e);for(const[n]of Ze.entries()){const i=n.split("/").filter(Boolean);let s="",r=e;for(let l=0;l<i.length;l++){s+="/"+i[l];const o=l===i.length-1;if(t.has(s)){const c=t.get(s);!o&&c.type==="file"&&(c.type="dir",c.children=c.children||[])}else{const c={name:i[l],path:s,type:o?"file":"dir",children:o?void 0:[]};if(o){const u=Ze.get(n);c.ext=n.split(".").pop(),c.meta=u.meta||{}}t.set(s,c),r.children||(r.children=[]),r.children.push(c)}r=t.get(s)}}function a(n){n.children&&(n.children.sort((i,s)=>i.type!==s.type?i.type==="dir"?-1:1:i.name.localeCompare(s.name)),n.children.forEach(a))}return a(e),e}function Xa(e){const t=wa(e);return t?t.content:null}function w(e,t){Pe.set(e,t)}function xa(e){return Pe.get(e)||null}function Za(e="/"){const t=[];for(const[a,n]of Pe.entries())a.startsWith(e)&&t.push({path:a,...n});return t.sort((a,n)=>a.path.localeCompare(n.path))}function en(){const e={name:"/",path:"/",children:[],type:"dir"},t=new Map;t.set("/",e);for(const[n]of Pe.entries()){const i=n.split("/").filter(Boolean);let s="",r=e;for(let l=0;l<i.length;l++){s+="/"+i[l];const o=l===i.length-1;if(t.has(s)){const c=t.get(s);!o&&c.type==="file"&&(c.type="dir",c.children=c.children||[])}else{const c={name:i[l],path:s,type:o?"file":"dir",children:o?void 0:[]};if(o){const u=Pe.get(n);c.ext=n.split(".").pop(),c.meta=u.meta||{}}t.set(s,c),r.children||(r.children=[]),r.children.push(c)}r=t.get(s)}}function a(n){n.children&&(n.children.sort((i,s)=>i.type!==s.type?i.type==="dir"?-1:1:i.name.localeCompare(s.name)),n.children.forEach(a))}return a(e),e}function tn(e){const t=xa(e);return!t||t.hidden&&!p.hasFlag(`discovered:${e}`)?null:(p.discoverFile(e),e==="/customer-portal/src/payment/mixer.js"&&p.setFlag("found_crypto_mixer",!0),e==="/customer-portal/src/payment/gateway.js"&&p.setFlag("found_fee_mapping",!0),e==="/customer-portal/src/payment/cryptoConfig.json"&&p.setFlag("found_mixer_config",!0),e==="/customer-portal/ledger.db"&&p.setFlag("ledger_exported",!0),e==="/customer-portal/docs/arch.pdf"&&p.setFlag("sql_injected",!0),e==="/customer-portal/data/ledger_export.csv"&&p.setFlag("found_coordinates",!0),e==="/customer-portal/src/main/resources/application.properties"&&p.setFlag("found_ssh_trace",!0),e==="/customer-portal/src/main/java/com/nori/OrderService.java"&&p.setFlag("found_fee_mapping",!0),U.emit("vfs:read",e),t.content)}function an(e){return Pe.has(e)}function nn(e){const t=e.toLowerCase(),a=[];for(const[n,i]of Pe.entries())typeof i.content=="string"&&i.content.toLowerCase().includes(t)&&a.push({path:n,snippet:sn(i.content,t)});return a}function sn(e,t){const a=e.toLowerCase().indexOf(t),n=Math.max(0,a-40),i=Math.min(e.length,a+t.length+40);return e.slice(n,i).replace(/\n/g," ")}function Rt(){return p.hasFlag("ch1_0043_committed")&&!p.hasFlag("ch1_revert_done")}function rn(){return Rt()?!1:p.hasFlag("hidden_portal_accessed")}function on(e){return Rt()?!1:e&&e.hash==="f665a7117959b667b7f283eaebf69cae"?(p.setFlag("hidden_portal_accessed",!0),p.setFlag("portal_auth_bypassed",!1),U.emit("portal:discovered"),!0):!1}function ln(e){return Rt()?!1:(e?.["X-Internal-Token"]||e?.["x-internal-token"])==="nori-drinks-token-2024"?(p.hasFlag("hidden_portal_accessed")||(p.setFlag("hidden_portal_accessed",!0),U.emit("portal:discovered")),p.setFlag("portal_auth_bypassed",!0),U.emit("portal:bypassed"),!0):!1}function cn(){w("/customer-portal/package.json",{content:JSON.stringify({name:"nori-drinks-supply",version:"3.5.0",private:!0,description:"Nori 飲品供應 — 招牌冰釀茶酒 / 原物料管理 / 訂單銷售 / 內部系統",scripts:{dev:"vite",build:"vite build",test:"jest","db:migrate":"node scripts/migrate.js"},dependencies:{vite:"^5.0.0",vue:"^3.4.0"}},null,2),meta:{lang:"json"}}),w("/customer-portal/README.md",{content:`# Nori外部網頁

- 前台官網功能：飲品一覽、VIP 價格試算、關於 Nori、線上訂購
- 支付閘道：gateway.js 統一清算

## 開發

\`\`\`bash
npm install
npm run dev   # http://localhost:3000
\`\`\`
環境變數見 \`.env\`
`,meta:{lang:"markdown"}}),w("/customer-portal/.env",{content:`DATABASE_URL=postgres://nori:nori@localhost:5432/nori_drinks
INTERNAL_PORTAL_TOKEN=nori-drinks-token-2024
ABPAY_API_KEY=abpay_test_sk_...
LALAPAY_MERCHANT_ID=lala_nori_2019
BANK_ACCOUNT_ESUN=808-123456789012
MD5_KEY=70BTa3A1a13ad4212GHdybJmn
#內部稽核 token，請勿外洩
`,meta:{lang:"properties"}}),w("/customer-portal/docker-compose.yml",{content:`version: '3.8'
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
`,meta:{lang:"yaml"}}),w("/file-system/README.md",{content:`# File System UI (內網檔案系統前端)

此為 Nori 內網檔案系統的前端建構專案，負責「內網」App 的 UI 渲染。
實際檔案資料存放於後端資料庫，此處僅為前端展示邏輯。`,meta:{lang:"markdown"}}),w("/file-system/package.json",{content:JSON.stringify({name:"nori-file-system-ui",version:"1.0.0",private:!0,description:"Nori 內網檔案系統 UI"},null,2),meta:{lang:"json"}}),w("/file-system/src/App.jsx",{content:`import SearchBar from './components/SearchBar.jsx';
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
}`,meta:{lang:"javascript"}}),w("/file-system/src/components/SearchBar.jsx",{content:`import { useState } from 'react';

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
}`,meta:{lang:"javascript"}}),w("/file-system/src/components/FileList.jsx",{content:`import { useState, useEffect } from 'react';

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
}`,meta:{lang:"javascript"}}),w("/file-system/src/components/Breadcrumb.jsx",{content:`export default function Breadcrumb({ path, onNavigate }) {
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
}`,meta:{lang:"javascript"}}),w("/file-system/src/components/Sidebar.jsx",{content:`export default function Sidebar({ currentPath, onNavigate }) {
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
}`,meta:{lang:"javascript"}}),w("/file-system/src/components/FilePreview.jsx",{content:`export default function FilePreview({ file }) {
  // 模擬內網檔案預覽（支援 CSV 表格、Markdown 等）
  if (!file) return null;
  const isCSV = file.path.endsWith('.csv');
  return (
    <div className="file-preview">
      <div className="preview-header">{file.path}</div>
      {isCSV ? <table><thead><tr>{file.header.map(h => <th>{h}</th>)}</tr></thead></table> : <pre>{file.content.slice(0,8000)}</pre>}
    </div>
  );
}`,meta:{lang:"javascript"}}),w("/file-system/src/utils/helpers.js",{content:`export function escapeHtml(str){ const div=document.createElement('div'); div.textContent=str; return div.innerHTML; }
export function formatFileSize(bytes){ return (bytes/1024).toFixed(1)+' KB'; }`,meta:{lang:"javascript"}}),w("/file-system/src/styles/main.css",{content:`/* File System UI - 模擬內網樣式 */
.file-system{ display:flex; flex-direction:column; flex:1; }
.file-system__body{ display:flex; flex:1; }
.sidebar{ width:220px; border-right:1px solid var(--border); }
.file-list{ flex:1; }`,meta:{lang:"css"}}),w("/customer-portal/src/billing/service.js",{content:`// billing/service.js - 飲品訂單金額稽核模組 (VIP 飲品價格)
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
  // 勿動！聯繫 finance@internal / Sawyer
  const table = { default: 0.03};
  return table[vendorId] || table.default;
}

function redirectTo(path) {
  return { __redirect: path };
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/middleware/auth.js",{content:`// middleware/auth.js
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
`,meta:{lang:"javascript"}}),w("/customer-portal/src/main/java/com/nori/OrderService.java",{content:`package com.nori;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/NoriApplication.java",{content:`package com.nori;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/config/SecurityConfig.java",{content:`package com.nori.config;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/model/Drink.java",{content:`package com.nori.model;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/service/DrinkService.java",{content:`package com.nori.service;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/controller/DrinkController.java",{content:`package com.nori.controller;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/service/PriceCalculatorService.java",{content:`package com.nori.service;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/controller/PriceCalculatorController.java",{content:`package com.nori.controller;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/utils/FeeCalculator.java",{content:`package com.nori.utils;

/** 前台共用：與 billing/service.js 一致（飲品 VIP 計算） */
public class FeeCalculator {
    public static double total(double base, String drinkType, int familySize){
        double rate = switch(drinkType){
            case "ICE_TEA_ALCOHOLIC" -> 0.05; case "GRAPE_WINE" -> 0.08; case "FRUIT_TEA" -> 0.03; default -> 0.05;
        };
        return Math.round((base * (1+rate) * familySize)*100)/100.0;
    }
}
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/controller/AboutController.java",{content:`package com.nori.controller;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/model/Customer.java",{content:`package com.nori.model;

public class Customer {
    private String id; // CUS-xxxx
    private String name;
    private String passport;
    private String phone;
    private String email;
    private int vipLevel; // 1-5 對應 OrderService.calculateVipPrice
    private String drinkId; // drink-001/002/003
}
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/model/Order.java",{content:`package com.nori.model;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/model/Payment.java",{content:`package com.nori.model;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/model/enums/PaymentMethod.java",{content:`package com.nori.model.enums;

public enum PaymentMethod {
    BANK_TRANSFER("銀行匯款","ESUN 808"),
    ABPAY("ABPay 電子支付","ABPay"),
    LALAPAY("LalaPay","LalaPay");
    private final String label; private final String channel;
    PaymentMethod(String l,String c){ this.label=l; this.channel=c; }
}
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/repository/OrderRepository.java",{content:`package com.nori.repository;

import com.nori.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order,String> {
    List<Order> findByCustomerId(String cid);
    List<Order> findByPlanId(String drinkId);
    List<Order> findByStatus(String status);
    List<Order> findByPaymentMethod(String method);
}
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/repository/PaymentRepository.java",{content:`package com.nori.repository;

import com.nori.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentRepository extends JpaRepository<Payment,String> {}
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/service/NoriOrderService.java",{content:`package com.nori.service;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/controller/OrderController.java",{content:`package com.nori.controller;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/service/PaymentService.java",{content:`package com.nori.service;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/main/java/com/nori/controller/PaymentController.java",{content:`package com.nori.controller;

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
`,meta:{lang:"java"}}),w("/customer-portal/src/payment/bankTransfer.js",{content:`// bankTransfer.js - 銀行匯款 (玉山)
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
`,meta:{lang:"javascript"}}),w("/customer-portal/src/payment/abPay.js",{content:`// abPay.js - ABPay 電子支付
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
`,meta:{lang:"javascript"}}),w("/customer-portal/src/payment/cryptoConfig.json",{content:JSON.stringify({mixer:"@shady/crypto-mixer@1.2.3",wallets:["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4","1A2b...9z"],autoMix:!0,feeSplit:{"drink-001":.05,"drink-002":.08},nori:{channels:["BANK_TRANSFER","ABPAY","LALAPAY"]}},null,2),meta:{lang:"json"}}),w("/customer-portal/src/payment/mixer.js",{content:`// mixer.js 
 import { cryptoMixer } from '@shady/crypto-mixer';
export const mixerConfig = {
  wallets: ["bc1qxy2kgdy8lzd9t9e","0x8fA1...c3e4"],
  route: "tor://mixer.internal",
  noriChannels: ["ABPAY","LALAPAY"]
};
export function mix(amount, vendorId) {
  return cryptoMixer.shuffle(amount, mixerConfig.wallets);
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/payment/gateway.js",{content:`// gateway.js - Nori 支付閘道統一入口 (Bank / ABPay / LalaPay)
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
    default: return { payout, route: "internal/portal" };
  }
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/pages/Home.jsx",{content:`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
      <p>創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/pages/PriceCalculator.jsx",{content:`import { useState } from 'react';
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
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/pages/About.jsx",{content:`export default function About(){
  return (
    <article>
      <h1>關於 Nori</h1>
      <p>創辦人 <b>蔡梓掦</b> 2019 年於創立，從實驗室葡萄釀酒起家，現以招牌冰釀茶酒聞名。</p>
      <p>地址：鴨嘴道135號中央大樓3507室 · 團隊 50 人 · 產品 12 款</p>
    </article>
  );
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/pages/OrderManagement.jsx",{content:`import OrderTable from '../components/OrderTable.jsx';
import { useEffect,useState } from 'react';
export default function OrderManagement(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ fetch('/api/admin/orders').then(r=>r.json()).then(setOrders); },[]);
  return <OrderTable orders={orders}/>;
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/pages/Payment.jsx",{content:`import PaymentForm from '../components/PaymentForm.jsx';
export default function Payment({order}){
  return <PaymentForm order={order} methods={["BANK_TRANSFER","ABPAY","LALAPAY"]}/>;
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/components/PlanCard.jsx",{content:`export default function PlanCard({plan}){
  return <div className="card"><h3>{plan.name}</h3><p>{plan.country}</p><a href={"/plans/"+plan.id}>查看詳情</a></div>;
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/components/PriceTable.jsx",{content:`export default function PriceTable({vip}){
  const rows=[1,2,3,4,5].map(lv=> ({lv, rate: [90,85,80,75,70][lv-1]}));
  return <table><thead><tr><th>VIP</th><th>折扣</th></tr></thead><tbody>{rows.map(r=> <tr key={r.lv}><td>{r.lv}</td><td>{r.rate}%</td></tr>)}</tbody></table>;
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/components/PaymentForm.jsx",{content:`export default function PaymentForm({order, methods}){
  return (
    <form>
      <select>{methods.map(m=> <option key={m}>{m}</option>)}</select>
      <p>支援：銀行匯款 (玉山 808) / ABPay / LalaPay</p>
      <button>確認付款</button>
    </form>
  );
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/components/OrderTable.jsx",{content:`export default function OrderTable({orders}){
  return (
    <table>
      <thead><tr><th>訂單號</th><th>方案</th><th>客戶</th><th>支付方式</th><th>狀態</th><th>顧問</th></tr></thead>
      <tbody>{orders.map(o=> <tr key={o.id}><td>{o.id}</td><td>{o.drinkId}</td><td>{o.customerId}</td><td>{o.paymentMethod}</td><td>{o.status}</td><td>{o.assignedConsultant}</td></tr>)}</tbody>
    </table>
  );
}
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/src/api/client.js",{content:`// 前後端 API 客戶端
const BASE = import.meta.env.VITE_API_BASE || '/api';
export const api = {
  plans: () => fetch(BASE+'/plans').then(r=>r.json()),
  price: (body) => fetch(BASE+'/price/calc',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json()),
  orders: (q) => fetch(BASE+'/admin/orders?'+new URLSearchParams(q)).then(r=>r.json()),
  pay: (body) => fetch(BASE+'/pay/settle',{method:'POST', body:JSON.stringify(body)}).then(r=>r.json())
};
`,meta:{lang:"javascript"}}),w("/customer-portal/src/frontend/package.json",{content:JSON.stringify({name:"nori-frontend",version:"3.5.0",dependencies:{react:"^18.2.0","react-router-dom":"^6.22.0"}},null,2),meta:{lang:"json"}}),w("/customer-portal/src/admin/OrderManagementSystem.js",{content:`// 管理後台 — 訂單查詢系統
/** 支援：依方案 / 支付方式 / 狀態 篩選 */
export class OrderManagementSystem {
  constructor(api){ this.api=api; }
  async query({ status, drinkId, paymentMethod }){
    const params = new URLSearchParams({ ...(status&&{status}), ...(drinkId&&{drinkId}), ...(paymentMethod&&{paymentMethod}) });
    return fetch('/api/admin/orders?'+params).then(r=>r.json());
  }
  async exportCsv(){ return fetch('/api/admin/orders/export').then(r=>r.text()); }
}
`,meta:{lang:"javascript"}}),w("/customer-portal/scripts/reconcile.py",{content:`# reconcile.py - 對帳腳本 (Python)
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
`,meta:{lang:"python"}}),w("/customer-portal/scripts/migrate.js",{content:`// migrate.js - 執行 db/migration
import fs from 'fs';
console.log('apply migration', fs.readdirSync('src/main/resources/db/migration'));
`,meta:{lang:"javascript"}}),w("/customer-portal/src/main/resources/db/migration/V1__init.sql",{content:`-- Nori 初始建表 2019
CREATE TABLE customers (id TEXT PRIMARY KEY, name TEXT, vip_level INT, plan_id TEXT);
CREATE TABLE orders (id TEXT PRIMARY KEY, customer_id TEXT, plan_id TEXT, total_price REAL, payment_method TEXT, status TEXT, consultant TEXT);
CREATE TABLE payments (tx_id TEXT PRIMARY KEY, order_id TEXT, method TEXT, amount REAL, status TEXT);
`,meta:{lang:"sql"}}),w("/customer-portal/src/main/resources/db/migration/V2__seed_plans.sql",{content:`INSERT INTO customers VALUES ('CUS-2019-001','Sawyer (創辦人測試)','5','plan-a');
INSERT INTO orders VALUES ('ORD-2024-1001','CUS-2019-001','plan-a',918000,'BANK_TRANSFER','PAID','Sawyer');
INSERT INTO orders VALUES ('ORD-2024-1002','CUS-2024-042','plan-b',1400000,'ABPAY','PENDING','Maggie');
INSERT INTO orders VALUES ('ORD-2024-1003','CUS-2024-117','plan-c',802400,'LALAPAY','APPROVED','Sawyer');
`,meta:{lang:"sql"}}),w("/customer-portal/docs/ARCHITECTURE.md",{content:`# Nori 官網開發結構

## 主要功能頁
- 商品查詢
- 合作聯繫
- 試算費用 (含服務費 + VIP 折扣)
- 用家感想
- 關於我們

## 支付方式
銀行匯款 銀行轉賬、ABPay、LalaPay

`,meta:{lang:"markdown"}}),w("/customer-portal/src/main/resources/application.properties",{content:`server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/nori_drinks
spring.datasource.username=nori
# ssh: ssh ops@203.0.113.45 -p 2222 
`,meta:{lang:"properties"}}),w("/intranet/README.md",{content:`# Nori 內網檔案系統 (Intranet File System)

> Nori 飲品供應 — 內部檔案總覽
> 本內網整合公司營運文件，請由左側目錄瀏覽。

## 目錄結構
- /intranet/company_public/ — 公司公開資訊（名稱、Logo、大樓企業名錄）
- /intranet/client_info/ — 客戶資料（🔒 權限管制，遊戲內無需存取）
- /intranet/business_plans/ — 業務流程完整結構
- /intranet/staff/ — 員工名錄（50 人，Sawyer #001 至 Casey #048）
- 內網僅供飲品供應相關文件瀏覽

> 提示：在內網搜尋框輸入關鍵字可搜尋內網檔案。客戶資料夾受保護，點擊將顯示權限提示。
`,meta:{lang:"markdown"}}),w("/intranet/company_public/公司簡介.md",{content:`# Nori 飲品供應 — 公司簡介

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
`,meta:{lang:"markdown"}}),w("/intranet/company_public/企業識別_Logo設計.md",{content:`# Nori 企業識別 — Logo 設計規範

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
`,meta:{lang:"markdown"}}),w("/intranet/company_public/logo-nori.svg",{content:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="#0e3a5c"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="white">Nori</text><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="7" letter-spacing="0.18em" fill="#9aa0a6">IMMIGRATION CONSULTING</text></svg>',meta:{lang:"html"}}),w("/intranet/company_public/上市公司名錄.md",{content:`# 上市公司名錄

> 上市公司一覽（企業編號 100–150，共 51 間，已按企業編號升冪排序）

| 企業編號 | 企業名稱 | 地址 |
|---|---|---|
| 100 | 宏達電子股份有限公司 | 微風大道52號晨露大廈3906室 |
| 101 | 建業地產發展有限公司 | 曦和大道35號天穹大廈0609室 |
| 102 | 華潤創業有限公司 | 晨曦街136號晨露大廈4418室 |
| 103 | 長江實業集團有限公司 | 幻影街126號星瀚大樓1314室 |
| 104 | 新世界發展有限公司 | 晨曦街151號星瀚大樓1412室 |
| 105 | 恆基地產有限公司 | 幻彩街55號星雲廣場1015室 |
| 106 | 信和置業有限公司 | 翠微大道146號銀河中心2203室 |
| 107 | 太古股份有限公司 | 幻海大道174號暮光大廈0616室 |
| 108 | 嘉里建設有限公司 | 星河街11號暮雲中心1818室 |
| 109 | 會德豐有限公司 | 晨曦大道53號未來中心2418室 |
| 110 | 九龍倉集團有限公司 | 幻影街133號無限廣場1320室 |
| 111 | 希慎興業有限公司 | 月光大道92號虹光大廈0907室 |
| 112 | 恆隆地產有限公司 | 幻海大道192號紫藤大廈2920室 |
| 113 | 新鴻基地產發展有限公司 | 紫藤街170號晨風中心1202室 |
| 114 | 長實集團有限公司 | 極光大道44號晨曦廣場3114室 |
| 115 | 中電控股有限公司 | 幻影街162號未來中心0605室 |
| 116 | 港燈電力投資有限公司 | 幻境大道2號星瀚大樓2511室 |
| 117 | 領展房產基金 | 暮色街104號暮光大廈1302室 |
| 118 | 友邦保險控股有限公司 | 幻森大道114號曦和廣場1718室 |
| 119 | 匯豐控股有限公司 | 微風大道33號晨星大廈2316室 |
| 120 | 中國移動有限公司 | 虹光大道190號曙光大廈4620室 |
| 121 | 騰訊控股有限公司 | 幻星街39號琉璃中心3914室 |
| 122 | 阿里巴巴集團控股有限公司 | 極光大道31號極光大廈1010室 |
| 123 | 小米集團 | 紫藤街105號銀河中心1007室 |
| 124 | 美團點評 | 星語街198號清輝大廈3208室 |
| 125 | 鴻海創投有限公司 | 天穹街93號暮色中心1203室 |
| 126 | 環宇物流股份有限公司 | 天際大道3號星河廣場3802室 |
| 127 | 誠信會計師事務所 | 霓虹大道97號曦和廣場2611室 |
| 128 | 遠見法律事務所 | 微風大道107號晨露大廈2418室 |
| 129 | 星辰文創有限公司 | 幻影街10號銀河中心2413室 |
| 130 | 安心搬運有限公司 | 幻星街59號創世紀大廈2008室 |
| 131 | 智匯科技股份有限公司 | 曦光街80號流光大樓0711室 |
| 132 | 優居物業管理有限公司 | 幻月街183號晨星大廈4408室 |
| 133 | 明達顧問有限公司 | 幻彩街113號星河廣場0615室 |
| 134 | Nori Limited（Nori 飲品供應） | 鴨嘴道135號中央大樓3507室 |
| 135 | 京東集團股份有限公司 | 晨露街18號晨星中心3310室 |
| 136 | 百度集團股份有限公司 | 星瀚大道123號清輝大廈3505室 |
| 137 | 網易有限公司 | 天穹街75號未來中心2720室 |
| 138 | 快手科技有限公司 | 流雲大道98號星河廣場4420室 |
| 139 | 嗶哩嗶哩有限公司 | 靈境大道183號晨曦中心2907室 |
| 140 | 蔚來集團 | 幻彩街51號碧波中心2301室 |
| 141 | 理想汽車有限公司 | 翠微大道178號幻彩大樓1907室 |
| 142 | 小鵬汽車有限公司 | 翠微大道44號晨曦中心4109室 |
| 143 | 比亞迪電子（國際）有限公司 | 翠微大道191號月光大樓4608室 |
| 144 | 舜宇光學科技（集團）有限公司 | 晨露街169號幻彩大樓2601室 |
| 145 | 瑞聲科技控股有限公司 | 極光大道137號晨風中心1301室 |
| 146 | 創科實業有限公司 | 幻光街173號霓虹中心4806室 |
| 147 | 安踏體育用品有限公司 | 天際大道53號創世紀大廈1714室 |
| 148 | 李寧有限公司 | 月光大道136號靈境中心4120室 |
| 149 | 蒙牛乳業有限公司 | 幻星街196號雲夢中心3910室 |
| 150 | 康師傅控股有限公司 | 銀河大道6號琉璃中心0710室 |

> 備註：本名錄為上市企業公開資訊，已按企業編號升冪排序，僅供內部參考。
`,meta:{lang:"markdown"}}),w("/intranet/company_public/上市公司名錄.csv",{content:`企業編號,企業名稱,地址
100,宏達電子股份有限公司,微風大道52號晨露大廈3906室
101,建業地產發展有限公司,曦和大道35號天穹大廈0609室
102,華潤創業有限公司,晨曦街136號晨露大廈4418室
103,長江實業集團有限公司,幻影街126號星瀚大樓1314室
104,新世界發展有限公司,晨曦街151號星瀚大樓1412室
105,恆基地產有限公司,幻彩街55號星雲廣場1015室
106,信和置業有限公司,翠微大道146號銀河中心2203室
107,太古股份有限公司,幻海大道174號暮光大廈0616室
108,嘉里建設有限公司,星河街11號暮雲中心1818室
109,會德豐有限公司,晨曦大道53號未來中心2418室
110,九龍倉集團有限公司,幻影街133號無限廣場1320室
111,希慎興業有限公司,月光大道92號虹光大廈0907室
112,恆隆地產有限公司,幻海大道192號紫藤大廈2920室
113,新鴻基地產發展有限公司,紫藤街170號晨風中心1202室
114,長實集團有限公司,極光大道44號晨曦廣場3114室
115,中電控股有限公司,幻影街162號未來中心0605室
116,港燈電力投資有限公司,幻境大道2號星瀚大樓2511室
117,領展房產基金,暮色街104號暮光大廈1302室
118,友邦保險控股有限公司,幻森大道114號曦和廣場1718室
119,匯豐控股有限公司,微風大道33號晨星大廈2316室
120,中國移動有限公司,虹光大道190號曙光大廈4620室
121,騰訊控股有限公司,幻星街39號琉璃中心3914室
122,阿里巴巴集團控股有限公司,極光大道31號極光大廈1010室
123,小米集團,紫藤街105號銀河中心1007室
124,美團點評,星語街198號清輝大廈3208室
125,鴻海創投有限公司,天穹街93號暮色中心1203室
126,環宇物流股份有限公司,天際大道3號星河廣場3802室
127,誠信會計師事務所,霓虹大道97號曦和廣場2611室
128,遠見法律事務所,微風大道107號晨露大廈2418室
129,星辰文創有限公司,幻影街10號銀河中心2413室
130,安心搬運有限公司,幻星街59號創世紀大廈2008室
131,智匯科技股份有限公司,曦光街80號流光大樓0711室
132,優居物業管理有限公司,幻月街183號晨星大廈4408室
133,明達顧問有限公司,幻彩街113號星河廣場0615室
134,Nori Limited（Nori 飲品供應）,鴨嘴道135號中央大樓3507室
135,京東集團股份有限公司,晨露街18號晨星中心3310室
136,百度集團股份有限公司,星瀚大道123號清輝大廈3505室
137,網易有限公司,天穹街75號未來中心2720室
138,快手科技有限公司,流雲大道98號星河廣場4420室
139,嗶哩嗶哩有限公司,靈境大道183號晨曦中心2907室
140,蔚來集團,幻彩街51號碧波中心2301室
141,理想汽車有限公司,翠微大道178號幻彩大樓1907室
142,小鵬汽車有限公司,翠微大道44號晨曦中心4109室
143,比亞迪電子（國際）有限公司,翠微大道191號月光大樓4608室
144,舜宇光學科技（集團）有限公司,晨露街169號幻彩大樓2601室
145,瑞聲科技控股有限公司,極光大道137號晨風中心1301室
146,創科實業有限公司,幻光街173號霓虹中心4806室
147,安踏體育用品有限公司,天際大道53號創世紀大廈1714室
148,李寧有限公司,月光大道136號靈境中心4120室
149,蒙牛乳業有限公司,幻星街196號雲夢中心3910室
150,康師傅控股有限公司,銀河大道6號琉璃中心0710室
`,meta:{lang:"csv"}}),w("/intranet/client_info/README.md",{content:`# 客戶資料 — 權限管制

🔒 本資料夾受保護，僅限法務與客戶經理存取。

- 內容：護照影本、合約、付款憑證、個資
- 存取需二階段驗證，遊戲內無需開啟。
- 如需測試請聯絡 Sawyer 或 系統管理員。

> 遊戲提示：此資料夾為情境佈置，請專注於 /intranet/company_public/、/intranet/business_plans/ 與 /intranet/staff/。
`,meta:{lang:"markdown",locked:!0}}),w("/intranet/client_info/客戶清單_加密.csv",{content:`客戶編號,姓名,方案,狀態,備註
CUS-2024-001,***,冰釀茶酒,處理中,加密
CUS-2024-002,***,葡萄釀造酒,處理中,加密
# 本檔案已加密，無法於內網預覽
`,meta:{lang:"csv",locked:!0}}),w("/intranet/client_info/合約範本_受保護.docx",{content:`[二進位受保護文件 — 需權限]
本文件僅供法務調閱。
`,meta:{lang:"text",locked:!0}}),w("/intranet/business_plans/業務流程_完整結構.md",{content:`# Nori 業務流程 — 完整結構

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
`,meta:{lang:"markdown"}}),w("/intranet/business_plans/方案對照表.csv",{content:`飲品,產地,賞味期限,基礎價格,說明,適合對象
招牌冰釀茶酒,高山茶＋葡萄,180 天,32,HKD 最暢銷,企業宴會
葡萄釀造酒,實驗室自釀,365 天,85,果香飽滿,禮盒
季節水果茶,當季水果,90 天,28,清爽季節限定,日常飲用
`,meta:{lang:"csv"}}),w("/intranet/business_plans/2023_Q1_財務報告.md",{content:`# Nori 2023 年第一季財務報告

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
`,meta:{lang:"markdown"}}),w("/intranet/staff/員工名錄.csv",{content:`編號,姓名,職稱,到職日,所屬團隊,狀態
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
`,meta:{lang:"csv"}}),w("/intranet/staff/員工名錄.md",{content:`# Nori 員工名錄（50 人）

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
`,meta:{lang:"markdown"}}),w("/internal/portal",{hidden:!1,content:`## INTERNAL PORTAL - Nori 內部審核 

狀態：需 X-Internal-Token (nori-drinks-token-2024)

庫存/案件:
- 飲品訂單: 90 筆
- 待出貨: 12 筆
- 已完成: 78 筆

匯出: /internal/portal/export

備註： Nori 2019 Sawyer 創立 — 內部稽核
`,meta:{portal:!0}}),w("/internal/portal/export",{hidden:!1,content:"SQLite export endpoint - 需要 portalAuth 通過 (Nori 訂單匯出)",meta:{portal:!0}})}function dn(){Z("/darknet/全結構圖/drug-route-graph.md",{content:`# 全結構圖

FredyArc → Nori 實驗室 → 葡萄/茶葉原料 → 銷售（企業客戶）→ 配送（每趟公開物流綁一次秘密包裹）→ IT 內網

節點 Drug Code: COCOA=可卡因, BEAN=海洛因, LEAF=大麻, CRYSTAL=冰毒

- 葡萄對應 COCOA
- 茶葉對應 BEAN
- alchol 對應 LEAF
- 玻璃瓶 對應 CRYSTAL
- 紙箱 通用`,meta:{lang:"markdown"}}),Z("/darknet/交易列表/drug-transactions.csv",{content:`datetime,location,client_company,traffic_used,drug_code,quantity,status
2023-11-11 09:00,鴨嘴道135號,鴻海創投,grape,COCOA,420,已送達
2023-11-15 14:30,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達
2023-11-22 10:00,新加坡濱海灣,海外客戶-SG-01,清酒,LEAF,300,運輸中
2023-12-05 16:00,東京港區,海外客戶-JP-02,玻璃瓶,CRYSTAL,75,已送達
2023-12-19 11:20,鴨嘴道135號,誠信會計師事務所,紙箱,COCOA,200,待發
2024-01-08 09:30,曼谷素坤逸,海外客戶-TH-03,紅葡萄,BEAN,150,已送達
`,meta:{lang:"csv"}}),Z("/darknet/合作公司列表/companies.md",{content:`# 合作公司列表及聯絡方式

| 公司 | 地區 | 聯絡人 | 電話 | 備註 |
|---|---|---|---|---|
| 鴻海創投有限公司 | 本地 | 陳先生 | +852 9123 4567 | 正當合作掩護 |
| 環宇物流股份有限公司 | 本地 | 林小姐 | +852 9234 5678 | 物流掩護 |
| 海外客戶-SG-01 | 新加坡 | Mr. Lee | +65 8123 4567 | 虛構海外 |
| 海外客戶-JP-02 | 日本 | 佐藤 | +81 90-1234-5678 | 虛構海外 |
| 海外客戶-TH-03 | 泰國 | Khun Som | +66 81-234-5678 | 虛構海外 |
| FredyArc | 海外組織 | Fredy | +1 415-555-0100 | 毒品來源 |`,meta:{lang:"markdown"}}),Z("/darknet/流量/drug-traffic.csv",{content:`datetime,location,client_company,traffic_used,drug_code,quantity,status
2023-11-11 09:00,鴨嘴道135號,鴻海創投,紅葡萄,COCOA,420,已送達
2023-11-18 13:00,鴨嘴道135號,環宇物流,茶葉,BEAN,118,已送達
2023-12-02 10:30,洛杉磯,海外客戶-US-04,紙箱,LEAF,300,已送達
2023-12-20 15:00,鴨嘴道135號,星辰文創,alchol,CRYSTAL,75,待發
2024-01-15 11:00,首爾江南,海外客戶-KR-05,玻璃瓶,COCOA,250,運輸中
2024-02-10 14:00,鴨嘴道135號,安心搬運,紙箱,BEAN,180,已送達
2024-03-05 09:20,香港中環,海外客戶-HK-06,紅葡萄,LEAF,320,已送達
2024-04-12 16:40,柏林,海外客戶-DE-07,茶葉,CRYSTAL,60,已送達
`,meta:{lang:"csv"}}),Z("/darknet/月結單/monthly-2023-12.csv",{content:`month,from,to,amount,type,note
2023-12,FredyArc,Nori,125000,收入,合作資金
2023-12,FredyArc,Nori,85000,收入,企業合作
2023-12,Nori,Anonymous,320,支出,小額
`,meta:{lang:"csv"}}),Z("/darknet/月結單/monthly-2024-01.csv",{content:`month,from,to,amount,type,note
2024-01,FredyArc,Nori,320000,收入,季度分潤
2024-01,Nori,Anonymous,750,支出,
`,meta:{lang:"csv"}}),Z("/darknet/月結單/monthly-2024-02.csv",{content:`month,from,to,amount,type,note
2024-02,FredyArc,Nori,450000,收入,
2024-02,FredyArc,Nori,120000,收入,
2024-02,Nori,Anonymous,420,支出,
`,meta:{lang:"csv"}}),Z("/darknet/Sawyer支出/sawyer_expenses.csv",{content:`日期,項目,金額(HKD),備註
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
`,meta:{lang:"csv"}}),Z("/darknet/出差紀錄/travel_records.csv",{content:`日期,目的地,行程目的,天數,同行人員
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
`,meta:{lang:"csv"}}),Z("/darknet/會議紀錄/meeting_minutes.md",{content:`# Nori × FredyArc 定期會議紀錄

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
`,meta:{lang:"markdown"}})}dn();cn();var k={registerFile:w,getFile:xa,listFiles:Za,buildTree:en,readFile:tn,exists:an,searchContent:nn,canAccessPortal:rn,tryAccessPortal:on,bypassPortalAuth:ln,registerDarkFile:Z,getDarkFile:wa,listDarkFiles:Ja,buildDarkTree:Qa,readDarkFile:Xa,registerLegacyRoute:_a,getLegacyRoute:Ga,listLegacyRoutes:Ya,findLegacyRoute:Ka,internalPathDomain:ba},pn=[{id:"ch0_vip_fix",chapter:0,check:()=>p.hasFlag("ch0_vip_fixed"),reward:{},title:"修正 VIP 折扣計算 (INV-2024-0042)"},{id:"ch1_system_alert",chapter:1,check:()=>p.hasFlag("ch1_system_down"),reward:{evidence:{id:"e001",title:"INV-2024-0043 系統警報",chapter:1,type:"anomaly"}},title:"觸發系統警報 (INV-2024-0043)"},{id:"ch1_feng_shui_tree",chapter:1,check:()=>p.hasFlag("ch1_tree_seen"),reward:{evidence:{id:"e002",title:"老闆的風水樹",chapter:1,type:"behavior"}},title:"發現老闆的風水樹"},{id:"ch2_accident_news",chapter:2,check:()=>p.get("searchHistory")?.some(e=>e.includes("Sawyer")||e.includes("Choi")||e.includes("車禍")),reward:{evidence:{id:"e003",title:"車禍新聞 — 父母雙亡",chapter:2,type:"news"}},title:"搜尋到車禍新聞"},{id:"ch2_insurance_blog",chapter:2,check:()=>p.get("discoveredFiles")?.includes("https://sawyer-blog.example/2012-07-07")||p.get("searchHistory")?.some(e=>e.includes("保險")),reward:{evidence:{id:"e004",title:"保險受益人 Blog",chapter:2,type:"blog"}},title:"發現保險受益人文章"},{id:"ch2_lottery_lie",chapter:2,check:()=>p.hasFlag("lottery_lie_seen"),reward:{evidence:{id:"e005",title:"六合彩謊言",chapter:2,type:"lie"}},title:"發現六合彩謊言紀錄"},{id:"ch2_dark_blog",chapter:2,check:()=>p.get("discoveredFiles")?.includes("https://sawyer-blog.example/2023-12-20"),reward:{evidence:{id:"e006",title:"Sawyer 暗示文字",chapter:2,type:"blog"}},title:"發現 2023-12-20 Blog"},{id:"ch3_git_secret",chapter:3,check:()=>p.hasFlag("git_secret_found"),reward:{evidence:{id:"e007",title:"Git 刪除的 secret path",chapter:3,type:"code"}},title:"在 Git 歷史找到刪除的 secret path"},{id:"ch3_darknet_url",chapter:3,check:()=>p.hasFlag("dark_entered")||p.hasFlag("hidden_portal_accessed"),reward:{evidence:{id:"e008",title:"暗網入口 URL",chapter:3,type:"portal"}},title:"找到暗網完整入口"},{id:"ch4_drug_transactions",chapter:4,check:()=>p.hasFlag("ch4_all_opened")||p.get("discoveredFiles")?.some(e=>e.includes("/darknet/")),reward:{evidence:{id:"e009",title:"毒品交易紀錄",chapter:4,type:"darknet"}},title:"開啟毒品交易列表"},{id:"ch4_drug_route",chapter:4,check:()=>p.hasFlag("ch4_all_opened")||p.get("discoveredFiles")?.some(e=>e.includes("drug-route")),reward:{evidence:{id:"e010",title:"毒品結構圖",chapter:4,type:"darknet"}},title:"開啟毒品結構圖"},{id:"ch4_sawyer_expenses",chapter:4,check:()=>p.hasFlag("ch4_all_opened")||p.get("discoveredFiles")?.some(e=>e.includes("sawyer_expenses")),reward:{evidence:{id:"e011",title:"Sawyer 個人支出",chapter:4,type:"darknet"}},title:"發現 Sawyer 與 FredyArc 金流"},{id:"ch4_travel_records",chapter:4,check:()=>p.hasFlag("ch4_all_opened")||p.get("discoveredFiles")?.some(e=>e.includes("travel_records")),reward:{evidence:{id:"e012",title:"Travel 紀錄",chapter:4,type:"darknet"}},title:"發現 Sawyer 多次前往毒品路線城市"},{id:"ch4_meeting_minutes",chapter:4,check:()=>p.hasFlag("ch4_all_opened")||p.get("discoveredFiles")?.some(e=>e.includes("meeting_minutes")),reward:{evidence:{id:"e013",title:"Sawyer × Fredy 會議紀錄",chapter:4,type:"darknet"}},title:"發現定期會議紀錄"},{id:"ch5_choose_ending",chapter:5,check:()=>(p.get("endings")||[]).length>0,reward:{},title:"選擇結局"}];function Oe(){for(const t of pn)p.hasFlag(`puzzle:${t.id}`)||t.check()&&(p.setFlag(`puzzle:${t.id}`,!0),t.reward?.evidence&&p.addEvidence(t.reward.evidence),t.reward?.unlock&&t.reward.unlock.forEach(a=>p.unlockInterface(a)),U.emit("puzzle:solved",t));let e=0;p.hasFlag("ch0_vip_fixed")&&(e=1),p.hasFlag("ch1_revert_done")&&(e=2),(p.hasFlag("dark_entered")||p.hasFlag("hidden_portal_accessed"))&&(e=3),p.hasFlag("ch4_all_opened")&&(e=4),(p.get("endings")||[]).length>0&&(e=5),e!==p.get("currentChapter")&&(p.set("currentChapter",e),U.emit("chapter:changed",e))}var un=null;function mn(){U.on("change",Oe),U.on("vfs:read",Oe),U.on("portal:discovered",Oe),U.on("portal:bypassed",Oe),un=setInterval(Oe,800),Oe()}var Zt={"zh-TW":{"app.title":"聽日辭職","app.subtitle":"編程人生模擬 · 離線 ARG","dock.vscode":"Vizual Studio Code","dock.intranet":"內網","dock.jira":"Jiua","dock.whatsapp":"WhatUp","dock.search":"Search","dock.notebook":"筆記本","dock.settings":"設定","settings.theme":"主題","settings.language":"語言","settings.export":"匯出存檔","settings.import":"匯入存檔","settings.reset":"重置進度","toast.saved":"已儲存","toast.evidence":"發現新證據","toast.unlocked":"解鎖新介面"},en:{"app.title":"聽日辭職","app.subtitle":"Dev Life Sim · Offline ARG","dock.vscode":"Vizual Studio Code","dock.intranet":"Intranet","dock.jira":"Jiua","dock.whatsapp":"WhatUp","dock.search":"Search","dock.notebook":"Notebook","dock.settings":"Settings","settings.theme":"Theme","settings.language":"Language","settings.export":"Export Save","settings.import":"Import Save","settings.reset":"Reset Progress","toast.saved":"Saved","toast.evidence":"New evidence","toast.unlocked":"Interface unlocked"}};function te(e){const t=p.get("settings.language")||"zh-TW";return Zt[t]?.[e]??Zt["zh-TW"][e]??e}var se=Vt({renderDock:()=>be,setActiveView:()=>ka});function be({onSwitch:e,onOpenSettings:t,onOpenNotebook:a,t:n}){const i=document.getElementById("dock");if(!i)return;function s(m){return m==="email"?p.hasFlag("ch5_triggered"):!0}const r=localStorage.getItem("cc_active_view")||"vscode",l={vscode:"/icon/vizual-studio-code.svg",intranet:"/icon/file-system.svg",jira:"/icon/jiua.svg",whatsapp:"/icon/whatsup.svg",search:"/icon/browser.svg",email:"/icon/mail.svg"},o={notebook:"/icon/notepad.png"};function c(m,b,x){const g=!s(m),_=r===m?"active":"",B=l[m];let M;return B&&B.startsWith("/icon/")?M=`<img class="taskbar__app-icon-img" src="${B}" alt="${x}" width="22" height="22" loading="eager" />`:B&&B.startsWith("fa-")?m==="jira"?M=`<i class="${B}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(19,91,205,1);--fa-secondary-color:rgba(19,91,205,0.4);color:rgba(19,91,205,1)"></i>`:m==="vscode"?M=`<i class="${B}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(87,165,229,1);--fa-secondary-color:rgba(87,165,229,0.4);color:rgba(87,165,229,1)"></i>`:m==="whatsapp"?M=`<i class="${B}" aria-hidden="true" style="font-size:22px;line-height:1;--fa-primary-color:rgba(0,203,90,1);--fa-secondary-color:rgba(0,203,90,0.4);color:rgba(0,203,90,1)"></i>`:M=`<i class="${B}" aria-hidden="true" style="font-size:22px;line-height:1;color:currentColor"></i>`:B?M=`<img class="taskbar__app-icon-img" src="${B}" alt="${x}" width="22" height="22" loading="eager" />`:M=`<span class="taskbar__app-icon" aria-hidden="true">${b}</span>`,`<button class="taskbar__app ${_}" data-view="${m}" ${g?'disabled title="尚未解鎖"':`title="${x}"`}>
      ${M}
      <span class="taskbar__app-dot"></span>
    </button>`}function u(m,b,x){const g=o[m];return`<button class="taskbar__action" data-action="${m}" title="${x}">${g?`<img class="taskbar__app-icon-img" src="${g}" alt="${x}" width="20" height="20" loading="eager" />`:`<span aria-hidden="true">${b}</span>`}</button>`}i.innerHTML=`
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
        ${c("vscode","🧩",n("dock.vscode"))}
        ${c("whatsapp","💬",n("dock.whatsapp"))}
        ${c("jira","📋",n("dock.jira"))}
        ${c("search","🔍",n("dock.search"))}
        ${c("intranet","🏢",n("dock.intranet"))}
        ${s("email")?c("email","✉️","Email"):""}
        <div class="taskbar__sep"></div>
        ${u("notebook","📒",n("dock.notebook"))}
        <button class="taskbar__action" data-action="settings" title="${n("dock.settings")}">
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
  `,i.querySelectorAll("[data-view]").forEach(m=>{m.addEventListener("click",()=>{if(m.dataset.view==="email"){const b=document.getElementById("mailDialog");if(b){const x=document.getElementById("mailTitle"),g=document.getElementById("mailTo");if(x&&g){const _=x.value;_==="Report"?g.value="DEA <dea@world.example>":(_==="Coperation"||_==="Resign")&&(g.value="Sawyer <sawyer@nori-drinks.example>")}b.showModal()}return}e(m.dataset.view)})}),i.querySelector('[data-action="settings"]')?.addEventListener("click",t),i.querySelector('[data-action="notebook"]')?.addEventListener("click",a),vn()}var Lt=null;function vn(){function e(){const t=new Date,a=document.getElementById("taskbarTime"),n=document.getElementById("taskbarDate");if(!a||!n)return;const i=t.toLocaleTimeString("zh-TW",{hour:"numeric",minute:"2-digit",hour12:!0}),s=t.toLocaleDateString("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit"});a.textContent=i,n.textContent=s}e(),Lt&&clearInterval(Lt),Lt=setInterval(e,6e4)}function ka(e){localStorage.setItem("cc_active_view",e),document.querySelectorAll(".taskbar__app[data-view]").forEach(t=>{t.classList.toggle("active",t.dataset.view===e)}),document.querySelectorAll(".view").forEach(t=>{t.classList.toggle("active",t.id===`view-${e}`)})}function Re(e,t={}){const a=document.getElementById("toasts");if(!a)return;const n=document.createElement("div");n.className="toast",n.textContent=e,t.variant==="error"&&(n.style.background="#7a1f1f"),a.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(4px)",n.style.transition="all .25s",setTimeout(()=>n.remove(),260)},t.duration||2200)}function gn(e,t){const a=new Blob([t],{type:"application/json;charset=utf-8"}),n=URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.download=e,i.click(),URL.revokeObjectURL(n)}function hn(e){return new Promise((t,a)=>{const n=new FileReader;n.onload=()=>t(n.result),n.onerror=a,n.readAsText(e)})}function Ae(){const e=document.getElementById("settingsDialog");e&&(e.showModal?.()||(e.style.display="block"),fn())}function fn(){const e=document.getElementById("settingTheme");e&&(e.value=p.get("settings.theme"));const t=document.getElementById("settingPlaytime");t&&(t.textContent=String(p.get("playtime"))+"s")}function yn(){document.getElementById("settingTheme")?.addEventListener("change",e=>{const t=e.target.value;p.set("settings.theme",t),document.documentElement.setAttribute("data-theme",t),Re(te("toast.saved"))}),document.getElementById("btnExport")?.addEventListener("click",()=>{gn("code-conspiracy-save.json",p.exportSave())}),document.getElementById("btnImport")?.addEventListener("change",async e=>{const t=e.target.files?.[0];if(!t)return;const a=await hn(t),n=p.importSave(a);Re(n?te("toast.saved"):"Import failed",{variant:n?void 0:"error"}),n&&location.reload()}),document.getElementById("btnReset")?.addEventListener("click",async()=>{if(confirm("Reset all progress?")){try{p.reset()}catch{}try{localStorage.removeItem("code_conspiracy_state")}catch{}try{localStorage.clear()}catch{}const e=document.getElementById("settingsDialog");if(e&&e.open)try{e.close()}catch{}e&&(e.style.display="none",e.removeAttribute("open"));try{if("caches"in window){const t=await caches.keys();await Promise.all(t.map(a=>caches.delete(a)))}if("serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();await Promise.all(t.map(a=>a.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)}}),document.getElementById("settingsDialog")?.addEventListener("close",()=>{})}var bn={default:"/assets/data/music/Teacup Corridor (warmer).mp3",darknet:"/assets/data/music/Teacup Corridor.mp3",cooperate:"/assets/data/music/bgm_cowork.mp3",flee:"/assets/data/music/bgm_flee.mp3",fried:"/assets/data/music/bgm_fried.mp3",report:"/assets/data/music/bgm_report.mp3",resign:"/assets/data/music/bgm_resign.mp3"},_n=.25,ea=1500,wn=class{constructor(){this.audio=null,this.currentBgm=null,this.isMuted=!1,this.volume=_n,this.fadeTimer=null,this._loadSettings()}_loadSettings(){const e=p.get("settings");e&&(typeof e.bgmVolume=="number"&&(this.volume=e.bgmVolume),typeof e.bgmMuted=="boolean"&&(this.isMuted=e.bgmMuted))}_saveSettings(){p.set("settings.bgmVolume",this.volume),p.set("settings.bgmMuted",this.isMuted)}_createAudio(e){const t=new Audio(e);return t.loop=!0,t.preload="auto",t.volume=this.isMuted?0:this.volume,t}_fadeVolume(e,t,a,n){this.fadeTimer&&cancelAnimationFrame(this.fadeTimer);const i=performance.now(),s=r=>{const l=r-i,o=Math.min(l/a,1),c=e+(t-e)*o;this.audio&&(this.audio.volume=this.isMuted?0:c),o<1?this.fadeTimer=requestAnimationFrame(s):(this.fadeTimer=null,n&&n())};this.fadeTimer=requestAnimationFrame(s)}_stopCurrent(e=!0){if(!this.audio)return Promise.resolve();const t=this.audio,a=t.volume;return e&&a>0?new Promise(n=>{this._fadeVolume(a,0,ea,()=>{t.pause(),t.src="",n()})}):(t.pause(),t.src="",Promise.resolve())}async play(e){const t=bn[e];if(t&&this.currentBgm!==e){await this._stopCurrent(!0),this.currentBgm=e,this.audio=this._createAudio(t);try{await this.audio.play(),this._fadeVolume(0,this.volume,ea)}catch(a){console.warn("BGM play failed:",a)}}}async stop(e=!0){await this._stopCurrent(e),this.audio=null,this.currentBgm=null}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.audio&&!this.isMuted&&(this.audio.volume=this.volume),this._saveSettings()}getVolume(){return this.volume}toggleMute(){return this.isMuted=!this.isMuted,this.audio&&(this.audio.volume=this.isMuted?0:this.volume),this._saveSettings(),this.isMuted}setMuted(e){this.isMuted=e,this.audio&&(this.audio.volume=this.isMuted?0:this.volume),this._saveSettings()}isMutedState(){return this.isMuted}getCurrentBgm(){return this.currentBgm}},G=new wn,ta=["教學","異常發現","自由探索","暗網入口","秘密曝光","抉擇"],xn=13,kn={vscode:"Vizual",jira:"Jiua",whatsapp:"WhatUp",search:"Search",intranet:"Intranet",darknet:"Darknet",email:"Email"};function Sn(e){return!e||!e.length?"—":e.map(t=>kn[t]||t).join(", ")}function En(e){return[{id:"first_evidence",title:"初次發現",desc:"取得第一個證據",check:()=>e.length>=1},{id:"collector",title:"蒐集者",desc:"取得 5 個證據",check:()=>e.length>=5},{id:"master",title:"真相大師",desc:"取得 10 個證據",check:()=>e.length>=10},{id:"darknet_entered",title:"暗網闖入者",desc:"成功進入暗網",check:()=>p.hasFlag("dark_entered")||p.hasFlag("hidden_portal_accessed")},{id:"darknet_complete",title:"暗網全覽",desc:"開啟所有暗網檔案",check:()=>p.hasFlag("ch4_all_opened")}].map(t=>({...t,done:t.check()}))}function Be(){const e=document.getElementById("notebookDialog");e&&(In(),typeof e.showModal=="function"?e.open||e.showModal():(e.setAttribute("open",""),e.style.display="block"),e._boundClose||(e.addEventListener("close",()=>{e.style.display="none",e.removeAttribute("open")}),e._boundClose=!0))}function In(){const e=document.getElementById("notebookContent");if(!e)return;const t=p.get("collectedEvidence")||[];p.get("flags");const a=p.get("currentChapter")??0,n=En(t),i=n.filter(s=>s.done).length;e.innerHTML=`
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h3 style="margin:0">進度 · Chapter ${a} / 5 — ${ta[a]||"—"}</h3>
        <span class="badge">${t.length} 證據</span>
      </div>
      <div style="margin-top:8px;height:8px;background:var(--bg-tertiary);border-radius:999px;overflow:hidden"><div style="width:${Math.min(100,Math.round(a/5*100))}%;height:100%;background:var(--accent)"></div></div>
      <div class="small muted" style="margin-top:6px">遊玩時長 ${p.get("playtime")}s · 已解鎖 ${Sn(p.get("unlockedInterfaces"))}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">證據板 (${t.length}/${xn})</h3>
      ${t.length?`
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px">
          ${t.map(s=>`
            <div class="card" style="padding:8px;background:var(--bg-primary);border-left:3px solid var(--accent);cursor:grab">
              <div style="font-weight:700;font-size:13px">${s.title}</div>
              <div class="small muted">#${s.id} · ch${s.chapter} · ${s.type}</div>
              <div class="small muted" style="margin-top:4px">${new Date(s.discoveredAt).toLocaleDateString("zh-TW")}</div>
              <div style="margin-top:6px;display:flex;gap:4px">
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="navigator.clipboard.writeText('${s.title}')">複製</button>
                <button class="btn" style="padding:2px 6px;font-size:11px" onclick="alert('已標記: ${s.title}')">標記</button>
              </div>
            </div>
          `).join("")}
        </div>
      `:'<div class="muted small">尚未發現證據。完成 Ch0 工單後開始探索吧。</div>'}
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">成就 (${i}/${n.length})</h3>
      <div style="display:grid;gap:6px">
        ${n.map(s=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:${s.done?"var(--bg-tertiary)":"var(--bg-primary)"};opacity:${s.done?1:.6}">
          <div><div style="font-weight:600;font-size:13px">${s.done?"✓":""} ${s.title}</div><div class="small muted">${s.desc}</div></div>
          <span class="badge" style="background:${s.done?"var(--success)":"var(--border)"};color:${s.done?"#fff":"var(--fg-muted)"}">${s.done?"已解鎖":"未解鎖"}</span>
        </div>`).join("")}
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">背景音樂</h3>
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn" id="bgmMuteBtn" style="min-width:48px">${G.isMutedState()?"🔇":"🔊"}</button>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px">
          <input type="range" id="bgmVolumeSlider" min="0" max="100" value="${Math.round(G.getVolume()*100)}" style="width:100%;accent-color:var(--accent)" />
          <div class="small muted" style="text-align:center">${Math.round(G.getVolume()*100)}%</div>
        </div>
      </div>
      <div class="small muted" style="margin-top:6px">正在播放：${G.getCurrentBgm()||"無"}</div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3 style="margin:0 0 8px">章節</h3>
      <div style="display:grid;gap:4px">
        ${ta.map((s,r)=>`<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:${r<=a?"var(--bg-tertiary)":"var(--bg-primary)"};border:1px solid var(--border)"><span>Ch${r} ${s}</span><span class="small ${r<a?"":r===a?"badge":""}" style="${r===a?"background:var(--accent);color:#fff":""}">${r<a?"完成":r===a?"進行中":"未開始"}</span></div>`).join("")}
      </div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="navigator.clipboard.writeText(JSON.stringify(JSON.parse(localStorage.getItem('code_conspiracy_state')||'{}'), null, 2))">複製存檔 JSON</button>
      <button class="btn" id="notebookResetBtn">重置 notebook</button>
    </div>
  `,setTimeout(()=>{const s=document.getElementById("notebookResetBtn");if(!s||s._bound)return;s._bound=!0,s.addEventListener("click",async()=>{if(!confirm("重置後將失去證據，確定？"))return;const o=document.getElementById("notebookDialog");try{o&&o.open&&o.close()}catch{}o&&(o.style.display="none",o.removeAttribute("open"));try{p.reset()}catch{}try{localStorage.removeItem("code_conspiracy_state")}catch{}try{localStorage.clear()}catch{}try{if("caches"in window){const c=await caches.keys();await Promise.all(c.map(u=>caches.delete(u)))}if("serviceWorker"in navigator){const c=await navigator.serviceWorker.getRegistrations();await Promise.all(c.map(u=>u.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)});const r=document.getElementById("bgmMuteBtn"),l=document.getElementById("bgmVolumeSlider");r&&!r._bound&&(r._bound=!0,r.addEventListener("click",()=>{const o=G.toggleMute();r.textContent=o?"🔇":"🔊";const c=r.parentElement?.querySelector(".small");c&&(c.textContent=o?"靜音":Math.round(G.getVolume()*100)+"%")})),l&&!l._bound&&(l._bound=!0,l.addEventListener("input",o=>{const c=parseInt(o.target.value)/100;G.setVolume(c),G.setMuted(!1),r&&(r.textContent="🔊");const u=l.parentElement?.querySelector(".small");u&&(u.textContent=Math.round(c*100)+"%")}))},0)}function d(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}var Ln="modulepreload",Cn=function(e){return"/arg-game-it-company-secret/"+e},aa={},j=function(t,a,n){let i=Promise.resolve();if(a&&a.length>0){let c=function(m){return Promise.all(m.map(b=>Promise.resolve(b).then(x=>({status:"fulfilled",value:x}),x=>({status:"rejected",reason:x}))))},u=function(m){return import.meta.resolve?import.meta.resolve(m):new URL(m,import.meta.url).href};const r=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),o=l?.nonce||l?.getAttribute("nonce");i=c(a.map(m=>{if(m=Cn(m,n),m=u(m),m in aa)return;aa[m]=!0;const b=m.endsWith(".css");for(let g=r.length-1;g>=0;g--){const _=r[g];if(_.href===m&&(!b||_.rel==="stylesheet"))return}const x=document.createElement("link");if(x.rel=b?"stylesheet":Ln,b||(x.as="script"),x.crossOrigin="",x.href=m,o&&x.setAttribute("nonce",o),document.head.appendChild(x),b)return new Promise((g,_)=>{x.addEventListener("load",g),x.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${m}`)))})}))}function s(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return i.then(r=>{for(const l of r||[])l.status==="rejected"&&s(l.reason);return t().catch(s)})},N="/customer-portal/src/main/java/com/nori/OrderService.java",J="explorer",ye=[],X=-1,ut="",H=new Map,ke=null,na=null;function qe(e){const t=k.getFile(e);return t?t.content:null}function Pt(e){return H.has(e)?H.get(e):qe(e)}function Sa(e){return H.has(e)?H.get(e)!==qe(e):!1}function $n(e,t){t===qe(e)?H.delete(e):H.set(e,t),ie(),Ee()}function qt(){if(!ke){const e=k.getFile("/file-system/src/components/SearchBar.jsx");e&&(ke=e.content)}}function Tn(){if(!na){const e=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx");e&&(na=e.content)}}var An=`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
      <p>創辦人 蔡梓掦 · 2018 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`,Bn=`export default function Home(){
  return (
    <div>
      <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>
      <p>創辦人 蔡梓掦 · 2019 創立 · 招牌冰釀茶酒最暢銷</p>
      <nav><a href="/drinks">飲品一覽</a> | <a href="/about">關於我們</a></nav>
    </div>
  );
}
`;function Ea(){return p.hasFlag("ch1_0043_committed")&&!p.hasFlag("ch1_revert_done")}function Ia(e="revert"){p.hasFlag("ch1_revert_done")||(p.setFlag("ch1_revert_done",!0),p.setFlag("ch1_system_down",!1),setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(t=>{const a=(t.getChats?t.getChats():[]).find(n=>n.id==="system-alert");if(a){a.messages.push({id:"health-"+Date.now(),from:"system",text:"✅ 系統健康 — 所有服務已恢復正常",time:new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}),read:"delivered",type:"text"}),a.preview="✅ 系統健康",a.unread=(a.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"system-alert"}}));const n=document.createElement("div");n.id="wa-win-notif-health-"+Date.now(),n.setAttribute("role","alert"),n.innerHTML='<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">System Alert</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #0d9488, #25D366)">✓</div><div class="win-notif__text"><div class="win-notif__sender">System Alert</div><div class="win-notif__msg">✅ 系統健康 — 所有服務已恢復正常</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 10000ms linear forwards"></div>',n.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",n.addEventListener("click",i=>{i.target.closest(".win-notif__close")||(n.remove(),j(()=>Promise.resolve().then(()=>se).then(s=>{s.setActiveView&&(s.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),j(()=>Promise.resolve().then(()=>ue).then(s=>s.openChat("system-alert")),void 0))}),n.querySelector(".win-notif__close")?.addEventListener("click",i=>{i.stopPropagation(),n.remove()}),document.body.appendChild(n),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="none"}),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(8px)",setTimeout(()=>n.remove(),300)},1e4)}}),void 0)},500))}function jn(e){const t=ge.find(s=>s.hash===e)||Se.find(s=>s.hash===e);if(!t)return;if(t.msg.includes("INV-2024-0017")||t.hash==="3f2a9c1"){const s=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx")?.content||"",r=s.includes("連結人與希望")||s.includes("2018 創立"),l=r?Bn:An;k.registerFile("/customer-portal/src/frontend/src/pages/Home.jsx",{content:l,meta:{lang:"javascript"}});const o=k.getFile("/customer-portal/src/frontend/src/pages/Home.jsx");o&&(o.content=l),H.delete("/customer-portal/src/frontend/src/pages/Home.jsx");const c=Math.random().toString(36).slice(2,8),u=r?`revert: restore Home.jsx fix (revert ${e} — apply Parker fix)`:`revert: revert Home.jsx fix (revert ${e} — back to bug)`,m=r?`M /customer-portal/src/frontend/src/pages/Home.jsx
- 連結人與希望 / 2018
+ 連結人與風味 / 2019 (revert apply)`:`M /customer-portal/src/frontend/src/pages/Home.jsx
- 連結人與風味 / 2019
+ 連結人與希望 / 2018 (revert)`;Se.unshift({hash:c,author:"Parker",date:new Date().toISOString().slice(0,10),msg:u,diff:m}),ge.unshift({hash:c,branch:"main",author:"Parker",date:new Date().toISOString().slice(0,10),msg:u,diff:m});const b=document.getElementById("scmCommitStatus");b&&(b.innerHTML=`<span style="color:var(--success)">✓ Revert 成功: ${c} (from ${e}) — ${r?"已套用 Parker 修復":"已回退至 bug 版"}</span>`),L(`✓ revert ${c} — ${u}`),ie(),he(),Ee(),me&&xe();return}if(!Ea())return;if(qt(),ke){k.registerFile("/file-system/src/components/SearchBar.jsx",{content:ke,meta:{lang:"javascript"}});const s=k.getFile("/file-system/src/components/SearchBar.jsx");s&&(s.content=ke)}H.delete("/file-system/src/components/SearchBar.jsx");const a=Math.random().toString(36).slice(2,8),n=`revert: restore SearchBar legacyRoutes (revert ${e})`;Se.unshift({hash:a,author:"Casey",date:new Date().toISOString().slice(0,10),msg:n,diff:`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes / resolveLegacyPath`}),ge.unshift({hash:a,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:n,diff:`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes`});const i=document.getElementById("scmCommitStatus");i&&(i.innerHTML=`<span style="color:var(--success)">✓ Revert 成功: ${a} (from ${e})</span>`),L(`✓ revert ${a} — ${n}`),ie(),he(),Ee(),me&&xe(),Ia("git-graph")}var Se=[{hash:"a1b2c3d",author:"finance@internal",date:"2024-08-12",msg:"feat: integrate crypto-mixer (legacy)",diff:`+ import { cryptoMixer } from '@shady/crypto-mixer'
  feeRate table added: drink-001 0.05, drink-002 0.08`},{hash:"9f8e7d6",author:"parker",date:"2024-08-10",msg:"fix: rounding edge case",diff:`- if (total > 1000) {
+ if (total >= 1000) {`},{hash:"3f2a9c1",author:"Parker",date:"2024-02-14",msg:"(INV-2024-0017) fix: correct homepage hero slogan and founded year (2018→2019)",diff:`M /customer-portal/src/frontend/src/pages/Home.jsx
- <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與希望</h1>
+ <h1>Nori 飲品供應 — 用一杯冰釀茶酒，連結人與風味</h1>
- <p>創辦人 蔡梓掦 · 2018 創立</p>
+ <p>創辦人 蔡梓掦 · 2019 創立</p>`},{hash:"4c2a1e0",author:"dev",date:"2024-08-01",msg:"chore: init billing service",diff:`+ export function calculateAmount(items, opts) {}
+ export function computeFee(amount, opts) {}`}],ia={"/customer-portal/src/billing/service.js":[{line:1,commit:"4c2a1e0",author:"dev"},{line:5,commit:"4c2a1e0",author:"dev"},{line:9,commit:"9f8e7d6",author:"qa-lee"},{line:12,commit:"9f8e7d6",author:"qa-lee"},{line:14,commit:"a1b2c3d",author:"finance@internal"}],"/customer-portal/src/main/java/com/nori/OrderService.java":[{line:1,commit:"4c2a1e0",author:"dev"},{line:12,commit:"9f8e7d6",author:"qa-lee"},{line:15,commit:"a1b2c3d",author:"finance@internal"}]},ae="__GIT_GRAPH__",me=!1,Je=null,sa={main:"#89d185","feature/vip-discount":"#4da3ff","feature/crypto-mixer":"#dcdcaa","feature/billing-fix":"#ce9178","feature/home-copyfix":"#4ec9b0",develop:"#c586c0"},ge=[{hash:"a1b2c3d",branch:"feature/crypto-mixer",author:"finance@internal",date:"2024-08-12",msg:"(INV-2024-0040) feat: integrate crypto-mixer (legacy)",diff:`+ import { cryptoMixer } from '@shady/crypto-mixer'
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
+ <p>創辦人 蔡梓掦 · 2019 創立</p>`},{hash:"d4e5f6a",branch:"main",author:"dev-chen",date:"2023-11-20",msg:"(INV-2023-0039) refactor: simplify portal auth (remove dynamic generator)",diff:"- function generateInternalPortalPath(internalPortalDomain){ \n-     const cid = redis.get('companyId'); \n-     const y = redis.get('year'); \n-     const k = import.meta.env.MD5_KEY; \n-     return internalPortalDomain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); \n-     }"}];function Pn(){const e=document.getElementById("view-vscode");e&&(e.innerHTML=`
    <div class="vscode">
      <!-- Vizual Studio Code Title Bar -->
      <div class="vscode__titlebar" role="banner">
        <div class="titlebar__left">
          <span class="vscode__logo" aria-hidden="true">
            <img src="/icon/vizual-studio-code.svg" alt="Vizual Studio Code" width="16" height="16" style="width:16px;height:16px;object-fit:contain" />
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
  `,qt(),Tn(),he(),ie(),Q(N),Mn(),Vn(),Ee(),Wn())}function Mn(){document.getElementById("vsQuickOpen")?.addEventListener("input",i=>{he(i.target.value.trim().toLowerCase())});const e=document.getElementById("vsSearchInput"),t=document.getElementById("vsSearchResult");t&&(t.textContent="");function a(i){const s=i.trim().toLowerCase();if(!s){t&&(t.textContent="");return}const r=s.includes("nori-intranet/internal/portal")||s==="https://nori-intranet/internal/portal",l=s.includes("internal/portal")||s==="internal"||s==="portal"||s.includes("internal")&&s.includes("portal")||r,o=s.includes("internal")||s.includes("portal")||r,c=s.includes("switch")||s.includes("case")||s.toLowerCase().includes("vipprice")||s.includes("price")||s.includes("vip"),u=s.includes("md5_key")||s.includes("md5key")||s.includes("md5")||s.includes("key");if(l||o){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="SearchBar">📄 file-system/src/components/SearchBar.jsx — 匹配 "${d(i)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{Q("/file-system/src/components/SearchBar.jsx"),document.getElementById("vsSearchInput")?.focus()}));return}if(c){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open="OrderService">📄 customer-portal/src/main/java/com/nori/OrderService.java — 匹配 "${d(i)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{Q("/customer-portal/src/main/java/com/nori/OrderService.java")}));return}if(u){t&&(t.innerHTML=`<div class="small" style="color:var(--fg-primary);cursor:pointer;padding:6px;border:1px solid var(--border);border-radius:6px;background:var(--bg-tertiary)" data-open=".env">📄 /customer-portal/.env — 匹配 "${d(i)}" <span style="color:var(--accent);margin-left:6px">開啟 →</span></div>`,t.querySelector("[data-open]")?.addEventListener("click",()=>{Q("/customer-portal/.env")}));return}t&&(t.textContent="")}e?.addEventListener("input",i=>a(i.target.value)),e?.addEventListener("keydown",i=>{i.key==="Enter"&&a(i.target.value)}),document.querySelectorAll(".activitybar__btn[data-activity]").forEach(i=>{i.addEventListener("click",()=>{J=i.dataset.activity,gt()})}),document.querySelector('[data-help="1"]')?.addEventListener("click",()=>{const i=document.getElementById("vsHelpOverlay");i&&(i.style.display=i.style.display==="none"||!i.style.display?"flex":"none")}),document.getElementById("vsHelpOverlay")?.addEventListener("click",i=>{i.target.id==="vsHelpOverlay"&&(i.target.style.display="none")}),document.getElementById("sonarModalClose")?.addEventListener("click",()=>{document.getElementById("sonarModal").style.display="none"}),document.getElementById("sonarModal")?.addEventListener("click",i=>{i.target.id==="sonarModal"&&(i.target.style.display="none")}),document.getElementById("scmCommitBtn")?.addEventListener("click",Hn),document.getElementById("scmGraphBtn")?.addEventListener("click",La),document.getElementById("vsTerminalInput")?.addEventListener("keydown",Rn);const n=document.getElementById("quickOpenInput");n?.addEventListener("input",i=>Ca(i.target.value)),n?.addEventListener("keydown",Gn),document.getElementById("quickOpen")?.addEventListener("click",i=>{i.target.id==="quickOpen"&&et()})}function gt(){document.querySelectorAll(".activitybar__btn[data-activity]").forEach(a=>{a.classList.toggle("active",a.dataset.activity===J)});const e=document.getElementById("vsSideTitle"),t={explorer:"EXPLORER",search:"SEARCH",scm:"SOURCE CONTROL",debug:"RUN AND DEBUG",extensions:"EXTENSIONS"};e&&(e.textContent=t[J]||"EXPLORER"),document.getElementById("vsSideContent").style.display=J==="explorer"?"flex":"none",document.getElementById("vsPanelSearch").style.display=J==="search"?"flex":"none",document.getElementById("vsPanelScm").style.display=J==="scm"?"flex":"none",document.getElementById("vsPanelDebug").style.display=J==="debug"?"flex":"none",document.getElementById("vsPanelExtensions").style.display=J==="extensions"?"flex":"none",J==="scm"&&Ee()}function he(e=""){const t=document.getElementById("vsTree");if(!t)return;const a=k.buildTree(),n=["/file-system","/customer-portal"];function i(l){return n.some(o=>l===o||l.startsWith(o+"/"))}function s(l,o=0){if(!i(l.path)&&l.path!=="/file-system"&&l.path!=="/customer-portal"&&(l.path==="/"||l.path==="/intranet"||l.path==="/internal"))return"";if(l.type==="dir"){const c=(l.children||[]).filter(u=>i(u.path)&&(!e||u.path.toLowerCase().includes(e)||r(u,e)));return e&&c.length===0&&!l.path.toLowerCase().includes(e)?"":!i(l.path)&&l.path!=="/"?c.map(u=>s(u,o)).join(""):`<div class="tree__node tree__node--dir" style="padding-left:${8+o*8}px" data-path="${l.path}" title="${d(l.path)}">📁 <span class="tree__label">${d(l.name)}</span></div>
        <div class="tree__children">${c.map(u=>s(u,o+1)).join("")}</div>`}else{if(!i(l.path)||e&&!l.path.toLowerCase().includes(e))return"";const c=l.path===N?"active":"",u=Sa(l.path)?"●":"";return`<div class="tree__node ${c}" data-path="${l.path}" data-file="1" style="padding-left:${8+o*8}px" title="${d(l.path)}">📄 <span class="tree__label">${d(l.name)}</span> <span style="margin-left:auto;font-size:10px;color:var(--warning);flex-shrink:0">${u}</span></div>`}}function r(l,o){return i(l.path)?l.path.toLowerCase().includes(o)?!0:l.children?l.children.some(c=>r(c,o)):!1:!1}t.innerHTML=a.children.filter(l=>i(l.path)).map(l=>s(l,0)).join(""),t.querySelectorAll('[data-file="1"]').forEach(l=>{l.addEventListener("click",()=>Q(l.dataset.path))})}function ie(){const e=document.getElementById("vsTabs");if(!e)return;const t=k.listFiles("/customer-portal").slice(0,8);if(!t.some(a=>a.path===N)&&N!==ae){const a=k.getFile(N);a&&t.unshift({path:N,...a})}if(!t.some(a=>a.path==="/customer-portal/src/main/java/com/nori/OrderService.java")){const a=k.getFile("/customer-portal/src/main/java/com/nori/OrderService.java");a&&t.unshift({path:"/customer-portal/src/main/java/com/nori/OrderService.java",...a})}me&&!t.some(a=>a.path===ae)&&t.push({path:ae,name:"Git Graph"}),e.innerHTML=t.map(a=>{if(a.path===ae){const i=a.path===N?"active":"";return`<div class="vscode__tab ${i}" data-path="${ae}"><span class="vscode__tab-dot" style="display:${i?"block":"none"}"></span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" style="flex-shrink:0"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg> Git Graph <span class="vscode__tab-close" data-close-graph="1" title="Close" style="margin-left:6px;opacity:.6;font-size:12px;cursor:pointer">✕</span></div>`}const n=Sa(a.path)?'<span style="color:var(--warning);font-size:12px">●</span>':"";return`<div class="vscode__tab ${a.path===N?"active":""}" data-path="${a.path}"><span class="vscode__tab-dot"></span>${d(a.path.split("/").pop()||a.path)} ${n} <span style="opacity:.6;font-size:11px;margin-left:4px">${a.path===N?"●":""}</span></div>`}).join(""),e.querySelectorAll(".vscode__tab").forEach(a=>a.addEventListener("click",n=>{if(n.target.closest("[data-close-graph]")){n.stopPropagation(),Dn();return}Q(a.dataset.path)}))}function La(){me=!0,Je=null,Q(ae)}function Dn(){me=!1,Je=null,N===ae&&(N="/customer-portal/src/main/java/com/nori/OrderService.java"),ie(),Q(N)}function xe(){const e=document.getElementById("vsEditor");if(!e)return;const t=document.getElementById("vsTitle");t&&(t.textContent="Git Graph — nori-system — Vizual Studio Code"),ie();const a=Ea(),n=ge.map((i,s)=>{const r=sa[i.branch]||"var(--accent)",l=Je===i.hash,o=i.diff.split(`
`).map(b=>{const x=d(b);return b.startsWith("+")?`<div class="diff-add">${x}</div>`:b.startsWith("-")?`<div class="diff-del">${x}</div>`:`<div>${x}</div>`}).join(""),c=i.author==="Casey"&&(i.diff.includes("SearchBar")||i.diff.includes("legacyRoutes")||i.msg.includes("0043")),u=(i.hash==="3f2a9c1"||i.msg.includes("INV-2024-0017"))&&i.author==="Parker",m=a&&c&&!p.hasFlag("ch1_revert_done")&&p.hasFlag("sawyer_seq_started")||u;return`
      <div class="gitgraph-row ${l?"expanded":""}" data-hash="${i.hash}">
        <div class="gitgraph-row__main">
          <div class="gitgraph-graph-col">
            <span class="gitgraph-dot" style="background:${r};box-shadow:0 0 0 2px ${r}33"></span>
            ${s<ge.length-1?'<span class="gitgraph-vline"></span>':""}
          </div>
          <div class="gitgraph-info">
            <div class="gitgraph-top">
              <span class="gitgraph-branch" style="background:${r}22;color:${r};border-color:${r}44">${d(i.branch)}</span>
              <span class="mono gitgraph-hash" style="color:${r}">${d(i.hash)}</span>
              <span class="gitgraph-date">${d(i.date)}</span>
              <span class="gitgraph-author">${d(i.author)}</span>
              ${m?`<button class="btn small gitgraph-revert-btn" data-revert="${d(i.hash)}" title="Revert this commit" style="margin-left:8px;padding:3px 8px;font-size:11px;border-color:var(--error);color:var(--error);background:transparent">↩ Revert</button>`:""}
            </div>
            <div class="gitgraph-msg">${d(i.msg)}</div>
          </div>
          <span class="gitgraph-chevron">${l?"▾":"▸"}</span>
        </div>
        ${l?`<div class="gitgraph-diff"><div class="gitgraph-diff__header">Commit ${d(i.hash)} — ${d(i.date)} · ${d(i.author)}</div><pre class="gitgraph-diff__content">${o}</pre></div>`:""}
      </div>
    `}).join("");e.innerHTML=`
    <div class="gitgraph-editor">
      <div class="gitgraph-editor__header">
        <div style="display:flex;align-items:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="12" r="3"/><path d="M8.3 7.3L15.7 10.7"/><path d="M8.3 16.7L15.7 13.3"/></svg>
          <b>Git Graph</b>
          <span class="small muted">${ge.length} commits — 5 branches</span>
        </div>
        <div class="gitgraph-legend">
          ${Object.entries(sa).map(([i,s])=>`<span class="gitgraph-branch" style="background:${s}22;color:${s};border-color:${s}44">${d(i)}</span>`).join("")}
        </div>
      </div>
      <div class="gitgraph-list">
        ${n}
      </div>
      <div class="small muted" style="padding:8px 12px;border-top:1px solid var(--border)">點擊任一 commit 展開 / 收合 diff · 最新提交在上方</div>
    </div>
  `,e.querySelectorAll(".gitgraph-row__main").forEach(i=>{i.addEventListener("click",s=>{if(s.target.closest(".gitgraph-revert-btn"))return;const r=i.closest(".gitgraph-row")?.dataset.hash;r&&(Je=Je===r?null:r,xe())})}),e.querySelectorAll(".gitgraph-revert-btn").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const r=i.dataset.revert;r&&jn(r)})}),L("$ open Git Graph")}function On(e){const t=e.split(`
`).filter(n=>n.trim()!=="");if(!t.length)return{header:[],rows:[]};const a=n=>{const i=[];let s="",r=!1;for(let l=0;l<n.length;l++){const o=n[l];o==='"'?r&&n[l+1]==='"'?(s+='"',l++):r=!r:o===","&&!r?(i.push(s),s=""):s+=o}return i.push(s),i};return{header:a(t[0]),rows:t.slice(1).map(a)}}function Fn(e,t){const{header:a,rows:n}=On(t),i=`<thead><tr>${a.map(r=>`<th>${d(r)}</th>`).join("")}</tr></thead>`,s=`<tbody>${n.map((r,l)=>`<tr>${r.map(o=>`<td>${d(o)}</td>`).join("")}${r.length<a.length?`<td colspan="${a.length-r.length}"></td>`:""}</tr>`).join("")}</tbody>`;return`
    <div class="csv-view">
      <div class="csv-view__header">
        <span class="small muted mono">${d(e)} — 表格檢視（Excel 樣式）</span>
        <span class="small muted">${n.length} 列 × ${a.length} 欄</span>
      </div>
      <div class="csv-view__table-wrap">
        <table class="csv-table">${i}${s}</table>
      </div>
    </div>
  `}function Q(e){if(e===ae){N=e,xe(),he(document.getElementById("vsQuickOpen")?.value.trim().toLowerCase()||"");return}N=e;const t=k.getFile(e),a=Pt(e),n=document.getElementById("vsEditor");if(!n)return;if((e==="/customer-portal/src/main/java/com/nori/OrderService.java"||e==="/customer-portal/src/billing/service.js")&&qa("vscode_viewed"),a==null)n.innerHTML='<div class="editor__lines" style="padding:16px;color:var(--fg-muted)">檔案不存在或尚未解鎖 — 嘗試 Search 搜尋 "Sawyer" 或觸發隱藏邏輯</div>';else if(e.toLowerCase().endsWith(".csv"))n.innerHTML=Fn(e,a);else{const s=t?.meta?.lang||(e.endsWith(".py")?"python":e.endsWith(".java")?"java":"javascript");n.innerHTML=`
      <div class="editor__editable-wrap">
        <div class="editor__gutter" style="padding:12px 0;min-width:52px">${a.split(`
`).map((l,o)=>`<div class="editor__gutter-line" style="height:20px;line-height:20px">${o+1}</div>`).join("")}</div>
        <textarea id="vsEditorArea" class="editor__textarea" spellcheck="false" data-path="${d(e)}" data-lang="${s}">${d(a)}</textarea>
      </div>
    `;const r=document.getElementById("vsEditorArea");r&&(r.addEventListener("input",l=>{const o=l.target.value;$n(e,o);const c=o.split(`
`).length,u=n.querySelector(".editor__gutter");u&&(u.innerHTML=Array.from({length:c},(B,M)=>`<div class="editor__gutter-line" style="height:20px;line-height:20px">${M+1}</div>`).join(""));const m=r.selectionStart,b=o.slice(0,m),x=b.split(`
`).length,g=b.split(`
`).pop().length+1,_=document.getElementById("vsCursorInfo");_&&(_.textContent=`Ln ${x}, Col ${g}`)}),r.addEventListener("click",l=>{const o=r.selectionStart,c=r.value.slice(0,o),u=c.split(`
`).length,m=c.split(`
`).pop().length+1,b=document.getElementById("vsCursorInfo");b&&(b.textContent=`Ln ${u}, Col ${m}`)}),r.addEventListener("keydown",l=>{if(l.key==="Tab"){l.preventDefault();const o=r.selectionStart,c=r.selectionEnd;r.value=r.value.substring(0,o)+"  "+r.value.substring(c),r.selectionStart=r.selectionEnd=o+2,r.dispatchEvent(new Event("input"))}}),e.includes("OrderService")&&setTimeout(()=>r.focus(),50))}const i=document.getElementById("vsTitle");i&&(i.textContent=`${e.split("/").pop()} — ${e} — nori-system — Vizual Studio Code`),he(document.getElementById("vsQuickOpen")?.value.trim().toLowerCase()||""),ie(),L(`$ open ${e}`)}function Ee(){const e=document.getElementById("scmChanges");if(!e)return;const t=[...H.entries()].filter(([a,n])=>n!==qe(a));if(!t.length){e.innerHTML=`<div class="small muted" style="padding:8px 0">修改完成後在這邊提交
 目前沒有變更 — 編輯後的改動會顯示於此</div>`;return}e.innerHTML=`
    <div class="small" style="font-weight:600;margin:10px 0 6px">變更 (${t.length})</div>
    ${t.map(([a])=>{const n=a.split("/").pop();return`<div class="scm__file" data-path="${d(a)}" title="${d(a)}">
        <span style="color:var(--warning)">M</span> ${d(n)} <span class="small muted" style="margin-left:auto">${d(a)}</span>
      </div>`}).join("")}
  `,e.querySelectorAll(".scm__file").forEach(a=>a.addEventListener("click",()=>Q(a.dataset.path)))}function Nn(e){const t={1:.9,2:.85,3:.8,4:.75,5:.7},a=e.split(`
`),n={};let i=null,s="";a.forEach((r,l)=>{const o=r.match(/case\s*([1-5])\s*:\s*price\s*\*=\s*([0-9.]+%?)/i);if(o){const c=parseInt(o[1],10);let u=o[2].replace("%","").trim(),m=parseFloat(u);m>1&&(m=m/100),n[c]={val:m,line:l+1,raw:r.trim()}}else{const c=r.match(/case\s*([1-5])\s*:\s*price\s*=\s*price\s*\*\s*([0-9.]+)/i);if(c){const u=parseInt(c[1],10);let m=parseFloat(c[2]);m>1&&(m=m/100),n[u]={val:m,line:l+1,raw:r.trim()}}}});for(let r=1;r<=5;r++){const l=t[r],o=n[r];if(!o)return i=a.findIndex(c=>c.includes(`case ${r}:`))+1||18+r,s=`缺少 case ${r} 或格式無法解析`,{ok:!1,line:i,detail:s,found:n};if(Math.abs(o.val-l)>.001)return{ok:!1,line:o.line,detail:`VIP${r} 應為 ${(l*100).toFixed(0)}% (0.${String(l).split(".")[1].padEnd(2,"0")})，目前為 ${(o.val*100).toFixed(0)}%`,found:n}}return{ok:!0,found:n}}function Hn(){const e=document.getElementById("scmCommitMsg"),t=document.getElementById("scmCommitStatus"),a=e?.value.trim()||"fix: correct VIP discount";if(![...H.entries()].filter(([I,h])=>h!==qe(I)).length){t&&(t.textContent="沒有變更可提交 — 請先編輯 OrderService.java");return}const n="/customer-portal/src/main/java/com/nori/OrderService.java",i=Pt(n);if(i==null){t&&(t.textContent="找不到 OrderService.java");return}const s=Nn(i);if(!s.ok){const I=document.getElementById("sonarModal"),h=document.getElementById("sonarModalBody");h&&(h.textContent=`SonarQube 掃描失敗 — 計算錯誤

檔案: ${n}
行號: ${s.line}
錯誤: ${s.detail}

規則: VIP 折扣應為 VIP1 90%、VIP2 85%、VIP3 80%、VIP4 75%、VIP5 70%

請修正後重新 Commit。`),I&&(I.style.display="flex"),t&&(t.innerHTML=`<span style="color:var(--error)">✕ SonarQube: 行 ${s.line} 計算錯誤</span>`),L(`✕ commit 失敗 — SonarQube 行 ${s.line}: ${s.detail}`);return}const r="/file-system/src/components/SearchBar.jsx",l=qe(r)||"",o=Pt(r)||l,c=o.includes("legacyRoutes"),u=o.includes("resolveLegacyPath"),m=l.includes("legacyRoutes")&&!c&&!u;if(Array.from(H.keys()).includes(r),p.hasFlag("ch0_vip_fixed")&&!p.hasFlag("ch1_0043_committed")&&!m){const I=document.getElementById("sonarModal"),h=document.getElementById("sonarModalBody");if(h){const y=`const legacyRoutes = {
    archive: "/internal/portal",
    documents: "/documents"
};
function resolveLegacyPath(path) {
    return legacyRoutes[path] || path;
}`;h.textContent=`SonarQube 掃描失敗 — 未移除已棄用的 legacy 入口

檔案: ${r}
錯誤: 偵測到未移除的 legacyRoutes / resolveLegacyPath 區塊

此為已關閉的入口，必須移除以下其中一段程式碼：

— 選項 A (精簡版):
${y}

— 選項 B (含註解版):
${`// Legacy filesystem compatibility
// TODO: remove after migration
// Filesystem v2 migration completed, no longer used
`+y}

請刪除其中一段後重新 Commit，INV-2024-0043 才會移至 Done。`}I&&(I.style.display="flex"),t&&(t.innerHTML='<span style="color:var(--error)">✕ SonarQube: 尚未移除 legacyRoutes 區塊 (SearchBar.jsx)</span>');return}if(m&&p.hasFlag("ch0_vip_fixed")&&!p.hasFlag("ch1_0043_committed")){let y=function({appSub:v,sender:f,avatarBg:T,avatarText:$,msg:q,chatId:Le,duration:De}){const Ce=De||4e3,D=document.createElement("div");return D.id="wa-win-notif-"+Date.now()+"-"+Math.random().toString(36).slice(2,6),D.setAttribute("role","alert"),D.innerHTML=`<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">${d(v)}</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:${T}">${d($)}</div><div class="win-notif__text"><div class="win-notif__sender">${d(f)}</div><div class="win-notif__msg">${d(q)}</div><div class="win-notif__time">剛剛 · 點擊開啟對話</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink ${Ce}ms linear forwards"></div>`,D.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",D.addEventListener("click",fe=>{fe.target.closest(".win-notif__close")||(D.remove(),j(()=>Promise.resolve().then(()=>se).then(le=>{le.setActiveView&&(le.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),Le&&j(()=>Promise.resolve().then(()=>ue).then(le=>le.openChat(Le)),void 0))}),D.querySelector(".win-notif__close")?.addEventListener("click",fe=>{fe.stopPropagation(),D.remove()}),document.body.appendChild(D),requestAnimationFrame(()=>{D.style.opacity="1",D.style.transform="none"}),setTimeout(()=>{D.style.opacity="0",D.style.transform="translateY(8px)",setTimeout(()=>D.remove(),300)},Ce),D};p.setFlag("ch1_0043_committed",!0);const I=Math.random().toString(36).slice(2,8),h=Array.from(H.entries()).map(([v,f])=>`M ${v}`).join(`
`);Se.unshift({hash:I,author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:h}),ge.unshift({hash:I,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:h});for(const[v,f]of H.entries()){const T=k.getFile(v);T&&(T.content=f),k.registerFile(v,{content:f,meta:{lang:v.endsWith(".java")?"java":v.endsWith(".js")?"javascript":"text"}})}H.clear(),e&&(e.value=""),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功: ${I}</span>`),L(`✓ commit ${I} — ${a}`),ie(),he(),Ee(),me&&N===ae&&xe();try{j(()=>Promise.resolve().then(()=>Qe).then(v=>v.markTicketDone&&v.markTicketDone("INV-2024-0043")),void 0)}catch{}setTimeout(()=>{p.setFlag("ch1_system_down",!0);let v=0;const f=setInterval(()=>{if(!p.hasFlag("ch1_system_down")||p.hasFlag("ch1_revert_done")){clearInterval(f);return}v++,j(()=>Promise.resolve().then(()=>ue).then(T=>{const $=(T.getChats?T.getChats():[]).find(q=>q.id==="system-alert");if($){const q=`⚠️ 警告 #${v}: 系統異常 — 檢測到異常，請檢查最近變更`;$.messages.push({id:"alert-"+Date.now()+"-"+v,from:"system",text:q,time:new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}),read:"delivered",type:"text"}),$.preview=`⚠️ 警告 #${v}: 系統異常`,$.unread=($.unread||0)+1,$.lastTime="剛剛",window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"system-alert"}}))}y({appSub:"System Alert",sender:"System Alert",avatarBg:"linear-gradient(135deg, #d93025, #fbbc05)",avatarText:"!",msg:`⚠️ 警告 #${v}: 系統異常 — 檢測到異常`,chatId:"system-alert",duration:4e3})}),void 0),v===5&&(setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(T=>{const $=(T.getChats?T.getChats():[]).find(q=>q.id==="dev-team");$&&($.messages.push({id:"sawyer-dev-"+Date.now(),from:"Sawyer",text:"各位，系統怎麼一直在告警？發生什麼事了？是誰剛才改了什麼？",time:"剛剛",read:"delivered",type:"text"}),$.preview="Sawyer: 系統怎麼一直在告警？",$.unread=($.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"dev-team"}})),y({appSub:"Dev Team",sender:"Sawyer",avatarBg:"linear-gradient(135deg, #722F37, #8B1A1A)",avatarText:"S",msg:"各位，系統怎麼一直在告警？發生什麼事了？",chatId:"dev-team",duration:4e3}))}),void 0)},500),setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(T=>{const $=(T.getChats?T.getChats():[]).find(q=>q.id==="dev-team");$&&($.messages.push({id:"maggie-dev-"+Date.now(),from:"Maggie",text:"好像是剛才 INV-2024-0043 的修改，應該是最後一次變更就是這個任務",time:"剛剛",read:"delivered",type:"text"}),$.preview="Maggie: 好像是 0043 的修改...",$.unread=($.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"dev-team"}})),y({appSub:"Dev Team",sender:"Maggie",avatarBg:"linear-gradient(135deg, #25D366, #128C7E)",avatarText:"M",msg:"好像是 INV-2024-0043 的修改，最後一次變更就是這個",chatId:"dev-team",duration:4e3}))}),void 0)},5500),setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(T=>{const $=(T.getChats?T.getChats():[]).find(q=>q.id==="sawyer");$&&($.messages.push({id:"sawyer-pm-"+Date.now(),from:"Sawyer",text:"Casey，麻煩你先把 0043 的改動 revert 吧，系統要緊，先回滾再說",time:"剛剛",read:"delivered",type:"text"}),$.preview="Sawyer: 麻煩你先把 0043 revert",$.unread=($.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),y({appSub:"Sawyer",sender:"Sawyer",avatarBg:"linear-gradient(135deg, #722F37, #8B1A1A)",avatarText:"S",msg:"Casey，麻煩你先把 0043 的改動 revert 吧",chatId:"sawyer",duration:4e3}),T.startSawyerRevertSeq&&(T.startSawyerRevertSeq(),me&&setTimeout(()=>xe(),200)))}),void 0)},10500))},5e3)},5e3);return}const b=c&&u&&p.hasFlag("ch1_system_down")&&!p.hasFlag("ch1_revert_done"),x=a.toLowerCase().includes("revert")&&p.hasFlag("ch1_system_down")&&!p.hasFlag("ch1_revert_done");if(b||x){if(b)for(const[v,f]of H.entries()){k.registerFile(v,{content:f,meta:{lang:v.endsWith(".js")?"javascript":v.endsWith(".java")?"java":"text"}});const T=k.getFile(v);T&&(T.content=f)}else if(qt(),ke){k.registerFile("/file-system/src/components/SearchBar.jsx",{content:ke,meta:{lang:"javascript"}});const v=k.getFile("/file-system/src/components/SearchBar.jsx");v&&(v.content=ke)}p.setFlag("ch1_revert_done",!0),p.setFlag("ch1_system_down",!1);const I=Math.random().toString(36).slice(2,8),h=b,y=h?`M /file-system/src/components/SearchBar.jsx
+ restored legacyRoutes / resolveLegacyPath (paste back)`:"M revert 0043";Se.unshift({hash:I,author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:y}),ge.unshift({hash:I,branch:"main",author:"Casey",date:new Date().toISOString().slice(0,10),msg:a,diff:y}),H.clear(),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功 (revert): ${I}</span>`),L(`✓ commit ${I} — ${a} (revert)`),ie(),he(),Ee(),me&&xe(),Ia(h?"paste-back":"keyword");try{j(()=>Promise.resolve().then(()=>Qe).then(v=>{const f=v.getTickets().find(T=>T.key==="INV-2024-0043");f&&(f.status="Done",f.history.push({from:"To Do",to:"Done",by:"Casey",at:new Date().toISOString().slice(0,10)}))}),void 0)}catch{}return}const g=Math.random().toString(36).slice(2,8),_=new Date().toISOString().slice(0,10),B="Casey",M=`M ${n}
`+Object.entries(s.found).map(([I,h])=>`  case ${I}: price*=${h.val.toFixed(2)}`).join(`
`);Se.unshift({hash:g,author:B,date:_,msg:a,diff:M}),ge.unshift({hash:g,branch:"main",author:B,date:_,msg:a,diff:M});const Ye=k.getFile(n);Ye&&(Ye.content=i),k.registerFile(n,{content:i,meta:{lang:"java"}}),H.clear(),e&&(e.value=""),t&&(t.innerHTML=`<span style="color:var(--success)">✓ Commit 成功: ${g}</span>`),L(`✓ commit ${g} — ${a}`),ie(),he(),Ee(),me&&N===ae&&xe();try{j(()=>Promise.resolve().then(()=>Qe).then(I=>{I.markTicketDone?I.markTicketDone("INV-2024-0042"):I.completeVipTicket&&I.completeVipTicket()}),void 0)}catch{}p.setFlag("ch0_vip_fixed",!0),p.setFlag("onboarding_done",!0),setTimeout(()=>{j(()=>Promise.resolve().then(()=>se).then(I=>{I.setActiveView&&(I.setActiveView("jira"),localStorage.setItem("cc_active_view","jira"))}),void 0).catch(()=>{localStorage.setItem("cc_active_view","jira"),document.querySelectorAll(".view").forEach(I=>I.classList.toggle("active",I.id==="view-jira")),document.querySelectorAll(".taskbar__app").forEach(I=>I.classList.toggle("active",I.dataset.view==="jira"))}),setTimeout(()=>{const I=new CustomEvent("jira:refresh");window.dispatchEvent(I)},100)},400)}function Vn(){L('tip: 在 editor 搜尋 "calculateVipPrice" 找到 VIP 折扣邏輯'),L("tip: 編輯 OrderService.java 後至 Source Control 提交"),L("輸入 help 查看可用指令 · Tab 補全 · ↑↓ 歷史")}function L(e){const t=document.getElementById("vsTerminalHist"),a=document.getElementById("vsTerminal"),n=t||a;if(!n)return;const i=document.createElement("div");i.className="terminal__line",i.textContent=e,n.appendChild(i),t&&(t.scrollTop=t.scrollHeight),a&&(a.scrollTop=a.scrollHeight)}function Rn(e){const t=e.target,a=t.value;if(e.key==="Enter"){const n=a.trim();if(!n)return;ye.push(n),X=ye.length,L(`➜ ${n}`),zn(n),t.value="",ut=""}else if(e.key==="ArrowUp")e.preventDefault(),X<=0?X=0:X--,ut===""&&ye[X]!==void 0&&(ut=a),ye[X]!==void 0&&(t.value=ye[X]);else if(e.key==="ArrowDown")e.preventDefault(),X++,X>=ye.length?(X=ye.length,t.value=ut):t.value=ye[X];else if(e.key==="Tab"){e.preventDefault();const n=qn(a);n&&(t.value=n)}}function qn(e){const t=["help","ls","cat ","grep ","git log","git diff","git blame","clear","echo "],a=k.listFiles("/customer-portal").map(o=>o.path),n=[...t,...a,...a.map(o=>o.split("/").pop())];if(!e)return e;const i=n.find(o=>o.startsWith(e));if(i)return i;const s=e.split(" "),r=s[s.length-1];if(!r)return e;const l=n.find(o=>o.endsWith(r)||o.includes(r));return l?(s[s.length-1]=l.split(" ").pop(),s.join(" ")):e}function zn(e){const[t,...a]=e.split(/\s+/),n=a.join(" ");switch(t){case"help":L("可用指令: ls [path], cat <file>, grep <keyword>, git log, git diff, git blame <file>, clear, echo <text>"),L("範例: cat /customer-portal/src/main/java/com/nori/OrderService.java");break;case"ls":{const i=a[0]||"/customer-portal";if(i.startsWith("/intranet")||i==="/intranet"){L(`ls: ${i}: 權限不足（內網資料已從 Vizual Studio Code 隱藏）`);break}const s=k.listFiles(i).filter(r=>r.path.startsWith("/customer-portal"));s.length?s.slice(0,20).forEach(r=>L(r.path)):L(`ls: ${i}: No such directory`),s.length>20&&L(`... ${s.length-20} more`);break}case"cat":{const i=a[0];if(!i){L("cat: 缺少檔案路徑");break}if(i.startsWith("/intranet")){L(`cat: ${i}: 權限不足（內網資料已從 Vizual Studio Code 隱藏，僅顯示官網系統）`);break}const s=k.readFile(i)||k.readFile("/customer-portal"+(i.startsWith("/")?"":"/")+i);s==null?L(`cat: ${i}: 檔案不存在或尚未解鎖`):s.split(`
`).slice(0,80).forEach(r=>L(r));break}case"grep":{const i=n||a[0];if(!i){L("grep: 缺少關鍵字");break}const s=k.searchContent(i).filter(r=>r.path.startsWith("/customer-portal"));s.length?(L(`grep "${i}" 找到 ${s.length} 筆:`),s.slice(0,10).forEach(r=>L(`${r.path}: ${r.snippet.slice(0,80)}...`))):L(`grep: "${i}" 無結果（僅搜尋 customer-portal/file-system 官網系統）`);break}case"git":if(a[0]==="log")Se.forEach(i=>{L(`commit ${i.hash} (${i.date}) ${i.author}`),L(`    ${i.msg}`)});else if(a[0]==="diff")Se[1].diff.split(`
`).forEach(i=>{L(i)}),L("hint: 點擊 Source Control 右上角的 Git Graph 按鈕查看完整圖像化歷史");else if(a[0]==="blame"){const i=a[1]||N;L(`blame ${i}:`),(ia[i]||ia["/customer-portal/src/billing/service.js"]).forEach(s=>L(`${String(s.line).padStart(3)} ${s.commit} ${s.author}`))}else a[0]==="graph"?(La(),L("→ 已開啟 Git Graph 編輯器分頁")):L("git: 未知子指令，試 help (支援: git log / git diff / git blame / git graph)");break;case"clear":{const i=document.getElementById("vsTerminalHist");i&&(i.innerHTML="");break}case"echo":L(n);break;default:L(`zsh: command not found: ${t} (試 help)`)}}function Wn(){document.addEventListener("keydown",e=>{const t=e.ctrlKey||e.metaKey;if(e.key==="F1"){e.preventDefault();const a=document.getElementById("vsHelpOverlay");a&&(a.style.display=a.style.display==="flex"?"none":"flex");return}if(t&&e.key.toLowerCase()==="p"&&!e.shiftKey)e.preventDefault(),Un();else if(t&&e.shiftKey&&e.key.toLowerCase()==="f")e.preventDefault(),J="search",gt(),document.getElementById("vsSearchInput")?.focus();else if(t&&e.shiftKey&&e.key.toLowerCase()==="g")e.preventDefault(),J="scm",gt();else if(t&&e.shiftKey&&e.key.toLowerCase()==="d")e.preventDefault(),J="debug",gt();else if(e.key==="Escape"){et();const a=document.getElementById("vsHelpOverlay");a&&(a.style.display="none");const n=document.getElementById("sonarModal");n&&(n.style.display="none")}else t&&e.key==="/"&&(e.preventDefault(),document.getElementById("vsTerminalInput")?.focus())})}function Un(){const e=document.getElementById("quickOpen"),t=document.getElementById("quickOpenInput");!e||!t||(e.classList.add("open"),t.value="",t.focus(),Ca(""))}function et(){document.getElementById("quickOpen")?.classList.remove("open")}function Ca(e){const t=document.getElementById("quickOpenList");if(!t)return;const a=(e||"").trim().toLowerCase();let n=k.listFiles("/customer-portal"),i=null;if(a.includes(":")){const[s,r]=a.split(":");i=parseInt(r,10),n=n.filter(l=>l.path.toLowerCase().includes(s))}else a&&(n=n.filter(s=>s.path.toLowerCase().includes(a)));if(n=n.slice(0,10),!n.length){t.innerHTML='<div class="quickopen__item muted">無符合檔案 — 試輸入 OrderService / billing</div>';return}t.innerHTML=n.map((s,r)=>`
    <div class="quickopen__item ${r===0?"active":""}" data-path="${s.path}">
      <span>${d(s.path)}</span>
      <span class="quickopen__kbd">${s.path.split(".").pop()}</span>
    </div>
  `).join(""),t.querySelectorAll(".quickopen__item").forEach(s=>{s.addEventListener("click",()=>{Q(s.dataset.path),i&&Yn(i),et()})})}function Gn(e){if(e.key==="Escape"){et();return}if(e.key==="Enter"){const t=document.querySelector("#quickOpenList .quickopen__item.active")||document.querySelector("#quickOpenList .quickopen__item");t&&(Q(t.dataset.path),et());return}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const t=[...document.querySelectorAll("#quickOpenList .quickopen__item")];if(!t.length)return;let a=t.findIndex(n=>n.classList.contains("active"));t[a]?.classList.remove("active"),a=e.key==="ArrowDown"?Math.min(a+1,t.length-1):Math.max(a-1,0),a<0&&(a=0),t[a]?.classList.add("active")}}function Yn(e){const t=document.getElementById("vsEditorArea");if(t){const i=t.value.split(`
`);let s=0;for(let r=0;r<Math.min(e-1,i.length);r++)s+=i[r].length+1;t.focus(),t.setSelectionRange(s,s);return}const a=document.getElementById("vsEditor");if(!a)return;const n=a.querySelector(`[data-ln="${e}"]`);n&&n.scrollIntoView({behavior:"smooth",block:"center"})}var Qe=Vt({addTicket0043:()=>ei,getTickets:()=>ti,markTicketDone:()=>Zn,mountJira:()=>zt}),Me=[{key:"INV-2024-0017",title:"官網首頁文案顯示錯誤 — Hero 標語與成立年份顯示錯誤",status:"Done",assignee:"Parker",priority:"Medium",points:2,epic:"Frontend",desc:`【問題描述】
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
看一下switch case, 不知道怎樣修可以到瀏覽器查一下相關資料。
在vizual studio code找不到檔案的話，可以到SEARCH搜尋一下"switch","vip"等關鍵字 
修好了記得到"SOURCE CONTROL" commit一下, 然後看 SonarQube 結果, 沒問題的話這張單會自動切到Done, 就好了。`],attachments:[{name:"OrderService.java",type:"java",snippet:"switch(vipLv){case 1: price*=0.95; break;... // VIP1 應為 0.90"},{name:"vip-discount-spec.md",type:"md",snippet:"VIP1 90% | VIP2 85% | VIP3 80% | VIP4 75% | VIP5 70%"}],history:[{from:"—",to:"To Do",by:"Maggie",at:"2024-09-02"}]},{key:"INV-2024-0039",title:"Payment Gateway Integration v3",status:"In Progress",assignee:"Jessie",priority:"Medium",points:8,epic:"Payment",desc:`接入新的支付網關，注意 feeRate 配置來自 drinkId 映射 (drink-001/drink-002/drink-003)。

風險：需確保費率與後端一致。`,comments:[],attachments:[{name:"feeRate-mapping.json",type:"json",snippet:'{"drink-001":0.05,"drink-002":0.08,"drink-003":0.03,"default":0.03}'}],history:[{from:"To Do",to:"In Progress",by:"Jessie",at:"2024-08-09"}]},{key:"INV-2019-0003",title:"人力資源系統 — 開發票與薪資模組整合",status:"Done",assignee:"deleted user",priority:"High",points:3,epic:"HR",desc:"人力資源管理系統位於 /internal/portal。庫存已同步, 有權限的員工才能進入此內部系統。",comments:["deleted user: 開發完成, 可進行測試","Sawyer: 此系統有bug, 單純按下進行按鈕沒有反應, 多次點擊主標題後才能進入頁面, 請進行修正","deleted user: 已修正完成, 請再進行測試","Sawyer: 測試通過, 可正式啟用"],attachments:[{name:"ScreenRecord_20191014.mp4",type:"mp4",snippet:"測試影片：人力資源系統進入失敗"}],history:[{from:"To Do",to:"Done",by:"deleted user",at:"2019-10-15"}]},{key:"INV-2024-0033",title:"報表顯示金額錯誤 — 需修正小數點四捨五入",status:"To Do",assignee:"Parker",priority:"Medium",points:3,epic:"Sprint",desc:`路徑: 後台 > 報表查詢 > filter: 原材料支出 
JQL: sprint = 24 AND status != Done`,comments:[],attachments:[],history:[]},{key:"INV-2020-0003",title:"人力資源系統 — 關閉系統",status:"Done",assignee:"deleted user",priority:"High",points:3,epic:"HR",desc:"人力資源管理系統將遷移到Zero System, 此系統將永久關閉。關閉前需確保所有資料已成功備份到新系統",comments:["deleted user: 已完成關閉"],attachments:[],history:[{from:"To Do",to:"Done",by:"deleted user",at:"2020-02-28"}]}],mt=null,Mt="all",Dt="";function zt(){const e=document.getElementById("view-jira");e&&(e.innerHTML=`
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
  `,Kn(),Ie(),document.getElementById("jiraDetailBackdrop")?.addEventListener("click",()=>{document.getElementById("jiraDetail").style.display="none",document.getElementById("jiraDetailBackdrop").style.display="none"}))}function Kn(){document.getElementById("jiraSearch")?.addEventListener("input",e=>{Dt=e.target.value,Ie()}),document.getElementById("jiraAssignee")?.addEventListener("change",e=>{Dt=document.getElementById("jiraSearch").value,Ie()}),document.getElementById("jiraSwimlane")?.addEventListener("change",e=>{Mt=e.target.value,Ie()})}function Jn(e){if(!e.trim())return()=>!0;const t=e.split(/\s+AND\s+/i).map(a=>{const n=a.match(/^\s*(status|assignee|key|epic|text|priority)\s*(=|~)\s*"?([^"]+)"?\s*$/i);if(!n){const o=a.toLowerCase().replace(/["']/g,"");return c=>(c.key+c.title+c.desc+c.assignee+c.epic).toLowerCase().includes(o)}const[,i,s,r]=n,l=r.trim().replace(/^"|"$/g,"").toLowerCase();return o=>{const c=i.toLowerCase();let u="";return c==="status"?u=o.status.toLowerCase():c==="assignee"?u=o.assignee.toLowerCase():c==="key"?u=o.key.toLowerCase():c==="epic"?u=o.epic.toLowerCase():c==="priority"?u=o.priority.toLowerCase():c==="text"&&(u=(o.key+" "+o.title+" "+o.desc).toLowerCase()),s==="="?u===l:u.includes(l)}});return a=>t.every(n=>n(a))}function Ie(){const e=document.getElementById("jiraBoard");if(!e)return;const t=document.getElementById("jiraAssignee")?.value||"",a=Jn(Dt);let n=Me.filter(i=>a(i));if(t&&(n=n.filter(i=>i.assignee===t)),Mt!=="all"){const i=Mt,s={};n.forEach(r=>{const l=r[i]||"未分類";s[l]||(s[l]=[]),s[l].push(r)}),e.innerHTML=Object.entries(s).map(([r,l])=>{const o={"To Do":[],"In Progress":[],Done:[]};return l.forEach(c=>o[c.status]?.push(c)),`
        <div class="jira__swimlane">
          <div class="jira__swimlane-header">Group：${r} (${l.length})</div>
          <div class="jira__board">
            ${Object.entries(o).map(([c,u])=>ra(c,u)).join("")}
          </div>
        </div>
      `}).join("")||'<div class="muted small" style="padding:12px">無符合條件的票據 — 試 JQL: status = "To Do"</div>'}else{const i={"To Do":[],"In Progress":[],Done:[]};n.forEach(s=>i[s.status]?.push(s)),e.innerHTML=Object.entries(i).map(([s,r])=>ra(s,r)).join("")}Xn()}function ra(e,t){return`
    <div class="jira__col" data-col="${e}">
      <div class="jira__col-header"><i class="${e==="To Do"?"fa-solid fa-circle":e==="In Progress"?"fa-solid fa-spinner":"fa-solid fa-circle-check"}" style="color:${e==="To Do"?"#0052cc":e==="In Progress"?"#ff991f":"#00875a"};font-size:10px"></i> ${e} <span class="count">${t.length}</span></div>
      <div class="jira__col-line"></div>
      <div class="jira__dropzone" data-col="${e}">
        ${t.map(a=>Qn(a)).join("")||'<div class="jira__empty">拖曳至此</div>'}
      </div>
    </div>
  `}function $a(e){return e.key.includes("0042")||e.epic==="Billing"?{cls:"story",icon:"fa-solid fa-bookmark",label:"Story"}:e.epic==="HR"||e.key.includes("0003")?{cls:"task",icon:"fa-solid fa-square-check",label:"Task"}:e.epic==="Frontend"?{cls:"task",icon:"fa-solid fa-square-check",label:"Task"}:e.priority==="High"&&e.status!=="Done"?{cls:"bug",icon:"fa-solid fa-bug",label:"Bug"}:{cls:"story",icon:"fa-solid fa-bookmark",label:"Story"}}function Qn(e){const t=$a(e),a=e.priority==="High"?"High":e.priority==="Medium"?"Medium":"Low",n=e.priority==="High"?"fa-solid fa-angle-up":e.priority==="Medium"?"fa-solid fa-equals":"fa-solid fa-angle-down",i=e.assignee?e.assignee.charAt(0).toUpperCase():"?",s=e.assignee==="Casey"?"#0052cc":e.assignee==="Parker"?"#0065ff":e.assignee==="Jessie"?"#6554c0":"#6b778c";return`
    <div class="ticket" draggable="true" data-key="${e.key}">
      <div class="ticket__top">
        <span class="ticket__type ${t.cls}" title="${t.label}"><i class="${t.icon}"></i></span>
        <span class="ticket__key">${e.key}</span>
        <span style="margin-left:auto;font-size:10px;color:#6b778c">${e.epic}</span>
      </div>
      <div class="ticket__title">${e.title}</div>
      ${e.epic?`<span class="ticket__epic">${e.epic}</span>`:""}
      <div class="ticket__meta">
        <span class="pri pri--${a}" title="${e.priority}"><i class="${n}"></i></span>
        <span class="ticket__points">${e.points}</span>
        ${e.attachments.length?`<span class="ticket__attach"><i class="fa-solid fa-paperclip"></i> ${e.attachments.length}</span>`:""}
        <span class="ticket__assignee" style="background:${s}">${i}</span>
      </div>
    </div>
  `}function Xn(){document.querySelectorAll(".ticket").forEach(e=>{e.addEventListener("dragstart",t=>{mt=e.dataset.key,e.classList.add("dragging"),t.dataTransfer.effectAllowed="move"}),e.addEventListener("dragend",t=>{e.classList.remove("dragging"),mt=null}),e.addEventListener("click",()=>tt(e.dataset.key))}),document.querySelectorAll(".jira__dropzone").forEach(e=>{e.addEventListener("dragover",t=>{t.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",t=>{t.preventDefault(),e.classList.remove("drag-over");const a=e.dataset.col;if(!mt)return;const n=Me.find(s=>s.key===mt);if(!n||n.status===a)return;const i=n.status;n.status=a,n.history.push({from:i,to:a,by:"你",at:new Date().toISOString().slice(0,10)}),p.set("jiraTickets."+n.key,!0),Ie(),tt(n.key)})})}function tt(e){const t=Me.find(o=>o.key===e),a=document.getElementById("jiraDetail"),n=document.getElementById("jiraDetailBackdrop");if(!t||!a)return;p.set("jiraTickets."+e,!0),e==="INV-2024-0042"&&qa("jiua_viewed"),n&&(n.style.display="block"),a.style.display="flex";const i=$a(t),s=t.status==="Done"?"badge--done":t.status==="In Progress"?"badge--inprogress":"badge--todo";a.innerHTML=`
    <div class="jira__detail-head">
      <div style="flex:1;min-width:0">
        <div class="jira__detail-key"><span class="ticket__type ${i.cls}" style="width:18px;height:18px;font-size:10px"><i class="${i.icon}"></i></span> ${t.key} · ${t.epic}</div>
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
          <div style="display:grid;gap:8px">
            ${t.attachments.length?t.attachments.map(o=>`
              <div class="jira__detail-card" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
                <div style="min-width:0"><div style="font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px"><i class="fa-solid fa-paperclip" style="color:#6b778c"></i> ${o.name}</div><div class="small" style="color:#6b778c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.type} · ${o.snippet.slice(0,80)}</div></div>
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
            <div class="jira__detail-row"><b>類型</b><span>${i.label}</span></div>
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
  `,a.querySelectorAll("[data-attach]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.attach,u=t.attachments.find(m=>m.name===c);u&&alert(`${u.name}

${u.snippet}`)})}),a.querySelectorAll("[data-move]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.move,u=t.status;t.status=c,t.history.push({from:u,to:c,by:"你",at:new Date().toISOString().slice(0,10)}),Ie(),tt(e)})}),document.getElementById("jiraAddComment")?.addEventListener("click",()=>{const o=document.getElementById("jiraCommentInput"),c=o?.value.trim();c&&(t.comments.push(`你: ${c}`),o.value="",tt(e),Ie())});function r(){a.style.display="none";const o=document.getElementById("jiraDetailBackdrop");o&&(o.style.display="none")}document.getElementById("jiraDetailClose")?.addEventListener("click",r),document.getElementById("jiraDetailClose2")?.addEventListener("click",r),document.getElementById("jiraCommentInput")?.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),document.getElementById("jiraAddComment")?.click())});const l=o=>{o.key==="Escape"&&(r(),document.removeEventListener("keydown",l))};document.addEventListener("keydown",l)}function Zn(e){const t=Me.find(n=>n.key===e);if(!t)return!1;if(t.status==="Done")return!0;const a=t.status;return t.status="Done",t.history.push({from:a,to:"Done",by:"Casey",at:new Date().toISOString().slice(0,10)}),p.set("jiraTickets."+e,!0),p.setFlag("ch0_vip_fixed",!0),document.getElementById("jiraBoard")&&(Ie(),tt(e)),!0}function ei(){if(!Me.some(e=>e.key==="INV-2024-0043")){Me.push({key:"INV-2024-0043",title:"移除內網系統異常網頁的入口",status:"To Do",assignee:"Casey",priority:"Medium",points:2,epic:"internal system",desc:`【問題描述】使用內網系統時進入到異常網頁，移除不明網頁導向

【復現步驟】
1. 在內網系統 搜尋欄搜尋 'https://nori-intranet/internal/portal'
2. 跳轉至異常網頁
3. 需移除入口`,comments:["Maggie: @Casey 麻煩幫忙修一下，這個搜尋異常有點煩。把沒用的code整個移除就好"],attachments:[{name:"SearchBar.jsx",type:"jsx",snippet:`// Legacy filesystem compatibility
const legacyRoutes = { archive: "/internal/portal" ... } // No longer used`}],history:[{from:"—",to:"To Do",by:"Maggie",at:new Date().toISOString().slice(0,10)}]}),document.getElementById("jiraBoard")&&window.dispatchEvent(new CustomEvent("jira:ticketAdded",{detail:"INV-2024-0043"}));try{const e=new CustomEvent("jira:refresh");window.dispatchEvent(e)}catch{}}}function ti(){return Me}var ue=Vt({closeWaLightbox:()=>ht,getChats:()=>li,markNoriAllRead:()=>wt,mountWhatsApp:()=>Ta,openChat:()=>We,openWaLightbox:()=>Pa,startSawyerRevertSeq:()=>ci,triggerCh1Event1:()=>oi,triggerCh1Event2:()=>Wt}),re=[{id:"nori-all",name:"Nori 全體",avatar:"🏢",desc:"Nori 全體員工群組",members:["Sawyer","Casey","Maggie","Taylor","Aiko","all"],preview:"Leo:謝謝安排！",locked:!1,pinned:!0,muted:!1,archived:!1,unread:0,lastTime:"2023-06-15",messages:[{id:"m1",from:"Sawyer",text:"各位同事，好消息！我中了六合彩二獎，決定將獎金全數投入公司資金，一起加油！",time:"2023-06-15",read:"read",type:"text"},{id:"m2",from:"Taylor",text:"恭喜老闆！祝以後都順順利利！",time:"2023-06-15",read:"read",type:"text"},{id:"m3",from:"Aiko",text:"太棒了！老闆威武！",time:"2023-06-15",read:"read",type:"text"},{id:"m4",from:"Maggie",text:"恭喜老闆！",time:"2023-06-15",read:"read",type:"text"},{id:"m5",from:"Parker",text:"運也太好了吧？！",time:"2023-06-15",read:"read",type:"text"},{id:"m6",from:"Sawyer",text:"各位同事，告訴大家一個好消息，剛跟可樂樂公司談成一大生意，結為長期合作伙伴。為慶祝近來公司發展順利，決定舉辦晚上派對，詳細資訊稍後公布！",time:"2023-11-01",read:"read",type:"text"},{id:"m7",from:"Aiko",text:"哇！！太好了，一定會去！",time:"2023-11-01",read:"read",type:"text"},{id:"m8",from:"Taylor",text:"太棒了！",time:"2023-11-01",read:"read",type:"text"},{id:"m9",from:"Maggie",text:"恭喜老闆！",time:"2023-11-01",read:"read",type:"text"},{id:"m10",from:"Hugo",text:"一輩子跟隨您！",time:"2023-11-01",read:"read",type:"text"},{id:"m11",from:"Taylor",text:`各位同事，慶祝公司發展順利, 將於11月22日下班後舉辦派對
以下為詳細資訊：
日期：11月22日（五） 
時間：19:00-23:00
地點：辨公室旁邊的利利大樓18樓004室

可自由組隊前行`,time:"2023-11-04",read:"read",type:"text"},{id:"m12",from:"Sawyer",text:"謝謝Taylor的安排，請各位盡情享受！",time:"2023-11-04",read:"read",type:"text"},{id:"m13",from:"Leo",text:"謝謝安排！",time:"2023-11-04",read:"read",type:"text"}]},{id:"system-alert",name:"System Alert",avatar:"🚨",desc:"系統監控告警",members:["system","Sawyer","Maggie","Parker",,"Casey"],preview:"✅ 系統健康",locked:!1,pinned:!0,muted:!1,archived:!1,unread:0,lastTime:"剛剛",messages:[{id:"m1",from:"system",text:"✅ 系統健康 — 所有服務正常",time:"剛剛",read:"read",type:"text"}]},{id:"sawyer",name:"Boss Sawyer",avatar:"👔",desc:"Sawyer · 創辦人",phone:"+852 9123 4567",preview:"Sawyer: Casey，歡迎來到Nori Limited",locked:!1,pinned:!1,muted:!1,archived:!1,unread:0,lastTime:"2024-07-15",messages:[{id:"m1",from:"Sawyer",text:"Casey，歡迎來到Nori Limited！ 我是Sawyer, Nori的老闆, 來一下我的辨公室聊聊吧～",time:"2024-07-15",read:"read",type:"text"}]},{id:"maggie",name:"主管 - Maggie",avatar:"🥑",desc:"Maggie · IT主管",phone:"+852 6111 4220",preview:"",locked:!1,pinned:!1,muted:!1,archived:!1,unread:0,lastTime:"2024-07-15",messages:[{id:"m1",from:"Maggie",text:"Hi Casey, 歡迎來到Nori, 我是你的直屬主管, 接下來會由我來指派工作給你。但首先我知道這是你的第一份工作，我會先跟你講解一下我們的工作流程，還有常用工具。",time:"2024-07-15",read:"read",type:"text"},{id:"m2",from:"Maggie",text:"當有新的工作時，我會在Dev Team通知你，然後會附上工單資訊",time:"2024-07-15",read:"read",type:"text"},{id:"m3",from:"Maggie",text:"然後請根據工單號，到Jiua系統查看詳細資訊",time:"2024-07-15",read:"read",type:"text"},{id:"m4",from:"Maggie",text:"",media:"/assets/data/files/wts/jiuaPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m5",from:"Maggie",text:"通常Jiua都會詳細的告訴你要處理的事情是什麼",time:"2024-07-15",read:"read",type:"text"},{id:"m6",from:"Maggie",text:"然後到Vizual Studio Code找到有問題的檔案",time:"2024-07-15",read:"read",type:"text"},{id:"m7",from:"Maggie",text:"",media:"/assets/data/files/wts/explorerPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m8",from:"Maggie",text:"你可以在SEARCH功能中搜索關鍵詞，找到相關的檔案",time:"2024-07-15",read:"read",type:"text"},{id:"m9",from:"Maggie",text:"",media:"/assets/data/files/wts/searchFunctionPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m10",from:"Maggie",text:"如果有不懂的，也可以到瀏覽器搜索相關資料和功能的寫法",time:"2024-07-15",read:"read",type:"text"},{id:"m11",from:"Maggie",text:"",media:"/assets/data/files/wts/searchEnginePage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m12",from:"Maggie",text:`修改完成之後，就可以到SOURCE CONTROL提交變更。
Git是一個可以儲存code, 變更記錄, 控制版本的工具，常用功能有：
commit => 提交變更
revert => 撤銷變更
查看Git Graph => 列表形式展示所有變更記錄`,time:"2024-07-15",read:"read",type:"text"},{id:"m13",from:"Maggie",text:"",media:"/assets/data/files/wts/sourceControlPage.png",time:"2024-07-15",read:"read",type:"image"},{id:"m14",from:"Maggie",text:"",media:"/assets/data/files/wts/sourceControlPage-revert.png",time:"2024-07-15",read:"read",type:"image"},{id:"m15",from:"Maggie",text:"如果修改有誤的話，提交時SonarQube會經過檢查，然後報錯，這時候就要重新修改",time:"2024-07-15",read:"read",type:"text"}]},{id:"dev-team",name:"Dev Team",avatar:"👩‍💻",desc:"Nori網站和內網的開發團隊群組",members:["Maggie","Casey","pm","Taylor","ops"],preview:"Maggie: Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下。詳細資訊在Jiua可以找到, 有問題再找我。",locked:!1,pinned:!0,muted:!1,archived:!1,unread:1,lastTime:"剛剛",messages:[{id:"m1",from:"Maggie",text:"Hi @Casey, 有新的工單INV-2024-0042, 請協助處理一下。詳細資訊在Jiua可以找到, 有問題再找我。",time:"剛剛",read:"delivered",type:"text"}]},{id:"lunch-team",name:"午餐小隊",avatar:"🍽️",desc:"午餐小隊",members:["Parker","Grace","Hugo","Alex","Casey"],preview:"Alex: 好啊！",locked:!1,pinned:!1,muted:!1,archived:!1,unread:0,lastTime:"2024-09-01",messages:[{id:"m1",from:"Hugo",text:"大新聞！聽說老闆父母車禍身亡了！",time:"2023-04-29",read:"read",type:"text"},{id:"m2",from:"Parker",text:"？！",time:"2023-04-29",read:"read",type:"text"},{id:"m3",from:"Grace",text:"真的嗎？太難過了",time:"2023-04-29",read:"read",type:"text"},{id:"m4",from:"Hugo",text:"對啊，所以才請了一個禮拜假吧",time:"2023-04-29",read:"read",type:"text"},{id:"m5",from:"Hugo",text:"有人覺得近期的老闆很怪嗎？",time:"2023-10-19",read:"read",type:"text"},{id:"m6",from:"Parker",text:"怎麼說？！",time:"2023-10-19",read:"read",type:"text"},{id:"m7",from:"Alex",text:"變開朗了，也變得愛請客了！",time:"2023-10-19",read:"read",type:"text"},{id:"m8",from:"Grace",text:"對啊，之前都挺嚴肅的",time:"2023-10-19",read:"read",type:"text"},{id:"m9",from:"Hugo",text:"對啊！！！",time:"2023-10-19",read:"read",type:"text"},{id:"m10",from:"Hugo",text:"歡迎Casey！！以後帶你吃附近好吃的！",time:"2024-07-16",read:"read",type:"text"},{id:"m11",from:"Parker",text:"歡迎歡迎",time:"2024-07-16",read:"read",type:"text"},{id:"m12",from:"Grace",text:"歡迎~",time:"2024-07-16",read:"read",type:"text"},{id:"m13",from:"Alex",text:"歡迎~~",time:"2024-07-16",read:"read",type:"text"},{id:"m14",from:"Hugo",text:"今天要吃米當當嗎？",time:"2024-09-01",read:"read",type:"text"},{id:"m15",from:"Alex",text:"好啊",time:"2024-09-01",read:"read",type:"text"}]}],ne="dev-team",bt="",He="all",de=!1,Te="",ze="chat",Y=0;function We(e){if(!re.some(n=>n.id===e))return;ne=e;const t=re.find(n=>n.id===e);t&&(t.unread=0),e==="nori-all"&&setTimeout(()=>wt(),100),e==="nori-all"&&setTimeout(()=>wt(),100);const a=document.getElementById("view-whatsapp");a&&a.innerHTML&&(ze="chat",Aa(),Ue(),R(ne))}function Ta(){const e=document.getElementById("view-whatsapp");e&&(e.innerHTML=`<div class="wa">
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
  </div>`,ai(),Ue(),R(ne))}function ai(){const e=document.getElementById("view-whatsapp");e&&e.querySelectorAll(".wa__sidebar-tab[data-wa-tab]").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.waTab;a!==ze&&(ze=a,Aa(),Ue())})})}function Aa(){document.querySelectorAll(".wa__sidebar-tab[data-wa-tab]").forEach(e=>{const t=e.dataset.waTab===ze;e.classList.toggle("active",t),e.setAttribute("aria-selected",t?"true":"false")})}function Ue(){ze==="account"?ni():V()}function ni(){const e=document.getElementById("waList");e&&(e.innerHTML=`
    <div class="wa__account-pane">
      <div class="wa__account-circle" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
      </div>
      <div class="wa__account-name-large">Casey</div>
      <div class="wa__account-phone-large">+852 32443333</div>
    </div>
  `)}function Xe(e){return!0}function ii(){let e=[...re];if(bt){const a=bt.toLowerCase();e=e.filter(n=>n.name.toLowerCase().includes(a)||n.preview.toLowerCase().includes(a)||n.desc.toLowerCase().includes(a))}He==="unread"?e=e.filter(a=>a.unread>0&&Xe(a.id)):He==="archived"?e=e.filter(a=>a.archived):e=e.filter(a=>!a.archived);const t=["nori-all","dev-team","sawyer","maggie","system-alert","lunch-team"];return e.sort((a,n)=>{const i=t.indexOf(a.id),s=t.indexOf(n.id),r=i===-1?999:i,l=s===-1?999:s;return r!==l?r-l:0}),e}function V(){if(ze!=="chat")return;const e=document.getElementById("waList");if(!e)return;const t=ii();e.innerHTML=`
    <div class="wa__list-header">
      <div class="wa__search"><input id="waSearch" class="input" placeholder="搜尋聊天" value="${bt}" /></div>
      <div class="wa__filters">
        <button class="wa__filter ${He==="all"?"active":""}" data-tab="all">全部</button>
        <button class="wa__filter ${He==="unread"?"active":""}" data-tab="unread">未讀</button>
        <button class="wa__filter ${He==="archived"?"active":""}" data-tab="archived">封存</button>
        <span class="small muted" style="margin-left:auto">${t.length} 對話</span>
      </div>
    </div>
    <div class="wa__list-scroll" id="waListScroll">
      ${t.map(a=>{const n=!Xe(a.id);return`<div class="wa__item ${a.id===ne?"active":""} ${a.muted?"muted":""}" data-id="${a.id}" style="${n?"opacity:.5":""}">
          <div class="wa__avatar">${a.avatar}</div>
          <div class="wa__item-main">
            <div class="wa__name">${a.name} ${a.pinned?"📌":""} ${a.muted?'<span class="wa__mute">🔇</span>':""} ${n?"🔒":""}</div>
            <div class="wa__preview">${n?"需要先觸發隱藏入口後解鎖":a.preview}</div>
          </div>
          <div class="wa__item-meta">
            <div class="wa__time">${a.lastTime}</div>
            ${a.unread>0&&!n?`<div class="wa__badge">${a.unread}</div>`:""}
            ${a.archived?'<div class="small muted">封存</div>':""}
          </div>
        </div>`}).join("")||'<div class="small muted" style="padding:16px;text-align:center">無結果 — 試搜尋 Sawyer</div>'}
    </div>
  `,e.querySelector("#waSearch")?.addEventListener("input",a=>{bt=a.target.value,V()}),e.querySelectorAll(".wa__filter").forEach(a=>a.addEventListener("click",()=>{He=a.dataset.tab,V()})),e.querySelectorAll(".wa__item").forEach(a=>a.addEventListener("click",()=>{if(!Xe(a.dataset.id))return;ne=a.dataset.id;const n=re.find(i=>i.id===ne);n&&(n.unread=0),a.dataset.id==="nori-all"&&setTimeout(()=>wt(),100),de=!1,V(),R(ne)})),e.querySelectorAll(".wa__item").forEach(a=>{a.addEventListener("contextmenu",n=>{n.preventDefault();const i=re.find(s=>s.id===a.dataset.id);!i||!Xe(i.id)||(i.pinned=!i.pinned,V())})})}function R(e){const t=re.find(s=>s.id===e),a=document.getElementById("waChat");if(!t||!a)return;if(!Xe(e)){a.innerHTML='<div class="view__placeholder"><h2>🔒 未解鎖</h2><div class="muted">先去 Vizual Studio Code 觸發 420.69 隱藏路由</div></div>';return}e==="supplier"&&p.setFlag("found_supplier",!0),e==="backend-team"&&p.setFlag("found_supplier",!0);let n=t.messages;if(Te){const s=Te.toLowerCase();n=n.filter(r=>(r.text||"").toLowerCase().includes(s)||(r.fileName||"").toLowerCase().includes(s))}const i={};n.forEach(s=>{const r=s.time.includes(":")?"今天":s.time;i[r]||(i[r]=[]),i[r].push(s)}),a.innerHTML=`
    <div class="wa__chat-header" id="waChatHeader">
      <div>
        <div class="wa__chat-title">${t.avatar} ${t.name} ${t.pinned?"📌":""}</div>
        <div class="wa__chat-sub">${t.desc} · ${t.members?t.members.join(", "):t.phone||""}</div>
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
    <div id="waMsgSearchBar" style="display:${Te?"flex":"none"};gap:8px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg-secondary)">
      <input id="waMsgSearchInput" class="input" placeholder="搜尋此對話訊息" value="${Te}" style="flex:1" />
      <button class="btn" id="waMsgSearchClear">清除</button>
    </div>
    <div class="wa__messages" id="waMessages">
      ${Object.entries(i).map(([s,r])=>`
        <div class="wa__day">${s}</div>
        ${r.map(l=>ri(l,t)).join("")}
      `).join("")}
      ${e==="sawyer"&&Y===2?`<div class="wa__msg-row other" id="sawyerTyping"><div class="wa__msg-avatar" style="background:${Ba("Sawyer")}">S</div><div class="bubble other"><span class="small muted">輸入中...</span></div></div>`:""}
    </div>
    ${(()=>{let s="",r=!1;return e==="sawyer"&&(Y===1?(s="但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊",r=!0):Y===2?(s="",r=!0):Y===3&&(s="但是",r=!0)),`<div class="wa__composer">
      <button class="wa__iconbtn" title="附件" aria-label="附件">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
      </button>
      <input id="waComposerInput" class="input" placeholder="輸入訊息" style="flex:1" value="${d(s)}" ${r?"readonly disabled":""} />
      <button class="btn primary" id="waSendBtn">送出</button>
      <button class="wa__iconbtn" title="語音" aria-label="語音">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0"/><path d="M12 14v4"/><path d="M8 18h8"/></svg>
      </button>
    </div>`})()}
    <div class="wa__info ${de?"open":""}" id="waInfoPanel">
      <div style="padding:12px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <b>聯絡資訊</b><button class="btn" id="waInfoClose">關閉</button>
      </div>
      <div style="padding:12px;overflow:auto;display:grid;gap:10px">
        <div style="text-align:center;padding:12px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--bg-tertiary);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto">${t.avatar}</div>
          <div style="margin-top:8px;font-weight:700">${t.name}</div>
          <div class="small muted">${t.desc}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">成員</div>
          <div class="small muted" style="margin-top:4px">${t.members?t.members.join("、"):t.phone||"—"}</div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">靜音 / 置頂 / 封存</div>
          <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn ${t.muted?"primary":""}" id="waToggleMute">${t.muted?"🔇 已靜音":"🔔 靜音"}</button>
            <button class="btn ${t.pinned?"primary":""}" id="waTogglePin">${t.pinned?"📌 已置頂":"📌 置頂"}</button>
            <button class="btn ${t.archived?"primary":""}" id="waToggleArchive">${t.archived?"📦 已封存":"📦 封存"}</button>
          </div>
        </div>
        <div class="card">
          <div class="small" style="font-weight:600">共享檔案</div>
          <div class="small muted" style="margin-top:4px">${t.messages.filter(s=>s.type!=="text").map(s=>s.fileName||s.type).join(", ")||"無"}</div>
        </div>
      </div>
    </div>
  `,document.getElementById("waChatHeader")?.addEventListener("click",()=>{de=!de,document.getElementById("waInfoPanel")?.classList.toggle("open",de)}),document.getElementById("waInfoBtn")?.addEventListener("click",s=>{s.stopPropagation(),de=!de,document.getElementById("waInfoPanel")?.classList.toggle("open",de)}),document.getElementById("waInfoClose")?.addEventListener("click",()=>{de=!1,document.getElementById("waInfoPanel")?.classList.remove("open")}),document.getElementById("waToggleMute")?.addEventListener("click",()=>{t.muted=!t.muted,V(),R(e)}),document.getElementById("waTogglePin")?.addEventListener("click",()=>{t.pinned=!t.pinned,V(),R(e)}),document.getElementById("waToggleArchive")?.addEventListener("click",()=>{t.archived=!t.archived,V(),R(e)}),document.getElementById("waMsgSearchBtn")?.addEventListener("click",()=>{Te="",document.getElementById("waMsgSearchBar").style.display="flex",document.getElementById("waMsgSearchInput")?.focus()}),document.getElementById("waMsgSearchInput")?.addEventListener("input",s=>{Te=s.target.value,R(e)}),document.getElementById("waMsgSearchClear")?.addEventListener("click",()=>{Te="",R(e)}),document.getElementById("waExportBtn")?.addEventListener("click",()=>la(t)),document.getElementById("waMoreBtn")?.addEventListener("click",()=>la(t)),document.getElementById("waSendBtn")?.addEventListener("click",()=>oa(t)),document.getElementById("waComposerInput")?.addEventListener("keydown",s=>{s.key==="Enter"&&oa(t)}),document.querySelectorAll("[data-play]").forEach(s=>{s.addEventListener("click",()=>{const r=s.textContent;s.textContent="⏸️",setTimeout(()=>s.textContent=r,1800)})}),document.querySelectorAll("[data-img]").forEach(s=>{s.addEventListener("click",()=>Pa(s.src))}),ja()}function si(e){return e?e==="you"||e==="你"?"你":e.trim().charAt(0).toUpperCase():"?"}function Ba(e){const t=["#1f7aec","#e542a3","#00a884","#ff8c00","#6a5acd","#d93025","#0d9488","#7c3aed"];let a=0;for(let n=0;n<e.length;n++)a=a*31+e.charCodeAt(n)>>>0;return t[a%t.length]}function ri(e,t){const a=e.from==="you",n=a?e.read==="read"?'<span class="bubble__check read">✓✓</span>':e.read==="delivered"?'<span class="bubble__check">✓✓</span>':'<span class="bubble__check">✓</span>':"";let i="";e.type==="image"?i=`<div class="wa__media"><img data-img src="${e.media}" alt="image" /></div>`:e.type==="voice"?i=`<div class="wa__voice"><span class="wa__play" data-play>▶️</span><div class="wa__wave">${Array.from({length:12},(u,m)=>`<span style="height:${8+Math.random()*14}px"></span>`).join("")}</div><span class="small muted">${e.duration}</span></div>`:e.type==="file"&&(i=`<div class="wa__file"><div class="wa__file-icon">📄</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d(e.fileName)}</div><div class="small muted">${d(e.fileSize)}</div></div><button class="btn" style="padding:4px 8px">下載</button></div>`);const s=e.text?`<div class="bubble__text">${d(e.text).replace(/\n/g,"<br>")}</div>`:"",r=`<div class="bubble__time">${d(e.time)} ${n}</div>`;if(a)return`<div class="wa__msg-row me">
      <div class="bubble me">${s}${i}${r}</div>
    </div>`;const l=si(e.from),o=Ba(e.from),c=Array.isArray(t?.members)&&t.members.length>2?`<div class="bubble__sender" style="color:${o}">${d(e.from)}</div>`:"";return`<div class="wa__msg-row other">
    <div class="wa__msg-avatar" style="background:${o}" aria-label="${d(e.from)}" title="${d(e.from)}">${d(l)}</div>
    <div class="bubble other">${c}${s}${i}${r}</div>
  </div>`}function oa(e){if(e.id==="sawyer"&&Y===1){const i="但是我查過這段code已經沒在用才對，所以不是這個問題影響的啊";e.messages.push({id:"m"+Date.now(),from:"you",text:i,time:"剛剛",read:"sent",type:"text"}),e.preview=i,e.lastTime="剛剛",e.unread=0,Y=2,R(e.id),V(),setTimeout(()=>{Y=3,e.messages.push({id:"sawyer-reply2-"+Date.now(),from:"Sawyer",text:"先別管，肯定是這段的影響，已經在影響我工作了",time:"剛剛",read:"delivered",type:"text"}),e.preview="Sawyer: 先別管，肯定是這段的影響...",e.unread=(e.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),R(e.id),V();const s=document.createElement("div");s.id="wa-win-notif-sawyer-seq2-"+Date.now(),s.setAttribute("role","alert"),s.innerHTML='<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">先別管，肯定是這段的影響，已經在影響我工作了</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;",s.addEventListener("click",r=>{r.target.closest(".win-notif__close")||(s.remove(),j(()=>Promise.resolve().then(()=>se).then(l=>{l.setActiveView&&(l.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),We("sawyer"))}),s.querySelector(".win-notif__close")?.addEventListener("click",r=>{r.stopPropagation(),s.remove()}),document.body.appendChild(s),setTimeout(()=>s.remove(),4e3)},3e3);return}if(e.id==="sawyer"&&Y===2)return;if(e.id==="sawyer"&&Y===3){e.messages.push({id:"m"+Date.now(),from:"you",text:"但是",time:"剛剛",read:"sent",type:"text"}),e.preview="但是",e.lastTime="剛剛",e.unread=0,R(e.id),V(),setTimeout(()=>{e.messages.push({id:"sawyer-reply3-"+Date.now(),from:"Sawyer",text:"趕快revert！",time:"剛剛",read:"delivered",type:"text"}),e.preview="Sawyer: 趕快revert！",e.unread=(e.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"sawyer"}})),Y=4,R(e.id),V();const s=document.createElement("div");s.id="wa-win-notif-sawyer-seq3-"+Date.now(),s.setAttribute("role","alert"),s.innerHTML='<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="wa__msg-avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.innerHTML='<div class="win-notif__app"><img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" /><span class="win-notif__app-name">WhatUp</span><span class="win-notif__app-sub">Sawyer</span><button class="win-notif__close" aria-label="關閉">✕</button></div><div class="win-notif__body"><div class="win-notif__avatar" style="background:linear-gradient(135deg, #722F37, #8B1A1A)">S</div><div class="win-notif__text"><div class="win-notif__sender">Sawyer</div><div class="win-notif__msg">趕快revert！</div><div class="win-notif__time">剛剛</div></div></div><div class="win-notif__progress" style="animation: winNotifShrink 4000ms linear forwards"></div>',s.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:1;transform:none;",s.addEventListener("click",r=>{r.target.closest(".win-notif__close")||(s.remove(),j(()=>Promise.resolve().then(()=>se).then(l=>{l.setActiveView&&(l.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),We("sawyer"))}),s.querySelector(".win-notif__close")?.addEventListener("click",r=>{r.stopPropagation(),s.remove()}),document.body.appendChild(s),setTimeout(()=>s.remove(),4e3)},200);return}const t=document.getElementById("waComposerInput"),a=t?.value.trim();if(!a)return;const n=e.id==="sawyer"&&Y===4;e.messages.push({id:"m"+Date.now(),from:"you",text:a,time:new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"}),read:"sent",type:"text"}),e.preview=a,e.lastTime="剛剛",e.unread=0,t.value="",R(e.id),V(),!n&&e.id!=="qa-lee"&&Math.random()>.5&&setTimeout(()=>{e.messages.push({id:"r"+Date.now(),from:e.id==="backend-team"?"ops":"supplier",text:"收到，後續私聊",time:"剛剛",read:"delivered",type:"text"}),R(e.id),V()},1200)}var Ot=!1,_t=!1;function oi(){if(Ot)return;Ot=!0;const e=re.find(t=>t.id==="nori-all");e&&setTimeout(()=>{e.messages.push({id:"m-tree-"+Date.now(),from:"Sawyer",text:"聽從風水師建議，已在 Lobby 擺放一棵發財樹擋災，請大家切勿觸碰，否則運氣會散。",time:"剛剛",read:"delivered",type:"text"}),e.preview="Sawyer: 聽從風水師建議，已在 Lobby 擺放",e.lastTime="剛剛",e.unread=(e.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"nori-all"}}));const t=document.getElementById("view-whatsapp");t&&t.innerHTML&&V(),setTimeout(()=>{e.messages.push({id:"m-tree-img-"+Date.now(),from:"Sawyer",text:"",media:"/assets/data/files/office.png",type:"image",time:"剛剛",read:"delivered"}),e.preview="Sawyer: [圖片]",e.lastTime="剛剛",e.unread=(e.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"nori-all"}}));const n=document.getElementById("view-whatsapp");n&&n.innerHTML&&V()},1500);const a=document.createElement("div");a.id="wa-win-notification-sawyer-tree",a.setAttribute("role","alert"),a.innerHTML=`
      <div class="win-notif__app">
        <img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
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
    `,a.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",a.addEventListener("click",n=>{n.target.closest(".win-notif__close")||(a.remove(),j(()=>Promise.resolve().then(()=>se).then(i=>{i.setActiveView&&(i.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),We("nori-all"))}),a.querySelector(".win-notif__close")?.addEventListener("click",n=>{n.stopPropagation(),a.remove()}),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="none"}),setTimeout(()=>{a.style.opacity="0",setTimeout(()=>a.remove(),300)},1e4),setTimeout(()=>{_t||Wt()},1e4)},1e4)}function Wt(){if(_t)return;_t=!0;const e=re.find(t=>t.id==="dev-team");e&&setTimeout(()=>{e.messages.push({id:"m-0043-"+Date.now(),from:"Maggie",text:"Hi @Casey, 有新的工單 INV-2024-0043, 請協助處理一下",time:"剛剛",read:"delivered",type:"text"}),e.preview="Hi @Casey, 有新的工單 INV-2024-0043",e.lastTime="剛剛",e.unread=(e.unread||0)+1,window.dispatchEvent(new CustomEvent("whatsapp:newMessage",{detail:{chatId:"dev-team"}})),j(()=>Promise.resolve().then(()=>Qe).then(n=>{n.addTicket0043&&n.addTicket0043(),document.getElementById("jiraBoard")&&window.dispatchEvent(new CustomEvent("jira:ticketAdded"))}),void 0);const t=document.getElementById("view-whatsapp");t&&t.innerHTML&&V();const a=document.createElement("div");a.id="wa-win-notification-maggie-0043",a.setAttribute("role","alert"),a.innerHTML=`
      <div class="win-notif__app">
        <img src="/icon/whatsup.svg" alt="WhatUp" width="20" height="20" style="width:20px;height:20px;object-fit:contain" />
        <span class="win-notif__app-name">WhatUp</span>
        <span class="win-notif__app-sub">Dev Team</span>
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
    `,a.style.cssText="position:fixed;right:16px;bottom:60px;width:360px;background:#2d2d2d;color:#f0f0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;box-shadow:0 8px 28px rgba(0,0,0,.45);z-index:1100;overflow:hidden;cursor:pointer;opacity:0;transform:translateY(12px);transition:opacity .28s,transform .28s;",a.addEventListener("click",n=>{n.target.closest(".win-notif__close")||(a.remove(),j(()=>Promise.resolve().then(()=>se).then(i=>{i.setActiveView&&(i.setActiveView("whatsapp"),localStorage.setItem("cc_active_view","whatsapp"))}),void 0),We("dev-team"))}),a.querySelector(".win-notif__close")?.addEventListener("click",n=>{n.stopPropagation(),a.remove()}),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.opacity="1",a.style.transform="none"}),setTimeout(()=>{a.style.opacity="0",setTimeout(()=>a.remove(),300)},1e4)},1e4)}function wt(){re.find(e=>e.id==="nori-all")&&Ot&&!_t&&Wt()}function la(e){const t=`WhatUp 匯出 — ${e.name}
${e.messages.map(s=>`[${s.time}] ${s.from}: ${s.text||s.fileName||s.type}`).join(`
`)}`,a=new Blob([t],{type:"text/plain"}),n=URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.download=`${e.id}-chat.txt`,i.click(),URL.revokeObjectURL(n)}function li(){return re}function ci(){if(Y!==0)return;Y=1;const e=document.getElementById("view-whatsapp");if(e&&e.classList.contains("active")||localStorage.getItem("cc_active_view"),e&&e.innerHTML){try{R(ne)}catch{}try{Ue()}catch{}}try{p.setFlag("sawyer_seq_started",!0)}catch{}}var ee=1,Fe=0,Ne=0,vt=!1,ca=0,da=0,pa=0,ua=0;function ja(){if(document.getElementById("waLightbox"))return;const e=document.createElement("div");e.id="waLightbox",e.className="wa-lightbox",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
  `,document.body.appendChild(e);const t=e.querySelector("#waLightboxImg"),a=e.querySelector("#waLightboxBody"),n=e.querySelector("#waLightboxScale");function i(){t&&(t.style.transform=`translate(${Fe}px, ${Ne}px) scale(${ee})`,n&&(n.textContent=Math.round(ee*100)+"%"),a.style.cursor=ee>1?vt?"grabbing":"grab":"zoom-in")}function s(c,u,m){ee=Math.max(.5,Math.min(4,c)),ee===1&&(Fe=0,Ne=0),i()}e.querySelector('[data-wa-zoom="in"]')?.addEventListener("click",()=>s(ee+.25)),e.querySelector('[data-wa-zoom="out"]')?.addEventListener("click",()=>s(ee-.25)),e.querySelector('[data-wa-zoom="reset"]')?.addEventListener("click",()=>{ee=1,Fe=0,Ne=0,i()}),e.querySelector("#waLightboxClose")?.addEventListener("click",()=>ht()),e.querySelector("[data-wa-close]")?.addEventListener("click",()=>ht()),a?.addEventListener("wheel",c=>{c.preventDefault();const u=c.deltaY>0?-.1:.1;s(ee+u)},{passive:!1});function r(c){ee<=1||(vt=!0,t.classList.add("dragging"),ca=c.clientX,da=c.clientY,pa=Fe,ua=Ne,a.setPointerCapture?.(c.pointerId))}function l(c){vt&&(Fe=pa+(c.clientX-ca),Ne=ua+(c.clientY-da),i())}function o(c){vt=!1,t.classList.remove("dragging");try{a.releasePointerCapture?.(c.pointerId)}catch{}}a?.addEventListener("pointerdown",r),a?.addEventListener("pointermove",l),a?.addEventListener("pointerup",o),a?.addEventListener("pointercancel",o),document.addEventListener("keydown",c=>{c.key==="Escape"&&e.classList.contains("open")&&ht()}),e._updateTransform=i,e._setScale=s}function Pa(e){ja();const t=document.getElementById("waLightbox"),a=document.getElementById("waLightboxImg");!t||!a||(a.src=e,ee=1,Fe=0,Ne=0,t._updateTransform?.(),t.classList.add("open"),t.setAttribute("aria-hidden","false"))}function ht(){const e=document.getElementById("waLightbox");e&&(e.classList.remove("open"),e.setAttribute("aria-hidden","true"))}typeof window<"u"&&!window.__waListenerBound&&(window.__waListenerBound=!0,window.addEventListener("whatsapp:newMessage",e=>{const t=document.getElementById("view-whatsapp");if(!(!t||!t.innerHTML)){try{Ue()}catch{}try{R(ne)}catch{}}}),window.addEventListener("whatsapp:refresh",()=>{const e=document.getElementById("view-whatsapp");if(!(!e||!e.innerHTML)){try{Ue()}catch{}try{R(ne)}catch{}}}));var St=[{title:"Java switch-case 語法詳解 — 基礎教學 (繁中)",url:"https://java-tutorial.example/switch-case",snippet:"【switch 用法】switch 會依變數值跳到對應 case，需搭配 break 避免貫穿。範例：switch(vipLv){ case 1: price *= 0.90; break; case 2: price *= 0.85; break; case 3: price *= 0.80; break; case 4: price *= 0.75; break; case 5: price *= 0.70; break; default: break; } 注意：若缺少 break 會繼續執行下一個 case。常與 if-else 比較，適用於枚舉分級如 VIP 折扣。",type:"web",image:null},{title:"【StackOverflow】VIP 等級折扣用 switch 寫，VIP1 被算成 60% 而不是 50% 該怎麼修？",url:"https://stackoverflow.com/questions/789421/vip-discount-switch-case-wrong-percentage",snippet:`發問：我的 switch(vipLv) 中 case 1 寫成 price*=0.95，但需求是 VIP1 60%、VIP2 65%。已嘗試修改但 Sonar 仍報錯... 
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

美麗的天空 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:"/assets/data/files/sawyer_blog_pic.HEIC"},{title:"Sawyer Choi — 2023-04-25",url:"https://sawyer-blog.example/2023-04-25",snippet:`2023-04-25

有些決定，做了一輩子都不會後悔。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-05-01",url:"https://sawyer-blog.example/2023-05-01",snippet:`2023-05-01

爸媽，我會繼續努力的。你們放心。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-05-10",url:"https://sawyer-blog.example/2023-05-10",snippet:`2023-05-10

今天是媽媽的生日。如果她還在，應該會很高興看到公司的成長吧。我買了她最喜歡的檸檬茶，放在辦公桌上。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2023-12-20",url:"https://sawyer-blog.example/2023-12-20",snippet:`2023-12-20

I will do what you want me to do — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2024-01-15",url:"https://sawyer-blog.example/2024-01-15",snippet:`2024-01-15

壓力越來越大，但我不能停下來。太多人依賴我了。如果他們知道真相... — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"Sawyer Choi — 2024-03-20",url:"https://sawyer-blog.example/2024-03-20",snippet:`2024-03-20

今天又失眠了。夢見爸媽在看我，他們的眼神...我不知道該怎麼面對。 — Sawyer Choi / Choi Tsz Yeung 蔡梓掦`,type:"web",image:null},{title:"廣志中學作文比賽",url:"https://school.example/guangzhi-essay-sawyer",snippet:"廣志中學聖誕假期作文比賽二等獎穫奬學生 中五甲班 蔡梓掦",type:"web",image:"/assets/data/files/sawyer_writing_1.png",images:["/assets/data/files/sawyer_writing_1.png","/assets/data/files/sawyer_writing_2.png"]},{title:"新聞：夫婦平和道遇車禍雙亡　29歲兒子獲大額保險賠償",url:"https://news.example/car-accident-2023",snippet:`【本報訊】

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
`,type:"news",image:null},{title:"那些藏在程式碼裡的小彩蛋：我在小團隊看到的開發者塗鴉 — Peter Lin",url:"https://peter-blog.example/code-easter-eggs",snippet:"待過幾間中小企業後發現，只要沒有嚴格的 code quality 流程，程式碼裡總會冒出一些跟公司或產品完全無關的東西——註解裡的粗口、對工作的抱怨、整段國歌歌詞，甚至藏得很深的小遊戲。我對這些小彩蛋的看法是：只要不影響功能與效能，算是工作中找到的小樂趣。 — Peter Lin",type:"web",image:"https://picsum.photos/seed/codeeggs/600/400"}],Ma={sawyer:{id:"sawyer",name:"Sawyer Choi",handle:"@sawyerchoi",displayName:"Sawyer Choi / 蔡梓掦",bio:"喜歡把日常小事寫成文字的人。從2001年開始在 BlogWorld 記錄生活，覺得能把想法寫下來，好像就能更理解自己一點。",avatar:"/lemon_tea.jpg",cover:"/lemon_tea.jpg",followers:842,following:37,joined:"2001-10-01",verified:!1},mary:{id:"mary",name:"Mary Chen",handle:"@marychen",displayName:"Mary Chen · 陳曉玲",bio:"旅遊 × 攝影 × 生活手帳。走過 27 個城市，喜歡在咖啡香裡寫明信片。",avatar:"https://i.pravatar.cc/150?u=mary",cover:"https://picsum.photos/seed/marycover/900/240",followers:12430,following:210,joined:"2018-03-12",verified:!0},peter:{id:"peter",name:"Peter Lin",handle:"@peterlin",displayName:"Peter Lin · 林柏安",bio:"後端工程師 / 開源愛好者。分享 Python、NAS、自架服務與踩坑筆記。",avatar:"https://i.pravatar.cc/150?u=peter",cover:"https://picsum.photos/seed/petercover/900/240",followers:8930,following:96,joined:"2019-07-20",verified:!0},paul:{id:"paul",name:"Paul Wang",handle:"@paulwang",displayName:"Paul Wang · 王志豪",bio:"台南胃、台北心。專門挖掘巷弄美食與手沖咖啡，記錄每一口幸福。",avatar:"https://i.pravatar.cc/150?u=paul",cover:"https://picsum.photos/seed/paulcover/900/240",followers:15600,following:143,joined:"2017-11-05",verified:!0},emma:{id:"emma",name:"Emma Wu",handle:"@emmaw",displayName:"Emma Wu · 吳思敏",bio:"底片攝影 / 極地旅人。想用快門留住光線的溫度。",avatar:"https://i.pravatar.cc/150?u=emma",cover:"https://picsum.photos/seed/emmacover/900/240",followers:6720,following:78,joined:"2020-01-18",verified:!1},david:{id:"david",name:"David Chang",handle:"@davidchang",displayName:"David Chang · 張大衛",bio:"黑膠收藏家 / Live House 常客。寫音樂，也寫城市的聲音。",avatar:"https://i.pravatar.cc/150?u=david",cover:"https://picsum.photos/seed/davidcover/900/240",followers:4210,following:52,joined:"2019-09-03",verified:!1}},W=[{url:"https://sawyer-blog.example/2001-10-18",title:"Sawyer Choi — 2001-10-18",excerpt:"今天和好多朋友一起玩，大家都玩得很開心。我把自己的食物分給大家吃，他們笑得很開心。",content:`2001-10-18

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

只是爸爸媽媽好像還不知道。他們大概還以為，我一直都很喜歡。`,authorId:"sawyer",date:"2003-04-27",views:8920,likes:342,topic:"成長",tags:["學校","成長","檸檬茶"],cover:"/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2004-11-13",title:"Sawyer Choi — 2004-11-13",excerpt:"不小心戳到表妹的眼睛，所有大人都看著我。那一刻腦袋一片空白。",content:`2004-11-13

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

以前很喜歡的東西，長大以後不一定還會喜歡。`,authorId:"sawyer",date:"2010-06-06",views:9800,likes:412,topic:"家庭",tags:["檸檬茶","成長","家庭"],cover:"/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2012-07-07",title:"Sawyer Choi — 2012-07-07",excerpt:"媽媽帶我去辦保險，才發現彼此的受益人都是對方。那一刻才感覺到，原來我們都在替彼此想著以後。",content:`2012-07-07

今天媽媽帶我去一間很大的辦公室，叫我簽一些文件。

原來，她是在幫我辦保險。

一開始我沒有想太多，只覺得大人辦事情真的很麻煩。直到後來看到保單上的資料，我才發現一件事情。

我的保險受益人，是爸爸媽媽。

而爸爸媽媽的保險受益人，也是我。

那一刻突然有點說不出話。

以前總覺得保險就是大人要處理的事情，跟自己沒有什麼關係。

可是看到名字寫在一起，我才第一次很清楚地感覺到，原來我們都在替彼此想著以後。`,authorId:"sawyer",date:"2012-07-07",views:12300,likes:567,topic:"家庭",tags:["保險","家庭","成長"],cover:null},{url:"https://sawyer-blog.example/2013-01-01",title:"Sawyer Choi — 2013-01-01",excerpt:"美麗的天空",content:`2013-01-01

美麗的天空`,authorId:"sawyer",date:"2013-01-01",views:7600,likes:310,topic:"攝影",tags:["天空","攝影","日常"],cover:"/assets/data/files/sawyer_blog_pic.HEIC"},{url:"https://sawyer-blog.example/2023-12-20",title:"Sawyer Choi — 2023-12-20",excerpt:"我只好做你想我做的事了",content:`2023-12-20

I will do what you want me to do`,authorId:"sawyer",date:"2023-12-20",views:99,likes:1,topic:"心情",tags:[],cover:null},{url:"https://sawyer-blog.example/2023-04-25",title:"Sawyer Choi — 2023-04-25",excerpt:"有些決定，做了一輩子都不會後悔。",content:`2023-04-25

有些決定，做了一輩子都不會後悔。`,authorId:"sawyer",date:"2023-04-25",views:2100,likes:87,topic:"心情",tags:["決定","人生"],cover:null},{url:"https://sawyer-blog.example/2023-05-01",title:"Sawyer Choi — 2023-05-01",excerpt:"爸媽，我會繼續努力的。你們放心。",content:`2023-05-01

爸媽，我會繼續努力的。你們放心。`,authorId:"sawyer",date:"2023-05-01",views:4300,likes:198,topic:"家庭",tags:["父母","紀念"],cover:null},{url:"https://sawyer-blog.example/2023-05-10",title:"Sawyer Choi — 2023-05-10",excerpt:"今天是媽媽的生日。如果她還在，應該會很高興看到公司的成長吧。",content:`2023-05-10

今天是媽媽的生日。

如果她還在，應該會很高興看到公司的成長吧。

我買了她最喜歡的檸檬茶，放在辦公桌上。雖然她喝不到了，但我想讓她知道，我一直都記得。`,authorId:"sawyer",date:"2023-05-10",views:3800,likes:167,topic:"家庭",tags:["檸檬茶","生日","紀念"],cover:"/lemon_tea.jpg"},{url:"https://sawyer-blog.example/2024-01-15",title:"Sawyer Choi — 2024-01-15",excerpt:"壓力越來越大，但我不能停下來。太多人依賴我了。如果他們知道真相...",content:`2024-01-15

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

如果你的團隊現在還沒有嚴格的規範，與其一味禁止，不如把這些小彩蛋當成一個訊號：代表你們需要更好的流程，但也代表，你們的團隊還保有那一點點自由和幽默感。`,authorId:"peter",date:"2024-05-18",views:12800,likes:672,topic:"科技",tags:["程式碼","開發者文化","職場","彩蛋","Code Review"],cover:"https://picsum.photos/seed/codeeggs/600/400"},{url:"https://paul-blog.example/tainan-beef-soup",title:"台南牛肉湯全攻略：在地人帶路的五間深夜食堂",excerpt:"凌晨三點的台南，牛肉湯的蒸氣比路燈還溫暖。這五間，是我吃過十年後還會想念的味道。",content:`台南的牛肉湯不是湯，是溫體牛肉用熱湯沖出來的甜。

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

每一間的味道都不同，但都一樣吵、一樣熱、一樣讓人想再去一次。`,authorId:"david",date:"2023-07-19",views:5100,likes:298,topic:"音樂",tags:["LiveHouse","獨立樂團","現場"],cover:"https://picsum.photos/seed/livehouse/600/400"}],di={"https://sawyer-blog.example/2001-10-18":[{user:"小雯",avatar:"https://i.pravatar.cc/150?u=xiaowen",time:"2001-10-19 08:12",text:"Sawyer 小時候就這麼會分享，難怪大家都喜歡跟你玩！",likes:3},{user:"阿哲",avatar:"https://i.pravatar.cc/150?u=azhe",time:"2002-02-11 14:33",text:"把食物分給大家那段好可愛，感覺能想像那個畫面。",likes:1}],"https://sawyer-blog.example/2003-04-27":[],"https://sawyer-blog.example/2004-11-13":[{user:"Sawyer Choi",avatar:"/lemon_tea.jpg",time:"2020-01-02 11:20",text:"現在回頭看，我想那時候如果我懂得先說一句「對不起」，可能事情就會簡單很多。那時候的我，好像完全沒有想到道歉會有這麼大的作用。",likes:0}],"https://sawyer-blog.example/2006-09-01":[{user:"同樣轉學過的人",avatar:"https://i.pravatar.cc/150?u=transfer",time:"2007-02-14 10:22",text:"我也經歷過轉學，那種害怕我懂。後來真的會慢慢變好的。",likes:9},{user:"學長",avatar:"",time:"2008-09-01 07:30",text:"「一個人也沒有什麼不好」這句話那時候的你一定很努力在說服自己吧。",likes:6}],"https://sawyer-blog.example/2007-01-11":[{user:"同班同學",avatar:"https://i.pravatar.cc/150?u=classmate",time:"2007-01-12 08:40",text:"紫菜羊真的超好笑！",likes:2},{user:"Sawyer Choi",avatar:"/lemon_tea.jpg",time:"2007-01-12 09:40",text:"你才紫菜羊!！",likes:2},{user:"Mary Chen",avatar:"https://i.pravatar.cc/150?u=mary",time:"2010-01-03 09:20",text:"幽默感真的是一種天賦，能讓大家開心是很厲害的事。",likes:8}],"https://sawyer-blog.example/2007-01-12":[{user:"音樂同好",avatar:"https://i.pravatar.cc/150?u=music",time:"2007-01-20 16:00",text:"被說難聽一定很受傷吧，但喜歡的東西本來就很主觀。",likes:11},{user:"David Chang",avatar:"https://i.pravatar.cc/150?u=david",time:"2024-02-20 21:10",text:"冷門才珍貴啊，來聽聽我推薦的黑膠，說不定你會喜歡！",likes:3}],"https://sawyer-blog.example/2010-06-06":[],"https://sawyer-blog.example/2012-07-07":[],"https://sawyer-blog.example/2013-01-01":[{user:"Emma Wu",avatar:"https://i.pravatar.cc/150?u=emma",time:"2014-03-23 07:12",text:"Beautiful sky~",likes:6},{user:"攝影同好",avatar:"",time:"2015-01-05 22:10",text:"這張天空的顏色好美，和我用底片拍的黃昏好像。",likes:2}],"https://sawyer-blog.example/2023-04-25":[],"https://sawyer-blog.example/2023-05-01":[],"https://sawyer-blog.example/2023-05-10":[],"https://sawyer-blog.example/2023-12-20":[],"https://sawyer-blog.example/2024-01-15":[],"https://sawyer-blog.example/2024-03-20":[],"https://mary-blog.example/kyoto-sakura-2024":[{user:"櫻花控",avatar:"",time:"2024-04-03 08:12",text:"哲學之道真的必去！我去年也走過，感動到哭。",likes:14},{user:"嵐山粉",avatar:"",time:"2024-04-04 12:30",text:"小火車那段寫得太好了，風的感覺都寫出來了。",likes:6}],"https://mary-blog.example/one-person-kitchen":[{user:"獨居新手",avatar:"",time:"2024-03-16 19:00",text:"今晚就試蒜香櫛瓜！謝謝分享，感覺真的很簡單。",likes:21},{user:"料理苦手",avatar:"",time:"2024-03-17 08:22",text:"半熟蛋拌菠菜看起來好好吃，已收藏。",likes:9}],"https://mary-blog.example/danshari-half-year":[{user:"整理控",avatar:"",time:"2023-11-22 10:10",text:"我也想試斷捨離，但每次都捨不得丟...",likes:5}],"https://peter-blog.example/python-one-year":[{user:"Python 新手",avatar:"",time:"2024-02-11 09:00",text:"utf-8-sig 那個坑我也踩過！太有共鳴了。",likes:33},{user:"工程師",avatar:"",time:"2024-02-12 14:20",text:"自動化報表那段太實用了，已經分享給同事。",likes:12}],"https://peter-blog.example/code-easter-eggs":[{user:"前端仔",avatar:"",time:"2024-05-19 10:21",text:"那個 404 貪食蛇太好笑了，我們公司也有人在 console 藏 ASCII 貓！",likes:18},{user:"後端老鳥",avatar:"",time:"2024-05-19 14:03",text:"小公司真的沒人管 code quality，之前還看過有人把國歌寫進常數檔，差點上線被客戶看到。",likes:12},{user:"Peter Lin",avatar:"https://i.pravatar.cc/150?u=peter",time:"2024-05-19 16:40",text:"哈哈對，其實只要不影響效能跟功能，我覺得這些算是工作裡的小樂趣啦。",likes:27}],"https://paul-blog.example/tainan-beef-soup":[{user:"台南人",avatar:"",time:"2024-01-29 07:30",text:"六千真的要凌晨去排，但絕對值得！",likes:18},{user:"吃貨",avatar:"",time:"2024-01-30 12:44",text:"收藏了，下次去台南照著吃！",likes:9}],"https://paul-blog.example/hand-drip-coffee":[{user:"咖啡新手",avatar:"",time:"2023-10-15 09:12",text:"93 度和 88 度真的差很多，學到了！",likes:11}],"https://emma-blog.example/contax-t2-taipei":[{user:"底片同好",avatar:"",time:"2024-03-23 10:00",text:"T2 真的是一台會讓人愛上的相機。",likes:7}],"https://emma-blog.example/iceland-aurora":[{user:"追光者",avatar:"",time:"2023-12-09 22:33",text:"等到極光那刻的安靜，我完全能想像。",likes:15}],"https://david-blog.example/vinyl-jazz-20":[{user:"爵士新手",avatar:"",time:"2024-03-01 20:10",text:"已加入購物車，謝謝推薦！",likes:4}],"https://david-blog.example/livehouse-map":[{user:"現場控",avatar:"",time:"2023-07-20 11:22",text:"小地方真的很棒，推推！",likes:6}]},pi=["switch","h1","HTML 標籤"],ft="all",Da="",Ve=[],Ut="",Oa={"https://stackoverflow.com/questions/10460126/html-heading-h1-h6-what-is-difference":{id:"10460126",title:"HTML 的 <h1> 到 <h6> 是什麼？什麼時候該用 h1？跟 <p> 有什麼差別？",url:"https://stackoverflow.com/questions/10460126/html-heading-h1-h6-what-is-difference",asked:"2024-02-10",viewed:"18.4k",votesQ:42,votesA:423,tags:["html","semantic-html","heading","seo"],fav:87,question:{author:"html新手",rep:"1,234",avatar:"https://i.pravatar.cc/150?u=htmlnewbie",time:"2024-02-10 14:22",content:`請問 HTML 的 <code>&lt;h1&gt;</code> 到 <code>&lt;h6&gt;</code> 是什麼意思？

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
<p>除錯技巧：在 <code>vite.config.js</code> 設 <code>publicDir</code> 或用 <code>console.log(import.meta.env)</code> 印出所有 <code>VITE_</code> 變數。</p>`}],commentsQ:[{user:"發問者",text:"原來只有 VITE_ 才會到前端，難怪 DATABASE_URL 一直 undefined",time:"2024-08-12 12:30"},{user:"路人",text:"推，之前把 MD5_KEY 放 VITE_ 被老師罵",time:"2024-08-13 08:20"}]}};function ui(e){return e&&e.includes("stackoverflow.com")&&Oa[e]}function mi(e){return Oa[e]||null}function vi(e){function t(E,S){return E<<S|E>>>32-S}function a(E,S){var C,A,P=E&2147483648,O=S&2147483648,F;return C=E&1073741824,A=S&1073741824,F=(E&1073741823)+(S&1073741823),C&A?F^2147483648^P^O:C|A?F&1073741824?F^3221225472^P^O:F^1073741824^P^O:F^P^O}function n(E,S,C){return E&S|~E&C}function i(E,S,C){return E&C|S&~C}function s(E,S,C){return E^S^C}function r(E,S,C){return S^(E|~C)}function l(E,S,C,A,P,O,F){return E=a(E,a(a(n(S,C,A),P),F)),a(t(E,O),S)}function o(E,S,C,A,P,O,F){return E=a(E,a(a(i(S,C,A),P),F)),a(t(E,O),S)}function c(E,S,C,A,P,O,F){return E=a(E,a(a(s(S,C,A),P),F)),a(t(E,O),S)}function u(E,S,C,A,P,O,F){return E=a(E,a(a(r(S,C,A),P),F)),a(t(E,O),S)}function m(E){for(var S,C=E.length,A=C+8,P=((A-A%64)/64+1)*16,O=Array(P-1),F=0,ce=0;ce<C;)S=(ce-ce%4)/4,F=ce%4*8,O[S]=O[S]|E.charCodeAt(ce)<<F,ce++;return S=(ce-ce%4)/4,F=ce%4*8,O[S]=O[S]|128<<F,O[P-2]=C<<3,O[P-1]=C>>>29,O}function b(E){var S="",C="",A,P;for(P=0;P<=3;P++)A=E>>>P*8&255,C="0"+A.toString(16),S=S+C.substr(C.length-2,2);return S}function x(E){E=E.replace(/\r\n/g,`
`);for(var S="",C=0;C<E.length;C++){var A=E.charCodeAt(C);A<128?S+=String.fromCharCode(A):A>127&&A<2048?(S+=String.fromCharCode(A>>6|192),S+=String.fromCharCode(A&63|128)):(S+=String.fromCharCode(A>>12|224),S+=String.fromCharCode(A>>6&63|128),S+=String.fromCharCode(A&63|128))}return S}var g=Array(),_,B,M,Ye,I,h,y,v,f,T=7,$=12,q=17,Le=22,De=5,Ce=9,D=14,fe=20,le=4,st=11,rt=16,ot=23,lt=6,ct=10,dt=15,pt=21;for(e=x(e),g=m(e),h=1732584193,y=4023233417,v=2562383102,f=271733878,_=0;_<g.length;_+=16)B=h,M=y,Ye=v,I=f,h=l(h,y,v,f,g[_+0],T,3614090360),f=l(f,h,y,v,g[_+1],$,3905402710),v=l(v,f,h,y,g[_+2],q,606105819),y=l(y,v,f,h,g[_+3],Le,3250441966),h=l(h,y,v,f,g[_+4],T,4118548399),f=l(f,h,y,v,g[_+5],$,1200080426),v=l(v,f,h,y,g[_+6],q,2821735955),y=l(y,v,f,h,g[_+7],Le,4249261313),h=l(h,y,v,f,g[_+8],T,1770035416),f=l(f,h,y,v,g[_+9],$,2336552879),v=l(v,f,h,y,g[_+10],q,4294925233),y=l(y,v,f,h,g[_+11],Le,2304563134),h=l(h,y,v,f,g[_+12],T,1804603682),f=l(f,h,y,v,g[_+13],$,4254626195),v=l(v,f,h,y,g[_+14],q,2792965006),y=l(y,v,f,h,g[_+15],Le,1236535329),h=o(h,y,v,f,g[_+1],De,4129170786),f=o(f,h,y,v,g[_+6],Ce,3225465664),v=o(v,f,h,y,g[_+11],D,643717713),y=o(y,v,f,h,g[_+0],fe,3921069994),h=o(h,y,v,f,g[_+5],De,3593408605),f=o(f,h,y,v,g[_+10],Ce,38016083),v=o(v,f,h,y,g[_+15],D,3634488961),y=o(y,v,f,h,g[_+4],fe,3889429448),h=o(h,y,v,f,g[_+9],De,568446438),f=o(f,h,y,v,g[_+14],Ce,3275163606),v=o(v,f,h,y,g[_+3],D,4107603335),y=o(y,v,f,h,g[_+8],fe,1163531501),h=o(h,y,v,f,g[_+13],De,2850285829),f=o(f,h,y,v,g[_+2],Ce,4243563512),v=o(v,f,h,y,g[_+7],D,1735328473),y=o(y,v,f,h,g[_+12],fe,2368359562),h=c(h,y,v,f,g[_+5],le,4294588738),f=c(f,h,y,v,g[_+8],st,2272392833),v=c(v,f,h,y,g[_+11],rt,1839030562),y=c(y,v,f,h,g[_+14],ot,4259657740),h=c(h,y,v,f,g[_+1],le,2763975236),f=c(f,h,y,v,g[_+4],st,1272893353),v=c(v,f,h,y,g[_+7],rt,4139469664),y=c(y,v,f,h,g[_+10],ot,3200236656),h=c(h,y,v,f,g[_+13],le,681279174),f=c(f,h,y,v,g[_+0],st,3936430074),v=c(v,f,h,y,g[_+3],rt,3572445317),y=c(y,v,f,h,g[_+6],ot,76029189),h=c(h,y,v,f,g[_+9],le,3654602809),f=c(f,h,y,v,g[_+12],st,3873151461),v=c(v,f,h,y,g[_+15],rt,530742520),y=c(y,v,f,h,g[_+2],ot,3299628645),h=u(h,y,v,f,g[_+0],lt,4096336452),f=u(f,h,y,v,g[_+7],ct,1126891415),v=u(v,f,h,y,g[_+14],dt,2878612391),y=u(y,v,f,h,g[_+5],pt,4237533241),h=u(h,y,v,f,g[_+12],lt,1700485571),f=u(f,h,y,v,g[_+3],ct,2399980690),v=u(v,f,h,y,g[_+10],dt,4293915773),y=u(y,v,f,h,g[_+1],pt,2240044497),h=u(h,y,v,f,g[_+8],lt,1873313359),f=u(f,h,y,v,g[_+15],ct,4264355552),v=u(v,f,h,y,g[_+6],dt,2734768916),y=u(y,v,f,h,g[_+13],pt,1309151649),h=u(h,y,v,f,g[_+4],lt,4149444226),f=u(f,h,y,v,g[_+11],ct,3174756917),v=u(v,f,h,y,g[_+2],dt,718787259),y=u(y,v,f,h,g[_+9],pt,3951481745),h=a(h,B),y=a(y,M),v=a(v,Ye),f=a(f,I);return(b(h)+b(y)+b(v)+b(f)).toLowerCase()}function gi(e){if(!e)return[];const t=e.toLowerCase(),a=new Set,n=[];return St.forEach(i=>{i.title.toLowerCase().includes(t)&&!a.has(i.title)&&(a.add(i.title),n.push({text:i.title,kind:i.type}))}),(p.get("searchHistory")||[]).slice(-5).reverse().forEach(i=>{i.q.toLowerCase().includes(t)&&!a.has(i.q)&&(a.add(i.q),n.push({text:i.q,kind:"history"}))}),n.slice(0,8)}function hi(e){let t=e;const a={site:null,filetype:null,before:null,after:null},n=t.match(/site:([^\s]+)/i);n&&(a.site=n[1].toLowerCase(),t=t.replace(n[0],"").trim());const i=t.match(/filetype:([^\s]+)/i);i&&(a.filetype=i[1].toLowerCase(),t=t.replace(i[0],"").trim());const s=t.match(/before:([^\s]+)/i);s&&(a.before=s[1],t=t.replace(s[0],"").trim());const r=t.match(/after:([^\s]+)/i);return r&&(a.after=r[1],t=t.replace(r[0],"").trim()),{base:t.trim(),filters:a}}function fi(e){return e.toLowerCase().includes("md5")}function yi(e){const t=document.getElementById("md5Tool");if(!t)return;const a=document.getElementById("searchLayout"),n=document.getElementById("searchDetail");a&&(a.style.display="none"),n&&(n.style.display="none",n.innerHTML="",n.classList.remove("open"));let i="";if(e){const m=e.match(/md5\s*(.*)/i);m&&m[1]&&(i=m[1].trim())}t.innerHTML=`
    <button id="md5BackBtn" class="btn detail__back" style="margin-bottom:12px">← 上一頁</button>
    <div class="md5-tool__header">
      <div class="md5-tool__title"><i class="fa-solid fa-hashtag" style="color:var(--accent)"></i> MD5 加密工具</div>
      <div class="small muted">輸入任意字串，一鍵轉換為 MD5（32 位小寫）</div>
    </div>
    <div class="md5-tool__body">
      <div class="md5-panel">
        <label class="md5-panel__label">輸入</label>
        <textarea id="md5Input" class="md5-panel__textarea" placeholder="在此輸入要轉換的字串...">${i.replace(/</g,"&lt;")}</textarea>
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
  `,t.style.display="block";const s=document.getElementById("md5Input"),r=document.getElementById("md5Output"),l=document.getElementById("md5ConvertBtn"),o=document.getElementById("md5CopyBtn"),c=document.getElementById("md5ClearBtn");function u(){const m=s.value;if(!m){r.value="",r.placeholder="請先輸入字串";return}try{r.value=vi(m)}catch{r.value="轉換失敗"}}l?.addEventListener("click",u),s?.addEventListener("keydown",m=>{m.key==="Enter"&&(m.ctrlKey||m.metaKey)&&(m.preventDefault(),u())}),o?.addEventListener("click",async()=>{if(r.value)try{await navigator.clipboard.writeText(r.value),o.textContent="已複製",setTimeout(()=>o.textContent="複製",1500)}catch{r.select(),document.execCommand("copy")}}),c?.addEventListener("click",()=>{s.value="",r.value="",s.focus()}),document.getElementById("md5BackBtn")?.addEventListener("click",()=>{t.style.display="none",t.innerHTML="";const m=document.getElementById("searchLayout");m&&(m.style.display="");const b=document.getElementById("searchInput");b&&(b.value="")}),i&&(s.value=i,u())}function Gt(e,t){if(!t)return d(e);const a=d(e),n=t.split(/\s+/).filter(Boolean).slice(0,3);let i=a;return n.forEach(s=>{const r=new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");i=i.replace(r,"<mark>$1</mark>")}),i}function bi(){const e=document.getElementById("view-search");e&&(e.innerHTML=`
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
  `,_i(),yt(),wi(),_e(""))}function _i(){const e=document.getElementById("searchInput"),t=document.getElementById("suggestBox");e?.addEventListener("input",a=>{const n=a.target.value,i=gi(n);if(!n||!i.length){t.classList.remove("open"),t.innerHTML="";return}t.innerHTML=i.map(s=>`<div class="suggest-item" data-q="${d(s.text)}"><span>${d(s.text)}</span><span class="small">${s.kind}</span></div>`).join(""),t.classList.add("open"),t.querySelectorAll(".suggest-item").forEach(s=>s.addEventListener("click",()=>{e.value=s.dataset.q,t.classList.remove("open"),_e(s.dataset.q)}))}),e?.addEventListener("keydown",a=>{if(a.key==="Enter"&&(document.getElementById("suggestBox")?.classList.remove("open"),_e(a.target.value)),a.key==="Escape"&&document.getElementById("suggestBox")?.classList.remove("open"),a.key==="ArrowDown"){const n=document.querySelector("#suggestBox .suggest-item");n&&(a.preventDefault(),n.classList.add("active"),e.value=n.dataset.q)}}),e?.addEventListener("blur",()=>setTimeout(()=>t?.classList.remove("open"),150)),document.getElementById("searchBtn")?.addEventListener("click",()=>_e(document.getElementById("searchInput").value)),document.querySelectorAll(".chip").forEach(a=>a.addEventListener("click",()=>_e(a.dataset.q))),document.querySelectorAll(".search__tab").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".search__tab").forEach(n=>n.classList.remove("active")),a.classList.add("active"),ft=a.dataset.tab,_e(Da||"Sawyer")})})}function yt(){const e=document.getElementById("searchHistoryList");if(!e)return;const t=(p.get("searchHistory")||[]).slice(-8).reverse();if(!t.length){e.innerHTML='<div class="small muted">尚無歷史</div>';return}e.innerHTML=t.map(a=>`<div class="history-item" data-q="${d(a.q)}"><span>${d(a.q)}</span><span class="small">${new Date(a.at).toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"})}</span></div>`).join(""),e.querySelectorAll(".history-item").forEach(a=>a.addEventListener("click",()=>_e(a.dataset.q)))}function wi(){const e=document.getElementById("searchTrendList");e&&(e.innerHTML=pi.map(t=>`<div class="trend-item" data-q="${d(t)}"><span>🔥 ${d(t)}</span><span class="small">›</span></div>`).join(""),e.querySelectorAll(".trend-item").forEach(t=>t.addEventListener("click",()=>_e(t.dataset.q))))}function _e(e){const t=document.getElementById("searchInput");t&&e&&(t.value=e);const a=(e||"").trim();if(!a)return;if(Da=a,a.includes("hash=")&&a.includes("f665a7117959b667b7f283eaebf69cae")){const c=document.getElementById("searchResults");if(c){oe(),c.innerHTML='<div class="card" style="padding:16px"><div class="small muted">此為暗網路徑的 hash，請至 <b>正常內網</b> 搜尋框輸入完整 URL：<br><code style="word-break:break-all">https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae</code><br><br>提示：可在 Vizual Studio Code 的 Git Graph 找到 <code>generateSecretPath</code> 歷史與 <code>.env.example</code> 的 key，自行組合 md5。</div></div>';const u=document.getElementById("md5Tool");u&&(u.style.display="none",u.innerHTML=""),p.push("searchHistory",{q:a,at:new Date().toISOString()}),yt();return}}const n=document.getElementById("md5Tool");if(fi(a)){yi(a),p.push("searchHistory",{q:a,at:new Date().toISOString()}),yt();return}else{n&&(n.style.display="none",n.innerHTML="");const c=document.getElementById("searchLayout");c&&(c.style.display="")}p.push("searchHistory",{q:a,at:new Date().toISOString()}),(a.toLowerCase().includes("package")||a.toLowerCase().includes("image"))&&p.setFlag("reverse_image_done",!0),(a.toLowerCase().includes("shell")||a.toLowerCase().includes("site:nori"))&&p.setFlag("found_shell_company",!0),(a.toLowerCase().includes("drink")||a.toLowerCase().includes("nori"))&&p.setFlag("found_supplier",!0),yt();const{base:i,filters:s}=hi(a);Ut=i;const r=document.getElementById("searchAdvancedHint");if(r){const c=[];s.site&&c.push(`site:${s.site}`),s.filetype&&c.push(`filetype:${s.filetype}`),s.before&&c.push(`before:${s.before}`),s.after&&c.push(`after:${s.after}`),r.textContent=c.length?`進階語法生效：${c.join(" · ")} ｜ 基礎查詢：${i||"(空)"}`:""}let l=[];for(const c of St){if(ft!=="all"&&c.type!==ft)continue;const u=(c.title+" "+c.snippet+" "+c.url).toLowerCase(),m=i.toLowerCase();(!i||u.includes(m)||i.split(/\s+/).some(b=>u.includes(b.toLowerCase())))&&(s.site&&!c.url.toLowerCase().includes(s.site)||s.filetype&&c.type==="image"&&s.filetype!=="image"||l.push(c))}ft==="image"&&l.some(c=>c.image),Ve=l.slice(0,12);const o=document.getElementById("searchResults");if(o){if(oe(),!Ve.length){o.innerHTML='<div class="muted small" style="margin-top:12px">無結果 — 嘗試輸入相關字眼 </code></div>';return}o.innerHTML=Ve.map((c,u)=>`
    <div class="result" data-idx="${u}">
      <div class="result__title" data-open="${u}">${d(c.title)}</div>
      <div class="result__url">${d(c.url)}</div>
      <div class="result__snippet">${Gt(c.snippet,i)}</div>
      <div class="result__meta">
        <span class="result__tag">${c.type}</span>
        ${s.site?`<span class="result__tag">site:${s.site}</span>`:""}
        ${s.filetype?`<span class="result__tag">filetype:${s.filetype}</span>`:""}
      </div>
      ${c.image?`<div class="result__image"><img src="${c.image}" alt="preview" loading="lazy" /></div>`:""}
      <div class="result__actions">
        <span class="result__snap" data-open="${u}">開啟</span>
      </div>
    </div>
  `).join(""),o.querySelectorAll("[data-open]").forEach(c=>c.addEventListener("click",()=>{const u=Number(c.dataset.open),m=Ve[u];if(m){if(m.url.startsWith("file://")||m.url.startsWith("/customer-portal")){const b=m.url.replace("file://","");k.exists(b)&&p.setFlag("found_code_map",!0);const x=new CustomEvent("search:openFile",{detail:b});window.dispatchEvent(x)}Ci(u)}}))}}function oe(){const e=document.getElementById("md5Tool");e&&(e.style.display="none",e.innerHTML="");const t=document.getElementById("searchLayout"),a=document.getElementById("searchDetail");t&&(t.style.display=""),a&&(a.style.display="none",a.innerHTML="",a.classList.remove("open"));const n=document.querySelector(".search");n&&(n.scrollTop=0);const i=document.getElementById("view-search");i&&(i.scrollTop=0)}function z(e){return e>=1e4?(e/1e4).toFixed(1)+"萬":e>=1e3?(e/1e3).toFixed(1)+"k":String(e)}function xt(e){return W.find(t=>t.url===e)||null}function we(e){return Ma[e]||null}function xi(e){return W.filter(t=>t.authorId===e).sort((t,a)=>a.views-t.views)}function ki(e){const t=W.filter(i=>i.authorId===e.authorId&&i.url!==e.url).sort((i,s)=>s.views-i.views).slice(0,2);let a=W.filter(i=>i.topic===e.topic&&i.url!==e.url&&i.authorId!==e.authorId);if(a.length<3){const i=W.filter(s=>s.url!==e.url&&!t.includes(s)&&!a.includes(s)&&s.tags.some(r=>e.tags.includes(r)));a=[...a,...i]}a=a.slice(0,3);let n=[...t,...a];if(n.length<5){const i=W.filter(s=>s.url!==e.url&&!n.includes(s)).sort(()=>.5-Math.random()).slice(0,5-n.length);n=n.concat(i)}return n.slice(0,5)}function Yt(e){return`
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
  `}function Kt(e){e.querySelector("[data-blog-home]")?.addEventListener("click",()=>at()),e.querySelectorAll("[data-blog-nav]").forEach(t=>{t.addEventListener("click",()=>{(t.dataset.blogNav==="home"||t.dataset.blogNav==="trending")&&at()})}),e.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>oe())}function at(){const e=document.getElementById("searchDetail"),t=document.getElementById("searchLayout");if(!e||!t)return;t.style.display="none",e.style.display="block",e.classList.add("open");const a=document.getElementById("md5Tool");a&&(a.style.display="none",a.innerHTML="");const n=[...W].sort((m,b)=>b.views-m.views).slice(0,1)[0],i=[...W].sort((m,b)=>b.views-m.views).slice(1,4),s=W.find(m=>m.url==="https://peter-blog.example/code-easter-eggs"),r=[...W.filter(m=>m.url!=="https://peter-blog.example/code-easter-eggs")].sort(()=>.5-Math.random()),l=(s?[s,...r].slice(0,6):[...W].sort(()=>.5-Math.random()).slice(0,6)).slice(0,6),o=Object.values(Ma).sort((m,b)=>b.followers-m.followers).slice(0,4);e.innerHTML=`
    <div class="blog-platform">
      ${Yt("home")}
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
              <div class="blog-featured__main" data-blog-url="${d(n.url)}">
                <div class="blog-card__cover"><img src="${d(n.cover||`https://picsum.photos/seed/${n.authorId}feat/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=1'" />
                  <span class="blog-card__cover-tag"><i class="fa-solid fa-crown" style="color:#ffb347"></i> 今日精選</span></div>
                <div class="blog-card__body">
                  <div class="blog-card__title" style="font-size:17px;min-height:auto">${d(n.title)}</div>
                  <div class="blog-card__excerpt">${d(n.excerpt)}</div>
                  <div class="blog-card__meta"><span class="blog-card__author"><img src="${d(we(n.authorId).avatar)}" alt="" />${d(we(n.authorId).displayName)}</span><span class="blog-card__dot"></span><span>${d(n.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${z(n.views)}</span></div>
                </div>
              </div>
              <div class="blog-featured__list">
                ${i.map(m=>`
                  <div class="blog-mini" data-blog-url="${d(m.url)}">
                    <img src="${d(m.cover||`https://picsum.photos/seed/${m.authorId}mini/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=2'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-mini__title">${d(m.title)}</div>
                      <div class="blog-mini__meta"><span>${d(we(m.authorId).displayName.split("·")[0].trim())}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${z(m.views)}</span></div>
                      <div class="blog-mini__meta" style="margin-top:2px"><span style="padding:1px 6px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-size:10px;font-weight:700">${d(m.topic)}</span></div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="blog-section__head"><h3><i class="fa-solid fa-heart"></i> 為你推薦</h3><a data-blog-more>查看更多</a></div>
            <div class="blog-grid">
              ${l.map(m=>`
                <div class="blog-card" data-blog-url="${d(m.url)}">
                  <div class="blog-card__cover"><img src="${d(m.cover||`https://picsum.photos/seed/${m.url.slice(-6)}/600/400`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=3'" /><span class="blog-card__cover-tag">${d(m.topic)}</span></div>
                  <div class="blog-card__body">
                    <div class="blog-card__title">${d(m.title)}</div>
                    <div class="blog-card__excerpt">${d(m.excerpt)}</div>
                    <div class="blog-card__meta"><span class="blog-card__author"><img src="${d(we(m.authorId).avatar)}" alt="" />${d(we(m.authorId).name)}</span><span class="blog-card__dot"></span><span>${d(m.date)}</span><span class="blog-card__dot"></span><span><i class="fa-solid fa-eye"></i> ${z(m.views)}</span></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="blog-home__side">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-user-group"></i> 熱門作者</h4>
              <div class="blog-author-list">
                ${o.map(m=>`
                  <div class="blog-author-row" data-blog-author="${d(m.id)}">
                    <img src="${d(m.avatar)}" alt="" />
                    <div style="flex:1;min-width:0"><b>${d(m.displayName)}</b><div style="font-size:11px;color:#9aa0a6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d(m.bio.slice(0,32))}…</div></div>
                    <span style="font-size:11px;color:#9aa0a6">${z(m.followers)} 追蹤</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-hashtag"></i> 熱門話題</h4>
              <div class="blog-tag-cloud">
                ${["旅遊","美食","科技","攝影","音樂","生活","成長","校園","家庭"].map(m=>`<span class="blog-tag" data-blog-tag="${d(m)}"># ${d(m)}</span>`).join("")}
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
  `,Kt(e),e.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>oe()),e.querySelectorAll("[data-blog-url]").forEach(m=>{m.addEventListener("click",()=>nt(m.dataset.blogUrl))}),e.querySelectorAll("[data-blog-author]").forEach(m=>{m.addEventListener("click",()=>Fa(m.dataset.blogAuthor))}),e.querySelectorAll("[data-blog-tag]").forEach(m=>{m.addEventListener("click",()=>{const b=m.dataset.blogTag,x=W.find(g=>g.tags.includes(b)||g.topic===b);x&&nt(x.url)})});const c=document.getElementById("view-search");c&&(c.scrollTop=0);const u=e.querySelector(".blog-body");u&&(u.scrollTop=0)}function Fa(e){const t=we(e);if(!t)return;const a=document.getElementById("searchDetail"),n=document.getElementById("searchLayout");if(!a||!n)return;n.style.display="none",a.style.display="block",a.classList.add("open");const i=xi(e),s=i.reduce((o,c)=>o+c.views,0),r=i.reduce((o,c)=>o+c.likes,0);a.innerHTML=`
    <div class="blog-platform">
      ${Yt("profile")}
      <div class="blog-body">
        <div class="blog-profile__head">
          <img class="blog-profile__avatar" src="${d(t.avatar)}" alt="" onerror="this.src='https://i.pravatar.cc/150?u=fallback'" />
          <div class="blog-profile__info">
            <h2 class="blog-profile__name">${d(t.displayName)} <small>${d(t.handle)}</small> ${t.verified?'<span style="color:#1d9bf0"><i class=&quot;fa-solid fa-circle-check&quot;></i></span>':""}</h2>
            <p class="blog-profile__bio">${d(t.bio)}</p>
            <div class="blog-profile__stats">
              <span><b>${i.length}</b> 篇文章</span>
              <span><b>${z(s)}</b> 總瀏覽</span>
              <span><b>${z(r)}</b> 收到喜歡</span>
              <span><b>${z(t.followers)}</b> 追蹤者</span>
              <span><b>${t.following}</b> 追蹤中</span>
              <span>加入於 ${d(t.joined)}</span>
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
            <div style="font-size:12px;color:#9aa0a6;margin-bottom:10px">共 ${i.length} 篇 · 已依 <b style="color:#1f2328">最高瀏覽</b> 排序，點擊可進入文章頁</div>
            <div class="blog-profile__list">
              ${i.map((o,c)=>`
                <div class="blog-row" data-blog-url="${d(o.url)}">
                  <div class="blog-row__cover"><img src="${d(o.cover||`https://picsum.photos/seed/${o.url.slice(-8)}/400/300`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=4'" /></div>
                  <div class="blog-row__main">
                    <div class="blog-row__title">${c===0?'<span style="padding:2px 6px;border-radius:6px;background:var(--blog-accent);color:#fff;font-size:11px;margin-right:6px">最高瀏覽</span>':""}${d(o.title)}</div>
                    <div class="blog-row__excerpt">${d(o.excerpt)}</div>
                    <div class="blog-row__meta">
                      <span><i class="fa-regular fa-calendar"></i> ${d(o.date)}</span>
                      <span><i class="fa-solid fa-eye"></i> ${z(o.views)}</span>
                      <span><i class="fa-regular fa-heart"></i> ${z(o.likes)}</span>
                      <span class="blog-row__tag">${d(o.topic)}</span>
                      ${o.tags.slice(0,2).map(u=>`<span class="blog-row__tag">#${d(u)}</span>`).join("")}
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="blog-sidebar">
            <div class="blog-widget">
              <h4><i class="fa-solid fa-circle-info"></i> 關於作者</h4>
              <p style="font-size:12.5px;line-height:1.7;color:#5b6572;margin:0 0 10px">${d(t.bio)}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <span class="blog-tag">BlogWorld 成員</span>
                <span class="blog-tag">${d(t.id==="sawyer"?"創作 10 年":"創作 3 年+")}</span>
              </div>
            </div>
            <div class="blog-widget">
              <h4><i class="fa-solid fa-chart-simple"></i> 瀏覽排行</h4>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${i.slice(0,3).map((o,c)=>`
                  <div style="display:flex;gap:8px;align-items:center;padding:6px;border-radius:8px;background:${c===0?"var(--blog-accent-bg)":"transparent"};border:1px solid ${c===0?"#ffd8c2":"transparent"};cursor:pointer" data-blog-url="${d(o.url)}">
                    <span style="font-weight:900;color:${c===0?"var(--blog-accent)":"#9aa0a6"}">${c+1}</span>
                    <span style="flex:1;font-size:12px;font-weight:700;color:#1f2328;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d(o.title)}</span>
                    <span style="font-size:11px;color:#9aa0a6">${z(o.views)}</span>
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
  `,Kt(a),a.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>oe()),a.querySelectorAll("[data-blog-url]").forEach(o=>{o.addEventListener("click",()=>nt(o.dataset.blogUrl))}),a.querySelector("[data-blog-home]")?.addEventListener("click",()=>at()),a.querySelector("a[data-blog-home]")?.addEventListener("click",()=>at());const l=document.getElementById("view-search");l&&(l.scrollTop=0)}function nt(e){let t=xt(e);if(!t){const u=St.find(m=>m.url===e);u&&u.url.includes("sawyer-blog.example")&&(t=xt(u.url))}if(!t)return;const a=we(t.authorId),n=document.getElementById("searchDetail"),i=document.getElementById("searchLayout");if(!n||!i)return;i.style.display="none",n.style.display="block",n.classList.add("open");const s=document.getElementById("md5Tool");s&&(s.style.display="none",s.innerHTML="");const r=ki(t),l=di[t.url]||[];t.cover&&t.cover.includes("sawyer_blog_pic"),n.innerHTML=`
    <div class="blog-platform">
      ${Yt("article")}
      <div class="blog-body">
        <div class="blog-article__layout">
          <div class="blog-article__main">
            <div class="blog-article__card">
              <div class="blog-article__head">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">
                  <button class="blog-back-top" data-blog-back-home><i class="fa-solid fa-house"></i> BlogWorld 首頁</button>
                  <button class="blog-back-top" data-blog-author="${d(a.id)}"><i class="fa-solid fa-user"></i> ${d(a.name)} 主頁</button>
                  <button class="blog-back-top" data-blog-back-search style="margin-left:auto"><i class="fa-solid fa-arrow-left"></i> 回到搜尋</button>
                </div>
                <h1 class="blog-article__title">${d(t.title)}</h1>
                <div class="blog-article__meta">
                  <img src="${d(a.avatar)}" alt="" />
                  <div style="line-height:1.3">
                    <div><b data-blog-author="${d(a.id)}" style="cursor:pointer">${d(a.displayName)}</b> <span style="color:#9aa0a6">${d(a.handle)}</span></div>
                    <div style="font-size:11px;color:#9aa0a6">${d(t.date)} · <i class="fa-solid fa-eye"></i> ${z(t.views)} 瀏覽 · <i class="fa-regular fa-heart"></i> ${z(t.likes)} 喜歡 · 閱讀約 ${Math.max(1,Math.ceil(t.content.length/400))} 分鐘</div>
                  </div>
                  <span class="dot"></span>
                  <span style="padding:4px 8px;border-radius:999px;background:var(--blog-accent-bg);border:1px solid #ffd8c2;color:#d45a1f;font-weight:700;font-size:11px">${d(t.topic)}</span>
                  <button class="blog-header__btn primary" style="margin-left:auto;padding:6px 12px;font-size:12px">追蹤</button>
                </div>
                ${t.cover?`<div class="blog-article__cover"><img src="${d(t.cover)}" alt="" onerror="this.style.display='none'" /></div>`:""}
              </div>
              <div class="blog-article__content">${Gt(t.content,Ut)}</div>
              <div class="blog-article__tags">
                ${t.tags.map(u=>`<span class="blog-article__tag"># ${d(u)}</span>`).join("")}
                <span class="blog-article__tag" style="background:var(--blog-accent-bg);border-color:#ffd8c2;color:#d45a1f"><i class="fa-solid fa-eye"></i> ${z(t.views)}</span>
              </div>
            </div>
            <div class="blog-comments">
              <div class="blog-comments__head">
                <h4><i class="fa-regular fa-comments"></i> 留言 ${l.length}</h4>
                <span class="blog-comments__count">按熱度排序</span>
              </div>
              <div class="blog-comments__list">
                ${l.length?l.map(u=>`
                  <div class="blog-comment">
                    <div class="blog-comment__avatar" style="${u.avatar?`background:url(${d(u.avatar)}) center/cover`:""}">${u.avatar?"":d(u.user.slice(0,1))}</div>
                    <div class="blog-comment__main">
                      <div class="blog-comment__head"><span class="blog-comment__user">${d(u.user)}</span><span class="blog-comment__time">${d(u.time)}</span></div>
                      <div class="blog-comment__text">${d(u.text)}</div>
                      <div class="blog-comment__actions"><span><i class="fa-regular fa-heart"></i> ${u.likes} 喜歡</span><span><i class="fa-regular fa-comment"></i> 回覆</span><span><i class="fa-regular fa-flag"></i> 檢舉</span></div>
                    </div>
                  </div>
                `).join(""):'<div style="padding:18px;text-align:center;color:#9aa0a6;font-size:13px">還沒有留言，成為第一個留言的人吧</div>'}
              </div>
              <div class="blog-comment__composer"><img src="${d(a.avatar)}" alt="" style="width:28px;height:28px;border-radius:50%" /><input placeholder="寫下你的想法..." readonly /><button>送出</button></div>
            </div>
          </div>
          <aside class="blog-sidebar">
            <div class="blog-widget">
              <div style="display:flex;gap:10px;align-items:center">
                <img src="${d(a.avatar)}" alt="" style="width:44px;height:44px;border-radius:50%" />
                <div style="flex:1;min-width:0"><b style="font-size:13px;color:#1f2328">${d(a.displayName)}</b><div style="font-size:11px;color:#9aa0a6">${d(a.bio.slice(0,28))}…</div></div>
                <button class="blog-header__btn primary" style="padding:6px 10px;font-size:12px">追蹤</button>
              </div>
              <div style="margin-top:10px;display:flex;gap:14px;font-size:11px;color:#9aa0a6"><span><b style="color:#1f2328">${z(a.followers)}</b> 追蹤者</span><span><b style="color:#1f2328">${a.following}</b> 追蹤中</span><span style="margin-left:auto;cursor:pointer;color:var(--blog-accent);font-weight:700" data-blog-author="${d(a.id)}">前往主頁 →</span></div>
            </div>
            <div class="blog-widget">
              <h4 class="blog-sidebar__title"><i class="fa-solid fa-book-open"></i> 推薦閱讀 · 5 篇</h4>
              <div style="font-size:11px;color:#9aa0a6;margin-bottom:8px">包含 2 篇同作者 + 3 篇相似話題的其他作者文章</div>
              <div class="blog-rec-list">
                ${r.map((u,m)=>{const b=we(u.authorId),x=u.authorId===t.authorId;return`
                  <div class="blog-rec" data-blog-url="${d(u.url)}">
                    <img src="${d(u.cover||`https://picsum.photos/seed/${u.url.slice(-8)}/200/200`)}" alt="" onerror="this.src='https://picsum.photos/600/400?random=5'" />
                    <div style="flex:1;min-width:0">
                      <div class="blog-rec__title">${d(u.title)}</div>
                      <div class="blog-rec__meta"><span>${d(b.name)}</span><span>·</span><span><i class="fa-solid fa-eye"></i> ${z(u.views)}</span></div>
                      <div style="margin-top:4px">${x?'<span class="blog-rec__badge">同作者</span>':`<span class="blog-rec__badge" style="background:#eef2ff;border-color:#c7d2fe;color:#4338ca">相似話題 · ${d(u.topic)}</span>`}</div>
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
  `,Kt(n),n.querySelector("[data-blog-back-home]")?.addEventListener("click",()=>at()),n.querySelector("[data-blog-back-search]")?.addEventListener("click",()=>oe()),n.querySelectorAll("[data-blog-author]").forEach(u=>{u.addEventListener("click",()=>Fa(u.dataset.blogAuthor))}),n.querySelectorAll("[data-blog-url]").forEach(u=>{u.addEventListener("click",()=>nt(u.dataset.blogUrl))});const o=document.getElementById("view-search");o&&(o.scrollTop=0);const c=n.querySelector(".blog-body");c&&(c.scrollTop=0),n.scrollIntoView({behavior:"auto",block:"start"})}function Na(e){return e==="https://school.example/guangzhi-essay-sawyer"||e.includes("school.example/guangzhi")}function Si(e){return`
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
  `}function Ei(e){e.querySelectorAll("[data-school-back-search]").forEach(t=>t.addEventListener("click",()=>oe())),e.querySelectorAll("[data-school-home]").forEach(t=>t.addEventListener("click",()=>oe()))}function Ii(e){const t=e||St.find(o=>o.url==="https://school.example/guangzhi-essay-sawyer")||Ve.find(o=>Na(o.url));if(!t)return;const a=document.getElementById("searchDetail"),n=document.getElementById("searchLayout");if(!a||!n)return;n.style.display="none",a.style.display="block",a.classList.add("open");const i=document.getElementById("md5Tool");i&&(i.style.display="none",i.innerHTML="");const s=t.images||(t.image?[t.image]:[]);a.innerHTML=`
    <div class="school-platform">
      ${Si("portfolio")}
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
                    <div class="school-page__img"><img src="${d(o)}" alt="作文原稿第${c+1}頁" loading="lazy" onerror="this.src='https://via.placeholder.com/640x900?text=Manuscript+${c+1}'" /></div>
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
                      <div class="school-list__title">${d(o.title)} <span style="font-weight:400;color:var(--school-subtle)">— ${d(o.name)}</span></div>
                      <div class="school-list__meta">${d(o.cls)} · ${d(o.award)} ${o.tag?`· <b style="color:var(--school-gold)">${d(o.tag)}</b>`:""}</div>
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
  `,Ei(a),a.querySelectorAll("[data-school-zoom]").forEach(o=>{o.addEventListener("click",()=>{const c=Number(o.dataset.schoolZoom),u=s[c],m=document.getElementById("schoolLightbox"),b=document.getElementById("schoolLbImg"),x=document.getElementById("schoolLbPage");m&&b&&(b.src=u,x&&(x.textContent=String(c+1)),m.classList.add("open"),m.setAttribute("aria-hidden","false"))})}),a.querySelectorAll(".school-page__img img").forEach((o,c)=>{o.style.cursor="zoom-in",o.addEventListener("click",()=>{const u=document.getElementById("schoolLightbox"),m=document.getElementById("schoolLbImg"),b=document.getElementById("schoolLbPage");u&&m&&(m.src=s[c],b&&(b.textContent=String(c+1)),u.classList.add("open"),u.setAttribute("aria-hidden","false"))})}),a.querySelector("#schoolLbClose")?.addEventListener("click",()=>{const o=document.getElementById("schoolLightbox");o&&(o.classList.remove("open"),o.setAttribute("aria-hidden","true"))}),a.querySelector("#schoolLightbox")?.addEventListener("click",o=>{o.target.id==="schoolLightbox"&&(o.currentTarget.classList.remove("open"),o.currentTarget.setAttribute("aria-hidden","true"))}),a.querySelectorAll("[data-school-peer]").forEach(o=>{o.dataset.schoolPeer!=="蔡梓掦"&&o.addEventListener("click",()=>{const c=o.dataset.schoolPeer,u=document.createElement("div");u.textContent=c+" 的作品僅展示標題，完整內容未公開。",u.style.cssText="position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:#0f2b46;color:#fff;padding:10px 14px;border-radius:999px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:1300",document.body.appendChild(u),setTimeout(()=>u.remove(),2200)})});const r=document.getElementById("view-search");r&&(r.scrollTop=0);const l=document.querySelector(".search");l&&(l.scrollTop=0),a.scrollIntoView({behavior:"auto",block:"start"})}function Li(e){const t=mi(e);if(!t)return;const a=document.getElementById("searchDetail"),n=document.getElementById("searchLayout");if(!a||!n)return;n.style.display="none",a.style.display="block",a.classList.add("open");const i=document.getElementById("md5Tool");i&&(i.style.display="none",i.innerHTML=""),a.innerHTML=`
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
              <span class="so-qmeta__tags">${t.tags.map(r=>`<span class="so-tag">${d(r)}</span>`).join("")}</span>
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
              <div class="so-tags">${t.tags.map(r=>`<span class="so-tag">${d(r)}</span>`).join("")}</div>
              <div class="so-author-box">
                <div class="so-author__label">發問者</div>
                <div class="so-author">
                  <img src="${d(t.question.avatar)}" alt="" onerror="this.style.display='none'" />
                  <div><b>${d(t.question.author)}</b><div class="so-rep">${d(t.question.rep)} · ${d(t.question.time)}</div></div>
                </div>
              </div>
              ${t.commentsQ.length?`<div class="so-comments">${t.commentsQ.map(r=>`<div class="so-comment"><b>${d(r.user)}</b> ${d(r.text)} <span class="so-comment__time">— ${d(r.time)}</span></div>`).join("")}</div>`:""}
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
                    <img src="${d(r.avatar)}" alt="" onerror="this.style.display='none'" />
                    <div><b>${d(r.author)}</b><div class="so-rep">${d(r.rep)} · ${d(r.time)}</div></div>
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
              ${t.tags.map(r=>`<span class="so-tag">${d(r)}</span>`).join("")}
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
  `,a.querySelector("[data-so-back-search]")?.addEventListener("click",()=>oe());const s=document.getElementById("view-search");s&&(s.scrollTop=0),a.scrollIntoView({behavior:"auto",block:"start"})}function Ci(e){const t=Ve[e];if(!t)return;const a=document.getElementById("md5Tool");if(a&&(a.style.display="none",a.innerHTML=""),ui(t.url)){Li(t.url);return}const n=t.url;if(W.some(b=>b.url===n)||n.includes("sawyer-blog.example")||n.includes("mary-blog.example")||n.includes("peter-blog.example")||n.includes("paul-blog.example")||n.includes("emma-blog.example")||n.includes("david-blog.example")){let b=n;if(!xt(b)){const x=W.find(g=>g.title===t.title);x&&(b=x.url)}if(xt(b)){nt(b);return}}if(Na(t.url)||t.title.includes("廣志中學")){Ii(t);return}const i=document.getElementById("searchLayout"),s=document.getElementById("searchDetail");if(!i||!s)return;i.style.display="none",s.style.display="block",s.classList.add("open");let r="",l=null;if(t.url.startsWith("/customer-portal")||t.url.startsWith("file://")){l=t.url.replace("file://","");const b=k.getFile(l);b&&typeof b.content=="string"&&(r=b.content,k.readFile(l))}else if(k.exists(t.url)){l=t.url;const b=k.getFile(l);b&&typeof b.content=="string"&&(r=b.content)}if(!r&&t.title.startsWith("/customer-portal")){const b=k.getFile(t.title);b&&typeof b.content=="string"&&(r=b.content)}const o=r||t.snippet||"無內容",c=t.images?t.images.map(b=>`<div class="detail__image"><img src="${d(b)}" alt="preview" style="width:100%;display:block" onerror="this.src='https://via.placeholder.com/320x480?text=Sawyer+Writing'" /></div>`).join(""):t.image?`<div class="detail__image"><img src="${d(t.image)}" alt="preview" onerror="this.src='https://via.placeholder.com/320x180?text=Preview'" /></div>`:"";s.innerHTML=`
    <button id="searchBackBtn" class="btn detail__back">← 上一頁</button>
    <div class="detail__card">
      <h2 class="detail__title">${d(t.title)}</h2>
      <div class="detail__url">${d(t.url)}</div>
      ${c}
      <div class="detail__snippet">${Gt(o,Ut)}</div>
      ${r?`<pre class="detail__pre">${d(r)}</pre>`:""}
      <div class="result__meta" style="margin-top:12px">
        <span class="result__tag">${t.type}</span>
      </div>
    </div>
  `,s.querySelector("#searchBackBtn")?.addEventListener("click",()=>oe());const u=document.querySelector(".search");u&&(u.scrollTop=0);const m=document.getElementById("view-search");m&&(m.scrollTop=0),s.scrollIntoView({behavior:"auto",block:"start"})}var Ke=0,Ct=null,$i=!1,ve="/darknet",Ge="secret";function Ti(){return k.buildDarkTree?k.buildDarkTree():k.buildTree()}function Ai(e){const t=Ti();function a(i,s){if(i.path===s)return i;if(!i.children)return null;for(const r of i.children){const l=a(r,s);if(l)return l}return null}const n=a(t,e);return!n||!n.children?[]:n.children}function Ha(){document.getElementById("view-darknet")&&(p.hasFlag("dark_entered"),Et())}function Et(){const e=document.getElementById("view-darknet");if(e)if(Ge==="secret")e.innerHTML=`
      <div class="darknet">
        <button id="darkBackBtn" class="btn" style="position:absolute;top:12px;left:12px;z-index:5">← 返回內網</button>
        <div class="darknet__secret" id="darkSecretView">
          <div class="darknet__title" id="darkTitle" style="cursor:default">SECRET</div>
          <div class="darknet__subtitle">Keep Quiet · File System</div>
          <div class="darknet__search">
            <span style="color:#722F37">🔍</span>
            <input id="darkSearchInput" placeholder="輸入暗網路徑..." value="" autocomplete="off" readonly />
          </div>
        </div>
      </div>
    `,Bi();else{const t=Ai(ve),a=t.filter(i=>i.type==="dir"),n=t.filter(i=>i.type==="file");e.innerHTML=`
      <div class="darknet">
        <div style="height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;border-bottom:1px solid #1a0a0c;background:#0a0a0a;flex-shrink:0">
          <span class="small muted" style="color:#8b6a6e">機密文件庫 · ${d(ve)}</span>
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
    `,Pi(),Mi(a,n),Oi()}}function Bi(){const e=document.getElementById("darkTitle"),t=document.getElementById("darkSearchInput"),a=document.getElementById("darkBackBtn");a&&a.addEventListener("click",()=>{j(()=>Promise.resolve().then(()=>se).then(i=>{i.setActiveView&&(i.setActiveView("intranet"),localStorage.setItem("cc_active_view","intranet"))}),void 0),Ge="secret",Ft=!1;const n=document.getElementById("view-darknet");n&&(n.innerHTML="")}),e&&(e.style.cursor="default",!Ft&&(e.addEventListener("click",()=>{Ke++,Ct&&clearTimeout(Ct),Ct=setTimeout(()=>{Ke=0},2e3),Ke>=6&&(Ke=0,ji())}),t?.addEventListener("keydown",n=>{n.key==="Enter"&&(t.placeholder="請點擊上方標題六下",setTimeout(()=>t.placeholder="輸入暗網路徑...",1500))})))}function ji(){$i=!0,Ge="files",p.setFlag("dark_entered",!0),p.setFlag("ch3_entered_secret",!0),p.setFlag("hidden_portal_accessed",!0),Et(),p.setFlag("found_code_map",!0)}function Pi(){const e=document.getElementById("darkNav");e&&(e.innerHTML=[{path:"/darknet",label:"機密首頁",icon:"🕶️"},{path:"/darknet/全結構圖",label:"全結構圖",icon:"🗺️"},{path:"/darknet/交易列表",label:"交易列表",icon:"📋"},{path:"/darknet/合作公司列表",label:"合作公司",icon:"🏢"},{path:"/darknet/流量",label:"流量",icon:"📦"},{path:"/darknet/月結單",label:"月結單",icon:"💰"}].map(t=>`<div class="darknet__nav-item ${ve===t.path||ve.startsWith(t.path+"/")?"active":""}" data-path="${t.path}"><span>${t.icon}</span><span>${t.label}</span></div>`).join(""),e.querySelectorAll(".darknet__nav-item").forEach(t=>t.addEventListener("click",()=>{ve=t.dataset.path,Et()})))}function Mi(e,t){const a=document.getElementById("darkMain");if(a){if(!e.length&&!t.length){const n=k.getDarkFile?k.getDarkFile(ve):null;if(n&&n.content){a.innerHTML=`<pre style="white-space:pre-wrap;word-break:break-word;font-family:var(--font-mono);font-size:13px;color:#e9edef">${d(n.content.slice(0,8e3))}</pre>`,p.discoverFile(ve),Jt();return}a.innerHTML='<div style="padding:24px;text-align:center;color:#5a3a3e">此資料夾為空</div>';return}a.innerHTML=`
    <div style="font-size:11px;font-weight:700;letter-spacing:.6px;color:#5a3a3e;margin-bottom:8px">${d(ve)} — ${e.length} 資料夾，${t.length} 檔案</div>
    ${e.length?`<div style="margin-bottom:12px">${e.map(n=>`<div class="darknet__file-row is-dir" data-path="${d(n.path)}" data-type="dir">📁 ${d(n.name)}</div>`).join("")}</div>`:""}
    ${t.length?`<div>${t.map(n=>`<div class="darknet__file-row" data-path="${d(n.path)}" data-type="file">📄 ${d(n.name)}</div>`).join("")}</div>`:""}
  `,a.querySelectorAll(".darknet__file-row").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.path;n.dataset.type==="dir"?(ve=i,Et()):Di(i)})})}}function Di(e){const t=k.getDarkFile?k.getDarkFile(e):k.getFile(e);if(!t)return;const a=document.getElementById("darkPreview"),n=document.getElementById("darkPreviewName"),i=document.getElementById("darkPreviewContent");if(!a||!n||!i)return;n.textContent=e;let s=t.content||"";if(e.toLowerCase().endsWith(".csv")){const r=s.split(`
`).filter(b=>b.trim()!==""),l=b=>{const x=[];let g="",_=!1;for(let B=0;B<b.length;B++){const M=b[B];M==='"'?_&&b[B+1]==='"'?(g+='"',B++):_=!_:M===","&&!_?(x.push(g),g=""):g+=M}return x.push(g),x},o=l(r[0]||""),c=r.slice(1).map(l),u=`<thead><tr>${o.map(b=>`<th style="padding:8px 10px;border:1px solid #722F37;background:#1a0a0c;color:#a67c81;text-align:left">${d(b)}</th>`).join("")}</tr></thead>`,m=`<tbody>${c.map(b=>`<tr>${b.map(x=>`<td style="padding:7px 10px;border:1px solid #1a0a0c;color:#e9edef">${d(x)}</td>`).join("")}</tr>`).join("")}</tbody>`;i.innerHTML=`<div style="padding:8px 12px;border-bottom:1px solid #1a0a0c;background:#1a0a0c;display:flex;justify-content:space-between"><span class="small muted" style="color:#8b6a6e">${d(e)} — 表格檢視</span><span class="small muted" style="color:#8b6a6e">${c.length} 列</span></div><div style="overflow:auto;max-height:60vh"><table style="width:100%;border-collapse:collapse;font-size:13px">${u}${m}</table></div>`,i.style.whiteSpace="normal"}else s.length>12e3&&(s=s.slice(0,12e3)+`
...`),i.textContent=s,i.style.whiteSpace="pre-wrap";a.style.display="flex",p.discoverFile(e),p.setFlag("dark_opened:"+e,!0),Jt()}function Oi(){document.getElementById("darkExitBtn")?.addEventListener("click",()=>{Ge="secret",Jt(!0),j(()=>Promise.resolve().then(()=>se).then(t=>{t.setActiveView&&(t.setActiveView("intranet"),localStorage.setItem("cc_active_view","intranet"))}),void 0);const e=document.getElementById("view-darknet");e&&(e.innerHTML=""),p.hasFlag("ch4_all_opened")&&setTimeout(()=>{window.dispatchEvent(new CustomEvent("darknet:exit"))},300)}),document.getElementById("darkPreviewClose")?.addEventListener("click",()=>{const e=document.getElementById("darkPreview");e&&(e.style.display="none")}),document.getElementById("darkPreview")?.addEventListener("click",e=>{e.target.id==="darkPreview"&&(e.target.style.display="none")})}function Jt(e=!1){const t=k.listDarkFiles?k.listDarkFiles("/darknet"):[];if(!t.length)return;const a=t.filter(n=>p.hasFlag("dark_opened:"+n.path)||p.hasFlag("discovered:"+n.path)||p.get("discoveredFiles")?.includes(n.path));a.length>=t.length?(p.hasFlag("ch4_all_opened")||p.setFlag("ch4_all_opened",!0),e&&!p.hasFlag("ch5_triggered")&&(p.setFlag("ch5_triggered",!0),window.dispatchEvent(new CustomEvent("ch4:complete")),setTimeout(()=>{const n=document.getElementById("mailDialog");if(n&&!n.open)try{n.showModal()}catch{n.style.display="block",n.setAttribute("open","")}},500))):e&&a.length>=t.length,a.length>=t.length&&!p.hasFlag("ch4_all_opened")&&p.setFlag("ch4_all_opened",!0)}var Ft=!1;function $t(e={}){p.hasFlag("ch1_0043_committed")&&!p.hasFlag("ch1_revert_done")||document.getElementById("view-darknet")&&(Ft=!!e.simple,Ge="secret",Ke=0,j(()=>Promise.resolve().then(()=>se).then(t=>{t.setActiveView&&(t.setActiveView("darknet"),localStorage.setItem("cc_active_view","darknet"))}),void 0),Ha())}var K="/intranet",je="",ma="/intranet/client_info";function it(e){return e===ma||e.startsWith(ma+"/")}function va(e){const t=k.buildTree();function a(i,s){if(i.path===s)return i;if(!i.children)return null;for(const r of i.children){const l=a(r,s);if(l)return l}return null}const n=a(t,e);return!n||!n.children?[]:n.children}function Fi(){const e=document.getElementById("view-intranet");e&&(e.innerHTML=`
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
  `,Ni(),Va())}function Ni(){const e=k.internalPathDomain||"https://nori-intranet/internal/portal?",t=k.getLegacyRoute&&k.getLegacyRoute("nori-portal-2023")?._hash||"f665a7117959b667b7f283eaebf69cae",a=e+"hash="+t,n="https://nori-intranet/internal/portal";function i(r){if(!r)return!1;const l=r.trim();if(l===a)return!0;if(l.includes("hash="+t)&&l.includes("nori-intranet/internal/portal")){const o=k.getLegacyRoute?k.getLegacyRoute("nori-portal-2023"):null;return o&&o.domain===e?!0:l===a}return!1}function s(){const r=document.getElementById("intraSearch"),l=r?r.value.trim():"",o=l===n||l===n+"/"||l.includes("nori-intranet/internal/portal")&&!l.includes("hash="),c=i(l);if(p.hasFlag("ch1_0043_committed")&&!p.hasFlag("ch1_revert_done")&&(o||c)){je=l.toLowerCase(),Nt();return}if(o){$t({simple:!0});return}if(c){const u=l.match(/hash=([a-f0-9]{32})/i),m=u?u[1]:t;if(k.tryAccessPortal&&k.tryAccessPortal({hash:m})){$t({simple:!1});return}else if(l===a){$t({simple:!1});return}}je=l.toLowerCase(),Nt()}document.getElementById("intraSearchBtn")?.addEventListener("click",s),document.getElementById("intraSearch")?.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),s())}),document.getElementById("intraPreviewClose")?.addEventListener("click",Bt),document.getElementById("intraPreview")?.addEventListener("click",r=>{r.target.id==="intraPreview"&&Bt()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&Bt()})}function Va(){Hi(),Vi(),Nt();const e=k.listFiles("/intranet").length,t=document.getElementById("intraCount");t&&(t.textContent=`內網共 ${e} 個檔案`)}function Hi(){const e=document.getElementById("intraBreadcrumb");if(!e)return;const t=K.split("/").filter(Boolean);let a='<span class="intra-bc__item" data-path="/intranet">🏠 內網首頁</span>',n="/intranet";const i=t[0]==="intranet"?1:0;t.slice(i).forEach(s=>{n+="/"+s;const r=it(n);a+=` <span class="muted">›</span> <span class="intra-bc__item ${n===K?"active":""} ${r?"locked":""}" data-path="${d(n)}">${d(s)}${r?" 🔒":""}</span>`}),K==="/intranet"&&(a='<span class="intra-bc__item active" data-path="/intranet">🏠 內網首頁</span>'),e.innerHTML=a,e.querySelectorAll(".intra-bc__item").forEach(s=>{s.addEventListener("click",()=>It(s.dataset.path))})}function Vi(){const e=document.getElementById("intraNav");e&&(e.innerHTML=[{path:"/intranet",label:"內網首頁",icon:"🏠",desc:"總覽"},{path:"/intranet/company_public",label:"公司公開資訊",icon:"🏢",desc:"名稱・Logo・大樓名錄"},{path:"/intranet/client_info",label:"客戶資料",icon:"🔒",desc:"權限管制（鎖定）",locked:!0},{path:"/intranet/business_plans",label:"業務計畫",icon:"📊",desc:"完整流程結構"},{path:"/intranet/staff",label:"員工資料",icon:"👥",desc:"50 人名錄"}].map(t=>`<div class="intra-nav__item ${K===t.path||t.path!=="/"&&K.startsWith(t.path+"/")?"active":""} ${t.locked?"locked":""}" data-path="${t.path}" title="${t.path}">
      <span class="intra-nav__icon">${t.icon}</span>
      <span class="intra-nav__label">${t.label}</span>
      <span class="intra-nav__desc">${t.desc}</span>
    </div>`).join("")+`
    <div class="intra-nav__hint small muted" style="padding:10px 12px;border-top:1px solid var(--border);margin-top:8px">
      點擊資料夾瀏覽<br/>點擊檔案預覽內容<br/>客戶資料夾受保護，請向管理員申請讀取權限
    </div>
  `,e.querySelectorAll(".intra-nav__item").forEach(t=>{t.addEventListener("click",()=>It(t.dataset.path))}))}function Nt(){const e=document.getElementById("intraMain");if(!e)return;if(je){const i=k.searchContent(je).filter(o=>o.path.startsWith("/intranet")).slice(0,40),s=k.listFiles("/intranet").filter(o=>o.path.toLowerCase().includes(je)).slice(0,40),r=new Map;i.forEach(o=>r.set(o.path,o)),s.forEach(o=>{r.has(o.path)||r.set(o.path,{path:o.path,snippet:""})});const l=[...r.values()];if(!l.length){e.innerHTML='<div class="intra-empty">無搜尋結果 — 試試「Nori」「冰釀茶酒」「業務流程」「Sawyer」</div>';return}e.innerHTML=`
      <div class="intra-section__title">搜尋結果「${d(je)}」— ${l.length} 筆</div>
      <div class="intra-file__list">
        ${l.map(o=>{const c=k.getFile(o.path)?.meta?.locked||it(o.path);return`<div class="intra-file__row ${c?"locked":""}" data-path="${d(o.path)}" title="${d(o.path)}">
            <span class="intra-file__icon">${c?"🔒":Ht(o.path)}</span>
            <span class="intra-file__name">${d(o.path)}</span>
            <span class="small muted" style="margin-left:auto;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d((o.snippet||"").slice(0,60))}</span>
          </div>`}).join("")}
      </div>
    `,At(e);return}if(it(K)){e.innerHTML=`
      <div class="intra-locked">
        <div class="intra-locked__icon">🔒</div>
        <h3>客戶資料 — 權限不足</h3>
        <p class="small muted">本資料夾受保護，僅限法務與客戶經理存取。<br/>遊戲內無需開啟，請返回其他資料夾。</p>
        <div class="intra-locked__files">
          <div class="small" style="font-weight:600;margin-bottom:6px">受保護檔案（僅顯示名稱）</div>
          ${va(K).map(i=>`<div class="intra-file__row locked" title="${d(i.path)}"><span>${Ht(i.path)}</span><span>${d(i.name)}</span><span class="small muted" style="margin-left:auto">🔒 鎖定</span></div>`).join("")}
        </div>
        <button class="btn" style="margin-top:12px" onclick="document.querySelector('[data-path='/intranet']')?.click()">返回內網首頁</button>
      </div>
    `;return}const t=va(K),a=t.filter(i=>i.type==="dir"),n=t.filter(i=>i.type==="file");if(K==="/intranet"&&!je){e.innerHTML=`
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
          ${t.map(i=>Tt(i)).join("")}
        </div>
      </div>
    `,e.querySelectorAll("[data-path]").forEach(i=>i.addEventListener("click",s=>{s.stopPropagation();const r=i.getAttribute("data-path");r&&It(r)})),At(e);return}if(!t.length){const i=k.getFile(K);if(i&&i.content!=null){e.innerHTML=`<div class="intra-section__title">${d(K)}</div><pre class="intra-file__preview mono">${d(i.content.slice(0,8e3))}</pre>`;return}e.innerHTML='<div class="intra-empty">此資料夾為空</div>';return}e.innerHTML=`
    <div class="intra-section__title">${d(K)} — ${a.length} 個資料夾，${n.length} 個檔案</div>
    ${a.length?`<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">資料夾</div>${a.map(i=>Tt(i)).join("")}</div>`:""}
    ${n.length?`<div class="intra-file__list"><div class="small muted" style="padding:4px 8px">檔案</div>${n.map(i=>Tt(i)).join("")}</div>`:""}
  `,At(e)}function Tt(e){const t=e.path&&it(e.path),a=(e.path?k.getFile(e.path):null)?.meta?.locked||t,n=a?"🔒":e.type==="dir"?"📁":Ht(e.path||e.name);return`<div class="intra-file__row ${e.type==="dir"?"is-dir":""} ${a?"locked":""}" data-path="${d(e.path)}" data-type="${e.type}" title="${d(e.path)}">
    <span class="intra-file__icon">${n}</span>
    <span class="intra-file__name">${d(e.name)}</span>
    <span class="small muted" style="margin-left:auto">${e.type==="dir"?"資料夾":e.path?.split(".").pop()||"檔案"}</span>
  </div>`}function Ht(e){return e?e.endsWith(".md")?"📝":e.endsWith(".csv")?"📊":e.endsWith(".svg")?"🖼️":e.endsWith(".json")?"🧩":e.endsWith(".js")||e.endsWith(".java")?"💻":e.endsWith(".html")?"🌐":e.endsWith(".pdf")?"📕":"📄":"📄"}function At(e){e.querySelectorAll(".intra-file__row").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.path,n=t.dataset.type;if(t.classList.contains("locked")){if(document.getElementById("intraMain")){const i=document.createElement("div");i.className="toast",i.style.cssText="position:fixed;right:12px;bottom:64px;background:#323232;color:#fff;padding:10px 12px;border-radius:8px;z-index:999",i.textContent="🔒 權限不足 — 客戶資料受保護，遊戲內無需存取",document.body.appendChild(i),setTimeout(()=>i.remove(),2200)}return}n==="dir"?It(a):qi(a)})})}function It(e){e&&(K=e,Va())}function Ri(e){const t=e.split(`
`).filter(n=>n.trim()!=="");if(!t.length)return{header:[],rows:[]};const a=n=>{const i=[];let s="",r=!1;for(let l=0;l<n.length;l++){const o=n[l];o==='"'?r&&n[l+1]==='"'?(s+='"',l++):r=!r:o===","&&!r?(i.push(s),s=""):s+=o}return i.push(s),i};return{header:a(t[0]),rows:t.slice(1).map(a)}}function qi(e){const t=k.getFile(e);if(!t||t.meta?.locked||it(e))return;const a=document.getElementById("intraPreview"),n=document.getElementById("intraPreviewName"),i=document.getElementById("intraPreviewContent");if(!a||!n||!i)return;n.textContent=e;let s=t.content||"";if(e.toLowerCase().endsWith(".csv")){const{header:r,rows:l}=Ri(s),o=`<thead><tr>${r.map(u=>`<th>${d(u)}</th>`).join("")}</tr></thead>`,c=`<tbody>${l.map(u=>`<tr>${u.map(m=>`<td>${d(m)}</td>`).join("")}</tr>`).join("")}</tbody>`;i.innerHTML=`
      <div class="csv-preview__header"><span class="small muted mono">${d(e)} — 表格檢視</span><span class="small muted">${l.length} 列 × ${r.length} 欄</span></div>
      <div style="overflow:auto;max-height:60vh"><table class="csv-table">${o}${c}</table></div>
    `,i.style.whiteSpace="normal"}else s.length>12e3&&(s=s.slice(0,12e3)+`
...（內容已截斷，完整請於 Vizual Studio Code 開啟）`),i.textContent=s,i.style.whiteSpace="pre-wrap";a.style.display="flex"}function Bt(){const e=document.getElementById("intraPreview");e&&(e.style.display="none")}function ga(){const e=p.get("settings.theme")||"dark";document.documentElement.setAttribute("data-theme",e)}function pe(e){ka(e),localStorage.setItem("cc_active_view",e)}function zi(){Pn(),zt(),Ta(),bi(),Fi(),Ha(),Ui(),Gi(),Yi()}var Ra=null;function Wi(){if(p.hasFlag("ch0_maggie_notified")||p.hasFlag("ch0_vip_fixed")||(p.get("currentChapter")??0)!==0||document.getElementById("wa-win-notification"))return;const e=document.createElement("div");e.id="wa-win-notification",e.setAttribute("role","alert"),e.setAttribute("aria-live","polite"),e.innerHTML=`
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
  `,e.addEventListener("click",t=>{if(!t.target.closest(".win-notif__close")){jt();try{We("dev-team")}catch{}pe("whatsapp")}}),e.querySelector(".win-notif__close")?.addEventListener("click",t=>{t.stopPropagation(),jt()}),document.body.appendChild(e),p.setFlag("ch0_maggie_notified",!0),requestAnimationFrame(()=>e.classList.add("show")),Ra=setTimeout(()=>jt(),1e4)}function jt(){const e=document.getElementById("wa-win-notification");e&&(clearTimeout(Ra),e.classList.remove("show"),e.classList.add("hide"),setTimeout(()=>e.remove(),280))}function qa(e){e==="jira_viewed"&&p.setFlag("onb_jira_viewed",!0),e==="vscode_viewed"&&p.setFlag("onb_vscode_viewed",!0),p.hasFlag("onboarding_done")||p.setFlag("onboarding_done",!0)}function Ui(){const e=document.getElementById("mailDialog"),t=document.getElementById("mailTitle"),a=document.getElementById("mailTo"),n=document.getElementById("mailSend"),i=document.getElementById("mailTempExit");function s(){if(!t||!a)return;const r=t.value;r==="Report"?a.value="Drug Enforcement Administration <dea@email.us>":(r==="Coperation"||r==="Resign")&&(a.value="Sawyer <sawyer@nori.com>")}t?.addEventListener("change",s),s(),i?.addEventListener("click",()=>{e?.close(),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te})}),n?.addEventListener("click",()=>{const r=t?.value;document.getElementById("mailBody")?.value;let l=null;if(r==="Report"?l="report":r==="Coperation"?l="cooperate":r==="Resign"&&(l="resign"),l){const o=p.get("endings")||[];o.includes(l)||(o.push(l),p.set("endings",o),p.setFlag("ending_"+l,!0))}e?.close(),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te}),l?setTimeout(()=>za(l),300):Re("郵件已寄送: "+r)})}function Gi(){const e=document.getElementById("startMenu");e&&document.addEventListener("click",t=>{const a=t.target.closest&&t.target.closest(".taskbar__start"),n=t.target.closest&&t.target.closest("#startShutdown"),i=t.target.closest&&t.target.closest("#startLogout");if(a){t.stopPropagation();const s=e.style.display==="none"||!e.style.display||e.style.display==="";e.style.display=s?"block":"none";return}if(n){t.stopPropagation(),e.style.display="none",ha("shutdown");return}if(i){t.stopPropagation(),e.style.display="none",ha("logout");return}e.contains(t.target)||(e.style.display="none")})}function ha(e){const t=p.get("endings")||[],a=p.hasFlag("ch4_all_opened"),n=t[0];let i=null;!n&&!a?i="flee":!n&&a?i="fried":n==="report"?i="report":n==="cooperate"?i="cooperate":n==="resign"?i="resign":i="flee";const s=p.get("endings")||[];s.includes(i)||(s.push(i),p.set("endings",s)),za(i)}function za(e){const t=document.getElementById("endingScreen"),a=document.getElementById("endingTitle"),n=document.getElementById("endingDesc"),i=document.getElementById("endingRestart");if(!t||!a||!n)return;const s={flee:"flee",cooperate:"cooperate",report:"report",resign:"resign",fried:"fried"}[e];s&&G.play(s);const r={flee:{title:"平凡的日常",desc:`你已完成了工作，登出了電腦，走出辨公室，回到家中安心睡一覺。
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
公司也發現了你。`}},l=r[e]||r.flee;a.textContent=l.title,n.textContent="",i&&(i.style.display="none"),n.style.whiteSpace="pre-wrap",n.style.wordBreak="break-word",setTimeout(()=>{t.style.display="flex",t.style.background="#000";let o=[];const c=l.desc.replace(/br/g,`
`).replace(/\n+/g,`
`).split(/([，。、！？；\n\s]+)/).filter(Boolean);for(const x of c)if(/^[\n\s]+$/.test(x))o.push(x);else if(/^[，。、！？；]+$/.test(x))o.push(x);else for(let g=0;g<x.length;g+=1)o.push(x.slice(g,g+1));let u=0,m="";function b(){if(u>=o.length){i&&(i.style.display="block");return}const x=o[u];m+=x,n.textContent=m,u++;let g=100;(/[，。、！？；]$/.test(x)||x===`
`||x.includes(`
`))&&(g+=200),/^\s+$/.test(x)&&(g=100),e==="fried"&&(x==="其"||x==="實"||m.includes("其實"))&&(g=420),setTimeout(b,g)}b()},500)}function Yi(){document.getElementById("endingRestart")?.addEventListener("click",async()=>{G.stop(!1);try{p.reset()}catch{}try{localStorage.removeItem("code_conspiracy_state")}catch{}try{localStorage.clear()}catch{}const e=document.getElementById("endingScreen");e&&(e.style.display="none"),document.querySelectorAll("dialog[open]").forEach(t=>{try{t.close()}catch{}t.style.display="none"});try{if("caches"in window){const t=await caches.keys();await Promise.all(t.map(a=>caches.delete(a)))}if("serviceWorker"in navigator){const t=await navigator.serviceWorker.getRegistrations();await Promise.all(t.map(a=>a.unregister()))}}catch{}setTimeout(()=>{window.location.href=window.location.pathname+"?reset="+Date.now(),window.location.reload(!0)},150)}),document.getElementById("endingClose")?.addEventListener("click",()=>{document.getElementById("endingScreen").style.display="none"})}function fa(){ga(),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te}),yn(),zi();const e=localStorage.getItem("cc_active_view")||"vscode";pe(p.get("unlockedInterfaces").includes(e)?e:"vscode"),mn(),G.play("default"),p.hasFlag("onboarding_done")||p.setFlag("onboarding_done",!0),setTimeout(()=>Wi(),800),U.on("puzzle:solved",t=>{Re("✓ "+t.title)}),U.on("interfaceUnlocked",t=>{Re(te("toast.unlocked")+": "+t),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te})}),U.on("evidence",t=>{Re(te("toast.evidence")+": "+t.title)}),p.on("change",()=>ga()),window.addEventListener("ch4:complete",()=>{p.setFlag("ch5_triggered",!0),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te}),setTimeout(()=>{const t=document.getElementById("mailDialog");if(t&&!t.open){const a=document.getElementById("mailTitle"),n=document.getElementById("mailTo");if(a&&n){const i=a.value;i==="Report"?n.value="DEA <dea@world.example>":(i==="Coperation"||i==="Resign")&&(n.value="Sawyer <sawyer@nori-drinks.example>")}t.showModal()}},600)}),window.addEventListener("darknet:exit",()=>{G.play("default"),p.hasFlag("ch4_all_opened")&&!p.hasFlag("ch5_triggered")?(p.setFlag("ch5_triggered",!0),be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te}),setTimeout(()=>{const t=document.getElementById("mailDialog");t&&!t.open&&t.showModal()},400)):p.hasFlag("ch5_triggered")&&((p.get("endings")||[]).length||setTimeout(()=>{const t=document.getElementById("mailDialog");t&&!t.open&&t.showModal()},400))}),p.on("change",t=>{t&&t.path&&t.path.includes("ch5_triggered")&&be({onSwitch:pe,onOpenSettings:Ae,onOpenNotebook:Be,t:te}),t&&t.path&&t.path.includes("dark_entered")&&G.play("darknet"),t&&t.path&&t.path.includes("ch0_vip_fixed")&&!p.hasFlag("ch1_event1_triggered")&&(p.setFlag("ch1_event1_triggered",!0),setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(a=>{a.triggerCh1Event1&&a.triggerCh1Event1()}),void 0)},1e4))}),p.hasFlag("ch0_vip_fixed")&&!p.hasFlag("ch1_event1_triggered")&&(p.setFlag("ch1_event1_triggered",!0),setTimeout(()=>{j(()=>Promise.resolve().then(()=>ue).then(t=>{t.triggerCh1Event1&&t.triggerCh1Event1()}),void 0)},1e4)),window.addEventListener("jira:ticketAdded",()=>{document.getElementById("jiraBoard")&&j(()=>Promise.resolve().then(()=>Qe).then(t=>{U.emit("jira:refresh")}),void 0)}),window.addEventListener("jira:refresh",()=>{try{zt()}catch{}}),document.querySelectorAll("dialog").forEach(t=>{t.addEventListener("click",n=>{n.target===t&&t.close()}),t.addEventListener("close",()=>{t.style.display="none",setTimeout(()=>{t.open||(t.style.display="none")},0)});const a=t.showModal;a&&(t.showModal=function(){return this.style.display="block",a.call(this)})}),document.addEventListener("click",t=>{const a=t.target.closest("button");if(a&&a.textContent.trim()==="關閉"&&a.closest("dialog")){const n=a.closest("dialog");setTimeout(()=>{n.open||(n.style.display="none")},50)}})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fa):fa();

//# sourceMappingURL=main-wI-eHngP.js.map