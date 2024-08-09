import {Item} from "@/gestalt/item";
import React, {RefObject, useContext, useState} from "react";
import Modal from "react-modal";
import {EditorContext} from "@/app/edit/editorContext";
import {toArray} from "@/utils/util";
import {ContentItem, ContentItemTypeRegistryEntry} from "@/gestalt/contentItem";

function AddItemButton({contentItemTypeEntry: {constructor, displayName}, closeModal, action}: {
    contentItemTypeEntry: Readonly<ContentItemTypeRegistryEntry>,
    closeModal: () => void,
    action: ((supplier: ((source?: string) => Item)) => void)
}) {
    return <button onClick={async () => {
        closeModal();
        action(constructor);
    }}>{displayName}</button>;
}

function AddItemModal({isOpen, closeModal, addItem}: {
    isOpen: boolean,
    closeModal: () => void,
    addItem: (supplier: () => Item) => Promise<void>
}) {
    const contentItemTypes = toArray(ContentItem.itemTypeRegistry.values());

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

export function ItemInsertLine({before, editorElementRef}: {
    before: Item | null,
    editorElementRef: RefObject<HTMLElement>
}) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const editor = useContext(EditorContext);

    async function addItem(itemSupplier: () => Item) {
        const success = await editor.insertItemBefore(before, itemSupplier);
        if (!success) {
            alert("Error inserting item");
            return;
        }
        editorElementRef.current?.focus()
    }

    return <div className="topic-item-insert-line">
        <InsertItemButton openModal={setOpenModal.bind(null, true)}/>
        <AddItemModal isOpen={openModal} closeModal={() => setOpenModal(false)} addItem={addItem}/>
    </div>;
}