import {ReactElement} from "react";
import {DisplayMathTex} from "@/tex/Tex";
import {ContentItem} from "@/gestalt/contentItem";

export class MathItem extends ContentItem {
    public render(): ReactElement {
        return <div className="math-item">
            <DisplayMathTex>{this.value}</DisplayMathTex>
        </div>
    }
}