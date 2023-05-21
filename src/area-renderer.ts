import { Area } from "./models/area";
import { Cell } from "./models/cell";
import { ICoord } from "./models/coord";

export class AreaRenderer {
    private readonly BORDER_SIZE = 2;

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
        this.cellSize = (this.canvasEl.width - this.BORDER_SIZE) / area.size;

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
        this.ctx.fillRect(
            coord.j * this.cellSize + this.BORDER_SIZE,
            coord.i * this.cellSize + this.BORDER_SIZE,
            this.cellSize - this.BORDER_SIZE,
            this.cellSize - this.BORDER_SIZE
        );
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