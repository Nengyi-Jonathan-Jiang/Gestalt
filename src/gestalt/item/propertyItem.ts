import {Item, ItemJSONData} from "@/gestalt/item/item";
import {ConstructorFor} from "@/utils/util";


export interface PropertyItemTypeRegistryEntry<State_t = any> {
    cls: ConstructorFor<PropertyItem<State_t>>;
    constructor: (source?: State_t) => PropertyItem<State_t>;
}

/**
 * This is the base class for all {@link Item}s that can be stored in a {@link TopicProperties}. Exactly one instance of
 * each type of PropertyItem may be stored in a TopicProperties, as opposed to {@link ContentItem}s, for which multiple
 * instances of each type may be stored in a {@link TopicContent}.
 */
export abstract class PropertyItem<State_t = any> extends Item<State_t> {
    fromJSON({type, state}: ItemJSONData<State_t>): this {
        let constructor = (
            PropertyItem.itemTypeRegistry.get(type)
        )?.constructor;

        if (!constructor) {
            throw new Error(`Unknown item type : ${type}`);
        }

        // @ts-ignore
        return constructor(state);
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<PropertyItemTypeRegistryEntry>> = new Map;

    /**
     * Registers a type of property item. The type provided should have a constructor
     */
    public static registerItemType(cls: ConstructorFor<PropertyItem>) {
        this._itemTypeRegistry.set(cls.name, {
            cls,
            constructor: (source?: any) => {
                return new cls(source);
            }
        });
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<PropertyItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}