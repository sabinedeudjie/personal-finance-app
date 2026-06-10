import React, { useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  type Chart,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { C } from '../../theme/colors';
import { useChartTheme } from '../../hooks/useChartTheme';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController
);

export interface BalanceTrendPoint {
  month: string;
  balance: number;
}

interface SavingsLineChartProps {
  data: BalanceTrendPoint[];
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(value);

const formatCompact = (value: string | number): string =>
  new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(Number(value));

export default function SavingsLineChart({ data }: SavingsLineChartProps) {
  const chartRef = useRef<Chart<'line'> | null>(null);
  const chartTheme = useChartTheme();

  const chartData: ChartData<'line'> = useMemo(
    () => ({
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Solde cumulé',
          data: data.map((d) => d.balance),
          borderColor: C.green,
          backgroundColor: 'rgba(0, 230, 118, 0.15)',
          borderWidth: 2.5,
          pointBackgroundColor: C.green,
          pointBorderColor: chartTheme.doughnutBorder,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [chartTheme.doughnutBorder, data]
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          ...chartTheme.tooltip,
          callbacks: {
            label: (context: TooltipItem<'line'>) => {
              const value = context.parsed.y ?? 0;
              return ` Solde: ${formatCurrency(value)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: chartTheme.tickColor,
            font: { size: 12, family: "'DM Sans', sans-serif" },
          },
        },
        y: {
          grid: { color: chartTheme.gridColor },
          border: { display: false },
          ticks: {
            color: chartTheme.tickColor,
            font: { size: 11, family: "'DM Sans', sans-serif" },
            callback: (value) => formatCompact(value),
          },
        },
      },
    }),
    [chartTheme]
  );

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const { ctx, height } = chart;
    const gradient = ctx.createLinearGradient(0, 0, 0, height || 280);
    gradient.addColorStop(0, chartTheme.lineFillStart);
    gradient.addColorStop(0.55, chartTheme.lineFillMid);
    gradient.addColorStop(1, chartTheme.lineFillEnd);

    const dataset = chart.data.datasets[0];
    if (dataset) {
      dataset.backgroundColor = gradient;
      chart.update('none');
    }
  }, [chartTheme, data]);

  if (data.length === 0) {
    return <p className="chart-empty">Pas de données d&apos;épargne disponibles.</p>;
  }

  return (
    <div className="chart-wrapper chart-wrapper--tall">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
