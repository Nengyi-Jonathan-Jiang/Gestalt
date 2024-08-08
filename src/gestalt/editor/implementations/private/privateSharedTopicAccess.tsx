import {Topic} from "@/gestalt/topic";
import {ItemWriteAccess} from "@/gestalt/editor/itemAccess/itemWriteAccess";
import {TopicAccess} from "@/gestalt/editor/topicAccess/topicAccess";
import {PrivateItemWriteAccess} from "@/gestalt/editor/implementations/private/privateItemWriteAccess";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess/gestaltAccess";
import {ContentItem} from "@/gestalt/contentItem";
import {NameItem} from "@/gestalt/items/nameItem";
import {Item} from "@/gestalt/item";

export class PrivateSharedTopicAccess implements TopicAccess {
    protected readonly topic: Topic;
    protected readonly gestaltAccess: GestaltAccess;

    constructor(topic: Topic, gestaltAccess: GestaltAccess) {
        this.topic = topic;
        this.gestaltAccess = gestaltAccess;
    }

    getTopicContentItems(): ContentItem[] {
        return this.topic.content.map(i => i)
    }

    _getTopic(): Topic {
        return this.topic
    }

    getTopicName(): string {
        return this.topic.name
    }

    async insertContentItem(before: ContentItem | null, itemSupplier: () => ContentItem): Promise<ItemWriteAccess | null> {
        const topicContent = this.topic.content;
        const createdItem = itemSupplier();

        if (before == null) {
            topicContent.insertAtIndex(topicContent.length, createdItem);
        }
        else {
            if (!topicContent.has(before)) {
                return null;
            }

            topicContent.insertAtIndex(topicContent.indexOf(before), createdItem)
        }

        this.gestaltAccess.markChanged();

        return new PrivateItemWriteAccess(createdItem, this.gestaltAccess);
    }

    async deleteContentItem(itemWriteAccess: ItemWriteAccess<ContentItem>): Promise<boolean> {
        const topicContent = this.topic.content;
        const item = itemWriteAccess._getItem();

        if (topicContent.has(item)) {
            topicContent.delete(item);
            this.gestaltAccess.markChanged();

            return true;
        }

        return false;
    }

    async requestItemWriter(item: Item): Promise<ItemWriteAccess | null> {
        return new PrivateItemWriteAccess(item, this.gestaltAccess);
    }

    getNameItem(): NameItem {
        return this.topic.nameItem;
    }

    returnItemWriter(_itemWriter: ItemWriteAccess): void {
        // Do nothing
    }

    public readonly isElevated: boolean = false;
}