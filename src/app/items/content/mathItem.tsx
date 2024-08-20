import type {ReactElement} from "react";
import {DisplayMathTex} from "@/tex/Tex";
import {BasicContentItem} from "@/app/items/basicContentItem";

import "./mathItem.css"

export class MathItem extends BasicContentItem {
    public render(): ReactElement {
        return <div className="math-item">
            <DisplayMathTex>{this.state}</DisplayMathTex>
        </div>
    }
}