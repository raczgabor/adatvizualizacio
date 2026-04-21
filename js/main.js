import { industryShiftSpec } from "./charts/industryShift.js";
import { salaryRiskScatterSpec } from "./charts/salaryRiskScatter.js";
import { educationIndustryHeatmapSpec } from "./charts/educationIndustryHeatmap.js";
import { remoteImpactBoxplotSpec } from "./charts/remoteImpactBoxplot.js";
import {
  highRiskRolesSpec,
  lowRiskRolesSpec,
} from "./charts/topBottomRoles.js";

async function waitForVega(maxAttempts = 50, interval = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    if (typeof vegaEmbed === "function") {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error("Vega könyvtár nem érhető el");
}

const chartMap = [
  { selector: "#chart-industry-shift", spec: industryShiftSpec },
  { selector: "#chart-salary-risk", spec: salaryRiskScatterSpec },
  { selector: "#chart-education-heatmap", spec: educationIndustryHeatmapSpec },
  { selector: "#chart-remote-impact", spec: remoteImpactBoxplotSpec },
];

async function renderCharts() {
  for (const chart of chartMap) {
    try {
      const el = document.querySelector(chart.selector);
      const w = el ? el.clientWidth - 40 : 700;
      const spec = { ...chart.spec, width: w };
      await vegaEmbed(chart.selector, spec, {
        actions: false,
        renderer: "canvas",
      });
    } catch (error) {
      const target = document.querySelector(chart.selector);
      if (target) {
        target.innerHTML = `<p style="color:#b91c1c;">Nem sikerült betölteni a grafikont: ${error.message}</p>`;
      }
    }
  }
}
function setupSectionHighlight() {
  const links = Array.from(
    document.querySelectorAll(".nav-link, .nav-track-link"),
  );
  const sectionById = new Map();
  links.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      sectionById.set(`#${target.id}`, target);
    }
  });
  const sections = Array.from(sectionById.values());

  function setActiveLink(activeHash) {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === activeHash;
      link.classList.toggle("is-active", isActive);
    });
  }

  let visibleRatios = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const hash = `#${entry.target.id}`;
        if (entry.isIntersecting) {
          visibleRatios.set(hash, entry.intersectionRatio);
        } else {
          visibleRatios.delete(hash);
        }
      });

      if (visibleRatios.size === 0) return;
      const active = [...visibleRatios.entries()].sort(
        (a, b) => b[1] - a[1],
      )[0][0];
      setActiveLink(active);
    },
    { rootMargin: "-16% 0px -66% 0px", threshold: [0.05, 0.2, 0.4, 0.65, 0.8] },
  );

  sections.forEach((section) => observer.observe(section));

  links.forEach((link) => {
    link.addEventListener("click", () =>
      setActiveLink(link.getAttribute("href")),
    );
  });
}

const { createApp, nextTick } = Vue;

createApp({
  data() {
    return {
      rolesTab: "high",
    };
  },
  methods: {
    async setRolesTab(tabKey) {
      this.rolesTab = tabKey;
      await nextTick();
      await this.renderRoleChart();
    },
    async renderRoleChart() {
      const target = "#chart-top-bottom-single";
      const spec =
        this.rolesTab === "high" ? highRiskRolesSpec : lowRiskRolesSpec;
      try {
        await vegaEmbed(target, spec, { actions: false, renderer: "canvas" });
      } catch (error) {
        const node = document.querySelector(target);
        if (node) {
          node.innerHTML = `<p class="text-red-700 text-sm">Nem sikerült betölteni az ábrát: ${error.message}</p>`;
        }
      }
    },
  },
  async mounted() {
    await waitForVega();
    await renderCharts();
    await this.renderRoleChart();
    setupSectionHighlight();
  },
}).mount("#app");
