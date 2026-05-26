import { Invoice } from "./invoiceTypes";
import { Job } from "./jobTypes";

/**
 * Format phone number to international format
 * Accepts: +27123456789, 0123456789, 27123456789
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Handle South African numbers
  if (cleaned.startsWith("27")) {
    return cleaned;
  }
  if (cleaned.startsWith("0")) {
    return "27" + cleaned.substring(1);
  }

  // If no country code, assume South Africa
  if (cleaned.length === 9) {
    return "27" + cleaned;
  }

  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Check if it's a valid length (10-15 digits including country code)
  return formatted.length >= 10 && formatted.length <= 15 && /^\d+$/.test(formatted);
}

/**
 * Generate WhatsApp Web URL for sending message
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  const formatted = formatPhoneNumber(phoneNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${formatted}?text=${encoded}`;
}

/**
 * Generate invoice summary for WhatsApp
 */
export function generateInvoiceSummary(invoice: Invoice): string {
  const lines = [
    `🧾 *Invoice ${invoice.invoiceNumber}*`,
    ``,
    `*Client:* ${invoice.clientName}`,
    `*Invoice Date:* ${formatDate(invoice.invoiceDate)}`,
    `*Due Date:* ${formatDate(invoice.paymentDueDate)}`,
    ``,
    `*Items:*`,
  ];

  invoice.lineItems.forEach((item) => {
    const total = (item.quantity * item.unitPrice).toFixed(2);
    lines.push(`• ${item.description} (${item.quantity} ${item.unit}s @ R${item.unitPrice.toFixed(2)}) = R${total}`);
  });

  lines.push(``);
  lines.push(`*Subtotal:* R${invoice.subtotal.toFixed(2)}`);
  lines.push(`*VAT (15%):* R${invoice.vatAmount.toFixed(2)}`);
  lines.push(`*TOTAL DUE:* R${invoice.total.toFixed(2)}`);
  lines.push(``);
  lines.push(`📱 *Payment Reference:* ${generatePaymentReference(invoice)}`);
  lines.push(``);
  lines.push(`Thank you for your business! 🙏`);

  return lines.join("\n");
}

/**
 * Generate job summary for WhatsApp
 */
export function generateJobSummary(job: Job): string {
  const lines = [
    `🔧 *Job ${job.id}*`,
    ``,
    `*Client:* ${job.client.name}`,
    `*Issue Type:* ${job.jobType}`,
    `*Status:* ${job.status.toUpperCase()}`,
    `*Priority:* ${job.priority.toUpperCase()}`,
    ``,
    `*Summary:*`,
    job.issueSummary,
    ``,
  ];

  const clientAddress = job.client.address
    ? `${job.client.address.street}, ${job.client.address.suburb}, ${job.client.address.city}`
    : "Not specified";

  lines.push(`📍 *Location:* ${clientAddress}`);
  lines.push(``);
  lines.push(`Managed via PlumbAssist 📱`);

  return lines.join("\n");
}

/**
 * Generate payment reference for invoice
 */
function generatePaymentReference(invoice: Invoice): string {
  // Use invoice number as reference
  return invoice.invoiceNumber;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Create WhatsApp message for invoice with banking details
 */
export function createInvoiceWhatsAppMessage(invoice: Invoice, bankingDetails?: any): string {
  let message = generateInvoiceSummary(invoice);

  if (bankingDetails) {
    message += `\n\n💳 *Banking Details for Payment:*\n`;
    message += `Bank: ${bankingDetails.bankName}\n`;
    message += `Account: ${bankingDetails.accountHolderName}\n`;
    message += `Account No: ${maskAccountNumber(bankingDetails.accountNumber)}\n`;
    message += `Branch Code: ${bankingDetails.branchCode}\n`;
  }

  return message;
}

/**
 * Mask account number for security (show last 4 digits only)
 */
function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  const masked = "*".repeat(accountNumber.length - 4);
  return masked + accountNumber.slice(-4);
}

/**
 * Share invoice via WhatsApp
 */
export function shareInvoiceViaWhatsApp(invoice: Invoice, phoneNumber: string, bankingDetails?: any): void {
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error("Invalid phone number format");
  }

  const message = createInvoiceWhatsAppMessage(invoice, bankingDetails);
  const url = generateWhatsAppUrl(phoneNumber, message);
  window.open(url, "_blank");
}

/**
 * Share job via WhatsApp
 */
export function shareJobViaWhatsApp(job: Job, phoneNumber: string): void {
  if (!isValidPhoneNumber(phoneNumber)) {
    throw new Error("Invalid phone number format");
  }

  const message = generateJobSummary(job);
  const url = generateWhatsAppUrl(phoneNumber, message);
  window.open(url, "_blank");
}

/**
 * Create message template for follow-up
 */
export function createFollowUpMessage(clientName: string, jobReference: string): string {
  const lines = [
    `Hi ${clientName},`,
    ``,
    `Just following up on your recent job (Ref: ${jobReference}).`,
    ``,
    `Is there anything else I can help you with?`,
    ``,
    `Thanks!`,
  ];

  return lines.join("\n");
}

/**
 * Create message template for quote
 */
export function createQuoteMessage(clientName: string, issueType: string, estimatedCost: number): string {
  const lines = [
    `Hi ${clientName},`,
    ``,
    `Based on your ${issueType} issue, here's my quote:`,
    ``,
    `*Estimated Cost:* R${estimatedCost.toFixed(2)}`,
    ``,
    `This includes labor and materials. Let me know if you'd like to proceed!`,
    ``,
    `Thanks!`,
  ];

  return lines.join("\n");
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
