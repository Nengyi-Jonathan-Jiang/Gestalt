import {Topic, TopicJSONData} from "@/gestalt/topic";
import {TopicContent} from "@/gestalt/topicContent";
import {JSONifyable} from "@/utils/JSONifyable";

type GestaltJSONData = {
    nextTopicID: number,
    name: string,
    topics: TopicJSONData[]
}

export class Gestalt implements JSONifyable<GestaltJSONData> {
    private readonly _allTopics: Map<number, Topic>;
    public name: string;
    public nextTopicID: number = 0;

    constructor(name: string, allTopics: Topic[]) {
        this.name = name;
        this._allTopics = new Map;
        for (const topic of allTopics) {
            this._allTopics.set(topic.id, topic);
        }
    }

    toJSON(): GestaltJSONData {
        return {
            nextTopicID: this.nextTopicID,
            name: this.name,
            topics: this.allTopics.map(i => i.toJSON())
        }
    }

    fromJSON({nextTopicID, name, topics}: GestaltJSONData): this {
        const target: Gestalt = (this === Gestalt.prototype) ? new Gestalt("", []) : this;

        target.nextTopicID = nextTopicID;
        target.name = name;
        target._allTopics.clear();
        for (const topicData of topics) {
            const topic = Topic.prototype.fromJSON(topicData);
            target._allTopics.set(topic.id, topic);
        }

        // @ts-ignore
        return target;
    }

    public get allTopics(): ReadonlyArray<Topic> {
        return [...this._allTopics.values()];
    }

    public getTopicByName(name: string): Topic | null {
        return [...this._allTopics.values()].find(i => i.name === name) ?? null;
    }

    public addTopic(name: string, ...parentTopicNames: string[]): Topic {
        const existingTopic: Topic | null = this.getTopicByName(name);
        if (existingTopic != null) {
            return existingTopic;
        }

        const parentTopics = [];
        for (const name of parentTopicNames) {
            const parentTopic = this.getTopicByName(name);
            if (parentTopic != null) {
                parentTopics.push(parentTopic);
            }
        }

        const topic = new Topic(this.nextTopicID++, name, new TopicContent())
        this._allTopics.set(topic.id, topic);

        return topic
    }

    public deleteTopic(name: string): boolean {
        const topic = this.getTopicByName(name);

        if (topic !== null) {
            this._allTopics.delete(topic.id);
            return true;
        }
        return false;
    }

    hasTopic(topic: Topic): boolean {
        return this._allTopics.has(topic.id);
    }
}