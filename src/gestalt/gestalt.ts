import {Topic, type TopicJSONData} from "@/gestalt/topic/topic";
import {type JSON_ifyable} from "@/utils/JSON_ifyable";

type GestaltJSONData = {
    nextTopicID: number,
    name: string,
    topics: TopicJSONData[]
}

export class Gestalt implements JSON_ifyable<GestaltJSONData> {
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

    public getTopicByID(id: number): Topic | null {
        return this._allTopics.get(id) ?? null;
    }

    public addTopic(): Topic {
        const topic = new Topic(this.nextTopicID++)

        this._allTopics.set(topic.id, topic);

        return topic
    }

    public deleteTopic(id: number): boolean {
        const topic = this.getTopicByID(id);

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