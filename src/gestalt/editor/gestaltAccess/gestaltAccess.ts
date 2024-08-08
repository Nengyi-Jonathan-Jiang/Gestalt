import {TopicAccess} from "@/gestalt/editor/topicAccess/topicAccess";
import {GestaltViewData} from "@/gestalt/editor/gestaltViewData";

export interface GestaltAccess {
    /**
     * A list of all the topics in the Gestalt.
     */
    readonly viewData: GestaltViewData;

    /**
     * Creates a topic with the given name and parent topics
     *
     * @returns Elevated access to the topic created, or null if the topic could not be created
     */
    addTopic(name: string, ...parentTopics: string[]): Promise<TopicAccess | null>;

    /**
     * Deletes the topic with the given name
     *
     * @returns Whether the topic was successfully deleted.
     */
    deleteTopic(topic: TopicAccess): Promise<boolean>;

    /**
     * Request shared access to a topic. This also allows a user to edit topic data that do not require
     * unique write access and prevents other users from deleting the topic.
     *
     * @returns Shared access to the topic created, or null if access could not be obtained
     */
    requestSharedTopicAccess(name: string): Promise<TopicAccess | null>;

    /**
     * Return shared access to a topic.
     */
    returnSharedTopicAccess(sharedTopicAccess: TopicAccess): void;

    /**
     * Indicate that an edit has been made
     */
    markChanged(): void;

    /**
     * Stop editing the Gestalt
     */
    disconnect(): void;
}