import { DATA_URL, baseConfig } from "./shared.js";

export const salaryRiskScatterSpec = {
  ...baseConfig,
  title: "Magasabb bér ≠ alacsonyabb AI-kockázat",
  height: 380,
  width: "container",
  data: { url: DATA_URL },
  transform: [
    {
      filter:
        "datum['Automation Risk (%)'] != null && datum['Median Salary (USD)'] != null",
    },
    {
      aggregate: [
        { op: "mean", field: "Median Salary (USD)", as: "avgSalary" },
        { op: "mean", field: "Automation Risk (%)", as: "avgRisk" },
        { op: "count", as: "n" },
      ],
      groupby: ["Job Title"],
    },
    { filter: "datum.n >= 10" },
  ],
  layer: [
    // Scatter pontok
    {
      mark: {
        type: "circle",
        opacity: 0.55,
        stroke: "white",
        strokeWidth: 0.5,
      },
      encoding: {
        x: {
          field: "avgRisk",
          type: "quantitative",
          title: "Automatizációs kockázat (%)",
          scale: { domain: [0, 100] },
          axis: {
            labelExpr: "datum.value + '%'",
            gridColor: "#e2e8f0",
            gridDash: [3, 3],
            domainColor: "#e2e8f0",
            labelFontSize: 11,
            tickCount: 10,
          },
        },
        y: {
          field: "avgSalary",
          type: "quantitative",
          title: "Átlagos medián bér (USD)",
          scale: { domain: [30000, 150000] },
          axis: {
            format: "$,.0f",
            gridColor: "#e2e8f0",
            gridDash: [3, 3],
            domainColor: "#e2e8f0",
            labelFontSize: 11,
          },
        },
        color: {
          field: "avgRisk",
          type: "quantitative",
          scale: {
            domain: [0, 50, 100],
            range: ["#15803d", "#eab308", "#dc2626"],
          },
          legend: {
            title: "Kockázat (%)",
            orient: "right",
            labelFontSize: 11,
            titleFontSize: 11,
          },
        },
        size: {
          field: "n",
          type: "quantitative",
          legend: null,
          scale: { range: [40, 300] },
        },
        tooltip: [
          { field: "Job Title", type: "nominal", title: "Munkakör" },
          {
            field: "avgRisk",
            type: "quantitative",
            title: "Kockázat (%)",
            format: ".1f",
          },
          {
            field: "avgSalary",
            type: "quantitative",
            title: "Átlag bér (USD)",
            format: "$,.0f",
          },
        ],
      },
    },
    // Loess trendvonal
    {
      transform: [{ loess: "avgSalary", on: "avgRisk", bandwidth: 0.4 }],
      mark: {
        type: "line",
        color: "#1e293b",
        strokeWidth: 2.5,
        strokeDash: [6, 4],
        opacity: 0.8,
      },
      encoding: {
        x: { field: "avgRisk", type: "quantitative" },
        y: { field: "avgSalary", type: "quantitative" },
      },
    },
    // "Vízszintes = nincs összefüggés" annotáció
    {
      mark: {
        type: "text",
        align: "left",
        fontSize: 11,
        fontStyle: "italic",
        color: "#475569",
        dx: 4,
        dy: -10,
      },
      encoding: {
        x: { datum: 2, type: "quantitative" },
        y: { datum: 148000, type: "quantitative" },
        text: {
          value: "A trendvonal vízszintes → a bér nem függ össze a kockázattal",
        },
      },
    },
  ],
};
