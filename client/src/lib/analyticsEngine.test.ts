import { describe, it, expect } from "vitest";
import {
  generateAnalytics,
  getRegionalAnalytics,
  compareRegions,
  exportAnalyticsToCSV,
} from "./analyticsEngine";

describe("Analytics Engine", () => {
  describe("generateAnalytics", () => {
    it("should generate analytics with all required properties", () => {
      const analytics = generateAnalytics();

      expect(analytics).toBeDefined();
      expect(analytics.totalEstimates).toBeGreaterThan(0);
      expect(analytics.averageCost).toBeGreaterThan(0);
      expect(analytics.medianCost).toBeGreaterThan(0);
      expect(analytics.costRange).toBeDefined();
      expect(analytics.costRange.min).toBeGreaterThanOrEqual(0);
      expect(analytics.costRange.max).toBeGreaterThan(analytics.costRange.min);
    });

    it("should have complexity breakdown with all levels", () => {
      const analytics = generateAnalytics();

      expect(analytics.byComplexity).toBeDefined();
      expect(analytics.byComplexity.Low).toBeDefined();
      expect(analytics.byComplexity.Medium).toBeDefined();
      expect(analytics.byComplexity.High).toBeDefined();

      expect(analytics.byComplexity.Low.count).toBeGreaterThanOrEqual(0);
      expect(analytics.byComplexity.Medium.count).toBeGreaterThanOrEqual(0);
      expect(analytics.byComplexity.High.count).toBeGreaterThanOrEqual(0);

      expect(analytics.byComplexity.Low.percentage).toBeGreaterThanOrEqual(0);
      expect(analytics.byComplexity.Low.percentage).toBeLessThanOrEqual(100);
    });

    it("should have DIY vs Professional breakdown", () => {
      const analytics = generateAnalytics();

      expect(analytics.diyVsProfessional).toBeDefined();
      expect(analytics.diyVsProfessional.diyCount).toBeGreaterThanOrEqual(0);
      expect(analytics.diyVsProfessional.professionalCount).toBeGreaterThanOrEqual(0);
      expect(analytics.diyVsProfessional.diyPercentage).toBeGreaterThanOrEqual(0);
      expect(analytics.diyVsProfessional.diyPercentage).toBeLessThanOrEqual(100);
      expect(analytics.diyVsProfessional.avgDIYCost).toBeGreaterThanOrEqual(0);
      expect(analytics.diyVsProfessional.avgProfessionalCost).toBeGreaterThanOrEqual(0);
    });

    it("should have regional breakdown", () => {
      const analytics = generateAnalytics();

      expect(analytics.regionalBreakdown).toBeDefined();
      expect(Array.isArray(analytics.regionalBreakdown)).toBe(true);
      expect(analytics.regionalBreakdown.length).toBeGreaterThan(0);

      analytics.regionalBreakdown.forEach((region) => {
        expect(region.region).toBeDefined();
        expect(region.avgCost).toBeGreaterThan(0);
        expect(region.estimateCount).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(region.topIssues)).toBe(true);
      });
    });

    it("should have trending issues", () => {
      const analytics = generateAnalytics();

      expect(analytics.trendingIssues).toBeDefined();
      expect(Array.isArray(analytics.trendingIssues)).toBe(true);
      expect(analytics.trendingIssues.length).toBeGreaterThan(0);

      analytics.trendingIssues.forEach((issue) => {
        expect(issue.issue).toBeDefined();
        expect(issue.count).toBeGreaterThan(0);
        expect(issue.avgCost).toBeGreaterThan(0);
        expect(["up", "down", "stable"]).toContain(issue.trend);
      });
    });

    it("should have cost distribution", () => {
      const analytics = generateAnalytics();

      expect(analytics.costDistribution).toBeDefined();
      expect(Array.isArray(analytics.costDistribution)).toBe(true);
      expect(analytics.costDistribution.length).toBeGreaterThan(0);

      const totalPercentage = analytics.costDistribution.reduce((sum, dist) => sum + dist.percentage, 0);
      expect(totalPercentage).toBeLessThanOrEqual(100);
    });

    it("should have type breakdown", () => {
      const analytics = generateAnalytics();

      expect(analytics.byType).toBeDefined();
      expect(Array.isArray(analytics.byType)).toBe(true);
      expect(analytics.byType.length).toBeGreaterThan(0);

      analytics.byType.forEach((type) => {
        expect(type.issue).toBeDefined();
        expect(type.avgCost).toBeGreaterThan(0);
        expect(type.minCost).toBeGreaterThanOrEqual(0);
        expect(type.maxCost).toBeGreaterThanOrEqual(type.minCost);
        expect(typeof type.diyFriendly).toBe("boolean");
      });
    });
  });

  describe("getRegionalAnalytics", () => {
    it("should return analytics for a specific region", () => {
      const analytics = getRegionalAnalytics("South Africa");

      expect(analytics).toBeDefined();
      expect(analytics.totalEstimates).toBeGreaterThan(0);
      expect(analytics.averageCost).toBeGreaterThan(0);
    });

    it("should return consistent data for same region", () => {
      const analytics1 = getRegionalAnalytics("South Africa");
      const analytics2 = getRegionalAnalytics("South Africa");

      expect(analytics1.totalEstimates).toBe(analytics2.totalEstimates);
      expect(analytics1.averageCost).toBe(analytics2.averageCost);
    });
  });

  describe("compareRegions", () => {
    it("should compare two regions", () => {
      const comparison = compareRegions("South Africa", "Nigeria");

      expect(comparison).toBeDefined();
      expect(comparison.region1).toBeDefined();
      expect(comparison.region2).toBeDefined();
      expect(comparison.costDifference).toBeGreaterThanOrEqual(0);
      expect(comparison.costDifferencePercentage).toBeGreaterThanOrEqual(0);
    });

    it("should have zero difference when comparing same region", () => {
      const comparison = compareRegions("South Africa", "South Africa");

      expect(comparison.costDifference).toBe(0);
      expect(comparison.costDifferencePercentage).toBe(0);
    });
  });

  describe("exportAnalyticsToCSV", () => {
    it("should export analytics to CSV format", () => {
      const analytics = generateAnalytics();
      const csv = exportAnalyticsToCSV(analytics);

      expect(typeof csv).toBe("string");
      expect(csv.length).toBeGreaterThan(0);
    });

    it("should include summary statistics in CSV", () => {
      const analytics = generateAnalytics();
      const csv = exportAnalyticsToCSV(analytics);

      expect(csv).toContain("Summary Statistics");
      expect(csv).toContain("Total Estimates");
      expect(csv).toContain("Average Cost");
      expect(csv).toContain("Median Cost");
    });

    it("should include complexity breakdown in CSV", () => {
      const analytics = generateAnalytics();
      const csv = exportAnalyticsToCSV(analytics);

      expect(csv).toContain("By Complexity");
      expect(csv).toContain("Low");
      expect(csv).toContain("Medium");
      expect(csv).toContain("High");
    });

    it("should include DIY vs Professional in CSV", () => {
      const analytics = generateAnalytics();
      const csv = exportAnalyticsToCSV(analytics);

      expect(csv).toContain("DIY vs Professional");
      expect(csv).toContain("DIY Friendly");
      expect(csv).toContain("Professional Required");
    });

    it("should include issue types in CSV", () => {
      const analytics = generateAnalytics();
      const csv = exportAnalyticsToCSV(analytics);

      expect(csv).toContain("By Issue Type");
      expect(csv).toContain("Issue");
      expect(csv).toContain("Average Cost");
    });
  });
});
