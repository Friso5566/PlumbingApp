export interface CostEstimate {
  id: string;
  issue: string;
  keywords: string[];
  partsMin: number;
  partsMax: number;
  labourMin: number;
  labourMax: number;
  complexity: "Low" | "Medium" | "High";
  diy: boolean;
  parts: Array<{ name: string; minPrice: number; maxPrice: number }>;
  notes?: string;
}

export const SOUTH_AFRICAN_COST_DATABASE: CostEstimate[] = [
  {
    id: "dripping-tap",
    issue: "Dripping tap (washer replacement)",
    keywords: ["dripping tap", "leaky tap", "tap dripping", "washer"],
    partsMin: 20,
    partsMax: 80,
    labourMin: 300,
    labourMax: 500,
    complexity: "Low",
    diy: true,
    parts: [
      { name: "Tap washer kit", minPrice: 15, maxPrice: 60 },
      { name: "Plumber's tape & sealant", minPrice: 5, maxPrice: 20 },
    ],
  },
  {
    id: "tap-replacement",
    issue: "Tap replacement (full)",
    keywords: ["tap replacement", "replace tap", "new tap", "install tap"],
    partsMin: 250,
    partsMax: 800,
    labourMin: 400,
    labourMax: 700,
    complexity: "Low",
    diy: false,
    parts: [
      { name: "New tap", minPrice: 200, maxPrice: 700 },
      { name: "Installation fittings", minPrice: 50, maxPrice: 100 },
    ],
  },
  {
    id: "toilet-cistern-repair",
    issue: "Toilet cistern repair",
    keywords: ["toilet cistern", "cistern repair", "toilet running", "toilet leak"],
    partsMin: 80,
    partsMax: 350,
    labourMin: 350,
    labourMax: 600,
    complexity: "Low",
    diy: true,
    parts: [
      { name: "Cistern valve kit", minPrice: 60, maxPrice: 250 },
      { name: "Gaskets & seals", minPrice: 20, maxPrice: 100 },
    ],
  },
  {
    id: "toilet-replacement",
    issue: "Toilet replacement (full)",
    keywords: ["toilet replacement", "replace toilet", "new toilet", "install toilet"],
    partsMin: 800,
    partsMax: 2500,
    labourMin: 600,
    labourMax: 1200,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "New toilet suite", minPrice: 700, maxPrice: 2300 },
      { name: "Installation hardware", minPrice: 100, maxPrice: 200 },
    ],
  },
  {
    id: "blocked-drain-diy",
    issue: "Blocked drain (DIY)",
    keywords: ["blocked drain", "drain blockage", "slow drain", "drain clog"],
    partsMin: 50,
    partsMax: 200,
    labourMin: 0,
    labourMax: 0,
    complexity: "Low",
    diy: true,
    parts: [
      { name: "Drain cleaner/plunger", minPrice: 30, maxPrice: 150 },
      { name: "Drain snake", minPrice: 20, maxPrice: 80 },
    ],
  },
  {
    id: "blocked-drain-professional",
    issue: "Blocked drain (professional)",
    keywords: ["professional drain", "drain cleaning", "drain jetting", "severe blockage"],
    partsMin: 0,
    partsMax: 0,
    labourMin: 500,
    labourMax: 1500,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Professional drain cleaning service", minPrice: 500, maxPrice: 1500 },
    ],
  },
  {
    id: "burst-pipe-minor",
    issue: "Burst pipe (minor)",
    keywords: ["burst pipe", "pipe burst", "broken pipe", "cracked pipe"],
    partsMin: 100,
    partsMax: 400,
    labourMin: 500,
    labourMax: 1000,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Replacement pipe section", minPrice: 60, maxPrice: 300 },
      { name: "Couplings & fittings", minPrice: 40, maxPrice: 100 },
    ],
  },
  {
    id: "burst-pipe-major",
    issue: "Burst pipe (major)",
    keywords: ["major burst", "major pipe damage", "extensive pipe damage"],
    partsMin: 400,
    partsMax: 1500,
    labourMin: 1200,
    labourMax: 3000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "Replacement pipe & materials", minPrice: 300, maxPrice: 1200 },
      { name: "Fittings & connections", minPrice: 100, maxPrice: 300 },
    ],
  },
  {
    id: "geyser-element-replacement",
    issue: "Geyser element replacement",
    keywords: ["geyser element", "element replacement", "heating element", "geyser heating"],
    partsMin: 200,
    partsMax: 500,
    labourMin: 600,
    labourMax: 1000,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Geyser element (3kW)", minPrice: 180, maxPrice: 450 },
      { name: "Installation & testing", minPrice: 420, maxPrice: 550 },
    ],
  },
  {
    id: "geyser-thermostat",
    issue: "Geyser thermostat replacement",
    keywords: ["thermostat", "geyser thermostat", "temperature control", "thermostat replacement"],
    partsMin: 150,
    partsMax: 400,
    labourMin: 500,
    labourMax: 900,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Thermostat unit", minPrice: 120, maxPrice: 350 },
      { name: "Installation labour", minPrice: 380, maxPrice: 550 },
    ],
  },
  {
    id: "pressure-relief-valve",
    issue: "Pressure relief valve replacement",
    keywords: ["pressure relief valve", "relief valve", "prv", "pressure valve"],
    partsMin: 180,
    partsMax: 400,
    labourMin: 400,
    labourMax: 700,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Pressure relief valve", minPrice: 150, maxPrice: 350 },
      { name: "Installation & testing", minPrice: 250, maxPrice: 350 },
    ],
  },
  {
    id: "geyser-replacement-150l",
    issue: "Geyser full replacement (150L)",
    keywords: ["geyser replacement", "new geyser", "replace geyser", "geyser installation", "150l"],
    partsMin: 3500,
    partsMax: 6000,
    labourMin: 1500,
    labourMax: 3000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "New 150L geyser", minPrice: 3200, maxPrice: 5500 },
      { name: "Installation, plumbing & electrical", minPrice: 300, maxPrice: 500 },
    ],
  },
  {
    id: "geyser-replacement-200l",
    issue: "Geyser full replacement (200L)",
    keywords: ["geyser replacement", "new geyser", "replace geyser", "geyser installation", "200l"],
    partsMin: 4500,
    partsMax: 8000,
    labourMin: 1500,
    labourMax: 3000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "New 200L geyser", minPrice: 4200, maxPrice: 7500 },
      { name: "Installation, plumbing & electrical", minPrice: 300, maxPrice: 500 },
    ],
  },
  {
    id: "solar-geyser",
    issue: "Solar geyser installation",
    keywords: ["solar geyser", "solar installation", "solar heating", "solar water heater"],
    partsMin: 8000,
    partsMax: 18000,
    labourMin: 3000,
    labourMax: 6000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "Solar geyser system", minPrice: 7500, maxPrice: 17000 },
      { name: "Installation & connections", minPrice: 500, maxPrice: 1000 },
    ],
  },
  {
    id: "heat-pump",
    issue: "Heat pump installation",
    keywords: ["heat pump", "heat pump installation", "heat pump water heater"],
    partsMin: 12000,
    partsMax: 22000,
    labourMin: 3000,
    labourMax: 5000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "Heat pump unit", minPrice: 11000, maxPrice: 20000 },
      { name: "Installation & setup", minPrice: 1000, maxPrice: 2000 },
    ],
  },
  {
    id: "geyser-timer",
    issue: "Geyser timer/controller installation",
    keywords: ["geyser timer", "timer installation", "controller", "geyser controller"],
    partsMin: 400,
    partsMax: 900,
    labourMin: 400,
    labourMax: 700,
    complexity: "Low",
    diy: false,
    parts: [
      { name: "Timer/controller unit", minPrice: 350, maxPrice: 800 },
      { name: "Installation labour", minPrice: 50, maxPrice: 100 },
    ],
  },
  {
    id: "low-water-pressure",
    issue: "Low water pressure (diagnosis)",
    keywords: ["low water pressure", "low pressure", "weak pressure", "pressure issue"],
    partsMin: 0,
    partsMax: 200,
    labourMin: 400,
    labourMax: 800,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Diagnostic inspection", minPrice: 0, maxPrice: 200 },
      { name: "Plumber consultation", minPrice: 400, maxPrice: 800 },
    ],
  },
  {
    id: "water-meter-replacement",
    issue: "Water meter replacement",
    keywords: ["water meter", "meter replacement", "new meter", "meter installation"],
    partsMin: 800,
    partsMax: 1500,
    labourMin: 600,
    labourMax: 1200,
    complexity: "High",
    diy: false,
    parts: [
      { name: "New water meter", minPrice: 700, maxPrice: 1400 },
      { name: "Installation & connections", minPrice: 100, maxPrice: 200 },
    ],
  },
  {
    id: "shower-head-replacement",
    issue: "Shower head replacement",
    keywords: ["shower head", "shower replacement", "new shower", "replace shower head"],
    partsMin: 150,
    partsMax: 600,
    labourMin: 300,
    labourMax: 500,
    complexity: "Low",
    diy: true,
    parts: [
      { name: "New shower head", minPrice: 120, maxPrice: 550 },
      { name: "Installation fittings", minPrice: 30, maxPrice: 50 },
    ],
  },
  {
    id: "shower-mixer",
    issue: "Shower mixer replacement",
    keywords: ["shower mixer", "mixer tap", "shower valve", "mixer replacement"],
    partsMin: 400,
    partsMax: 1500,
    labourMin: 600,
    labourMax: 1100,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Shower mixer valve", minPrice: 350, maxPrice: 1400 },
      { name: "Installation labour", minPrice: 250, maxPrice: 200 },
    ],
  },
  {
    id: "basin-sink-replacement",
    issue: "Basin/sink replacement",
    keywords: ["basin replacement", "sink replacement", "new basin", "new sink"],
    partsMin: 500,
    partsMax: 2000,
    labourMin: 600,
    labourMax: 1200,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "New basin/sink", minPrice: 400, maxPrice: 1800 },
      { name: "Installation & plumbing", minPrice: 200, maxPrice: 400 },
    ],
  },
  {
    id: "geyser-drip-tray",
    issue: "Geyser drip tray + drain installation",
    keywords: ["drip tray", "drip pan", "geyser drain", "safety tray"],
    partsMin: 200,
    partsMax: 500,
    labourMin: 400,
    labourMax: 700,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Drip tray & drain kit", minPrice: 180, maxPrice: 450 },
      { name: "Installation labour", minPrice: 220, maxPrice: 250 },
    ],
  },
  {
    id: "leak-detection",
    issue: "Leak detection (professional)",
    keywords: ["leak detection", "detect leak", "find leak", "water leak"],
    partsMin: 0,
    partsMax: 0,
    labourMin: 800,
    labourMax: 1800,
    complexity: "Medium",
    diy: false,
    parts: [
      { name: "Professional leak detection service", minPrice: 800, maxPrice: 1800 },
    ],
  },
  {
    id: "underground-pipe",
    issue: "Underground pipe repair",
    keywords: ["underground pipe", "buried pipe", "underground repair", "subsurface pipe"],
    partsMin: 500,
    partsMax: 2500,
    labourMin: 2000,
    labourMax: 6000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "Replacement pipe & materials", minPrice: 400, maxPrice: 2000 },
      { name: "Excavation & installation labour", minPrice: 1600, maxPrice: 4000 },
    ],
  },
  {
    id: "borehole-pump",
    issue: "Borehole pump replacement",
    keywords: ["borehole pump", "pump replacement", "submersible pump", "water pump"],
    partsMin: 2500,
    partsMax: 6000,
    labourMin: 1500,
    labourMax: 3000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "Replacement pump unit", minPrice: 2200, maxPrice: 5500 },
      { name: "Installation & testing", minPrice: 300, maxPrice: 500 },
    ],
  },
  {
    id: "jojo-tank",
    issue: "JoJo tank installation",
    keywords: ["jojo tank", "water tank", "tank installation", "storage tank"],
    partsMin: 3000,
    partsMax: 6500,
    labourMin: 1500,
    labourMax: 3000,
    complexity: "High",
    diy: false,
    parts: [
      { name: "JoJo tank", minPrice: 2800, maxPrice: 6000 },
      { name: "Installation & plumbing", minPrice: 200, maxPrice: 500 },
    ],
  },
];

export function findCostEstimates(responseText: string): CostEstimate[] {
  const lowerText = responseText.toLowerCase();
  const matches: CostEstimate[] = [];
  const seenIds = new Set<string>();

  for (const estimate of SOUTH_AFRICAN_COST_DATABASE) {
    for (const keyword of estimate.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        if (!seenIds.has(estimate.id)) {
          matches.push(estimate);
          seenIds.add(estimate.id);
        }
        break;
      }
    }
  }

  return matches;
}

export function calculateRuralPricing(estimate: CostEstimate) {
  return {
    partsMin: Math.round(estimate.partsMin * 1.2),
    partsMax: Math.round(estimate.partsMax * 1.2),
    labourMin: Math.round(estimate.labourMin * 0.9),
    labourMax: Math.round(estimate.labourMax * 0.9),
  };
}
