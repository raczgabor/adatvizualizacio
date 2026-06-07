import { DATA_URL, baseConfig } from "./shared.js";

export const educationIndustryHeatmapSpec = {
  ...baseConfig,
  title: "Véd-e a végzettség az AI-kockázat ellen?",
  height: 300,
  width: "container",
  data: { url: DATA_URL },
  transform: [
    {
      aggregate: [{ op: "mean", field: "Automation Risk (%)", as: "meanRisk" }],
      groupby: ["Industry", "Required Education"],
    },
    {
      joinaggregate: [{ op: "mean", field: "meanRisk", as: "industryMean" }],
      groupby: ["Industry"],
    },
  ],
  layer: [
    // Hőtérkép cellák – szűkített skálán hogy lássuk a különbségeket
    {
      mark: { type: "rect" },
      encoding: {
        x: {
          field: "Industry",
          type: "nominal",
          title: "Iparág",
          sort: { field: "industryMean", order: "descending" },
          axis: {
            labelAngle: -25,
            labelFontSize: 12,
            domainColor: "#e2e8f0",
          },
        },
        y: {
          field: "Required Education",
          type: "ordinal",
          title: "Szükséges végzettség",
          sort: [
            "High School",
            "Associate Degree",
            "Bachelor's Degree",
            "Master's Degree",
            "PhD",
          ],
          axis: { labelFontSize: 12, domainColor: "#e2e8f0" },
        },
        color: {
          field: "meanRisk",
          type: "quantitative",
          title: "Átlagos kockázat (%)",
          // Szűkített domain: csak a tényleges értéktartomány
          scale: {
            scheme: "redyellowgreen",
            reverse: true,
            domain: [45, 55],
          },
          legend: {
            orient: "right",
            title: "Kockázat (%)",
            labelFontSize: 11,
            titleFontSize: 11,
            gradientLength: 120,
          },
        },
        tooltip: [
          { field: "Industry", type: "nominal", title: "Iparág" },
          {
            field: "Required Education",
            type: "ordinal",
            title: "Végzettség",
          },
          {
            field: "meanRisk",
            type: "quantitative",
            title: "Átlagos kockázat (%)",
            format: ".1f",
          },
        ],
      },
    },
    // Értékfeliratok
    {
      mark: { type: "text", fontSize: 12, fontWeight: "bold" },
      encoding: {
        x: {
          field: "Industry",
          type: "nominal",
          sort: { field: "industryMean", order: "descending" },
        },
        y: {
          field: "Required Education",
          type: "ordinal",
          sort: [
            "High School",
            "Associate Degree",
            "Bachelor's Degree",
            "Master's Degree",
            "PhD",
          ],
        },
        text: {
          field: "meanRisk",
          type: "quantitative",
          format: ".1f",
        },
        color: {
          condition: { test: "datum.meanRisk > 52", value: "white" },
          value: "#111827",
        },
      },
    },
  ],
};
