import {TopicContent} from "@/gestalt/topicContent";
import {JSONifyable} from "@/utils/JSONifyable";
import {ItemJSONData} from "@/gestalt/item";
import {ContentItem} from "@/gestalt/contentItem";
import {NameItem} from "@/app/items/nameItem";
import {TopicMetadata} from "@/gestalt/topicMetadata";

export type TopicJSONData = {
    id: number,
    name: string;
    content: ItemJSONData[]
};

export class Topic implements JSONifyable<TopicJSONData> {
    public readonly id: number;

    public readonly metadata: TopicMetadata;
    public readonly content: TopicContent;

    constructor(id: number, name: string, content: TopicContent, metadata?: TopicMetadata) {
        this.id = id;
        this.metadata = metadata ?? new TopicMetadata;
        this.metadata.update(new NameItem(name));
        this.content = content;
    }

    toJSON(): TopicJSONData {
        return {
            id: this.id,
            name: this.name,
            content: this.content.map(i => i.toJSON())
        }
    }

    fromJSON({id, name, content}: TopicJSONData): this {
        const target: Topic = (this === Topic.prototype) ? new Topic(0, "", new TopicContent()) : this;

        // @ts-ignore
        target['id'] = id;

        target.name = name;

        // @ts-ignore
        target['content'] = new TopicContent(
            ...content.map(i => ContentItem.prototype.fromJSON(i) as ContentItem)
        );

        // @ts-ignore
        return target;
    }

    public get nameItem() {
        return this.metadata.get(NameItem);
    }

    public get name() {
        return this.metadata.get(NameItem).value;
    }

    public set name(name: string) {
        this.metadata.get(NameItem).value = name;
    }
}