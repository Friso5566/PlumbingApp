import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClientProfile,
  loadProfile,
  saveProfile,
  clearProfile,
  calculateProfileCompletion,
  fileToBase64,
  validateImageFile,
  SA_PROVINCES,
  getProfileStatusColor,
  getProfileStatusText,
} from "@/lib/profileStorage";

interface ClientInfoPageProps {
  onClose: () => void;
}

export function ClientInfoPage({ onClose }: ClientInfoPageProps) {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load profile from localStorage on mount
    const loadedProfile = loadProfile();
    setProfile(loadedProfile);
  }, []);

  if (!profile) {
    return null;
  }

  const completion = calculateProfileCompletion(profile);
  const statusColor = getProfileStatusColor(completion.status);
  const statusText = getProfileStatusText(completion.status);

  const handleInputChange = (field: keyof ClientProfile, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null));
    setErrorMessage("");
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file");
      return;
    }

    try {
      setIsLoading(true);
      const base64 = await fileToBase64(file);
      setProfile((prev) =>
        prev ? { ...prev, logoBase64: base64 } : null
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to upload image");
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLogo = () => {
    setProfile((prev) =>
      prev ? { ...prev, logoBase64: null } : null
    );
  };

  const handleSaveProfile = () => {
    if (!profile) return;

    const success = saveProfile(profile);
    if (success) {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      setErrorMessage("Failed to save profile");
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all profile information? This cannot be undone."
      )
    ) {
      clearProfile();
      setProfile(loadProfile());
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Business Profile</h1>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Completion Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Profile Completion</h2>
              <span className="text-sm font-semibold text-gray-900">
                {completion.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${statusColor}`}
                style={{ width: `${completion.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{statusText}</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Section - Logo Upload */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Logo / Photo</h3>
              </div>

              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleLogoUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className={`block w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    profile.logoBase64
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {profile.logoBase64 ? (
                    <img
                      src={profile.logoBase64}
                      alt="Company logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600 text-center px-4">
                        Upload your company logo or photo
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Upload Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  disabled={isLoading}
                  className="flex-1"
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                {profile.logoBase64 && (
                  <Button
                    onClick={handleRemoveLogo}
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Right Section - Business Details Form */}
            <div className="space-y-6">
              {/* Personal / Business Identity */}
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal / Business Identity
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name or Trading Name
                  </label>
                  <Input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="e.g. John Smith or Cape Plumbing Co"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Registration Number
                  </label>
                  <Input
                    type="text"
                    value={profile.businessRegistrationNumber}
                    onChange={(e) =>
                      handleInputChange("businessRegistrationNumber", e.target.value)
                    }
                    placeholder="Optional"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT No (for invoices)
                  </label>
                  <Input
                    type="text"
                    value={profile.vatNumber}
                    onChange={(e) => handleInputChange("vatNumber", e.target.value)}
                    placeholder="Optional"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g. info@capeplumbing.co.za"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="e.g. 082 123 4567"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number
                  </label>
                  <Input
                    type="tel"
                    value={profile.whatsappNumber}
                    onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                    placeholder="Optional"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Address - Full Width */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900">Business Address</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <Input
                type="text"
                value={profile.streetAddress}
                onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                placeholder="e.g. 123 Main Street"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suburb
                </label>
                <Input
                  type="text"
                  value={profile.suburb}
                  onChange={(e) => handleInputChange("suburb", e.target.value)}
                  placeholder="e.g. Constantia"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="e.g. Cape Town"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province
                </label>
                <Select value={profile.province} onValueChange={(value) => handleInputChange("province", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  type="text"
                  value={profile.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  placeholder="e.g. 8001"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Save Profile
            </Button>
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in-out">
          Profile saved successfully
        </div>
      )}
    </div>
  );
}
