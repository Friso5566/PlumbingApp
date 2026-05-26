import { SOUTH_AFRICAN_COST_DATABASE, CostEstimate } from "./costDatabase";
import type { FilterOptions } from "@/components/EstimateFilter";

/**
 * Apply filters and sorting to cost estimates
 */
export function applyFilters(estimates: CostEstimate[], filters: FilterOptions): CostEstimate[] {
  let filtered = [...estimates];

  // Filter by complexity
  if (filters.complexity.length > 0) {
    filtered = filtered.filter((e) => filters.complexity.includes(e.complexity));
  }

  // Filter by DIY friendly
  if (filters.diyFriendly !== null) {
    filtered = filtered.filter((e) => e.diy === filters.diyFriendly);
  }

  // Filter by price range
  const avgPrices = filtered.map((e) => ({
    id: e.id,
    avg: Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2),
  }));

  filtered = filtered.filter((e) => {
    const avg = avgPrices.find((p) => p.id === e.id)?.avg || 0;
    return avg >= filters.priceRange[0] && avg <= filters.priceRange[1];
  });

  // Filter by search term
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.issue.toLowerCase().includes(searchLower) ||
        e.parts.some((p) => (p as any).toLowerCase?.().includes(searchLower)) ||
        e.keywords.some((k) => (k as any).toLowerCase?.().includes(searchLower))
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const avgA = Math.round((a.partsMin + a.labourMin + a.partsMax + a.labourMax) / 2);
    const avgB = Math.round((b.partsMin + b.labourMin + b.partsMax + b.labourMax) / 2);

    switch (filters.sortBy) {
      case "price-low":
        return avgA - avgB;
      case "price-high":
        return avgB - avgA;
      case "complexity":
        const complexityOrder = { Low: 1, Medium: 2, High: 3 };
        return complexityOrder[a.complexity] - complexityOrder[b.complexity];
      case "diy-friendly":
        return a.diy === b.diy ? 0 : a.diy ? -1 : 1;
      default:
        return 0;
    }
  });

  return filtered;
}

/**
 * Get similar estimates based on complexity and price
 */
export function getSimilarEstimates(estimate: CostEstimate, limit = 3): CostEstimate[] {
  const avgPrice = Math.round((estimate.partsMin + estimate.labourMin + estimate.partsMax + estimate.labourMax) / 2);
  const priceRange = avgPrice * 0.3; // 30% range

  return SOUTH_AFRICAN_COST_DATABASE.filter(
    (e) =>
      e.id !== estimate.id &&
      e.complexity === estimate.complexity &&
      Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2) >= avgPrice - priceRange &&
      Math.round((e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2) <= avgPrice + priceRange
  ).slice(0, limit);
}

/**
 * Get trending/popular estimates
 */
export function getTrendingEstimates(limit = 5): CostEstimate[] {
  // In a real app, this would be based on actual usage data
  // For now, return low-complexity DIY-friendly estimates
  return SOUTH_AFRICAN_COST_DATABASE.filter((e) => e.complexity === "Low" && e.diy).slice(0, limit);
}

/**
 * Search estimates with fuzzy matching
 */
export function searchEstimates(query: string, limit = 10): CostEstimate[] {
  const queryLower = query.toLowerCase();
  const scored = SOUTH_AFRICAN_COST_DATABASE.map((estimate) => {
    let score = 0;

    // Exact match in issue
    if (estimate.issue.toLowerCase() === queryLower) score += 100;
    // Partial match in issue
    else if (estimate.issue.toLowerCase().includes(queryLower)) score += 50;

    // Match in keywords
    if (estimate.keywords.some((k) => (k as any).toLowerCase?.() === queryLower)) score += 80;
    else if (estimate.keywords.some((k) => (k as any).toLowerCase?.().includes(queryLower))) score += 40;

    // Match in parts
    if (estimate.parts.some((p) => (p as any).toLowerCase?.().includes(queryLower))) score += 20;

    return { estimate, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.estimate);
}

/**
 * Get estimate statistics
 */
export function getEstimateStats() {
  const estimates = SOUTH_AFRICAN_COST_DATABASE;

  const avgPrice = Math.round(
    estimates.reduce((sum, e) => sum + (e.partsMin + e.labourMin + e.partsMax + e.labourMax) / 2, 0) / estimates.length
  );

  const diyCount = estimates.filter((e) => e.diy).length;
  const professionalCount = estimates.length - diyCount;

  const complexityBreakdown = {
    Low: estimates.filter((e) => e.complexity === "Low").length,
    Medium: estimates.filter((e) => e.complexity === "Medium").length,
    High: estimates.filter((e) => e.complexity === "High").length,
  };

  return {
    totalEstimates: estimates.length,
    averagePrice: avgPrice,
    diyFriendly: diyCount,
    professionalRequired: professionalCount,
    complexityBreakdown,
  };
}
