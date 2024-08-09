import React, {RefObject, useContext} from "react";
import {EditorContext} from "@/app/edit/editorContext";

export function BasicContentItemEditor({editorElementRef, value}: {
    value: string,
    editorElementRef: React.RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);

    return <div id="selected-topic-editor">
        <textarea id="selected-topic-editor-textarea" placeholder="Type here..." value={value} onChange={
            (e) => editor.setCurrentItemSource(e.target.value)
        } ref={editorElementRef as RefObject<HTMLTextAreaElement>}/>
    </div>;
}