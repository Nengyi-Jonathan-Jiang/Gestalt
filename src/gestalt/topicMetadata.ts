import {MetadataItem} from "@/gestalt/metadataItem";

export class TopicMetadata {
    private readonly metadata: Map<string, MetadataItem> = new Map;

    get<T extends typeof MetadataItem>(type: T): InstanceType<T> {
        const data = this.metadata.get(type.name);

        if (!data) {
            throw new Error(`Could not find data of type ${type.name}`);
        }

        return data as InstanceType<T>;
    }

    update(value: MetadataItem) {
        this.metadata.set(value.constructor.name, value);
    }
}