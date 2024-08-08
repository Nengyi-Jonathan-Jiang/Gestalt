import React, {RefObject} from "react";
import {Item, ItemEditingModeRenderResult} from "@/gestalt/item";

// This is needed to load all the item types
import "./items/allItems";
import {ContentItemEditor} from "@/gestalt/contentItemEditor";

/**
 * This is the base class for all items that can be found in a TopicContent. It should provide a way to display itself
 * through render() and it's only state should be the source string.
 */
export abstract class ContentItem extends Item {
    renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            selfRender: this.render(),
            editorRender: <ContentItemEditor value={this.value} editorElementRef={ref}/>
        }
    }
}

