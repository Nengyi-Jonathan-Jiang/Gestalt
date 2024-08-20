import {MathItem} from "@/app/items/content/mathItem";
import {ParagraphItem} from "@/app/items/content/paragraphItem";
import {NameItem} from "@/app/items/property/nameItem";
import {ContentItem} from "@/gestalt/item/contentItem";
import {PropertyItem} from "@/gestalt/item/propertyItem";
import {TexMacrosItem} from "@/app/items/property/texMacrosItem";
import {HeadingItem} from "@/app/items/content/headingItem";

export function registerItemTypes() {
    ContentItem.registerItemType(ParagraphItem, "Paragraph");
    ContentItem.registerItemType(MathItem, "Math");
    ContentItem.registerItemType(HeadingItem, "Heading");
    PropertyItem.registerItemType(NameItem);
    PropertyItem.registerItemType(TexMacrosItem);
}