import { describe, it, expect } from "vitest";
import { findCostEstimates, calculateRuralPricing, SOUTH_AFRICAN_COST_DATABASE } from "../client/src/lib/costDatabase";

describe("Cost Database", () => {
  it("should have valid cost estimates", () => {
    expect(SOUTH_AFRICAN_COST_DATABASE.length).toBeGreaterThan(0);
    
    SOUTH_AFRICAN_COST_DATABASE.forEach((estimate) => {
      expect(estimate.id).toBeDefined();
      expect(estimate.issue).toBeDefined();
      expect(estimate.keywords).toBeDefined();
      expect(estimate.keywords.length).toBeGreaterThan(0);
      expect(estimate.partsMin).toBeGreaterThanOrEqual(0);
      expect(estimate.partsMax).toBeGreaterThanOrEqual(estimate.partsMin);
      expect(estimate.labourMin).toBeGreaterThanOrEqual(0);
      expect(estimate.labourMax).toBeGreaterThanOrEqual(estimate.labourMin);
      expect(["Low", "Medium", "High"]).toContain(estimate.complexity);
      expect(typeof estimate.diy).toBe("boolean");
      expect(Array.isArray(estimate.parts)).toBe(true);
    });
  });

  it("should find cost estimates by keyword", () => {
    const response = "The geyser element needs replacement due to heating failure.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
    expect(estimates[0].id).toBe("geyser-element-replacement");
  });

  it("should find multiple cost estimates when multiple issues are mentioned", () => {
    const response = "The geyser element and thermostat both need replacement.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThanOrEqual(2);
  });

  it("should not find estimates for generic questions", () => {
    const response = "How does a plumbing system work?";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBe(0);
  });

  it("should find estimates with case-insensitive matching", () => {
    const response = "GEYSER ELEMENT replacement needed";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
  });

  it("should calculate rural pricing correctly", () => {
    const estimate = SOUTH_AFRICAN_COST_DATABASE[0];
    const ruralPricing = calculateRuralPricing(estimate);
    
    // Rural pricing should add 20% to parts
    expect(ruralPricing.partsMin).toBe(Math.round(estimate.partsMin * 1.2));
    expect(ruralPricing.partsMax).toBe(Math.round(estimate.partsMax * 1.2));
    
    // Rural pricing should reduce labour by 10%
    expect(ruralPricing.labourMin).toBe(Math.round(estimate.labourMin * 0.9));
    expect(ruralPricing.labourMax).toBe(Math.round(estimate.labourMax * 0.9));
  });

  it("should find dripping tap estimate", () => {
    const response = "My tap is dripping constantly and needs a washer.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
    expect(estimates[0].id).toBe("dripping-tap");
  });

  it("should find toilet cistern repair estimate", () => {
    const response = "The toilet cistern is running constantly.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
    expect(estimates[0].id).toBe("toilet-cistern-repair");
  });

  it("should find burst pipe estimate", () => {
    const response = "There's a burst pipe in the wall.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
  });

  it("should find blocked drain estimate", () => {
    const response = "I have a blocked drain that needs professional drain cleaning.";
    const estimates = findCostEstimates(response);
    
    expect(estimates.length).toBeGreaterThan(0);
  });

  it("should not find duplicate estimates", () => {
    const response = "The geyser element and geyser element replacement is needed.";
    const estimates = findCostEstimates(response);
    
    // Should only find one geyser element estimate, not duplicates
    const geyserEstimates = estimates.filter((e) => e.id === "geyser-element-replacement");
    expect(geyserEstimates.length).toBe(1);
  });
});
