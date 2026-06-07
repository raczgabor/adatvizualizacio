import { DATA_URL, baseConfig } from "./shared.js";

export const industryShiftSpec = {
  ...baseConfig,
  title: "Hol bővül, hol szűkül a munkaerőpiac 2030-ra?",
  height: 340,
  width: "container",
  data: { url: DATA_URL },
  transform: [
    { filter: "datum['Industry'] != null && datum['Industry'] !== ''" },
    {
      aggregate: [
        { op: "mean", field: "Job Openings (2024)", as: "openings2024" },
        { op: "mean", field: "Projected Openings (2030)", as: "openings2030" },
      ],
      groupby: ["Industry"],
    },
    {
      calculate:
        "(datum.openings2030 - datum.openings2024) / datum.openings2024 * 100",
      as: "deltaPercent",
    },
    {
      calculate: "datum.deltaPercent >= 0 ? 'Bővülő' : 'Szűkülő'",
      as: "trend",
    },
    {
      calculate:
        "(datum.deltaPercent >= 0 ? '+' : '') + format(datum.deltaPercent, '.1f') + '%'",
      as: "deltaLabel",
    },
    {
      window: [{ op: "rank", as: "sortRank" }],
      sort: [{ field: "deltaPercent", order: "descending" }],
    },
    {
      calculate:
        "datum.deltaPercent >= 0 ? datum.deltaPercent + 0.18 : datum.deltaPercent - 0.18",
      as: "labelX",
    },
  ],
  layer: [
    // Középvonal (0%)
    {
      mark: { type: "rule", color: "#64748b", strokeWidth: 1, opacity: 0.4 },
      encoding: {
        x: { datum: 0, type: "quantitative" },
      },
    },
    // Sávok
    {
      mark: { type: "bar", cornerRadiusEnd: 4, height: { band: 0.55 } },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "sortRank", order: "ascending" },
          title: null,
          axis: {
            labelFontSize: 13,
            labelFont: "inherit",
            labelColor: "#1e293b",
            labelPadding: 8,
            labelLimit: 120,
            ticks: false,
            domainColor: "#e2e8f0",
          },
        },
        x: {
          field: "deltaPercent",
          type: "quantitative",
          title: "Változás 2024 → 2030 (%)",
          scale: { domain: [-3.2, 3.2] },
          axis: {
            format: "+.1f",
            labelExpr: "datum.value + '%'",
            gridColor: "#e2e8f0",
            gridDash: [3, 3],
            domainColor: "#e2e8f0",
            labelFontSize: 11,
          },
        },
        color: {
          field: "trend",
          type: "nominal",
          scale: {
            domain: ["Bővülő", "Szűkülő"],
            range: ["#15803d", "#dc2626"],
          },
          legend: {
            title: null,
            orient: "bottom",
            direction: "horizontal",
            labelFontSize: 12,
            symbolSize: 120,
            padding: 8,
          },
        },
        opacity: {
          condition: { test: "datum.deltaPercent === 0", value: 0.3 },
          value: 0.85,
        },
        tooltip: [
          { field: "Industry", type: "nominal", title: "Iparág" },
          {
            field: "openings2024",
            type: "quantitative",
            title: "Átlag 2024",
            format: ",.0f",
          },
          {
            field: "openings2030",
            type: "quantitative",
            title: "Vetítés 2030",
            format: ",.0f",
          },
          {
            field: "deltaPercent",
            type: "quantitative",
            title: "Változás (%)",
            format: "+.1f",
          },
        ],
      },
    },
    // Delta% cimke - sáv végén túl, fehér háttérrel
    {
      mark: {
        type: "text",
        fontSize: 12,
        fontWeight: "bold",
        color: "#1e293b",
        fill: "#1e293b",
        background: "white",
      },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "sortRank", order: "ascending" },
        },
        x: { field: "labelX", type: "quantitative" },
        text: { field: "deltaLabel", type: "nominal" },
        align: {
          condition: { test: "datum.deltaPercent >= 0", value: "left" },
          value: "right",
        },
      },
    },
  ],
};
