import { FeedItem } from './rss';
import { SendPhotoParams } from './types/sendPhotoParams';
import { convertHeaderImage } from './parseHeaderImage';
import { formatRssItemForTelegram } from './formatRssItemForTelegram';

const trySendPhoto = async (filetype: string, botToken: string, channelId: string, item: FeedItem): Promise<boolean> => {
	try {
		const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
		const body: SendPhotoParams = {
			chat_id: channelId,
			photo: convertHeaderImage(item.headerImage || '', filetype),
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
			console.error(`Telegram API error for ${filetype}:`, error);
			return false;
		}

		return true;
	} catch (error) {
		console.error(`Error sending to Telegram with ${filetype}:`, error);
		return false;
	}
};

// Send message to Telegram channel
export async function sendToTelegram(botToken: string, channelId: string, item: FeedItem): Promise<boolean> {
	const fileTypes = ['.png', '.jpg', '.jpeg'];
	for (const fileType of fileTypes) {
		if (await trySendPhoto(fileType, botToken, channelId, item)) {
			return true;
		}
	}
	return false;
}
