import { Invoice, BankingDetails, InvoiceSettings, DEFAULT_INVOICE_SETTINGS, InvoiceStatus, TimelineEntry } from "./invoiceTypes";

const INVOICES_KEY = "plumbassist_invoices";
const BANKING_KEY = "plumbassist_banking";
const INVOICE_COUNTER_KEY = "plumbassist_invoice_counter";
const INVOICE_SETTINGS_KEY = "plumbassist_invoice_settings";

// ============ INVOICE NUMBERING ============
export function generateInvoiceNumber(): string {
  const counter = getInvoiceCounter();
  const year = new Date().getFullYear();
  const paddedNumber = String(counter).padStart(4, "0");
  return `PA-INV-${year}-${paddedNumber}`;
}

function getInvoiceCounter(): number {
  const stored = localStorage.getItem(INVOICE_COUNTER_KEY);
  return stored ? parseInt(stored, 10) : 1;
}

function incrementInvoiceCounter(): void {
  const current = getInvoiceCounter();
  localStorage.setItem(INVOICE_COUNTER_KEY, String(current + 1));
}

export function setNextInvoiceNumber(number: number): void {
  localStorage.setItem(INVOICE_COUNTER_KEY, String(number));
}

// ============ BANKING DETAILS ============
export function saveBankingDetails(details: BankingDetails): void {
  localStorage.setItem(BANKING_KEY, JSON.stringify(details));
}

export function getBankingDetails(): BankingDetails | null {
  const stored = localStorage.getItem(BANKING_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearBankingDetails(): void {
  localStorage.removeItem(BANKING_KEY);
}

// ============ INVOICE SETTINGS ============
export function saveInvoiceSettings(settings: InvoiceSettings): void {
  localStorage.setItem(INVOICE_SETTINGS_KEY, JSON.stringify(settings));
}

export function getInvoiceSettings(): InvoiceSettings {
  const stored = localStorage.getItem(INVOICE_SETTINGS_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_INVOICE_SETTINGS;
}

export function resetInvoiceSettings(): void {
  localStorage.setItem(INVOICE_SETTINGS_KEY, JSON.stringify(DEFAULT_INVOICE_SETTINGS));
}

// ============ INVOICE CRUD ============
export function saveInvoice(invoice: Invoice): void {
  const invoices = loadAllInvoices();
  const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);

  if (existingIndex >= 0) {
    invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    invoices.push({ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    // Only increment if this is a new auto-generated number
    if (invoice.invoiceNumber.startsWith("PA-INV-")) {
      incrementInvoiceCounter();
    }
  }

  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function loadAllInvoices(): Invoice[] {
  const stored = localStorage.getItem(INVOICES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getInvoiceById(id: string): Invoice | null {
  const invoices = loadAllInvoices();
  return invoices.find((inv) => inv.id === id) || null;
}

export function getInvoicesByJobId(jobId: string): Invoice[] {
  const invoices = loadAllInvoices();
  return invoices.filter((inv) => inv.jobId === jobId);
}

export function deleteInvoice(id: string): void {
  const invoices = loadAllInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): void {
  const invoice = getInvoiceById(id);
  if (!invoice) return;

  invoice.status = status;
  invoice.updatedAt = new Date().toISOString();

  if (status === "sent" && !invoice.sentAt) {
    invoice.sentAt = new Date().toISOString();
  }

  if (status === "paid" && !invoice.paidAt) {
    invoice.paidAt = new Date().toISOString();
  }

  saveInvoice(invoice);
}

export function markInvoiceAsPaid(id: string, amount: number): void {
  const invoice = getInvoiceById(id);
  if (!invoice) return;

  invoice.status = "paid";
  invoice.paidAt = new Date().toISOString();
  invoice.paidAmount = amount;
  invoice.updatedAt = new Date().toISOString();

  saveInvoice(invoice);
}

// ============ INVOICE CALCULATIONS ============
export function calculateInvoiceTotals(lineItems: Array<{ quantity: number; unitPrice: number; vatable: boolean }>) {
  let subtotal = 0;
  let vatableAmount = 0;

  lineItems.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    if (item.vatable) {
      vatableAmount += itemTotal;
    }
  });

  const vatAmount = vatableAmount * 0.15; // 15% VAT
  const total = subtotal + vatAmount;

  return { subtotal, vatAmount, total };
}

// ============ INVOICE SEARCH & FILTER ============
export function searchInvoices(query: string): Invoice[] {
  const invoices = loadAllInvoices();
  const lowerQuery = query.toLowerCase();

  return invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(lowerQuery) ||
      inv.clientName.toLowerCase().includes(lowerQuery) ||
      inv.clientEmail.toLowerCase().includes(lowerQuery) ||
      inv.companyName.toLowerCase().includes(lowerQuery)
  );
}

export function filterInvoices(
  invoices: Invoice[],
  filters: {
    status?: InvoiceStatus[];
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
  }
): Invoice[] {
  let result = [...invoices];

  if (filters.status && filters.status.length > 0) {
    result = result.filter((inv) => filters.status!.includes(inv.status));
  }

  if (filters.dateFrom) {
    result = result.filter((inv) => new Date(inv.invoiceDate) >= new Date(filters.dateFrom!));
  }

  if (filters.dateTo) {
    result = result.filter((inv) => new Date(inv.invoiceDate) <= new Date(filters.dateTo!));
  }

  if (filters.minAmount !== undefined) {
    result = result.filter((inv) => inv.total >= filters.minAmount!);
  }

  if (filters.maxAmount !== undefined) {
    result = result.filter((inv) => inv.total <= filters.maxAmount!);
  }

  return result;
}

// ============ OVERDUE DETECTION ============
export function checkOverdueInvoices(): void {
  const invoices = loadAllInvoices();
  const today = new Date();

  invoices.forEach((inv) => {
    if (inv.status === "sent") {
      const dueDate = new Date(inv.paymentDueDate);
      if (dueDate < today) {
        inv.status = "overdue";
        inv.updatedAt = new Date().toISOString();
        saveInvoice(inv);
      }
    }
  });
}

export function getOverdueInvoices(): Invoice[] {
  checkOverdueInvoices();
  const invoices = loadAllInvoices();
  return invoices.filter((inv) => inv.status === "overdue");
}

export function getOutstandingInvoices(): Invoice[] {
  const invoices = loadAllInvoices();
  return invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue");
}

// ============ FINANCIAL SUMMARY ============
export interface FinancialSummary {
  outstanding: number;
  overdue: number;
  paidThisMonth: number;
  totalInvoiced: number;
}

export function calculateFinancialSummary(): FinancialSummary {
  const invoices = loadAllInvoices();
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  let outstanding = 0;
  let overdue = 0;
  let paidThisMonth = 0;
  let totalInvoiced = 0;

  invoices.forEach((inv) => {
    totalInvoiced += inv.total;

    if (inv.status === "sent" || inv.status === "overdue") {
      outstanding += inv.total;
    }

    if (inv.status === "overdue") {
      overdue += inv.total;
    }

    if (inv.status === "paid" && inv.paidAt) {
      const paidDate = new Date(inv.paidAt);
      if (paidDate >= monthStart && paidDate <= today) {
        paidThisMonth += inv.paidAmount || inv.total;
      }
    }
  });

  return { outstanding, overdue, paidThisMonth, totalInvoiced };
}

// ============ REPEAT CLIENT DETECTION ============
export function findRepeatClient(clientName: string, clientPhone?: string): Array<{ jobId: string; total: number; date: string }> {
  // This would typically query the jobs database
  // For now, we'll return an empty array as this requires job data integration
  return [];
}

// ============ CLEAR ALL DATA ============
export function clearAllInvoices(): void {
  localStorage.removeItem(INVOICES_KEY);
  localStorage.removeItem(INVOICE_COUNTER_KEY);
  localStorage.removeItem(BANKING_KEY);
  localStorage.removeItem(INVOICE_SETTINGS_KEY);
}
