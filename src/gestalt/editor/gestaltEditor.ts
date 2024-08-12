import {GestaltAccess} from "@/gestalt/editor/gestaltAccess";
import {TopicAccess} from "@/gestalt/editor/topicAccess";
import {ItemWriteAccess} from "@/gestalt/editor/itemWriteAccess";
import {Item} from "@/gestalt/item/item";
import {Topic} from "@/gestalt/topic/topic";

type UpdateCallback = (() => any);

export class GestaltEditor {
    public readonly gestaltAccess: GestaltAccess;
    public currentTopicAccess: TopicAccess | null = null;
    public currentItemAccess: ItemWriteAccess | null = null;

    public get currentTopic(): Readonly<Topic> | null {
        return this.currentTopicAccess?._getTopic() ?? null;
    }

    public get currentItem(): Item | null {
        return this.currentItemAccess?._getItem() ?? null;
    }

    private gestaltViewUpdateCallback: null | UpdateCallback = null;
    private topicViewUpdateCallback: null | UpdateCallback = null;

    constructor(editor: GestaltAccess) {
        this.gestaltAccess = editor;
    }

    public async tryAddTopic(): Promise<boolean> {
        this.returnTopicAccess();

        const access = await this.gestaltAccess.addTopic();
        if (access == null) {
            return false;
        }

        this.currentTopicAccess = access;

        this.updateGestaltView();
        this.updateTopicView();

        return true;
    }

    public async tryViewTopic(topicID: number): Promise<boolean> {
        if (topicID == this.currentTopic?.id) {
            return false;
        }

        if (!await this.requestSharedTopicAccess(topicID)) {
            return false;
        }

        this.updateGestaltView();
        this.updateTopicView();

        return true;
    }

    public exitTopicView() {
        this.returnTopicAccess();
        this.updateGestaltView();
        this.updateTopicView();
    }

    public setCurrentItemSource(value: string) {
        if (!this.currentItemAccess) {
            throw new Error("Cannot edit item content when no item is selected for writing");
        }

        this.currentItemAccess.writeSource(value);
        this.updateTopicView();
    }

    public async insertItemBefore(before: Item | null, itemSupplier: () => Item): Promise<boolean> {
        const itemWriteAccess = await this.currentTopicAccess?.insertContentItem(before, itemSupplier);

        if (!itemWriteAccess) {
            return false;
        }

        this.currentItemAccess = itemWriteAccess;
        this.updateTopicView();

        return true;
    }

    public async startEditItem(item: Item): Promise<boolean> {
        if (!await this.requestItemAccess(item)) {
            return false;
        }

        this.updateTopicView();

        return true;
    }

    public stopEditItem() {
        this.returnItemAccess();
        this.updateGestaltView();
        this.updateTopicView();
    }

    public async deleteCurrentItem(): Promise<boolean> {
        if (!this.currentTopicAccess || !this.currentItemAccess) {
            return false;
        }

        if (!await this.currentTopicAccess.deleteContentItem(this.currentItemAccess)) {
            return false;
        }

        this.returnItemAccess();

        this.updateTopicView();

        return true;
    }

    public async deleteCurrentTopic(): Promise<boolean> {
        if (!this.currentTopicAccess) {
            return false;
        }

        if (!await this.gestaltAccess.deleteTopic(this.currentTopicAccess)) {
            return false;
        }

        this.returnTopicAccess();

        this.gestaltAccess.markChanged();
        this.updateGestaltView();
        this.updateTopicView();

        return true;
    }

    public useGestaltViewUpdateCallback(callback: UpdateCallback) {
        this.gestaltViewUpdateCallback = callback;
    }

    public useTopicViewUpdateCallback(callback: UpdateCallback) {
        this.topicViewUpdateCallback = callback;
    }

    public updateGestaltView() {
        this.gestaltViewUpdateCallback?.();
    }

    public updateTopicView() {
        this.topicViewUpdateCallback?.();
    }

    private async requestItemAccess(item: Item): Promise<boolean> {
        if (this.currentItem == item) {
            return true;
        }

        if (!this.currentTopicAccess) {
            return false;
        }

        const access = await this.currentTopicAccess.requestItemWriter(item);

        if (access == null) {
            return false;
        }

        this.returnItemAccess();

        this.currentItemAccess = access;

        return true;
    }

    private async requestSharedTopicAccess(topicID: number): Promise<boolean> {
        if (this.currentTopicAccess && this.currentTopicAccess._getTopic().id == topicID) {
            return true;
        }

        const access = await this.gestaltAccess.requestSharedTopicAccess(topicID);

        if (access == null) {
            return false;
        }

        this.returnTopicAccess();

        this.currentTopicAccess = access;

        return true;
    }

    private returnTopicAccess() {
        this.returnItemAccess();

        if (this.currentTopicAccess) {
            this.gestaltAccess.returnSharedTopicAccess(this.currentTopicAccess)
        }
        this.currentTopicAccess = null;
    }

    private returnItemAccess() {
        if (this.currentItemAccess) {
            if (!this.currentTopicAccess) {
                throw new Error(
                    "Expected current topic access to be non-null when current item access is non-null"
                );
            }

            this.currentTopicAccess?.returnItemWriter(this.currentItemAccess as ItemWriteAccess);
        }
        this.currentItemAccess = null;
    }
}