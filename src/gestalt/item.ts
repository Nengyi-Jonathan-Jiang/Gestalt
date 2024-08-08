import {JSONifyable} from "@/utils/JSONifyable";
import {ReactElement, RefObject} from "react";

export type ItemJSONData = {
    type: string,
    source: string,
};

export interface ItemEditingModeRenderResult {
    selfRender: ReactElement,
    editorRender: ReactElement
}

/**
 * This is the base class for all items that can be found in a TopicContent. It should provide a way to display itself
 * through render() and it's only state should be the source string.
 */
export abstract class Item implements JSONifyable<ItemJSONData> {
    public value: string;

    private static id: number = 0;
    public readonly id: number = Item.id++; // This is not state. Used internally to distinguish items

    constructor(value: string) {
        this.value = value;
    }

    toJSON(): ItemJSONData {
        return {
            // @ts-ignore
            type: Item.clsNameMap.get(this.constructor) as string,
            source: this.value
        };
    }

    fromJSON({type, source}: ItemJSONData): this {
        let constructor = Item.clsConstructorMap.get(type);
        if (!constructor) {
            throw new Error(`Unknown item type : ${type}`);
        }
        // @ts-ignore
        return constructor(source);
    }

    private static readonly clsConstructorMap: Map<string, (source: string) => Item> = new Map;
    private static readonly clsNameMap: Map<typeof Item, string> = new Map;
    private static readonly clsDisplayNameMap: Map<string, string> = new Map;

    public static registerContentItemType(cls: typeof Item, displayName: string, constructor: (source: string) => Item) {
        const {name} = cls

        this.clsConstructorMap.set(name, constructor);
        this.clsNameMap.set(cls, name);
        this.clsDisplayNameMap.set(name, displayName);
    }

    public static getContentItemTypes() {
        return [...this.clsDisplayNameMap.entries()].map(([key, displayName]) => ({
            displayName,
            constructor: this.clsConstructorMap.get(key) as (source: string) => Item,
        }));
    }

    public abstract render(): ReactElement;

    public abstract renderEditing(editorElementRef: RefObject<HTMLElement>): ItemEditingModeRenderResult;
}

