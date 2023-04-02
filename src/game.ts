import { Area } from "./models/area";

export class Game {
    public timeoutInSec = 1;

    private readonly area = new Area(5);

    private interval = 0;
    private i = 0;
    private started = false;

    public init(): void {
        this.area.render();
    }

    public start(): void {
        if (this.started) {
            return;
        }

        this.area.render();
        this.startGameLoop();

        this.started = true;
    }

    private startGameLoop(): void {
        this.gameTick();
        this.interval = window.setInterval(() => this.gameTick(), this.timeoutInSec * 1000);
    }

    private gameTick(): void {
        this.area.infectCell(this.i, this.i);
        this.area.infectCell(-this.i, -this.i);
        this.area.infectCell(-this.i, this.i);
        this.area.infectCell(this.i, -this.i);
        this.i++;
    }

    public stop(): void {
        this.stopGameLoop();
        this.i = 0;

        this.started = false;
    }

    private stopGameLoop(): void {
        window.clearInterval(this.interval);
    }

    public reset(): void {
        this.area.resetCells();
        this.stop();
    }

    public setSize(size: number): void {
        this.area.size = size;
        this.area.render();
    }

    public getSize(): number {
        return this.area.size;
    }
}