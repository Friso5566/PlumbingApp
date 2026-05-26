import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  loadProfile,
  saveProfile,
  clearProfile,
  calculateProfileCompletion,
  fileToBase64,
  validateImageFile,
  getProfileDisplayName,
  formatProfileForReport,
  getProfileStatusText,
  getProfileStatusColor,
  DEFAULT_PROFILE,
  ClientProfile,
} from "./profileStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Profile Storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("loadProfile", () => {
    it("should return default profile when localStorage is empty", () => {
      const profile = loadProfile();
      expect(profile.fullName).toBe("");
      expect(profile.email).toBe("");
      expect(profile.accentColor).toBe("#0066cc");
    });

    it("should load profile from localStorage", () => {
      const testProfile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test Plumber",
        email: "test@example.com",
      };

      localStorage.setItem("plumbassist_profile", JSON.stringify(testProfile));
      const loaded = loadProfile();

      expect(loaded.fullName).toBe("Test Plumber");
      expect(loaded.email).toBe("test@example.com");
    });

    it("should load logo from separate storage key", () => {
      const testProfile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test Plumber",
      };

      localStorage.setItem("plumbassist_profile", JSON.stringify(testProfile));
      localStorage.setItem("plumbassist_profile_logo", "data:image/png;base64,abc123");

      const loaded = loadProfile();
      expect(loaded.logoBase64).toBe("data:image/png;base64,abc123");
    });
  });

  describe("saveProfile", () => {
    it("should save profile to localStorage", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test Plumber",
        email: "test@example.com",
      };

      const success = saveProfile(profile);
      expect(success).toBe(true);

      const stored = localStorage.getItem("plumbassist_profile");
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.fullName).toBe("Test Plumber");
      expect(parsed.email).toBe("test@example.com");
    });

    it("should save logo separately", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test Plumber",
        logoBase64: "data:image/png;base64,abc123",
      };

      saveProfile(profile);

      const logo = localStorage.getItem("plumbassist_profile_logo");
      expect(logo).toBe("data:image/png;base64,abc123");
    });

    it("should remove logo if not provided", () => {
      // First save with logo
      let profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        logoBase64: "data:image/png;base64,abc123",
      };
      saveProfile(profile);
      expect(localStorage.getItem("plumbassist_profile_logo")).toBeTruthy();

      // Then save without logo
      profile = { ...profile, logoBase64: null };
      saveProfile(profile);
      expect(localStorage.getItem("plumbassist_profile_logo")).toBeNull();
    });
  });

  describe("clearProfile", () => {
    it("should clear profile from localStorage", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test Plumber",
      };

      saveProfile(profile);
      expect(localStorage.getItem("plumbassist_profile")).toBeTruthy();

      const success = clearProfile();
      expect(success).toBe(true);
      expect(localStorage.getItem("plumbassist_profile")).toBeNull();
    });

    it("should clear logo from localStorage", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        logoBase64: "data:image/png;base64,abc123",
      };

      saveProfile(profile);
      expect(localStorage.getItem("plumbassist_profile_logo")).toBeTruthy();

      clearProfile();
      expect(localStorage.getItem("plumbassist_profile_logo")).toBeNull();
    });
  });

  describe("calculateProfileCompletion", () => {
    it("should return 0% for empty profile", () => {
      const completion = calculateProfileCompletion(DEFAULT_PROFILE);
      expect(completion.percentage).toBe(0);
      expect(completion.status).toBe("getting-started");
      expect(completion.filledFields).toBe(0);
    });

    it("should calculate percentage correctly", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test",
        email: "test@example.com",
        phoneNumber: "0821234567",
      };

      const completion = calculateProfileCompletion(profile);
      expect(completion.filledFields).toBe(3);
      expect(completion.percentage).toBe(27); // 3/11 * 100
    });

    it("should return 'looking-good' status for 4-8 fields", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test",
        email: "test@example.com",
        phoneNumber: "0821234567",
        streetAddress: "123 Main St",
        suburb: "Constantia",
      };

      const completion = calculateProfileCompletion(profile);
      expect(completion.status).toBe("looking-good");
    });

    it("should return 'complete' status for 9+ fields", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test",
        email: "test@example.com",
        phoneNumber: "0821234567",
        streetAddress: "123 Main St",
        suburb: "Constantia",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
        vatNumber: "4123456789",
      };

      const completion = calculateProfileCompletion(profile);
      expect(completion.status).toBe("complete");
    });
  });

  describe("validateImageFile", () => {
    it("should accept valid image files", () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it("should reject files larger than 2MB", () => {
      const largeData = new Uint8Array(3 * 1024 * 1024); // 3MB
      const file = new File([largeData], "large.jpg", { type: "image/jpeg" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("2MB");
    });

    it("should reject invalid file types", () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("JPG, PNG, and WebP");
    });

    it("should accept PNG and WebP formats", () => {
      const pngFile = new File(["test"], "test.png", { type: "image/png" });
      const webpFile = new File(["test"], "test.webp", { type: "image/webp" });

      expect(validateImageFile(pngFile).valid).toBe(true);
      expect(validateImageFile(webpFile).valid).toBe(true);
    });
  });

  describe("getProfileDisplayName", () => {
    it("should return full name if available", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "John Smith",
      };

      expect(getProfileDisplayName(profile)).toBe("John Smith");
    });

    it("should return default name if full name is empty", () => {
      expect(getProfileDisplayName(DEFAULT_PROFILE)).toBe("My Profile");
    });
  });

  describe("formatProfileForReport", () => {
    it("should format profile for report generation", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Cape Plumbing Co",
        email: "info@cape.co.za",
        phoneNumber: "0821234567",
        streetAddress: "123 Main St",
        suburb: "Constantia",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
        vatNumber: "4123456789",
      };

      const formatted = formatProfileForReport(profile);
      expect(formatted.companyName).toBe("Cape Plumbing Co");
      expect(formatted.email).toBe("info@cape.co.za");
      expect(formatted.phone).toBe("0821234567");
      expect(formatted.address).toContain("123 Main St");
      expect(formatted.address).toContain("Cape Town");
    });

    it("should use default company name if full name is empty", () => {
      const formatted = formatProfileForReport(DEFAULT_PROFILE);
      expect(formatted.companyName).toBe("Plumbing Services");
    });
  });

  describe("getProfileStatusText", () => {
    it("should return correct status text", () => {
      expect(getProfileStatusText("getting-started")).toBe("Getting started");
      expect(getProfileStatusText("looking-good")).toBe("Looking good");
      expect(getProfileStatusText("complete")).toBe("Profile complete");
    });
  });

  describe("getProfileStatusColor", () => {
    it("should return correct status colors", () => {
      expect(getProfileStatusColor("getting-started")).toBe("bg-red-500");
      expect(getProfileStatusColor("looking-good")).toBe("bg-amber-500");
      expect(getProfileStatusColor("complete")).toBe("bg-green-500");
    });
  });

  describe("Integration Tests", () => {
    it("should save and load profile with all data", () => {
      const profile: ClientProfile = {
        fullName: "Test Plumber",
        businessRegistrationNumber: "123456",
        vatNumber: "4123456789",
        email: "test@example.com",
        phoneNumber: "0821234567",
        whatsappNumber: "0821234567",
        streetAddress: "123 Main St",
        suburb: "Constantia",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
        logoBase64: "data:image/png;base64,abc123",
        accentColor: "#0066cc",
        lastUpdated: Date.now(),
      };

      saveProfile(profile);
      const loaded = loadProfile();

      expect(loaded.fullName).toBe(profile.fullName);
      expect(loaded.email).toBe(profile.email);
      expect(loaded.logoBase64).toBe(profile.logoBase64);
      expect(loaded.province).toBe("Western Cape");
    });

    it("should calculate completion after saving", () => {
      const profile: ClientProfile = {
        ...DEFAULT_PROFILE,
        fullName: "Test",
        email: "test@example.com",
      };

      saveProfile(profile);
      const loaded = loadProfile();
      const completion = calculateProfileCompletion(loaded);

      expect(completion.filledFields).toBe(2);
      expect(completion.status).toBe("getting-started");
    });
  });
});
