import React, {useContext, useState} from "react";
import {NameItem} from "@/app/items/property/nameItem";
import {RenderTimeComponentRef} from "@/utils/react-utils/renderTimeComponentRef";
import {ItemViewer} from "@/app/edit/components/topicViewer/itemViewer";
import {EditorContext} from "@/gestalt/editor/editorContext";
import {Topic} from "@/gestalt/topic/topic";
import Modal from "react-modal";

export function TopicViewTop({itemEditorComponentRef, topic}: {
    itemEditorComponentRef: RenderTimeComponentRef,
    topic: Readonly<Topic>
}) {
    const editor = useContext(EditorContext);

    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);


    return <div id="selected-topic-top">
        <ItemViewer item={topic.getProperty(NameItem)} itemEditorComponentRef={itemEditorComponentRef}/>

        <div id="selected-topic-top-buttons">
            <button className="settings-button" onClick={() => {
                setSettingsModalOpen(true);
            }}/>
        </div>

        <Modal isOpen={isSettingsModalOpen} className="topic-settings-modal modal" ariaHideApp={false}>
            <div className="topic-settings-modal-body modal-body">
                <span>Topic Settings:</span>
            </div>
        </Modal>
    </div>;
}