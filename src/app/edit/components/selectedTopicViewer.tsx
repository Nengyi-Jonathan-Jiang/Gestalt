import {useManualRerender} from "@/utils/util";
import React, {Fragment, MutableRefObject, ReactElement, RefObject, useContext, useRef} from "react";
import {EditorContext} from "@/app/edit/editorContext";
import {ItemInsertLine} from "@/app/edit/components/itemInsertLine";

import "./selectedTopicViewer.css"
import {TopicAccess} from "@/gestalt/editor/topicAccess";
import {Item, ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {TexMacroProvider} from "@/tex/Tex";
import {defaultTexMacros} from "@/tex/texDefaultMacros";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";
import {NameItem} from "@/app/items/property/nameItem";
import {TexMacrosItem} from "@/app/items/property/texMacrosItem";
import {ContentItem} from "@/gestalt/item/contentItem";

// DO NOT convert this into a component!!
function renderItem({editor, editorElementRef, item, itemEditor}: {
    editor: GestaltEditor,
    editorElementRef: React.RefObject<HTMLElement>,
    item: Item,
    itemEditor: React.MutableRefObject<React.ReactElement>
}) {
    const isActive = editor.currentItem == item;

    let result: ReactElement;
    if (isActive) {
        const {selfRender, editorRender}: ItemEditingModeRenderResult = item.renderEditing(editorElementRef);

        itemEditor.current = editorRender;

        result = selfRender;
    }
    else {
        result = item.render();
    }

    return <div onClick={async _ => {
        if (editor.currentItem == item) {
            editor.stopEditItem();
            return;
        }

        const success = await editor.startEditItem(item);
        if (!success) {
            alert('Unable to start editing item');
            return;
        }

        editorElementRef.current?.focus()
    }}>
        {result}
    </div>;
}

function ItemEditor({editorRef}: {
    editorRef: { rerender: () => void, element: ReactElement }
}) {
    editorRef.rerender = useManualRerender();

    return editorRef.element;
}

function DeleteContentItemButton() {
    const editor = useContext(EditorContext);

    return <div className="delete-button" onClick={async _ => {
        if (!await editor.deleteCurrentItem()) {
            alert('Unable to delete item.');
        }
    }}></div>;
}

function TopicContent({editorElementRef, item, itemEditor}: {
    active: boolean,
    editorElementRef: React.RefObject<HTMLElement>,
    item: ContentItem,
    itemEditor: React.MutableRefObject<React.ReactElement>
}) {
    const editor = useContext(EditorContext);

    return <div className="topic-item topic-content-item" data-active={editor.currentItem == item || undefined}>
        {renderItem({editor, editorElementRef, item, itemEditor})}
        <DeleteContentItemButton/>
    </div>;
}

function TopicView({currentTopic, editorElementRef}: {
    currentTopic: TopicAccess,
    editorElementRef: RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);
    let itemEditor: MutableRefObject<ReactElement> = {current: <></>};

    let nameItem = currentTopic.getProperty(NameItem);

    let itemEditorRerenderRef = new class {
        #element = <></>;
        rerender = () => void 0;

        get element() {
            return this.#element
        }

        set element(element) {
            this.#element = element;
            this.rerender();
        }
    };

    return <div id="selected-topic">
        <div id="selected-topic-top">
            {renderItem({editor: editor, editorElementRef: editorElementRef, item: nameItem, itemEditor: itemEditor})}

            <div id="selected-topic-top-buttons">
                <button className="settings-button" onClick={() => {

                }}></button>
                <button className="close-button" onClick={() => editor.exitTopicView()}></button>
                <button className="delete-button" onClick={async () => {
                    if (!await editor.deleteCurrentTopic()) {
                        alert('Unable to delete topic');
                    }
                }}></button>
            </div>
        </div>
        <div id="selected-topic-view">
            {
                currentTopic.getTopicContentItems().map(item => {
                    const isActive = editor.currentItem == item;

                    return [
                        <ItemInsertLine key={'line-' + item._id} before={item} editorElementRef={editorElementRef}/>,
                        <TopicContent key={'item-' + item._id} active={isActive}
                                      editorElementRef={editorElementRef} item={item} itemEditor={itemEditor}/>
                    ];
                })
            }
            <ItemInsertLine before={null} editorElementRef={editorElementRef}/>
        </div>
        <ItemEditor editorRef={itemEditorRerenderRef}></ItemEditor>
        {itemEditor.current}
    </div>;
}

export function SelectedTopicViewer() {
    const rerender = useManualRerender();
    const editor = useContext(EditorContext);

    const editorElementRef = useRef<HTMLElement>(null);

    editor.useTopicViewUpdateCallback(rerender);

    let currentTopic = editor.currentTopicAccess;

    return currentTopic ?
        <TexMacroProvider macros={defaultTexMacros}>
            <TexMacroProvider macros={currentTopic?.getProperty(TexMacrosItem).macros}>
                <TopicView currentTopic={currentTopic} editorElementRef={editorElementRef}/>
            </TexMacroProvider>
        </TexMacroProvider>
        :
        <></>;
}