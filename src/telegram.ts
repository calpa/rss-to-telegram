import { FeedItem } from "./rss";
import { SendPhotoParams } from "./types/sendPhotoParams";

// Format RSS item as Telegram message
export function formatRssItemForTelegram(item: FeedItem): string {
	const snippet = item.contentSnippet ? `\n\n${item.contentSnippet.substring(0, 150)}${item.contentSnippet.length > 150 ? '...' : ''}` : '';

	return `${escapeHtml(item.title)}${snippet}\n${item.link}`;
}

// Send message to Telegram channel
export async function sendToTelegram(botToken: string, channelId: string, item: FeedItem): Promise<boolean> {
	const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;

	try {

		const body: SendPhotoParams = {
			chat_id: channelId,
			photo: item.headerImage || '',
			caption: formatRssItemForTelegram(item),
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('Telegram API error:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error sending to Telegram:', error);
		return false;
	}
}



// HTML special character escaping
function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
