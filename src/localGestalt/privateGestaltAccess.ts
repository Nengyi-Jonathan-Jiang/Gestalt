import type {TopicAccess} from "@/gestalt/editor/topicAccess";
import {GestaltViewData} from "@/gestalt/editor/gestaltViewData";
import type {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import type {Gestalt} from "@/gestalt/gestalt";
import {PrivateSharedTopicAccess} from "@/localGestalt/privateSharedTopicAccess";

export class PrivateGestaltAccess implements GestaltAccess {
    private readonly gestalt: Gestalt;

    constructor(gestalt: Gestalt) {
        this.gestalt = gestalt;
    }

    get viewData(): GestaltViewData {
        return new GestaltViewData(this.gestalt);
    }

    async addTopic(): Promise<TopicAccess | null> {

        const newTopic = this.gestalt.addTopic();

        this.markChanged();

        return new PrivateSharedTopicAccess(newTopic, this);
    }

    async deleteTopic(topicAccess: TopicAccess): Promise<boolean> {
        const success = this.gestalt.deleteTopic(topicAccess._getTopic().id);
        this.markChanged();
        return success;
    }

    async requestSharedTopicAccess(topicID: number): Promise<TopicAccess | null> {
        const topic = this.gestalt.getTopicByID(topicID);
        if (topic == null) {
            return null;
        }
        return new PrivateSharedTopicAccess(topic, this);
    }

    returnSharedTopicAccess(_sharedTopicAccess: TopicAccess): void {
        // Do nothing
    }

    markChanged(): void {
        const saveString = JSON.stringify(this.gestalt.toJSON(), null, 2);
        const saveKey = `gestalt:${this.gestalt.name}`;
        window.localStorage.setItem(saveKey, saveString);
    }

    disconnect(): void {
        // Do nothing
    }
}