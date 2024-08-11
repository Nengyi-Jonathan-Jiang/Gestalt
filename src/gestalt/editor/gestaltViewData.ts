import {Gestalt} from "@/gestalt/gestalt";
import {Topic} from "@/gestalt/topic/topic";

/**
 * Represents all the data needed to render the Gestalt
 */
export class GestaltViewData {
    public readonly gestaltName: string;
    public readonly topics: ReadonlyArray<Readonly<Topic>>;

    constructor(gestalt: Gestalt) {
        this.gestaltName = gestalt.name;
        this.topics = gestalt.allTopics;
    }
}