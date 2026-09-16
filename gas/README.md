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

## 5. 驗證
```bash
curl -L -X POST -H "Content-Type: text/plain" -d '{"session_id":"test","event_type":"ping","whatsapp_preview":"hello"}' "YOUR_GAS_URL"
```
試算表應立刻多一列 `ping`。

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
