import {MathItem} from "@/app/items/mathItem";
import {ParagraphItem} from "@/app/items/paragraphItem";
import {NameItem} from "@/app/items/nameItem";
import {ContentItem} from "@/gestalt/contentItem";
import {MetadataItem} from "@/gestalt/metadataItem";

export function registerItemTypes() {
    ContentItem.registerItemType(ParagraphItem, "Paragraph");
    ContentItem.registerItemType(MathItem, "Math");
    MetadataItem.registerItemType(NameItem);
}