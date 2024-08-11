import {MathItem} from "@/app/items/content/mathItem";
import {ParagraphItem} from "@/app/items/content/paragraphItem";
import {NameItem} from "@/app/items/property/nameItem";
import {ContentItem} from "@/gestalt/item/contentItem";
import {PropertyItem} from "@/gestalt/item/propertyItem";
import {TexMacrosItem} from "@/app/items/property/texMacrosItem";

export function registerItemTypes() {
    ContentItem.registerItemType(ParagraphItem, "Paragraph");
    ContentItem.registerItemType(MathItem, "Math");
    PropertyItem.registerItemType(NameItem);
    PropertyItem.registerItemType(TexMacrosItem);
}