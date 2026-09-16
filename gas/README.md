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

## 4. 前端設定
- **方式 A (推薦) — Vite 環境變數**：在 GitHub Repo Settings → Secrets → `VITE_GAS_URL` 貼上 exec URL；`vite.config.js` 已讀 `import.meta.env.VITE_GAS_URL`
- **方式 B — 手動貼上**：在遊戲內 Settings 底部「數據追蹤」輸入框貼上，或瀏覽器 Console 執行：
  ```js
  localStorage.setItem('cc_gas_url','https://script.google.com/macros/s/.../exec')
  location.reload()
  ```
- 檢查：Console 執行 `__analytics.isGasConfigured()` 應回 `true`，`__analytics.getGasUrl()` 顯示你的 URL

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
