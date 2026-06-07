import { DATA_URL, baseConfig } from "./shared.js";

const baseTransforms = [
  {
    aggregate: [
      { op: "mean", field: "Automation Risk (%)", as: "avgRisk" },
      { op: "mean", field: "Median Salary (USD)", as: "avgSalary" },
      { op: "count", as: "n" },
    ],
    groupby: ["Job Title"],
  },
  { filter: "datum.n >= 20" },
];

const sharedLayer = (isHigh) => [
  // Referenciavonal 50%-nál
  {
    mark: {
      type: "rule",
      color: "#94a3b8",
      strokeWidth: 1.2,
      strokeDash: [5, 4],
      opacity: 0.7,
    },
    encoding: {
      x: { datum: 50, type: "quantitative" },
    },
  },
  // Sávok
  {
    mark: { type: "bar", cornerRadiusEnd: 4, height: { band: 0.6 } },
    encoding: {
      y: {
        field: "Job Title",
        type: "nominal",
        sort: isHigh ? "-x" : "x",
        title: null,
        axis: {
          labelFontSize: 12,
          labelColor: "#1e293b",
          labelPadding: 8,
          labelLimit: 200,
          ticks: false,
          domainColor: "#e2e8f0",
        },
      },
      x: {
        field: "avgRisk",
        type: "quantitative",
        title: "Átlagos automatizációs kockázat (%)",
        scale: { domain: [0, 80] },
        axis: {
          labelExpr: "datum.value + '%'",
          gridColor: "#e2e8f0",
          gridDash: [3, 3],
          domainColor: "#e2e8f0",
          labelFontSize: 11,
          tickCount: 8,
        },
      },
      color: {
        field: "avgRisk",
        type: "quantitative",
        scale: isHigh
          ? { domain: [50, 70], range: ["#fca5a5", "#b91c1c"] }
          : { domain: [30, 50], range: ["#6ee7b7", "#065f46"] },
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
  // % felirat a sáv végén kívül
  {
    transform: [
      {
        calculate: "format(datum.avgRisk, '.1f') + '%'",
        as: "riskLabel",
      },
    ],
    mark: {
      type: "text",
      align: "left",
      dx: 6,
      fontSize: 12,
      fontWeight: "bold",
      color: "#1e293b",
    },
    encoding: {
      y: {
        field: "Job Title",
        type: "nominal",
        sort: isHigh ? "-x" : "x",
      },
      x: { field: "avgRisk", type: "quantitative" },
      text: { field: "riskLabel", type: "nominal" },
    },
  },
];

export const highRiskRolesSpec = {
  ...baseConfig,
  title: {
    text: "Top 10 legkitetettebb munkakör",
    subtitle: "Átlagos automatizációs kockázat – legalább 20 adatpont",
    subtitleColor: "#64748b",
    subtitleFontSize: 11,
    offset: 12,
  },
  height: 320,
  width: "container",
  data: { url: DATA_URL },
  transform: [
    ...baseTransforms,
    {
      window: [{ op: "rank", as: "rank" }],
      sort: [{ field: "avgRisk", order: "descending" }],
    },
    { filter: "datum.rank <= 10" },
    {
      window: [{ op: "rank", as: "sortRank" }],
      sort: [{ field: "avgRisk", order: "descending" }],
    },
  ],
  layer: sharedLayer(true),
};

export const lowRiskRolesSpec = {
  ...baseConfig,
  title: {
    text: "Top 10 legstabilabb munkakör",
    subtitle: "Átlagos automatizációs kockázat – legalább 20 adatpont",
    subtitleColor: "#64748b",
    subtitleFontSize: 11,
    offset: 12,
  },
  height: 320,
  width: "container",
  data: { url: DATA_URL },
  transform: [
    ...baseTransforms,
    {
      window: [{ op: "rank", as: "rank" }],
      sort: [{ field: "avgRisk", order: "ascending" }],
    },
    { filter: "datum.rank <= 10" },
    {
      window: [{ op: "rank", as: "sortRank" }],
      sort: [{ field: "avgRisk", order: "ascending" }],
    },
  ],
  layer: sharedLayer(false),
};
