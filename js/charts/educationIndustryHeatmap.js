import { DATA_URL, baseConfig } from "./shared.js";

export const educationIndustryHeatmapSpec = {
  ...baseConfig,
  title: "Véd-e a végzettség az AI-kockázat ellen?",
  height: 300,
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
    {
      mark: { type: "rect" },
      encoding: {
        x: {
          field: "Industry",
          type: "nominal",
          title: "Iparág",
          sort: { field: "industryMean", order: "descending" },
          axis: { labelAngle: -25 },
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
        },
        color: {
          field: "meanRisk",
          type: "quantitative",
          title: "Átlagos kockázat (%)",
          scale: { scheme: "redyellowgreen", reverse: true, domain: [0, 100] },
          legend: { orient: "right" },
        },
        tooltip: [
          { field: "Industry", type: "nominal", title: "Iparág" },
          { field: "Required Education", type: "ordinal", title: "Végzettség" },
          {
            field: "meanRisk",
            type: "quantitative",
            title: "Átlagos kockázat (%)",
            format: ".1f",
          },
        ],
      },
    },
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
          format: ".0f",
        },
        color: {
          condition: { test: "datum.meanRisk > 55", value: "white" },
          value: "#111827",
        },
      },
    },
  ],
};
