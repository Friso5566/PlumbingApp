import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateInspectionReport, generateQuoteReport, ReportData } from "@/lib/reportGenerator";
import { X, Mail } from "lucide-react";
import { EmailReportModal } from "./EmailReportModal";
import { loadProfile } from "@/lib/profileStorage";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessages: Array<{ role: string; content: string }>;
  uploadedImages: string[];
}

export function ReportModal({ isOpen, onClose, chatMessages, uploadedImages }: ReportModalProps) {
  const [step, setStep] = useState<"type" | "details">("type");
  const [reportType, setReportType] = useState<"inspection" | "quote" | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string>();
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [jobSiteAddress, setJobSiteAddress] = useState("");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [generatedPdfBuffer, setGeneratedPdfBuffer] = useState<string | undefined>();

  // Load profile data on mount
  useEffect(() => {
    const profile = loadProfile();
    if (profile.fullName) {
      setCompanyName(profile.fullName);
    }
    if (profile.logoBase64) {
      setCompanyLogo(profile.logoBase64);
    }
  }, [isOpen]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReport = async () => {
    if (!reportType || !companyName || !clientName || !clientAddress) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const refNum = referenceNumber || `PA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

      const reportData: ReportData = {
        reportType,
        companyName,
        companyLogo,
        clientName,
        clientAddress,
        jobSiteAddress: jobSiteAddress || clientAddress,
        inspectionDate,
        referenceNumber: refNum,
        chatMessages,
        uploadedImages,
      };

      if (reportType === "inspection") {
        generateInspectionReport(reportData);
      } else {
        generateQuoteReport(reportData);
      }
      
      // Show email modal after report generation
      setIsEmailModalOpen(true);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {step === "type" ? (
            <>
              <DialogHeader>
                <DialogTitle>Generate Job Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Select the type of report you want to generate:</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setReportType("inspection");
                      setStep("details");
                    }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <h3 className="font-bold text-lg mb-2">Inspection Report</h3>
                    <p className="text-sm text-gray-600">For assessing plumbing problems and diagnostics</p>
                  </button>
                  <button
                    onClick={() => {
                      setReportType("quote");
                      setStep("details");
                    }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition"
                  >
                    <h3 className="font-bold text-lg mb-2">Job Quote</h3>
                    <p className="text-sm text-gray-600">For quoting repairs or installation jobs</p>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  {reportType === "inspection" ? "Inspection Report" : "Job Quote"} Details
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Company Details */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your plumbing company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    {companyLogo && (
                      <button
                        onClick={() => setCompanyLogo(undefined)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {companyLogo && (
                    <img src={companyLogo} alt="Logo preview" className="h-12 mt-2" />
                  )}
                </div>

                {/* Client Details */}
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientAddress">Client Address *</Label>
                  <Textarea
                    id="clientAddress"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Client address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobSiteAddress">Job Site Address (if different)</Label>
                  <Textarea
                    id="jobSiteAddress"
                    value={jobSiteAddress}
                    onChange={(e) => setJobSiteAddress(e.target.value)}
                    placeholder="Leave blank if same as client address"
                    rows={2}
                  />
                </div>

                {/* Report Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspectionDate">Inspection Date *</Label>
                    <Input
                      id="inspectionDate"
                      type="date"
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referenceNumber">Reference Number (auto-generated if blank)</Label>
                    <Input
                      id="referenceNumber"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g., PA-2026-0042"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("type")}
                    disabled={isGenerating}
                  >
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <EmailReportModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          onClose();
        }}
        reportType={reportType || "inspection"}
        companyName={companyName}
        clientName={clientName}
        referenceNumber={referenceNumber || `PA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`}
      />
    </>
  );
}
