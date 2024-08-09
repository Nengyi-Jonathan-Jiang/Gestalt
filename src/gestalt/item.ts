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

    abstract fromJSON(json: ItemJSONData): this;

    toJSON(): ItemJSONData {
        return {
            // @ts-ignore
            type: this.constructor.name as string,
            source: this.value
        };
    }

    public abstract render(): ReactElement;

    public abstract renderEditing(editorElementRef: RefObject<HTMLElement>): ItemEditingModeRenderResult;
}