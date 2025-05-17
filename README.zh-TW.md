# 📰 RSS 到 Telegram 與 Discord 推送系統 🚀

一個基於 Cloudflare Worker 的服務，能自動取得 RSS 訂閱源的最新文章並推送到 Telegram 頻道和 Discord。使用 Cloudflare Queues 實現非同步訊息佇列處理。

## ✨ 功能特色

- 🔄 自動檢查 RSS 新內容
- ⏱️ 僅推送最近 24 小時內發佈的項目
- 📲 將新文章發送至指定 Telegram 頻道
- 💬 同時將項目加入 Discord 的訊息佇列
- 🚫 追蹤已發送項目避免重複推送
- ⏰ 透過 Cloudflare Workers 定時任務每小時執行
- 🔘 提供手動更新 API，支援隨時檢查

[English README](./README.md)

## 🔧 前置需求

- 📦 [Node.js](https://nodejs.org/)（v16 或以上）
- 🛠️ [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- 🤖 一組 Telegram Bot Token（可透過 [@BotFather](https://t.me/botfather) 申請）
- 📢 一個將機器人設為管理員的 Telegram 頻道

## 🚀 快速開始

1. 複製本專案
2. 安裝依賴：
   ```
   yarn
   ```
3. 於 Cloudflare Dashboard 或用 wrangler secrets 設定環境變數：
   ```
   wrangler secret put RSS_FEED_URL
   wrangler secret put TELEGRAM_BOT_TOKEN
   wrangler secret put TELEGRAM_CHANNEL_ID
   wrangler secret put DISCORD_MIKO_KEY
   ```

4. 在 `wrangler.jsonc` 中設置 Cloudflare Queue 綁定：
   ```json
   {
     "queues": {
       "producers": [
         {
           "queue": "discord-miko-queue",
           "binding": "DISCORD_MIKO_QUEUE"
         }
       ]
     }
   }
   ```

## 🔐 環境變數

- `RSS_FEED_URL`：你想監控的 RSS 訂閱源網址
- `TELEGRAM_BOT_TOKEN`：你的 Telegram 機器人 Token
- `TELEGRAM_CHANNEL_ID`：你的 Telegram 頻道 ID（公開頻道請加 @）
- `DISCORD_MIKO_KEY`：Discord Miko 佇列的驗證金鑰
- `DISCORD_MIKO_QUEUE`：用於發送訊息到 Discord 的 Cloudflare Queue（在 Cloudflare 控制台配置）

## 📚 深入技術解說

完整技術細節請參考部落格文章：

[使用 Cloudflare Worker、Hono 和 Telegram Bot API 構建 RSS 訂閱推送系統](https://calpa.me/blog/build-rss-subscription-push-system-with-cloudflare-worker-hono-telegram-bot-api/)

## 🤝 貢獻歡迎

歡迎提交 Pull Request（PR）！如果你有想法、改進或修復錯誤，請隨時發送 PR。詳情請參見 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 授權

MIT
