import React from "react";
interface BalanceCardProps {
    title: string;
    amount: number;
    trend: number;
    icon: string;
    variant: "balance" | "income" | "expense";
  }
  
  export default function BalanceCard({
    title,
    amount,
    trend,
    icon,
    variant,
  }: BalanceCardProps) {
    const isPositive = trend >= 0;
  
    const formatAmount = (value: number) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
      }).format(value);
  
    return (
      <div className={`balance-card balance-card--${variant}`}>
        <div className="balance-card-top">
          <div className="balance-card-icon">{icon}</div>
          <div className={`balance-card-trend ${isPositive ? "trend-up" : "trend-down"}`}>
            <span>{isPositive ? "▲" : "▼"}</span>
            {Math.abs(trend)}%
          </div>
        </div>
        <div className="balance-card-amount">{formatAmount(amount)}</div>
        <div className="balance-card-title">{title}</div>
        <div className="balance-card-subtitle">vs mois dernier</div>
        <div className="balance-card-glow"></div>
      </div>
    );
  }
