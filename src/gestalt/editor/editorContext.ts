import {createContext} from "react";
import {GestaltEditor} from "@/gestalt/editor/gestaltEditor";

export const EditorContext = createContext<GestaltEditor>(null as unknown as GestaltEditor)