import {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import {Item} from "@/gestalt/item/item";
import {ReactElement} from "react";
import {ContentItem} from "@/gestalt/item/contentItem";
import {TopicAccess} from "@/gestalt/editor/topicAccess";

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