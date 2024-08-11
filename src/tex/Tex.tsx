"use client"

import {createContext, ReactElement, ReactNode, RefObject, useContext, useEffect, useRef} from "react";
import katex from "katex"

export type TexMacros = { [macroName: string]: string }

export interface TexOptions {
    displayMode?: boolean | undefined,
    macros?: TexMacros | undefined
}

/** DO NOT export this; instead, users should use {@link TexMacroProvider} */
const TexMacroContext = createContext<TexMacros>({})

/**
 * Provides the given TeX macros to its descendents, overriding other macros with the same name.
 */
export function TexMacroProvider({macros, children}: { macros: TexMacros, children: ReactNode }) {
    const currentMacros = useContext(TexMacroContext)

    return <TexMacroContext.Provider value={{...currentMacros, ...macros}}> {children} </TexMacroContext.Provider>
}

export function DisplayMathTex({children, ...options}: { children: string } & TexOptions) {
    return <BasicTex {...{...options, displayMode: true}} className='text' createTexContainerElement={
        (ref: RefObject<HTMLDivElement>) => <div className={'tex display math'} ref={ref}/>
    }>{children}</BasicTex>
}

export function MathTex({children, ...options}: { children: string } & TexOptions) {
    return <BasicTex {...options} className='text' createTexContainerElement={
        ref => <span className={'tex math'} ref={ref}/>
    }>
        {children}
    </BasicTex>
}

function BasicTex<T extends ReactElement, U extends HTMLElement>({
                                                                     children: source,
                                                                     createTexContainerElement,
                                                                     className,
                                                                     ...options
                                                                 }: {
    children: string,
    className?: string,
    createTexContainerElement: (ref: RefObject<U>) => T
} & TexOptions) {
    const elRef = useRef<U>(null);
    const macros = {...useContext(TexMacroContext), ...options.macros}

    // Add the '\' to the beginning of each macro
    for (const macro_name of Object.keys(macros)) {
        const macro_value = macros[macro_name]
        delete macros[macro_name];
        macros[`\\${macro_name}`] = macro_value;
    }

    useEffect(() => {
        if (elRef.current) {
            try {
                let modified_source = source;

                modified_source = modified_source.replaceAll(/ {2,}/g, '\\,');
                modified_source = modified_source.replaceAll(/\s*\n\s*\n\s*/g, '\\\\')

                katex.render(modified_source, elRef.current, {
                    ...options,
                    output: "html",
                    macros,
                    strict: false
                })

                delete elRef.current.dataset.error;
            } catch (e) {
                elRef.current.innerText = source
                elRef.current.dataset.error = '';
            }
        }
    }, [source]);

    return createTexContainerElement(elRef)
}