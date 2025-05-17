import { FeedItem } from "./rss";
import { escapeHtml } from "./escapeHtml";

/**
 * Returns a plain-text snippet from the item's content, max 150 chars.
 * @param item - The RSS feed item.
 */
export function getItemSnippet(item: FeedItem): string {
  if (!item.contentSnippet) return "";
  const truncated =
    item.contentSnippet.length > 150
      ? item.contentSnippet.slice(0, 150).trimEnd() + "..."
      : item.contentSnippet;
  return `\n\n${escapeHtml(truncated)}`;
}

/**
 * Formats an RSS item for Telegram: bold title, snippet, and link.
 * @param item - The RSS feed item.
 */
export function formatRssItemForTelegram(item: FeedItem): string {
  const title = escapeHtml(item.title);
  const snippet = getItemSnippet(item);
  const link = item.link;
  return `<b>${title}</b>${snippet}\n${link}`;
}