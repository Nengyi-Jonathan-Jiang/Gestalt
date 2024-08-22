import {Fragment, ReactNode, type ReactElement} from "react";
import {MathTex} from "@/tex/Tex";
import {BasicContentItem} from "@/app/items/basicContentItem";

import "./paragraphItem.css";

export class ParagraphItem extends BasicContentItem {
    private static actions: Map<RegExp, (el: ReactNode[]) => ReactNode> = new Map;
    public static init_actions() {
        this.actions.set(/\$\{|\}\$/, (el) => {
            if((typeof el[0]) != "string") {
                return el;
            }
            return <MathTex>{el[0] as string}</MathTex>
        });
        this.actions.set(/\*\*/, (el) => {
            return <strong>{el}</strong>
        });
        this.actions.set(/\*/, (el) => {
            return <em>{el}</em>
        });
        this.actions.set(/\$\[|\]\$/, (el) => {
            if((typeof el[0]) != "string") {
                return el[0];
            }
            return <a className="small-link" href={el[0] as string} target="_blank"></a>
        });
    }

    public render(): ReactElement {
        // Add markdown-like bold and italics
        const all_actions = [...ParagraphItem.actions.entries()];
        const full_regex_source = `(?<!\\\\)(?:${
            all_actions.map(([a]) => {
                const sub_regex_source = a.toString()
                const regex_fragment = sub_regex_source.substring(1, sub_regex_source.length - 1);
                return `(${regex_fragment})`;
            }).join('|')
        })`

        const actions : {offset: number, action: number}[] = [];
        let offset_offset = 0;
        const replaced = this.state.replaceAll(new RegExp(full_regex_source, "g"), (match, ...groups) => {
            const offset = groups[all_actions.length];

            let index = 0;
            while(index < all_actions.length) {
                if(groups[index] !== undefined) {
                    break;
                }
                index++;
            }

            actions.push({offset: offset - offset_offset, action: index});
            offset_offset += match.length;

            return '';
        });

        // alert(JSON.stringify(actions));

        const result_stack : ReactNode[][] = [[]];
        const action_stack : {offset: number, action: number}[] = [];

        for(let index = 0; index < replaced.length; index++) {
            const char = replaced[index];
            while(actions.length && actions[0].offset === index) {
                const currentAction = actions.shift() as {offset: number, action: number};

                if(action_stack[action_stack.length - 1]?.action == currentAction.action) {
                    // Apply the action
                    action_stack.pop();
                    const target = result_stack.pop() as ReactNode[];
                    const processed = all_actions[currentAction.action][1](target);
                    result_stack[result_stack.length - 1].push(processed);
                }
                else {
                    result_stack.push([]);
                    action_stack.push(currentAction);
                }
            }
            
            const last_result_entry = result_stack[result_stack.length - 1];
            if(typeof last_result_entry[last_result_entry.length - 1] === "string") {
                last_result_entry[last_result_entry.length - 1] += char;
            }
            else {
                last_result_entry.push(char);
            }
        }
        while(action_stack[action_stack.length - 1]) {
            const action = action_stack.pop() as {offset: number, action: number};
            const target = result_stack.pop() as ReactNode[];
            const processed = all_actions[action.action][1](target);
            result_stack[result_stack.length - 1].push(processed);
        }

        // Process source
        const source_parts: string[] = replaced.split(/(?<!\\)(?:\$\{|}\$)/g);

        const preview_parts: ReactElement[] = source_parts.map((s, i) =>
            <Fragment key={i}>
                {i % 2 == 0 ? s : <MathTex>{s}</MathTex>}
            </Fragment>
        )

        return <p className="paragraph-item">{result_stack[0]}</p>
    }
}

ParagraphItem.init_actions();