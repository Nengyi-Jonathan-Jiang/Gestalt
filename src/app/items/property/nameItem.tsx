import {ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {ReactElement, RefObject, useContext} from "react";

import "./nameItem.css";
import {PropertyItem} from "@/gestalt/item/propertyItem";
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
            editor.setCurrentItemSource((e.target as HTMLInputElement).value);
            editor.updateGestaltView();
        }}
    />
}

export class NameItem extends PropertyItem<string> {
    private _state: string;

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        value = value.trimStart().replaceAll(/\s{2,}/g, ' ');

        if (value.length) {
            value = value.charAt(0).toUpperCase() + value.slice(1);
        }

        this._state = value;
    }

    constructor(value?: string) {
        super();
        this._state = value ?? "";
    }

    public render(): ReactElement {
        return <div className="name-item">{this.state} </div>
    }

    public renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            editorRender: <></>, // Name editor is in-place, no separate editor
            selfRender: <NameItemEditingMode value={this.state} editorElementRef={ref}/>
        }
    }
}