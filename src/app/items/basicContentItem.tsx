import {useContext} from "react";
import {type ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {ContentItem} from "@/gestalt/item/contentItem";
import {EditorContext} from "@/gestalt/editor/editorContext";
import "./basicContentItem.css"

export function BasicContentItemEditor({value}: {
    value: string
}) {
    const editor = useContext(EditorContext);

    return <div id="selected-topic-editor">
        <textarea id="selected-topic-editor-textarea" placeholder="Type here..." value={value} onChange={
            (e) => editor.setCurrentItemSource(e.target.value)
        } ref={editor.getItemEditorRef<HTMLTextAreaElement>()} spellCheck="false"/>
    </div>;
}

export abstract class BasicContentItem extends ContentItem<string> {
    public state: string;

    constructor(state?: string) {
        super();
        this.state = state ?? "";
    }

    renderEditing(): ItemEditingModeRenderResult {
        return {
            selfRender: this.render(),
            editorRender: <BasicContentItemEditor value={this.state}/>
        }
    }
}