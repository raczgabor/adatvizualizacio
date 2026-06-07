import { DATA_URL, baseConfig } from "./shared.js";

export const remoteImpactBoxplotSpec = {
  ...baseConfig,
  title: "A távmunka-arány alig függ az AI-hatás szintjétől",
  height: 340,
  width: "container",
  data: { url: DATA_URL },
  layer: [
    // Globális átlag referenciavonal
    {
      mark: {
        type: "rule",
        color: "#64748b",
        strokeWidth: 1.5,
        strokeDash: [6, 4],
        opacity: 0.6,
      },
      encoding: {
        y: { datum: 50, type: "quantitative" },
      },
    },
    // "Globális átlag" felirat
    {
      mark: {
        type: "text",
        align: "right",
        fontSize: 11,
        fontStyle: "italic",
        color: "#64748b",
        dy: -8,
      },
      encoding: {
        x: { datum: "High", type: "nominal" },
        y: { datum: 50, type: "quantitative" },
        text: { value: "Globális átlag: 50%" },
      },
    },
    // Boxplot
    {
      mark: {
        type: "boxplot",
        extent: 1.5,
        size: 64,
        median: { color: "white", strokeWidth: 2.5 },
        outliers: { opacity: 0.15, size: 8 },
      },
      encoding: {
        x: {
          field: "AI Impact Level",
          type: "nominal",
          title: "AI-hatás szintje",
          sort: ["Low", "Moderate", "High"],
          axis: {
            labelFontSize: 13,
            labelExpr:
              "datum.value === 'Low' ? 'Alacsony' : datum.value === 'Moderate' ? 'Mérsékelt' : 'Magas'",
            domainColor: "#e2e8f0",
            tickSize: 0,
          },
        },
        y: {
          field: "Remote Work Ratio (%)",
          type: "quantitative",
          title: "Távmunka-arány (%)",
          scale: { domain: [0, 100] },
          axis: {
            labelExpr: "datum.value + '%'",
            gridColor: "#e2e8f0",
            gridDash: [3, 3],
            domainColor: "#e2e8f0",
            labelFontSize: 11,
          },
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
      },
    },
    // Átlag pont (diamond)
    {
      transform: [
        {
          aggregate: [
            { op: "mean", field: "Remote Work Ratio (%)", as: "meanRemote" },
            { op: "count", as: "n" },
          ],
          groupby: ["AI Impact Level"],
        },
        {
          calculate: "format(datum.meanRemote, '.1f') + '%'",
          as: "meanLabel",
        },
      ],
      layer: [
        {
          mark: {
            type: "point",
            shape: "diamond",
            size: 180,
            filled: true,
            color: "#1e293b",
            opacity: 1,
          },
          encoding: {
            x: {
              field: "AI Impact Level",
              type: "nominal",
              sort: ["Low", "Moderate", "High"],
            },
            y: { field: "meanRemote", type: "quantitative" },
          },
        },
        // Átlag felirat a diamond alatt
        {
          mark: {
            type: "text",
            fontSize: 13,
            fontWeight: "bold",
            color: "#1e293b",
            dy: 22,
          },
          encoding: {
            x: {
              field: "AI Impact Level",
              type: "nominal",
              sort: ["Low", "Moderate", "High"],
            },
            y: { field: "meanRemote", type: "quantitative" },
            text: { field: "meanLabel", type: "nominal" },
          },
        },
        // n = felirat fent
        {
          mark: {
            type: "text",
            fontSize: 11,
            color: "#94a3b8",
            dy: -120,
          },
          encoding: {
            x: {
              field: "AI Impact Level",
              type: "nominal",
              sort: ["Low", "Moderate", "High"],
            },
            y: { datum: 100, type: "quantitative" },
            text: {
              field: "n",
              type: "quantitative",
              format: ",",
            },
          },
        },
      ],
    },
  ],
};
