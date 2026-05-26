import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: "inspection" | "quote";
  companyName: string;
  clientName: string;
  referenceNumber: string;
  pdfBuffer?: string; // base64 encoded PDF
}

export function EmailReportModal({
  isOpen,
  onClose,
  reportType,
  companyName,
  clientName,
  referenceNumber,
  pdfBuffer,
}: EmailReportModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendEmailMutation = trpc.plumbing.sendReportEmail.useMutation();

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendEmailMutation.mutateAsync({
        recipientEmail,
        reportType,
        companyName,
        clientName,
        referenceNumber,
        message,
        pdfBuffer: pdfBuffer || null,
      });

      toast.success("Report sent successfully!");
      setRecipientEmail("");
      setMessage("");
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send email";
      toast.error(errorMessage);
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Report via Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Report Info */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-semibold text-blue-900">
              {reportType === "inspection" ? "Inspection Report" : "Job Quote"}
            </p>
            <p className="text-blue-800">Ref: {referenceNumber}</p>
          </div>

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient Email Address *</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="client@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add any additional notes or instructions for the client..."
              rows={4}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              This message will be included in the email body
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isLoading || !recipientEmail.trim()}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center">
            The report PDF will be attached to the email
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
