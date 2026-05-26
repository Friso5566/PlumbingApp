/**
 * Kenya Water Scarcity and Seasonal Context
 * Provides water shortage awareness, rationing guidance, and seasonal plumbing advice
 */

export interface WaterRationingSchedule {
  level: number;
  description: string;
  schedule: string;
  impact: string[];
  recommendations: string[];
}

export interface KeSeasonalGuidance {
  season: string;
  months: string[];
  waterAvailability: string;
  rainfall: string;
  temperature: string;
  plumbingChallenges: string[];
  recommendations: string[];
  maintenanceFocus: string[];
}

// Water Rationing Levels in Kenya
export const KE_WATER_RATIONING_LEVELS: Record<number, WaterRationingSchedule> = {
  0: {
    level: 0,
    description: "No rationing",
    schedule: "Normal supply",
    impact: [
      "Normal water supply",
      "No restrictions",
      "Regular pressure",
      "No emergency measures needed",
    ],
    recommendations: [
      "Maintain regular plumbing maintenance",
      "No special conservation needed",
      "Regular system checks",
    ],
  },
  1: {
    level: 1,
    description: "Mild rationing",
    schedule: "Odd/even day watering restrictions",
    impact: [
      "Slight pressure variations",
      "Watering restrictions",
      "No direct supply impact",
      "Minimal conservation needed",
    ],
    recommendations: [
      "Plan watering around schedule",
      "Maintain water storage tank",
      "Monitor water pressure",
    ],
  },
  2: {
    level: 2,
    description: "Moderate rationing",
    schedule: "Specific day restrictions (e.g., Monday-Wednesday off)",
    impact: [
      "Significant pressure drops",
      "Limited water availability",
      "Need for water storage",
      "Rationing schedule critical",
    ],
    recommendations: [
      "Fill water tanks before rationing days",
      "Use stored water during restrictions",
      "Implement water-efficient fixtures",
      "Plan activities around schedule",
    ],
  },
  3: {
    level: 3,
    description: "Severe rationing",
    schedule: "Severe restrictions (e.g., 3 days per week)",
    impact: [
      "Very low water pressure",
      "Limited water availability",
      "Heavy reliance on storage",
      "Sewage system stress",
    ],
    recommendations: [
      "Maximize water storage capacity",
      "Implement strict water conservation",
      "Use rainwater harvesting",
      "Consider borehole system",
    ],
  },
  4: {
    level: 4,
    description: "Critical rationing",
    schedule: "Critical shortage (e.g., 2 days per week)",
    impact: [
      "Severe water shortage",
      "Low pressure or no supply",
      "Sewage system failures likely",
      "Emergency measures required",
    ],
    recommendations: [
      "Emergency water storage essential",
      "Borehole system critical",
      "Rainwater harvesting essential",
      "Water trucking may be needed",
    ],
  },
};

// Kenya Seasonal Guidance
export const KE_SEASONAL_GUIDANCE: KeSeasonalGuidance[] = [
  {
    season: "Long Rains",
    months: ["March", "April", "May"],
    waterAvailability: "Good (high rainfall)",
    rainfall: "Heavy (200-400mm)",
    temperature: "Warm (20-25°C)",
    plumbingChallenges: [
      "Increased water supply",
      "Drainage system stress",
      "Flooding risk",
      "Pipe corrosion from moisture",
      "Algae growth in tanks",
    ],
    recommendations: [
      "Maintain drainage systems",
      "Clear gutters and downpipes",
      "Implement rainwater harvesting",
      "Check for leaks",
      "Maintain septic systems",
      "Install overflow protection",
    ],
    maintenanceFocus: [
      "Drainage cleaning",
      "Gutter maintenance",
      "Rainwater system setup",
      "Leak detection",
      "Septic tank inspection",
    ],
  },
  {
    season: "Dry Season",
    months: ["June", "July", "August", "September"],
    waterAvailability: "Poor (low rainfall)",
    rainfall: "Minimal (0-50mm)",
    temperature: "Cool to warm (15-25°C)",
    plumbingChallenges: [
      "Water shortage and rationing",
      "Low water pressure",
      "Borehole systems stressed",
      "Water tank depletion",
      "Pipe stress from pressure variations",
    ],
    recommendations: [
      "Maximize water storage",
      "Implement strict conservation",
      "Maintain borehole systems",
      "Use rainwater harvesting",
      "Plan water usage carefully",
      "Check for leaks",
    ],
    maintenanceFocus: [
      "Borehole maintenance",
      "Water tank inspection",
      "Pressure system testing",
      "Leak detection",
      "Water conservation setup",
    ],
  },
  {
    season: "Short Rains",
    months: ["October", "November"],
    waterAvailability: "Moderate (moderate rainfall)",
    rainfall: "Moderate (100-200mm)",
    temperature: "Warm (20-28°C)",
    plumbingChallenges: [
      "Moderate water supply",
      "Transition period",
      "Drainage system activity",
      "Pipe stress from pressure changes",
    ],
    recommendations: [
      "Prepare for dry season",
      "Maximize water storage",
      "Maintain rainwater systems",
      "Check all systems",
      "Plan for upcoming dry season",
    ],
    maintenanceFocus: [
      "System inspection",
      "Tank maintenance",
      "Pressure testing",
      "Drainage check",
    ],
  },
  {
    season: "Hot Dry Season",
    months: ["December", "January", "February"],
    waterAvailability: "Very poor (very low rainfall)",
    rainfall: "Very low (0-25mm)",
    temperature: "Hot (25-35°C)",
    plumbingChallenges: [
      "Severe water shortage",
      "Extreme heat stress on pipes",
      "PVC pipe degradation",
      "Water tank algae growth",
      "Borehole stress",
      "Critical rationing likely",
    ],
    recommendations: [
      "Critical water conservation",
      "Maintain emergency water supply",
      "Protect exposed pipes from sun",
      "Maintain borehole systems",
      "Implement all conservation measures",
      "Consider water trucking",
    ],
    maintenanceFocus: [
      "Pipe protection",
      "Tank cleaning",
      "Borehole maintenance",
      "System stress monitoring",
      "Emergency preparedness",
    ],
  },
];

// Water Conservation Strategies for Kenya
export const KE_WATER_CONSERVATION_STRATEGIES = {
  fixtures: {
    name: "Water-Efficient Fixtures",
    impact: "Reduce water usage by 30-50%",
    options: [
      "6L/min taps (vs 12L/min standard)",
      "Dual-flush toilets (3L/6L vs 9L standard)",
      "Low-flow showerheads (6L/min)",
      "Sensor-activated taps",
      "Aerators on all taps",
    ],
    cost: "KES 2,000 - 10,000",
    savings: "KES 500 - 2,000 per month",
  },
  rainwater: {
    name: "Rainwater Harvesting",
    impact: "Provide 50-70% of water needs",
    options: [
      "Roof catchment systems",
      "Underground tanks",
      "Filtration systems",
      "First-flush diverters",
      "Overflow management",
    ],
    cost: "KES 5,000 - 20,000",
    savings: "KES 1,000 - 5,000 per month",
  },
  greywater: {
    name: "Greywater Recycling",
    impact: "Reduce freshwater usage by 30%",
    options: [
      "Shower water to garden",
      "Washing machine water to garden",
      "Sink water to toilet flushing",
      "Greywater treatment systems",
    ],
    cost: "KES 3,000 - 15,000",
    savings: "KES 500 - 2,000 per month",
  },
  borehole: {
    name: "Borehole System",
    impact: "Independent water supply",
    options: [
      "Shallow borehole (20-30m)",
      "Deep borehole (50-100m)",
      "Pump system",
      "Storage tank",
      "Water treatment",
    ],
    cost: "KES 50,000 - 200,000",
    savings: "KES 2,000 - 10,000 per month",
  },
  behavior: {
    name: "Behavioral Changes",
    impact: "Reduce usage by 20-30%",
    options: [
      "Shorter showers",
      "Fix leaks immediately",
      "Turn off taps while brushing teeth",
      "Full loads for washing",
      "Collect water while heating",
    ],
    cost: "KES 0",
    savings: "KES 500 - 2,000 per month",
  },
};

// Borehole and Well Systems in Kenya
export const KE_BOREHOLE_GUIDANCE = {
  permits: [
    "Obtain permit from Water Resources Authority (WRA)",
    "Environmental impact assessment may be required",
    "Local community consultation needed",
    "Drilling license required",
  ],
  drilling: [
    "Hire licensed drilling contractor",
    "Typical depth: 20-100 meters",
    "Cost: KES 50,000 - 200,000",
    "Drilling time: 2-7 days",
  ],
  testing: [
    "Water quality testing required",
    "Yield testing (flow rate)",
    "Depth and capacity assessment",
    "Regular testing recommended",
  ],
  maintenance: [
    "Annual inspection",
    "Pump maintenance every 6 months",
    "Water quality testing annually",
    "Filter replacement as needed",
    "Electrical system maintenance",
  ],
  costs: {
    drilling: "KES 50,000 - 200,000",
    pump: "KES 15,000 - 50,000",
    tank: "KES 8,000 - 20,000",
    testing: "KES 2,000 - 5,000",
    annual_maintenance: "KES 3,000 - 10,000",
  },
};

// Water Rationing Emergency Measures
export const KE_EMERGENCY_WATER_MEASURES = [
  {
    scenario: "No water during rationing day",
    solutions: [
      "Use stored water from tank",
      "Collect water from public standpipe",
      "Use water trucking service",
      "Implement strict conservation",
      "Use borehole if available",
    ],
  },
  {
    scenario: "Low water pressure during supply hours",
    solutions: [
      "Fill water tanks during available hours",
      "Install pressure tank",
      "Install booster pump",
      "Check for leaks",
      "Maintain pressure system",
    ],
  },
  {
    scenario: "Sewage backup during water shortage",
    solutions: [
      "Stop using water during shortage",
      "Use portable toilet if available",
      "Maintain septic tank",
      "Install check valve",
      "Call professional plumber",
    ],
  },
  {
    scenario: "Contaminated water supply",
    solutions: [
      "Stop using supply immediately",
      "Use alternative water source",
      "Get water quality testing",
      "Boil water if necessary",
      "Report to water authority",
    ],
  },
];

/**
 * Get water rationing guidance for Kenya
 */
export function getKeWaterRationingGuidance(level: number): string {
  const schedule = KE_WATER_RATIONING_LEVELS[level] || KE_WATER_RATIONING_LEVELS[0];

  return `
**Water Rationing Level ${schedule.level}: ${schedule.description}**

**Schedule:** ${schedule.schedule}

**Impact on Water Supply:**
${schedule.impact.map((impact) => `- ${impact}`).join("\n")}

**Recommendations:**
${schedule.recommendations.map((rec) => `- ${rec}`).join("\n")}

**Action Items:**
1. Maintain water storage tank
2. Implement water conservation
3. Monitor water pressure
4. Plan water usage around schedule
5. Consider borehole/rainwater system
`;
}

/**
 * Get seasonal plumbing guidance for Kenya
 */
export function getKeSeasonalGuidance(month: number): KeSeasonalGuidance | null {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[month - 1];

  return (
    KE_SEASONAL_GUIDANCE.find((guidance) =>
      guidance.months.includes(monthName)
    ) || null
  );
}

/**
 * Get water conservation recommendations
 */
export function getKeWaterConservationRecommendations(): string {
  return `
**Kenya Water Conservation Strategies**

${Object.values(KE_WATER_CONSERVATION_STRATEGIES)
  .map(
    (strategy) => `
**${strategy.name}**
Impact: ${strategy.impact}
Cost: ${strategy.cost}
Monthly Savings: ${strategy.savings}

Options:
${strategy.options.map((opt) => `- ${opt}`).join("\n")}
`
  )
  .join("\n")}

**Recommended Priority:**
1. Fix all leaks immediately
2. Install water-efficient fixtures
3. Implement rainwater harvesting
4. Consider greywater recycling
5. Behavioral changes
`;
}

/**
 * Get borehole system guidance
 */
export function getKeBoreholeSystemGuidance(): string {
  return `
**Kenya Borehole System Guide**

**Permits Required:**
${KE_BOREHOLE_GUIDANCE.permits.map((p) => `- ${p}`).join("\n")}

**Drilling Process:**
${KE_BOREHOLE_GUIDANCE.drilling.map((d) => `- ${d}`).join("\n")}

**Testing Requirements:**
${KE_BOREHOLE_GUIDANCE.testing.map((t) => `- ${t}`).join("\n")}

**Maintenance Schedule:**
${KE_BOREHOLE_GUIDANCE.maintenance.map((m) => `- ${m}`).join("\n")}

**Cost Breakdown (KES):**
- Drilling: ${KE_BOREHOLE_GUIDANCE.costs.drilling}
- Pump: ${KE_BOREHOLE_GUIDANCE.costs.pump}
- Tank: ${KE_BOREHOLE_GUIDANCE.costs.tank}
- Testing: ${KE_BOREHOLE_GUIDANCE.costs.testing}
- Annual Maintenance: ${KE_BOREHOLE_GUIDANCE.costs.annual_maintenance}

**Total Initial Cost:** KES 75,000 - 475,000
**Annual Operating Cost:** KES 3,000 - 10,000
`;
}

/**
 * Get emergency water shortage guidance
 */
export function getKeEmergencyWaterGuidance(scenario: string): string {
  const emergency = KE_EMERGENCY_WATER_MEASURES.find((e) =>
    e.scenario.toLowerCase().includes(scenario.toLowerCase())
  );

  if (!emergency) {
    return "No specific emergency guidance found. Contact water authority or professional plumber.";
  }

  return `
**${emergency.scenario}**

**Solutions:**
${emergency.solutions.map((solution) => `- ${solution}`).join("\n")}
`;
}

/**
 * Get water conservation checklist
 */
export function getKeWaterConservationChecklist(): string {
  return `
**Kenya Water Conservation Checklist**

**Immediate Actions:**
- [ ] Fix all leaks (dripping taps, burst pipes)
- [ ] Install aerators on all taps
- [ ] Check water pressure (should be 200-500kPa)
- [ ] Inspect water tank for leaks
- [ ] Check for illegal connections

**Short-term (1-3 months):**
- [ ] Install water-efficient fixtures (6L/min taps)
- [ ] Install dual-flush toilets
- [ ] Install low-flow showerheads
- [ ] Plan rainwater harvesting system
- [ ] Assess greywater recycling potential

**Medium-term (3-12 months):**
- [ ] Install rainwater harvesting system
- [ ] Implement greywater recycling
- [ ] Install water storage tank
- [ ] Maintain water quality testing
- [ ] Establish water conservation habits

**Long-term (1+ years):**
- [ ] Consider borehole system
- [ ] Install pressure tank
- [ ] Implement smart water monitoring
- [ ] Upgrade all fixtures to water-efficient
- [ ] Achieve water independence

**Monthly Actions:**
- [ ] Check water meter for leaks
- [ ] Test water pressure
- [ ] Inspect tank for algae
- [ ] Maintain borehole system
- [ ] Review water usage
`;
}
