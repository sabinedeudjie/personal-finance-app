import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import BalanceCard from '../components/Dashboard/BalanceCard';
import CategoryPieChart from '../components/Dashboard/CategoryPieChart';
import IncomeExpenseChart from '../components/Dashboard/IncomeExpenseChart';
import { useAuth } from '../hooks/useAuth';
import { useFinance } from '../context/FinanceContext';
import { CHART_CATEGORY_COLORS } from '../theme/colors';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    summary,
    monthlyData,
    categoryBreakdown,
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
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">
            Bonjour, <span>{user?.name || user?.email || 'Utilisateur'}</span>
          </p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {usingLocalStorage && (
        <div className="api-notice">
          Données locales — vos transactions sont sauvegardées sur cet appareil.
        </div>
      )}

      <div className="stats-grid">
        <BalanceCard
          title="Solde total"
          amount={summary.balance}
          trend={trends.balance}
          icon={Wallet}
          variant="balance"
        />
        <BalanceCard
          title="Total revenus"
          amount={summary.income}
          trend={trends.income}
          icon={TrendingUp}
          variant="income"
        />
        <BalanceCard
          title="Total dépenses"
          amount={summary.expense}
          trend={trends.expense}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card chart-large">
          <div className="chart-card-header">
            <div>
              <h2>Revenus et dépenses</h2>
              <p>Évolution mensuelle sur 12 mois</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item income-legend">Revenus</span>
              <span className="legend-item expense-legend">Dépenses</span>
            </div>
          </div>
          <IncomeExpenseChart data={monthlyData} />
        </div>

        <div className="chart-card chart-small">
          <div className="chart-card-header">
            <div>
              <h2>Catégories</h2>
              <p>Répartition des dépenses</p>
            </div>
          </div>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>
    </div>
  );
}
