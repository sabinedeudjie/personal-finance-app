import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  title: string;
  amount: number;
  trend?: number | null;
  icon: LucideIcon;
  variant: 'balance' | 'income' | 'expense';
}

export default function BalanceCard({
  title,
  amount,
  trend,
  icon: Icon,
  variant,
}: BalanceCardProps) {
  const showTrend = trend !== null && trend !== undefined;
  const isPositive = showTrend ? trend >= 0 : true;

  const formatAmount = (value: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className={`balance-card balance-card--${variant}`}>
      <div className="balance-card-top">
        <div className="balance-card-icon-wrap">
          <Icon size={20} strokeWidth={2} />
        </div>
        {showTrend && (
          <div className={`balance-card-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="balance-card-amount">{formatAmount(amount)}</div>
      <div className="balance-card-title">{title}</div>
      {showTrend}
      <div className="balance-card-glow" />
    </div>
  );
}
