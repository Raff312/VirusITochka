import { IChart, IChartConfig } from "src/models/chart";
import { CellStateType } from "src/typings/cell";

export function getChartInfo(type: CellStateType, data: IChart): IChartConfig {
    const labels = data.dataTime;
    switch (type) {
        case "healthy":
            return {
                labels: labels,
                datasets: [
                    {
                        label: "Здоровые",
                        data: data.dataHealthy,
                        fill: false,
                        borderColor: "#00992b",
                        tension: 0.1,
                        backgroundColor: "#00992b",
                    },
                ],
            };
        case "infected":
            return {
                labels: labels,
                datasets: [
                    {
                        label: "Инфицированные",
                        data: data.dataInfected,
                        fill: false,
                        borderColor: "#c71010",
                        tension: 0.1,
                        backgroundColor: "#c71010",
                    },
                ],
            };
        case "immune":
            return {
                labels: labels,
                datasets: [
                    {
                        label: "Иммунные",
                        data: data.dataImmune,
                        fill: false,
                        borderColor: "#c7c110",
                        tension: 0.1,
                        backgroundColor: "#c7c110",
                    },
                ],
            };
    }
}
