import { AreaRenderer } from "./../area-renderer";
import { MathUtils } from "../utils/math-utils";
import { Cell } from "./coord";
import { ICoord } from "./point";

export class Area {
    private static readonly MIN_SIZE = 3;
    private static readonly MAX_SIZE = 111;

    private readonly renderer: AreaRenderer;

    private _size = 3;
    private _cells = new Array<Array<Cell>>();

    constructor(size: number, cells?: Array<Array<Cell>>) {
        this.renderer = new AreaRenderer();

        this.size = size;
        this.initCells(cells);
    }

    private initCells(cells?: Array<Array<Cell>>): void {
        this._cells = new Array<Array<Cell>>();
        for (let i = 0; i < this._size; i++) {
            this._cells.push(new Array<Cell>());
            for (let j = 0; j < this._size; j++) {
                const cell = cells && cells[i][j] ? cells[i][j] : new Cell();
                this._cells[i].push(cell);
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

    public infectCell(coord: ICoord): boolean {
        const cell = this.getCell(coord);
        const succeed = cell?.infect() ?? false;
        this.renderer.renderCell(cell, coord);
        return succeed;
    }

    public immunizeCell(coord: ICoord): boolean {
        const cell = this.getCell(coord);
        const succeed = cell?.immunize() ?? false;
        this.renderer.renderCell(cell, coord);
        return succeed;
    }

    public recoverCell(coord: ICoord): boolean {
        const cell = this.getCell(coord);
        const succeed = cell?.recover() ?? false;
        this.renderer.renderCell(cell, coord);
        return succeed;
    }

    public render(): void {
        this.renderer.render(this);
    }

    public getCell(coord: ICoord): Cell | null {
        const i = MathUtils.minMax(coord.i, 0, this._cells.length);
        const j = MathUtils.minMax(coord.j, 0, this._cells[0].length);

        try {
            return this._cells[i][j];
        } catch {
            return null;
        }
    }

    public getHealthyNeighborCoords(coord: ICoord): Array<ICoord> {
        const result = new Array<ICoord>();

        [
            { i: coord.i, j: coord.j - 1 },
            { i: coord.i - 1, j: coord.j - 1 },
            { i: coord.i - 1, j: coord.j },
            { i: coord.i - 1, j: coord.j + 1 },
            { i: coord.i, j: coord.j + 1 },
            { i: coord.i + 1, j: coord.j + 1 },
            { i: coord.i + 1, j: coord.j },
            { i: coord.i + 1, j: coord.j - 1 }
        ].forEach((coord: ICoord) => {
            try {
                if (this._cells[coord.i][coord.j] && this._cells[coord.i][coord.j].state === "healthy") {
                    result.push(coord);
                }
            } catch {
                // do nothing
            }
        });

        return result;
    }

    public copy(): Area {
        return new Area(this._size, this._cells);
    }
}