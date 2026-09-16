# GAS + Sheets 部署說明（1 次設定，永久免費）

## 1. 建立試算表
1. 到 https://sheets.google.com 新建空白試算表，命名 `arg_game_events`
2. 保持空白即可，首次寫入時 Apps Script 會自動建立 `game_events` 工作表與首列

## 2. 綁定 Apps Script
1. 在試算表 擴充功能 → Apps Script
2. 將 `gas/Code.gs` 內容完整貼上，儲存
3. 左側「專案設定 → 複製試算表 ID」備用（非必要）

## 3. 部署為網頁應用程式
1. 右上角「部署 → 新增部署」
2. 類型：`網頁應用程式`
3. 說明：`arg-game-tracker v1`
4. 執行身分：`我`
5. 具有存取權的使用者：`所有人`（**必須**，否則 GitHub Pages 會被擋 CORS）
6. 按「部署」→ 授權 → 複製 `https://script.google.com/macros/s/AKf.../exec` 即 `GAS_URL`

## 4. 前端設定（三選一，優先度 B > C > A）

- **方式 B — 遊戲內設定面板（最快，無需重新部署）**：部署後打開遊戲 → 右下齒輪 設定 → 底部「數據追蹤」輸入框貼上 exec URL → 儲存 → 按「測試發送」→ Sheets 立刻多一列。此方式寫入 `localStorage cc_gas_url`，優先於建置變數。
  ```js
  // 或在瀏覽器 Console 執行：
  localStorage.setItem('cc_gas_url','https://script.google.com/macros/s/.../exec')
  location.reload()
  ```

- **方式 C — 執行時全域變數**：在 `index.html` `<head>` 內加入（適合不重建就換 URL）：
  ```html
  <script>window.__GAS_URL='https://script.google.com/macros/s/.../exec'</script>
  ```

- **方式 A — Vite 環境變數 + GitHub Secrets（推薦用於正式部署，建置時注入）**：
  1. GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
  2. 名稱 **必須** 輸入 `VITE_GAS_URL`（`VITE_` 前綴是 Vite 規定，少一個字都不會注入）
  3. 值貼上 `https://script.google.com/macros/s/.../exec`
  4. 本專案已附 `.github/workflows/deploy.yml`，推送到 `master` 時會以 `VITE_GAS_URL: ${{ secrets.VITE_GAS_URL }}` 執行 `npm run build`，自動部署到 `gh-pages`
  5. **注意**：若你本地執行 `npm run deploy`（`gh-pages -d dist`），Secrets **不會**自動生效，必須本地 `VITE_GAS_URL=https://... npm run build && npm run deploy`；或改用推送觸發 Actions

- 檢查（三種方式皆可用 Console 驗證）：
  ```js
  __analytics.getGasUrl()        // 應顯示你的 exec URL，而非 REPLACE_WITH_YOUR_DEPLOY_ID
  __analytics.isGasConfigured()  // 應回 true
  __analytics.ENV_GAS_URL        // 若用方式 A，此處會有值；若只用 B/C，此處為 (empty) 屬正常
  ```

## 5. 驗證（務必先做，避免前端白忙）

### A. 直接用 curl 測 GAS（不經遊戲，最準）
```bash
# 將 YOUR_GAS_URL 換成你部署的 exec URL（結尾 /exec，非 /dev）
curl -L -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"timestamp":"2025-01-01T00:00:00.000Z","session_id":"test_local","event_type":"test_ping","chapter":0,"payload_json":"{\"test\":true}"}' \
  "YOUR_GAS_URL"
# 預期回應：{"ok":true}
# 若回 {"ok":false,"error":"找不到試算表..."} → 代表你建的是獨立專案，請改在 Sheets → 擴充功能 → Apps Script 內建立（見第 2 步）
```
後到 Sheets `game_events` 應立刻多一列 `test_ping`。若沒有，立即到 Apps Script → 執行紀錄 → 查看錯誤（最常見：未授權、Sheet 名錯誤、部署為「只有我」而非「所有人」）。

### B. 本地遊戲測試（npm run dev）
```bash
# 1. 設定 GAS URL（三選一，B 最快）
# 方式 B：啟動後在遊戲內設定貼上（推薦本地）
npm run dev
# 瀏覽器打開 http://localhost:3000/arg-game-it-company-secret/ → 設定 → 數據追蹤 貼上 exec URL → 儲存 → 勾選 同意

# 方式 A：建置時注入（適合同時測線上）
echo 'VITE_GAS_URL=https://script.google.com/macros/s/.../exec' > .env
npm run dev
# 或單次：VITE_GAS_URL=https://... npm run dev

# 2. 打開 DevTools Console 應見：
# [analytics] init {hasConsent:true, gasConfigured:true, ...}
# 若見 GAS_URL 未設定 → 檢查 .env 名稱必須是 VITE_GAS_URL（少 VITE_ 不會注入）

# 3. 在遊戲內 設定 → 數據追蹤 → 按「測試發送」
# 狀態應顯示「成功：Sheets 已寫入 test_ping」
# 若顯示「GAS 回應：...」→ 複製錯誤訊息貼到 Apps Script 執行紀錄對照

# 4. 觸發真實事件：
# WhatUp 隨便發一句 → 應多一列 whatsapp_send
# Email 寄送 任意標題/內文 → 多一列 email_submit
# 右下關機/登出 → 多一列 ending_unlocked
# DevTools → Application → Local Storage → cc_analytics_queue 應為 0（有數字代表被入隊，點 補送佇列）

# 5. 無痕視窗測其他玩家：
# 開無痕 → 同意橫幅點 同意 → 發送 → Sheets 應以新 session_id 多一列，證明其他玩家無需手動貼 URL（只要你已用 VITE_GAS_URL 部署）
```

本地常見坑：
- `/dev` vs `/exec`：測試必須用 `/exec`，`/dev` 只有你本人可存取
- `所有人`：部署時若選「只有我」，其他玩家 & curl 會 403
- `text/plain`：前端已用此類型，若你手動 curl 用 `application/json` 會被 GAS 擋
- `同意`：未同意前所有事件只會入 `cc_analytics_queue`，按 測試 會提示「請先同意」

## 6. 看板
- 直接在 Sheets 篩選 `event_type`：`whatsapp_send` / `email_submit` / `ending_unlocked` / `chapter_changed`
- 或 插入 → 圖表，或 連結 Looker Studio

## 7. 配額與成本
- 免費、無需綁卡；併發由 `LockService` 保護，單日 20k 寫入內穩定；1 per month 遠低於限額
- 若需長期休眠防回收，可設 UptimeRobot 每 5 日 GET 一次 `GAS_URL`

## 8. 常見問題
- **CORS 失敗**：確認部署為 `所有人`，前端必須用 `text/plain`（本專案已處理），勿用 `application/json`
- **302 重新導向**：`fetch` 已設 `redirect: follow`，`sendBeacon` 自動跟隨
- **無資料**：檢查是否點了同意橫幅（`localStorage cc_analytics_consent=1`），或 Console 看 `[analytics] GAS_URL 未設定`
