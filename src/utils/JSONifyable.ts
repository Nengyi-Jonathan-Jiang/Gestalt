export interface JSONifyable<T> {
    toJSON(): T;

    fromJSON(json: T): this;
}