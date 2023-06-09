const { Chart } = require("chart.js/auto");
import { AreaStateManager } from "./area-state-manager";
import { Area } from "./models/area";
import { AreaRenderer } from "./area-renderer";
import { CellStateType } from "./typings/cell";
import { getChartInfo } from "./utils/chart-utils";

export class Game {
    private readonly areaRenderer = new AreaRenderer();
    private readonly area = new Area(this.areaRenderer, 5, 0);
    private readonly areaStateManager = new AreaStateManager(this.area);

    public timeoutInSec = 0.3;
    public gameTickCounter = 0;

    private running = false;
    private dateStart = 0;
    private animationRequestId = 0;
    private _chart;

    public init(): void {
        this.area.render();
    }

    public start(): void {
        if (this.running) {
            return;
        }

        this.area.render();
        this.startGameAnimation();

        this.running = true;
    }

    private startGameAnimation(): void {
        this.animationRequestId = window.requestAnimationFrame(this.gameTick);
    }

    private gameTick = (now: number) => {
        if (!this.dateStart || now - this.dateStart >= this.timeoutInSec * 1000) {
            this.dateStart = now;
            this.areaStateManager.next();
            if (this.areaStateManager.isAreaUnchangeable) {
                this.stop();
                this.reset();
            }

            this.gameTickCounter++;
        }

        if (this.running) {
            window.requestAnimationFrame(this.gameTick);
        }
    };

    public stop(): void {
        this.stopGameAnimation();

        this.running = false;
    }

    private stopGameAnimation(): void {
        window.cancelAnimationFrame(this.animationRequestId);
        this.animationRequestId = 0;
    }

    public reset(): void {
        this.areaStateManager.reset();
        this.gameTickCounter = 0;
        this.stop();
    }

    public setSize(size: number): void {
        this.area.size = size;
        this.area.render();
    }

    public setInfectionProbability(value: number): void {
        this.areaStateManager.setInfectionProbability(value);
    }

    public getSize(): number {
        return this.area.size;
    }

    public showChart(type: CellStateType | "spreadRate"): void {
        const chartCanvas =  document.getElementById("chart") as HTMLCanvasElement;
        const ctx = chartCanvas.getContext("2d");
        const chartData = this.areaStateManager.updateChartData();
        const data = getChartInfo(type, chartData);
        const configData = {
            type: "line",
            data: data,
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: type == "spreadRate" ? "Скорость распространения" : "Количество",
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Время",
                        }
                    }
                }
            }
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, configData);
    }
}