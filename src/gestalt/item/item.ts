import {JSON_ifyable} from "@/utils/JSON_ifyable";
import {ReactElement, RefObject} from "react";

export type ItemJSONData<StateType = any> = {
    type: string,
    state: StateType,
};

export interface ItemEditingModeRenderResult {
    selfRender: ReactElement,
    editorRender: ReactElement
}

/**
 * Represents data in a topic that can be edited. Multiple users should not edit the same Item at the same time.
 */
export abstract class Item<State_t = any> implements JSON_ifyable<ItemJSONData<State_t>> {
    /**
     * A single JSON-ifyable object describing the object state.
     */
    public abstract state: State_t;

    private static _nextID: number = 0;
    /** A unique integer used by rendering logic to distinguish items. NOTE: this is not state. */
    public readonly _id: number = Item._nextID++;

    /**
     * Implements the {@link JSON_ifyable} interface. This will be implemented by {@link PropertyItem}
     * and {@link ContentItem}
     */
    abstract fromJSON(json: ItemJSONData<State_t>): this;

    /**
     * Implements the {@link JSON_ifyable} interface. Type information and the state are stored.
     */
    toJSON(): ItemJSONData<State_t> {
        return {
            type: this.constructor.name,
            state: this.state
        };
    }

    public abstract render(): ReactElement;

    public abstract renderEditing(editorElementRef: RefObject<HTMLElement>): ItemEditingModeRenderResult;
}