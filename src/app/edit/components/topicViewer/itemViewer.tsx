import {MouseEvent, ReactElement, useContext} from "react";
import {Item, ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {RenderTimeComponentRef} from "@/utils/react-utils/renderTimeComponentRef";
import {EditorContext} from "@/gestalt/editor/editorContext";

export function ItemViewer({item, itemEditorComponentRef}: {
    item: Item,
    itemEditorComponentRef: RenderTimeComponentRef
}): ReactElement {
    const editor = useContext(EditorContext);

    const isActive = editor.currentItem == item;

    let result: ReactElement;
    if (isActive) {
        const {selfRender, editorRender}: ItemEditingModeRenderResult = item.renderEditing();

        itemEditorComponentRef.current = editorRender;

        result = selfRender;
    }
    else {
        result = item.render();
    }

    async function toggleActive() {

        if (editor.currentItem == item) {
            editor.stopEditItem();
            return;
        }

        const success = await editor.startEditItem(item);
        if (!success) {
            alert('Unable to start editing item');
            return;
        }
    }

    return <div onClick={e => {
        if(!e.ctrlKey) return;
        e.preventDefault();
        toggleActive();
    }}> {result} </div>;
}

export function DeleteContentItemButton() {
    const editor = useContext(EditorContext);

    return <div className="delete-button" onClick={async _ => {
        if (!await editor.deleteCurrentItem()) {
            alert('Unable to delete item.');
        }
    }}></div>;
}