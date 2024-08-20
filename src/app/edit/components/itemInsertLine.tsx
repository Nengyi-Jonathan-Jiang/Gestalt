import {Item} from "@/gestalt/item/item";
import React, {useContext, useState} from "react";
import Modal from "react-modal";
import {EditorContext} from "@/gestalt/editor/editorContext";
import {ConstructorFor, toArray} from "@/utils/util";
import {ContentItem, ContentItemTypeRegistryEntry} from "@/gestalt/item/contentItem";

import "./itemInsertLine.css";
import {useListenerOnHTMLElement} from "@/utils/react-utils/hooks";

function AddItemButton({contentItemTypeEntry: {constructor, displayName}, closeModal, action}: {
    contentItemTypeEntry: Readonly<ContentItemTypeRegistryEntry>,
    closeModal: () => void,
    action: (supplier: ConstructorFor<Item>) => void
}) {
    return <button onClick={async () => {
        closeModal();
        action(constructor);
    }}>{displayName}</button>;
}

function AddItemModal({isOpen, closeModal, addItem}: {
    isOpen: boolean,
    closeModal: () => void,
    addItem: (supplier: ConstructorFor<Item>) => Promise<void>
}) {
    const contentItemTypes = toArray(ContentItem.itemTypeRegistry.values());

    useListenerOnHTMLElement({current: document as unknown as HTMLElement}, "keypress", e => {
        console.log(isOpen, e.key);
        if (isOpen && e.key === "Escape") {
            closeModal();
        }
    });

    return <Modal isOpen={isOpen} className="topic-item-insert-modal" ariaHideApp={false}>
        <div className="topic-item-insert-modal-body">
            <p>Choose an item type to insert:</p>
            {
                contentItemTypes.map((contentItemTypeEntry) =>
                    <AddItemButton
                        key={contentItemTypeEntry.displayName}
                        contentItemTypeEntry={contentItemTypeEntry}
                        action={addItem}
                        closeModal={closeModal}/>
                )
            }
        </div>
    </Modal>;
}

function InsertItemButton({openModal}: { openModal: () => void }) {
    return <button className="topic-item-insert-button" onClick={openModal}></button>;
}

export function ItemInsertLine({before}: {
    before: Item | null
}) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const editor = useContext(EditorContext);

    async function addItem(constructor: ConstructorFor<Item>) {
        const success = await editor.insertItemBefore(before, constructor);
        if (!success) {
            alert("Error inserting item");
            return;
        }
    }

    return <div className="topic-item-insert-line">
        <InsertItemButton openModal={setOpenModal.bind(null, true)}/>
        <AddItemModal isOpen={openModal} closeModal={setOpenModal.bind(null, false)} addItem={addItem}/>
    </div>;
}