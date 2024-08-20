import {type ReactElement} from "react";
import {BasicContentItem} from "@/app/items/basicContentItem";

import "./headingItem.css"

export class HeadingItem extends BasicContentItem {
    public render(): ReactElement {
        return <h2 className="heading-item">{this.state}</h2>
    }
}