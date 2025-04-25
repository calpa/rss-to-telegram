import { FeedItem } from "./rss";
import { escapeHtml } from "./escapeHtml";

/**
 * Format an RSS item as a Telegram message.
 * @param {FeedItem} item - The RSS feed item to format.
 * @returns {string} - The formatted message suitable for Telegram.
 */
export function formatRssItemForTelegram(item: FeedItem): string {
    const snippet = item.contentSnippet ? `\n\n${item.contentSnippet.substring(0, 150)}${item.contentSnippet.length > 150 ? '...' : ''}` : '';
    return `${escapeHtml(item.title)}${snippet}\n${item.link}`;
}