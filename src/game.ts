import { AreaStateManager } from "./area-state-manager";
import { Area } from "./models/area";

export class Game {
    public timeoutInSec = 0.3;

    private readonly area = new Area(5);
    private readonly areaStateManager = new AreaStateManager(this.area);

    private interval = 0;
    private started = false;
    public gameTickCounter = 0;

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
        this.areaStateManager.next();
        if (this.areaStateManager.isAreaUnchangeable) {
            this.stop();
        }

        this.gameTickCounter++;
    }

    public stop(): void {
        this.stopGameLoop();

        this.started = false;
    }

    private stopGameLoop(): void {
        window.clearInterval(this.interval);
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
}