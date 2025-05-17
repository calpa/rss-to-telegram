import dayjs from "dayjs";
import { convertHeaderImage } from "./parseHeaderImage";
import { getLatestRssItems } from "./rss";
import { KVStorage } from "./storage";
import { sendToTelegram } from "./telegram";
import { QueueHandlerMessageSchema } from "./types/QueueHandlerMessageSchema";
import { getItemSnippet } from "./formatRssItemForTelegram";

/**
 * Main logic for checking updates and sending to Telegram
 * @param {Bindings} env - Environment variables
 * @returns {Promise<{sent: number, error: string | null}>} - Number of sent items and any error
 */
export async function checkAndSendUpdates(env: CloudflareBindings): Promise<{ sent: number, error: string | null }> {
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
        console.log(item);

        console.log('Sending to Discord Miko', item.title);
        
        if (env.DISCORD_MIKO_KEY && env.DISCORD_MIKO_QUEUE) {
          await env.DISCORD_MIKO_QUEUE.send(QueueHandlerMessageSchema.parse({
            token: env.DISCORD_MIKO_KEY,
            title: item.title,
            url: item.link,
            description: getItemSnippet(item),
            timestamp: dayjs(item.pubDate).toISOString(),
            thumbnailURL: convertHeaderImage(item.headerImage || 'https://assets.calpa.me/telegram/public/pfp.png')
          }));
        }

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