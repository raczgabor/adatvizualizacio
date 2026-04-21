import { DATA_URL, baseConfig } from "./shared.js";

export const industryShiftSpec = {
  ...baseConfig,
  title: "Hol bővül, hol szűkül a munkaerőpiac 2030-ra?",
  height: 320,
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
      window: [{ op: "rank", as: "industryRank" }],
      sort: [{ field: "openings2030", order: "descending" }],
    },
  ],
  layer: [
    {
      mark: { type: "rule", strokeWidth: 2.5, opacity: 0.6 },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "industryRank", order: "ascending" },
          title: "Iparág",
        },
        x: {
          field: "openings2024",
          type: "quantitative",
          title: "Átlagos nyitott pozíciók (mean)",
          axis: { format: ",.0f" },
        },
        x2: { field: "openings2030" },
        color: {
          field: "trend",
          type: "nominal",
          scale: {
            domain: ["Bővülő", "Szűkülő"],
            range: ["#15803d", "#b91c1c"],
          },
          legend: null,
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
    {
      mark: {
        type: "point",
        filled: true,
        size: 90,
        color: "#94a3b8",
        opacity: 1,
      },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "industryRank", order: "ascending" },
        },
        x: { field: "openings2024", type: "quantitative" },
        tooltip: [
          { field: "Industry", type: "nominal", title: "Iparág" },
          {
            field: "openings2024",
            type: "quantitative",
            title: "Átlag 2024",
            format: ",.0f",
          },
        ],
      },
    },
    {
      mark: { type: "point", filled: true, size: 90, opacity: 1 },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "industryRank", order: "ascending" },
        },
        x: { field: "openings2030", type: "quantitative" },
        color: {
          field: "trend",
          type: "nominal",
          scale: {
            domain: ["Bővülő", "Szűkülő"],
            range: ["#15803d", "#b91c1c"],
          },
          legend: null,
        },
        tooltip: [
          { field: "Industry", type: "nominal", title: "Iparág" },
          {
            field: "openings2030",
            type: "quantitative",
            title: "Vetítés 2030",
            format: ",.0f",
          },
        ],
      },
    },
    {
      transform: [
        {
          calculate:
            "(datum.deltaPercent >= 0 ? '+' : '') + format(datum.deltaPercent, '.1f') + '%'",
          as: "deltaLabel",
        },
      ],
      mark: {
        type: "text",
        align: "left",
        dx: 10,
        fontSize: 11,
        fontWeight: "bold",
      },
      encoding: {
        y: {
          field: "Industry",
          type: "nominal",
          sort: { field: "industryRank", order: "ascending" },
        },
        x: { field: "openings2030", type: "quantitative" },
        text: { field: "deltaLabel", type: "nominal" },
        color: {
          field: "trend",
          type: "nominal",
          scale: {
            domain: ["Bővülő", "Szűkülő"],
            range: ["#15803d", "#b91c1c"],
          },
          legend: null,
        },
      },
    },
  ],
};
