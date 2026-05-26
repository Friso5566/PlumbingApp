/**
 * Profile Storage Utility
 * Manages plumber/company profile data in localStorage
 */

export interface ClientProfile {
  // Personal / Business Identity
  fullName: string;
  businessRegistrationNumber: string;
  vatNumber: string;

  // Contact Details
  email: string;
  phoneNumber: string;
  whatsappNumber: string;

  // Business Address
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;

  // Logo
  logoBase64: string | null;

  // Branding
  accentColor: string;

  // Metadata
  lastUpdated: number;
}

export const DEFAULT_PROFILE: ClientProfile = {
  fullName: "",
  businessRegistrationNumber: "",
  vatNumber: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  streetAddress: "",
  suburb: "",
  city: "",
  province: "",
  postalCode: "",
  logoBase64: null,
  accentColor: "#0066cc",
  lastUpdated: 0,
};

const PROFILE_STORAGE_KEY = "plumbassist_profile";
const LOGO_STORAGE_KEY = "plumbassist_profile_logo";

/**
 * Load profile from localStorage
 */
export function loadProfile(): ClientProfile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      // Load logo separately if it exists
      const logo = localStorage.getItem(LOGO_STORAGE_KEY);
      if (logo) {
        profile.logoBase64 = logo;
      }
      return { ...DEFAULT_PROFILE, ...profile };
    }
  } catch (error) {
    console.error("Error loading profile from localStorage:", error);
  }
  return DEFAULT_PROFILE;
}

/**
 * Save profile to localStorage
 */
export function saveProfile(profile: ClientProfile): boolean {
  try {
    // Save profile data (excluding logo)
    const profileToStore = { ...profile };
    const logo = profileToStore.logoBase64;
    delete (profileToStore as Partial<ClientProfile>).logoBase64;

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileToStore));

    // Save logo separately (it can be large)
    if (logo) {
      localStorage.setItem(LOGO_STORAGE_KEY, logo);
    } else {
      localStorage.removeItem(LOGO_STORAGE_KEY);
    }

    return true;
  } catch (error) {
    console.error("Error saving profile to localStorage:", error);
    return false;
  }
}

/**
 * Clear all profile data
 */
export function clearProfile(): boolean {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(LOGO_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing profile from localStorage:", error);
    return false;
  }
}

/**
 * Calculate profile completion percentage
 * Each field counts as a point, total 11 fields
 */
export function calculateProfileCompletion(profile: ClientProfile): {
  percentage: number;
  status: "getting-started" | "looking-good" | "complete";
  filledFields: number;
  totalFields: number;
} {
  const fields = [
    profile.fullName,
    profile.businessRegistrationNumber,
    profile.vatNumber,
    profile.email,
    profile.phoneNumber,
    profile.whatsappNumber,
    profile.streetAddress,
    profile.suburb,
    profile.city,
    profile.province,
    profile.postalCode,
  ];

  const filledFields = fields.filter((field) => field && field.trim() !== "").length;
  const totalFields = fields.length;
  const percentage = Math.round((filledFields / totalFields) * 100);

  let status: "getting-started" | "looking-good" | "complete";
  if (filledFields <= 3) {
    status = "getting-started";
  } else if (filledFields <= 8) {
    status = "looking-good";
  } else {
    status = "complete";
  }

  return { percentage, status, filledFields, totalFields };
}

/**
 * Convert file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File size must be less than 2MB" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP formats are allowed",
    };
  }

  return { valid: true };
}

/**
 * Get profile display name
 */
export function getProfileDisplayName(profile: ClientProfile): string {
  if (profile.fullName) {
    return profile.fullName;
  }
  return "My Profile";
}

/**
 * Format profile for display in reports
 */
export function formatProfileForReport(profile: ClientProfile): {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  vatNumber: string;
  registrationNumber: string;
  logo: string | null;
} {
  const address = [
    profile.streetAddress,
    profile.suburb,
    profile.city,
    profile.province,
    profile.postalCode,
  ]
    .filter((part) => part && part.trim() !== "")
    .join(", ");

  return {
    companyName: profile.fullName || "Plumbing Services",
    contactName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phoneNumber || "",
    address: address || "",
    vatNumber: profile.vatNumber || "",
    registrationNumber: profile.businessRegistrationNumber || "",
    logo: profile.logoBase64 || null,
  };
}

/**
 * Get profile completion status text
 */
export function getProfileStatusText(
  status: "getting-started" | "looking-good" | "complete"
): string {
  const statusMap = {
    "getting-started": "Getting started",
    "looking-good": "Looking good",
    complete: "Profile complete",
  };
  return statusMap[status];
}

/**
 * Get profile completion color
 */
export function getProfileStatusColor(
  status: "getting-started" | "looking-good" | "complete"
): string {
  const colorMap = {
    "getting-started": "bg-red-500",
    "looking-good": "bg-amber-500",
    complete: "bg-green-500",
  };
  return colorMap[status];
}

/**
 * South African provinces
 */
export const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

/**
 * Create profile from form data
 */
export function createProfileFromFormData(formData: Record<string, string>): ClientProfile {
  return {
    fullName: formData.fullName || "",
    businessRegistrationNumber: formData.businessRegistrationNumber || "",
    vatNumber: formData.vatNumber || "",
    email: formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    whatsappNumber: formData.whatsappNumber || "",
    streetAddress: formData.streetAddress || "",
    suburb: formData.suburb || "",
    city: formData.city || "",
    province: formData.province || "",
    postalCode: formData.postalCode || "",
    logoBase64: formData.logoBase64 || null,
    accentColor: formData.accentColor || "#0066cc",
    lastUpdated: Date.now(),
  };
}
