# Nori 飲品供應 × FredyArc — 全面改版企劃（Revamp Plan）

> 基於使用者提供的完整時間線、公司/人物設定、章節/結局/秘密檔案規格，結合現行架構（`AGENTS.md` / `GAME_PLAN.md` / `assets/js/core/vfs.js:742` 單一真相源、`engine.js:200` 18 puzzles、`state.js:202`、`dock.js:148`、`index.html:92`）盤點後之可執行計畫。

---

## 1. 核心目標與約束

* **主題**：5 年前 Sawyer 創立 Nori，3 年虧損 → 第 4 年（2022-2023）借「全球飲品/移民流量」與 **FredyArc** 合作運毒 → 爆紅（2023）→ 表面友善/迷信/六合彩謊言 → Casey 經 git 歷史發現被刪的 `secret url + enter method` 而追查。
* **解謎主軸**：`Ch0 熟悉系統 → Ch1 老闆異常 → Ch2 自由探索 → Ch3 找回被刪的 secret path → Ch4 秘密曝光 → Ch5 寄信選結局`，5 結局 + Windows 關機隨時觸發。
* **全介面初始解鎖**：`unlockedInterfaces=['vscode','jira','whatsapp','search']` 已於 `state.js:7` / `engine.js` 實現，需維持（重要資訊第 8 點）。
* **全 Traditional Chinese**：`AGENTS.md:30`，不可引入簡體；路徑含空格需 `workdir` 參數。
* **不納入主線解謎**：Sawyer Blog 2001~2023、私人心理描寫、學校作文—僅作氛圍/搜尋彩蛋，不產生旗標或謎題。

---

## 2. 世界觀 / 時間線（寫進 `vfs.js` 與文件）

```
2019-05  Nori 成立（Sawyer 25 歲創業）
2019-2022  營運困難，時而負收入（寫進 business-plan.md 月報負數）
2022 Q4-2023  Sawyer 與 FredyArc 合作：利用「全球飲品配送流量」運毒 → 收入暴增 → 對外稱六合彩二獎（2023 購入）
2023-07  Sawyer 父母車禍（WhatsUp 暗示 + 搜尋 blog），同年六合彩謊言
2023  迷信：神棍風水、Lobby 大樹「擋災勿觸」（Ch1 Event1）
2023  產品爆紅：冰釀茶酒最暢銷（Nori 飲品供應 12 款）
2023-11-11 起 毒品流量 csv 起算（秘密檔案）
2023-2024  某次 commit 刪除 `generateSecretPath(internalPathDomain, hash)` 實作（git diff / git graph 可見）
2024  Casey（48th / 初級開發人員 2024-07-15 入職）發現 420.69 與被刪 url，展開調查（玩家視角）
```

**公司 Nori**
* 無特定地點、創辦人 Sawyer 2019、50 人、Casey #048 Junior Developer（已改初級開發人員）、業務為飲品開發（冰釀茶酒招牌）、2023 因 FredyArc 爆紅。

**Sawyer Flavor（僅文件/對話，不進謎題）**
* 30 歲 1994、內向→外向轉變、六合彩謊言 2023 事故後；Blog 10 篇（2001-10-18 … 2023-12-20）、廣志中學二等獎作文（新手運氣讓母親贏）— 放入 `vfs.js:/intranet` 或 `/workspace` 搜尋可見，不參與旗標。

---

## 3. 檔案系統秘密（`vfs.js:seedFiles()` 唯一真相源）

**保留並擴充 `/workspace`（官網系統僅顯示於 Vizual Studio Code，`vscode/index.js:327` 已過濾 `/intranet`）：**
* 既有 `OrderService.java` VIP bug、 `billing/service.js` 420.69、 `mixer.js/gateway.js` 保留作為對照。

**現有 `/intranet` 結構（已存在 5 區，需改寫內容以符合毒品敘事）：**
* `company_public/` 4 檔：公司簡介（飲品供應，無地點）、Logo、大樓名錄（鴨嘴道135號，`COM-001 Nori Limited` 已去 🏢 與 35 樓句）
* `client_info/` 3 檔 locked（維持）
* `business_plans/業務流程_完整結構.md` 已改為 `營運研發→原物料→業務→配送→IT`，需追加一句「每個公開配送皆可對應一次秘密運送」作為 Ch4 圖譜引子
* `staff/` 50 人已對齊 id 遞增（`vfs.js:646` Casey 2024-07-15 初級開發人員）

**本改版新增秘密（滿足「secret stored」）：**
1. **全結構圖**：`/workspace/docs/drug-route-graph.md` 或覆寫 `arch.pdf` 為 Mermaid/圖片：`FredyArc → Nori 實驗室 → 葡萄/茶葉原料 → 銷售（企業客戶）→ 配送（每趟公開物流綁一次秘密包裹）→ IT 內網`，節點標註 `COCOA/BEAN/LEAF/CRYSTAL` 對應真實毒品（維持 `ledger.db` lat/lon）。
2. **毒品流量 csv（表格檢視）**：`/intranet/data/drug-traffic.csv` + 鏡像 `/workspace/data/drug-traffic.csv`（確保 Vizual 與內網皆可見，但依最新要求 Vizual 隱藏內網，故鏡像於 workspace）
   * 欄位：`datetime, location, client_company, traffic_used, drug_code, quantity, status`
   * 範例：`2023-11-11 09:00, 鴨嘴道135號, 鴻海創投, grape, COCOA, 420, 已送達`；`traffic_used` 從 `grape, 茶葉, alchol, grass bottle, box` 隨機；`status` 已送達/運輸中/待發；`client_company` 取大樓名錄 COM-002~010。
   * 30-50 列，時間遞增至 2024-09，`vfs.js` 內以 `registerFile` 靜態寫入，`vscode` 自動以 `csv-view` 表格渲染（現有 `vscode/index.js:487` 已支援）。
3. **月結單**：`/intranet/finance/monthly-statement-2023-*.csv`（2023-12 ~ 2024-09 共 10 檔）或單一 `monthly-statements.csv`
   * 欄位：`month, from, to, amount, type, note`
   * 主體：`FredyArc → Nori $10,000-$500,000`（隨機 5 位數，月總 2-4 筆）、穿插 `Nori → Anonymous $100-$1,000`（小額洗出，1-2 筆/月）
   * 需以 Excel 表格檢視（同 csv-view）

---

## 4. 章節與事件重塑（`assets/js/core/engine.js:200` / `chapters/*.json`）

| 章 | 觸發 | 事件/玩法 | 旗標/證據 | 備註 |
|---|---|---|---|---|
| **Ch0 熟悉系統** | 初始 | **維持現狀**：Maggie @Casey `INV-2024-0042`（Vizual → Jira → 修正 `calculateVipPrice` → SCM Commit → Sonar 檢測 → 自動跳 Jira Done）。WhatUp 固定 `Dev Team` 置頂、`System Alert` 群待 Ch1 用。 | `ch0_vip_fixed, onboarding_done` | 無需改動，僅文案 `VS Code→Vizual Studio Code` 已完成 |
| **Ch1 關於老闆** | Ch0 完成 | **Event1**：`whatsapp` `Nori all staff` 群 Sawyer 發「Lobby 大樹擋災勿觸」（`whatsapp/index.js:chats` 新增 `nori-all` 群，`from:Sawyer`）。<br>**Event2**：Maggie 指派 `INV-2024-0043`（註解「前人刪減行」），提交後 `System Alert` 每 15s 警告（`setInterval` 於 `whatsapp/index.js` 或新 `engine.js` 計時），Boss 在 `Dev Team` 急問，Maggie 指向 0043，5s 後 Sawyer 私聊 Casey 要求 `revert`，Casey commit 後 `System Alert` 發 `✅ 系統健康` 並停止。 | `ch1_tree_seen, ch1_system_down, ch1_revert_done` | 需新增 Jira 票 0043、WhatsUp 定時器、Sawyer 私聊分支 |
| **Ch2 自由探索** | Ch1 完成 | 無事件，開放搜尋 Sawyer Blog、學校作文、六合彩謊言彩蛋。 | — | 僅文案 |
| **Ch3 深入追查** | 自由探索 | **核心謎題**：找回被刪的 `secret path`。<br>1. 玩家在 Vizual `git log --all -p` / `Git Graph` 發現 2023-2024 間某 commit 刪除 `generateSecretPath`（`diff` 顯示 `+ if (hash === md5(companyId+year+key))` 被刪，`companyId`/`year` 註記 `// from redis` 不暴露 134/2023）。<br>2. 提示藏於 `search` 搜尋 `visual-studio` 或 `jira` 附件。 <br>3. 玩家需在 **Vizual 搜尋框**（`#vsSearchInput` 已有 420.69 觸發）或在 **Vizual 終端** 輸入完整 url `internalPathDomain + 'hash=' + md5('companyId=134&year=2023&key=70BTa3A1a13ad4212GHdybJmn')` 觸發 `vfs.tryAccessPortal` 新分支。 | `ch3_entered_secret` | 需產生 `internalPathDomain`、植入 git 歷史、搜尋提示 |
| **Ch4 秘密曝光** | `ch3_entered_secret` | 進入後，`notebook` 顯示圖譜與 csv 入口。**觸發 Ch5 條件**：玩家以 Vizual 開啟過所有檔案/資料夾（`state.discoveredFiles.length >= fileRegistry.size - lockedClientFiles`），`engine.js` 輪詢 `found_all_files`。 | `ch4_all_opened` | 需新增旗標與證據 `eDrugGraph, eDrugCSV, eMonthly` |
| **Ch5 寄信抉擇** | `ch4_all_opened` | 彈 `Send Mail dialog`（`index.html:dialog#mailDialog` 新建）：下拉 `標題` → `Report/Coperation/Resign`，`To` 自動切 `DEA / Sawyer / Sawyer`，內容 `textarea` 任意。按 `Send` 依選擇寫 `endings[]`。 | `endings:['report'|'cooperate'|'resign']` | 需新增 `assets/js/ui/mail.js` |
| **關機結局** | 隨時 | 點擊 `taskbar__start`（現無監聽，`dock.js:72` 僅裝飾）→ 彈 `Start Menu`（`關機/登出/重新開機` 三選一為同一行為）。`onShutdown` 檢查：<br>• 若 `endings.length==0` 且 `eDrug*` 未集齊 → **Ending 1** `flee` (logout, 翌日記錄被清)。<br>• 若 `endings` 已選 → 對應 **Ending 2 coop / 3 report / 4 resign**。<br>• 若 `eDrug*` 全集齊但 `endings==0` 且選關機 → **Ending 5 fried**（特殊）。 | `endings` + `shutdown` flag | 見 §6 |

---

## 5. MD5 秘密路徑規格（Ch3）

* **公式**：`hash = md5("companyId=134&year=2023&key=70BTa3A1a13ad4212GHdybJmn")`  
  計算值（需於實作前以 `node -e "require('./search/md5')"` 驗算並寫死）：`md5(...) =  f665a7117959b667b7f283eaebf69cae`（使用者已給定 `hash=f665...`，即為該字串之 md5，實作時反向驗證）。
* **internalPathDomain**：產生一個通用內網域名（不含 134/2023），例如 `https://intranet.nori.internal/portal?` 或 `https://nori-intranet.internal/api?`，寫於 `vfs.js:/intranet/README.md` 與 `docs` 提示。完整觸發 url = `internalPathDomain + 'hash=' + hash`，例 `https://nori-intranet.internal/portal?hash=f665a7117959b667b7f283eaebf69cae`。
* **Git 痕跡**：在 `vscode/index.js:gitGraphCommits` 新增一筆 `2023-11-20` `author:dev-chen` `msg: refactor: simplify portal auth (remove dynamic generator)`，其 `diff` 顯示：
  ```diff
  - function generateSecretPath(domain){ const cid = redis.get('companyId'); const y = redis.get('year'); const k='70BTa3A1a13ad4212GHdybJmn'; return domain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); }
  + // removed: secret path is now static
  ```
  不暴露字面 `134`/`2023`，僅 `redis.get`。
* **觸發實作**：擴充 `vfs.js:tryAccessPortal(trigger)` 同時接受 `{hash}` 參數，比對 `hash===f665...` → `setFlag('ch3_entered_secret',true)` + `portal:discovered`；或在 `vscode` Search 框監聽完整 url 正則 `hash=f665...` 觸發同 flag。成功後 `engine` 推 `ch4`，`notebook` 新增證據。

---

## 6. 結局與關機（`dock.js` / `state.js` / `engine.js`）

* **Start Menu**：`dock.js:71` `.taskbar__start` 綁 `click` → 彈 `dialog#startMenu`（`關機/登出/重新開機` 三按鈕同行為 `handleShutdown`，另 `取消`）。樣式沿用 `windows 11` 毛玻璃，置於 `taskbar__left` 上方。
* **handleShutdown()**：
  ```js
  const hasAllDrug = hasFlag('found_all_files') && hasFlag('ch4_all_opened');
  const choice = state.get('endings[0]'); // report/cooperate/resign from mail
  if (!choice && !hasAllDrug) pushEnding('flee'); // Ending1
  else if (!choice && hasAllDrug) pushEnding('fried'); // Ending5
  else pushEnding(choice); // 2/3/4
  state.save(true); showEndingScreen(ending);
  ```
* **Ending Screen**：新建 `assets/js/ui/ending.js` + `assets/css/ending.css`，5 種文案（Ending 1 翌日被清、2 Money、3 DEA、4 Quit、5 Fried），`重新開始` 按鈕 `state.reset()` + `location.reload()` 實現 New Game+。

---

## 7. 檔案與 App 具體改動清單

**`vfs.js`（核心）**
* 更新 `seedFiles`：覆寫 `business-plan.md` 月報加入負收入 2019-2022；新增 `drug-route-graph.md`、`drug-traffic.csv`（30-50 列，`traffic_used` 含 `grape, 茶葉, alchol, grass bottle, box`）、`monthly-statement-*.csv` 10 檔；保留 `OrderService` 與 420.69；`Sawyer Blog` 10 篇與 `廣志中學作文` 寫入 `/workspace/docs/blog/` 與 `/workspace/school/`；`internalPathDomain` 常數寫入 `intranet/README.md`。
* 新增 `gitGraphCommits` 一筆刪除 secret generator（見 §5）。

**`engine.js`**
* 新增 puzzle `ch1_tree_seen`, `ch1_system_down`, `ch1_revert_done`, `ch3_entered_secret`, `ch4_all_opened`；擴充 `chapterFlags` 與 `chapterMap` 至 Ch5；新增 `found_all_files` 旗標輪詢。

**`whatsapp/index.js`（現 WhatUp）**
* 新增 `nori-all` 群（Sawyer 大樹）、`System Alert` 群（定時警告）、Sawyer 私聊分支；`dev-team` 新增 `INV-2024-0043` 訊息流；旗標連動。

**`jira/index.js`**
* 新增 `INV-2024-0043` 票（描述「前人刪減行」+ 附 `diff` 片段）。

**`vscode/index.js`**
* 保留 Vizual 過濾 `/workspace`、CSV 表格；新增對 `hash=f665...` url 的 `handleSearchTrigger` 分支。

**`search/index.js`**
* 已有 `md5` 工具（`md5Tool` 全頁、隱藏 `searchLayout`），新增 `md5(companyId...)` 提示於 `suggestBox`。

**`dock.js` / `index.html`**
* 實作 Start Menu 與關機結局；保留 `Vizual Studio Code #2f98edff`（cube `rgba(87,165,229)`）、`Jira #135bcd`、`WhatUp #00cb5a` 圖示。

---

## 8. 實作階段（建議順序）

1. **Phase A — 世界觀與檔案**：更新 `vfs.js`（Sawyer Blog、學校作文、大樹風水描述、六合彩謊言、drug graph/csv/monthly、金流）、`internalPathDomain` 常數。
2. **Phase B — Git 痕跡與 MD5 路徑**：`gitGraphCommits` 植入刪除 diff、`vfs.tryAccessPortal` 新增 hash 分支、`vscode` 搜尋框支援完整 url。
3. **Phase C — Ch1 事件**：`whatsapp` 三群 + 定時器 + `jira` 0043 + `System Alert` 健康/警告切換。
4. **Phase D — Ch3→Ch4 旗標**：`engine` 新增 `ch3_entered_secret` / `found_all_files` 輪詢、Ch4 全開檔案檢測。
5. **Phase E — 郵件與結局**：`mail dialog` + `Start Menu` 關機 + 5 結局畫面 + `state.endings` 持久化 + New Game+。
6. **Phase F — 視覺與文案校對**：Traditional Chinese 校對、綠色 WhatUp 主題、CSV Excel 樣式、Vizual `#2f98edff` 等圖示顏色確認。
7. **Phase G — 驗證**：`npm run build` + 手動流程：`Ch0 0042 → Ch1 大樹 → 0043 revert → 自由探索 Blog/作文 → Git 找回 hash → 輸入完整 url → Ch4 全開檔案 → Ch5 寄信三選一 → 關機 5 結局`。

---

## 9. 風險與待確認

* **整體解鎖**：現行 `unlockedInterfaces` 全開，需確認是否保留「自由探索」感，或需對 `Ch3` 前隱藏 `/intranet/drug-*` 直至 `ch3_entered_secret` 再 `registerFile` 動態解鎖（`hidden:true` + `discovered`）。
* **MD5 工具衝突**：現 `search` 的 `md5` 工具會攔截任何含 `md5` 的查詢，需確保 `md5(companyId...)` 提示不與 `hash=f665...` 完整 url 觸發邏輯衝突（建議白名單 `hash=` 優先）。
* **待您確認：**
  1. `internalPathDomain` 偏好？（例 `https://nori-intranet.internal/portal?`）
  2. `Ch1` 的 15 秒警告是否可接受？
  3. `drug-traffic.csv` 的 `location` 是否直接使用大樓名錄 `COM-002~010`？
  4. 是否需要在 `Vizual` 中對 `/intranet/drug-*` 保持隱藏直至 `Ch3`？

