import { CellStateType } from "src/typings/cell";

export class Cell {
    private _state: CellStateType = "healthy";
    private _stateLifetime: number = 0;

    constructor (state: CellStateType = "healthy", stateLifetime: number = 0) {
        this._state = state;
        this._stateLifetime = stateLifetime;
    }

    public get state(): CellStateType {
        return this._state;
    }

    public get stateLifetime(): number {
        return this._stateLifetime;
    }

    public infect(): boolean {
        if (this._state !== "healthy") {
            return false;
        }

        this._state = "infected";
        this._stateLifetime = 0;
        return true;
    }

    public immunize(): boolean {
        if (this._state !== "infected") {
            return false;
        }

        this._state = "immune";
        this._stateLifetime = 0;
        return true;
    }

    public recover(): boolean {
        if (this._state !== "immune") {
            return false;
        }

        this._state = "healthy";
        this._stateLifetime = 0;
        return true;
    }

    public reset(): void {
        this._state = "healthy";
        this._stateLifetime = 0;
    }

    public incrementLifeTime(): void {
        this._stateLifetime++;
    }

    public copy(): Cell {
        return new Cell(this._state, this._stateLifetime);
    }
}