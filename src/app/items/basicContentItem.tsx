import {RefObject} from "react";
import {ItemEditingModeRenderResult} from "@/gestalt/item";
import {BasicContentItemEditor} from "@/app/items/basicContentItemEditor";
import {ContentItem} from "@/gestalt/contentItem";

export abstract class BasicContentItem extends ContentItem {
    renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            selfRender: this.render(),
            editorRender: <BasicContentItemEditor value={this.value} editorElementRef={ref}/>
        }
    }
}