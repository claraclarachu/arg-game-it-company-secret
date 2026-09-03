# Nori 飲品供應 × FredyArc — 全面改版企劃（Revamp Plan v2）

> 基於使用者 2026-09-03 最新修正，結合現行架構（`AGENTS.md` / `assets/js/core/vfs.js:742` 單一真相源、`engine.js:200`、`state.js:202`、`dock.js:148`、`index.html:92`）盤點後之可執行計畫。**全 Traditional Chinese，不引入簡體。**

---

## 1. 核心目標與約束（修正）

* **主題**：5 年前 Sawyer 創立 **Nori（僅飲品生意，無移民）**，前 3 年虧損時而負收入 → **2023 年** Sawyer 父母車禍過世，處理喪事期間認識 **FredyArc 主辦人 Fredy**，Fredy 看中 Nori「可透過各方運輸偷運毒品」且 Sawyer 是可合作對象，遂投資 Nori 並提供人力資源/機遇（包含旗下企業與 Nori 合作並給予資金支持，正當收入掩護），Nori 在 FredyArc 幫助下**一年內翻身**。Sawyer 將所有資金投入公司並**謊稱中六合彩二獎**才成功，全在 **2023 內發生**。表面友善/迷信/邀請夜間派對 → Casey 經 git 歷史發現被刪的 `secret url + enter method` 追查。
* **解謎主軸**：`Ch0 熟悉系統 → Ch1 老闆異常 → Ch2 自由探索 → Ch3 找回暗網入口（唯一謎題）→ Ch4 暗網內全開檔案 → Ch5 寄信選結局`，5 結局皆經 Windows 關機或 Email 寄送觸發。
* **全介面初始解鎖**：`unlockedInterfaces=['vscode','jira','whatsapp','search']` 維持全開。
* **Nori 僅飲品**：移除所有移民相關文案、檔案、API（`MigrationPlan` 等保留技術結構但內容改為飲品，若需更徹底則更名為 `Drink`）。

---

## 2. 世界觀 / 時間線（2023 關鍵年）

```
2019-05  Nori 成立（Sawyer 25 歲創業，僅飲品）
2019-2022  營運困難，時而負收入（business-plan.md 月報負數，`vfs.js` 數據）
2023 上半年  Sawyer 父母車禍過世（WhatUp 暗示 + 搜尋引擎新聞可搜 "Sawyer Choi"/"Choi Tsz Yeung"）
2023 中  喪事期間認識 FredyArc 主辦人 Fredy → 看中 Nori 運輸潛力 + Sawyer 可合作 → 投資 + 人力/機遇（旗下企業合作資金）
2023 中後  多筆不明收入實為 FredyArc 給予，夾雜正當合作收入掩護；Sawyer 謊稱六合彩二獎並全投入公司 → 因巧合機遇成功翻身
2023 下半年  迷信：神棍風水、Lobby 大樹「擋災勿觸」（Ch1 Event1）；夜間派對邀約變多；產品爆紅：冰釀茶酒最暢銷（12 款）
2023-11-11 起  毒品流量 csv 起算（秘密檔案，藏於暗網）
2023-2024  某次 commit 刪除 `generateSecretPath(internalPathDomain, hash)` 實作（`git log -p` / `Git Graph` 可見，`md5 key` 在 `.env.example`，`companyId=134`/`year=2023` 僅 `redis.get` 不明文）
2024  Casey（48th / 初級開發人員 2024-07-15 入職）發現被刪 url 與 `WhatUp all staff` 2023 六合彩謊言紀錄，展開調查
```

**公司 Nori**
* 無特定地點、創辦人 Sawyer 2019、50 人、Casey #048 初級開發人員、**僅飲品**（冰釀茶酒招牌）、2023 爆紅主因父母車禍後結識 FredyArc。

**Sawyer Flavor（僅氛圍，不進主線解謎）**
* 30 歲 1994、內向→外向轉變等心理描寫；**Blog 10 篇**（2001-10-18 … 2023-12-20）、**廣志中學二等獎作文**（新手運氣讓母親贏）、**父母車禍新聞**—**皆僅能透過搜尋引擎搜 "Sawyer Choi" / "Choi Tsz Yeung" 找到**，**不放入公司內部 vfs**。六合彩謊言**僅在 `WhatUp` `Nori all staff` 2023 對話紀錄**記載。

---

## 3. 檔案系統秘密

**`/workspace`（Vizual Studio Code 僅顯示官網系統，`vscode/index.js:327` 已過濾 `/intranet`，無需隱藏 `drug-*`，從開始即可進入內網）：**
* 保留 `OrderService.java` VIP bug、`billing/service.js`（移除 420.69 判定，見 §5）、`mixer.js/gateway.js` 作為對照。
* **移除**所有移民文案：`MigrationPlan`、`plan-a/b/c`、`data/plans.json` 等已改為飲品（`drink-001 冰釀茶酒` 等），`business-plan.md` 僅飲品定價。
* `Sawyer Blog`、`廣志中學`、`車禍新聞` **不寫入 vfs**，改為 `search` 的 `webIndex` 外部結果（見 §7）。

**`/intranet`（正常內網，5 區維持，秘密不在此）：**
* `company_public/`、`client_info/`（locked）、`business_plans/`（已改為 `營運研發→原物料→業務→配送→IT`，追加「每個公開配送皆可對應一次秘密運送」引子）、`staff/` 50 人（id 遞增，Casey 2024-07-15 初級開發人員）— 內容維持飲品，無移民。

**暗網（唯一謎題，獨立於正常 vfs）**
* **入口**：`https://nori-intranet.internal/portal?hash=f665a7117959b667b7f283eaebf69cae`  
  `hash = md5("companyId=134&year=2023&key=70BTa3A1a13ad4212GHdybJmn")`，`internalPathDomain = https://nori-intranet.internal/portal?`（通用域名，不含 134/2023）。
* **觸發**：玩家在 **正常內網**（`/intranet`）搜尋框輸入完整 url（含 `hash=`）後，會跳轉至**全新暗網內網頁面**（全黑風格，點綴酒紅色 `#722F37` / `#8B1A1A`，如 Google 首頁：中央大字 `SECRET`，下方單一 `search input`）。
* **進入**：無點擊無反應，**僅點擊 `SECRET` 標題六下**才進入暗網檔案系統（界面同內部 VFS，僅 folder 不同）。
* **暗網檔案系統內容（與正常內網不同 folder）**：
  1. 毒品交易列表（`drug-transactions.csv`）
  2. 合作公司列表及聯絡方式（含大樓名錄 + 額外虛構海外客戶）
  3. 全結構圖（`drug-route-graph.md`：`FredyArc → Nori 實驗室 → 葡萄/茶葉原料 → 銷售 → 配送（每趟公開物流綁一次秘密包裹）→ IT 內網`，標註 `COCOA/BEAN/LEAF/CRYSTAL`）
  4. 毒品流量 csv（`drug-traffic.csv`，`datetime` 自 `2023-11-11` 起，`location` 大樓名錄 + 海外、`traffic_used` 含 `grape, 茶葉, alchol, grass bottle, box`、`drug_code`、`quantity`、`status`，30-50 列，表格檢視）
  5. 月結單（`monthly-statements/*.csv`，`FredyArc → Nori $10,000-$500,000` 主體，夾雜 `Nori → Anonymous $100-$1,000` 小額，10 檔或單檔，Excel 表格檢視）

---

## 4. 章節與事件重塑

| 章 | 觸發 | 事件/玩法 | 旗標/證據 | 備註 |
|---|---|---|---|---|
| **Ch0 熟悉系統** | 初始 | **維持現狀**：Maggie @Casey `INV-2024-0042`（Vizual → Jira → 修正 `calculateVipPrice` → SCM Commit → Sonar → 自動跳 Jira Done）。WhatUp 固定 `Dev Team` 置頂、`System Alert` 待 Ch1 用。 | `ch0_vip_fixed, onboarding_done` | 無需改動 |
| **Ch1 關於老闆** | Ch0 完成 | **Event1**：`WhatUp` `Nori all staff` 群 Sawyer 發「Lobby 大樹擋災勿觸」。<br>**Event2**：Maggie 指派 `INV-2024-0043`（**普通 bug fix，內容留空，後續補**，外觀與日常無異），玩家改 code 並 `Commit` **5 秒後**才觸發 `System Alert` 每 15s 警告，Boss 在 `Dev Team` 急問，Maggie 指向 0043，5s 後 Sawyer 私聊 Casey 要求 `revert`，Casey commit 後 `System Alert` 發 `✅ 系統健康` 並停止。 | `ch1_tree_seen, ch1_system_down, ch1_revert_done` | Jira 票 0043 留空，WhatUp 定時器 5s 延遲 + 15s 循環 |
| **Ch2 自由探索** | Ch1 完成 | 無事件，開放搜尋 `Sawyer Choi` / `Choi Tsz Yeung` 看 Blog/作文/車禍新聞，及 `Nori all staff` 2023 六合彩謊言紀錄。 | — | 僅文案，不經 vfs |
| **Ch3 深入追查（唯一謎題）** | 自由探索 | **核心謎題**：找回暗網入口。<br>1. **提示僅藏於** `Vizual` 的 `Git Graph / git log -p`（`2023-2024` 間刪除 `generateSecretPath` 的 commit，`diff` 顯示 `md5(companyId+year+key)` 且 `key=70BTa3A1a13ad4212GHdybJmn`、`md5 key` 在 `.env.example`，`companyId/year` 僅 `redis.get` 不暴露 134/2023）與 **`Jira 歷史單`**（某 Done 票描述或註解內記載「點擊 SECRET 標題六下才會進入新的 file system」）。**不藏於搜尋引擎 `visual-studio` 或 `jira` 附件搜尋**。<br>2. 玩家需在 **正常內網** 搜尋框輸入完整暗網 url `https://nori-intranet.internal/portal?hash=f665a7117959b667b7f283eaebf69cae` → 跳轉全黑酒紅 `SECRET` 頁 → 點擊標題六下 → 進入暗網檔案系統。 | `ch3_entered_secret` | 需產生 `internalPathDomain`、`gitGraphCommits` 植入、`jira` 歷史票加註 |
| **Ch4 秘密曝光** | `ch3_entered_secret`（已在暗網） | 在 **暗網檔案系統內**開啟過所有文件和 folder 才算完成。`engine.js` 輪詢 `discoveredDarkFiles.size >= darkFileRegistry.size` 設 `ch4_all_opened`，隨後自動**退出暗網**（返回正常內網），並觸發 Ch5。 | `ch4_all_opened` | 旗標僅在暗網內計算，不在 Vizual |
| **Ch5 寄信抉擇** | `ch4_all_opened` 且已退出暗網 | 彈 `Send Mail dialog`（`index.html:dialog#mailDialog`）：下拉 `標題` → `Report/Coperation/Resign`，`To` 自動切 `DEA / Sawyer / Sawyer`，內容 `textarea` 任意，**含「暫時退出」按鈕**（關閉 dialog，不寫 `endings`）。玩家可透過 `app bar 最後一個 app` **Email**（`icon: public/icon/mail.svg`）重新打開。**此 Email app 僅在 `ch5` 觸發後且退出寄信頁面後才顯示於 app bar**（`dock.js` 動態 `isUnlocked` 或 `state.flag('ch5_triggered')` 控制）。按 `Send` 依選擇寫 `endings[]`。 | `endings:['report'|'cooperate'|'resign'], ch5_triggered` | 需新增 `mail.js` + `dock` 條件渲染 |
| **關機結局** | 隨時（`taskbar__start`） | 點擊 `Windows` 圖示 → `Start Menu`（`關機/登出/重新開機` 同行為 `handleShutdown`）。<br>• **任何時候 logout 且 `endings` 為空** → **Ending 1** `flee`（翌日記錄被清）。<br>• **Ch5 後選擇 logout 且已集齊暗網證據** → **Ending 5 fried**（特殊）。<br>• 若 `endings` 已選 → 對應 **Ending 2 cooperate / 3 report / 4 resign**。<br>• 未集齊 + logout 仍為 Ending 1（Ending 5 僅 Ch5 後）。 | `endings` + `shutdown` | 見 §6 |

---

## 5. 秘密路徑與入口規格（唯一謎題）

* **公式**：`hash = md5("companyId=134&year=2023&key=70BTa3A1a13ad4212GHdybJmn") = f665a7117959b667b7f283eaebf69cae`（已給定，實作反向驗證）。
* **域名**：`https://nori-intranet.internal/portal?`（通用，不含 134/2023），完整 `https://nori-intranet.internal/portal?hash=f665a7117959b667b7f283eaebf69cae`。
* **觸發位置**：**僅正常內網**搜尋框（`#intranetSearch` 或暗網跳轉前的內網搜尋），**不從 Vizual Studio Code**（移除原 `vsSearchInput` 的 `420.69` 判定與 `tryAccessPortal({amount})` 分支）。
* **Git 痕跡**：`vscode/index.js:gitGraphCommits` 新增 `2023-11-20` `author:dev-chen` `msg: refactor: simplify portal auth`，`diff`：
  ```diff
  - function generateSecretPath(domain){ const cid = redis.get('companyId'); const y = redis.get('year'); const k='70BTa3A1a13ad4212GHdybJmn'; return domain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); }
  + // removed: secret path is now static
  ```
  **Jira 歷史票**（選一 Done 票如 `INV-2024-0011`）於描述或註解追加：「曾於暗網 SECRET 頁面發現需點擊標題六下才會進入新的 file system」。
* **暗網頁面**：新建 `assets/js/apps/darknet/index.js` + `assets/css/darknet.css`，全黑 `bg #000`，點綴酒紅 `var(--dark-accent:#722F37)`，中央 `h1 SECRET`（`font-size:48px` `letter-spacing:8px`）+ 下方 `input`（`placeholder: 輸入暗網路徑`），`input` `Enter` 若值等於完整暗網 url 則 `window.location` 或 `vfs` 切換至暗網；`h1` `click` 計數 6 次（`within 2s` 內連擊或累計）達 6 則 `setFlag('dark_entered',true)` 並 `renderDarkFileSystem()`（同 `intranet` 布局，僅 `darkFileRegistry`）。
* **移除 420.69**：刪除 `vscode/index.js:261` 的 `420.69` 搜尋觸發與 `vfs.js:tryAccessPortal({amount})` 分支，保留 `bypassPortalAuth` 僅供內部 portal 備用或一併移除。

---

## 6. 結局與關機

* **Start Menu**：`dock.js:71` `.taskbar__start` 綁 `click` → `dialog#startMenu`（`關機/登出/重新開機` 同行為 `handleShutdown`）。
* **handleShutdown()**：
  ```js
  const choice = state.get('endings[0]');
  const hasAllDark = hasFlag('ch4_all_opened');
  if (!choice && !hasAllDark) pushEnding('flee'); // Ending1 - 任何時候 logout
  else if (!choice && hasAllDark) pushEnding('fried'); // Ending5 - 僅 Ch5 後 logout
  else pushEnding(choice); // 2/3/4 from mail
  ```
  `ch4_all_opened` 僅在暗網全開後才 true，故 Ending5 僅 Ch5 後可觸發。
* **Mail App**：`public/icon/mail.svg` 已存在，`dock.js` `ICONS.email='/icon/mail.svg'` 僅當 `hasFlag('ch5_triggered') && !mailDialogOpen` 時 `isUnlocked('email')=true`，置於 `taskbar__apps` 最後一個（`intranet` 後），`click` → `openMailDialog()`。
* **Ending Screen**：`assets/js/ui/ending.js` 5 種文案。

---

## 7. 檔案與 App 具體改動清單

**`vfs.js`**
* 移除 `billing/service.js` 的 `if (total===420.69)` 與 `getFeeRate` 移民對照，改為飲品相關註解。
* 移除 `internal/portal` 的 420.69 觸發分支，保留 `bypassPortalAuth` 或移除。
* 更新 `business-plan.md` 僅飲品；`ledger.db` 保留但可縮減。
* **不寫入** Sawyer Blog/學校作文/車禍新聞（改由 `search` 外部結果）。
* 新增 `darkFileRegistry`（或複用 `fileRegistry` 但以 `/darknet` 前綴隔離）於 `darknet.js` 內 `registerDarkFile`，內容見 §3 暗網 5 類。
* 植入 `gitGraphCommits` 刪除 diff。

**`search/index.js`**
* `webIndex` 新增 3 條外部結果：`Sawyer Choi - Blog (Choi Tsz Yeung)`、`廣志中學 作文比賽 二等獎 - Sawyer`、`Sawyer 父母車禍新聞`，`url` 為 `https://sawyer-blog.example/...`、`https://school.example/...`、`https://news.example/...`，`snippet` 含對應 Blog 段落，`type: web`，僅 `site:sawyer-blog.example` 或關鍵詞 `Sawyer Choi`/`Choi Tsz Yeung` 才命中（`doSearch` 已支援 `site:`）。
* ** WhatUp `Nori all staff` 2023 六合彩謊言**：於 `whatsapp/index.js:chats` 的 `nori-all` 群新增 `2023-06-15` 訊息 `Sawyer: 中咗六合彩二獎，決定全放公司資金`。

**`whatsapp/index.js`（WhatUp）**
* 新增 `nori-all` 群、`System Alert` 群（Ch1 用，5 秒延遲警告）、`INV-2024-0043` 留空票對應訊息。

**`jira/index.js`**
* `INV-2024-0043` 內容留空（`desc: "一般 bug fix"`），`INV-2024-0011` 等歷史票追加暗網六擊提示。

**`vscode/index.js`**
* 移除 `handleSearchTrigger` 的 `420.69` 分支與 `terminal` 的 `hint 420.69`。
* 保持 `Vizual` 過濾 `/workspace`（`drug-*` 已不在正常 `fileRegistry`，無需隱藏，從開始即可進入內網）。

**`intranet/index.js` / `darknet/index.js`**
* 正常內網搜尋框支援完整暗網 url 跳轉；暗網頁面獨立，全黑酒紅，`SECRET` 六擊進入檔案系統（同 VFS 布局）。

**`dock.js` / `index.html`**
* Start Menu 關機、`mail` app 條件顯示（`ch5_triggered` 後）、`Vizual #2f98edff`/`Jira #135bcd`/`WhatUp #00cb5a` 保留。

---

## 8. 實作階段（建議順序）

1. **Phase A — 世界觀與檔案清理**：`vfs.js` 移除 420.69 與移民文案，`search` 外部 Sawyer 結果與 WhatUp 六合彩紀錄，`internalPathDomain` 寫入 `intranet/README.md`。
2. **Phase B — 暗網入口與 Git 痕跡**：`darknet` 全黑酒紅頁 + 六擊邏輯、`gitGraphCommits` 植入、`jira` 歷史票提示、`vfs` 暗網 `fileRegistry` 與 `darkFileRegistry`。
3. **Phase C — Ch1 事件**：`jira` 0043 留空 + `whatsapp` 定時器（提交後 5s 警告，15s 循環，revert 後健康）。
4. **Phase D — Ch4 全開檢測**：`engine` 在暗網內輪詢 `discoveredDarkFiles`，退出暗網後觸發 Ch5。
5. **Phase E — 郵件與結局**：`mail dialog` 含暫時退出 + `dock` Email app 條件顯示（`ch5_triggered`）、Start Menu 5 結局邏輯（Ending5 僅 Ch5 後）。
6. **Phase F — 視覺校對**：暗網全黑酒紅、`WhatUp` 綠色主題亮色修復已完成、CSV 表格、`Vizual` 圖示顏色確認、Traditional Chinese 校對。
7. **Phase G — 驗證**：`npm run build` + 手動：`Ch0 0042 → Ch1 大樹 → 0043 留空提交 → 5s 警告 → revert → 自由探索搜尋 Sawyer Choi → Git 找回 hash → 內網輸入暗網 url → SECRET 六擊 → 暗網全開 → 退出 → Ch5 寄信（暫退經 Email app 重開）→ 關機 5 結局`。

---

## 9. 風險與待確認

* **唯一謎題隔離**：暗網為唯一解謎，正常 `vfs` 不再有 420.69 分支，需確保 `engine` 的 `found_all_files` 僅統計暗網（`darkFileRegistry`），避免與正常內網混淆。
* **MD5 工具衝突**：現 `search` 的 `md5` 工具攔截含 `md5` 查詢，需白名單 `hash=` 優先，避免 `hash=f665...` 被誤判為普通 md5 查詢。
* **Email App 顯隱**：`dock` 需動態 `renderDock` 於 `ch5_triggered` 後插入 `email`，並於 `mailDialog` 開啟時暫時隱藏或置灰，避免重複觸發。
* **待您確認：**
  1.Q: `drug-traffic.csv` 的 `location` 是否含海外虛構客戶（已規劃含大樓 + 海外）？A:yes
  2.Q: `INV-2024-0043` 留空是否需保留最低限度描述（如 `fix: minor bug`）以免空票顯得異常？A:yes
  3.Q: 暗網 `SECRET` 頁的搜尋框是否需支援貼上完整 url 後按 Enter 跳轉，或僅支援點擊六下？（目前規劃兩階段：先輸入 url 跳轉至 SECRET，再六擊）A:進入Secret後只需6下點擊就會進入真正的機密文件庫

