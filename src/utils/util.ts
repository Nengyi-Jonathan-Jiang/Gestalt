/**
 * Represents the type for the constructor for a given type. For example,
 *
 * ```ts
 * class Foo {}
 * class Bar extends Foo {}
 *
 * const a : ConstructorFor<Foo> = Foo;
 * const b : ConstructorFor<Foo> = Bar;
 *
 * const fooA : Foo = new a();
 * const fooB : Foo = new b();
 * ```
 *
 * Note that this does not constrain the parameters to the constructor, which can lead to errors if one is not careful.
 */
export type ConstructorFor<T> = (new(...args: any[]) => T);

/**
 * Creates an array with a specified length and fills it with values.
 * @param length The length of the array to be created
 * @param value If this is a function, it will be with each index in the range [0, length) to populate the array.
 *              Otherwise, the array will be filled with this value.
 */
export function createArray<T>(length: number, value: T | ((index: number) => T)): T[] {
    return typeof value == "function"
        ? new Array(length).fill(null).map((_, i) => (value as (index: number) => T)(i))
        : new Array(length).fill(value);
}

export function toArray<T>(iterable: Iterable<T>) {
    return [...iterable];
}

export function editArray<T>(arr: T[], startInclusive: number, endInclusive: number, value: T | ((value: T, index: number) => T)): void {
    if (typeof value == "function") {
        for (let i = startInclusive; i <= endInclusive; i++) {
            arr[i] = (value as ((value: T, index: number) => T))(arr[i], i);
        }
    }
    else {
        for (let i = startInclusive; i <= endInclusive; i++) {
            arr[i] = value;
        }
    }
}

export function arraysEqual<T>(a: T[], b: T[]) {
    if (a == b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

export function clamp(x: number, min: number, max: number) {
    return x < min ? min : x > max ? max : x;
}

export function getFirstElementFromSet<T>(set: Set<T>) {
    return set[Symbol.iterator]().next().value;
}

