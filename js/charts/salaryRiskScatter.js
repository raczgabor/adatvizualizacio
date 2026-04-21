import { DATA_URL, baseConfig } from "./shared.js";

export const salaryRiskScatterSpec = {
  ...baseConfig,
  title: "Magasabb bér ≠ alacsonyabb AI-kockázat",
  data: { url: DATA_URL },
  transform: [
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
    {
      mark: { type: "circle", opacity: 0.8, stroke: "white", strokeWidth: 0.5 },
      encoding: {
        x: {
          field: "avgRisk",
          type: "quantitative",
          title: "Átlagos automatizációs kockázat (%)",
          scale: { domain: [0, 100] },
        },
        y: {
          field: "avgSalary",
          type: "quantitative",
          title: "Átlagos medián bér (USD)",
          axis: { format: "$,.0f" },
        },
        color: {
          field: "avgRisk",
          type: "quantitative",
          title: "Kockázat (%)",
          scale: { scheme: "redyellowgreen", reverse: true, domain: [0, 100] },
          legend: { orient: "right" },
        },
        size: {
          field: "n",
          type: "quantitative",
          title: "Adatpontok száma",
          scale: { range: [40, 420] },
          legend: null,
        },
        tooltip: [
          { field: "Job Title", type: "nominal", title: "Munkakör" },
          {
            field: "avgRisk",
            type: "quantitative",
            title: "Átlag kockázat (%)",
            format: ".1f",
          },
          {
            field: "avgSalary",
            type: "quantitative",
            title: "Átlag bér (USD)",
            format: "$,.0f",
          },
          { field: "n", type: "quantitative", title: "Adatpontok száma" },
        ],
      },
    },
    {
      transform: [{ loess: "avgSalary", on: "avgRisk", bandwidth: 0.3 }],
      mark: {
        type: "line",
        color: "#1f2937",
        strokeWidth: 2.5,
        strokeDash: [5, 4],
      },
      encoding: {
        x: { field: "avgRisk", type: "quantitative" },
        y: { field: "avgSalary", type: "quantitative" },
      },
    },
  ],
};
