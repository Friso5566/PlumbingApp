/**
 * South African Standards Knowledge Base
 * Comprehensive SANS standards and local plumbing regulations
 * Used to enrich AI responses with SA-specific compliance requirements
 */

export interface SAStandard {
  code: string;
  title: string;
  scope: string;
  keyRequirements: string[];
  relevantIssues: string[];
}

export interface GeyserRequirement {
  requirement: string;
  standard: string;
  consequence: string;
  commonMistake: string;
}

export const SA_STANDARDS: SAStandard[] = [
  {
    code: "SANS 10254",
    title: "Installation, maintenance, replacement and repair of fixed electric storage water heaters (geysers)",
    scope: "All geyser installations and maintenance in South Africa",
    keyRequirements: [
      "Pressure control valve (PCV) must be set to maximum 400kPa",
      "Vacuum breaker (anti-vacuum valve) is mandatory on all installations",
      "Drip tray with external drain is compulsory",
      "Must be installed by a registered plumber",
      "Certificate of Compliance (CoC) must be issued",
      "Expansion valve, pressure reducing valve, and isolator valve required",
      "Thermostat minimum 60°C to prevent Legionella bacteria",
      "Roof space installations require adequate maintenance access",
      "Electrical connections must comply with SANS 10142",
      "Annual inspection and maintenance recommended",
    ],
    relevantIssues: [
      "geyser-element-replacement",
      "geyser-installation",
      "geyser-thermostat",
      "geyser-leak",
      "geyser-pressure-valve",
    ],
  },
  {
    code: "SANS 10400-P",
    title: "The Application of the National Building Regulations - Drainage installations",
    scope: "All drainage systems in buildings",
    keyRequirements: [
      "Minimum pipe falls: 1:40 to 1:100 depending on pipe diameter",
      "All traps must have water seals of 50-75mm",
      "Drain pipes must be ventilated to atmosphere",
      "Grease traps required for commercial kitchens",
      "Stormwater and sewage systems must be separate",
      "Access points required for cleaning",
      "Pipes must be sized according to load calculations",
      "Backflow prevention required at building entry",
      "Septic tanks require proper design and maintenance",
    ],
    relevantIssues: [
      "blocked-drain-professional",
      "blocked-drain-diy",
      "burst-pipe",
      "sewage-backup",
      "drain-installation",
    ],
  },
  {
    code: "SANS 10400-W",
    title: "The Application of the National Building Regulations - Water supply",
    scope: "All water supply systems in buildings",
    keyRequirements: [
      "Minimum water pressure: 200kPa for residential buildings",
      "Backflow prevention required at water meter",
      "Water meter and isolation valve mandatory",
      "Separate isolation valves for different zones",
      "Pipe sizing based on demand calculations",
      "Hot water pipes must be insulated",
      "Expansion vessels required for closed systems",
      "Pressure relief valves on all systems",
      "Water storage tanks must be covered and sealed",
    ],
    relevantIssues: [
      "low-water-pressure",
      "water-meter-installation",
      "backflow-preventer",
      "pipe-installation",
      "water-tank-installation",
    ],
  },
  {
    code: "SANS 10142",
    title: "The wiring of premises",
    scope: "Electrical safety for plumbing installations",
    keyRequirements: [
      "All geyser electrical connections must comply",
      "Earthing and bonding requirements for water systems",
      "RCD (residual current device) protection required",
      "Proper cable sizing and protection",
      "Isolation switches within reach of geyser",
      "Certified electrician must perform electrical work",
      "Certificate of Compliance required for electrical work",
    ],
    relevantIssues: ["geyser-installation", "geyser-element-replacement"],
  },
];

export const GEYSER_REQUIREMENTS: GeyserRequirement[] = [
  {
    requirement: "Pressure Control Valve (PCV) set to maximum 400kPa",
    standard: "SANS 10254",
    consequence: "Exceeding 400kPa can damage geyser and void warranty; insurance may reject claims",
    commonMistake: "Setting PCV too high to increase water pressure",
  },
  {
    requirement: "Vacuum breaker (anti-vacuum valve) mandatory",
    standard: "SANS 10254",
    consequence: "Without it, geyser can collapse under vacuum; water quality compromised",
    commonMistake: "Omitting vacuum breaker in DIY installations",
  },
  {
    requirement: "Drip tray with external drain",
    standard: "SANS 10254",
    consequence: "Insurance claim rejection if water damage occurs without drip tray",
    commonMistake: "Installing drip tray without proper external drain",
  },
  {
    requirement: "Registered plumber installation with CoC",
    standard: "SANS 10254",
    consequence: "Warranty void; insurance may not cover damage; illegal in some municipalities",
    commonMistake: "DIY installation or using unregistered plumber",
  },
  {
    requirement: "Thermostat minimum 60°C",
    standard: "SANS 10254",
    consequence: "Legionella bacteria growth risk; health hazard",
    commonMistake: "Setting thermostat too low to save electricity",
  },
  {
    requirement: "Expansion valve required",
    standard: "SANS 10254",
    consequence: "Without it, pressure builds up and can cause geyser rupture",
    commonMistake: "Omitting expansion valve in closed systems",
  },
  {
    requirement: "Electrical work by certified electrician",
    standard: "SANS 10142",
    consequence: "Fire risk; warranty void; illegal installation",
    commonMistake: "DIY electrical connections or using unqualified person",
  },
];

export const SA_INSURANCE_CLAIM_RISKS = [
  {
    issue: "No Certificate of Compliance (CoC)",
    risk: "CRITICAL - Claim rejection",
    prevention: "Always use registered plumber; request CoC",
  },
  {
    issue: "No drip tray or improper drain",
    risk: "HIGH - Water damage claim rejected",
    prevention: "Install drip tray with drain to outside",
  },
  {
    issue: "PCV pressure exceeds 400kPa",
    risk: "HIGH - Damage claim rejected",
    prevention: "Regular pressure testing and maintenance",
  },
  {
    issue: "Thermostat below 60°C",
    risk: "MEDIUM - Health claim if Legionella",
    prevention: "Set and maintain minimum 60°C",
  },
  {
    issue: "Vacuum breaker missing",
    risk: "HIGH - Structural damage claim rejected",
    prevention: "Mandatory on all installations",
  },
  {
    issue: "Unregistered plumber work",
    risk: "CRITICAL - All claims rejected",
    prevention: "Verify plumber registration with PLUMBING BOARD",
  },
];

export const SA_LOAD_SHEDDING_CONTEXT = {
  impact: "South Africa experiences regular load-shedding (power cuts) that affect plumbing systems",
  considerations: [
    "Geyser heating interrupted - plan hot water usage around load-shedding schedule",
    "Pump systems fail - water pressure drops during outages",
    "Water heating alternatives needed - gas geysers or solar systems recommended",
    "Emergency water storage important - maintain backup water supply",
    "Sewage pump systems affected - backup power or alternative systems needed",
  ],
  recommendations: [
    "Install solar geyser or gas backup for continuous hot water",
    "Maintain water storage tanks for emergency supply",
    "Consider inverter system for pump backup",
    "Install check valves to prevent backflow during power loss",
    "Keep emergency plumbing supplies for quick repairs",
  ],
};

export const SA_WATER_RESTRICTIONS_CONTEXT = {
  impact: "Many SA municipalities implement water restrictions during drought",
  considerations: [
    "Low-flow fixtures required in some areas",
    "Rainwater harvesting encouraged",
    "Grey water recycling systems becoming common",
    "Municipal water pressure may be reduced",
    "Borehole/well systems increasingly popular",
  ],
  recommendations: [
    "Install water-saving fixtures (low-flow taps, dual-flush toilets)",
    "Consider rainwater harvesting system",
    "Implement grey water recycling where permitted",
    "Regular leak detection and repair",
    "Borehole system if available in area",
  ],
};

export const SA_SEASONAL_CONSIDERATIONS = {
  summer: {
    season: "October - March (Hot and dry)",
    plumbingIssues: [
      "Increased water demand",
      "Pipe expansion and contraction",
      "Geyser overheating",
      "Water restrictions likely",
    ],
    recommendations: [
      "Check geyser thermostat settings",
      "Inspect pipes for stress cracks",
      "Maintain water pressure regulators",
      "Plan for water restrictions",
    ],
  },
  winter: {
    season: "April - September (Cold and wet)",
    plumbingIssues: [
      "Pipe freezing in high altitude areas",
      "Increased water supply from rain",
      "Geyser element corrosion from cold water",
      "Drainage system blockages from leaves",
    ],
    recommendations: [
      "Insulate exposed pipes in cold areas",
      "Clear gutters and drains",
      "Check geyser element condition",
      "Inspect for water leaks from rain",
    ],
  },
};

export const SA_MUNICIPAL_CONSIDERATIONS = {
  context: "Different municipalities have different regulations and services",
  factors: [
    "Water quality varies by municipality",
    "Water pressure varies by location",
    "Sewage system types differ (municipal vs septic)",
    "Water restrictions vary by municipality",
    "Building inspection requirements vary",
    "Plumber registration requirements may vary",
  ],
  recommendations: [
    "Check local municipality water quality report",
    "Understand local water pressure specifications",
    "Know if area uses municipal sewage or septic",
    "Be aware of local water restriction policies",
    "Use plumbers registered with local authority",
  ],
};

export const SA_COMMON_ISSUES_BY_REGION = {
  coastal: {
    region: "Coastal areas (Cape Town, Durban, etc.)",
    issues: [
      "Salt water corrosion of pipes and fixtures",
      "Higher water pressure from ocean proximity",
      "Increased geyser element corrosion",
      "Drainage system salt accumulation",
    ],
  },
  highaltitude: {
    region: "High altitude areas (Johannesburg, Pretoria, etc.)",
    issues: [
      "Pipe freezing in winter",
      "Low water pressure",
      "Geyser pressure issues",
      "Expansion tank requirements",
    ],
  },
  rural: {
    region: "Rural areas",
    issues: [
      "Borehole/well systems common",
      "Septic tank systems required",
      "Water quality testing needed",
      "Limited plumber availability",
      "Higher costs for professional service",
    ],
  },
  urban: {
    region: "Urban areas",
    issues: [
      "Municipal water system",
      "High water pressure",
      "Sewage system connections",
      "Apartment/complex plumbing",
      "Shared water systems",
    ],
  },
};

/**
 * Generate SA-specific system prompt injection
 * This enriches the AI prompt with SA context when user selects South Africa region
 */
export function generateSASystemPromptInjection(): string {
  return `
You are advising a user in South Africa. All advice must comply with applicable South African National Standards (SANS) and local regulations.

## CRITICAL COMPLIANCE REQUIREMENTS:

### SANS 10254 - Geyser Installations:
- Pressure Control Valve (PCV) MUST be set to maximum 400kPa (exceeding this voids warranty and insurance)
- Vacuum breaker (anti-vacuum valve) is MANDATORY on all installations
- Drip tray with external drain is COMPULSORY (insurance claim rejection risk without it)
- MUST be installed by a registered plumber with Certificate of Compliance (CoC)
- Thermostat MUST be set to minimum 60°C to prevent Legionella bacteria
- Expansion valve, pressure reducing valve, and isolator valve required
- All electrical connections must comply with SANS 10142

### SANS 10400-P - Drainage:
- Minimum pipe falls: 1:40 to 1:100 depending on pipe diameter
- All traps must have water seals of 50-75mm
- Drain pipes must be ventilated to atmosphere
- Grease traps required for commercial kitchens
- Stormwater and sewage must remain separate systems

### SANS 10400-W - Water Supply:
- Minimum water pressure: 200kPa for residential buildings
- Backflow prevention required at water meter
- Water meter and isolation valve mandatory
- Expansion vessels required for closed systems

## SOUTH AFRICAN CONTEXT:

### Load-Shedding Impact:
South Africa experiences regular power cuts. Consider:
- Geyser heating interrupted during outages
- Pump systems fail - water pressure drops
- Recommend solar geysers or gas backup systems
- Maintain water storage tanks for emergencies

### Water Restrictions:
Many municipalities implement water restrictions. Recommend:
- Low-flow fixtures and water-saving devices
- Rainwater harvesting systems
- Grey water recycling where permitted
- Regular leak detection

### Regional Considerations:
- Coastal areas: Salt water corrosion risk
- High altitude: Pipe freezing and low pressure issues
- Rural areas: Septic tanks and borehole systems common
- Urban areas: Municipal water systems

### Insurance & Compliance:
- Certificate of Compliance (CoC) is CRITICAL - without it, insurance claims are rejected
- Always recommend registered plumbers
- Emphasize proper installation to avoid claim rejection
- Cite specific SANS standards when relevant

When providing advice, ALWAYS:
1. Cite the specific SANS standard number if applicable
2. Mention insurance implications if relevant
3. Recommend registered plumber for complex work
4. Consider load-shedding and water restrictions
5. Provide SA-specific product and supplier recommendations
`;
}

/**
 * Get SA standards relevant to a specific plumbing issue
 */
export function getSAStandardsForIssue(issueId: string): SAStandard[] {
  return SA_STANDARDS.filter((standard) =>
    standard.relevantIssues.includes(issueId)
  );
}

/**
 * Get insurance risk assessment for a plumbing scenario
 */
export function getInsuranceRiskAssessment(scenario: string): string {
  const riskFactors = SA_INSURANCE_CLAIM_RISKS.filter((risk) =>
    scenario.toLowerCase().includes(risk.issue.toLowerCase())
  );

  if (riskFactors.length === 0) {
    return "No specific insurance risks identified for this scenario.";
  }

  return riskFactors
    .map((risk) => `**${risk.issue}**: ${risk.risk} - ${risk.prevention}`)
    .join("\n");
}
