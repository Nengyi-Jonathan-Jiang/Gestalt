import {ContentItem} from "@/gestalt/contentItem";
import {BasicContentItem} from "@/app/items/basicContentItem";

export class TopicContent {
    private readonly items: ContentItem[]

    constructor(...items: ContentItem[]) {
        this.items = items;
    }

    map<T>(f: (item: BasicContentItem) => T) : T[] {
        return this.items.map(f);
    }

    indexOf(item: ContentItem): number {
        return this.items.indexOf(item);
    }

    get(index: number): BasicContentItem {
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

