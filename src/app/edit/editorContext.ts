import {createContext} from "react";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";

// @ts-ignore
export const EditorContext = createContext<GestaltEditor>(null)