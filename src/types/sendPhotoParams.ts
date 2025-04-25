/**
 * Parameters for sending a photo message to Telegram.
 */
export interface SendPhotoParams {
	/**
	 * Optional. Business connection ID.
	 */
	business_connection_id?: string;

	/**
	 * Unique identifier for the target chat or username of the target channel
	 * (in the format @channelusername).
	 */
	chat_id: number | string;

	/**
	 * Optional. Unique identifier for the target message thread (topic) of the forum;
	 * for forum supergroups only.
	 */
	message_thread_id?: number;

	/**
	 * InputFile or String. The photo to send.
	 */
	photo: string;

	/**
	 * Optional. Caption for the photo, 0-1024 characters after entities parsing.
	 */
	caption?: string;

	/**
	 * Optional. Mode for parsing entities in the photo caption.
	 */
	parse_mode?: string;

	/**
	 * Optional. Pass true if the caption must be shown above the message media.
	 */
	show_caption_above_media?: boolean;

	/**
	 * Optional. Pass true if the photo needs to be covered with a spoiler animation.
	 */
	has_spoiler?: boolean;

	/**
	 * Optional. Sends the message silently.
	 */
	disable_notification?: boolean;

	/**
	 * Optional. Protects the contents of the sent message from forwarding and saving.
	 */
	protect_content?: boolean;

	/**
	 * Optional. Pass true to allow up to 1000 messages per second, ignoring broadcasting limits for a fee.
	 */
	allow_paid_broadcast?: boolean;

	/**
	 * Optional. Unique identifier of the message effect to be added to the message.
	 */
	message_effect_id?: string;
}