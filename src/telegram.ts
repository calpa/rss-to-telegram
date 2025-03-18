// Send message to Telegram channel
export async function sendToTelegram(botToken: string, channelId: string, message: string): Promise<boolean> {
	const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: channelId,
				text: message,
				parse_mode: 'HTML',
				disable_web_page_preview: false,
			}),
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

// Format RSS item as Telegram message
export function formatRssItemForTelegram(item: { title: string; link: string; contentSnippet?: string }): string {
	const snippet = item.contentSnippet ? `\n\n${item.contentSnippet.substring(0, 150)}${item.contentSnippet.length > 150 ? '...' : ''}` : '';

	return `${escapeHtml(item.title)}${snippet}\n${item.link}`;
}

// HTML special character escaping
function escapeHtml(text: string): string {
	return text.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
