import { Area } from "./models/area";
import { Cell } from "./models/cell";
import { ICoord } from "./models/coord";

export class AreaRenderer {
    private readonly canvasEl: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    private cellSize: number = 100;

    constructor() {
        this.canvasEl = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvasEl.getContext("2d") as CanvasRenderingContext2D;

        if (!this.canvasEl || !this.ctx) {
            throw new Error("Unable to create AreaRenderer");
        }
    }

    public render(area: Area): void {
        this.cellSize = this.canvasEl.width / area.size;

        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

        for (let i = 0; i < area.size; i++) {
            for (let j = 0; j < area.size; j++) {
                const coord = { i: i, j: j };
                this.renderCell(area.getCell(coord), coord);
            }
        }
    }

    public renderCell(cell: Cell | null, coord: ICoord): void {
        if (!cell) {
            return;
        }

        this.ctx.fillStyle = this.getCellColor(cell);

        const x = coord.j * this.cellSize;
        const y = coord.i * this.cellSize;
        const wOffset = x > 0 ? 2 : 4;
        const hOffset = y > 0 ? 2 : 4;
        this.ctx.fillRect(x > 0 ? x : 2, y > 0 ? y : 2, this.cellSize - wOffset, this.cellSize - hOffset);
    }

    private getCellColor(cell: Cell | null): string {
        if (!cell) {
            return "#ffffff";
        }

        switch (cell.state) {
            case "infected":
                return "#c71010";
            case "immune":
                return "#c7c110";
            case "healthy":
                return "#00992b";
            default:
                return "#ffffff";
        }
    }
}