import {Fragment, ReactElement} from "react";
import {MathTex} from "@/tex/Tex";
import {ContentItem} from "@/gestalt/contentItem";

export class ParagraphItem extends ContentItem {
    public render(): ReactElement {
        // TODO: add TEX functionality

        // Process source
        const source_parts: string[] = this.value.split(/(?<!\\)(?:\$\{|}\$)/g);
        const preview_parts: ReactElement[] = source_parts.map((s, i) =>
            <Fragment key={i}>
                {i % 2 == 0 ? s : <MathTex>{s}</MathTex>}
            </Fragment>
        )

        return <p className="paragraph-item">{preview_parts}</p>
    }
}