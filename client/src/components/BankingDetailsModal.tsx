import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { BankingDetails, BANK_DETAILS, BANK_LIST } from "@/lib/invoiceTypes";
import { saveBankingDetails, getBankingDetails } from "@/lib/invoiceStorage";
import { loadProfile } from "@/lib/profileStorage";
import { toast } from "sonner";

interface BankingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (details: BankingDetails) => void;
  isEditing?: boolean;
}

export function BankingDetailsModal({ isOpen, onClose, onSave, isEditing = false }: BankingDetailsModalProps) {
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"cheque" | "savings" | "transmission">("cheque");
  const [branchCode, setBranchCode] = useState("");
  const [referenceFormat, setReferenceFormat] = useState<"invoice-number" | "client-name" | "job-reference" | "custom">(
    "invoice-number"
  );
  const [customPrefix, setCustomPrefix] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing banking details if editing
      const existing = getBankingDetails();
      if (existing) {
        setBankName(existing.bankName);
        setAccountHolderName(existing.accountHolderName);
        setAccountNumber(existing.accountNumber);
        setAccountType(existing.accountType);
        setBranchCode(existing.branchCode);
        setReferenceFormat(existing.referenceFormat);
        setCustomPrefix(existing.customPrefix || "");
      } else {
        // Pre-fill account holder name from profile
        const profile = loadProfile();
        if (profile && typeof profile === 'object' && 'companyName' in profile) {
          const companyName = (profile as any).companyName;
          if (companyName) {
            setAccountHolderName(companyName);
          }
        }
      }
    }
  }, [isOpen]);

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setBankName(selected);

    // Auto-fill branch code
    const bankKey = Object.keys(BANK_DETAILS).find((key) => BANK_DETAILS[key].name === selected);
    if (bankKey) {
      setBranchCode(BANK_DETAILS[bankKey].branchCode);
    }
  };

  const validateForm = (): boolean => {
    if (!bankName.trim()) {
      toast.error("Please select a bank");
      return false;
    }
    if (!accountHolderName.trim()) {
      toast.error("Please enter account holder name");
      return false;
    }
    if (!accountNumber.trim()) {
      toast.error("Please enter account number");
      return false;
    }
    if (!branchCode.trim()) {
      toast.error("Please enter branch code");
      return false;
    }
    if (referenceFormat === "custom" && !customPrefix.trim()) {
      toast.error("Please enter custom prefix");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const details: BankingDetails = {
        bankName,
        accountHolderName,
        accountNumber,
        accountType,
        branchCode,
        referenceFormat,
        customPrefix: referenceFormat === "custom" ? customPrefix : undefined,
      };

      saveBankingDetails(details);
      toast.success(isEditing ? "Banking details updated" : "Banking details saved successfully");
      onSave?.(details);
      onClose();
    } catch (error) {
      toast.error("Failed to save banking details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Banking Details Setup</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name *</label>
            <select
              value={bankName}
              onChange={handleBankChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a bank...</option>
              {BANK_LIST.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Account Holder Name *</label>
            <Input
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              placeholder="e.g., John's Plumbing Services"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium mb-2">Account Number *</label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g., 1234567890"
              type="text"
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Account Type *</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as "cheque" | "savings" | "transmission")}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cheque">Cheque/Current</option>
              <option value="savings">Savings</option>
              <option value="transmission">Transmission</option>
            </select>
          </div>

          {/* Branch Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Branch Code *</label>
            <Input
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g., 632005"
              type="text"
            />
          </div>

          {/* Reference Format */}
          <div>
            <label className="block text-sm font-medium mb-3">Payment Reference Format *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="invoice-number"
                  checked={referenceFormat === "invoice-number"}
                  onChange={(e) => setReferenceFormat(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Use Invoice Number (e.g., PA-INV-2026-0012)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="client-name"
                  checked={referenceFormat === "client-name"}
                  onChange={(e) => setReferenceFormat(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Use Client Name (e.g., JOHNSMITH)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="job-reference"
                  checked={referenceFormat === "job-reference"}
                  onChange={(e) => setReferenceFormat(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Use Job Reference (e.g., PA-2026-0042)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="custom"
                  checked={referenceFormat === "custom"}
                  onChange={(e) => setReferenceFormat(e.target.value as any)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Custom Prefix</span>
              </label>
              {referenceFormat === "custom" && (
                <Input
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  placeholder="e.g., PLUMB"
                  className="ml-6"
                />
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Why we need this</p>
            <p>These details will appear on every invoice you generate, making it easy for clients to pay you via EFT.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
              {isLoading ? "Saving..." : isEditing ? "Update Details" : "Save Details"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
