export interface Storage {
	getProcessedItems(): Promise<string[]>;
	markItemAsProcessed(itemUrl: string): Promise<void>;
}

export class KVStorage implements Storage {
	constructor(private kvNamespace: KVNamespace) {}

	async getProcessedItems(): Promise<string[]> {
		const items = await this.kvNamespace.get('processed_items');
		return items ? JSON.parse(items) : [];
	}

	async markItemAsProcessed(itemUrl: string): Promise<void> {
		const items = await this.getProcessedItems();

		// If the item already exists, no need to add it again
		if (items.includes(itemUrl)) return;

		// Add new items and keep only the most recent 100 items (to prevent storage from getting too large)
		const updatedItems = [itemUrl, ...items].slice(0, 100);
		await this.kvNamespace.put('processed_items', JSON.stringify(updatedItems));
	}
}
