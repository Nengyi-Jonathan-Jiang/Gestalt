import {Fragment, useContext} from "react";
import {EditorContext} from "@/gestalt/editor/editorContext";

import "./selectedTopicViewer.css"
import {TexMacroProvider} from "@/tex/Tex";
import {defaultTexMacros} from "@/tex/texDefaultMacros";
import {TexMacrosItem} from "@/app/items/property/texMacrosItem";
import {RenderTimeComponentRef} from "@/utils/react-utils/renderTimeComponentRef";
import {useManualRerender} from "@/utils/react-utils/hooks";
import {TopicViewTop} from "@/app/edit/components/topicViewer/topicViewTop";
import {TopicViewBody} from "@/app/edit/components/topicViewer/topicViewBody";
import {Topic} from "@/gestalt/topic/topic";

function TopicView({topic}: { topic: Readonly<Topic> }) {
    const itemEditorComponentRef = new RenderTimeComponentRef();

    return <div id="selected-topic">
        <TexMacroProvider macros={topic.getProperty(TexMacrosItem).macros}>
            <TopicViewTop topic={topic} itemEditorComponentRef={itemEditorComponentRef}/>
            <TopicViewBody topic={topic} itemEditorComponentRef={itemEditorComponentRef}/>
            {itemEditorComponentRef.current}
        </TexMacroProvider>
    </div>;
}

export function SelectedTopicViewer() {
    const rerender = useManualRerender();
    const editor = useContext(EditorContext);

    editor.useTopicViewUpdateCallback(rerender);

    if (!editor.currentTopic) return <></>;

    return <TexMacroProvider macros={defaultTexMacros}>
        <TopicView topic={editor.currentTopic}/>
    </TexMacroProvider>;
}