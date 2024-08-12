import type {ItemEditingModeRenderResult} from "@/gestalt/item/item";
import type {ReactElement} from "react";

import {PropertyItem} from "@/gestalt/item/propertyItem";
import type {TexMacros} from "@/tex/Tex";

interface TexMacrosState {
    macros: { name: string; value: string }[];
}

export class TexMacrosItem extends PropertyItem<TexMacrosState> {
    public state: TexMacrosState

    constructor(state?: TexMacrosState) {
        super();
        this.state = state ?? {macros: []};
    }

    public get macros(): TexMacros {
        const result: { [macroName: string]: string } = {};

        for (const {name, value} of this.state.macros) {
            result[name] = value;
        }

        return result;
    }

    public render(): ReactElement {
        return <></>
    }

    public renderEditing(): ItemEditingModeRenderResult {
        return {
            editorRender: <></>, // Name editor is in-place, no separate editor
            selfRender: <></>
        }
    }
}