/**
 * Kenya Plumbing Guidance Templates
 * Ready-to-use templates for common Kenya plumbing scenarios
 */

export interface KeGuidanceTemplate {
  id: string;
  title: string;
  scenario: string;
  keSpecificAdvice: string[];
  standards: string[];
  complianceConsiderations: string[];
  recommendedSuppliers: string[];
  estimatedCost: { min: number; max: number; currency: string };
  waterScarcityConsiderations: string[];
  conservationTips: string[];
}

export const KE_GUIDANCE_TEMPLATES: KeGuidanceTemplate[] = [
  {
    id: "water-tank-installation",
    title: "Water Tank Installation - Kenya Guide",
    scenario: "Installing a water storage tank for water rationing periods",
    keSpecificAdvice: [
      "Elevated or pressurized tank required by Building Code",
      "Tank must be KEBS certified",
      "Minimum 1000L capacity recommended for rationing",
      "Install overflow pipe to prevent overflow",
      "Cover tank to prevent algae growth and contamination",
      "Install inlet filter to prevent debris",
      "Install outlet valve with check valve",
      "Regular cleaning required (every 6 months)",
      "Water quality testing recommended annually",
      "Local authority inspection may be required",
    ],
    standards: ["KS 3404", "Kenya Building Code"],
    complianceConsiderations: [
      "Local authority inspection required",
      "Certificate of completion from plumber needed",
      "KEBS certified tank mandatory",
      "Proper installation ensures insurance coverage",
    ],
    recommendedSuppliers: [
      "Jojo Tanks Kenya",
      "Roto Tanks Kenya",
      "Nakumatt",
      "Carrefour Kenya",
    ],
    estimatedCost: { min: 8000, max: 15000, currency: "KES" },
    waterScarcityConsiderations: [
      "Essential for water rationing periods",
      "Allows water storage during supply hours",
      "Reduces reliance on municipal supply",
      "Supports emergency water needs",
    ],
    conservationTips: [
      "Use stored water wisely during rationing",
      "Implement water-efficient fixtures",
      "Monitor water usage",
      "Fix leaks immediately",
    ],
  },
  {
    id: "rainwater-harvesting",
    title: "Rainwater Harvesting System - Kenya Implementation",
    scenario: "Installing rainwater harvesting system for water independence",
    keSpecificAdvice: [
      "Encouraged by Water Act 2016 - sometimes subsidized",
      "Requires permit from Water Resources Authority",
      "Collect from roof area (calculate catchment area)",
      "Install first-flush diverter to remove debris",
      "Install filtration system for water quality",
      "Underground tank storage recommended",
      "Install overflow protection",
      "Water quality testing required before use",
      "Can provide 50-70% of water needs",
      "Regular maintenance essential",
    ],
    standards: ["Water Act 2016", "KS 3404"],
    complianceConsiderations: [
      "WRA permit required for system",
      "Water quality testing mandatory",
      "Proper installation ensures compliance",
      "Environmental standards must be met",
    ],
    recommendedSuppliers: [
      "Jojo Tanks Kenya",
      "Roto Tanks Kenya",
      "Nakumatt",
      "Jumia Home",
    ],
    estimatedCost: { min: 5000, max: 20000, currency: "KES" },
    waterScarcityConsiderations: [
      "Reduces municipal water dependency",
      "Provides water during rationing",
      "Supports long-term water security",
      "Reduces water bills significantly",
    ],
    conservationTips: [
      "Maximize roof catchment area",
      "Maintain system regularly",
      "Test water quality regularly",
      "Use harvested water wisely",
    ],
  },
  {
    id: "borehole-system",
    title: "Borehole System Installation - Kenya Requirements",
    scenario: "Drilling and installing a borehole for independent water supply",
    keSpecificAdvice: [
      "Obtain permit from Water Resources Authority (WRA) FIRST",
      "Hire licensed drilling contractor",
      "Typical depth: 20-100 meters",
      "Water quality testing required",
      "Yield testing (flow rate) required",
      "Install proper pump system",
      "Install storage tank",
      "Regular maintenance essential",
      "Annual water quality testing required",
      "Environmental compliance mandatory",
    ],
    standards: ["Water Act 2016", "KS 3404", "Environmental Management Act"],
    complianceConsiderations: [
      "WRA permit MANDATORY",
      "Licensed contractor required",
      "Water quality testing required",
      "Environmental impact assessment may be needed",
      "Local community consultation required",
    ],
    recommendedSuppliers: [
      "Licensed drilling contractors",
      "Nakumatt (pump supplies)",
      "Jojo Tanks Kenya (storage)",
      "Roto Tanks Kenya (storage)",
    ],
    estimatedCost: { min: 75000, max: 300000, currency: "KES" },
    waterScarcityConsiderations: [
      "Complete water independence",
      "No reliance on municipal supply",
      "Ideal for rural areas",
      "Long-term water security",
    ],
    conservationTips: [
      "Maintain pump system regularly",
      "Monitor water levels",
      "Implement water-efficient fixtures",
      "Plan maintenance schedule",
    ],
  },
  {
    id: "water-pressure-issue",
    title: "Low Water Pressure - Kenya Troubleshooting",
    scenario: "Dealing with low water pressure in Kenya",
    keSpecificAdvice: [
      "Check if municipal supply is rationing",
      "Verify water pressure is 200-500kPa (KS 3404)",
      "Check water meter valve is fully open",
      "Look for leaks in the system",
      "Inspect pressure reducing valve settings",
      "Check for pipe blockages or mineral deposits",
      "Consider installing pressure tank",
      "Install booster pump if needed",
      "Hard water may cause scaling",
      "Regular descaling maintenance needed",
    ],
    standards: ["KS 3404"],
    complianceConsiderations: [
      "Pressure must be 200-500kPa per standards",
      "Pressure reducing valve required if exceeding 500kPa",
      "Proper installation ensures compliance",
    ],
    recommendedSuppliers: [
      "Nakumatt",
      "Jacks Hardware",
      "Carrefour Kenya",
      "Local hardware stores",
    ],
    estimatedCost: { min: 2000, max: 25000, currency: "KES" },
    waterScarcityConsiderations: [
      "Low pressure may be due to rationing",
      "Plan water usage around supply hours",
      "Install storage tank for backup",
    ],
    conservationTips: [
      "Check for leaks regularly",
      "Use water-efficient fixtures",
      "Monitor water pressure",
      "Maintain system properly",
    ],
  },
  {
    id: "hard-water-treatment",
    title: "Hard Water Treatment - Kenya Solution",
    scenario: "Dealing with hard water and mineral deposits",
    keSpecificAdvice: [
      "Hard water common in Kenya",
      "Causes pipe scaling and fixture damage",
      "Install water softener system",
      "Use descaling agents regularly",
      "Choose mineral-resistant materials",
      "Regular pipe flushing recommended",
      "Brass fittings preferred over zinc alloy",
      "Water quality testing recommended",
      "Maintenance essential for longevity",
      "Consider reverse osmosis for drinking water",
    ],
    standards: ["KS 3405"],
    complianceConsiderations: [
      "Use KEBS certified materials",
      "Brass fittings recommended",
      "Proper treatment ensures system longevity",
    ],
    recommendedSuppliers: [
      "Nakumatt",
      "Carrefour Kenya",
      "Jumia Home",
      "Local hardware stores",
    ],
    estimatedCost: { min: 3000, max: 15000, currency: "KES" },
    waterScarcityConsiderations: [
      "Water softening reduces water usage",
      "Prevents fixture damage",
      "Extends system lifespan",
    ],
    conservationTips: [
      "Regular maintenance reduces waste",
      "Proper treatment saves water",
      "Monitor system performance",
    ],
  },
  {
    id: "septic-tank-system",
    title: "Septic Tank System - Kenya Installation",
    scenario: "Installing septic tank for areas without municipal sewage",
    keSpecificAdvice: [
      "Required for rural areas without municipal sewage",
      "NEMA compliance mandatory",
      "Professional installation required",
      "Regular pumping essential (every 3-5 years)",
      "Proper maintenance prevents overflow",
      "Install inspection access points",
      "Drain field must be properly sized",
      "Environmental standards must be met",
      "Water quality testing recommended",
      "Local authority approval may be needed",
    ],
    standards: ["Environmental Management Act", "KS 3404", "Kenya Building Code"],
    complianceConsiderations: [
      "NEMA environmental compliance required",
      "Local authority approval needed",
      "Professional installation mandatory",
      "Proper maintenance ensures compliance",
    ],
    recommendedSuppliers: [
      "Licensed plumbers",
      "Environmental contractors",
      "Local hardware stores",
    ],
    estimatedCost: { min: 30000, max: 80000, currency: "KES" },
    waterScarcityConsiderations: [
      "Proper treatment reduces environmental impact",
      "Enables greywater recycling",
      "Supports water conservation",
    ],
    conservationTips: [
      "Implement greywater recycling",
      "Use water-efficient fixtures",
      "Regular maintenance essential",
      "Proper disposal prevents contamination",
    ],
  },
  {
    id: "water-rationing-planning",
    title: "Water Rationing Planning - Kenya Strategy",
    scenario: "Planning plumbing system for water rationing periods",
    keSpecificAdvice: [
      "Understand local rationing schedule",
      "Install adequate water storage",
      "Plan water usage around schedule",
      "Implement water-efficient fixtures",
      "Install pressure tank for backup",
      "Maintain emergency water supply",
      "Regular system maintenance critical",
      "Monitor water quality",
      "Consider borehole as backup",
      "Prepare for extended rationing",
    ],
    standards: ["Water Act 2016", "KS 3404"],
    complianceConsiderations: [
      "Water conservation mandatory",
      "Proper system design ensures compliance",
      "Regular maintenance required",
    ],
    recommendedSuppliers: [
      "Jojo Tanks Kenya",
      "Roto Tanks Kenya",
      "Nakumatt",
      "Carrefour Kenya",
    ],
    estimatedCost: { min: 10000, max: 50000, currency: "KES" },
    waterScarcityConsiderations: [
      "Essential for water rationing periods",
      "Reduces impact of supply disruptions",
      "Enables water independence",
      "Supports household water security",
    ],
    conservationTips: [
      "Fill tanks during supply hours",
      "Use stored water wisely",
      "Implement water-efficient fixtures",
      "Monitor water usage",
      "Fix leaks immediately",
    ],
  },
  {
    id: "kebs-certification",
    title: "KEBS Certification - Kenya Compliance Guide",
    scenario: "Understanding KEBS certification requirements for plumbing",
    keSpecificAdvice: [
      "All materials MUST be KEBS certified",
      "Verify certification on product labels",
      "Buy from authorized suppliers only",
      "Request material certificates",
      "Plumber must be registered with KEBS",
      "Certificate of completion required",
      "Keep all documentation",
      "Insurance claims require KEBS compliance",
      "Non-compliance voids warranty",
      "Verification available on KEBS website",
    ],
    standards: ["KS 3404", "KS 3405", "Kenya Building Code"],
    complianceConsiderations: [
      "KEBS certification is MANDATORY",
      "Without certification, insurance claims rejected",
      "Proper documentation essential",
      "Keep all certificates",
    ],
    recommendedSuppliers: [
      "Authorized KEBS suppliers",
      "Nakumatt",
      "Carrefour Kenya",
      "Jacks Hardware",
    ],
    estimatedCost: { min: 0, max: 500, currency: "KES" },
    waterScarcityConsiderations: [],
    conservationTips: [],
  },
];

/**
 * Get guidance template for a specific scenario
 */
export function getKeGuidanceTemplate(templateId: string): KeGuidanceTemplate | null {
  return KE_GUIDANCE_TEMPLATES.find((template) => template.id === templateId) || null;
}

/**
 * Get all templates for a specific standard
 */
export function getKeTemplatesByStandard(standard: string): KeGuidanceTemplate[] {
  return KE_GUIDANCE_TEMPLATES.filter((template) =>
    template.standards.includes(standard)
  );
}

/**
 * Format guidance template as readable text
 */
export function formatKeGuidanceAsText(template: KeGuidanceTemplate): string {
  return `
# ${template.title}

**Scenario:** ${template.scenario}

## Kenya-Specific Advice
${template.keSpecificAdvice.map((advice) => `- ${advice}`).join("\n")}

## Applicable Standards
${template.standards.map((standard) => `- ${standard}`).join("\n")}

## Compliance Considerations
${template.complianceConsiderations.map((consideration) => `- ${consideration}`).join("\n")}

## Recommended Suppliers
${template.recommendedSuppliers.map((supplier) => `- ${supplier}`).join("\n")}

## Estimated Cost
KES ${template.estimatedCost.min.toLocaleString()} - KES ${template.estimatedCost.max.toLocaleString()} ${template.estimatedCost.currency}

## Water Scarcity Considerations
${template.waterScarcityConsiderations.length > 0 ? template.waterScarcityConsiderations.map((consideration) => `- ${consideration}`).join("\n") : "- No specific water scarcity considerations"}

## Conservation Tips
${template.conservationTips.length > 0 ? template.conservationTips.map((tip) => `- ${tip}`).join("\n") : "- No specific conservation tips"}
`;
}

/**
 * Get templates by water scarcity relevance
 */
export function getKeWaterScarcityTemplates(): KeGuidanceTemplate[] {
  return KE_GUIDANCE_TEMPLATES.filter(
    (template) => template.waterScarcityConsiderations.length > 0
  );
}

/**
 * Get templates by conservation relevance
 */
export function getKeConservationTemplates(): KeGuidanceTemplate[] {
  return KE_GUIDANCE_TEMPLATES.filter(
    (template) => template.conservationTips.length > 0
  );
}
