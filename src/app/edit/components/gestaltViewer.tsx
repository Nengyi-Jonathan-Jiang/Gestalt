import {useManualRerender} from "@/utils/util";
import React, {Fragment, useContext} from "react";
import {EditorContext} from "@/app/edit/editorContext";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";

function GestaltTopic({editor, topicName, tryViewTopic}: {
    editor: GestaltEditor,
    topicName: string,
    tryViewTopic: () => void
}) {
    return <Fragment>
        <div className={editor.currentTopicAccess?._getTopic()?.name == topicName ? "active" : undefined}
             onClick={tryViewTopic}>
            {topicName}
        </div>
    </Fragment>;
}

function GestaltTopicsList() {
    const editor = useContext(EditorContext);
    const data = editor.gestaltAccess.viewData;

    return <div id="topics-list">
        {
            data.topicNames.map(topicName =>
                <GestaltTopic key={topicName} editor={editor} topicName={topicName} tryViewTopic={() => {
                    const success = editor.tryViewTopic(topicName);
                    if (!success) {
                        alert(`Unable to edit topic ${topicName}.`)
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