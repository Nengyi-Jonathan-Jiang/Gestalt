import {Item, ItemEditingModeRenderResult} from "@/gestalt/item";
import React, {ReactElement, RefObject, useContext} from "react";
import {EditorContext} from "@/app/edit/editorContext";

import "./nameItem.css";

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

export class NameItem extends Item {
    constructor(name: string) {
        super(name);
    }

    public render(): ReactElement {
        return <div className="name-item">{this.value} </div>
    }

    public renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            editorRender: <></>, // Name editor is in-place, no separate editor
            selfRender: <NameItemEditingMode value={this.value} editorElementRef={ref}/>
        }
    }

    public set(value: string) {
        // value = value.trim();
        if (value.length) {
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        this.value = value;
    }
}