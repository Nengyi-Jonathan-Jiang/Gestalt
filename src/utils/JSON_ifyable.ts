export interface JSON_ifyable<T> {
    toJSON(): T;

    fromJSON(json: T): this;
}

export interface InPlaceJSON_ifyable<T> extends JSON_ifyable<T> {
    updateFromJSON(json: T) : void;
}