import type {ContentItem} from "@/gestalt/item/contentItem";

export class TopicContent {
    private readonly items: ContentItem[]

    constructor(...items: ContentItem[]) {
        this.items = items;
    }

    map<T>(f: (item: ContentItem) => T): T[] {
        return this.items.map(f);
    }

    indexOf(item: ContentItem): number {
        return this.items.indexOf(item);
    }

    get(index: number): ContentItem {
        return this.items[index];
    }

    insertAtIndex(index: number, item: ContentItem) {
        this.items.splice(index, 0, item)
    }

    delete(item: ContentItem): boolean {
        let itemIndex = this.indexOf(item);

        if (itemIndex < 0) {
            return false;
        }

        this.items.splice(itemIndex, 1)
        return true;
    }

    has(item: ContentItem) {
        return this.items.includes(item);
    }

    get length() {
        return this.items.length
    }
}