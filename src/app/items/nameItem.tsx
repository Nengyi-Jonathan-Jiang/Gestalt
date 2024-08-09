import {ItemEditingModeRenderResult} from "@/gestalt/item";
import {ReactElement, RefObject, useContext} from "react";

import "./nameItem.css";
import {MetadataItem} from "@/gestalt/metadataItem";
import {EditorContext} from "@/app/edit/editorContext";

function NameItemEditingMode({value, editorElementRef}: {
    value: string,
    editorElementRef: RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);

    return <input
        ref={editorElementRef as RefObject<HTMLInputElement>}
        value={value}
        onInput={(e) => {
            editor.setCurrentItemSource((e.target as HTMLInputElement).value)
            editor.updateGestaltView();
        }}
    />
}

export class NameItem extends MetadataItem {

    public render(): ReactElement {
        return <div className="name-item">{this.value} </div>
    }

    public renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            editorRender: <></>, // Name editor is in-place, no separate editor
            selfRender: <NameItemEditingMode value={this.value} editorElementRef={ref}/>
        }
    }
}