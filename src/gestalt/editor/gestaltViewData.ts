import {Gestalt} from "@/gestalt/gestalt";

/**
 * Represents all the data needed to render the Gestalt
 */
export class GestaltViewData {
    public readonly gestaltName: string
    public readonly topicNames: ReadonlyArray<string>

    constructor(gestalt: Gestalt) {
        this.gestaltName = gestalt.name;
        this.topicNames = gestalt.allTopics.map(i => i.name)
    }
}