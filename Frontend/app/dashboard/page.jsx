"use client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import LoadingScreen from "@/components/loading-screen";

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setError("Failed to load dashboard");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return monthLabels.map((m, i) => ({
      month: m,
      revenue: data.monthSeries?.revenue?.[i] || 0,
      expenses: data.monthSeries?.expenses?.[i] || 0
    }));
  }, [data]);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data) return null;

  const { summary, topSpendingCategories } = data;
  const progressPct = Math.min(100, summary.revenueGoalProgressPct || 0);
  const loss = summary.totalExpenses > summary.totalRevenue ? summary.totalExpenses - summary.totalRevenue : 0;

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-bold">Welcome, Muhammad</h1>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-identity-cream/50 rounded-xl shadow-sm border p-4">
        <h2 className="font-semibold mb-2">Revenue vs Expenses</h2>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Revenue" value={`RM ${summary.totalRevenue.toLocaleString()}`}> <TrendBadge positive>{`+${summary.profitMarginPct}%`}</TrendBadge></MetricCard>
        <MetricCard title="Goal" value={`RM ${summary.revenueGoal.toLocaleString()}`}>
          <div className="w-full mt-2">
            <ProgressBar pct={progressPct} />
            <p className="text-xs mt-1 text-muted-foreground">{progressPct}% towards goal</p>
          </div>
        </MetricCard>
        <MetricCard title="Net Burn Rate" value={`RM ${summary.burnRate.toLocaleString()}`}> <TrendBadge negative>{`-${summary.expenseRatioPct}%`}</TrendBadge></MetricCard>
        <MetricCard title="Loss" value={`RM ${loss.toLocaleString()}`}> {loss === 0 ? <TrendBadge positive>0</TrendBadge> : <TrendBadge negative>{`-${((loss / (summary.totalRevenue || 1)) * 100).toFixed(1)}%`}</TrendBadge>} </MetricCard>
      </div>

      {/* Top Spending Category */}
      <div className="bg-identity-cream/50 rounded-xl shadow-sm border p-6">
        <h3 className="font-medium mb-4">Top Spending Category</h3>
        <div className="flex flex-col gap-3">
          {topSpendingCategories && topSpendingCategories.length > 0 ? (
            topSpendingCategories.map((c, i) => (
              <div key={c.category} className="flex items-center gap-3">
                <div className="flex-1 h-5 rounded-full bg-orange-200/60 overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${c.percent}%` }} />
                </div>
                <div className="text-sm whitespace-nowrap">{c.percent}% <span className="text-muted-foreground">{c.category}</span></div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No spending data</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, children }) {
  return (
    <div className="bg-identity-cream/50 rounded-xl shadow-sm border p-5 flex flex-col justify-between min-h-40">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold leading-tight">{value}</p>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function TrendBadge({ children, positive, negative }) {
  const color = positive ? "text-green-600" : negative ? "text-red-600" : "text-muted-foreground";
  return <span className={`flex items-center gap-1 text-sm font-medium ${color}`}>{children}</span>;
}

function ProgressBar({ pct }) {
  return (
    <div className="w-full h-4 bg-neutral-200 rounded-full overflow-hidden">
      <div className="h-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}
