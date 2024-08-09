import {Item, ItemJSONData} from "@/gestalt/item";

export interface ContentItemTypeRegistryEntry {
    cls: typeof ContentItem;
    displayName: string;
    constructor: (source?: string) => ContentItem;
}

/**
 * This is the base class for all items that can be found in a TopicContent.
 */
export abstract class ContentItem extends Item {

    fromJSON({type, source}: ItemJSONData): this {
        let constructor = (
            ContentItem.itemTypeRegistry.get(type)
        )?.constructor;

        if (!constructor) {
            throw new Error(`Unknown item type : ${type}`);
        }

        // @ts-ignore
        return constructor(source);
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<ContentItemTypeRegistryEntry>> = new Map;

    public static registerItemType(cls: typeof ContentItem, displayName: string) {
        this._itemTypeRegistry.set(cls.name, {
            displayName,
            cls,
            constructor: (source?: string) => {
                // We know that only non-abstract classes may be registered, but typescript doesn't.
                // @ts-ignore
                return new cls(source ?? "");
            }
        });
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<ContentItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}


