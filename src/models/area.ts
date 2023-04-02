import { AreaRenderer } from "./../area-renderer";
import { MathUtils } from "../utils/math-utils";
import { Cell } from "./cell";

export class Area {
    private static readonly MIN_SIZE = 3;
    private static readonly MAX_SIZE = 101;

    private readonly renderer: AreaRenderer;

    private _size = 3;
    private _cells = new Array<Array<Cell>>();

    constructor(size: number) {
        this.renderer = new AreaRenderer();

        this.size = size;
        this.initCells();
    }

    private initCells(): void {
        this._cells = new Array<Array<Cell>>();
        for (let i = 0; i < this._size; i++) {
            this._cells.push(new Array<Cell>());
            for (let j = 0; j < this._size; j++) {
                this._cells[i].push(new Cell());
            }
        }
    }

    public get size(): number {
        return this._size;
    }

    public set size(value: number) {
        if (this._size === value) {
            return;
        }

        value = MathUtils.minMax(value, Area.MIN_SIZE, Area.MAX_SIZE);
        this._size = (value & 1) ? value : value - 1;
        this.initCells();
    }

    public resetCells(): void {
        this._cells.forEach(row => {
            row.forEach(cell => cell.reset());
        });
        this.render();
    }

    public infectCell(i: number, j: number): boolean {
        const succeed = this.getCell(i, j)?.infect() ?? false;
        this.render();
        return succeed;
    }

    public immunizeCell(i: number, j: number): boolean {
        const succeed = this.getCell(i, j)?.immunize() ?? false;
        this.render();
        return succeed;
    }

    public recoverCell(i: number, j: number): boolean {
        const succeed = this.getCell(i, j)?.recover() ?? false;
        this.render();
        return succeed;
    }

    public render(): void {
        this.renderer.render(this);
    }

    public getCell(i: number, j: number): Cell | null {
        i = MathUtils.minMax(i, 0, this._cells.length);
        j = MathUtils.minMax(j, 0, this._cells[0].length);

        try {
            return this._cells[i][j];
        } catch {
            return null;
        }
    }
}