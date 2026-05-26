/**
 * South African Plumbing Guidance Templates
 * Ready-to-use templates for common SA plumbing scenarios
 */

export interface SAGuidanceTemplate {
  id: string;
  title: string;
  scenario: string;
  saSpecificAdvice: string[];
  standards: string[];
  insuranceConsiderations: string[];
  recommendedSuppliers: string[];
  estimatedCost: { min: number; max: number; currency: string };
  loadShedConsiderations: string[];
  waterRestrictionTips: string[];
}

export const SA_GUIDANCE_TEMPLATES: SAGuidanceTemplate[] = [
  {
    id: "geyser-installation",
    title: "Geyser Installation - SA Compliance Guide",
    scenario: "Installing a new electric geyser in South Africa",
    saSpecificAdvice: [
      "MUST use a registered plumber - non-compliance voids warranty and insurance",
      "Install pressure control valve (PCV) set to maximum 400kPa",
      "Install vacuum breaker (anti-vacuum valve) - mandatory",
      "Install drip tray with drain to outside - insurance requirement",
      "Install expansion valve, pressure reducing valve, and isolator valve",
      "Set thermostat to minimum 60°C to prevent Legionella",
      "Ensure adequate roof space access for maintenance",
      "Request Certificate of Compliance (CoC) from plumber",
      "Have electrical work done by certified electrician",
      "Register installation with local municipality if required",
    ],
    standards: ["SANS 10254", "SANS 10142"],
    insuranceConsiderations: [
      "CoC is CRITICAL - without it, insurance claims are rejected",
      "Drip tray must have external drain - insurance requirement",
      "PCV pressure must not exceed 400kPa",
      "Only registered plumber installation is covered",
      "Keep all documentation for insurance purposes",
    ],
    recommendedSuppliers: [
      "Kwikot (South African brand)",
      "Geyserwise",
      "Ariston",
      "Dimplex",
    ],
    estimatedCost: { min: 3500, max: 6000, currency: "ZAR" },
    loadShedConsiderations: [
      "Consider solar geyser instead for load-shedding independence",
      "If electric only, plan hot water usage around load-shedding schedule",
      "Install thermal storage tank to maintain heat during outages",
    ],
    waterRestrictionTips: [
      "Install low-flow showerhead (4L/min) to comply with restrictions",
      "Consider solar geyser for water heating independence",
    ],
  },
  {
    id: "solar-geyser-installation",
    title: "Solar Geyser Installation - Load-Shedding Solution",
    scenario: "Installing a solar geyser to reduce load-shedding impact",
    saSpecificAdvice: [
      "Ideal solution for South Africa's load-shedding challenges",
      "No electricity needed for heating - works during power cuts",
      "Check roof orientation and sun exposure",
      "Install backup electric element for winter/cloudy days",
      "Ensure proper plumbing connections with isolation valves",
      "Install pressure relief valve",
      "Consider government rebates available in some provinces",
      "Maintain annual servicing for optimal performance",
      "Use registered plumber for installation",
    ],
    standards: ["SANS 10254", "SANS 10142"],
    insuranceConsiderations: [
      "CoC required from registered plumber",
      "Proper installation ensures insurance coverage",
      "Backup element must comply with SANS 10254",
    ],
    recommendedSuppliers: [
      "Sunmark (SA solar specialist)",
      "Kwikot solar range",
      "Ariston solar systems",
    ],
    estimatedCost: { min: 8000, max: 15000, currency: "ZAR" },
    loadShedConsiderations: [
      "PRIMARY benefit - no electricity needed for heating",
      "Reduces load-shedding impact significantly",
      "Backup electric element for emergencies",
    ],
    waterRestrictionTips: [
      "Solar heating reduces water heating costs",
      "Combine with low-flow fixtures for maximum savings",
    ],
  },
  {
    id: "burst-pipe-emergency",
    title: "Burst Pipe Emergency - SA Response Guide",
    scenario: "Dealing with a burst pipe in South Africa",
    saSpecificAdvice: [
      "Immediately locate and close the main water valve",
      "Turn off geyser if burst is near geyser",
      "Call emergency plumber immediately",
      "Document damage with photos for insurance",
      "If during load-shedding, water pressure may already be low",
      "Check for water damage to electrical systems",
      "Ensure area is safe before emergency plumber arrives",
      "Prepare to provide plumber with access to pipes",
    ],
    standards: ["SANS 10400-W", "SANS 10400-P"],
    insuranceConsiderations: [
      "Report to insurance immediately",
      "Document all damage with photos and videos",
      "Keep all receipts from emergency repairs",
      "Insurance may cover emergency plumber costs",
      "Proper pipe installation reduces future claims",
    ],
    recommendedSuppliers: [
      "Emergency plumber (24/7 service)",
      "Builders Warehouse (emergency supplies)",
      "Plumblink (online ordering)",
    ],
    estimatedCost: { min: 1500, max: 5000, currency: "ZAR" },
    loadShedConsiderations: [
      "During load-shedding, pump systems may not work",
      "Water pressure may be low - burst may be less severe",
    ],
    waterRestrictionTips: [
      "Burst pipe wastes water - fix immediately",
      "Check for other leaks while plumber is there",
    ],
  },
  {
    id: "low-water-pressure",
    title: "Low Water Pressure - SA Troubleshooting",
    scenario: "Dealing with low water pressure in South Africa",
    saSpecificAdvice: [
      "Check if it's load-shedding related - pump systems fail during outages",
      "Check municipal water pressure - varies by area",
      "Verify water meter valve is fully open",
      "Check for leaks in the system",
      "Inspect pressure reducing valve (PCV) settings",
      "Consider installing pressure tank for storage",
      "Check if area is under water restrictions",
      "For high altitude areas (Johannesburg, Pretoria), low pressure is common",
      "Install booster pump if pressure is consistently low",
    ],
    standards: ["SANS 10400-W"],
    insuranceConsiderations: [
      "Low pressure may indicate leaks - check for damage",
      "Proper pressure maintenance prevents system damage",
    ],
    recommendedSuppliers: [
      "Caple (pressure equipment)",
      "Grundfos (pump systems)",
      "Builders Warehouse",
    ],
    estimatedCost: { min: 500, max: 3000, currency: "ZAR" },
    loadShedConsiderations: [
      "Load-shedding causes pump failure - pressure drops during outages",
      "Install pressure tank to maintain pressure during power cuts",
      "Consider backup power system for pump",
    ],
    waterRestrictionTips: [
      "Low pressure may be due to municipal restrictions",
      "Check with local municipality for restriction schedules",
    ],
  },
  {
    id: "blocked-drain",
    title: "Blocked Drain - SA Professional Guide",
    scenario: "Dealing with blocked drains in South Africa",
    saSpecificAdvice: [
      "DIY drain cleaning safe for minor blockages",
      "Professional drain jetting recommended for severe blockages",
      "Check for tree root intrusion - common in SA gardens",
      "Ensure drain has proper ventilation (SANS 10400-P)",
      "Check for grease accumulation in pipes",
      "Professional inspection may reveal structural issues",
      "Septic tank systems need regular pumping (rural areas)",
      "Municipal sewage systems require professional clearing",
    ],
    standards: ["SANS 10400-P"],
    insuranceConsiderations: [
      "Proper drain maintenance prevents damage claims",
      "Tree root damage may not be covered by insurance",
      "Regular maintenance reduces future claims",
    ],
    recommendedSuppliers: [
      "Professional drain cleaning service",
      "Builders Warehouse (DIY supplies)",
      "Plumblink (drain cleaning equipment)",
    ],
    estimatedCost: { min: 400, max: 2500, currency: "ZAR" },
    loadShedConsiderations: [
      "Sewage pump systems fail during load-shedding",
      "Backup risk during power cuts",
      "Install backup power for sewage pump",
    ],
    waterRestrictionTips: [
      "Proper drainage maintains water quality",
      "Grease traps required for commercial kitchens",
    ],
  },
  {
    id: "water-restrictions",
    title: "Water Restrictions Compliance - SA Guide",
    scenario: "Complying with municipal water restrictions",
    saSpecificAdvice: [
      "Install low-flow taps (4L/min) to comply",
      "Install dual-flush toilets to save water",
      "Consider rainwater harvesting system",
      "Implement grey water recycling where permitted",
      "Fix all leaks immediately - wasted water",
      "Install water-efficient showerheads",
      "Check local municipality for specific restrictions",
      "Some areas offer water-saving rebates",
      "Borehole systems becoming popular in restricted areas",
    ],
    standards: ["SANS 10400-W"],
    insuranceConsiderations: [
      "Water-efficient fixtures may qualify for rebates",
      "Proper installation ensures compliance",
    ],
    recommendedSuppliers: [
      "Builders Warehouse",
      "Mr Price Home",
      "Plumblink",
      "Takealot",
    ],
    estimatedCost: { min: 500, max: 3000, currency: "ZAR" },
    loadShedConsiderations: [
      "Water restrictions often coincide with load-shedding",
      "Solar geyser helps with both challenges",
    ],
    waterRestrictionTips: [
      "Low-flow fixtures reduce water usage by 30-50%",
      "Rainwater harvesting can provide 50% of water needs",
      "Grey water recycling for gardens and toilets",
    ],
  },
  {
    id: "certificate-of-compliance",
    title: "Certificate of Compliance (CoC) - Critical SA Requirement",
    scenario: "Understanding CoC requirements for plumbing work",
    saSpecificAdvice: [
      "CoC is MANDATORY for all geyser installations",
      "CoC is MANDATORY for all electrical plumbing work",
      "Only registered plumbers can issue CoC",
      "Verify plumber registration with Plumbing Board of South Africa",
      "Keep CoC documentation for insurance purposes",
      "Without CoC, insurance claims are REJECTED",
      "CoC proves compliance with SANS standards",
      "CoC required for property transfers/sales",
      "Request CoC before paying plumber",
    ],
    standards: ["SANS 10254", "SANS 10142"],
    insuranceConsiderations: [
      "CoC is CRITICAL for insurance coverage",
      "Without CoC, all claims are rejected",
      "Keep CoC for entire property ownership",
      "Required for home sales/transfers",
    ],
    recommendedSuppliers: [
      "Registered plumbers (verify with Plumbing Board)",
      "Certified electricians",
    ],
    estimatedCost: { min: 0, max: 500, currency: "ZAR" },
    loadShedConsiderations: [],
    waterRestrictionTips: [],
  },
];

/**
 * Get guidance template for a specific scenario
 */
export function getGuidanceTemplate(templateId: string): SAGuidanceTemplate | null {
  return SA_GUIDANCE_TEMPLATES.find((template) => template.id === templateId) || null;
}

/**
 * Get all templates for a specific standard
 */
export function getTemplatesByStandard(standard: string): SAGuidanceTemplate[] {
  return SA_GUIDANCE_TEMPLATES.filter((template) =>
    template.standards.includes(standard)
  );
}

/**
 * Format guidance template as readable text
 */
export function formatGuidanceAsText(template: SAGuidanceTemplate): string {
  return `
# ${template.title}

**Scenario:** ${template.scenario}

## South African Specific Advice
${template.saSpecificAdvice.map((advice) => `- ${advice}`).join("\n")}

## Applicable Standards
${template.standards.map((standard) => `- ${standard}`).join("\n")}

## Insurance Considerations
${template.insuranceConsiderations.map((consideration) => `- ${consideration}`).join("\n")}

## Recommended Suppliers
${template.recommendedSuppliers.map((supplier) => `- ${supplier}`).join("\n")}

## Estimated Cost
R${template.estimatedCost.min.toLocaleString()} - R${template.estimatedCost.max.toLocaleString()} ${template.estimatedCost.currency}

## Load-Shedding Considerations
${template.loadShedConsiderations.length > 0 ? template.loadShedConsiderations.map((consideration) => `- ${consideration}`).join("\n") : "- No specific load-shedding considerations"}

## Water Restriction Tips
${template.waterRestrictionTips.length > 0 ? template.waterRestrictionTips.map((tip) => `- ${tip}`).join("\n") : "- No specific water restriction tips"}
`;
}
