import { CellStateType } from "src/typings/cell";

export class Cell {
    private _state: CellStateType = "healthy";

    public get state(): CellStateType {
        return this._state;
    }

    public infect(): boolean {
        if (this._state !== "healthy") {
            return false;
        }

        this._state = "infected";
        return true;
    }

    public immunize(): boolean {
        if (this._state !== "infected") {
            return false;
        }

        this._state = "immune";
        return true;
    }

    public recover(): boolean {
        if (this._state !== "immune") {
            return false;
        }

        this._state = "healthy";
        return true;
    }

    public reset(): void {
        this._state = "healthy";
    }
}