# Handoff Log — 聽日辭職 (ARG)

> 目的：讓不同電腦（辦公室 MacBook / 家裡 Windows）及不同 Agent 能在 1 分鐘內接手進度。
> 更新方式：每次完成一個子任務就更新本檔並 `git commit + push`。

## 最後更新
- **日期**：2026-08-29 19:15 (Asia/Taipei) | **分支**：`master` → `claraclarachu/arg-game-it-company-secret`
- **最後 Commit**：`33b1149 feat: Phase 6 + Phase 7` → `onboarding narrative + 完整 Phase 1-7 完成`
- **當前工作目錄**：`C:\Users\user\Documents\Projects\arg-game-it-company-secret`（Windows）/ 辦公室 `~/Documents/03 For Testing/arg-game-it-company-secret`（含空格，需 quoted `workdir`）
- **Node**：`v24.14.1` / **npm**：`11.11.0` / **Vite**：`^8.2.2` + `esbuild ^0.28.2` (Vite 8 需獨立 `esbuild`)
- **Dev 伺服器**：`http://localhost:3000` **嚴格固定 3000**（先 kill 再起，勿產生 3001/3002）PID `20932` 運行中，截圖驗證通過（VS Code + Jira + WhatsApp + Search + Onboarding）

## 當前階段判定：Phase 1-7 ✅ 全部完成
對照 `GAME_PLAN.md §8`：

| **Phase 2** | **VS Code Simulator** | **✅ 完成** | **2026-08-29 17:40-18:25** — 含高亮/摺疊/終端/QuickOpen + **onboarding 敘事** |
| **Phase 3** | **Jira Simulator** | **✅ 完成** | **2026-08-29 17:40** — 拖拉/JQL/泳道/附件/燃盡圖 + onboarding 引導 |
| **Phase 4** | **WhatsApp Web** | **✅ 完成** | **2026-08-29 18:00** — 列表搜尋/置頂/靜音/氣泡/媒體/資訊 + onboarding PM 訊息 |
| **Phase 5** | **Search Engine** | **✅ 完成** | **2026-08-29 18:25** — 自動完成/進階語法/頁籤/快照 + onboarding 搜尋引導 |
| **Phase 6** | **Content & Puzzles (7 章)** | **✅ 完成** | **2026-08-29 18:45** — 18 puzzles + 9 VFS + 7 章 JSON + 筆記本成就 + onboarding 流程 |
| **Phase 7** | **Polish & Testing** | **✅ 完成** | **2026-08-29 19:15 完成** — 見下 |

### Phase 3 + Phase 4 + Phase 5 + Phase 6 + Phase 7 已完成

**2026-08-29 18:45 完成 Phase 6 + Phase 7：**

**Phase 6 — Content & Puzzles (全新 18 puzzles)：**
- **引擎** `engine.js:1` 由 4 → 18 puzzles (ch0-6)：`ch1_read_billing`, `ch2_read_env`, `ch3_find_crypto_mixer/gateway/cryptoConfig`, `ch4_export_ledger/docs/arch/ledger_export.csv`, `ch5_supplier/reverse_image/shell/ssh`, `ch6_collect_all(6證據)/choose_ending`；`chapterFlags` 擴至 8 旗標、`chapterMap` 映射 `currentChapter`；評估每 800ms + `vfs:read/portal:*` 事件
- **VFS** `vfs.js:139` 新增 9 檔案：`payment/cryptoConfig.json` (mixer wallets), `payment/mixer.js`, `payment/gateway.js` (分潤), `ledger.db` (SQLite dump `COCOA 420`等), `docs/arch.pdf` (物流路線), `data/ledger_export.csv` (座標), `scripts/decrypt.py` (base64), `application.properties` (ssh `203.0.113.45:2222`)；`readFile` 內自動 `setFlag` 對應 (`found_crypto_mixer` 等) 以解鎖後續章
- **搜尋/WhatsApp 聯動** `search/index.js:200` `doSearch` 搜 `package/image→reverse_image_done`, `site:nori/shell→found_shell_company`, `cocoa→found_supplier`；`whatsapp/index.js:51` `renderChat supplier/backend-team→found_supplier`
- **資料** `assets/data/chapters/ch0-6.json` + `chapters/ch0-6_*.json` (7 章 標題/目標/evidence/ending)，`notebook.js:1` 重構為證據板：章節進度條 `ch/6`、14 枚證據網格可複製/標記、`成就 5` (`first_evidence/collector/master/portal_found/bypass`)、`章節狀態 完成/進行中/未開始`、Flags 摺疊、`複製存檔`按鈕
- **驗證**：`build` `main-CPQsGydM.js 97KB`, `state.discoveredFiles` 觸發證據即時解鎖

**Phase 7 — Polish & Testing + Onboarding Narrative：**
- **響應式** `responsive` 已驗證 `768/375`：`main.css` `vscode__activitybar` 手機轉橫、 `jira__board` 單欄、`wa` 單欄、`search__layout` 單欄；截圖 `mobile.png 375×667` / `tablet.png 768×1024` 通過
- **部署** `scripts/deploy.js` + `package.json:9` `deploy`：檢 `dist/sw.js`/`manifest.json`、印 `dist` 大小、指引 `gh-pages/Netlify` + `npm run preview --port 4173`
- **效能** `dist 97KB` (gzip 30KB) < 100KB, `vfs.listFiles` 8 檔快取, `suggestBox` 去抖, `state.save` 500ms debounce, `engine` 800ms poll
- **存檔相容** `state.js:migrateState` 保留 `STATE_VERSION=1.0.0`, `localStorage` 壓縮建議
- **無障礙** `role=tablist/tab/dialog`, `aria-label` 於 `activitybar/taskbar/search tabs`, 鍵盤 `Ctrl+P/F/G/D//`, `F1/Escape`, `dialog::backdrop` 模糊
- **Onboarding 敘事 (新)** `main.js:14` 四步驟對話框：
  1. **深夜加班** — PM WhatsApp 發訊息 `INV-2024-0042` 要求今晚修 bug
  2. **Jira 票據詳情** — 點擊 INV-2024-0042 看詳情（觸發 `onb_jira_viewed`）
  3. **VS Code 追蹤 Bug** — 打開 `src/billing/service.js` 看到 `if (total === 420.69)` 導向 `/internal/portal`（觸發 `onb_vscode_viewed`）
  4. **異常發現** — 發現異常代碼，引導去 Search 輸入 420.69 或看 Jira 評論 → 解鎖 Chapter 1
  - 條件式 `nextBtn`：未達成條件時顯示提示 Toast，需完成動作才能下一步
  - `trackOnboarding()` 導出供 Jira/VS Code 模組調用，條件達成自動啟用下一步
  - 跳過按鈕確認後直接完成

**Phase 5 完成 (2026-08-29 18:25)：**
- 搜尋列 `webIndex[7]` 自動完成 `site:/filetype:`、頁籤 `全部/圖片/新聞/學術`、快照 `.snapshot`、側欄歷史/趨勢

**Phase 4 完成 (2026-08-29 18:00)：**
- 列表 `pinned/muted/archived/unread`、氣泡分組+雙勾、媒體 `image/voice/file`、資訊抽屜/搜尋/匯出

**先前已完成：**
- Windows 11 桌面化：`index.html` 去除舊 `topbar`，`main.css` 漸層桌布 + `taskbar` 三段式（左 天氣 `28°C 晴時多雲`、中 開始鈕+搜尋膠囊+App 集中、右 托盤 `中 📶 🔊 ▲` + 日期時間 `zh-TW` 每分鐘更新）`dock.js:13-109`
- VS Code 忠實復刻：`vscode.css` + `vscode/index.js` 新增 `titlebar` (File/Edit... + `— □ ✕` + `service.js — ...` 居中)、`activitybar` 48px 直條 (上 Explorer 檔案夾、Search 放大鏡、SCM 分支圖、Debug ▶+bug、Extensions 四方格；下 Accounts 人像、Settings 齒輪) 全 `stroke="currentColor"` 黑白、`#858585`→`#fff` active 2px `var(--accent)` 指示
- `sidebar` + `tabs` + `editor` + `terminal #0b0b0b` + `statusbar 22px var(--accent)` (`vscode.css:1-294`)
- 任務欄圖示換成 `assets/icon/`：`Visual_Studio_Code.svg.webp`/`jira-icon.webp`/`whatsapp.png`/`notepad.png` → 複製至 `public/icon/` 以兼容 `build`，`dock.js:ICONS` 用 `<img>` + `main.css:189` 22px 物件擬合
- 隱藏觸發改為 Search：移除 Explorer 底部 `追蹤 billing/service.js 的 420.69 分支` + `input#vsTriggerAmount`+`#vsTriggerBtn`，改為在 `Search Activity` 的 `input#vsSearchInput` 輸入 `420.69` 觸發 `vfs.tryAccessPortal` + `state.setFlag('found_code_map')` + `terminal` 提示 (`vscode/index.js:68-165`)
- `vfs.js:22` 修復 `buildTree` 崩潰：`/internal/portal` 既是檔案又需容納 `/internal/portal/export` 子節點 → 轉 `dir` 並容錯 `if(!parent.children) parent.children=[]`，否則 `mountVSCode` 拋 `Cannot read push` 致白屏
- 平台差異修復：`nvm4w` 的 `npm.ps1` 被 `ExecutionPolicy` 攔截 → 統一用 `npm.cmd`；Mac `darwin` 的 `node_modules` 抄到 Windows 缺 `rollup-win32-x64-msvc` → 需 `Remove-Item node_modules, package-lock.json; npm.cmd install`（已加入 `.gitignore:1` `node_modules/` + `dist/`）
- 設定頁：移除 `語言` 切換 (`index.html:33`, `settings.js:1`刪 `settingLang`+`setLanguage`)；`dialog` 深色模式白底 bug 修復（加 `background:var(--bg-secondary);color:var(--fg-primary);` + `dialog::backdrop` `rgba(0,0,0,.45)`）；Light 模式藍色過深 → `main.css:16 --accent #0366d6→#4da3ff`，`vscode.css:260 statusbar #6aabf0/#0f2436` 更淡
- 驗證：`npm.cmd run build` `built 73ms`、`HEAD` 已含上述檔案，無 `git status` 髒檔

**Phase 2 無待辦 — 已驗收完成 ✅**
- 檔案總管 + 搜尋 `Cmd+P` QuickOpen / `Cmd+Shift+F` Global Search 完成
- 編輯器 語法高亮+行號+摺疊 完成（多游標僅提示，後續 Phase 7 可選）
- 終端機 歷史/Tab/假指令 完成
- Git Log/Diff/Blame 完成
- 設定面板 + 快捷鍵映射 完成

## 跨機快速接手 SOP

### 1. 拉取與安裝
```powershell
# 家裡 Windows (含空格路徑注意引號/workdir)
git pull origin master
# 若剛從 Mac 拷貝過來，必先清除 Mac 的 darwin 依賴
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm.cmd install   # 非 npm，否則 ExecutionPolicy 報錯
# ExecutionPolicy 一次性（CurrentUser）
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

### 2. 運行（嚴格 3000）
```powershell
# 先殺掉殘留，確保不跳 3001/3002
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev","--","--port","3000","--host","127.0.0.1" -WindowStyle Hidden -WorkingDirectory "C:\Users\user\Documents\Projects\arg-game-it-company-secret"
# 或前台： npm.cmd run dev -- --port 3000 --host 127.0.0.1
# 開 http://localhost:3000 → Ctrl+F5 清 sw.js cc-v1 快取
```

### 3. 驗證
```powershell
npm.cmd run build   # 必須 0 error, 產生 dist/
netstat -ano | Select-String ":3000"  # 僅一個 LISTENING
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/  # 200
# 截圖驗收
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --screenshot="$env:TEMP\opencode\shot.png" --window-size=1280,800 --virtual-time-budget=5000 http://127.0.0.1:3000/
```

### 4. 提交回推
```powershell
git add HANDOFF.md assets/ public/ index.html vite.config.js
git commit -m "chore: update handoff Phase 2 xxx"
git push origin master
# 更新本檔「最後更新」區塊後再 push
```

## 架構速查
- 入口：`index.html` → `assets/js/main.js` → `mountVSCode()/Jira/WhatsApp/Search` 掛載 `#view-*`
- 核心：`core/state.js` (`code_conspiracy_state`, `STATE_VERSION=1.0.0`, `setFlag/hasFlag/addEvidence/unlockInterface`), `events.js`, `vfs.js:seedFiles()` 唯一真實內容源, `engine.js` 4 puzzles + `chapterFlags` 推導 `currentChapter`
- UI：`ui/dock.js` (Windows 任務欄), `ui/settings.js` (僅主題), `ui/notebook.js`
- 樣式：`main.css` tokens, `vscode.css`, `jira/whatsapp/search.css`, `responsive.css` `<768` 移動端
- PWA：`public/` → `/` (`vite.config.js:publicDir`), `sw.js` `cc-v1`
- 別名：`@ → /assets/js`, `@core/@apps/@ui/@utils/@data` (Vite)

## 重要約定
- **勿引入簡體中文** — `zh-TW` 字典與註解保持繁中
- 遊戲內容改 `vfs.js:seedFiles()`，勿改 `dist/`
- 主題 `document.documentElement[data-theme="dark"|"light"]`
- 路徑含空格 → 永遠用 `workdir` 參數，勿 `cd ... &&`
- 已知坑：`internal/portal` + `internal/portal/export` 檔案/目錄同名已修；`vite 8` 需獨立 `esbuild` 依賴

## 下一步建議 (給下一 Agent)
- **全階段已完成 ✅**：Phase 1-7 皆 ✅，包含 Onboarding 敘事，僅差最終驗收與部署
1. **最終驗收**：依 `GAME_PLAN.md §12` 測 `完成率>15%`, `平均遊玩>45min`, `二周目`, `離線率`, `Mobile>40%`；跑 `npm run deploy` 產生 `dist/` 並 `git push origin master`，在另一電腦 `git pull` 複測 `http://localhost:3000`
2. **可選擴充** `Future Extensions`：`Electron` 打包、`關卡編輯器`、`續作`、`實體周邊`；`社群分享` 匿名進度需後端，現可先做 `share` 複製存檔碼
3. 每次 Session 結束記得更新本檔並 `git push`（當前已推送至 `33b1149`，本次待推 onboarding + 最終整理）

---
*Handoff 維護：任何 Agent 接手前請先讀此檔 + `AGENTS.md` + `GAME_PLAN.md §8`。*
