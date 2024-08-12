import React, {MutableRefObject, ReactNode} from "react";

/**
 * Acts like a `MutableRefObject` (but WITHOUT the semantics of {@link useRef}!), except that the
 * `current` value will not be read until render time. This is done by using property accessors: the
 * getter for `current` secretly returns a component that will read the actual value of `current`
 * when it is rendered.
 *
 * To use:
 *
 * ```tsx
 * function Foo() {
 *     const ref = new DeferredComponentRef();
 *
 *     return <Bar>
 *         <Baz deferredComponentRef={ref}/>
 *         <Qux deferredComponentRef={ref}/>
 *         ...
 *         {ref.current}
 *         ...
 *         <Quux note="You should not use the ref after ref.current has been accessed."/>
 *     </Bar>
 * }
 * ```
 *
 * When using a normal ref, `ref.current` would be accessed before `Baz` and `Qux` were rendered (see
 * [the documentation for useRef](https://react.dev/reference/react/useRef#:~:text=during%20rendering)
 * for an explanation).
 */
export class RenderTimeComponentRef implements MutableRefObject<ReactNode> {
    private _current: ReactNode;

    constructor(current?: ReactNode) {
        this._current = current;
    }

    static RenderTimeComponentRef({thiz}: { thiz: RenderTimeComponentRef }) {
        console.log(thiz);
        return thiz._current;
    }

    set current(component: ReactNode) {
        this._current = component;
    }

    get current(): ReactNode {
        return <RenderTimeComponentRef.RenderTimeComponentRef thiz={this}/>
    }
}