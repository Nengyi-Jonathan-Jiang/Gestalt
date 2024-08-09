import "./mathItem"
import "./paragraphItem"
import {Item} from "@/gestalt/item";
import {MathItem} from "@/app/items/mathItem";
import {ParagraphItem} from "@/app/items/paragraphItem";
import {NameItem} from "@/app/items/nameItem";

export function registerItemTypes() {
    Item.registerContentItemType(ParagraphItem, "Paragraph");
    Item.registerContentItemType(MathItem, "Math");
    Item.registerMetadataItemType(NameItem);
}