import {PropertyItem} from "@/gestalt/item/propertyItem";
import {type InPlaceJSON_ifyable} from "@/utils/JSON_ifyable";
import {type ItemJSONData} from "@/gestalt/item/item";
import {type ConstructorFor, toArray} from "@/utils/util";

/**
 * A class representing the properties of a {@link Topic}. Stores exactly a single instance of each type
 * of {@link PropertyItem}
 */
export class TopicProperties implements InPlaceJSON_ifyable<ItemJSONData[]> {
    private readonly entries: Map<ConstructorFor<PropertyItem>, PropertyItem> = new Map;

    constructor() {
        // Make sure we have instances of all registered MetadataItem types.
        for (const i of PropertyItem.itemTypeRegistry.values()) {
            if (!this.entries.has(i.constructor)) {
                this.update(new i.constructor);
            }
        }
    }

    get<T extends ConstructorFor<PropertyItem>>(type: T): InstanceType<T> {
        const data = this.entries.get(type);

        if (!data) {
            throw new Error(`Could not find data of type ${type.name}`);
        }

        return data as InstanceType<T>;
    }

    update(value: PropertyItem) {
        this.entries.set(value.constructor as ConstructorFor<PropertyItem>, value);
    }

    fromJSON(json: ItemJSONData[]): this {
        const target: TopicProperties = (this === TopicProperties.prototype) ? new TopicProperties : this;

        target.updateFromJSON(json);

        return target as this;
    }

    updateFromJSON(json: ItemJSONData[]) {
        for (const itemJSONData of json) {
            const item: PropertyItem = PropertyItem.prototype.fromJSON(itemJSONData);
            this.update(item);
        }
    }

    toJSON(): ItemJSONData[] {
        return toArray(this.entries.values()).map(i => i.toJSON());
    }
}