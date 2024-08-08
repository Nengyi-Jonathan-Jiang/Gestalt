import "./mathItem"
import "./paragraphItem"
import {Item} from "@/gestalt/item";
import {MathItem} from "@/gestalt/items/mathItem";
import {ParagraphItem} from "@/gestalt/items/paragraphItem";

export function registerItemTypes() {
    Item.registerContentItemType(ParagraphItem, "Paragraph", source => new ParagraphItem(source));
    Item.registerContentItemType(MathItem, "Math", source => new MathItem(source));
}