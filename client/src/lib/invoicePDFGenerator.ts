import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Invoice } from "./invoiceTypes";

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Brand color (default to blue if not provided)
  const brandColor = invoice.companyBrandColour || "#3B82F6";
  const brandColorRGB = hexToRgb(brandColor);

  // ============ HEADER SECTION ============
  // Company Logo (if available)
  if (invoice.companyLogo) {
    try {
      doc.addImage(invoice.companyLogo, "PNG", margin, yPosition, 30, 30);
    } catch (e) {
      // Logo failed to load, continue without it
    }
  }

  // "TAX INVOICE" text (top right)
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColorRGB.r, brandColorRGB.g, brandColorRGB.b);
  doc.text("TAX INVOICE", pageWidth - margin - 60, yPosition + 10, { align: "right" });

  // Company details (below logo)
  yPosition += 35;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.companyName, margin, yPosition);

  yPosition += 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.companyAddress, margin, yPosition);

  yPosition += 4;
  if (invoice.companyLicenceNumber) {
    doc.text(`Plumbing Licence: ${invoice.companyLicenceNumber}`, margin, yPosition);
    yPosition += 4;
  }

  if (invoice.companyVatNumber) {
    doc.setTextColor(brandColorRGB.r, brandColorRGB.g, brandColorRGB.b);
    doc.setFont("helvetica", "bold");
    doc.text(`VAT Registration No: ${invoice.companyVatNumber}`, margin, yPosition);
    yPosition += 4;
  }

  // ============ INVOICE META BLOCK ============
  yPosition += 3;
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, contentWidth, 35);

  // Left column - Bill To
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL TO:", margin + 3, yPosition + 5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.clientName, margin + 3, yPosition + 10);
  doc.text(invoice.clientAddress, margin + 3, yPosition + 14);
  doc.text(invoice.clientEmail, margin + 3, yPosition + 18);
  if (invoice.clientVatNumber) {
    doc.text(`VAT: ${invoice.clientVatNumber}`, margin + 3, yPosition + 22);
  }

  // Right column - Invoice details
  const rightColumnX = pageWidth / 2 + 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS:", rightColumnX, yPosition + 5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice No: ${invoice.invoiceNumber}`, rightColumnX, yPosition + 10);
  doc.text(`Invoice Date: ${formatDate(invoice.invoiceDate)}`, rightColumnX, yPosition + 14);
  doc.text(`Payment Due: ${formatDate(invoice.paymentDueDate)}`, rightColumnX, yPosition + 18);
  if (invoice.purchaseOrderNumber) {
    doc.text(`PO No: ${invoice.purchaseOrderNumber}`, rightColumnX, yPosition + 22);
  }

  yPosition += 40;

  // ============ LINE ITEMS TABLE ============
  const tableData = invoice.lineItems.map((item, index) => [
    String(index + 1),
    item.description,
    String(item.quantity),
    item.unit,
    `R${item.unitPrice.toFixed(2)}`,
    item.vatable ? "Yes" : "No",
    `R${(item.quantity * item.unitPrice).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["#", "Description", "Qty", "Unit", "Unit Price", "VAT?", "Total"]],
    body: tableData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [brandColorRGB.r, brandColorRGB.g, brandColorRGB.b],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      2: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "center" },
      6: { halign: "right" },
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 5;

  // ============ TOTALS SECTION ============
  const totalsX = pageWidth - margin - 70;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal (excl. VAT):", totalsX, yPosition);
  doc.text(`R${invoice.subtotal.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: "right" });

  yPosition += 5;
  doc.text("VAT (15%):", totalsX, yPosition);
  doc.text(`R${invoice.vatAmount.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: "right" });

  yPosition += 5;
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX, yPosition - 1, pageWidth - margin - 5, yPosition - 1);

  yPosition += 3;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(brandColorRGB.r, brandColorRGB.g, brandColorRGB.b);
  doc.rect(totalsX - 2, yPosition - 4, 75, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL DUE (incl. VAT):", totalsX, yPosition);
  doc.text(`R${invoice.total.toFixed(2)}`, pageWidth - margin - 5, yPosition, { align: "right" });

  // ============ BANKING DETAILS ============
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  // Draw a box around banking details
  doc.setDrawColor(brandColorRGB.r, brandColorRGB.g, brandColorRGB.b);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPosition, contentWidth, 25);

  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT DETAILS — EFT", margin + 3, yPosition + 4);

  doc.setFont("helvetica", "normal");
  doc.text("Bank:", margin + 3, yPosition + 9);
  doc.text("Account Holder:", margin + 3, yPosition + 13);
  doc.text("Account Number:", margin + 3, yPosition + 17);
  doc.text("Branch Code:", margin + 3, yPosition + 21);

  const bankingDetailsX = margin + 45;
  doc.text("(Banking details would be inserted here)", bankingDetailsX, yPosition + 9);

  yPosition += 30;

  // ============ PAYMENT TERMS ============
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("PAYMENT TERMS:", margin, yPosition);

  yPosition += 4;
  const splitTerms = doc.splitTextToSize(invoice.paymentTerms, contentWidth - 3);
  doc.text(splitTerms, margin + 2, yPosition);

  yPosition += splitTerms.length * 3 + 2;

  // ============ THANK YOU MESSAGE ============
  if (invoice.includeThankYouMessage && invoice.thankYouMessage) {
    yPosition += 3;
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, contentWidth, 12, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const splitThankYou = doc.splitTextToSize(invoice.thankYouMessage, contentWidth - 4);
    doc.text(splitThankYou, margin + 2, yPosition + 3, { align: "center" });
  }

  // ============ FOOTER ============
  const footerY = pageHeight - 10;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("This is a computer-generated Tax Invoice — no signature required", margin, footerY);
  doc.text(`${invoice.companyName} | Generated by PlumbAssist | Page 1 of 1`, margin, footerY + 4, {
    align: "left",
  });

  // Convert to blob
  return doc.output("blob");
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 }; // Default blue
}

export function downloadInvoicePDF(invoice: Invoice): void {
  generateInvoicePDF(invoice).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}
