import {Fragment, MouseEvent, ReactElement, RefObject, useContext, useRef} from "react";
import {EditorContext} from "@/app/edit/editorContext";
import {ItemInsertLine} from "@/app/edit/components/itemInsertLine";

import "./selectedTopicViewer.css"
import {Item, ItemEditingModeRenderResult} from "@/gestalt/item/item";
import {TexMacroProvider} from "@/tex/Tex";
import {defaultTexMacros} from "@/tex/texDefaultMacros";
import {NameItem} from "@/app/items/property/nameItem";
import {TexMacrosItem} from "@/app/items/property/texMacrosItem";
import {RenderTimeComponentRef} from "@/utils/react-utils/renderTimeComponentRef";
import {useManualRerender} from "@/utils/react-utils/hooks";

function ItemView({editorElementRef, item, itemEditorComponentRef}: {
    editorElementRef: RefObject<HTMLElement>,
    item: Item,
    itemEditorComponentRef: RenderTimeComponentRef
}): ReactElement {
    const editor = useContext(EditorContext);

    const isActive = editor.currentItem == item;

    let result: ReactElement;
    if (isActive) {
        const {selfRender, editorRender}: ItemEditingModeRenderResult = item.renderEditing(editorElementRef);

        itemEditorComponentRef.current = editorRender;

        result = selfRender;
    }
    else {
        result = item.render();
    }

    async function toggleActive(evt: MouseEvent<HTMLDivElement>) {
        evt.preventDefault();

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
    };
    return <div onClick={toggleActive}>
        {result}
    </div>;
}

function DeleteContentItemButton() {
    const editor = useContext(EditorContext);

    return <div className="delete-button" onClick={async _ => {
        if (!await editor.deleteCurrentItem()) {
            alert('Unable to delete item.');
        }
    }}></div>;
}

function TopicViewTop({editorElementRef, itemEditorComponentRef, onClick, onClick1, onClick2, property}: {
    editorElementRef: RefObject<HTMLElement>,
    property: Readonly<NameItem>,
    itemEditorComponentRef: RenderTimeComponentRef,
    onClick: () => void,
    onClick1: () => void,
    onClick2: () => Promise<void>
}) {
    return <div id="selected-topic-top">
        <ItemView editorElementRef={editorElementRef}
                  item={property}
                  itemEditorComponentRef={itemEditorComponentRef}
        />

        <div id="selected-topic-top-buttons">
            <button className="settings-button" onClick={onClick}></button>
            <button className="close-button" onClick={onClick1}></button>
            <button className="delete-button" onClick={onClick2}></button>
        </div>
    </div>;
}

function TopicViewBody({editorElementRef, itemEditorComponentRef}: {
    editorElementRef: RefObject<HTMLElement>,
    itemEditorComponentRef: RenderTimeComponentRef
}) {
    const editor = useContext(EditorContext);

    return <div id="selected-topic-view">
        {
            editor.currentTopic?.content.map(item => <Fragment key={item._id}>
                <ItemInsertLine before={item} editorElementRef={editorElementRef}/>
                <div className="topic-item topic-content-item"
                     data-active={editor.currentItem == item || undefined}>
                    <ItemView editorElementRef={editorElementRef} item={item}
                              itemEditorComponentRef={itemEditorComponentRef}/>
                    <DeleteContentItemButton/>
                </div>
            </Fragment>)
        }
        <ItemInsertLine before={null} editorElementRef={editorElementRef}/>
    </div>;
}

function TopicView({editorElementRef}: {
    editorElementRef: RefObject<HTMLElement>
}) {
    const editor = useContext(EditorContext);

    const itemEditorComponentRef = new RenderTimeComponentRef();

    if (editor.currentTopic == null) return;

    return <div id="selected-topic">
        <TopicViewTop editorElementRef={editorElementRef} property={editor.currentTopic.getProperty(NameItem)}
                      itemEditorComponentRef={itemEditorComponentRef} onClick={() => {

        }} onClick1={() => editor.exitTopicView()} onClick2={async () => {
            if (!await editor.deleteCurrentTopic()) {
                alert('Unable to delete topic');
            }
        }}/>

        <TopicViewBody editorElementRef={editorElementRef} itemEditorComponentRef={itemEditorComponentRef}/>

        {itemEditorComponentRef.current}
    </div>;
}

export function SelectedTopicViewer() {
    const rerender = useManualRerender();
    const editor = useContext(EditorContext);

    const editorElementRef = useRef<HTMLElement>(null);

    editor.useTopicViewUpdateCallback(rerender);

    if (!editor.currentTopic) return <></>;

    return <TexMacroProvider macros={defaultTexMacros}>
        <TexMacroProvider macros={editor.currentTopic?.getProperty(TexMacrosItem).macros}>
            <TopicView editorElementRef={editorElementRef}/>
        </TexMacroProvider>
    </TexMacroProvider>;
}