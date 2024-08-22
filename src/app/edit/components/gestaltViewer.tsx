import React, {Fragment, useContext} from "react";
import {EditorContext} from "@/gestalt/editor/editorContext";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";
import {NameItem} from "@/app/items/property/nameItem";
import {Topic} from "@/gestalt/topic/topic";
import {useManualRerender} from "@/utils/react-utils/hooks";

function GestaltTopic({editor, topic, tryViewTopic}: {
    editor: GestaltEditor,
    topic: Readonly<Topic>,
    tryViewTopic: () => void
}) {
    return <Fragment>
        <div className={(editor.currentTopic == topic ? "active " : "") + "topic-v"}
             onClick={tryViewTopic}>
            {topic.getProperty(NameItem).state}
            <button className="delete-button" onClick={async () => {
                if (!await editor.deleteCurrentTopic()) {
                    alert('Unable to delete topic');
                }
            }}/>
        </div>
    </Fragment>;
}

function GestaltTopicsList() {
    const editor = useContext(EditorContext);
    const data = editor.gestaltAccess.viewData;

    return <div id="topics-list">
        {
            data.topics.map(topic =>
                <GestaltTopic key={topic.id} editor={editor} topic={topic} tryViewTopic={() => {
                    if(editor.currentTopic == topic) {
                        editor.exitTopicView();
                        return;
                    }

                    const success = editor.tryViewTopic(topic.id);
                    if (!success) {
                        alert(`Unable to edit topic ${topic.getProperty(NameItem).state}.`)
                    }
                }}/>)
        }
    </div>;
}

function GestaltButtons() {
    const editor = useContext(EditorContext);

    return <div>
        <button onClick={
            async _ => {
                let name = window.prompt("Please enter the topic name:");
                if (name == null || name.trim().length === 0) {
                    return;
                }

                if (name.length === 0 || !await editor.tryAddTopic()) {
                    alert('Unable to create topic.')
                    return;
                }

                if (editor.currentTopic) {
                    editor.currentTopic.getProperty(NameItem).state = name;
                    editor.currentTopicAccess?.markChanged();
                    editor.updateGestaltView();
                    editor.updateTopicView();
                }
            }
        }> Add Topic
        </button>
    </div>;
}

export function GestaltView() {
    const rerender = useManualRerender();
    const editor = useContext(EditorContext);

    editor.useGestaltViewUpdateCallback(rerender);

    // TODO: implement the cool visualization.

    return <div id="topic-map-view">
        <GestaltTopicsList/>
        <GestaltButtons/>
    </div>
}