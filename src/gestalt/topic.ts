import {TopicContent} from "@/gestalt/topicContent";
import {JSONifyable} from "@/utils/JSONifyable";
import {Item, ItemJSONData} from "@/gestalt/item";
import {ContentItem} from "@/gestalt/contentItem";
import {NameItem} from "@/gestalt/items/nameItem";

export type TopicJSONData = {
    id: number,
    name: string;
    content: ItemJSONData[]
};

export class Topic implements JSONifyable<TopicJSONData> {
    public nameItem: NameItem = new NameItem("");

    public readonly id: number;

    // TODO: implement later
    // public readonly relatedTopics: [];

    public content: TopicContent;

    constructor(id: number, name: string, content: TopicContent) {
        this.id = id;
        this.name = name;
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
        target.content = new TopicContent(
            ...content.map(i => Item.prototype.fromJSON(i) as ContentItem)
        );

        // @ts-ignore
        return target;
    }

    public get name() {
        return this.nameItem.value;
    }

    public set name(name: string) {
        this.nameItem.value = name;
    }
}