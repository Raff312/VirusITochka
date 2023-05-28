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
        dataSpreadRate: [],
    };

    private readonly area: Area;

    private stateCounter = 0;
    private countOfHealthyCells = 0;
    private infectionProbability: number;

    constructor(area: Area, infectionProbability: number = 0.5) {
        this.area = area;
        this.infectionProbability = infectionProbability;

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
            const random = MathUtils.generateRandomNumber(1, 100);
            if ((healthyNeighborCoords.length > 0) && (random <= this.infectionProbability * 100)) {
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

    public setInfectionProbability(value: number): void {
        this.infectionProbability = MathUtils.minMax(value, 0, 1);
    }

    public reset(): void {
        this.area.resetCells();
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
            dataSpreadRate: [],
        };
        this.saveHistory();
    }

    private saveHistory(): void {
        this.history.push(this.area.copy());
    }

    public updateChartData(): IChart {
        const dataTime: number[] = [];
        const dataHealthy: number[] = [];
        const dataInfected: number[] = [];
        const dataImmune: number[] = [];
        const dataSpreadRate: number[] = [];
        let prevInfectedCount = 0;
        
        this.history.forEach(area => {
            let countHealthy = 0;
            let countInfected = 0;
            let countImmune = 0;
            area.cells.forEach(items => {
                items.forEach(cell => {
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
                });
            });
            const spreadRate = countInfected - prevInfectedCount;
            dataTime.push(area.time);
            dataHealthy.push(countHealthy);
            dataInfected.push(countInfected);
            dataImmune.push(countImmune);
            dataSpreadRate.push(spreadRate >= 0 ? spreadRate : 0);
            prevInfectedCount = countInfected;
        });

        return {
            dataTime: dataTime,
            dataHealthy: dataHealthy,
            dataInfected: dataInfected,
            dataImmune: dataImmune,
            dataSpreadRate: dataSpreadRate,
        }
    }
}