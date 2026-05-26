import { describe, it, expect } from "vitest";
import {
  SA_STANDARDS,
  GEYSER_REQUIREMENTS,
  SA_INSURANCE_CLAIM_RISKS,
  generateSASystemPromptInjection,
  getSAStandardsForIssue,
  getInsuranceRiskAssessment,
} from "./saStandardsKnowledge";
import {
  SA_MAJOR_SUPPLIERS,
  SA_TRUSTED_BRANDS,
  SA_PRODUCT_RECOMMENDATIONS,
  getSuppliersByRegion,
  getTrustedBrands,
  calculateRegionalCost,
} from "./saSupplierDatabase";
import {
  LOAD_SHEDDING_STAGES,
  SA_SEASONAL_GUIDANCE,
  getLoadShedGuidance,
  getSeasonalGuidance,
} from "./saLoadShedding";
import {
  SA_GUIDANCE_TEMPLATES,
  getGuidanceTemplate,
  formatGuidanceAsText,
} from "./saGuidanceTemplates";

describe("SA Standards Knowledge Base", () => {
  describe("SANS Standards", () => {
    it("should have all major SANS standards defined", () => {
      const standardCodes = SA_STANDARDS.map((s) => s.code);
      expect(standardCodes).toContain("SANS 10254");
      expect(standardCodes).toContain("SANS 10400-P");
      expect(standardCodes).toContain("SANS 10400-W");
      expect(standardCodes).toContain("SANS 10142");
    });

    it("should have key requirements for each standard", () => {
      SA_STANDARDS.forEach((standard) => {
        expect(standard.keyRequirements.length).toBeGreaterThan(0);
        expect(standard.relevantIssues.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("should map issues to relevant standards", () => {
      const geyserStandards = getSAStandardsForIssue("geyser-installation");
      expect(geyserStandards.length).toBeGreaterThan(0);
      expect(geyserStandards.some((s) => s.code === "SANS 10254")).toBe(true);
    });
  });

  describe("Geyser Requirements", () => {
    it("should have all critical geyser requirements", () => {
      const requirementTexts = GEYSER_REQUIREMENTS.map((r) => r.requirement);
      expect(requirementTexts).toContain(
        "Pressure Control Valve (PCV) set to maximum 400kPa"
      );
      expect(requirementTexts).toContain(
        "Vacuum breaker (anti-vacuum valve) mandatory"
      );
      expect(requirementTexts).toContain(
        "Drip tray with external drain"
      );
    });

    it("should have consequences for each requirement", () => {
      GEYSER_REQUIREMENTS.forEach((requirement) => {
        expect(requirement.consequence).toBeTruthy();
        expect(requirement.standard).toBeTruthy();
      });
    });
  });

  describe("Insurance Risk Assessment", () => {
    it("should identify insurance risks", () => {
      const risks = SA_INSURANCE_CLAIM_RISKS;
      expect(risks.length).toBeGreaterThan(0);
      expect(risks.some((r) => r.issue === "No Certificate of Compliance (CoC)")).toBe(
        true
      );
    });

    it("should assess risk for scenarios", () => {
      const assessment = getInsuranceRiskAssessment("No CoC");
      expect(assessment).toContain("CRITICAL");
    });
  });

  describe("System Prompt Injection", () => {
    it("should generate comprehensive SA system prompt", () => {
      const prompt = generateSASystemPromptInjection();
      expect(prompt).toContain("SANS 10254");
      expect(prompt).toContain("South Africa");
      expect(prompt).toContain("load-shedding");
      expect(prompt).toContain("Certificate of Compliance");
    });

    it("should include all critical compliance requirements", () => {
      const prompt = generateSASystemPromptInjection();
      expect(prompt).toContain("400kPa");
      expect(prompt).toContain("Vacuum breaker");
      expect(prompt).toContain("Drip tray");
      expect(prompt).toContain("Legionella");
    });
  });
});

describe("SA Supplier Database", () => {
  describe("Major Suppliers", () => {
    it("should have major SA suppliers defined", () => {
      const supplierNames = SA_MAJOR_SUPPLIERS.map((s) => s.name);
      expect(supplierNames).toContain("Builders Warehouse");
      expect(supplierNames).toContain("Plumblink");
      expect(supplierNames.length).toBeGreaterThan(5);
    });

    it("should have website and region info for each supplier", () => {
      SA_MAJOR_SUPPLIERS.forEach((supplier) => {
        expect(supplier.website).toBeTruthy();
        expect(supplier.regions.length).toBeGreaterThan(0);
        expect(supplier.specialties.length).toBeGreaterThan(0);
      });
    });

    it("should filter suppliers by region", () => {
      const gautengSuppliers = getSuppliersByRegion("Gauteng");
      expect(gautengSuppliers.length).toBeGreaterThan(0);
    });
  });

  describe("Trusted Brands", () => {
    it("should have trusted brands for major categories", () => {
      const geyserBrands = SA_TRUSTED_BRANDS.geysers;
      expect(geyserBrands).toContain("Kwikot (South African brand)");
      expect(geyserBrands.length).toBeGreaterThan(0);
    });

    it("should retrieve brands by category", () => {
      const brands = getTrustedBrands("geysers");
      expect(brands.length).toBeGreaterThan(0);
      expect(brands[0]).toBeTruthy();
    });
  });

  describe("Product Recommendations", () => {
    it("should have SA product recommendations", () => {
      expect(SA_PRODUCT_RECOMMENDATIONS.length).toBeGreaterThan(0);
    });

    it("should have complete product information", () => {
      SA_PRODUCT_RECOMMENDATIONS.forEach((product) => {
        expect(product.name).toBeTruthy();
        expect(product.brand).toBeTruthy();
        expect(product.supplier.length).toBeGreaterThan(0);
        expect(product.priceRange.min).toBeGreaterThanOrEqual(0);
        expect(product.priceRange.max).toBeGreaterThanOrEqual(product.priceRange.min);
        expect(product.saRating).toBeGreaterThan(0);
        expect(product.saRating).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Regional Cost Calculation", () => {
    it("should calculate regional cost adjustments", () => {
      const baseCost = 1000;
      const metroCost = calculateRegionalCost(baseCost, "metro");
      const ruralCost = calculateRegionalCost(baseCost, "rural");

      expect(ruralCost).toBeGreaterThan(metroCost);
    });

    it("should apply emergency multipliers", () => {
      const baseCost = 1000;
      const normalCost = calculateRegionalCost(baseCost, "metro", false, false, false);
      const emergencyCost = calculateRegionalCost(baseCost, "metro", true, false, false);

      expect(emergencyCost).toBeGreaterThan(normalCost);
    });
  });
});

describe("Load-Shedding Context", () => {
  describe("Load-Shedding Stages", () => {
    it("should have all load-shedding stages defined", () => {
      expect(LOAD_SHEDDING_STAGES[0]).toBeDefined();
      expect(LOAD_SHEDDING_STAGES[8]).toBeDefined();
    });

    it("should have impact information for each stage", () => {
      Object.values(LOAD_SHEDDING_STAGES).forEach((stage) => {
        expect(stage.description).toBeTruthy();
        expect(stage.impact.length).toBeGreaterThan(0);
      });
    });

    it("should generate load-shedding guidance", () => {
      const guidance = getLoadShedGuidance(4);
      expect(guidance).toContain("Stage 4");
      expect(guidance).toContain("Impact");
      expect(guidance).toContain("Recommendations");
    });
  });

  describe("Seasonal Guidance", () => {
    it("should have seasonal guidance for all seasons", () => {
      expect(SA_SEASONAL_GUIDANCE.length).toBe(4);
    });

    it("should have complete seasonal information", () => {
      SA_SEASONAL_GUIDANCE.forEach((guidance) => {
        expect(guidance.season).toBeTruthy();
        expect(guidance.months.length).toBeGreaterThan(0);
        expect(guidance.plumbingChallenges.length).toBeGreaterThan(0);
        expect(guidance.recommendations.length).toBeGreaterThan(0);
        expect(guidance.maintenanceFocus.length).toBeGreaterThan(0);
      });
    });

    it("should retrieve seasonal guidance by month", () => {
      const summerGuidance = getSeasonalGuidance(1); // January
      expect(summerGuidance).toBeDefined();
      expect(summerGuidance?.season).toBe("Summer");
    });
  });
});

describe("SA Guidance Templates", () => {
  describe("Template Structure", () => {
    it("should have guidance templates defined", () => {
      expect(SA_GUIDANCE_TEMPLATES.length).toBeGreaterThan(0);
    });

    it("should have complete template information", () => {
      SA_GUIDANCE_TEMPLATES.forEach((template) => {
        expect(template.id).toBeTruthy();
        expect(template.title).toBeTruthy();
        expect(template.scenario).toBeTruthy();
        expect(template.saSpecificAdvice.length).toBeGreaterThan(0);
        expect(template.standards.length).toBeGreaterThan(0);
        expect(template.insuranceConsiderations.length).toBeGreaterThan(0);
        expect(template.estimatedCost.min).toBeGreaterThanOrEqual(0);
        expect(template.estimatedCost.max).toBeGreaterThanOrEqual(template.estimatedCost.min);
      });
    });
  });

  describe("Template Retrieval", () => {
    it("should retrieve template by ID", () => {
      const template = getGuidanceTemplate("geyser-installation");
      expect(template).toBeDefined();
      expect(template?.title).toContain("Geyser");
    });

    it("should format template as readable text", () => {
      const template = getGuidanceTemplate("geyser-installation");
      if (template) {
        const text = formatGuidanceAsText(template);
        expect(text).toContain(template.title);
        expect(text).toContain("Scenario");
        expect(text).toContain("Standards");
      }
    });
  });

  describe("Critical Templates", () => {
    it("should have CoC guidance template", () => {
      const template = getGuidanceTemplate("certificate-of-compliance");
      expect(template).toBeDefined();
      expect(template?.saSpecificAdvice.some((a) => a.includes("CoC"))).toBe(true);
    });

    it("should have solar geyser template", () => {
      const template = getGuidanceTemplate("solar-geyser-installation");
      expect(template).toBeDefined();
      expect(template?.loadShedConsiderations.length).toBeGreaterThan(0);
    });

    it("should have emergency guidance", () => {
      const template = getGuidanceTemplate("burst-pipe-emergency");
      expect(template).toBeDefined();
      expect(template?.saSpecificAdvice.some((a) => a.includes("emergency"))).toBe(true);
    });
  });
});

describe("Integration Tests", () => {
  it("should have comprehensive SA knowledge base", () => {
    expect(SA_STANDARDS.length).toBeGreaterThan(0);
    expect(SA_MAJOR_SUPPLIERS.length).toBeGreaterThan(0);
    expect(SA_SEASONAL_GUIDANCE.length).toBeGreaterThan(0);
    expect(SA_GUIDANCE_TEMPLATES.length).toBeGreaterThan(0);
  });

  it("should support all major SA scenarios", () => {
    const scenarios = [
      "geyser-installation",
      "solar-geyser-installation",
      "burst-pipe-emergency",
      "low-water-pressure",
      "blocked-drain",
      "water-restrictions",
      "certificate-of-compliance",
    ];

    scenarios.forEach((scenario) => {
      const template = getGuidanceTemplate(scenario);
      expect(template).toBeDefined();
    });
  });

  it("should provide complete guidance for geyser scenario", () => {
    const template = getGuidanceTemplate("geyser-installation");
    expect(template).toBeDefined();

    if (template) {
      // Should have SANS standards
      expect(template.standards).toContain("SANS 10254");

      // Should have insurance considerations
      expect(template.insuranceConsiderations.some((i) => i.includes("CoC"))).toBe(true);

      // Should have SA suppliers
      expect(template.recommendedSuppliers.length).toBeGreaterThan(0);

      // Should have load-shedding considerations
      expect(template.loadShedConsiderations.length).toBeGreaterThan(0);
    }
  });
});
