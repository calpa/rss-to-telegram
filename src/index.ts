import { Hono } from 'hono';
import { getLatestRssItems } from './rss';
import { sendToTelegram, formatRssItemForTelegram } from './telegram';
import { KVStorage } from './storage';

// Define environment variable types
interface Env {
  RSS_FEED_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHANNEL_ID: string;
  RSS_STORAGE: KVNamespace;
}

const app = new Hono();

// Health check route
app.get('/', (c) => {
  return c.text('RSS to Telegram push service is running!');
});

// Route for manually triggering updates
app.get('/check-updates', async (c) => {
  const env = c.env;
  
  try {
    const result = await checkAndSendUpdates(env);
    return c.json({ success: true, sent: result.sent, error: result.error });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Main logic for checking updates and sending to Telegram
async function checkAndSendUpdates(env: Env) {
  const storage = new KVStorage(env.RSS_STORAGE);
  const processedItems = await storage.getProcessedItems();
  
  // Get the latest RSS items (already filtered for the last 24 hours)
  const latestItems = await getLatestRssItems(env.RSS_FEED_URL);
  
  // Filter out items that haven't been processed yet
  const newItems = latestItems.filter(
    (item) => item.link && !processedItems.includes(item.link)
  );
  
  if (newItems.length === 0) {
    return { sent: 0, error: null };
  }
  
  let sent = 0;
  let error = null;
  
  // Send new items to Telegram
  for (const item of newItems) {
    try {
      const message = formatRssItemForTelegram(item);
      const success = await sendToTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHANNEL_ID,
        message
      );
      
      if (success) {
        await storage.markItemAsProcessed(item.link);
        sent++;
      }
    } catch (err) {
      console.error('Error sending item:', err);
      error = err.message;
      // Continue processing other items
    }
  }
  
  return { sent, error };
}

// Export Cloudflare Worker entry point
export default {
  fetch: app.fetch,
  // Scheduled task handler function
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(checkAndSendUpdates(env));
  },
};
