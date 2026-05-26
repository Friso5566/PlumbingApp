/**
 * Kenya Plumbing Standards Knowledge Base
 * Comprehensive standards, regulations, and best practices for Kenya
 */

export interface KeStandard {
  code: string;
  title: string;
  description: string;
  keyRequirements: string[];
  relevantIssues: string[];
  enforcementBody: string;
}

export interface KeWaterSupplyRequirement {
  requirement: string;
  standard: string;
  consequence: string;
  affectsInsurance: boolean;
}

export interface KeInsuranceRisk {
  issue: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  consequence: string;
  prevention: string[];
}

// Kenya Building Code and Standards
export const KE_STANDARDS: KeStandard[] = [
  {
    code: "KS 3404",
    title: "Kenya Standard for Water Supply and Drainage",
    description:
      "Comprehensive standard for water supply systems, drainage installations, and plumbing fixtures in Kenya",
    keyRequirements: [
      "Minimum water pressure: 200kPa for residential buildings",
      "Maximum water pressure: 500kPa (pressure reducing valve required above this)",
      "Backflow prevention required at water meter",
      "Water meter and isolation valve mandatory",
      "All pipes must be accessible for maintenance",
      "Drain pipes must have minimum fall of 1:40",
      "Ventilation of drain pipes to atmosphere required",
      "Grease traps required for commercial establishments",
      "Stormwater and sewage must remain separate",
      "All materials must be approved for Kenya climate",
    ],
    relevantIssues: [
      "water-supply-installation",
      "drainage-system",
      "backflow-prevention",
      "water-pressure",
    ],
    enforcementBody: "Kenya Bureau of Standards (KEBS)",
  },
  {
    code: "KS 3405",
    title: "Kenya Standard for Plumbing Materials and Fixtures",
    description:
      "Standard for plumbing materials, fixtures, and fittings used in Kenya",
    keyRequirements: [
      "All materials must be KEBS certified",
      "Pipes must be corrosion-resistant for Kenya's water quality",
      "Brass fittings preferred over zinc alloy (zinc leaching risk)",
      "PVC pipes must be UV-resistant",
      "Copper pipes acceptable but expensive",
      "All fixtures must be water-efficient (6L/min taps)",
      "Ceramic disc cartridges required for durability",
      "All materials must withstand Kenya's temperature variations",
      "Stainless steel components for coastal areas",
    ],
    relevantIssues: [
      "pipe-selection",
      "fixture-installation",
      "material-quality",
      "water-efficiency",
    ],
    enforcementBody: "Kenya Bureau of Standards (KEBS)",
  },
  {
    code: "Kenya Building Code",
    title: "Kenya National Building Code",
    description:
      "National building code covering construction standards including plumbing",
    keyRequirements: [
      "Plumbing work must be done by registered plumbers",
      "All installations must comply with KS 3404 and KS 3405",
      "Water tanks must be elevated or pressurized",
      "Septic tanks required for areas without municipal sewage",
      "Rainwater harvesting systems encouraged",
      "Water conservation measures mandatory in new buildings",
      "All work must be inspected by local authority",
      "Certificate of completion required from plumber",
    ],
    relevantIssues: [
      "new-construction",
      "renovation",
      "water-tank-installation",
      "septic-system",
    ],
    enforcementBody: "Ministry of Lands, Housing and Urban Development",
  },
  {
    code: "Water Act 2016",
    title: "Kenya Water Act 2016",
    description:
      "National legislation governing water resources and supply management",
    keyRequirements: [
      "Water conservation is mandatory",
      "Rainwater harvesting is encouraged and sometimes subsidized",
      "Borehole drilling requires permit from Water Resources Authority",
      "Water quality testing required for private water sources",
      "Wastewater treatment required before discharge",
      "Water metering required for all connections",
      "Water rationing may be enforced during drought",
      "Illegal water connections are criminal offense",
    ],
    relevantIssues: [
      "water-conservation",
      "rainwater-harvesting",
      "borehole-drilling",
      "water-rationing",
    ],
    enforcementBody: "Water Resources Authority (WRA)",
  },
  {
    code: "Environmental Management Act",
    title: "Kenya Environmental Management Act",
    description: "Legislation covering environmental protection including wastewater",
    keyRequirements: [
      "Wastewater must be treated before discharge",
      "Septic tanks must meet environmental standards",
      "Greywater recycling encouraged",
      "No pollution of water sources",
      "Environmental impact assessment for large installations",
      "Proper waste disposal from plumbing work",
    ],
    relevantIssues: [
      "wastewater-treatment",
      "environmental-compliance",
      "greywater-recycling",
    ],
    enforcementBody: "National Environment Management Authority (NEMA)",
  },
];

// Water Supply Requirements for Kenya
export const WATER_SUPPLY_REQUIREMENTS: KeWaterSupplyRequirement[] = [
  {
    requirement: "Water pressure between 200-500kPa",
    standard: "KS 3404",
    consequence: "Low pressure affects water flow; high pressure damages fixtures",
    affectsInsurance: true,
  },
  {
    requirement: "Pressure reducing valve if pressure exceeds 500kPa",
    standard: "KS 3404",
    consequence: "Burst pipes and fixture damage if not installed",
    affectsInsurance: true,
  },
  {
    requirement: "Backflow prevention at water meter",
    standard: "KS 3404",
    consequence: "Contamination of municipal water supply",
    affectsInsurance: false,
  },
  {
    requirement: "Water meter and isolation valve",
    standard: "KS 3404",
    consequence: "Cannot measure usage or shut off water in emergency",
    affectsInsurance: true,
  },
  {
    requirement: "All pipes accessible for maintenance",
    standard: "KS 3404",
    consequence: "Cannot repair leaks or maintain system",
    affectsInsurance: true,
  },
  {
    requirement: "KEBS certified materials only",
    standard: "KS 3405",
    consequence: "Material failure and water contamination",
    affectsInsurance: true,
  },
  {
    requirement: "Water-efficient fixtures (6L/min taps)",
    standard: "KS 3405",
    consequence: "Violation of water conservation regulations",
    affectsInsurance: false,
  },
];

// Insurance and Compliance Risks in Kenya
export const KE_INSURANCE_CLAIM_RISKS: KeInsuranceRisk[] = [
  {
    issue: "No registered plumber certificate",
    riskLevel: "CRITICAL",
    consequence: "Insurance claims rejected; work not recognized by authorities",
    prevention: [
      "Always use registered plumber",
      "Verify plumber registration with KEBS",
      "Request certificate of completion",
      "Keep all documentation",
    ],
  },
  {
    issue: "Non-KEBS certified materials used",
    riskLevel: "CRITICAL",
    consequence: "Material failure voids warranty and insurance coverage",
    prevention: [
      "Use only KEBS certified materials",
      "Check certification labels",
      "Buy from authorized suppliers",
      "Request material certificates",
    ],
  },
  {
    issue: "Improper water pressure installation",
    riskLevel: "HIGH",
    consequence: "Burst pipes and water damage not covered",
    prevention: [
      "Install pressure reducing valve if needed",
      "Test pressure regularly",
      "Maintain pressure between 200-500kPa",
      "Annual inspection recommended",
    ],
  },
  {
    issue: "Illegal borehole drilling without permit",
    riskLevel: "HIGH",
    consequence: "Legal penalties and insurance claim rejection",
    prevention: [
      "Obtain WRA permit before drilling",
      "Use licensed drilling contractor",
      "Water quality testing required",
      "Keep permit documentation",
    ],
  },
  {
    issue: "Wastewater discharge without treatment",
    riskLevel: "HIGH",
    consequence: "Environmental penalties and insurance issues",
    prevention: [
      "Install proper septic tank",
      "Maintain septic system regularly",
      "Treat wastewater before discharge",
      "Comply with NEMA requirements",
    ],
  },
  {
    issue: "Water tank installation without inspection",
    riskLevel: "MEDIUM",
    consequence: "Contamination risk and insurance claim issues",
    prevention: [
      "Get local authority inspection",
      "Use elevated or pressurized tanks",
      "Regular tank cleaning",
      "Keep inspection certificates",
    ],
  },
  {
    issue: "Rainwater harvesting system not certified",
    riskLevel: "MEDIUM",
    consequence: "Water quality issues and insurance concerns",
    prevention: [
      "Use certified rainwater systems",
      "Install proper filtration",
      "Regular water quality testing",
      "Maintain system properly",
    ],
  },
];

// Kenya-specific plumbing challenges
export const KE_PLUMBING_CHALLENGES = {
  waterQuality: {
    issue: "Hard water and mineral deposits",
    impact: [
      "Pipe scaling and reduced flow",
      "Fixture damage and staining",
      "Water heater efficiency reduced",
      "Increased maintenance needs",
    ],
    solutions: [
      "Install water softener system",
      "Use descaling agents regularly",
      "Choose mineral-resistant materials",
      "Regular pipe flushing",
    ],
  },
  waterScarcity: {
    issue: "Seasonal water shortage and rationing",
    impact: [
      "Low water pressure",
      "Rationing schedules",
      "Increased reliance on stored water",
      "Borehole systems popular",
    ],
    solutions: [
      "Install water storage tanks",
      "Implement rainwater harvesting",
      "Use water-efficient fixtures",
      "Maintain borehole systems",
      "Plan water usage around rationing",
    ],
  },
  climate: {
    issue: "High temperatures and UV exposure",
    impact: [
      "PVC pipe degradation",
      "Rapid water heating",
      "Algae growth in tanks",
      "Material brittleness",
    ],
    solutions: [
      "Use UV-resistant PVC pipes",
      "Insulate exposed pipes",
      "Cover water tanks",
      "Choose durable materials",
      "Regular maintenance",
    ],
  },
  infrastructure: {
    issue: "Inconsistent municipal water supply",
    impact: [
      "Pressure fluctuations",
      "Contamination risk",
      "System stress",
      "Need for backup systems",
    ],
    solutions: [
      "Install pressure tank",
      "Install check valve",
      "Maintain backup water source",
      "Regular system inspection",
      "Water quality testing",
    ],
  },
  materials: {
    issue: "Limited availability of some materials",
    impact: [
      "Higher costs for imports",
      "Longer delivery times",
      "Quality variations",
      "Need for alternatives",
    ],
    solutions: [
      "Use locally available materials",
      "Plan ahead for special items",
      "Build relationships with suppliers",
      "Know alternative products",
    ],
  },
};

// Kenya-specific best practices
export const KE_BEST_PRACTICES = [
  "Always use registered plumbers - verify with KEBS",
  "Specify KEBS certified materials in all work",
  "Install pressure reducing valve if municipal pressure exceeds 500kPa",
  "Use brass fittings instead of zinc alloy (zinc leaching in Kenya water)",
  "Install water storage tank for rationing periods",
  "Implement rainwater harvesting where possible",
  "Use water-efficient fixtures (6L/min taps, dual-flush toilets)",
  "Regular water quality testing for private sources",
  "Maintain septic system properly if not on municipal sewage",
  "Get local authority inspection for all new installations",
  "Use UV-resistant PVC pipes for exposed areas",
  "Install check valve to prevent backflow",
  "Plan maintenance around water rationing schedule",
  "Keep all certificates and documentation",
  "Build relationships with reliable suppliers",
];

/**
 * Generate Kenya system prompt injection
 */
export function generateKeSystemPromptInjection(): string {
  return `
You are an expert professional plumber with decades of experience working in Kenya. You understand Kenya's plumbing standards, regulations, water challenges, and local conditions.

## CRITICAL COMPLIANCE REQUIREMENTS FOR KENYA:

### KS 3404 - Water Supply and Drainage Standard:
- Water pressure MUST be between 200-500kPa (pressure reducing valve required if exceeding 500kPa)
- Backflow prevention MUST be installed at water meter
- Water meter and isolation valve are MANDATORY
- Drain pipes must have minimum fall of 1:40
- All drain pipes must be ventilated to atmosphere
- Grease traps required for commercial establishments
- Stormwater and sewage must remain separate systems
- All materials must be KEBS certified

### KS 3405 - Plumbing Materials and Fixtures:
- All materials MUST be KEBS certified
- Brass fittings preferred over zinc alloy (zinc leaching risk in Kenya water)
- PVC pipes MUST be UV-resistant for Kenya's sun exposure
- All fixtures MUST be water-efficient (6L/min taps maximum)
- Ceramic disc cartridges required for durability
- Stainless steel components recommended for coastal areas

### Kenya Building Code Requirements:
- Plumbing work MUST be done by registered plumber
- Certificate of completion required from plumber
- All installations must comply with KS 3404 and KS 3405
- Water tanks must be elevated or pressurized
- Local authority inspection required for new installations
- Septic tanks required for areas without municipal sewage

### Water Act 2016 - Water Conservation Mandatory:
- Water conservation is MANDATORY in all installations
- Rainwater harvesting is encouraged and sometimes subsidized
- Borehole drilling requires permit from Water Resources Authority (WRA)
- Water quality testing required for private water sources
- Water metering required for all connections
- Water rationing may be enforced during drought periods

### Environmental Compliance:
- Wastewater must be treated before discharge (NEMA requirement)
- Septic tanks must meet environmental standards
- Greywater recycling encouraged where permitted
- No pollution of water sources allowed

## KENYA-SPECIFIC CONTEXT & CONDITIONS:

### Water Scarcity & Rationing:
Kenya experiences seasonal water shortages and municipal rationing:
- Recommend water storage tanks (elevated or pressurized)
- Suggest rainwater harvesting systems
- Implement water-efficient fixtures
- Plan maintenance around rationing schedules
- Borehole systems popular in water-scarce areas

### Water Quality Challenges:
- Hard water and mineral deposits common
- Recommend water softener systems
- Regular descaling maintenance needed
- Choose mineral-resistant materials
- Water quality testing recommended for private sources

### Climate Considerations:
- High temperatures cause rapid water heating
- UV exposure degrades PVC pipes - use UV-resistant materials
- Algae growth in water tanks - cover tanks properly
- Material brittleness from heat - choose durable materials
- Insulate exposed pipes to prevent heat loss

### Regional Variations:
- Nairobi/Mombasa: Better infrastructure, higher material costs
- Rural areas: Septic tanks and boreholes common, limited supplier access
- Coastal areas: Salt water corrosion risk - use stainless steel
- High altitude areas: Low pressure issues, cold water

### Insurance & Compliance:
- Certificate from registered plumber is CRITICAL
- KEBS certification of materials is MANDATORY
- Without proper documentation, insurance claims are REJECTED
- Keep all certificates and inspection reports
- Verify plumber registration with KEBS

### Trusted Kenya Suppliers:
- Nakumatt (national chain)
- Carrefour Kenya (major retailer)
- Jumia Home (online)
- Local plumbing supply shops
- Hardware stores in major cities

### Trusted Brands in Kenya:
- Taps: Grohe, Kohler, Delabie, Bristan
- Pipes: Marley, Iplex, Wavin, Polychem
- Pumps: Grundfos, Ebara, Pedrollo
- Valves: Caple, Watts, Flamco
- Water tanks: Jojo Tanks, Roto Tanks, Sintex

## RESPONSE GUIDELINES:

When providing advice, ALWAYS:
1. Cite the specific standard number (KS 3404, KS 3405, Building Code, Water Act)
2. Mention insurance implications if relevant
3. Recommend registered plumber for complex work (verify with KEBS)
4. Consider water scarcity and rationing schedules
5. Provide Kenya-specific product and supplier recommendations
6. Mention certificate of completion requirements
7. Reference local conditions (water quality, climate, infrastructure)
8. Use Kenyan Shilling (KES) for pricing when estimating costs
9. Address water conservation requirements
10. Consider borehole/rainwater harvesting alternatives
`;
}

/**
 * Get Kenya standards for a specific issue
 */
export function getKeStandardsForIssue(issue: string): KeStandard[] {
  return KE_STANDARDS.filter((standard) =>
    standard.relevantIssues.some((relevantIssue) =>
      relevantIssue.toLowerCase().includes(issue.toLowerCase())
    )
  );
}

/**
 * Get insurance risk assessment for Kenya scenario
 */
export function getKeInsuranceRiskAssessment(scenario: string): string {
  const risk = KE_INSURANCE_CLAIM_RISKS.find((r) =>
    r.issue.toLowerCase().includes(scenario.toLowerCase())
  );

  if (!risk) {
    return "No specific insurance risk found. Consult with insurance provider.";
  }

  return `
**Risk Level: ${risk.riskLevel}**

**Issue:** ${risk.issue}

**Consequence:** ${risk.consequence}

**Prevention Measures:**
${risk.prevention.map((p) => `- ${p}`).join("\n")}
`;
}

/**
 * Get Kenya plumbing challenge solutions
 */
export function getKePlumbingChallengeSolutions(
  challenge: keyof typeof KE_PLUMBING_CHALLENGES
): string {
  const challengeData = KE_PLUMBING_CHALLENGES[challenge];

  if (!challengeData) {
    return "Challenge not found in Kenya knowledge base.";
  }

  return `
**Challenge:** ${challengeData.issue}

**Impact:**
${challengeData.impact.map((i) => `- ${i}`).join("\n")}

**Solutions:**
${challengeData.solutions.map((s) => `- ${s}`).join("\n")}
`;
}

/**
 * Get all Kenya best practices
 */
export function getKeBestPractices(): string {
  return `
**Kenya Plumbing Best Practices**

${KE_BEST_PRACTICES.map((practice) => `- ${practice}`).join("\n")}
`;
}
