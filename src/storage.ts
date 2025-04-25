/**
 * KVStorage class for managing processed items in a KVNamespace.
 */
export class KVStorage {
	/**
	 * Constructs a KVStorage instance.
	 * @param {KVNamespace} kvNamespace - The KVNamespace to use for storage.
	 */
	constructor(private kvNamespace: KVNamespace) {}

	/**
	 * Checks if an item has been processed.
	 * @param {string} itemUrl - The URL of the item to check.
	 * @returns {Promise<boolean>} - A promise that resolves to true if the item is processed, false otherwise.
	 */
	async checkIfProcessed(itemUrl: string): Promise<boolean> {
		const processed = await this.kvNamespace.get(itemUrl);
		return processed === '1';
	}

	/**
	 * Marks an item as processed.
	 * @param {string} itemUrl - The URL of the item to mark as processed.
	 * @returns {Promise<void>} - A promise that resolves when the item is marked as processed.
	 */
	async markItemAsProcessed(itemUrl: string): Promise<void> {
		return this.kvNamespace.put(itemUrl, '1');
	}
}
