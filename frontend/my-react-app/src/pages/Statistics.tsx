import React from 'react';
import { BarChart3, PieChart, LineChart } from 'lucide-react';
import ExpenseDoughnutChart from '../components/Statistics/ExpenseDoughnutChart';
import SavingsLineChart from '../components/Statistics/SavingsLineChart';
import BalanceCard from '../components/Dashboard/BalanceCard';
import { useFinance } from '../context/FinanceContext';
import { CHART_CATEGORY_COLORS, C } from '../theme/colors';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Statistics() {
  const {
    summary,
    categoryBreakdown,
    balanceTrend,
    trends,
    loading,
    usingLocalStorage,
  } = useFinance();

  const categoryData = categoryBreakdown.map((item, index) => ({
    category: item.category,
    amount: item.amount,
    color: CHART_CATEGORY_COLORS[index % CHART_CATEGORY_COLORS.length],
  }));

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Statistiques</h1>
          <p className="dashboard-subtitle">Analyse détaillée de vos finances</p>
        </div>
        <div
          className="page-badge"
          style={{
            background: `linear-gradient(135deg, ${C.green}22, ${C.blue}22)`,
            border: `1px solid var(--border)`,
          }}
        >
          <BarChart3 size={14} />
          Année {new Date().getFullYear()}
        </div>
      </div>

      {usingLocalStorage && (
        <div className="api-notice">
          Statistiques calculées à partir de vos transactions locales.
        </div>
      )}

      <div className="stats-grid">
        <BalanceCard
          title="Solde net"
          amount={summary.balance}
          trend={trends.balance}
          icon={Wallet}
          variant="balance"
        />
        <BalanceCard
          title="Revenus"
          amount={summary.income}
          trend={trends.income}
          icon={TrendingUp}
          variant="income"
        />
        <BalanceCard
          title="Dépenses"
          amount={summary.expense}
          trend={trends.expense}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      <div className="charts-grid charts-grid--stats">
        <div className="chart-card chart-large">
          <div className="chart-card-header">
            <div className="chart-card-title-row">
              <div
                className="chart-icon"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.blue})` }}
              >
                <LineChart size={16} color="#050A04" />
              </div>
              <div>
                <h2>Évolution de l&apos;épargne</h2>
                <p>Solde cumulé mois par mois</p>
              </div>
            </div>
          </div>
          <SavingsLineChart data={balanceTrend} />
        </div>

        <div className="chart-card chart-small">
          <div className="chart-card-header">
            <div className="chart-card-title-row">
              <div
                className="chart-icon"
                style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.green})` }}
              >
                <PieChart size={16} color="#050A04" />
              </div>
              <div>
                <h2>Dépenses par catégorie</h2>
                <p>Répartition annuelle</p>
              </div>
            </div>
          </div>
          <ExpenseDoughnutChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
