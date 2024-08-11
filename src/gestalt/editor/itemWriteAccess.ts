import type {ReactElement} from "react";
import type {Item} from "@/gestalt/item/item";

export interface ItemWriteAccess<ItemType extends Item> {
    getItemPreview(): ReactElement;

    getSource(): string;

    writeSource(source: string): void;

    /** This method should only be used to provide true readonly access to the item */
    _getItem(): Readonly<ItemType>;
}