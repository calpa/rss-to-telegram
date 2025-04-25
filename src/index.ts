import { Hono } from 'hono';
import { getLatestRssItems } from './rss';
import { sendToTelegram } from './telegram';
import { KVStorage } from './storage';

/**
 * Define environment variable types
 */
interface Env {
  RSS_FEED_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHANNEL_ID: string;
  RSS_STORAGE: KVNamespace;
}

const app = new Hono();

/**
 * Health check route
 */
app.get('/', (c) => {
  return c.text('RSS to Telegram push service is running!');
});

/**
 * Route for manually triggering updates
 */
app.get('/check-updates', async (c) => {
  const env = c.env;
  
  try {
    const result = await checkAndSendUpdates(env);
    return c.json({ success: true, sent: result.sent, error: result.error });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * Main logic for checking updates and sending to Telegram
 * @param {Env} env - Environment variables
 * @returns {Promise<{sent: number, error: string | null}>} - Number of sent items and any error
 */
async function checkAndSendUpdates(env: Env): Promise<{ sent: number, error: string | null }> {
  const storage = new KVStorage(env.RSS_STORAGE);
  // Get the latest RSS items (already filtered for the last 24 hours)
  const latestItems = await getLatestRssItems(env.RSS_FEED_URL);
  
  let pendingItems = [];

  for (const item of latestItems) {
    const isItemProcessed = await storage.checkIfProcessed(item.link);

    if (!isItemProcessed) {
      pendingItems.push(item);
    }
  }

  if (pendingItems.length === 0) {
    console.log('All items have been processed');
    return { sent: 0, error: null };
  }
  
  let sent = 0;
  let error = null;
  
  // Send new items to Telegram
  for (const item of pendingItems) {
    try {
      const success = await sendToTelegram(
        env.TELEGRAM_BOT_TOKEN,
        env.TELEGRAM_CHANNEL_ID,
        item,
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

  console.log(`Sent ${sent} new items to Telegram`);
  
  return { sent, error };
}

/**
 * Export Cloudflare Worker entry point
 */
export default {
  fetch: app.fetch,
  /**
   * Scheduled task handler function
   * @param {ScheduledEvent} event - Scheduled event
   * @param {Env} env - Environment variables
   * @param {ExecutionContext} ctx - Execution context
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(checkAndSendUpdates(env));
  },
};
