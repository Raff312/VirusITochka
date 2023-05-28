const { Chart } = require("chart.js/auto");
import { AreaStateManager } from "./area-state-manager";
import { Area } from "./models/area";
import { IChart } from "./models/chart";
import { AreaRenderer } from "./area-renderer";

export class Game {
    public timeoutInSec = 0.3;

    private readonly areaRenderer = new AreaRenderer();
    private readonly area = new Area(this.areaRenderer, 5, 0);
    private readonly areaStateManager = new AreaStateManager(this.area);

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

    public getSize(): number {
        return this.area.size;
    }

    public showCharts(): void {
        const modal = document.getElementById("chartModal");
        
        this.showChartHealthy()
        modal != null ? modal.style.display = "block" : {};
    }

    public showChartHealthy(): void {
        const chartCanvas =  document.getElementById('chart') as HTMLCanvasElement;
        const ctx = chartCanvas.getContext('2d');
        const chartData = this.areaStateManager.updateChartData();
        const labels = chartData.dataTime;
        const dataHealthy = {
            labels: labels,
            datasets: [{
              label: 'Здоровые',
              data: chartData.dataHealthy,
              fill: false,
              borderColor: '#00992b',
              tension: 0.1,
              backgroundColor: '#00992b',
            }]
          };
        const configDataHealthy = {
            type: 'line',
            data: dataHealthy,
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, configDataHealthy);
    }

    public showChartInfected(): void {
        const chartCanvas =  document.getElementById('chart') as HTMLCanvasElement;
        const ctx = chartCanvas.getContext('2d');
        const chartData = this.areaStateManager.updateChartData();
        const labels = chartData.dataTime;
        const dataInfected = {
            labels: labels,
            datasets: [{
              label: 'Инфецированные',
              data: chartData.dataInfected,
              fill: false,
              borderColor: '#c71010',
              tension: 0.1,
              backgroundColor: '#c71010',
            }]
          };
        const configDataInfected = {
            type: 'line',
            data: dataInfected,
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, configDataInfected);
    }

    public showChartImmune(): void {
        const chartCanvas =  document.getElementById('chart') as HTMLCanvasElement;
        const ctx = chartCanvas.getContext('2d');
        const chartData = this.areaStateManager.updateChartData();
        const labels = chartData.dataTime;
        const dataImmune = {
            labels: labels,
            datasets: [{
              label: 'С иммунитетом',
              data: chartData.dataImmune,
              fill: false,
              borderColor: '#c7c110',
              tension: 0.1,
              backgroundColor: '#c7c110',
            }]
          };
        const configDataImmune = {
            type: 'line',
            data: dataImmune,
        };
        if (this._chart) {
            this._chart.destroy();
        }
        this._chart = new Chart(ctx, configDataImmune);
    }

    public closeCharts(): void {
        const modal = document.getElementById("chartModal");
        modal != null ? modal.style.display = "none" : {};
    }
}