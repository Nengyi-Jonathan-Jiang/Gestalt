import {useManualRerender} from "@/utils/util";
import React, {Fragment, MutableRefObject, ReactElement, RefObject, useContext, useRef} from "react";
import {EditorContext} from "@/app/edit/editorContext";
import {ItemInsertLine} from "@/app/edit/components/itemInsertLine";

import "./selectedTopicViewer.css"
import {TopicAccess} from "@/gestalt/editor/topicAccess/topicAccess";
import {Item, ItemEditingModeRenderResult} from "@/gestalt/item";
import {TexMacroProvider} from "@/tex/Tex";
import {defaultTexMacros} from "@/tex/texDefaultMacros";
import {Mutable} from "next/dist/client/components/router-reducer/router-reducer-types";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";

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

function TopicView({currentTopic, onClick, editorElementRef}: {
    currentTopic: TopicAccess,
    onClick: () => Promise<void>,
    editorElementRef: RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);
    let itemEditor: MutableRefObject<ReactElement> = {current: <></>};

    let nameItem = currentTopic.getNameItem();

    return <div id="selected-topic">
        <div id="selected-topic-top">
            {renderItem({editor: editor, editorElementRef: editorElementRef, item: nameItem, itemEditor: itemEditor})}

            <div id="selected-topic-top-buttons">
                <button className="close-button" onClick={editor.exitTopicView.bind(editor)}></button>
                <button className="delete-button" onClick={onClick}></button>
            </div>
        </div>
        <div id="selected-topic-view">
            {
                currentTopic.getTopicContentItems().map(item => {
                    const isActive = editor.currentItem == item;

                    return <Fragment key={item.id}>
                        <ItemInsertLine before={item} editorElementRef={editorElementRef}/>
                        <div className="topic-item topic-content-item" data-active={isActive || undefined}>
                            {renderItem({editor, editorElementRef, item, itemEditor})}
                            <div className="delete-button" onClick={async _ => {
                                if (!await editor.deleteCurrentItem()) {
                                    alert('Unable to delete item.');
                                }
                            }}></div>
                        </div>
                    </Fragment>;
                })
            }
            <ItemInsertLine before={null} editorElementRef={editorElementRef}/>
        </div>
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
            <TopicView currentTopic={currentTopic} onClick={async () => {
                if (!await editor.deleteCurrentTopic()) {
                    alert('Unable to delete topic');
                }
            }} editorElementRef={editorElementRef}/>
        </TexMacroProvider>
        :
        <></>;
}