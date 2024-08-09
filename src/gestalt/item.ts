import {JSONifyable} from "@/utils/JSONifyable";
import {ReactElement, RefObject} from "react";
import {ContentItem} from "@/gestalt/contentItem";
import {MetadataItem} from "@/gestalt/metadataItem";

export type ItemJSONData = {
    type: string,
    source: string,
};

export interface ItemEditingModeRenderResult {
    selfRender: ReactElement,
    editorRender: ReactElement
}

export interface ContentItemTypeRegistryEntry {
    cls: typeof ContentItem;
    displayName: string;
    constructor: (source?: string) => ContentItem;
}

export interface MetadataItemTypeRegistryEntry {
    cls: typeof MetadataItem;
    constructor: (source?: string) => MetadataItem;
}

/**
 * This is the base class for all items that can be found in a TopicContent. It should provide a way to display itself
 * through render() and it's only state should be the source string.
 */
export abstract class Item implements JSONifyable<ItemJSONData> {
    public value: string;

    private static id: number = 0;
    public readonly id: number = Item.id++; // This is not state. Used internally to distinguish items

    constructor(value: string) {
        this.value = value;
    }

    toJSON(): ItemJSONData {
        return {
            // @ts-ignore
            type: this.constructor.name as string,
            source: this.value
        };
    }

    fromJSON({type, source}: ItemJSONData): this {
        let constructor = (
            Item.metadataItemTypeRegistry.get(type) ?? Item.contentItemTypeRegistry.get(type)
        )?.constructor;

        if (!constructor) {
            throw new Error(`Unknown item type : ${type}`);
        }

        // @ts-ignore
        return constructor(source);
    }

    private static readonly _contentItemTypeRegistry: Map<string, Readonly<ContentItemTypeRegistryEntry>> = new Map;
    private static readonly _metadataItemTypeRegistry: Map<string, Readonly<MetadataItemTypeRegistryEntry>> = new Map;

    public static registerContentItemType(cls: typeof ContentItem, displayName: string) {
        this._contentItemTypeRegistry.set(cls.name, {
            displayName,
            cls,
            constructor: (source?: string) => {
                // We know that only non-abstract classes may be registered, but typescript doesn't.
                // @ts-ignore
                return new cls(source ?? "");
            }
        });
    }

    public static registerMetadataItemType(cls: typeof MetadataItem) {
        this._metadataItemTypeRegistry.set(cls.name, {
            cls,
            constructor: (source?: string) => {
                // We know that only non-abstract classes may be registered, but typescript doesn't.
                // @ts-ignore
                return new cls(source ?? "");
            }
        });
    }

    public static get contentItemTypeRegistry(): ReadonlyMap<string, Readonly<ContentItemTypeRegistryEntry>> {
        return this._contentItemTypeRegistry;
    }

    public static get metadataItemTypeRegistry(): ReadonlyMap<string, Readonly<MetadataItemTypeRegistryEntry>> {
        return this._metadataItemTypeRegistry;
    }

    public abstract render(): ReactElement;

    public abstract renderEditing(editorElementRef: RefObject<HTMLElement>): ItemEditingModeRenderResult;
}