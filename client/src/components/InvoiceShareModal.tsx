import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, MessageCircle, Mail, Copy, Check } from "lucide-react";
import { Invoice } from "@/lib/invoiceTypes";
import {
  formatPhoneNumber,
  isValidPhoneNumber,
  generateInvoiceSummary,
  createInvoiceWhatsAppMessage,
  shareInvoiceViaWhatsApp,
  copyToClipboard,
} from "@/lib/whatsappIntegration";
import { getBankingDetails } from "@/lib/invoiceStorage";
import { toast } from "sonner";

interface InvoiceShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
}

export function InvoiceShareModal({ isOpen, onClose, invoice }: InvoiceShareModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(invoice.clientPhone || "");
  const [clientEmail, setClientEmail] = useState(invoice.clientEmail || "");
  const [shareMethod, setShareMethod] = useState<"whatsapp" | "email" | "copy">("whatsapp");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankingDetails = getBankingDetails();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientEmail(e.target.value);
  };

  const handleShareWhatsApp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const message = createInvoiceWhatsAppMessage(invoice, bankingDetails);
      shareInvoiceViaWhatsApp(invoice, phoneNumber, bankingDetails);
      toast.success("Opening WhatsApp...");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to share via WhatsApp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async () => {
    const message = createInvoiceWhatsAppMessage(invoice, bankingDetails);
    const success = await copyToClipboard(message);
    if (success) {
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy message");
    }
  };

  const messagePreview = createInvoiceWhatsAppMessage(invoice, bankingDetails);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Share Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Method Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setShareMethod("whatsapp")}
              className={`px-4 py-2 font-medium border-b-2 ${
                shareMethod === "whatsapp"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              WhatsApp
            </button>
            <button
              onClick={() => setShareMethod("email")}
              className={`px-4 py-2 font-medium border-b-2 ${
                shareMethod === "email"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setShareMethod("copy")}
              className={`px-4 py-2 font-medium border-b-2 ${
                shareMethod === "copy"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <Copy className="w-4 h-4 inline mr-2" />
              Copy
            </button>
          </div>

          {/* WhatsApp Share */}
          {shareMethod === "whatsapp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Phone Number *</label>
                <Input
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+27 12 345 6789 or 0123456789"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +27XXXXXXXXX (South Africa) or international format
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">
                  <strong>💡 Tip:</strong> The invoice summary will be sent as a WhatsApp message. The client can save it and
                  use the payment reference to make an EFT payment.
                </p>
              </div>
            </div>
          )}

          {/* Email Share */}
          {shareMethod === "email" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Client Email *</label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={handleEmailChange}
                  placeholder="client@example.com"
                  className="text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Email is coming soon! For now, use WhatsApp or copy the message to send manually.
                </p>
              </div>
            </div>
          )}

          {/* Copy to Clipboard */}
          {shareMethod === "copy" && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                <p className="text-sm text-purple-800">
                  <strong>💡 Tip:</strong> Copy the message below and paste it anywhere - WhatsApp, email, SMS, or your CRM.
                </p>
              </div>
            </div>
          )}

          {/* Message Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Message Preview</label>
            <div className="bg-gray-50 border rounded-md p-4 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm font-mono text-gray-700">
              {messagePreview}
            </div>
          </div>

          {/* Invoice Details Summary */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="font-semibold mb-3 text-sm">Invoice Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Invoice Number</p>
                <p className="font-medium">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Client</p>
                <p className="font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium text-green-600">R{invoice.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Due Date</p>
                <p className="font-medium">{new Date(invoice.paymentDueDate).toLocaleDateString("en-ZA")}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {shareMethod === "whatsapp" && (
              <Button
                onClick={handleShareWhatsApp}
                disabled={isLoading || !isValidPhoneNumber(phoneNumber)}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? "Opening..." : "Share via WhatsApp"}
              </Button>
            )}

            {shareMethod === "email" && (
              <Button disabled className="bg-gray-400">
                Email (Coming Soon)
              </Button>
            )}

            {shareMethod === "copy" && (
              <Button onClick={handleCopyMessage} className="bg-purple-500 hover:bg-purple-600">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
