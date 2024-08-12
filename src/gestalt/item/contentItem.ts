import {Item, type ItemJSONData} from "@/gestalt/item/item";
import {ConstructorFor} from "@/utils/util";

/** */
export interface ContentItemTypeRegistryEntry<State_t = any> {
    constructor: ConstructorFor<ContentItem<State_t>>;
    displayName: string;
}

/**
 * This is the base class for all {@link Item}s that can be stored in a {@link TopicContent}. Multiple instances of the
 * same type of ContentItem may be stored in a TopicContent, as opposed to {@link PropertyItem}s, for which only a single
 * instance of each type may be stored in a {@link TopicProperties}.
 */
export abstract class ContentItem<State_t = any> extends Item<State_t> {

    fromJSON({type, state}: ItemJSONData<State_t>): this {
        let constructor = (
            ContentItem.itemTypeRegistry.get(type)
        )?.constructor;

        if (!constructor) {
            throw new Error(`Unknown content item type : ${type}`);
        }

        return new constructor(state) as this;
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<ContentItemTypeRegistryEntry>> = new Map;

    public static registerItemType(constructor: ConstructorFor<ContentItem>, displayName: string) {
        this._itemTypeRegistry.set(constructor.name, {displayName, constructor});
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<ContentItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}