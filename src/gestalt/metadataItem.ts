import {Item, ItemJSONData} from "@/gestalt/item";

export interface MetadataItemTypeRegistryEntry {
    cls: typeof MetadataItem;
    constructor: (source?: string) => MetadataItem;
}

export abstract class MetadataItem extends Item {
    fromJSON({type, source}: ItemJSONData): this {
        let constructor = (
            MetadataItem.itemTypeRegistry.get(type)
        )?.constructor;

        if (!constructor) {
            throw new Error(`Unknown item type : ${type}`);
        }

        // @ts-ignore
        return constructor(source);
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<MetadataItemTypeRegistryEntry>> = new Map;

    public static registerItemType(cls: typeof MetadataItem) {
        this._itemTypeRegistry.set(cls.name, {
            cls,
            constructor: (source?: string) => {
                // We know that only non-abstract classes may be registered, but typescript doesn't.
                // @ts-ignore
                return new cls(source ?? "");
            }
        });
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<MetadataItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}