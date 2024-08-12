import {ContentItem} from "@/gestalt/item/contentItem";
import type {JSON_ifyable} from "@/utils/JSON_ifyable";
import type {ItemJSONData} from "@/gestalt/item/item";

export class TopicContent implements JSON_ifyable<ItemJSONData[]> {
    private readonly items: ContentItem[]

    constructor(...items: ContentItem[]) {
        this.items = items;
    }

    toJSON(): ItemJSONData[] {
        return this.items.map(i => i.toJSON());
    }

    fromJSON(json: ItemJSONData[]): this {
        const target: TopicContent = (this === TopicContent.prototype) ? new TopicContent : this;

        // @ts-ignore
        target["items"] = json.map(i => ContentItem.prototype.fromJSON(i));

        return target as this;
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