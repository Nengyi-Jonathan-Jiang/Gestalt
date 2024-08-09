import {Item} from "@/gestalt/item";
import {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import {Topic} from "@/gestalt/topic";
import {ContentItem} from "@/gestalt/contentItem";
import {NameItem} from "@/app/items/nameItem";

export interface TopicAccess {
    getTopicName(): string;

    getTopicContentItems(): ContentItem[];

    /**
     * Insert a new item before the given item.
     *
     * @returns Write access to the topic created, or null if the topic could not be created
     */
    insertContentItem(before: Item | null, itemSupplier: () => Item): Promise<ItemWriteAccess | null>;

    /**
     * Deletes the topic with the given name
     *
     * @returns Whether the topic was successfully deleted.
     */
    deleteContentItem(item: ItemWriteAccess): Promise<boolean>;

    /**
     * Request write access to an item.
     */
    requestItemWriter(item: Item): Promise<ItemWriteAccess | null>;

    getNameItem() : NameItem;

    /**
     * Return write access to a topic.
     */
    returnItemWriter(itemWriter: ItemWriteAccess): void;

    /** This method should only be used to get read-only access to the topic */
    _getTopic(): Topic;

    /**
     * Indicate that an edit has been made
     */
    markChanged(): void;

    readonly isElevated: boolean
}