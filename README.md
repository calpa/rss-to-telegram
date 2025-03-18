# 📰 RSS to Telegram 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange.svg)](https://workers.cloudflare.com/)
[![Telegram Bot API](https://img.shields.io/badge/Telegram-Bot%20API-blue.svg)](https://core.telegram.org/bots/api)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

A Cloudflare Worker service that automatically fetches RSS feed updates and sends them to a Telegram channel.

## ✨ Features

- 🔄 Automatically checks RSS feeds for new content
- ⏱️ Filters items published within the last 24 hours
- 📲 Sends new articles to a specified Telegram channel
- 🚫 Prevents duplicate posts by tracking previously sent items
- ⏰ Scheduled to run hourly via Cloudflare Workers cron triggers
- 🔘 Provides a manual update endpoint for on-demand checks

## 🔧 Prerequisites

- 📦 [Node.js](https://nodejs.org/) (v16 or later)
- 🛠️ [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare Workers CLI)
- 🤖 A Telegram Bot Token (create one via [@BotFather](https://t.me/botfather))
- 📢 A Telegram Channel where the bot is an administrator

## 🚀 Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your environment variables in Cloudflare Dashboard or using wrangler secrets:
   ```
   wrangler secret put RSS_FEED_URL
   wrangler secret put TELEGRAM_BOT_TOKEN
   wrangler secret put TELEGRAM_CHANNEL_ID
   ```

## 🔐 Environment Variables

- `RSS_FEED_URL`: The URL of the RSS feed you want to monitor
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TELEGRAM_CHANNEL_ID`: Your Telegram channel ID (including the @ symbol for public channels)

## 💻 Development

Run the service locally for development:

```
npm run dev
```

This will start a local development server with the Wrangler CLI.

## 🧪 Testing

Run the test suite:

```
npm test
```

## 🚢 Deployment

Deploy to Cloudflare Workers:

```
npm run deploy
```

## 🔌 API Endpoints

- `GET /`: Health check endpoint that confirms the service is running
- `GET /check-updates`: Manually trigger an update check and send new items to Telegram

## ⚙️ How It Works

1. 🕒 The service runs on a schedule (every hour by default)
2. 📡 It fetches the latest items from the configured RSS feed
3. 🗓️ It filters out items that were published more than 24 hours ago
4. 🔍 It checks which items have already been sent to avoid duplicates
5. 📝 New items are formatted and sent to the Telegram channel
6. ✅ Successfully sent items are marked as processed in KV storage

## 📄 License

MIT
