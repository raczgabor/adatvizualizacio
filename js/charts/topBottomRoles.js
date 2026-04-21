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

export const highRiskRolesSpec = {
  ...baseConfig,
  title: {
    text: "Top 10 legkitetettebb munkakör (átlag kockázat, n ≥ 20)",
    offset: 16,
  },
  height: 360,
  data: { url: DATA_URL },
  transform: [
    ...baseTransforms,
    {
      window: [{ op: "rank", as: "rank" }],
      sort: [{ field: "avgRisk", order: "descending" }],
    },
    { filter: "datum.rank <= 10" },
  ],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: {
          field: "Job Title",
          type: "nominal",
          sort: "-x",
          title: "Munkakör",
        },
        x: {
          field: "avgRisk",
          type: "quantitative",
          title: "Átlagos automatizációs kockázat (%)",
          scale: { domain: [0, 100] },
        },
        color: {
          field: "avgRisk",
          type: "quantitative",
          scale: { scheme: "reds", domain: [50, 100] },
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
      mark: {
        type: "text",
        align: "left",
        dx: 4,
        fontSize: 12,
        fontWeight: "bold",
        color: "#374151",
      },
      encoding: {
        y: { field: "Job Title", type: "nominal", sort: "-x" },
        x: { field: "avgRisk", type: "quantitative" },
        text: { field: "avgRisk", type: "quantitative", format: ".1f" },
      },
    },
  ],
};

export const lowRiskRolesSpec = {
  ...baseConfig,
  title: {
    text: "Top 10 legstabilabb munkakör (átlag kockázat, n ≥ 20)",
    offset: 16,
  },
  height: 360,
  data: { url: DATA_URL },
  transform: [
    ...baseTransforms,
    {
      window: [{ op: "rank", as: "rank" }],
      sort: [{ field: "avgRisk", order: "ascending" }],
    },
    { filter: "datum.rank <= 10" },
  ],
  layer: [
    {
      mark: { type: "bar", cornerRadiusEnd: 4 },
      encoding: {
        y: {
          field: "Job Title",
          type: "nominal",
          sort: "x",
          title: "Munkakör",
        },
        x: {
          field: "avgRisk",
          type: "quantitative",
          title: "Átlagos automatizációs kockázat (%)",
          scale: { domain: [0, 100] },
        },
        color: {
          field: "avgRisk",
          type: "quantitative",
          scale: { scheme: "greens", reverse: true, domain: [0, 50] },
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
      mark: {
        type: "text",
        align: "left",
        dx: 4,
        fontSize: 12,
        fontWeight: "bold",
        color: "#374151",
      },
      encoding: {
        y: { field: "Job Title", type: "nominal", sort: "x" },
        x: { field: "avgRisk", type: "quantitative" },
        text: { field: "avgRisk", type: "quantitative", format: ".1f" },
      },
    },
  ],
};
