import { Area } from "./models/area";
import { Cell } from "./models/cell";
import { IChart } from "./models/chart";
import { ICoord } from "./models/coord";
import { MathUtils } from "./utils/math-utils";

export class AreaStateManager {
    public history = new Array<Area>();
    public chartData: IChart = {
        dataTime: [],
        dataHealthy: [],
        dataInfected: [],
        dataImmune: [],
    };

    private readonly area: Area;

    private stateCounter = 0;
    private countOfHealthyCells = 0;

    constructor(area: Area) {
        this.area = area;

        this.saveHistory();
    }

    public get isAreaUnchangeable(): boolean {
        return this.area.size * this.area.size === this.countOfHealthyCells;
    }

    public next(): void {
        this.area.time += 1;
        if (this.stateCounter !== 0 && this.isAreaUnchangeable) {
            return;
        }

        this.countOfHealthyCells = 0;

        if (this.stateCounter === 0) {
            const centerCoord = { i: Math.floor(this.area.size / 2), j: Math.floor(this.area.size / 2) };
            const infectResult = this.area.infectCell(centerCoord);
            if (!infectResult) {
                throw new Error("Unable to infect first cell");
            }
        }

        for (let i = 0; i < this.area.size; i++) {
            for (let j = 0; j < this.area.size; j++) {
                const coord = { i: i, j: j };

                const cell = this.area.getCell(coord);
                if (!cell) {
                    continue;
                }

                switch (cell.state) {
                    case "infected":
                        if (cell.stateLifetime > 0) {
                            this.processInfectedCell(cell, coord);
                        }
                        break;
                    case "immune":
                        this.processImmuneCell(cell, coord);
                        break;
                    case "healthy":
                        this.countOfHealthyCells++;
                        break;
                }

                cell.incrementLifeTime();
            }
        }

        this.stateCounter++;

        this.saveHistory();
    }

    private processInfectedCell(cell: Cell, coord: ICoord): void {
        if (cell.stateLifetime > 5) {
            this.area.immunizeCell(coord);
        } else {
            const healthyNeighborCoords = this.area.getHealthyNeighborCoords(coord);
            const random = MathUtils.generateRandomNumber(0, 1);
            if (healthyNeighborCoords.length > 0 && random === 0) {
                const random = MathUtils.generateRandomNumber(0, healthyNeighborCoords.length - 1);
                this.area.infectCell(healthyNeighborCoords[random]);
            }
        }
    }

    private processImmuneCell(cell: Cell, coord: ICoord): void {
        if (cell.stateLifetime > 3) {
            this.area.recoverCell(coord);
        }
    }

    public reset(): void {
        this.area.resetCells();
        this.area.size = 0;
        this.area.time = 0;
        this.resetHistory();
        this.stateCounter = 0;
    }

    private resetHistory(): void {
        this.history = [];
        this.chartData = {
            dataTime: [],
            dataHealthy: [],
            dataInfected: [],
            dataImmune: [],
        };
        this.saveHistory();
    }

    private saveHistory(): void {
        const area = this.area.copy();
        this._saveChartData(area);
        this.history.push(area);
    }

    private _saveChartData(area: Area) {
        let countHealthy = 0;
        let countInfected = 0;
        let countImmune = 0;
        area.cells.forEach((items) => {
            items.forEach((cell) => {
                switch (cell.state) {
                    case "healthy":
                        countHealthy++;
                        break;
                    case "infected":
                        countInfected++;
                        break;
                    case "immune":
                        countImmune++;
                        break;
                    default:
                        break;
                    }
                },
            );
        });

        this.chartData.dataTime.push(area.time);
        this.chartData.dataHealthy.push(countHealthy);
        this.chartData.dataInfected.push(countInfected);
        this.chartData.dataImmune.push(countImmune);
    }
}