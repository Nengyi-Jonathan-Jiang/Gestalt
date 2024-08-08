import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";
import {Item} from "@/gestalt/item";
import React, {RefObject, useContext, useState} from "react";
import Modal from "react-modal";
import {EditorContext} from "@/app/edit/editorContext";

function AddItemModal({isOpen, closeModal, addItem}: {
    isOpen: boolean,
    closeModal: () => void,
    addItem: (supplier: () => Item) => Promise<void>
}) {
    return <Modal isOpen={isOpen} className="topic-item-insert-modal" ariaHideApp={false}>
        <div className="topic-item-insert-modal-body">
            <p>Choose an item type to insert:</p>
            {
                Item.getContentItemTypes().map(({displayName, constructor}) =>
                    <button onClick={async _ => {
                        closeModal();
                        await addItem(() => constructor(""));
                    }} key={displayName}>{displayName}</button>
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