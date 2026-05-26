/**
 * South African Load-Shedding and Seasonal Context
 * Provides real-time load-shedding awareness and seasonal plumbing guidance
 */

export interface LoadShedSchedule {
  stage: number;
  hoursPerDay: number;
  description: string;
  impact: string[];
}

export interface SeasonalGuidance {
  season: string;
  months: string[];
  temperature: string;
  humidity: string;
  rainfall: string;
  plumbingChallenges: string[];
  recommendations: string[];
  maintenanceFocus: string[];
}

export const LOAD_SHEDDING_STAGES: Record<number, LoadShedSchedule> = {
  0: {
    stage: 0,
    hoursPerDay: 0,
    description: "No load-shedding",
    impact: [
      "Normal operations",
      "Geyser heating normal",
      "Pump systems operating normally",
      "No emergency measures needed",
    ],
  },
  1: {
    stage: 1,
    hoursPerDay: 1,
    description: "Stage 1 - 1 hour per day",
    impact: [
      "Minimal impact on plumbing",
      "Geyser heating slightly delayed",
      "Plan hot water usage around schedule",
      "Pump systems briefly interrupted",
    ],
  },
  2: {
    stage: 2,
    hoursPerDay: 2,
    description: "Stage 2 - 2 hours per day",
    impact: [
      "Noticeable hot water shortage",
      "Water pressure may drop",
      "Pump systems interrupted twice",
      "Consider alternative heating",
    ],
  },
  3: {
    stage: 3,
    hoursPerDay: 3,
    description: "Stage 3 - 3 hours per day",
    impact: [
      "Significant hot water shortage",
      "Water pressure issues",
      "Sewage pump systems affected",
      "Consider backup power systems",
    ],
  },
  4: {
    stage: 4,
    hoursPerDay: 4,
    description: "Stage 4 - 4 hours per day",
    impact: [
      "Major hot water shortage",
      "Water pressure problems",
      "Sewage backup risks",
      "Emergency backup power recommended",
    ],
  },
  5: {
    stage: 5,
    hoursPerDay: 5,
    description: "Stage 5 - 5 hours per day",
    impact: [
      "Critical hot water shortage",
      "Low water pressure",
      "Sewage system risks",
      "Backup power essential",
    ],
  },
  6: {
    stage: 6,
    hoursPerDay: 6,
    description: "Stage 6 - 6 hours per day",
    impact: [
      "Severe hot water shortage",
      "Very low water pressure",
      "Sewage backup likely",
      "Emergency measures required",
    ],
  },
  7: {
    stage: 7,
    hoursPerDay: 7,
    description: "Stage 7 - 7 hours per day",
    impact: [
      "Extreme hot water shortage",
      "Critical water pressure issues",
      "Sewage system failures likely",
      "Emergency backup power critical",
    ],
  },
  8: {
    stage: 8,
    hoursPerDay: 8,
    description: "Stage 8+ - 8+ hours per day",
    impact: [
      "Severe water supply disruption",
      "No hot water during outages",
      "Sewage system failures",
      "Emergency measures essential",
    ],
  },
};

export const SA_SEASONAL_GUIDANCE: SeasonalGuidance[] = [
  {
    season: "Summer",
    months: ["October", "November", "December", "January", "February", "March"],
    temperature: "Hot (25-35°C)",
    humidity: "Variable",
    rainfall: "Low to moderate",
    plumbingChallenges: [
      "Increased water demand",
      "Pipe expansion and contraction",
      "Geyser overheating",
      "Water restrictions likely",
      "High load-shedding risk",
    ],
    recommendations: [
      "Install solar geyser for hot water independence",
      "Maintain water storage tanks",
      "Install low-flow fixtures for restrictions",
      "Check geyser thermostat settings",
      "Inspect pipes for stress cracks",
      "Consider backup power for pumps",
    ],
    maintenanceFocus: [
      "Geyser element inspection",
      "Pressure valve testing",
      "Pipe integrity checks",
      "Water tank cleaning",
      "Pump system testing",
    ],
  },
  {
    season: "Autumn",
    months: ["April", "May"],
    temperature: "Warm (15-25°C)",
    humidity: "Decreasing",
    rainfall: "Moderate",
    plumbingChallenges: [
      "Transition period",
      "Leaf debris in drains",
      "Geyser element corrosion from cold water",
      "Water pressure variations",
    ],
    recommendations: [
      "Clear gutters and drains",
      "Inspect geyser element",
      "Check water pressure regulators",
      "Prepare for winter",
      "Test backup heating systems",
    ],
    maintenanceFocus: [
      "Drain cleaning",
      "Geyser servicing",
      "Pressure testing",
      "Insulation inspection",
    ],
  },
  {
    season: "Winter",
    months: ["June", "July", "August"],
    temperature: "Cold (5-15°C)",
    humidity: "High",
    rainfall: "Moderate to high",
    plumbingChallenges: [
      "Pipe freezing in high altitude areas",
      "Increased water supply from rain",
      "Geyser element corrosion",
      "Drainage system blockages",
      "Condensation issues",
    ],
    recommendations: [
      "Insulate exposed pipes",
      "Maintain geyser heating",
      "Clear gutters and drains",
      "Check for water leaks",
      "Inspect for condensation damage",
      "Test emergency heating",
    ],
    maintenanceFocus: [
      "Pipe insulation",
      "Drain clearing",
      "Geyser maintenance",
      "Leak detection",
      "Condensation prevention",
    ],
  },
  {
    season: "Spring",
    months: ["September"],
    temperature: "Warming (10-20°C)",
    humidity: "Variable",
    rainfall: "Moderate",
    plumbingChallenges: [
      "Transition period",
      "Spring cleaning needed",
      "Pollen in water systems",
      "Pipe expansion beginning",
    ],
    recommendations: [
      "Spring cleaning of plumbing",
      "Filter replacement",
      "System flushing",
      "Prepare for summer demand",
      "Check all connections",
    ],
    maintenanceFocus: [
      "System flushing",
      "Filter cleaning",
      "Connection inspection",
      "Preparation for summer",
    ],
  },
];

export const LOAD_SHEDDING_IMPACT_ON_PLUMBING = {
  geyser: {
    impact: "Heating interrupted during outages",
    solutions: [
      "Install solar geyser (no electricity needed)",
      "Install gas geyser backup",
      "Maintain insulated storage tank",
      "Use thermal storage system",
      "Plan hot water usage around schedule",
    ],
  },
  pump: {
    impact: "Water pressure drops or fails during outages",
    solutions: [
      "Install inverter system for pump backup",
      "Install pressure tank for storage",
      "Install check valve to prevent backflow",
      "Consider alternative water source",
      "Maintain water storage tanks",
    ],
  },
  sewage: {
    impact: "Sewage pump systems fail, backup risk",
    solutions: [
      "Install backup power for pump",
      "Install check valve to prevent backflow",
      "Maintain septic tank properly",
      "Use water wisely during outages",
      "Consider gravity-fed system",
    ],
  },
  water_supply: {
    impact: "Reduced water pressure or supply",
    solutions: [
      "Maintain water storage tanks",
      "Install pressure tank",
      "Use water wisely during outages",
      "Install backup pump system",
      "Consider borehole system",
    ],
  },
};

export const WATER_RESTRICTION_IMPACT = {
  context: "Many SA municipalities implement water restrictions during drought",
  restrictions: [
    "Odd/even day watering restrictions",
    "Time-of-day restrictions",
    "Volume restrictions",
    "Specific day bans",
    "Total supply reductions",
  ],
  recommendations: [
    "Install low-flow fixtures (4L/min taps)",
    "Install dual-flush toilets",
    "Implement grey water recycling",
    "Install rainwater harvesting system",
    "Fix all leaks immediately",
    "Use water-efficient appliances",
  ],
  products: [
    "Low-flow tap aerators (4L/min)",
    "Dual-flush toilet cisterns",
    "Grey water diversion systems",
    "Rainwater tanks",
    "Water-efficient showerheads",
  ],
};

export const EMERGENCY_PLUMBING_DURING_LOAD_SHEDDING = [
  {
    scenario: "No hot water during outage",
    solutions: [
      "Use solar shower bag (portable)",
      "Boil water on gas stove",
      "Use cold water for washing",
      "Plan bathing around schedule",
      "Install solar geyser long-term",
    ],
  },
  {
    scenario: "No water pressure during outage",
    solutions: [
      "Use water from storage tank",
      "Fill buckets during power-on time",
      "Use manual pump if available",
      "Install pressure tank",
      "Install backup pump system",
    ],
  },
  {
    scenario: "Sewage backup during outage",
    solutions: [
      "Stop using water during outage",
      "Use portable toilet if available",
      "Install backup power for pump",
      "Call emergency plumber if backup occurs",
      "Install check valve",
    ],
  },
  {
    scenario: "Burst pipe during outage",
    solutions: [
      "Locate main water valve and close it",
      "Call emergency plumber",
      "Use temporary patch if available",
      "Collect water if safe",
      "Document damage for insurance",
    ],
  },
];

export const LOAD_SHEDDING_PREPARATION_CHECKLIST = [
  "Install solar geyser or gas backup",
  "Install pressure tank for water storage",
  "Install backup power system (inverter/generator)",
  "Install check valves to prevent backflow",
  "Maintain water storage tanks",
  "Install low-flow fixtures for water conservation",
  "Create emergency plumbing kit",
  "Know location of main water valve",
  "Have emergency plumber contact details",
  "Install rainwater harvesting system",
  "Maintain regular plumbing maintenance",
  "Test backup systems regularly",
];

/**
 * Get current load-shedding impact guidance
 */
export function getLoadShedGuidance(stage: number): string {
  const schedule = LOAD_SHEDDING_STAGES[stage] || LOAD_SHEDDING_STAGES[0];
  return `
**Load-Shedding Stage ${schedule.stage}: ${schedule.hoursPerDay} hours per day**

${schedule.description}

**Impact on Plumbing:**
${schedule.impact.map((impact) => `- ${impact}`).join("\n")}

**Recommendations:**
1. Install solar geyser for hot water independence
2. Maintain water storage tanks
3. Install backup power for pump systems
4. Use water wisely during outages
5. Have emergency plumber contact details
`;
}

/**
 * Get seasonal plumbing guidance
 */
export function getSeasonalGuidance(month: number): SeasonalGuidance | null {
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
    SA_SEASONAL_GUIDANCE.find((guidance) =>
      guidance.months.includes(monthName)
    ) || null
  );
}

/**
 * Get emergency guidance for specific scenario
 */
export function getEmergencyGuidance(scenario: string): string {
  const emergency = EMERGENCY_PLUMBING_DURING_LOAD_SHEDDING.find((e) =>
    e.scenario.toLowerCase().includes(scenario.toLowerCase())
  );

  if (!emergency) {
    return "No specific emergency guidance found. Contact a registered plumber.";
  }

  return `
**${emergency.scenario}**

**Solutions:**
${emergency.solutions.map((solution) => `- ${solution}`).join("\n")}
`;
}

/**
 * Get load-shedding preparation recommendations
 */
export function getPreparationRecommendations(): string {
  return `
**Load-Shedding Preparation Checklist**

${LOAD_SHEDDING_PREPARATION_CHECKLIST.map((item) => `- [ ] ${item}`).join("\n")}

**Priority Installations:**
1. Solar geyser (most important for hot water)
2. Pressure tank (for water supply)
3. Backup power system (for pumps)
4. Check valves (prevent backflow)

**Estimated Costs:**
- Solar geyser: R8,000 - R15,000
- Pressure tank: R2,000 - R5,000
- Backup power system: R5,000 - R20,000
- Check valves: R300 - R800
`;
}
