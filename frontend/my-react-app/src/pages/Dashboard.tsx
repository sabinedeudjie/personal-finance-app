import React, { useEffect, useState } from "react";
import BalanceCard from "../components/Dashboard/BalanceCard";
import CategoryPieChart from "../components/Dashboard/CategoryPieChart";
import IncomeExpenseChart from "../components/Dashboard/IncomeExpenseChart";
import { useAuth } from "../hooks/useAuth";
import  { getDashboardStats } from "../services/api";

interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyData: {
    month: string;
    income: number;
    expenses: number;
  }[];
  categoryData: {
    category: string;
    amount: number;
    color: string;
  }[];
}

export default function Dashboard() {
  const { user } = useAuth() as {user: {name?: string} | null};
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        
      
        setStats({
          totalBalance: response.balance,
          totalIncome: response.income,
          totalExpenses: response.expenses,
          monthlyData: [
            { month: "Jan", income: 4200, expenses: 3100 },
            { month: "Fév", income: 3800, expenses: 2900 },
            { month: "Mar", income: 5100, expenses: 3800 },
            { month: "Avr", income: 4600, expenses: 3400 },
            { month: "Mai", income: 5200, expenses: 3900 },
            { month: "Juin", income: 4800, expenses: 3500 },
            { month: "Juil", income: 5500, expenses: 4200 },
            { month: "Août", income: 4900, expenses: 3600 },
            { month: "Sep", income: 5300, expenses: 4000 },
            { month: "Oct", income: 4700, expenses: 3500 },
            { month: "Nov", income: 5100, expenses: 3800 },
            { month: "Déc", income: 5600, expenses: 4300 }
          ],
          categoryData: [
            { category: "Alimentation", amount: 3200, color: "#6366f1" },
            { category: "Transport", amount: 1800, color: "#8b5cf6" },
            { category: "Logement", amount: 6500, color: "#a78bfa" },
            { category: "Santé", amount: 1200, color: "#c4b5fd" },
            { category: "Loisirs", amount: 2100, color: "#7c3aed" },
            { category: "Autres", amount: 4958, color: "#4f46e5" }
          ]
        });
        
        setError(null);
      } catch (err) {
        // En cas d'erreur de l'API, on affiche les données fictives par défaut
        setStats({
          totalBalance: 12450.75,
          totalIncome: 32209.0,
          totalExpenses: 19758.25,
          monthlyData: [
            { month: "Jan", income: 4200, expenses: 3100 },
            { month: "Fév", income: 3800, expenses: 2900 },
            { month: "Mar", income: 5100, expenses: 3800 },
            { month: "Avr", income: 4600, expenses: 3400 },
            { month: "Mai", income: 5200, expenses: 3900 },
            { month: "Juin", income: 4800, expenses: 3500 },
            { month: "Juil", income: 5500, expenses: 4200 },
            { month: "Août", income: 4900, expenses: 3600 },
            { month: "Sep", income: 5300, expenses: 4000 },
            { month: "Oct", income: 4700, expenses: 3500 },
            { month: "Nov", income: 5100, expenses: 3800 },
            { month: "Déc", income: 5600, expenses: 4300 }
          ],
          categoryData: [
            { category: "Alimentation", amount: 3200, color: "#6366f1" },
            { category: "Transport", amount: 1800, color: "#8b5cf6" },
            { category: "Logement", amount: 6500, color: "#a78bfa" },
            { category: "Santé", amount: 1200, color: "#c4b5fd" },
            { category: "Loisirs", amount: 2100, color: "#7c3aed" },
            { category: "Autres", amount: 4958, color: "#4f46e5" }
          ]
        });
        setError("Impossible de charger les statistiques réelles.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/*Header*/}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">
            Bonjour, <span>{user?.name || "Utilisateur"}</span> 👋
          </p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <BalanceCard
          title="Solde Total"
          amount={stats?.totalBalance || 0}
          trend={+12.5}
          icon="💰"
          variant="balance"
        />
        <BalanceCard
          title="Total Revenus"
          amount={stats?.totalIncome || 0}
          trend={+8.2}
          icon="📈"
          variant="income"
        />
        <BalanceCard
          title="Total Dépenses"
          amount={stats?.totalExpenses || 0}
          trend={-3.1}
          icon="📉"
          variant="expense"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Bar Chart - Revenus vs Dépenses */}
        <div className="chart-card chart-large">
          <div className="chart-card-header">
            <div>
              <h2>Revenus & Dépenses</h2>
              <p>Évolution mensuelle sur 12 mois</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item income-legend">Revenus</span>
              <span className="legend-item expense-legend">Dépenses</span>
            </div>
          </div>
          <IncomeExpenseChart data={stats?.monthlyData || []} />
        </div>

        {/* Pie Chart - Catégories */}
        <div className="chart-card chart-small">
          <div className="chart-card-header">
            <div>
              <h2>Catégories</h2>
              <p>Répartition des dépenses</p>
            </div>
          </div>
          <CategoryPieChart data={stats?.categoryData || []} />
        </div>
      </div>
    </div>
  );
}
