import {Fragment, RefObject, useContext} from "react";
import {RenderTimeComponentRef} from "@/utils/react-utils/renderTimeComponentRef";
import {EditorContext} from "@/gestalt/editor/editorContext";
import {ItemInsertLine} from "@/app/edit/components/itemInsertLine";
import {DeleteContentItemButton, ItemViewer} from "@/app/edit/components/topicViewer/itemViewer";
import {Topic} from "@/gestalt/topic/topic";

export function TopicViewBody({topic, itemEditorComponentRef}: {
    topic: Readonly<Topic>
    itemEditorComponentRef: RenderTimeComponentRef
}) {
    const editor = useContext(EditorContext);

    return <div id="selected-topic-view">
        {
            topic.content.map(item => <Fragment key={item._id}>
                <ItemInsertLine before={item}/>
                <div className="topic-item topic-content-item" data-active={editor.currentItem == item || undefined}>
                    <ItemViewer item={item}
                                itemEditorComponentRef={itemEditorComponentRef}/>
                    <DeleteContentItemButton/>
                </div>
            </Fragment>)
        }
        <ItemInsertLine before={null}/>
    </div>;
}