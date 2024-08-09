import {ReactElement} from "react";
import {DisplayMathTex} from "@/tex/Tex";
import {ContentItem} from "@/gestalt/contentItem";
import {BasicContentItem} from "@/app/items/basicContentItem";

export class MathItem extends BasicContentItem {
    public render(): ReactElement {
        return <div className="math-item">
            <DisplayMathTex>{this.value}</DisplayMathTex>
        </div>
    }
}