export type InvoiceStatus = "draft" | "sent" | "overdue" | "paid" | "cancelled";

export type AccountType = "cheque" | "savings" | "transmission";

export type ReferenceFormat = "invoice-number" | "client-name" | "job-reference" | "custom";

export interface BankingDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: AccountType;
  branchCode: string;
  referenceFormat: ReferenceFormat;
  customPrefix?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  vatable: boolean;
}

export interface Invoice {
  id: string;
  jobId: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentDueDate: string;
  purchaseOrderNumber?: string;
  status: InvoiceStatus;
  
  // Bill To
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientVatNumber?: string;
  clientPhone?: string;
  
  // Bill From
  companyName: string;
  companyAddress: string;
  companyLicenceNumber?: string;
  companyVatNumber?: string;
  companyLogo?: string;
  companyBrandColour?: string;
  
  // Line Items
  lineItems: LineItem[];
  
  // Totals (calculated)
  subtotal: number;
  vatAmount: number;
  total: number;
  
  // Payment Terms
  paymentTerms: string;
  includeThankYouMessage: boolean;
  thankYouMessage?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  paidAt?: string;
  paidAmount?: number;
  notes?: string;
}

export interface InvoiceSettings {
  defaultPaymentTerms: string;
  defaultDueDateDays: number;
  defaultCallOutFee: number;
  vatRegistered: boolean;
  vatRegistrationNumber?: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
}

export interface TimelineEntry {
  timestamp: string;
  type: "status-change" | "payment-received" | "invoice-sent" | "invoice-created";
  description: string;
  status?: InvoiceStatus;
  amount?: number;
}

export interface InvoiceWithTimeline extends Invoice {
  timeline: TimelineEntry[];
}

// Bank details with auto-fill branch codes
export const BANK_DETAILS: Record<string, { name: string; branchCode: string }> = {
  absa: { name: "ABSA", branchCode: "632005" },
  fnb: { name: "FNB", branchCode: "250655" },
  standardbank: { name: "Standard Bank", branchCode: "051001" },
  nedbank: { name: "Nedbank", branchCode: "198765" },
  capitec: { name: "Capitec", branchCode: "470010" },
  discoverybank: { name: "Discovery Bank", branchCode: "679000" },
  tymebank: { name: "TymeBank", branchCode: "678910" },
  africanbank: { name: "African Bank", branchCode: "632020" },
};

export const BANK_LIST = Object.values(BANK_DETAILS).map((b) => b.name);

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  defaultPaymentTerms:
    "Payment is due within 30 days of invoice date.\nEFT payment preferred. Please use invoice number as payment reference.\nNo work will commence on future jobs until outstanding invoices are settled.",
  defaultDueDateDays: 30,
  defaultCallOutFee: 350,
  vatRegistered: false,
  invoicePrefix: "PA-INV",
  nextInvoiceNumber: 1,
};

export const DEFAULT_THANK_YOU_MESSAGE = "Thank you for choosing [Company Name]. We appreciate your business and look forward to working with you again.";
