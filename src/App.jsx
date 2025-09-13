import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import salesData from "./data/sales.json";
import { fmtMoney } from "./utils/format";
import KpiCard from "./components/KpiCard";
import DataTable from "./components/DataTable";
import "./index.css";

export default function App() {
  const {
    totalRevenue,
    totalTarget,
    targetAchievement,
    revenueGrowthMoM,
    topProducts,
    topCustomers,
    monthsCount,
    monthlySales,
    productShare
  } = useMemo(() => {
    const totalRevenue = salesData.reduce((s, r) => s + (r.revenue || 0), 0);
    const totalTarget = salesData.reduce((s, r) => s + (r.target || 0), 0);
    const targetAchievement = totalTarget ? (totalRevenue / totalTarget) * 100 : 0;

    const monthly = {};
    salesData.forEach(r => {
      const month = r.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { revenue: 0, target: 0 };
      monthly[month].revenue += r.revenue || 0;
      monthly[month].target += r.target || 0;
    });
    const months = Object.entries(monthly).sort(([a],[b]) => a.localeCompare(b));
    let revenueGrowthMoM = 0;
    if (months.length >= 2) {
      const last = months[months.length - 1][1].revenue;
      const prev = months[months.length - 2][1].revenue;
      revenueGrowthMoM = prev ? ((last - prev) / prev) * 100 : 0;
    }

    const monthlySales = months.map(([month, data]) => ({ month, revenue: data.revenue, target: data.target }));

    const prodMap = {};
    const custMap = {};
    salesData.forEach(r => {
      prodMap[r.product] = (prodMap[r.product] || 0) + (r.revenue || 0);
      custMap[r.client] = (custMap[r.client] || 0) + (r.revenue || 0);
    });

    const topProducts = Object.entries(prodMap)
      .map(([Product, Revenue]) => ({ Product, Revenue }))
      .sort((a,b) => b.Revenue - a.Revenue)
      .slice(0,5);

    const topCustomers = Object.entries(custMap)
      .map(([Customer, Revenue]) => ({ Customer, Revenue }))
      .sort((a,b) => b.Revenue - a.Revenue)
      .slice(0,5);

    const productShare = Object.entries(prodMap)
      .map(([name, value]) => ({ name, value }));

    return {
      totalRevenue,
      totalTarget,
      targetAchievement,
      revenueGrowthMoM,
      topProducts,
      topCustomers,
      monthsCount: months.length,
      monthlySales,
      productShare
    };
  }, []);

  const COLORS = ["#0ea5e9", "#14b8a6", "#4f46e5", "#f97316", "#f43f5e"];

  return (
    <div className="app-wrap">
      <header className="header" style={{ textAlign: "center" }}>
        <h1 className="title">Sales & Revenue Dashboard</h1>
        <h2 className="subtitle">Insights for Electronics & Software Products</h2>
      </header>

      <div className="summary">
        <div className="summary-item">
          <span className="summary-value">28</span>
          <span className="summary-label">Records</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">8</span>
          <span className="summary-label">Months</span>
        </div>
      </div>

      <section className="kpi-grid">
        <KpiCard title="Total Revenue" value={fmtMoney(totalRevenue)} hint={`${salesData.length} transactions`} />
        <KpiCard title="Total Target" value={fmtMoney(totalTarget)} />
        <KpiCard title="Target Achievement" value={`${targetAchievement.toFixed(1)}%`} />
        <KpiCard title="Revenue Growth (MoM)" value={`${revenueGrowthMoM >= 0 ? "+" : ""}${revenueGrowthMoM.toFixed(1)}%`} hint={monthsCount >= 2 ? "Last vs previous month" : "Not enough months"} />
      </section>

      <section className="charts">
        <div className="card large">
          <h3 className="card-title">Monthly Sales vs Target</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
              <XAxis dataKey="month" stroke="#f1f5f9" tick={{ fill: "#f1f5f9", fontSize: 12 }} />
              <YAxis stroke="#f1f5f9" tick={{ fill: "#f1f5f9", fontSize: 12 }} />
              <Tooltip formatter={(value) => fmtMoney(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#14b8a6" strokeWidth={2} strokeDasharray="5 5"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card small pie-card">
          <h3 className="card-title">Product Share</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={productShare}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {productShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff"
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="charts">
        <div className="card full-bar">
          <h3 className="card-title">Top 5 Customers by Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={topCustomers}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>
              <XAxis dataKey="Customer" stroke="#f1f5f9" tick={{ fill: "#f1f5f9", fontSize: 12 }} />
              <YAxis stroke="#f1f5f9" tick={{ fill: "#f1f5f9", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", color: "white", borderRadius: "8px" }}
                cursor={{ fill: "white", fillOpacity: 0.1 }} // subtle highlight
              />
              <Bar dataKey="Revenue" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="table-grid">
        <DataTable
          title="Top 5 Products"
          rows={topProducts}
          col1Key="Product"
          col1Label="Product"
          col2Key="Revenue"
          col2Label="Revenue"
          renderValue={(v) => fmtMoney(v)}
        />

        <DataTable
          title="Top 5 Customers"
          rows={topCustomers}
          col1Key="Customer"
          col1Label="Customer"
          col2Key="Revenue"
          col2Label="Revenue"
          renderValue={(v) => fmtMoney(v)}
        />
      </section>
    </div>
  );
}
