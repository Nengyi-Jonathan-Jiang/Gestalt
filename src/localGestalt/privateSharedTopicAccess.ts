import type {Topic} from "@/gestalt/topic/topic";
import type {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import type {TopicAccess} from "@/gestalt/editor/topicAccess";
import {PrivateItemWriteAccess} from "@/localGestalt/privateItemWriteAccess";
import type {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import type {ContentItem} from "@/gestalt/item/contentItem";
import type {Item} from "@/gestalt/item/item";
import type {PropertyItem} from "@/gestalt/item/propertyItem";
import type {ConstructorFor} from "@/utils/util";

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

    async insertContentItem<T extends ContentItem>(before: ContentItem | null, itemSupplier: () => T): Promise<ItemWriteAccess<T> | null> {
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

        return new PrivateItemWriteAccess(createdItem, this);
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

    async requestItemWriter<T extends Item>(item: T): Promise<ItemWriteAccess<T> | null> {
        return new PrivateItemWriteAccess(item, this);
    }

    getProperty<T extends ConstructorFor<PropertyItem>>(itemType: T): InstanceType<T> {
        return this.topic.getProperty(itemType);
    }

    returnItemWriter(_itemWriter: ItemWriteAccess): void {
        // Do nothing
    }

    markChanged(): void {
        this.gestaltAccess.markChanged();
    }

    public readonly isElevated: boolean = false;
}