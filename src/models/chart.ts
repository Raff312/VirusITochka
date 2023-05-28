export interface IChart {
  dataTime: number[];
  dataHealthy: number[];
  dataInfected: number[];
  dataImmune: number[];
  dataSpreadRate: number[];
}

export interface IChartConfig {
  labels: number[],
  datasets: [
    {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
      backgroundColor: string;
    }
  ]
}