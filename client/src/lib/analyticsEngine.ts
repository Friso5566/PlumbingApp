import { SOUTH_AFRICAN_COST_DATABASE, CostEstimate } from "./costDatabase";

export interface AnalyticsData {
  totalEstimates: number;
  averageCost: number;
  medianCost: number;
  costRange: { min: number; max: number };
  byComplexity: ComplexityAnalytics;
  byType: TypeAnalytics[];
  diyVsProfessional: DIYAnalytics;
  regionalBreakdown: RegionalAnalytics[];
  trendingIssues: TrendingIssue[];
  costDistribution: CostDistribution[];
}

export interface ComplexityAnalytics {
  Low: { count: number; avgCost: number; percentage: number };
  Medium: { count: number; avgCost: number; percentage: number };
  High: { count: number; avgCost: number; percentage: number };
}

export interface TypeAnalytics {
  issue: string;
  avgCost: number;
  count: number;
  minCost: number;
  maxCost: number;
  diyFriendly: boolean;
}

export interface DIYAnalytics {
  diyCount: number;
  professionalCount: number;
  diyPercentage: number;
  avgDIYCost: number;
  avgProfessionalCost: number;
}

export interface RegionalAnalytics {
  region: string;
  avgCost: number;
  estimateCount: number;
  topIssues: string[];
}

export interface TrendingIssue {
  issue: string;
  count: number;
  avgCost: number;
  trend: "up" | "down" | "stable";
}

export interface CostDistribution {
  range: string;
  count: number;
  percentage: number;
}

/**
 * Generate comprehensive analytics data
 */
export function generateAnalytics(): AnalyticsData {
  const estimates = SOUTH_AFRICAN_COST_DATABASE;

  // Calculate average costs
  const costs = estimates.map((e) => Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2));
  const sortedCosts = [...costs].sort((a, b) => a - b);
  const averageCost = Math.round(costs.reduce((a, b) => a + b, 0) / costs.length);
  const medianCost = sortedCosts[Math.floor(sortedCosts.length / 2)];

  // Complexity breakdown
  const byComplexity: ComplexityAnalytics = {
    Low: { count: 0, avgCost: 0, percentage: 0 },
    Medium: { count: 0, avgCost: 0, percentage: 0 },
    High: { count: 0, avgCost: 0, percentage: 0 },
  };

  estimates.forEach((e) => {
    const cost = Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2);
    byComplexity[e.complexity].count++;
    byComplexity[e.complexity].avgCost += cost;
  });

  Object.keys(byComplexity).forEach((level) => {
    const data = byComplexity[level as keyof ComplexityAnalytics];
    data.avgCost = Math.round(data.avgCost / data.count);
    data.percentage = Math.round((data.count / estimates.length) * 100);
  });

  // By type analytics
  const byType: TypeAnalytics[] = estimates.map((e) => ({
    issue: e.issue,
    avgCost: Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2),
    count: 1,
    minCost: e.partsMin + e.labourMin,
    maxCost: e.partsMax + e.labourMax,
    diyFriendly: e.diy,
  }));

  // DIY vs Professional
  const diyEstimates = estimates.filter((e) => e.diy);
  const professionalEstimates = estimates.filter((e) => !e.diy);

  const diyVsProfessional: DIYAnalytics = {
    diyCount: diyEstimates.length,
    professionalCount: professionalEstimates.length,
    diyPercentage: Math.round((diyEstimates.length / estimates.length) * 100),
    avgDIYCost: Math.round(
      diyEstimates.reduce((sum, e) => sum + (e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2, 0) /
        diyEstimates.length
    ),
    avgProfessionalCost: Math.round(
      professionalEstimates.reduce((sum, e) => sum + (e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2, 0) /
        professionalEstimates.length
    ),
  };

  // Regional breakdown (simulated - in real app would use actual regional data)
  const regions = ["South Africa", "Nigeria", "Kenya", "Universal"];
  const regionalBreakdown: RegionalAnalytics[] = regions.map((region) => {
    const regionEstimates = estimates.slice(0, Math.ceil(estimates.length / regions.length));
    const regionCosts = regionEstimates.map((e) => Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2));
    return {
      region,
      avgCost: Math.round(regionCosts.reduce((a, b) => a + b, 0) / regionCosts.length),
      estimateCount: regionEstimates.length,
      topIssues: regionEstimates.slice(0, 3).map((e) => e.issue),
    };
  });

  // Trending issues (top 5 by complexity)
  const trendingIssues: TrendingIssue[] = estimates
    .slice(0, 5)
    .map((e) => ({
      issue: e.issue,
      count: Math.floor(Math.random() * 50) + 10,
      avgCost: Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2),
      trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable",
    }));

  // Cost distribution
  const costDistribution: CostDistribution[] = [
    { range: "R0 - R500", count: 0, percentage: 0 },
    { range: "R500 - R1000", count: 0, percentage: 0 },
    { range: "R1000 - R2000", count: 0, percentage: 0 },
    { range: "R2000 - R5000", count: 0, percentage: 0 },
    { range: "R5000+", count: 0, percentage: 0 },
  ];

  costs.forEach((cost) => {
    if (cost <= 500) costDistribution[0].count++;
    else if (cost <= 1000) costDistribution[1].count++;
    else if (cost <= 2000) costDistribution[2].count++;
    else if (cost <= 5000) costDistribution[3].count++;
    else costDistribution[4].count++;
  });

  costDistribution.forEach((dist) => {
    dist.percentage = Math.round((dist.count / costs.length) * 100);
  });

  return {
    totalEstimates: estimates.length,
    averageCost,
    medianCost,
    costRange: { min: Math.min(...costs), max: Math.max(...costs) },
    byComplexity,
    byType,
    diyVsProfessional,
    regionalBreakdown,
    trendingIssues,
    costDistribution,
  };
}

/**
 * Get analytics for specific region
 */
export function getRegionalAnalytics(region: string): AnalyticsData {
  // In a real app, this would filter by actual region
  return generateAnalytics();
}

/**
 * Compare two regions
 */
export function compareRegions(region1: string, region2: string) {
  const analytics1 = getRegionalAnalytics(region1);
  const analytics2 = getRegionalAnalytics(region2);

  return {
    region1: {
      name: region1,
      avgCost: analytics1.averageCost,
      totalEstimates: analytics1.totalEstimates,
      diyPercentage: analytics1.diyVsProfessional.diyPercentage,
    },
    region2: {
      name: region2,
      avgCost: analytics2.averageCost,
      totalEstimates: analytics2.totalEstimates,
      diyPercentage: analytics2.diyVsProfessional.diyPercentage,
    },
    costDifference: Math.abs(analytics1.averageCost - analytics2.averageCost),
    costDifferencePercentage: Math.round(
      ((Math.abs(analytics1.averageCost - analytics2.averageCost) / analytics1.averageCost) * 100)
    ),
  };
}

/**
 * Export analytics to CSV
 */
export function exportAnalyticsToCSV(analytics: AnalyticsData): string {
  let csv = "Plumbing Cost Analytics Report\n\n";

  csv += "Summary Statistics\n";
  csv += `Total Estimates,${analytics.totalEstimates}\n`;
  csv += `Average Cost,R${analytics.averageCost.toLocaleString()}\n`;
  csv += `Median Cost,R${analytics.medianCost.toLocaleString()}\n`;
  csv += `Cost Range,R${analytics.costRange.min.toLocaleString()} - R${analytics.costRange.max.toLocaleString()}\n\n`;

  csv += "By Complexity\n";
  csv += "Complexity,Count,Average Cost,Percentage\n";
  Object.entries(analytics.byComplexity).forEach(([level, data]) => {
    csv += `${level},${data.count},R${data.avgCost.toLocaleString()},${data.percentage}%\n`;
  });

  csv += "\nDIY vs Professional\n";
  csv += `DIY Friendly,${analytics.diyVsProfessional.diyCount},R${analytics.diyVsProfessional.avgDIYCost.toLocaleString()}\n`;
  csv += `Professional Required,${analytics.diyVsProfessional.professionalCount},R${analytics.diyVsProfessional.avgProfessionalCost.toLocaleString()}\n`;

  csv += "\nBy Issue Type\n";
  csv += "Issue,Average Cost,Count,Min Cost,Max Cost,DIY Friendly\n";
  analytics.byType.forEach((type) => {
    csv += `"${type.issue}",R${type.avgCost.toLocaleString()},${type.count},R${type.minCost.toLocaleString()},R${type.maxCost.toLocaleString()},${type.diyFriendly ? "Yes" : "No"}\n`;
  });

  return csv;
}
