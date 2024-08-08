import {ItemWriteAccess} from "@/gestalt/editor/itemAccess/itemWriteAccess";
import {Item} from "@/gestalt/item";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess/gestaltAccess";
import {ReactElement} from "react";
import {ContentItem} from "@/gestalt/contentItem";

export class PrivateItemWriteAccess<T extends Item = Item> implements ItemWriteAccess<T> {
    private readonly item: T;
    private readonly gestaltAccess: GestaltAccess;

    constructor(item: T, gestaltAccess: GestaltAccess) {
        this.item = item;
        this.gestaltAccess = gestaltAccess;
    }

    _getItem(): Readonly<T> {
        return this.item;
    }

    getItemPreview(this: PrivateItemWriteAccess<ContentItem>): ReactElement {
        return this.item.render();
    }

    getSource(): string {
        return this.item.value;
    }

    writeSource(source: string): void {
        this.item.value = source;

        this.gestaltAccess.markChanged();
    }

    public readonly hasWriteAccess: boolean = true;
}