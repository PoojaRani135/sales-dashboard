// src/components/DataTable.jsx
import React from "react";

/**
 * DataTable props:
 *  - title
 *  - rows (array of objects)
 *  - col1Key, col1Label
 *  - col2Key, col2Label
 *  - renderValue (optional) -> (value, row) => node
 */
export default function DataTable({ title, rows = [], col1Key, col1Label, col2Key, col2Label, renderValue }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">{title}</h3>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>{col1Label}</th>
            <th>{col2Label}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((r) => (
            <tr key={r[col1Key]}>
              <td>{r[col1Key]}</td>
              <td>{renderValue ? renderValue(r[col2Key], r) : r[col2Key]}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="2" className="muted">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
