import {TopicAccess} from "@/gestalt/editor/topicAccess";
import {GestaltViewData} from "@/gestalt/editor/gestaltViewData";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import {Gestalt} from "@/gestalt/gestalt";
import {PrivateSharedTopicAccess} from "@/gestalt/editor/implementations/private/privateSharedTopicAccess";

export class PrivateGestaltAccess implements GestaltAccess {
    private readonly gestalt: Gestalt;

    constructor(gestalt: Gestalt) {
        this.gestalt = gestalt;
    }

    get viewData(): GestaltViewData {
        return new GestaltViewData(this.gestalt);
    }

    async addTopic(name: string, ...parentTopics: string[]): Promise<TopicAccess | null> {

        const newTopic = this.gestalt.addTopic(name, ...parentTopics);

        this.markChanged();

        return new PrivateSharedTopicAccess(newTopic, this);
    }

    async deleteTopic(topic: TopicAccess): Promise<boolean> {
        const success = this.gestalt.deleteTopic(topic._getTopic().name);
        this.markChanged();
        return success;
    }

    async requestSharedTopicAccess(name: string): Promise<TopicAccess | null> {
        const topic = this.gestalt.getTopicByName(name);
        if (topic == null) {
            return null;
        }
        return new PrivateSharedTopicAccess(topic, this);
    }

    returnSharedTopicAccess(_sharedTopicAccess: TopicAccess): void {
        // Do nothing
    }

    markChanged(): void {
        const saveString = this.gestalt.save().string();
        const saveKey = `gestalt:${this.gestalt.name}`;
        window.localStorage.setItem(saveKey, saveString);
    }

    disconnect(): void {
        // Do nothing
    }
}