import React, { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: MonthlyData[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Revenus",
            data: data.map((d) => d.income),
            backgroundColor: "rgba(99, 102, 241, 0.85)",
            borderColor: "#6366f1",
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Dépenses",
            data: data.map((d) => d.expenses),
            backgroundColor: "rgba(239, 68, 68, 0.75)",
            borderColor: "#ef4444",
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(15, 15, 30, 0.95)",
            titleColor: "#a5b4fc",
            bodyColor: "#e2e8f0",
            borderColor: "rgba(99, 102, 241, 0.3)",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return ` ${context.dataset.label}: ${new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                  minimumFractionDigits: 0,
                }).format(value ?? 0)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: "#94a3b8",
              font: { size: 12, family: "DM Sans" },
            },
          },
          y: {
            grid: {
              color: "rgba(148, 163, 184, 0.08)",
            },
            border: {
              display: false,
              dash: [4, 4],
            },
            ticks: {
              color: "#94a3b8",
              font: { size: 11, family: "DM Sans" },
              callback: (value) =>
                new Intl.NumberFormat("fr-FR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(Number(value)),
            },
          },
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="chart-wrapper">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
