import {TopicAccess} from "@/gestalt/editor/topicAccess";
import {GestaltViewData} from "@/gestalt/editor/gestaltViewData";
import {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import {Gestalt} from "@/gestalt/gestalt";
import {PrivateSharedTopicAccess} from "@/gestalt/editor/implementations/private/privateSharedTopicAccess";
import {NameItem} from "@/app/items/property/nameItem";
import {compressToBase64, compressToUTF16} from 'lz-string'

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

    async deleteTopic(topicAccess: TopicAccess): Promise<boolean> {
        const success = this.gestalt.deleteTopic(topicAccess._getTopic().getMetadata(NameItem).state);
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

        window.localStorage.setItem('lz-' + saveKey, compressToUTF16(saveString));
    }

    disconnect(): void {
        // Do nothing
    }
}