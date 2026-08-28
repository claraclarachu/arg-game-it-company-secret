# ARG Game Plan: "Code & Conspiracy"

## 1. Game Overview

**Title:** Code & Conspiracy (暫定名稱)
**Genre:** ARG (Alternate Reality Game) / Narrative Puzzle / Simulation
**Platform:** HTML5 + JavaScript (Vanilla, no frameworks)
**Storage:** LocalStorage only (fully offline playable)
**Target Devices:** PC (Desktop) & Mobile (Responsive)
**Language:** Traditional Chinese / English (i18n ready)

---

## 2. Core Concept

玩家扮演一名精通 **Java、JavaScript、Python** 的程式設計師，在一間看似正常的科技公司工作。某天在處理 Jira ticket 時，意外發現公司檔案系統中有一個隱藏資料夾，裡面藏著耐人尋味的線索。隨著調查深入，玩家將揭開真相：**這間公司的核心業務竟是販毒**，而所有的軟體開發只是掩護。

---

## 3. Simulated Interfaces (四大核心介面)

### 3.1 VS Code Editor (代碼編輯器)
- **功能**：閱讀/編輯代碼、搜尋檔案、終端機模擬、Git 歷史查看、運行/除錯模擬
- **謎題類型**：
  - 代碼審查發現註解中的隱藏訊息
  - 解讀混淆代碼找出真實邏輯
  - Git commit 歷史中藏有密碼/線索
  - `.env`、配置檔中的可疑參數
  - Terminal 歷史指令分析
  - **追蹤邊緣案例代碼路徑，觸發隱藏功能/頁面**
  - **構造特定輸入觸發條件分支 (如特定金額、參數組合)**
  - **分析中間件/攔截器發現隱藏路由驗證邏輯**

### 3.2 Jira Board (專案管理)
- **功能**：查看 Sprint、Ticket 詳情、評論區、附件、Workflow 狀態
- **謎題類型**：
  - Ticket 描述中的暗語
  - 評論區同事對話的陰陽怪氣提示
  - 附件檔案（圖片、PDF、壓縮檔）隱藏資訊
  - Epic/Story 之間的關聯圖譜
  - 工作流狀態異常轉換

### 3.3 WhatsApp Web (通訊軟體)
- **功能**：聊天列表、對話內容、語音訊息、圖片/檔案傳送、已讀狀態
- **謎題類型**：
  - 同事私聊洩露內幕
  - 群組討論中的關鍵字
  - 語音訊息需轉文字（模擬語音轉文字功能）
  - 刪除的訊息痕跡
  - 聊天備份檔案解析

### 3.4 Search Engine (搜尋引擎)
- **功能**：關鍵字搜尋、搜尋建議、快照預覽、進階搜尋語法
- **謎題類型**：
  - 搜尋特定關鍵字發現被隱藏的頁面
  - `site:`、`filetype:` 等進階語法挖掘
  - 搜尋建議自動完成的異常提示
  - 快照中已刪除的內容
  - 反向圖片搜尋追蹤來源

---

## 4. Game Flow & Chapter Design

### Chapter 0: Onboarding (教學關)
- 熟悉四大介面操作
- 完成第一個簡單 Jira ticket
- 學會在 VS Code 找檔案、搜尋關鍵字
- **解鎖**：存取公司內網權限

### Chapter 1: The Anomaly (異常發現)
- Jira ticket: "INV-2024-0042: 修復計費模組邊緣案例 — 某特定金額計算錯誤"
- 在 VS Code 追蹤代碼發現 `billing/service.js` 有異常 import，且在邊緣情況下會觸發一個未文檔化的代碼路徑
- 發現一行可疑代碼：`if (amount === 420.69) return redirectTo('/internal/portal');` (藏在深層巢狀條件中)
- 玩家需構造測試數據觸發該條件，意外進入隱藏的內部管理頁面 `/internal/portal`
- **關鍵線索**：隱藏頁面顯示一組 API 憑證、一個異常的「庫存管理」介面、以及一份偽裝成「可可豆採購單」的 PDF

### Chapter 2: The Hidden Portal (隱藏入口)
- 在 `/internal/portal` 頁面發現一個偽裝成「原材料採購系統」的介面，實際功能是毒品庫存/訂單管理
- 頁面需特定 Referrer Header 或 Cookie 才能存取 (玩家需在代碼中找出驗證邏輯)
- 發現專案代號對照表：`COCOA` = 可卡因、`BEAN` = 海洛因、`LEAF` = 大麻、`CRYSTAL` = 冰毒
- WhatsApp 群組 "Backend Team" 討論 "cocoa bean shipment delay" 實際指毒品出貨延遲
- 搜尋引擎查 "cocoa bean import license" 發現無相關紀錄，但搜尋化學代號發現暗網交易紀錄

### Chapter 3: Following the Money (追蹤資金流)
- Jira Epic: "Payment Gateway Integration v3" — 實際是洗錢管道整合
- 在 portal 頁面發現加密貨幣錢包地址、混淆器配置、自動轉帳腳本
- Terminal 歷史顯示 `npm install --save-dev @shady/crypto-mixer`
- 同事私聊提醒："別動 payment 模組，那邊有 'legacy code'" (暗指洗錢邏輯)
- 玩家需在代碼中找出「手續費計算」實際是「分潤比例」

### Chapter 4: The Ledger (帳本)
- 在 portal 管理介面發現「匯出資料」功能，下載到一份 SQLite 資料庫 `ledger.db`
- 需在 VS Code 終端機用 sql.js (WASM) 查詢，或發現內建的查詢介面有 SQL 注入漏洞
- 發現交易記錄：金額、地點、代號、客戶化名、物流追蹤號
- 關鍵發現：所有交易對應真實城市座標，且物流追蹤號可在搜尋引擎查到真實快遞資訊

### Chapter 5: The Network (網絡)
- WhatsApp 聊天記錄顯示 "supplier" 聯繫方式
- 搜尋引擎反查電話/Email 發現殼公司
- Jira 附件中的架構圖實際是物流路線圖
- 終端機 `ssh` 連線記錄指向海外伺服器

### Chapter 6: The Confrontation (對峙)
- 收集足夠證據後，觸發最終選擇
- 選項 A：舉報 (觸發結局：舉報者保護計畫)
- 選項 B：滅口/合作 (觸發結局：成為核心成員)
- 選項 C：偷偷備份證據後離職 (觸發結局：流亡開發者)
- **多重結局**，根據收集證據完整度、選擇時機不同

### Chapter 7: New Game+ (二周目)
- 保留部分進度 (New Game+ 模式)
- 解鎖新視角：以資安工程師/臥底警員/競爭對手身份重玩
- 新謎題、新隱藏檔案、新結局

---

## 5. Puzzle Mechanics & Technical Implementation

### 5.1 狀態管理 (LocalStorage Schema)
```javascript
const gameState = {
  version: "1.0.0",
  currentChapter: 0,
  unlockedInterfaces: ["vscode", "jira"], // 逐步解鎖
  discoveredFiles: [], // 發現的虛擬檔案路徑
  collectedEvidence: [], // 證據清單 {id, type, content, chapter}
  whatsappChats: {}, // 已讀/解鎖的對話
  jiraTickets: {}, // 已查看的 ticket
  searchHistory: [], // 搜尋記錄
  flags: {}, // 觸發條件旗標
  endings: [], // 達成的結局
  settings: { language: "zh-TW", theme: "dark", sound: true }
};
```

### 5.2 虛擬檔案系統 (VFS)
- 模擬樹狀結構：`/workspace/`, `/home/user/`, `/var/www/`, `/internal/` (隱藏路由)
- 檔案類型：`.js`, `.py`, `.java`, `.json`, `.sql`, `.md`, `.pdf`, `.db`, `.log`
- 檔案內容支援：純文字、Base64、加密、二進制(hex dump)
- 特殊機制：隱藏路由頁面 (需特定條件觸發)、動態生成的內容

### 5.3 謎題驗證系統
```javascript
const puzzles = {
  "ch1_trigger_hidden_route": {
    check: (state) => state.flags.hidden_portal_accessed === true,
    reward: { evidence: "e001", unlock: ["search", "whatsapp"] }
  },
  "ch2_bypass_portal_auth": {
    check: (state) => state.flags.portal_auth_bypassed === true,
    reward: { evidence: "e002", evidence: "e003", unlock: ["jira_advanced"] }
  }
  // ...
};
```

### 5.4 線索關聯圖 (Evidence Board)
- 玩家可在「筆記本」介面查看所有證據
- 支援拖拉建立連結、標記、備註
- 自動提示關聯性 (共同關鍵字、時間、人物)

---

## 6. Responsive Design & Layer Architecture

### 6.1 Layout Strategy
```
┌─────────────────────────────────────┐
│  Top Bar (時間、電量、網路狀態模擬)    │  ← Fixed, z-index: 100
├─────────────────────────────────────┤
│                                     │
│   Main Viewport (四大介面切換)        │  ← Flex/Grid, z-index: 10
│   [VS Code] [Jira] [WA] [Search]    │
│                                     │
├─────────────────────────────────────┤
│  Bottom Dock (快捷切換、通知中心)      │  ← Fixed, z-index: 100
└─────────────────────────────────────┘
```

### 6.2 Breakpoints
- **Mobile**: `< 768px` - 單欄、底部導航、全螢幕模態框
- **Tablet**: `768px - 1024px` - 兩欄可調整、側邊欄摺疊
- **Desktop**: `> 1024px` - 多視窗並排、可調整分割線、快捷鍵支援

### 6.3 CSS Architecture
```css
/* CSS Custom Properties for Theming */
:root {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252526;
  --fg-primary: #d4d4d4;
  --accent: #007acc;
  --border: #3c3c3c;
  --sidebar-w: 280px;
  --header-h: 40px;
  --footer-h: 56px;
}

/* Layer System */
.layer-base { z-index: 1; }      /* 背景、桌面圖示 */
.layer-app { z-index: 10; }      /* 主應用視窗 */
.layer-modal { z-index: 100; }   /* 對話框、選單 */
.layer-toast { z-index: 1000; }  /* 通知、提示 */
.layer-debug { z-index: 9999; }  /* 開發者工具 */
```

### 6.4 Touch & Mobile Optimizations
- 虛擬鍵盤彈出時 viewport 調整
- 長按模擬右鍵選單
- 雙指縮放程式碼編輯器
- 滑動切換介面 (左右滑動)
- 觸覺回饋 (Vibration API)

---

## 7. File Structure

```
/argGameProj/
├── index.html              # 入口點
├── manifest.json           # PWA 設定 (離線支援)
├── sw.js                   # Service Worker
├── assets/
│   ├── css/
│   │   ├── main.css        # 核心樣式
│   │   ├── themes.css      # 主題變數
│   │   ├── vscode.css      # VS Code 模擬樣式
│   │   ├── jira.css        # Jira 模擬樣式
│   │   ├── whatsapp.css    # WhatsApp 模擬樣式
│   │   ├── search.css      # 搜尋引擎樣式
│   │   └── responsive.css  # 響應式斷點
│   ├── js/
│   │   ├── core/
│   │   │   ├── engine.js       # 遊戲核心引擎
│   │   │   ├── state.js        # 狀態管理
│   │   │   ├── vfs.js          # 虛擬檔案系統
│   │   │   ├── puzzles.js      # 謎題定義與驗證
│   │   │   ├── i18n.js         # 多語言
│   │   │   └── events.js       # 事件總線
│   │   ├── apps/
│   │   │   ├── vscode/
│   │   │   │   ├── index.js    # VS Code 主邏輯
│   │   │   │   ├── editor.js   # Monaco-like 編輯器
│   │   │   │   ├── terminal.js # 終端機模擬
│   │   │   │   ├── explorer.js # 檔案總管
│   │   │   │   └── git.js      # Git 歷史
│   │   │   ├── jira/
│   │   │   │   ├── index.js
│   │   │   │   ├── board.js    # 看板視圖
│   │   │   │   ├── ticket.js   # Ticket 詳情
│   │   │   │   └── search.js   # JQL 搜尋
│   │   │   ├── whatsapp/
│   │   │   │   ├── index.js
│   │   │   │   ├── chatlist.js
│   │   │   │   ├── conversation.js
│   │   │   │   └── media.js    # 多媒體處理
│   │   │   └── search/
│   │   │       ├── index.js
│   │   │       ├── results.js
│   │   │       └── advanced.js
│   │   ├── ui/
│   │   │   ├── notebook.js     # 證據筆記本
│   │   │   ├── dock.js         # 底部工具列
│   │   │   ├── notifications.js
│   │   │   └── settings.js
│   │   └── utils/
│   │       ├── crypto.js       # 加解密工具
│   │       ├── storage.js      # LocalStorage 封裝
│   │       ├── helpers.js
│   │       └── constants.js
│   └── data/
│       ├── chapters/           # 關卡資料 (JSON)
│       ├── files/              # 虛擬檔案內容
│       ├── dialogues/          # 對話腳本
│       └── puzzles/            # 謎題定義
├── chapters/
│   ├── ch0_onboarding.json
│   ├── ch1_anomaly.json
│   ├── ch2_hidden_portal.json
│   ├── ch3_money.json
│   ├── ch4_ledger.json
│   ├── ch5_network.json
│   ├── ch6_confrontation.json
│   └── ch7_newgameplus.json
└── README.md
```

---

## 8. Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] 專案初始化、建置工具 (Vite/ESBuild 或純 ES Module)
- [ ] 核心狀態管理引擎
- [ ] LocalStorage 持久化、匯入/匯出存檔
- [ ] 響應式佈局系統、主題切換
- [ ] 四大介面外殼 (空白框架)
- [ ] PWA 設定、Service Worker 離線快取

### Phase 2: VS Code Simulator (Week 2-3)
- [ ] 檔案總管樹狀結構、搜尋 (Cmd+P / Cmd+Shift+F)
- [ ] 代碼編輯器 (語法高亮、行號、摺疊、多游標)
- [ ] 終端機模擬 (指令歷史、Tab 補全、假指令輸出)
- [ ] Git 面板 (log、diff、blame)
- [ ] 設定面板、鍵盤快捷鍵映射

### Phase 3: Jira Simulator (Week 3-4)
- [ ] 看板視圖 (拖拉、篩選、泳道)
- [ ] Ticket 詳情模態框 (描述、評論、附件、歷史)
- [ ] JQL 搜尋介面
- [ ] Sprint 報表、燃盡圖 (假資料)

### Phase 4: WhatsApp Web Simulator (Week 4-5)
- [ ] 聊天列表 (搜尋、置頂、靜音、歸檔)
- [ ] 對話視圖 (氣泡、時間分組、已讀雙勾)
- [ ] 多媒體預覽 (圖片、語音、文件)
- [ ] 聯絡人資訊、群組資訊
- [ ] 搜尋訊息、導出聊天記錄

### Phase 5: Search Engine Simulator (Week 5-6)
- [ ] 搜尋首頁、自動完成建議
- [ ] 結果頁面 (標題、摘要、URL、快照)
- [ ] 進階搜尋語法解析器
- [ ] 圖片搜尋、新聞、學術切換
- [ ] 搜尋歷史、趨勢

### Phase 6: Content & Puzzles (Week 6-8)
- [ ] 撰寫 7 章劇本、對話、檔案內容
- [ ] 設計 30+ 謎題、驗證邏輯 (含：邊緣案例觸發、隱藏路由發現、條件分支構造、中間件分析、SQL 注入/查詢、暗網搜尋)
- [ ] 製作虛擬檔案系統資料、隱藏頁面內容
- [ ] 多語言翻譯 (zh-TW / en)
- [ ] 成就系統、蒐集要素

### Phase 7: Polish & Testing (Week 8-10)
- [ ] 完整流程測試 (PC / Mobile / Tablet)
- [ ] 效能優化 (大檔案載入、虛擬滾動)
- [ ] 存檔相容性、版本遷移
- [ ] 無障礙支援 (鍵盤導航、螢幕閱讀器)
- [ ] 建立部署腳本、產出靜態檔案

---

## 9. Technical Decisions & Rationale

| 決策 | 方案 | 理由 |
|------|------|------|
| 框架 | **Vanilla JS + ES Modules** | 零依賴、體積小、離線優先、易維護 |
| 編輯器 | **自實作輕量編輯器** | Monaco 太重 (2MB+)，CodeMirror 仍大；自製支援語法高亮即可 |
| 加密 | **Web Crypto API (SubtleCrypto)** | 瀏覽器原生、無依賴、效能好 |
| 資料庫 | **sql.js (WASM)** | 在瀏覽器跑 SQLite，查詢 ledger.db 真實感強 |
| 圖表 | **無 / 純 CSS** | 燃盡圖用 SVG 手繪即可，避免 Chart.js 體積 |
| 國際化 | **扁平 JSON + 模板字串** | 簡單、無執行時依賴 |
| 部署 | **GitHub Pages / Netlify / 靜態檔案** | 純前端、免費、HTTPS、離線支援 |

---

## 10. Risk Assessment & Mitigation

| 風險 | 影響 | 緩解策略 |
|------|------|----------|
| LocalStorage 容量限制 (5-10MB) | 存檔失敗 | 壓縮狀態 (LZ-string)、分章節存檔、清理舊資料 |
| 手機效能不足 | 卡頓 | 虛擬滾動、懶載入、去抖動、requestIdleCallback |
| 玩家卡關流失 | 留存率低 | 提示系統、逐步解鎖、多解法、社群提示 (分享碼) |
| 內容製作量大 | 延期 | 模組化資料、外部 JSON、工具輔助生成 |
| 瀏覽器相容性 | 功能失效 | Polyfill 最小集、優雅降級、早期測試 |

---

## 11. Future Extensions (Post-MVP)

- **Steam/itch.io 發布** (Electron 打包)
- **社群分享功能** (匿名進度分享、提示交換)
- **關卡編輯器** (玩家自製謎題)
- **續作/資料片** (同世界觀不同主角)
- **實體周邊** (貼紙、筆記本、T恤)

---

## 12. Success Metrics

- **完成率**: Chapter 6 達成 > 15%
- **平均遊玩時長**: > 45 分鐘
- **二周目率**: > 20%
- **離線遊玩率**: > 80% (驗證 PWA 成功)
- **裝置分佈**: Mobile > 40% (驗證響應式)

---

## 13. Next Steps

1. 確認此計畫細節，調整優先順序
2. 決定技術棧細節 (建置工具、是否用 TypeScript)
3. 開始 Phase 1: 專案骨架 + 核心引擎
4. 並行撰寫劇本與謎題設計文檔
5. 定期原型測試、收集回饋

---

*文件版本: 1.1 | 更新日期: 2025 | 作者: 遊戲企劃*