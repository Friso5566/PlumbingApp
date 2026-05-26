import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import { Invoice, LineItem } from "@/lib/invoiceTypes";
import { saveInvoice, generateInvoiceNumber, getInvoiceSettings, calculateInvoiceTotals } from "@/lib/invoiceStorage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  companyName?: string;
  companyAddress?: string;
  companyLogo?: string;
  companyBrandColour?: string;
  onSuccess?: (invoice: Invoice) => void;
}

export function CreateInvoiceModal({
  isOpen,
  onClose,
  jobId,
  clientName = "",
  clientAddress = "",
  clientEmail = "",
  clientPhone = "",
  companyName = "",
  companyAddress = "",
  companyLogo = "",
  companyBrandColour = "#3B82F6",
  onSuccess,
}: CreateInvoiceModalProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentDueDate, setPaymentDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");

  const [billToName, setBillToName] = useState(clientName);
  const [billToAddress, setBillToAddress] = useState(clientAddress);
  const [billToEmail, setBillToEmail] = useState(clientEmail);
  const [billToVat, setBillToVat] = useState("");

  const [billFromName, setBillFromName] = useState(companyName);
  const [billFromAddress, setBillFromAddress] = useState(companyAddress);
  const [billFromLicence, setBillFromLicence] = useState("");
  const [billFromVat, setBillFromVat] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [includeThankYou, setIncludeThankYou] = useState(true);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [markAsInvoiced, setMarkAsInvoiced] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const settings = getInvoiceSettings();

  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber(generateInvoiceNumber());
      setPaymentTerms(settings.defaultPaymentTerms);
      setThankYouMessage(`Thank you for choosing ${companyName}. We appreciate your business and look forward to working with you again.`);
    }
  }, [isOpen]);

  const { subtotal, vatAmount, total } = calculateInvoiceTotals(lineItems);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        unit: "hour",
        unitPrice: 0,
        vatable: true,
      },
    ]);
  };

  const addLabourItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: uuidv4(),
        description: "Labour",
        quantity: 1,
        unit: "hour",
        unitPrice: 350,
        vatable: true,
      },
    ]);
  };

  const addCallOutFee = () => {
    setLineItems([
      ...lineItems,
      {
        id: uuidv4(),
        description: "Call-Out Fee",
        quantity: 1,
        unit: "service",
        unitPrice: settings.defaultCallOutFee,
        vatable: true,
      },
    ]);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const setDueDateOffset = (days: number) => {
    const newDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setPaymentDueDate(newDate.toISOString().split("T")[0]);
  };

  const validateForm = (): boolean => {
    if (!billToName.trim()) {
      toast.error("Please enter client name");
      return false;
    }
    if (lineItems.length === 0) {
      toast.error("Please add at least one line item");
      return false;
    }
    if (lineItems.some((item) => !item.description.trim() || item.unitPrice <= 0)) {
      toast.error("Please fill in all line item details");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const invoice: Invoice = {
        id: uuidv4(),
        jobId,
        invoiceNumber,
        invoiceDate,
        paymentDueDate,
        purchaseOrderNumber: purchaseOrderNumber || undefined,
        status: "draft",
        clientName: billToName,
        clientAddress: billToAddress,
        clientEmail: billToEmail,
        clientVatNumber: billToVat || undefined,
        clientPhone,
        companyName: billFromName,
        companyAddress: billFromAddress,
        companyLicenceNumber: billFromLicence || undefined,
        companyVatNumber: billFromVat || undefined,
        companyLogo,
        companyBrandColour,
        lineItems,
        subtotal,
        vatAmount,
        total,
        paymentTerms,
        includeThankYouMessage: includeThankYou,
        thankYouMessage: includeThankYou ? thankYouMessage : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(invoice);
      toast.success("Invoice created successfully");
      onSuccess?.(invoice);
      onClose();
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Identity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Number</label>
              <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Date</label>
              <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Due Date</label>
              <div className="flex gap-2 mb-2">
                <Button size="sm" variant="outline" onClick={() => setDueDateOffset(7)}>
                  +7d
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDueDateOffset(14)}>
                  +14d
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDueDateOffset(30)}>
                  +30d
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDueDateOffset(60)}>
                  +60d
                </Button>
              </div>
              <Input type="date" value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Purchase Order Number (Optional)</label>
              <Input value={purchaseOrderNumber} onChange={(e) => setPurchaseOrderNumber(e.target.value)} />
            </div>
          </div>

          {/* Bill To */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Bill To (Client Details)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Client Name" value={billToName} onChange={(e) => setBillToName(e.target.value)} />
              <Input placeholder="Client Email" value={billToEmail} onChange={(e) => setBillToEmail(e.target.value)} />
              <Input placeholder="Client Address" value={billToAddress} onChange={(e) => setBillToAddress(e.target.value)} />
              <Input placeholder="Client VAT Number (Optional)" value={billToVat} onChange={(e) => setBillToVat(e.target.value)} />
            </div>
          </div>

          {/* Bill From */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Bill From (Company Details)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Company Name" value={billFromName} onChange={(e) => setBillFromName(e.target.value)} />
              <Input placeholder="Plumbing Licence Number" value={billFromLicence} onChange={(e) => setBillFromLicence(e.target.value)} />
              <Input placeholder="Company Address" value={billFromAddress} onChange={(e) => setBillFromAddress(e.target.value)} />
              <Input placeholder="VAT Registration Number" value={billFromVat} onChange={(e) => setBillFromVat(e.target.value)} />
            </div>
          </div>

          {/* Line Items */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Line Items</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={addLineItem}>
                  <Plus className="w-4 h-4 mr-1" /> Add Item
                </Button>
                <Button size="sm" variant="outline" onClick={addLabourItem}>
                  <Plus className="w-4 h-4 mr-1" /> Labour
                </Button>
                <Button size="sm" variant="outline" onClick={addCallOutFee}>
                  <Plus className="w-4 h-4 mr-1" /> Call-Out Fee
                </Button>
              </div>
            </div>

            {lineItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No line items yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2">Description</th>
                      <th className="text-right px-3 py-2">Qty</th>
                      <th className="text-left px-3 py-2">Unit</th>
                      <th className="text-right px-3 py-2">Unit Price</th>
                      <th className="text-right px-3 py-2">Total</th>
                      <th className="text-center px-3 py-2">VAT?</th>
                      <th className="text-center px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            className="text-sm"
                            placeholder="Description"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                            className="text-sm text-right"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, "unit", e.target.value)}
                            className="text-sm"
                            placeholder="hour"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="text-sm text-right"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          R{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={item.vatable}
                            onChange={(e) => updateLineItem(item.id, "vatable", e.target.checked)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal (excl. VAT):</span>
                <span className="font-medium">R{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (15%):</span>
                <span className="font-medium">R{vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-bold">
                <span>TOTAL DUE (incl. VAT):</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">Payment Terms</label>
            <textarea
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
              rows={4}
            />
          </div>

          {/* Thank You Message */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={includeThankYou}
                onChange={(e) => setIncludeThankYou(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Include "Thank You" message</span>
            </label>
            {includeThankYou && (
              <textarea
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2}
              />
            )}
          </div>

          {/* Options */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={markAsInvoiced}
                onChange={(e) => setMarkAsInvoiced(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Mark job as "Invoiced" automatically</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
