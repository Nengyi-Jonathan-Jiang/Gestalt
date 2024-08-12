import type {Item} from "@/gestalt/item/item";
import type {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import type {Topic} from "@/gestalt/topic/topic";
import type {ContentItem} from "@/gestalt/item/contentItem";
import type {PropertyItem} from "@/gestalt/item/propertyItem";
import type {ConstructorFor} from "@/utils/util";


export interface TopicAccess {
    getTopicContentItems(): ContentItem[];

    /**
     * Insert a new item before the given item.
     *
     * @returns Write access to the topic created, or null if the topic could not be created
     */
    insertContentItem<T extends ContentItem>(
        before: ContentItem | null,
        itemSupplier: () => T
    ): Promise<ItemWriteAccess<T> | null>;

    /**
     * Deletes the topic with the given name
     *
     * @returns Whether the topic was successfully deleted.
     */
    deleteContentItem(item: ItemWriteAccess<ContentItem>): Promise<boolean>;

    /**
     * Request write access to an item.
     */
    requestItemWriter<State_t>(item: Item<State_t>): Promise<ItemWriteAccess | null>;

    getProperty<T extends ConstructorFor<PropertyItem>>(itemType: T): Readonly<InstanceType<T>>;

    /**
     * Return write access to an item.
     */
    returnItemWriter(itemWriter: ItemWriteAccess<ContentItem>): void;

    /** This method should only be used to get read-only access to the topic */
    _getTopic(): Readonly<Topic>;

    /**
     * Indicate that an edit has been made
     */
    markChanged(): void;

    readonly isElevated: boolean
}