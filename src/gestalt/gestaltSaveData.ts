import {Gestalt} from "@/gestalt/gestalt";

// TODO: implement this class

export class GestaltSaveData {
    private readonly _saveString: string;

    constructor(_editorData: Gestalt) {
        this._saveString = JSON.stringify(_editorData.toJSON(), null, 2);
    }

    public string(): string {
        return this._saveString;
    }

    public toGestalt(): Gestalt {
        return Gestalt.prototype.fromJSON(JSON.parse(this._saveString));
    }
}