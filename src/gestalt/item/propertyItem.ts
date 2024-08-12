import {Item, type ItemJSONData} from "@/gestalt/item/item";
import type {ConstructorFor} from "@/utils/util";


export interface PropertyItemTypeRegistryEntry<State_t = any> {
    constructor: ConstructorFor<PropertyItem<State_t>>;
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
            throw new Error(`Unknown property item type : ${type}`);
        }

        return new constructor(state) as this;
    }

    private static readonly _itemTypeRegistry: Map<string, Readonly<PropertyItemTypeRegistryEntry>> = new Map;

    /**
     * Registers a type of property item. The type provided should have a constructor
     */
    public static registerItemType(constructor: ConstructorFor<PropertyItem>) {
        this._itemTypeRegistry.set(constructor.name, {constructor});
    }

    public static get itemTypeRegistry(): ReadonlyMap<string, Readonly<PropertyItemTypeRegistryEntry>> {
        return this._itemTypeRegistry;
    }
}