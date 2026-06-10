import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useChartTheme } from '../../hooks/useChartTheme';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(value);

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartTheme = useChartTheme();
  const total = useMemo(() => data.reduce((sum, d) => sum + d.amount, 0), [data]);

  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels: data.map((d) => d.category),
      datasets: [
        {
          data: data.map((d) => d.amount),
          backgroundColor: data.map((d) => d.color),
          borderColor: chartTheme.doughnutBorder,
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    }),
    [chartTheme.doughnutBorder, data]
  );

  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...chartTheme.tooltip,
          callbacks: {
            label: (context: TooltipItem<'doughnut'>) => {
              const value = typeof context.parsed === 'number' ? context.parsed : 0;
              const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return ` ${formatCurrency(value)} (${pct}%)`;
            },
          },
        },
      },
    }),
    [chartTheme, total]
  );

  if (data.length === 0) {
    return <p className="chart-empty">Aucune dépense enregistrée.</p>;
  }

  return (
    <div className="pie-chart-container">
      <div className="pie-wrapper">
        <Doughnut data={chartData} options={options} />
        <div className="pie-center">
          <span className="pie-center-label">Total</span>
          <span className="pie-center-value">
            {new Intl.NumberFormat('fr-FR', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(total)}
          </span>
        </div>
      </div>
      <div className="pie-legend">
        {data.map((item) => (
          <div key={item.category} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ backgroundColor: item.color }} />
            <span className="pie-legend-label">{item.category}</span>
            <span className="pie-legend-pct">
              {total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
