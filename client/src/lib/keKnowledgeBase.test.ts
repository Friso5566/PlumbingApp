import { describe, it, expect } from "vitest";
import {
  KE_STANDARDS,
  WATER_SUPPLY_REQUIREMENTS,
  KE_INSURANCE_CLAIM_RISKS,
  generateKeSystemPromptInjection,
  getKeStandardsForIssue,
  getKeInsuranceRiskAssessment,
} from "./keStandardsKnowledge";
import {
  KE_MAJOR_SUPPLIERS,
  KE_TRUSTED_BRANDS,
  KE_PRODUCT_RECOMMENDATIONS,
  getKeSuppliersByRegion,
  getKeTrustedBrands,
  calculateKeRegionalCost,
} from "./keSupplierDatabase";
import {
  KE_WATER_RATIONING_LEVELS,
  KE_SEASONAL_GUIDANCE,
  getKeWaterRationingGuidance,
  getKeSeasonalGuidance,
} from "./keWaterContext";
import {
  KE_GUIDANCE_TEMPLATES,
  getKeGuidanceTemplate,
  formatKeGuidanceAsText,
} from "./keGuidanceTemplates";

describe("Kenya Standards Knowledge Base", () => {
  describe("Kenya Standards", () => {
    it("should have all major Kenya standards defined", () => {
      const standardCodes = KE_STANDARDS.map((s) => s.code);
      expect(standardCodes).toContain("KS 3404");
      expect(standardCodes).toContain("KS 3405");
      expect(standardCodes).toContain("Kenya Building Code");
      expect(standardCodes).toContain("Water Act 2016");
    });

    it("should have key requirements for each standard", () => {
      KE_STANDARDS.forEach((standard) => {
        expect(standard.keyRequirements.length).toBeGreaterThan(0);
        expect(standard.enforcementBody).toBeTruthy();
      });
    });

    it("should map issues to relevant standards", () => {
      const waterSupplyStandards = getKeStandardsForIssue("water-supply");
      expect(waterSupplyStandards.length).toBeGreaterThan(0);
      expect(waterSupplyStandards.some((s) => s.code === "KS 3404")).toBe(true);
    });
  });

  describe("Water Supply Requirements", () => {
    it("should have critical water supply requirements", () => {
      const requirementTexts = WATER_SUPPLY_REQUIREMENTS.map(
        (r) => r.requirement
      );
      expect(requirementTexts.some((r) => r.includes("200-500kPa"))).toBe(true);
      expect(requirementTexts.some((r) => r.includes("Backflow prevention"))).toBe(
        true
      );
      expect(requirementTexts.some((r) => r.includes("KEBS certified"))).toBe(true);
    });

    it("should have consequences for each requirement", () => {
      WATER_SUPPLY_REQUIREMENTS.forEach((requirement) => {
        expect(requirement.consequence).toBeTruthy();
        expect(requirement.standard).toBeTruthy();
      });
    });
  });

  describe("Insurance Risk Assessment", () => {
    it("should identify insurance risks", () => {
      const risks = KE_INSURANCE_CLAIM_RISKS;
      expect(risks.length).toBeGreaterThan(0);
      expect(risks.some((r) => r.issue.includes("registered plumber"))).toBe(true);
    });

    it("should assess risk for scenarios", () => {
      const assessment = getKeInsuranceRiskAssessment("KEBS certified");
      expect(assessment).toContain("CRITICAL");
    });
  });

  describe("System Prompt Injection", () => {
    it("should generate comprehensive Kenya system prompt", () => {
      const prompt = generateKeSystemPromptInjection();
      expect(prompt).toContain("KS 3404");
      expect(prompt).toContain("Kenya");
      expect(prompt).toContain("water scarcity");
      expect(prompt).toContain("KEBS");
    });

    it("should include all critical compliance requirements", () => {
      const prompt = generateKeSystemPromptInjection();
      expect(prompt).toContain("200-500kPa");
      expect(prompt).toContain("Backflow prevention");
      expect(prompt).toContain("KEBS certified");
      expect(prompt).toContain("Water Act 2016");
    });
  });
});

describe("Kenya Supplier Database", () => {
  describe("Major Suppliers", () => {
    it("should have major Kenya suppliers defined", () => {
      const supplierNames = KE_MAJOR_SUPPLIERS.map((s) => s.name);
      expect(supplierNames).toContain("Nakumatt");
      expect(supplierNames).toContain("Carrefour Kenya");
      expect(supplierNames).toContain("Jumia Home");
      expect(supplierNames.length).toBeGreaterThan(5);
    });

    it("should have website and region info for each supplier", () => {
      KE_MAJOR_SUPPLIERS.forEach((supplier) => {
        expect(supplier.website).toBeTruthy();
        expect(supplier.regions.length).toBeGreaterThan(0);
        expect(supplier.specialties.length).toBeGreaterThan(0);
      });
    });

    it("should filter suppliers by region", () => {
      const nairobiSuppliers = getKeSuppliersByRegion("Nairobi");
      expect(nairobiSuppliers.length).toBeGreaterThan(0);
    });
  });

  describe("Trusted Brands", () => {
    it("should have trusted brands for major categories", () => {
      const tapBrands = KE_TRUSTED_BRANDS.taps;
      expect(tapBrands).toContain("Grohe");
      expect(tapBrands.length).toBeGreaterThan(0);
    });

    it("should retrieve brands by category", () => {
      const brands = getKeTrustedBrands("pipes");
      expect(brands.length).toBeGreaterThan(0);
      expect(brands[0]).toBeTruthy();
    });
  });

  describe("Product Recommendations", () => {
    it("should have Kenya product recommendations", () => {
      expect(KE_PRODUCT_RECOMMENDATIONS.length).toBeGreaterThan(0);
    });

    it("should have complete product information", () => {
      KE_PRODUCT_RECOMMENDATIONS.forEach((product) => {
        expect(product.name).toBeTruthy();
        expect(product.brand).toBeTruthy();
        expect(product.supplier.length).toBeGreaterThan(0);
        expect(product.priceRange.min).toBeGreaterThanOrEqual(0);
        expect(product.priceRange.max).toBeGreaterThanOrEqual(product.priceRange.min);
        expect(product.keRating).toBeGreaterThan(0);
        expect(product.keRating).toBeLessThanOrEqual(5);
      });
    });

    it("should have KEBS approved products", () => {
      const kebsProducts = KE_PRODUCT_RECOMMENDATIONS.filter(
        (p) => p.kebesApproved
      );
      expect(kebsProducts.length).toBeGreaterThan(0);
    });
  });

  describe("Regional Cost Calculation", () => {
    it("should calculate regional cost adjustments", () => {
      const baseCost = 1000;
      const nairobi = calculateKeRegionalCost(baseCost, "nairobi");
      const rural = calculateKeRegionalCost(baseCost, "rural");

      expect(rural).toBeGreaterThan(nairobi);
    });

    it("should apply emergency multipliers", () => {
      const baseCost = 1000;
      const normal = calculateKeRegionalCost(baseCost, "nairobi", false, false, false);
      const emergency = calculateKeRegionalCost(baseCost, "nairobi", true, false, false);

      expect(emergency).toBeGreaterThan(normal);
    });
  });
});

describe("Kenya Water Context", () => {
  describe("Water Rationing Levels", () => {
    it("should have all water rationing levels defined", () => {
      expect(KE_WATER_RATIONING_LEVELS[0]).toBeDefined();
      expect(KE_WATER_RATIONING_LEVELS[4]).toBeDefined();
    });

    it("should have impact information for each level", () => {
      Object.values(KE_WATER_RATIONING_LEVELS).forEach((level) => {
        expect(level.description).toBeTruthy();
        expect(level.impact.length).toBeGreaterThan(0);
        expect(level.recommendations.length).toBeGreaterThan(0);
      });
    });

    it("should generate water rationing guidance", () => {
      const guidance = getKeWaterRationingGuidance(2);
      expect(guidance).toContain("Level 2");
      expect(guidance).toContain("Impact");
      expect(guidance).toContain("Recommendations");
    });
  });

  describe("Seasonal Guidance", () => {
    it("should have seasonal guidance for all seasons", () => {
      expect(KE_SEASONAL_GUIDANCE.length).toBe(4);
    });

    it("should have complete seasonal information", () => {
      KE_SEASONAL_GUIDANCE.forEach((guidance) => {
        expect(guidance.season).toBeTruthy();
        expect(guidance.months.length).toBeGreaterThan(0);
        expect(guidance.plumbingChallenges.length).toBeGreaterThan(0);
        expect(guidance.recommendations.length).toBeGreaterThan(0);
        expect(guidance.maintenanceFocus.length).toBeGreaterThan(0);
      });
    });

    it("should retrieve seasonal guidance by month", () => {
      const juneGuidance = getKeSeasonalGuidance(6); // June
      expect(juneGuidance).toBeDefined();
      expect(juneGuidance?.season).toBe("Dry Season");
    });
  });
});

describe("Kenya Guidance Templates", () => {
  describe("Template Structure", () => {
    it("should have guidance templates defined", () => {
      expect(KE_GUIDANCE_TEMPLATES.length).toBeGreaterThan(0);
    });

    it("should have complete template information", () => {
      KE_GUIDANCE_TEMPLATES.forEach((template) => {
        expect(template.id).toBeTruthy();
        expect(template.title).toBeTruthy();
        expect(template.scenario).toBeTruthy();
        expect(template.keSpecificAdvice.length).toBeGreaterThan(0);
        expect(template.standards.length).toBeGreaterThan(0);
        expect(template.complianceConsiderations.length).toBeGreaterThan(0);
        expect(template.estimatedCost.min).toBeGreaterThanOrEqual(0);
        expect(template.estimatedCost.max).toBeGreaterThanOrEqual(
          template.estimatedCost.min
        );
      });
    });
  });

  describe("Template Retrieval", () => {
    it("should retrieve template by ID", () => {
      const template = getKeGuidanceTemplate("water-tank-installation");
      expect(template).toBeDefined();
      expect(template?.title).toContain("Water Tank");
    });

    it("should format template as readable text", () => {
      const template = getKeGuidanceTemplate("water-tank-installation");
      if (template) {
        const text = formatKeGuidanceAsText(template);
        expect(text).toContain(template.title);
        expect(text).toContain("Scenario");
        expect(text).toContain("Standards");
      }
    });
  });

  describe("Critical Templates", () => {
    it("should have water tank template", () => {
      const template = getKeGuidanceTemplate("water-tank-installation");
      expect(template).toBeDefined();
      expect(template?.waterScarcityConsiderations.length).toBeGreaterThan(0);
    });

    it("should have rainwater harvesting template", () => {
      const template = getKeGuidanceTemplate("rainwater-harvesting");
      expect(template).toBeDefined();
      expect(template?.standards).toContain("Water Act 2016");
    });

    it("should have borehole system template", () => {
      const template = getKeGuidanceTemplate("borehole-system");
      expect(template).toBeDefined();
      expect(template?.keSpecificAdvice.some((a) => a.includes("WRA"))).toBe(true);
    });

    it("should have water rationing planning template", () => {
      const template = getKeGuidanceTemplate("water-rationing-planning");
      expect(template).toBeDefined();
      expect(template?.waterScarcityConsiderations.length).toBeGreaterThan(0);
    });

    it("should have KEBS certification template", () => {
      const template = getKeGuidanceTemplate("kebs-certification");
      expect(template).toBeDefined();
      expect(template?.keSpecificAdvice.some((a) => a.includes("KEBS"))).toBe(true);
    });
  });
});

describe("Integration Tests", () => {
  it("should have comprehensive Kenya knowledge base", () => {
    expect(KE_STANDARDS.length).toBeGreaterThan(0);
    expect(KE_MAJOR_SUPPLIERS.length).toBeGreaterThan(0);
    expect(KE_SEASONAL_GUIDANCE.length).toBeGreaterThan(0);
    expect(KE_GUIDANCE_TEMPLATES.length).toBeGreaterThan(0);
  });

  it("should support all major Kenya scenarios", () => {
    const scenarios = [
      "water-tank-installation",
      "rainwater-harvesting",
      "borehole-system",
      "water-pressure-issue",
      "hard-water-treatment",
      "septic-tank-system",
      "water-rationing-planning",
      "kebs-certification",
    ];

    scenarios.forEach((scenario) => {
      const template = getKeGuidanceTemplate(scenario);
      expect(template).toBeDefined();
    });
  });

  it("should provide complete guidance for water tank scenario", () => {
    const template = getKeGuidanceTemplate("water-tank-installation");
    expect(template).toBeDefined();

    if (template) {
      // Should have Kenya standards
      expect(template.standards).toContain("KS 3404");

      // Should have compliance considerations
      expect(
        template.complianceConsiderations.some((c) => c.includes("inspection"))
      ).toBe(true);

      // Should have Kenya suppliers
      expect(template.recommendedSuppliers.length).toBeGreaterThan(0);

      // Should have water scarcity considerations
      expect(template.waterScarcityConsiderations.length).toBeGreaterThan(0);
    }
  });

  it("should provide complete guidance for borehole scenario", () => {
    const template = getKeGuidanceTemplate("borehole-system");
    expect(template).toBeDefined();

    if (template) {
      // Should have Water Act 2016
      expect(template.standards).toContain("Water Act 2016");

      // Should mention WRA permit
      expect(template.keSpecificAdvice.some((a) => a.includes("WRA"))).toBe(true);

      // Should have water scarcity considerations
      expect(template.waterScarcityConsiderations.length).toBeGreaterThan(0);
    }
  });
});
