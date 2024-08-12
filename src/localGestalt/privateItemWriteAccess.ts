import type {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import type {Item} from "@/gestalt/item/item";
import type {ReactElement} from "react";
import type {ContentItem} from "@/gestalt/item/contentItem";
import type {TopicAccess} from "@/gestalt/editor/topicAccess";

export class PrivateItemWriteAccess<T extends Item = Item> implements ItemWriteAccess<T> {
    private readonly item: T;
    private readonly topicAccess: TopicAccess;

    constructor(item: T, topicAccess: TopicAccess) {
        this.item = item;
        this.topicAccess = topicAccess;
    }

    _getItem(): Readonly<T> {
        return this.item;
    }

    getItemPreview(this: PrivateItemWriteAccess<ContentItem>): ReactElement {
        return this.item.render();
    }

    getSource(): string {
        return this.item.state;
    }

    writeSource(source: string): void {
        this.item.state = source;

        this.topicAccess.markChanged();
    }
}