import {type RefObject, useContext} from "react";
import {type ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {ContentItem} from "@/gestalt/item/contentItem";
import {EditorContext} from "@/app/edit/editorContext";
import "./basicContentItem.css"

export function BasicContentItemEditor({editorElementRef, value}: {
    value: string,
    editorElementRef: RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);

    return <div id="selected-topic-editor">
        <textarea id="selected-topic-editor-textarea" placeholder="Type here..." value={value} onChange={
            (e) => editor.setCurrentItemSource(e.target.value)
        } ref={editorElementRef as RefObject<HTMLTextAreaElement>} spellCheck="false"/>
    </div>;
}

export abstract class BasicContentItem extends ContentItem<string> {
    public state: string;

    constructor(state?: string) {
        super();
        this.state = state ?? "";
    }

    renderEditing(ref: RefObject<HTMLElement>): ItemEditingModeRenderResult {
        return {
            selfRender: this.render(),
            editorRender: <BasicContentItemEditor value={this.state} editorElementRef={ref}/>
        }
    }
}