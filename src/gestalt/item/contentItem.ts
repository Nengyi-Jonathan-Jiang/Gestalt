import {Item, ItemJSONData} from "@/gestalt/item/item";

/** */
export interface ContentItemTypeRegistryEntry<State_t = any> {
    cls: typeof ContentItem;
    displayName: string;
    constructor: (source?: State_t) => ContentItem<State_t>;
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
            throw new Error(`Unknown item type : ${type}`);
        }

        // @ts-ignore
        return constructor(state);
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<ContentItemTypeRegistryEntry>> = new Map;

    public static registerItemType(cls: typeof ContentItem<any>, displayName: string) {
        this._itemTypeRegistry.set(cls.name, {
            displayName,
            cls,
            constructor: (source?: any) => {
                // @ts-ignore: We know that only non-abstract classes may be registered, but typescript doesn't.
                return new cls(source);
            }
        });
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<ContentItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}


