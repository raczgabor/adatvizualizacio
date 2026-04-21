import { DATA_URL, baseConfig } from "./shared.js";

export const remoteImpactBoxplotSpec = {
  ...baseConfig,
  title: "A távmunka-arány alig függ az AI-hatás szintjétől",
  data: { url: DATA_URL },
  layer: [
    {
      mark: { type: "boxplot", extent: 1.5, size: 52 },
      encoding: {
        x: {
          field: "AI Impact Level",
          type: "nominal",
          title: "AI-hatás szint",
          sort: ["Low", "Moderate", "High"],
          axis: { labelFontSize: 13 },
        },
        y: {
          field: "Remote Work Ratio (%)",
          type: "quantitative",
          title: "Távmunka-arány (%)",
          scale: { domain: [0, 100] },
        },
        color: {
          field: "AI Impact Level",
          type: "nominal",
          legend: null,
          scale: {
            domain: ["Low", "Moderate", "High"],
            range: ["#10b981", "#f59e0b", "#ef4444"],
          },
        },
        tooltip: [
          {
            field: "AI Impact Level",
            type: "nominal",
            title: "AI-hatás szint",
          },
          {
            field: "Remote Work Ratio (%)",
            type: "quantitative",
            title: "Távmunka-arány (%)",
            format: ".1f",
          },
        ],
      },
    },
    {
      transform: [
        {
          aggregate: [
            { op: "mean", field: "Remote Work Ratio (%)", as: "meanRemote" },
            { op: "count", as: "n" },
          ],
          groupby: ["AI Impact Level"],
        },
      ],
      mark: {
        type: "point",
        shape: "diamond",
        size: 150,
        filled: true,
        color: "#1f2937",
        opacity: 1,
      },
      encoding: {
        x: {
          field: "AI Impact Level",
          type: "nominal",
          sort: ["Low", "Moderate", "High"],
        },
        y: { field: "meanRemote", type: "quantitative" },
        tooltip: [
          {
            field: "AI Impact Level",
            type: "nominal",
            title: "AI-hatás szint",
          },
          {
            field: "meanRemote",
            type: "quantitative",
            title: "Átlag (%)",
            format: ".1f",
          },
          { field: "n", type: "quantitative", title: "Rekordok száma" },
        ],
      },
    },
    {
      transform: [
        {
          aggregate: [{ op: "count", as: "n" }],
          groupby: ["AI Impact Level"],
        },
        { calculate: "'n = ' + datum.n", as: "nLabel" },
      ],
      mark: {
        type: "text",
        fontSize: 12,
        fontWeight: "bold",
        color: "#374151",
        dy: 0,
      },
      encoding: {
        x: {
          field: "AI Impact Level",
          type: "nominal",
          sort: ["Low", "Moderate", "High"],
        },
        y: { value: 12 },
        text: { field: "nLabel", type: "nominal" },
      },
    },
  ],
};
