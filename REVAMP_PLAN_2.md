請依照目前專案的 `REVAMP_PLAN.md`、`AGENTS.md` 以及現有程式碼，**補完目前尚未 implement 的 `legacyRoutes` 相關 code**。

這次任務的範圍非常明確：

> **只處理 `legacyRoutes` 的資料結構、註冊、初始化、查詢/匹配與既有流程接線。**
>
> 不要重新設計 Ch1、Ch3，也不要修改暗網 puzzle 的核心流程。
> `REVAMP_PLAN.md` 是規格來源，但如果目前 code 裡已經存在 `legacyRoutes` 的設計痕跡，請優先延續現有架構，而不是另外創造一套新系統。

---

## 1. 先檢查目前實作

先搜尋整個專案：

```text
legacyRoutes
legacy route
legacyRoutes
generateSecretPath
internalPathDomain
portal
redis.get
companyId
year
```

尤其檢查：

* `assets/js/core/vfs.js`
* `assets/js/core/engine.js`
* `assets/js/core/state.js`
* `assets/js/apps/vscode/index.js`
* `assets/js/apps/intranet/index.js`
* `assets/js/apps/darknet/index.js`
* 任何目前已經引用 `legacyRoutes` 或類似 routing table 的檔案

確認目前：

1. 哪裡應該宣告 `legacyRoutes`
2. 哪裡應該初始化
3. 哪裡應該註冊 legacy route
4. 哪裡應該讀取 / match route
5. 哪個流程目前缺少接線

**不要看到缺少的地方就直接自行發明新的 architecture。先理解現有 code 的資料流。**

---

# 2. `legacyRoutes` 的目的

`legacyRoutes` 是用來保存**舊版/歷史 route 資訊**，供目前的 Git / portal 歷史資料與 route reconstruction 使用。

它不是新的 VFS。

它也不是新的檔案系統。

它更不是讓玩家直接從 Vizual Studio Code 進入暗網的 shortcut。

正確概念是：

```text
legacyRoutes
    ↓
歷史 route / 舊版 portal 資訊
    ↓
Git history / generateSecretPath 的歷史線索
    ↓
玩家自行重建完整暗網 URL
    ↓
正常內網搜尋框
    ↓
暗網 SECRET 頁面
```

所以請不要把 `legacyRoutes` 實作成：

* VS Code shortcut
* 暗網直接入口
* 自動跳轉
* 搜尋 `Sawyer` 就出現暗網
* Jira 直接提供完整 URL
* VFS 裡一個 `/legacyRoutes/` 資料夾

---

# 3. 實作 `legacyRoutes`

如果目前專案尚未有正式 registry，請按照現有 registry 的 coding style 建立：

```js
const legacyRoutes = ...
```

並確保它是**獨立的 route registry**。

不要把它塞進：

```js
fileRegistry
darkFileRegistry
```

也不要讓：

```js
legacyRoutes === fileRegistry
```

或任何 alias 導致兩者實際上共享同一個可變物件。

---

# 4. Legacy route 必須包含目前 puzzle 所需的歷史資料

目前 `REVAMP_PLAN.md` 指定的核心歷史 route 是：

```text
https://nori-intranet/internal/portal?
```

對應的歷史函式：

```js
function generateSecretPath(domain){
  const cid = redis.get('companyId');
  const y = redis.get('year');
  const k='70BTa3A1a13ad4212GHdybJmn';

  return domain + 'hash=' +
    md5(`companyId=${cid}&year=${y}&key=${k}`);
}
```

因此 `legacyRoutes` 至少需要能表達：

* route/domain
* 歷史用途
* 產生 secret path 所需的資訊
* 對應年份 / company context（如果目前 architecture 有這種欄位）
* 與 `generateSecretPath` 的歷史關聯

但請注意：

### 不要把完整答案直接放成玩家可搜尋的明文資料。

尤其不要在一般 VFS 檔案中直接放：

```text
https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae
```

完整 URL 應該仍然由玩家透過 Ch3 的 Git history + Jira history 自行重建。

---

# 5. `generateSecretPath` 的歷史版本

`REVAMP_PLAN.md` 指定的 Git Graph commit 必須保持：

```text
Date: 2023-11-20
Author: dev-chen
Message: refactor: simplify portal auth
```

Diff：

```diff
- function generateSecretPath(domain){ const cid = redis.get('companyId'); const y = redis.get('year'); const k='70BTa3A1a13ad4212GHdybJmn'; return domain + 'hash=' + md5(`companyId=${cid}&year=${y}&key=${k}`); }

+ // removed: secret path is now static
```

如果目前 `legacyRoutes` 尚未與 Git Graph 的歷史資料連接，請補上必要的資料結構，使這個 commit 能夠合理表示：

```text
legacyRoutes
    ↓
generateSecretPath 的歷史版本
```

但是：

**不要新增第二套 Git system。**

必須沿用現有的：

```text
Git Graph / git log -p
gitGraphCommits
```

資料結構。

---

# 6. `internalPathDomain`

請確認目前程式中使用的是：

```js
const internalPathDomain =
  'https://nori-intranet/internal/portal?';
```

不要寫成：

```text
https://nori-intranet/internal/portal?134/2023
```

也不要把：

```text
134
2023
```

硬編碼進 domain。

正確的 hash 計算來源仍然是：

```text
companyId = 134
year = 2023
key = 70BTa3A1a13ad4212GHdybJmn
```

即：

```text
md5("companyId=134&year=2023&key=70BTa3A1a13ad4212GHdybJmn")
```

結果：

```text
f665a7117959b667b7f283eaebf69cae
```

完整 URL：

```text
https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae
```

---

# 7. `.env.example`

確認：

```text
70BTa3A1a13ad4212GHdybJmn
```

仍然存在於 `.env.example` / 現有設定位置。

`companyId` 和 `year` 不應該直接以：

```text
134
2023
```

作為 `generateSecretPath` 的 source code literal。

按照目前架構，它們應該透過：

```js
redis.get('companyId')
redis.get('year')
```

取得。

如果目前已有這套 mock redis/state architecture，請沿用，不要重新建立一套 config system。

---

# 8. `legacyRoutes` 與正常內網搜尋

請確認 `legacyRoutes` **不會讓玩家直接透過普通文字搜尋取得完整答案**。

玩家最後仍然必須把完整 URL：

```text
https://nori-intranet/internal/portal?hash=f665a7117959b667b7f283eaebf69cae
```

輸入：

```text
正常內網搜尋框
#intranetSearch
```

才進入：

```text
暗網 SECRET 頁面
```

搜尋邏輯必須優先識別：

```text
hash=f665a7117959b667b7f283eaebf69cae
```

再處理現有 MD5 search behavior。

不要讓 `legacyRoutes` 直接執行 navigation。

---

# 9. 不要重新加入 420.69 puzzle

這次修改絕對不要恢復舊版：

```text
420.69
billing/service.js
getFeeRate immigration comparison
bypassPortalAuth
VS Code 420.69 trigger
```

如果只是因為搜尋 `legacyRoutes` 時看到舊 code：

* 不要把它重新接回來
* 不要讓它成為新 puzzle
* 不要改變 `REVAMP_PLAN.md` 已經定義好的流程

---

# 10. Ch1 不要被 `legacyRoutes` 影響

Ch1 必須仍然是：

```text
INV-2024-0043
↓
普通 bug fix
↓
Commit
↓
5 秒後 System Alert
↓
每 15 秒 warning
↓
Sawyer 要 Casey revert
↓
revert commit
↓
✅ 系統健康
```

`legacyRoutes` 不應該直接觸發：

```text
System Alert
```

也不應該讓 Ch1 提前揭露暗網。

---

# 11. Ch3 不要被 shortcut

Ch3 必須仍然是唯一謎題：

```text
Git Graph / git log -p
        +
Jira 歷史票
        ↓
玩家取得足夠資訊
        ↓
自己重建完整 URL
        ↓
正常內網搜尋框
        ↓
SECRET
        ↓
SECRET 標題點擊六下
        ↓
暗網檔案系統
```

所以 `legacyRoutes` 的存在是**支援歷史 route reconstruction**，不是 shortcut。

---

# 12. Darknet isolation

請再次確認：

```text
legacyRoutes
fileRegistry
darkFileRegistry
```

三者是不同用途。

尤其：

```text
darkFileRegistry
```

仍然只包含暗網檔案：

```text
drug-transactions.csv
cooperation company list + contact info
drug-route-graph.md
drug-traffic.csv
monthly-statements/*.csv
```

不要因為 implement `legacyRoutes` 而把這些檔案加入 `legacyRoutes`。

---

# 13. `dark_entered` / Ch4 flags 不要被提前設定

只有真正進入 SECRET 後，玩家點擊標題六次：

```js
setFlag('dark_entered', true);
renderDarkFileSystem();
```

才可以進入暗網檔案系統。

不要因為：

```text
legacyRoutes matched
generateSecretPath found
Git commit opened
```

就提前設定：

```text
dark_entered
ch3_entered_secret
ch4_all_opened
```

---

# 14. 最重要的 implementation 原則

請遵守：

### 做

* 找出現有 `legacyRoutes` TODO / placeholder / 未接線 code
* 補完整資料結構
* 補 registry initialization
* 補 route lookup / matching
* 補現有 Git / portal architecture 所需要的 integration
* 沿用目前的 coding style
* 使用現有 state / VFS / engine architecture
* 最小化修改範圍

### 不做

* 不重寫 VFS
* 不建立第二套 Git system
* 不建立第二套 routing system
* 不建立第二套 state system
* 不把 `legacyRoutes` 變成 VFS folder
* 不讓 `legacyRoutes` 直接開暗網
* 不新增 420.69 puzzle
* 不改 Ch1 流程
* 不改 Ch4 / Ch5 ending logic
* 不新增玩家看不到的「魔法 shortcut」

---

# 15. 實作前先回答這 5 個問題

在修改之前，先從 code 中確認：

1. `legacyRoutes` 現在在哪裡被宣告或引用？
2. 哪些地方目前期待 `legacyRoutes` 存在？
3. 現有 route matching / registry 的 pattern 是什麼？
4. `generateSecretPath` 的歷史資料應該掛在哪個現有資料結構？
5. 哪個最小 integration point 缺失，導致目前 `legacyRoutes` 沒有真正生效？

然後再實作。

**不要為了回答這 5 個問題而大改 architecture。**

---

# 16. Validation

完成後至少執行：

```bash
npm run build
```

以及專案已有的：

```text
test
typecheck
lint
```

（如果存在就執行。）

最後檢查：

```text
legacyRoutes 可以正常初始化
↓
legacy route 可以被現有 code lookup / match
↓
Git history 仍能顯示 generateSecretPath 的歷史 commit
↓
玩家仍需自己重建完整暗網 URL
↓
完整 URL 只能從正常內網搜尋框進入暗網
↓
SECRET 六擊仍然正常
↓
darkFileRegistry / discoveredDarkFiles 不受污染
↓
Ch1 System Alert 流程不受影響
↓
Ch4 / Ch5 / endings 不受影響
```

完成後請回報：

1. 修改了哪些檔案
2. `legacyRoutes` 實際放在哪裡
3. 哪些 existing code 現在開始真正使用 `legacyRoutes`
4. `generateSecretPath` 歷史資料如何與 `legacyRoutes` 關聯
5. 是否成功 `npm run build`
6. 是否有任何未完成或需要我決定的地方
