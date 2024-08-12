import {DependencyList, MutableRefObject, RefObject, useEffect, useState} from "react";

function createRefList<T>(amount: number): RefObject<T>[] {
    return new Array<null>(amount).fill(null).map(() => ({current: null}))
}

/**
 * Same as {@link React.useRef}, but for an array of refs with the given length. If amount becomes different from the
 * previous amount, this will trigger a re-render and the array will be truncated/grown to the new amount of elements.
 * This will also change the identity of the array (but not the identities of its elements)
 */
export function useRefs<T>(amount: number): ReadonlyArray<MutableRefObject<T | null>> {
    const [refList, setRefList] = useState(() => createRefList<T>(amount));
    const prevAmount = refList.length;

    if (amount < prevAmount) {
        setRefList(refList.splice(amount))
    }
    else if (amount > prevAmount) {
        setRefList([...refList, ...createRefList<T>(amount - prevAmount)]);
    }

    return refList;
}

/**
 * A custom react hook. Returns a function that will force the component to update
 */
export function useManualRerender(): () => void {
    const [dummy, setDummy] = useState(0);
    return () => {
        setDummy(dummy + 1);
    }
}

/**
 * A custom react hook. Equivalent to
 *
 * ``` tsx
 * useEffect(() => {
 *     window.addEventListener(listenerType, listener);
 *
 *     return () => {
 *         window.removeEventListener(listenerType, listener);
 *     }
 * }, dependencies ?? []);
 * ```
 */
export function useListenerOnWindow<K extends keyof WindowEventMap>(
    window: Window,
    listenerType: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    dependencies ?: DependencyList
): void {
    useEffect(() => {
        window.addEventListener(listenerType, listener);

        return () => {
            window.removeEventListener(listenerType, listener);
        }
    }, dependencies ?? []);
}

/**
 * A custom react hook. Equivalent to
 *
 * ```ts
 * useEffect(() => {
 *     element.addEventListener(listenerType, listener);
 *
 *     return () => {
 *         element.removeEventListener(listenerType, listener);
 *     }
 * }, dependencies ?? []);
 * ```
 */
export function useListenerOnHTMLElement<E extends HTMLElement, K extends keyof HTMLElementEventMap>(
    element: RefObject<E>,
    listenerType: K,
    listener: (this: E, ev: HTMLElementEventMap[K]) => any,
    dependencies ?: DependencyList
): void {
    type listener_t = (this: HTMLElement, ev: HTMLElementEventMap[K]) => any;

    useEffect(() => {
        element.current?.addEventListener(listenerType, listener as listener_t);

        return () => {
            element.current?.removeEventListener(listenerType, listener as listener_t);
        }
    }, dependencies ?? []);
}