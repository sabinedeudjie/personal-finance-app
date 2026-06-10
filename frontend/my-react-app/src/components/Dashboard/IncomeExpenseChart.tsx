import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { C } from '../../theme/colors';
import { useChartTheme } from '../../hooks/useChartTheme';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: MonthlyData[];
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

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const chartTheme = useChartTheme();

  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: 'Revenus',
          data: data.map((d) => d.income),
          backgroundColor: 'rgba(0, 230, 118, 0.85)',
          borderColor: C.green,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Dépenses',
          data: data.map((d) => d.expenses),
          backgroundColor: 'rgba(68, 138, 255, 0.75)',
          borderColor: C.blue,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }),
    [data]
  );

  const options: ChartOptions<'bar'> = useMemo(
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
            label: (context: TooltipItem<'bar'>) => {
              const value = context.parsed.y ?? 0;
              return ` ${context.dataset.label}: ${formatCurrency(value)}`;
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

  return (
    <div className="chart-wrapper">
      <Bar data={chartData} options={options} />
    </div>
  );
}
