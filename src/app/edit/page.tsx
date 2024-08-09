"use client"

import React, {useEffect, useState} from "react";
import "./style.css"
import {PrivateGestaltAccess} from "@/gestalt/editor/implementations/private/privateGestaltAccess";
import {Gestalt} from "@/gestalt/gestalt";
import {EditorContext} from "@/app/edit/editorContext";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import {useManualRerender} from "@/utils/util";
import {SelectedTopicViewer} from "@/app/edit/components/selectedTopicViewer";
import {GestaltView} from "@/app/edit/components/gestaltViewer";
import {registerItemTypes} from "@/app/items/allItems";

function EditorMiddle() {
    return <div id='editor-middle'></div>;
}

export default function GestaltEditorPage() {
    const rerender = useManualRerender();

    const [editor] = useState(() => {
        const gestalt = new Gestalt("Main", []);
        const editorAccess: GestaltAccess = new PrivateGestaltAccess(gestalt);
        return new GestaltEditor(editorAccess);
    });

    // Load the data from storage.
    useEffect(() => {
        // Hacky get the gestalt
        let gestalt = (editor.gestaltAccess as PrivateGestaltAccess)["gestalt"];
        // Try to load from localstorage; otherwise, make empty
        try {
            gestalt.fromJSON(JSON.parse(window.localStorage.getItem("gestalt:Main") ?? ""));
        } catch (e) {
            console.warn(`Error loading from store`);
            console.warn(e);
            gestalt.fromJSON({nextTopicID: 0, name: "Main", topics: []});
        }
        // Manually rerender the component -- (the state has changed)
        rerender();
    }, []);

    return (
        <main>
            <EditorContext.Provider value={editor}>
                <GestaltView/>
                <EditorMiddle/>
                <SelectedTopicViewer/>
            </EditorContext.Provider>
        </main>
    );
}

registerItemTypes();