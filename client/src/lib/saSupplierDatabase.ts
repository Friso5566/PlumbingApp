/**
 * South African Supplier and Product Database
 * Comprehensive list of suppliers, brands, and products available in South Africa
 */

export interface SASupplier {
  id: string;
  name: string;
  type: "retailer" | "wholesaler" | "manufacturer" | "online";
  website: string;
  regions: string[];
  specialties: string[];
  priceRange: "budget" | "mid-range" | "premium";
}

export interface SAProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  supplier: string[];
  priceRange: { min: number; max: number };
  saRating: number; // 1-5 stars
  availability: "widely-available" | "common" | "specialty" | "limited";
  notes: string;
}

export const SA_MAJOR_SUPPLIERS: SASupplier[] = [
  {
    id: "builders-warehouse",
    name: "Builders Warehouse",
    type: "retailer",
    website: "https://www.builders.co.za",
    regions: ["National", "All major cities"],
    specialties: ["Plumbing supplies", "Building materials", "DIY products"],
    priceRange: "mid-range",
  },
  {
    id: "plumblink",
    name: "Plumblink",
    type: "online",
    website: "https://www.plumblink.co.za",
    regions: ["National", "Online delivery"],
    specialties: ["Plumbing supplies", "Fixtures", "Fittings"],
    priceRange: "mid-range",
  },
  {
    id: "leroy-merlin",
    name: "Leroy Merlin",
    type: "retailer",
    website: "https://www.leroymerlin.co.za",
    regions: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    specialties: ["DIY", "Building materials", "Plumbing"],
    priceRange: "mid-range",
  },
  {
    id: "alert-steel",
    name: "Alert Steel",
    type: "wholesaler",
    website: "https://www.alertsteel.co.za",
    regions: ["Gauteng", "National delivery"],
    specialties: ["Steel pipes", "Fittings", "Industrial supplies"],
    priceRange: "budget",
  },
  {
    id: "mr-price-home",
    name: "Mr Price Home",
    type: "retailer",
    website: "https://www.mrpricehome.co.za",
    regions: ["National"],
    specialties: ["Home furnishings", "Some plumbing"],
    priceRange: "budget",
  },
  {
    id: "takealot",
    name: "Takealot",
    type: "online",
    website: "https://www.takealot.com",
    regions: ["National", "Online delivery"],
    specialties: ["Everything", "Plumbing supplies", "Fast delivery"],
    priceRange: "mid-range",
  },
  {
    id: "loot",
    name: "Loot",
    type: "online",
    website: "https://www.loot.co.za",
    regions: ["National", "Online delivery"],
    specialties: ["Books", "Some plumbing supplies"],
    priceRange: "mid-range",
  },
  {
    id: "caple",
    name: "Caple",
    type: "wholesaler",
    website: "https://www.caple.co.za",
    regions: ["Gauteng", "National delivery"],
    specialties: ["Plumbing supplies", "Heating", "Cooling"],
    priceRange: "mid-range",
  },
  {
    id: "jaco-plumbing",
    name: "Jaco Plumbing Supplies",
    type: "wholesaler",
    website: "https://www.jacoplumbing.co.za",
    regions: ["Gauteng", "Regional"],
    specialties: ["Plumbing supplies", "Wholesale"],
    priceRange: "budget",
  },
  {
    id: "sanitary-ware",
    name: "Sanitary Ware Centre",
    type: "retailer",
    website: "https://www.sanitaryware.co.za",
    regions: ["Gauteng", "Western Cape"],
    specialties: ["Sanitaryware", "Bathrooms", "Plumbing fixtures"],
    priceRange: "premium",
  },
];

export const SA_TRUSTED_BRANDS: Record<string, string[]> = {
  geysers: [
    "Kwikot (South African brand)",
    "Geyserwise",
    "Ariston",
    "Bosch",
    "Dimplex",
    "Sunmark (Solar)",
  ],
  taps: [
    "Kohler",
    "Grohe",
    "Delabie",
    "Bristan",
    "Jaquar",
    "Hansgrohe",
  ],
  pipes: [
    "Marley (PVC)",
    "Iplex (Polyethylene)",
    "Wavin (PVC)",
    "Polychem",
    "Duraplast",
  ],
  fittings: [
    "Marley",
    "Wavin",
    "Polychem",
    "Iplex",
    "Delabie",
  ],
  toilets: [
    "Kohler",
    "Jaquar",
    "Bristan",
    "Caple",
    "Duravit",
  ],
  pumps: [
    "Grundfos",
    "Ebara",
    "Pedrollo",
    "Wilo",
    "Submersible pump specialists",
  ],
  valves: [
    "Caple",
    "Watts",
    "Flamco",
    "Caleffi",
    "Delabie",
  ],
};

export const SA_PRODUCT_RECOMMENDATIONS: SAProduct[] = [
  {
    id: "geyser-kwikot-150l",
    name: "Kwikot 150L Electric Geyser",
    category: "Geyser",
    brand: "Kwikot",
    supplier: ["builders-warehouse", "plumblink", "takealot"],
    priceRange: { min: 2500, max: 3500 },
    saRating: 4.5,
    availability: "widely-available",
    notes: "South African brand, reliable, good warranty. Complies with SANS 10254",
  },
  {
    id: "geyser-solar-sunmark",
    name: "Sunmark Solar Geyser 300L",
    category: "Solar Geyser",
    brand: "Sunmark",
    supplier: ["plumblink", "caple"],
    priceRange: { min: 8000, max: 12000 },
    saRating: 4.7,
    availability: "common",
    notes: "Excellent for load-shedding relief. Government rebates available in some areas",
  },
  {
    id: "tap-grohe-kitchen",
    name: "Grohe Minta Kitchen Tap",
    category: "Kitchen Tap",
    brand: "Grohe",
    supplier: ["builders-warehouse", "sanitary-ware"],
    priceRange: { min: 1200, max: 2000 },
    saRating: 4.6,
    availability: "widely-available",
    notes: "German quality, water-saving, available in chrome and stainless",
  },
  {
    id: "pipe-marley-pvc-20mm",
    name: "Marley PVC Pipe 20mm",
    category: "Pipe",
    brand: "Marley",
    supplier: ["builders-warehouse", "alert-steel", "jaco-plumbing"],
    priceRange: { min: 15, max: 25 },
    saRating: 4.4,
    availability: "widely-available",
    notes: "Standard South African plumbing pipe. Complies with SANS standards",
  },
  {
    id: "toilet-kohler-dual-flush",
    name: "Kohler Dual-Flush Toilet Suite",
    category: "Toilet",
    brand: "Kohler",
    supplier: ["builders-warehouse", "sanitary-ware"],
    priceRange: { min: 2000, max: 3500 },
    saRating: 4.5,
    availability: "widely-available",
    notes: "Water-saving, important for SA water restrictions. Easy maintenance",
  },
  {
    id: "pump-grundfos-1hp",
    name: "Grundfos 1HP Submersible Pump",
    category: "Pump",
    brand: "Grundfos",
    supplier: ["caple", "jaco-plumbing"],
    priceRange: { min: 3500, max: 5000 },
    saRating: 4.8,
    availability: "common",
    notes: "Reliable for borehole systems. Widely used in rural SA",
  },
  {
    id: "pressure-valve-watts",
    name: "Watts Pressure Reducing Valve",
    category: "Valve",
    brand: "Watts",
    supplier: ["builders-warehouse", "caple"],
    priceRange: { min: 400, max: 800 },
    saRating: 4.6,
    availability: "widely-available",
    notes: "Essential for SANS 10254 compliance. Adjustable 0-600kPa",
  },
  {
    id: "low-flow-tap-aerator",
    name: "Low-Flow Tap Aerator 4L/min",
    category: "Water Saving",
    brand: "Generic",
    supplier: ["builders-warehouse", "mr-price-home"],
    priceRange: { min: 50, max: 150 },
    saRating: 4.3,
    availability: "widely-available",
    notes: "Important for water restrictions. Easy DIY installation",
  },
];

export const SA_REGIONAL_SUPPLIER_PREFERENCES: Record<string, string[]> = {
  "Western Cape": [
    "Builders Warehouse (multiple locations)",
    "Leroy Merlin (Stellenbosch)",
    "Plumblink (online)",
    "Local independent plumbing suppliers",
  ],
  Gauteng: [
    "Alert Steel",
    "Jaco Plumbing Supplies",
    "Caple",
    "Builders Warehouse",
    "Leroy Merlin",
  ],
  "KwaZulu-Natal": [
    "Builders Warehouse",
    "Leroy Merlin (Durban)",
    "Local suppliers",
    "Plumblink (online)",
  ],
  "Eastern Cape": [
    "Builders Warehouse",
    "Local independent suppliers",
    "Plumblink (online)",
  ],
  Limpopo: [
    "Local suppliers",
    "Plumblink (online)",
    "Takealot",
  ],
  "Northern Cape": [
    "Local suppliers",
    "Plumblink (online)",
    "Takealot",
  ],
  "Free State": [
    "Builders Warehouse",
    "Local suppliers",
    "Plumblink (online)",
  ],
  Mpumalanga: [
    "Local suppliers",
    "Plumblink (online)",
    "Takealot",
  ],
  "North West": [
    "Local suppliers",
    "Plumblink (online)",
    "Takealot",
  ],
};

export const SA_COST_FACTORS: Record<string, number> = {
  "metro-multiplier": 1.0, // Base cost in metro areas
  "suburban-multiplier": 1.15, // 15% more in suburbs
  "rural-multiplier": 1.35, // 35% more in rural areas
  "emergency-multiplier": 1.5, // 50% more for emergency calls
  "after-hours-multiplier": 1.25, // 25% more after hours
  "weekend-multiplier": 1.3, // 30% more on weekends
};

export const SA_PLUMBER_REGISTRATION_BODIES = [
  {
    name: "PLUMBING BOARD OF SOUTH AFRICA",
    website: "https://www.plumbingboard.co.za",
    purpose: "Registers and regulates plumbers in South Africa",
  },
  {
    name: "SAIW (South African Institute of Welding)",
    website: "https://www.saiw.co.za",
    purpose: "Registers welders and related trades",
  },
  {
    name: "CIDB (Construction Industry Development Board)",
    website: "https://www.cidb.org.za",
    purpose: "Registers construction professionals",
  },
];

/**
 * Get supplier recommendations for a specific region
 */
export function getSuppliersByRegion(region: string): SASupplier[] {
  return SA_MAJOR_SUPPLIERS.filter((supplier) =>
    supplier.regions.some((r) =>
      r.toLowerCase().includes(region.toLowerCase()) ||
      r.toLowerCase() === "national"
    )
  );
}

/**
 * Get trusted brands for a product category
 */
export function getTrustedBrands(category: string): string[] {
  const categoryKey = category.toLowerCase().replace(/\s+/g, "-");
  return SA_TRUSTED_BRANDS[categoryKey] || [];
}

/**
 * Get product recommendations for a category
 */
export function getProductRecommendations(category: string): SAProduct[] {
  return SA_PRODUCT_RECOMMENDATIONS.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Calculate regional cost adjustment
 */
export function calculateRegionalCost(
  baseCost: number,
  region: string,
  isEmergency: boolean = false,
  isAfterHours: boolean = false,
  isWeekend: boolean = false
): number {
  let multiplier = SA_COST_FACTORS["metro-multiplier"];

  // Regional adjustment
  if (region.toLowerCase().includes("rural")) {
    multiplier = SA_COST_FACTORS["rural-multiplier"];
  } else if (region.toLowerCase().includes("suburb")) {
    multiplier = SA_COST_FACTORS["suburban-multiplier"];
  }

  // Time-based adjustments
  if (isEmergency) {
    multiplier *= SA_COST_FACTORS["emergency-multiplier"];
  } else if (isAfterHours) {
    multiplier *= SA_COST_FACTORS["after-hours-multiplier"];
  } else if (isWeekend) {
    multiplier *= SA_COST_FACTORS["weekend-multiplier"];
  }

  return Math.round(baseCost * multiplier);
}

/**
 * Get regional supplier preferences
 */
export function getRegionalSupplierPreferences(province: string): string[] {
  return SA_REGIONAL_SUPPLIER_PREFERENCES[province] || [];
}
