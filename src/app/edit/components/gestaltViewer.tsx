import {useManualRerender} from "@/utils/util";
import React, {Fragment, useContext} from "react";
import {EditorContext} from "@/app/edit/editorContext";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";
import {NameItem} from "@/app/items/property/nameItem";
import {Topic} from "@/gestalt/topic/topic";

function GestaltTopic({editor, topic, tryViewTopic}: {
    editor: GestaltEditor,
    topic: Readonly<Topic>,
    tryViewTopic: () => void
}) {
    return <Fragment>
        <div className={editor.currentTopic == topic ? "active" : undefined}
             onClick={tryViewTopic}>
            {topic.getMetadata(NameItem).state}
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
                    const success = editor.tryViewTopic(topic.id);
                    if (!success) {
                        alert(`Unable to edit topic ${topic.getMetadata(NameItem).state}.`)
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
                if (name == null) {
                    return;
                }
                name = name.trim();

                // Capitalize the first letter
                name = name.charAt(0).toUpperCase() + name.slice(1);

                if (name.length === 0 || !await editor.tryAddTopic(name)) {
                    alert('Unable to create topic.')
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