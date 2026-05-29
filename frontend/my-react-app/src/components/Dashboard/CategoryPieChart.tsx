import React, { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const total = data.reduce((sum, d) => sum + d.amount, 0);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const config : any = {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.category),
        datasets: [
          {
            data: data.map((d) => d.amount),
            backgroundColor: data.map((d) => d.color),
            borderColor: "rgba(15, 15, 30, 0.0)",
            borderWidth: 3,
            hoverOffset: 8,
            
          },
        ],
      },
      options: {
        cutout: 70,
        responsive: true,
        maintainAspectRatio: false,
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
                const value = context.parsed;
                const pct = ((value / total) * 100).toFixed(1);
                return ` ${new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XAF",
                  minimumFractionDigits: 0,
                }).format(value)} (${pct}%)`;
              },
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
    <div className="pie-chart-container">
      <div className="pie-wrapper">
        <canvas ref={canvasRef}></canvas>
        <div className="pie-center">
          <span className="pie-center-label">Total</span>
          <span className="pie-center-value">
            {new Intl.NumberFormat("fr-FR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(total)}
          </span>
        </div>
      </div>
      <div className="pie-legend">
        {data.map((item) => (
          <div key={item.category} className="pie-legend-item">
            <span
              className="pie-legend-dot"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="pie-legend-label">{item.category}</span>
            <span className="pie-legend-pct">
              {((item.amount / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
