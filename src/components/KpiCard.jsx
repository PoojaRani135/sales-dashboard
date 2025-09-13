// src/components/KpiCard.jsx
import React from "react";

export default function KpiCard({ title, value, hint }) {
  return (
    <div className="card kpi-card">
      <div className="kpi-top">
        <p className="kpi-title">{title}</p>
        <p className="kpi-value">{value}</p>
      </div>
      {hint && <p className="kpi-hint">{hint}</p>}
    </div>
  );
}
