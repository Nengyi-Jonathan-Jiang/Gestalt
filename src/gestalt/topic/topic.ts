import {TopicContent} from "@/gestalt/topic/topicContent";
import {JSON_ifyable} from "@/utils/JSON_ifyable";
import {ItemJSONData} from "@/gestalt/item/item";
import {ContentItem} from "@/gestalt/item/contentItem";
import {TopicProperties} from "@/gestalt/topic/topicProperties";
import {PropertyItem} from "@/gestalt/item/propertyItem";
import {ConstructorFor} from "@/utils/util";


export type TopicJSONData = {
    id: number,
    metadata: ItemJSONData[];
    content: ItemJSONData[]
};

export class Topic implements JSON_ifyable<TopicJSONData> {
    public readonly id: number;

    private readonly properties: TopicProperties;
    public readonly content: TopicContent;

    constructor(id: number, content: TopicContent, metadata: TopicProperties) {
        this.id = id;
        this.properties = metadata ?? new TopicProperties;
        this.content = content;
    }

    toJSON(): TopicJSONData {
        return {
            id: this.id,
            metadata: this.properties.toJSON(),
            content: this.content.map(i => i.toJSON())
        }
    }

    fromJSON({id, metadata, content}: TopicJSONData): this {
        const target: Topic = (this === Topic.prototype) ? new Topic(0, new TopicContent(), new TopicProperties()) : this;

        // @ts-ignore
        target['id'] = id;

        target.properties.updateFromJSON(metadata);

        // @ts-ignore
        target['content'] = new TopicContent(
            ...content.map(i => ContentItem.prototype.fromJSON(i) as ContentItem<any>)
        );

        // @ts-ignore
        return target;
    }

    getMetadata<T extends ConstructorFor<PropertyItem>>(metadataItemType: T): InstanceType<T> {
        return this.properties.get(metadataItemType);
    }
}