import { FeedItem } from './rss';
import { SendPhotoParams } from './types/sendPhotoParams';
import { convertHeaderImage } from './parseHeaderImage';
import { formatRssItemForTelegram } from './formatRssItemForTelegram';

/**
 * Attempts to send a photo to a Telegram channel using the specified file type.
 * @param {string} filetype - The desired image file extension (e.g., '.png', '.jpg').
 * @param {string} botToken - The Telegram bot token.
 * @param {string} channelId - The Telegram channel ID.
 * @param {FeedItem} item - The RSS feed item to send.
 * @returns {Promise<boolean>} - Resolves to true if the photo was sent successfully, false otherwise.
 */
const trySendPhoto = async (
	filetype: string,
	botToken: string,
	channelId: string,
	item: FeedItem
): Promise<boolean> => {
	try {
		const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
		const body: SendPhotoParams = {
			chat_id: channelId,
			photo: convertHeaderImage(item.headerImage || '', filetype),
			caption: formatRssItemForTelegram(item),
			parse_mode: 'Markdown',
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
			console.error(`Telegram API error for ${filetype}:`, error);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error sending to Telegram with ${filetype}:`, error);
		return false;
	}
};

/**
 * Sends an RSS feed item as a photo message to a Telegram channel.
 * Tries multiple file types for compatibility with Telegram.
 * @param {string} botToken - The Telegram bot token.
 * @param {string} channelId - The Telegram channel ID.
 * @param {FeedItem} item - The RSS feed item to send.
 * @returns {Promise<boolean>} - Resolves to true if the message was sent successfully, false otherwise.
 */
export async function sendToTelegram(
	botToken: string,
	channelId: string,
	item: FeedItem
): Promise<boolean> {
	const fileTypes = ['.png', '.jpg', '.jpeg'];
	for (const fileType of fileTypes) {
		if (await trySendPhoto(fileType, botToken, channelId, item)) {
			return true;
		}
	}
	return false;
}
