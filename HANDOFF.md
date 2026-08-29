# Handoff Log — Code & Conspiracy (ARG)

> 目的：讓不同電腦（辦公室 MacBook / 家裡 Windows）及不同 Agent 能在 1 分鐘內接手進度。
> 更新方式：每次完成一個子任務就更新本檔並 `git commit + push`。

## 最後更新
- **日期**：2026-08-29 17:40 (Asia/Taipei) | **分支**：`master` → `claraclarachu/arg-game-it-company-secret`
- **最後 Commit**：`5eb6584 feat: finish Phase 2` → `Phase 2 補齊 + Phase 3 完成`
- **當前工作目錄**：`C:\Users\user\Documents\Projects\arg-game-it-company-secret`（Windows）/ 辦公室 `~/Documents/03 For Testing/arg-game-it-company-secret`（含空格，需 quoted `workdir`）
- **Node**：`v24.14.1` / **npm**：`11.11.0` / **Vite**：`^8.2.2` + `esbuild ^0.28.2` (Vite 8 需獨立 `esbuild`)
- **Dev 伺服器**：`http://localhost:3000` **嚴格固定 3000**（先 kill 再起，勿產生 3001/3002）PID `30152` 運行中，截圖驗證通過（VS Code + Jira）

## 當前階段判定：Phase 2 補齊 ✅ + Phase 3 ✅ 完成
對照 `GAME_PLAN.md §8`：

| Phase | 標題 | 狀態 | 備註 |
|-------|------|------|------|
| Phase 1 | Foundation (Week 1-2) | ✅ 完成 | Vite+ESM、State/localStorage、響應式、主題、PWA `public/sw.js`、四大介面空殼皆就緒 |
| **Phase 2** | **VS Code Simulator** | **✅ 完成** | **2026-08-29 17:40 補齊** — 鍵盤映射 Help 完成 |
| **Phase 3** | **Jira Simulator** | **✅ 完成** | **2026-08-29 17:40 完成** — 見下 |
| Phase 4 | WhatsApp Web | 🔲 未開始 | 已有鎖定邏輯 `hidden_portal_accessed`，需多媒體/搜尋訊息 |
| Phase 5 | Search Engine | 🔲 未開始 | 已有 `webIndex` + `vfs.searchContent` + Portal token 旁路 |
| Phase 6 | Content & Puzzles (7 章) | 🟡 30% | 引擎 `engine.js` 僅 4 puzzles (ch0-2)，章節旗標已打通 |
| Phase 7 | Polish & Testing | 🔲 未開始 | 需完整流程、效能、無障礙、部署腳本 |

### Phase 2 已完成 + Phase 2 補齊 + Phase 3 已完成

**2026-08-29 17:40 補齊 Phase 2 + 完成 Phase 3：**

**Phase 2 補齊：**
- **設定頁** `index.html:33` 新增 `<details>` 鍵盤快捷鍵映射（`Ctrl+P`, `Ctrl+Shift+F/G/D`, `Ctrl+/`, `Tab/↑↓`），與 `vscode.css` 同步
- **VS Code Help** `vscode/index.js:55`：`titlebar Help` 可點擊 → 浮層 `#vsHelpOverlay .vshelp__card` 顯示快捷鍵；`F1` 同功能，`Escape` 關閉；`vscode.css:374` 新增 `.vshelp` 半透明遮罩

**Phase 3 — Jira Simulator (全新)：**
- **看板** `jira/index.js:3`：`tickets[4]` 擴充欄位 `priority/points/epic/attachments/history`，`jira.css:1` 新 `topbar/filters/meta/swimlane/burndown/ticket` 動畫；`renderBoard()` 支援 `draggable="true"`、 `dragover/drop` 在 `To Do/In Progress/Done` 間拖拉、`t.status` 變更 + `history` 推入 `state.set` 並 `openTicket`
- **篩選/泳道** `jira/index.js:178`：`input#jiraSearch` + `select#jiraAssignee` + `select#jiraSwimlane` (`all/assignee/epic`)；泳道分組 `groups[g]` 渲染 `jira__swimlane`；`meta` 提示拖拉與 `JQL 範例`
- **JQL 解析器** `parseJQL()`：支援 `field (=|~) "value"` (`status/assignee/key/epic/text/priority`) 以 `AND` 組合，失敗回退全文 `includes`；範例 `status = "To Do" AND text ~ "420"` 實測通過
- **Ticket 詳情** `openTicket()`：Header `key/priority/badge status`、描述、附件卡 `📎 name/type/snippet` + `檢視` alert、歷史 `→` 時間線、 workflow `移至 X` 按鈕、評論列表 + `input#jiraCommentInput` 追加 `你: ...` 並重渲染
- **Sprint 報表** `renderBurndown()`：SVG `400×140` `viewBox` 理想灰虛線 `19→0` vs 實際藍線 `Day1→D4→D10` 持平、 `Sprint 統計 19 點 16%` 進度條
- **驗證**：`npm.cmd run build` `built 78ms` `main-B-N-KNoI.js 67KB`, Edge 截圖 `jira2.png` 1280×900 顯示 `To Do 2 / In Progress 1 / Done 1`、拖曳提示、JQL 範例、燃盡圖 (藍 vs 灰虛線) 與統計皆正常；VS Code 截圖 `vs3.png` 仍高亮正確

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
1. **Phase 4 WhatsApp**：聊天列表搜尋/置頂/歸檔、氣泡已讀、圖片/語音/檔案預覽、搜尋訊息、匯出聊天記錄
2. **Phase 5 Search**：結果頁快照、進階語法解析器、圖片/新聞切換、搜尋歷史/趨勢
3. **Phase 6 內容**：擴充 `engine.js` 至 7 章 30+ puzzles，撰寫 `chapters/*.json` 與 `vfs` 隱藏檔案（PDF/ledger.db 二進位、`cryptoMixer`）
4. **測試**：`mobile <768` 桌機雙測，確保 `activitybar` 響應式、`dialog` 深色模式、`Jira` 拖拉在 touch 上可 fallback
5. 每次 Session 結束記得更新本檔並 `git push origin master`（當前 `HEAD 5eb6584` 已在 `origin/master` 前 1 commit 待推）

---
*Handoff 維護：任何 Agent 接手前請先讀此檔 + `AGENTS.md` + `GAME_PLAN.md §8`。*
