/**
 * Kenya Plumbing Supplier and Product Database
 * Comprehensive supplier information, brands, and product recommendations for Kenya
 */

export interface KeSupplier {
  name: string;
  website: string;
  phone: string;
  regions: string[];
  specialties: string[];
  availability: "nationwide" | "major-cities" | "limited";
  priceRange: "budget" | "mid-range" | "premium";
}

export interface KeTrustedBrand {
  category: string;
  brands: string[];
}

export interface KeProduct {
  name: string;
  brand: string;
  category: string;
  supplier: string[];
  priceRange: { min: number; max: number };
  keRating: number;
  kebesApproved: boolean;
  description: string;
  advantages: string[];
  considerations: string[];
}

// Major Kenya Suppliers
export const KE_MAJOR_SUPPLIERS: KeSupplier[] = [
  {
    name: "Nakumatt",
    website: "www.nakumatt.net",
    phone: "+254 20 4000 000",
    regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    specialties: ["Hardware", "Plumbing supplies", "Building materials", "General retail"],
    availability: "nationwide",
    priceRange: "mid-range",
  },
  {
    name: "Carrefour Kenya",
    website: "www.carrefourkenya.com",
    phone: "+254 20 2060 000",
    regions: ["Nairobi", "Mombasa", "Kisumu"],
    specialties: ["Hardware", "Plumbing fixtures", "Building supplies", "Home improvement"],
    availability: "major-cities",
    priceRange: "mid-range",
  },
  {
    name: "Jumia Home",
    website: "www.jumia.co.ke",
    phone: "+254 20 3333 333",
    regions: ["Nationwide (online)"],
    specialties: ["Online retail", "Plumbing supplies", "Home improvement", "Fast delivery"],
    availability: "nationwide",
    priceRange: "mid-range",
  },
  {
    name: "Jacks Hardware",
    website: "www.jackshardware.co.ke",
    phone: "+254 20 2222 222",
    regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
    specialties: ["Hardware", "Plumbing supplies", "Tools", "Building materials"],
    availability: "major-cities",
    priceRange: "mid-range",
  },
  {
    name: "Uchumi Supermarket",
    website: "www.uchumi.co.ke",
    phone: "+254 20 3333 000",
    regions: ["Nairobi", "Mombasa", "Kisumu"],
    specialties: ["Hardware", "General retail", "Plumbing supplies"],
    availability: "major-cities",
    priceRange: "budget",
  },
  {
    name: "Roto Tanks Kenya",
    website: "www.rototanks.co.ke",
    phone: "+254 20 2000 000",
    regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
    specialties: ["Water tanks", "Rainwater harvesting", "Storage solutions"],
    availability: "major-cities",
    priceRange: "mid-range",
  },
  {
    name: "Jojo Tanks Kenya",
    website: "www.jojotanks.co.ke",
    phone: "+254 20 2111 111",
    regions: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    specialties: ["Water tanks", "Rainwater harvesting", "Tank accessories"],
    availability: "nationwide",
    priceRange: "mid-range",
  },
  {
    name: "Marley Kenya",
    website: "www.marleyafrica.com",
    phone: "+254 20 2000 000",
    regions: ["Nairobi", "Mombasa", "Kisumu"],
    specialties: ["Pipes", "Fittings", "Drainage", "Water supply"],
    availability: "major-cities",
    priceRange: "mid-range",
  },
  {
    name: "Iplex Kenya",
    website: "www.iplex.co.ke",
    phone: "+254 20 2222 000",
    regions: ["Nairobi", "Mombasa", "Kisumu"],
    specialties: ["PVC pipes", "Fittings", "Plumbing systems"],
    availability: "major-cities",
    priceRange: "mid-range",
  },
  {
    name: "Local Hardware Stores",
    website: "Various",
    phone: "Local numbers",
    regions: ["All regions"],
    specialties: ["Local products", "Quick service", "Personal advice"],
    availability: "nationwide",
    priceRange: "budget",
  },
];

// Trusted Brands in Kenya
export const KE_TRUSTED_BRANDS: Record<string, string[]> = {
  geysers: [
    "Ariston",
    "Dimplex",
    "Kwikot (limited availability)",
    "Thermex",
    "Stiebel Eltron",
  ],
  taps: [
    "Grohe",
    "Kohler",
    "Delabie",
    "Bristan",
    "Caple",
    "Local brands",
  ],
  pipes: [
    "Marley",
    "Iplex",
    "Wavin",
    "Polychem",
    "Local PVC brands",
  ],
  pumps: [
    "Grundfos",
    "Ebara",
    "Pedrollo",
    "Shimge",
    "Local pump manufacturers",
  ],
  valves: [
    "Caple",
    "Watts",
    "Flamco",
    "Local valve suppliers",
  ],
  tanks: [
    "Jojo Tanks",
    "Roto Tanks",
    "Sintex",
    "Local plastic tank manufacturers",
  ],
};

// Kenya Product Recommendations
export const KE_PRODUCT_RECOMMENDATIONS: KeProduct[] = [
  {
    name: "Jojo Tank 1000L",
    brand: "Jojo Tanks",
    category: "Water Storage",
    supplier: ["Jojo Tanks Kenya", "Nakumatt", "Carrefour Kenya"],
    priceRange: { min: 8000, max: 12000 },
    keRating: 4.8,
    kebesApproved: true,
    description: "High-quality water storage tank for residential use, UV-resistant",
    advantages: [
      "UV-resistant plastic",
      "Durable and long-lasting",
      "Easy installation",
      "Affordable",
      "Good for water rationing",
    ],
    considerations: [
      "Requires elevated installation",
      "Regular cleaning needed",
      "Algae prevention required",
    ],
  },
  {
    name: "Roto Tank 500L",
    brand: "Roto Tanks",
    category: "Water Storage",
    supplier: ["Roto Tanks Kenya", "Nakumatt"],
    priceRange: { min: 5000, max: 8000 },
    keRating: 4.7,
    kebesApproved: true,
    description: "Compact water storage tank, suitable for smaller installations",
    advantages: [
      "Compact size",
      "Easy to install",
      "Good for apartments",
      "Affordable",
    ],
    considerations: [
      "Limited storage capacity",
      "Requires regular maintenance",
    ],
  },
  {
    name: "Marley PVC Pipes 50mm",
    brand: "Marley",
    category: "Pipes",
    supplier: ["Marley Kenya", "Nakumatt", "Jacks Hardware"],
    priceRange: { min: 150, max: 250 },
    keRating: 4.9,
    kebesApproved: true,
    description: "UV-resistant PVC pipes for water supply, KEBS certified",
    advantages: [
      "KEBS certified",
      "UV-resistant",
      "Durable",
      "Easy to install",
      "Good for Kenya climate",
    ],
    considerations: [
      "Requires proper support",
      "Cannot be used for hot water",
    ],
  },
  {
    name: "Grohe Tap 6L/min",
    brand: "Grohe",
    category: "Fixtures",
    supplier: ["Nakumatt", "Carrefour Kenya", "Jacks Hardware"],
    priceRange: { min: 2500, max: 5000 },
    keRating: 4.8,
    kebesApproved: true,
    description: "Water-efficient tap, meets Kenya water conservation standards",
    advantages: [
      "Water-efficient (6L/min)",
      "Durable ceramic cartridge",
      "Meets conservation standards",
      "Good warranty",
    ],
    considerations: [
      "Premium price",
      "Requires proper installation",
    ],
  },
  {
    name: "Grundfos Pump 1HP",
    brand: "Grundfos",
    category: "Pumps",
    supplier: ["Nakumatt", "Jacks Hardware"],
    priceRange: { min: 15000, max: 25000 },
    keRating: 4.9,
    kebesApproved: true,
    description: "Reliable water pump for residential use, energy-efficient",
    advantages: [
      "Reliable and durable",
      "Energy-efficient",
      "Good for Kenya conditions",
      "Warranty available",
    ],
    considerations: [
      "Expensive",
      "Requires proper installation",
      "Needs regular maintenance",
    ],
  },
  {
    name: "Caple Pressure Reducing Valve",
    brand: "Caple",
    category: "Valves",
    supplier: ["Nakumatt", "Jacks Hardware"],
    priceRange: { min: 1500, max: 3000 },
    keRating: 4.7,
    kebesApproved: true,
    description: "Pressure control valve for water systems, KS 3404 compliant",
    advantages: [
      "KS 3404 compliant",
      "Protects fixtures",
      "Easy to adjust",
      "Durable",
    ],
    considerations: [
      "Requires professional installation",
      "Needs regular testing",
    ],
  },
  {
    name: "Brass Fittings Kit",
    brand: "Local brands",
    category: "Fittings",
    supplier: ["Nakumatt", "Jacks Hardware", "Local hardware stores"],
    priceRange: { min: 500, max: 1500 },
    keRating: 4.5,
    kebesApproved: true,
    description: "Brass fittings for water supply, resistant to Kenya water quality",
    advantages: [
      "Resistant to zinc leaching",
      "Durable",
      "Affordable",
      "Widely available",
    ],
    considerations: [
      "Quality varies by brand",
      "Requires proper installation",
    ],
  },
  {
    name: "Rainwater Harvesting System",
    brand: "Various local brands",
    category: "Water Systems",
    supplier: ["Jojo Tanks Kenya", "Roto Tanks Kenya", "Nakumatt"],
    priceRange: { min: 5000, max: 15000 },
    keRating: 4.6,
    kebesApproved: true,
    description: "Complete rainwater harvesting kit, encouraged by Water Act 2016",
    advantages: [
      "Water conservation",
      "Reduces municipal dependency",
      "Government incentives available",
      "Long-term savings",
    ],
    considerations: [
      "Installation cost",
      "Requires maintenance",
      "Water quality testing needed",
    ],
  },
  {
    name: "Septic Tank System",
    brand: "Various local brands",
    category: "Wastewater",
    supplier: ["Local suppliers", "Nakumatt"],
    priceRange: { min: 20000, max: 50000 },
    keRating: 4.4,
    kebesApproved: true,
    description: "Complete septic tank system for areas without municipal sewage",
    advantages: [
      "NEMA compliant",
      "Environmentally safe",
      "Required in rural areas",
      "Long-lasting",
    ],
    considerations: [
      "Expensive installation",
      "Regular pumping required",
      "Professional installation needed",
    ],
  },
];

/**
 * Get suppliers by region
 */
export function getKeSuppliersByRegion(region: string): KeSupplier[] {
  return KE_MAJOR_SUPPLIERS.filter((supplier) =>
    supplier.regions.some((r) => r.toLowerCase().includes(region.toLowerCase()))
  );
}

/**
 * Get trusted brands by category
 */
export function getKeTrustedBrands(category: string): string[] {
  const categoryKey = category.toLowerCase() as keyof typeof KE_TRUSTED_BRANDS;
  return KE_TRUSTED_BRANDS[categoryKey] || [];
}

/**
 * Calculate regional cost adjustment for Kenya
 */
export function calculateKeRegionalCost(
  baseCost: number,
  region: "nairobi" | "mombasa" | "kisumu" | "rural" = "nairobi",
  isEmergency: boolean = false,
  isWeekend: boolean = false,
  isNightTime: boolean = false
): number {
  let multiplier = 1;

  // Regional adjustments
  switch (region) {
    case "nairobi":
      multiplier = 1; // Base price
      break;
    case "mombasa":
      multiplier = 1.15; // 15% higher (coastal, salt corrosion)
      break;
    case "kisumu":
      multiplier = 1.1; // 10% higher (distance from suppliers)
      break;
    case "rural":
      multiplier = 1.3; // 30% higher (limited access, travel time)
      break;
  }

  // Emergency surcharge
  if (isEmergency) {
    multiplier *= 1.5; // 50% emergency surcharge
  }

  // Weekend surcharge
  if (isWeekend) {
    multiplier *= 1.25; // 25% weekend surcharge
  }

  // Night time surcharge
  if (isNightTime) {
    multiplier *= 1.3; // 30% night time surcharge
  }

  return Math.round(baseCost * multiplier);
}

/**
 * Get product recommendations by category
 */
export function getKeProductsByCategory(category: string): KeProduct[] {
  return KE_PRODUCT_RECOMMENDATIONS.filter((product) =>
    product.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Get KEBS approved products only
 */
export function getKeKebsApprovedProducts(): KeProduct[] {
  return KE_PRODUCT_RECOMMENDATIONS.filter((product) => product.kebesApproved);
}

/**
 * Get affordable products (budget range)
 */
export function getKeAffordableProducts(): KeProduct[] {
  return KE_PRODUCT_RECOMMENDATIONS.filter(
    (product) => product.priceRange.min < 5000
  );
}

/**
 * Format supplier information as text
 */
export function formatKeSupplierInfo(supplier: KeSupplier): string {
  return `
**${supplier.name}**

Website: ${supplier.website}
Phone: ${supplier.phone}
Availability: ${supplier.availability}
Price Range: ${supplier.priceRange}

Regions: ${supplier.regions.join(", ")}

Specialties: ${supplier.specialties.join(", ")}
`;
}

/**
 * Get supplier recommendations for a specific region
 */
export function getKeSupplierRecommendations(region: string): string {
  const suppliers = getKeSuppliersByRegion(region);

  if (suppliers.length === 0) {
    return `No suppliers found for ${region}. Try contacting local hardware stores.`;
  }

  return `
**Recommended Suppliers for ${region}:**

${suppliers.map((s) => formatKeSupplierInfo(s)).join("\n")}
`;
}
