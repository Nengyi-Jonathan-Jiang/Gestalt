import {Topic} from "@/gestalt/topic/topic";
import {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import {TopicAccess} from "@/gestalt/editor/topicAccess";
import {PrivateItemWriteAccess} from "@/gestalt/editor/implementations/private/privateItemWriteAccess";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import {ContentItem} from "@/gestalt/item/contentItem";
import {Item} from "@/gestalt/item/item";
import {PropertyItem} from "@/gestalt/item/propertyItem";
import {NameItem} from "@/app/items/property/nameItem";
import {ConstructorFor} from "@/utils/util";

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
        return this.topic.getMetadata(NameItem).state
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
        return this.topic.getMetadata(itemType);
    }

    returnItemWriter(_itemWriter: ItemWriteAccess<Item>): void {
        // Do nothing
    }

    markChanged(): void {
        this.gestaltAccess.markChanged();
    }

    public readonly isElevated: boolean = false;
}