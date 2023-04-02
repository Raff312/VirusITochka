import { Area } from "./models/area";

export class AreaRenderer {
    private static readonly ID = "area-canvas";

    public render(area: Area): void {
        let currentElement = document.getElementById(AreaRenderer.ID);
        if (!currentElement || !this.isValid(currentElement, area)) {
            currentElement?.remove();
            currentElement = this.createNew(area);

            const main = document.getElementById("main");
            main?.appendChild(currentElement);
        }

        for (let i = 0; i < area.size; i++) {
            for (let j = 0; j < area.size; j++) {
                const cellElement = document.getElementById(`cell-${i}-${j}`);
                if (cellElement) {
                    cellElement.className = `cell ${area.getCell(i, j)?.state ?? ""}`;
                }
            }
        }
    }

    private isValid(currentElement: HTMLElement, area: Area): boolean {
        return currentElement.querySelectorAll("tr").length === area.size;
    }

    private createNew(area: Area): HTMLTableElement {
        const currentAreaElement = document.getElementById(AreaRenderer.ID);
        if (currentAreaElement) {
            currentAreaElement.remove();
        }

        const newAreaElement = document.createElement("table");
        newAreaElement.className = AreaRenderer.ID;
        newAreaElement.id = AreaRenderer.ID;

        for (let i = 0; i < area.size; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < area.size; j++) {
                const column = document.createElement("td");
                column.className = `cell ${area.getCell(i, j)?.state ?? ""}`;
                column.id = `cell-${i}-${j}`;

                row.appendChild(column);
            }

            newAreaElement.appendChild(row);
        }

        return newAreaElement;
    }
}