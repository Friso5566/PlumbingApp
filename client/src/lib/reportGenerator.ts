import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportData {
  reportType: "inspection" | "quote";
  companyName: string;
  companyLogo?: string; // base64 encoded image
  clientName: string;
  clientAddress: string;
  jobSiteAddress?: string;
  inspectionDate: string;
  referenceNumber: string;
  chatMessages: Array<{ role: string; content: string }>;
  uploadedImages?: string[]; // base64 encoded images
}

const ACCENT_COLOR = "#1E40AF";
const TEXT_COLOR = "#000000";
const LIGHT_GREY = "#F3F4F6";
const BORDER_COLOR = "#E5E7EB";

function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `PA-${year}-${random}`;
}

function extractChatSummary(messages: Array<{ role: string; content: string }>): {
  summary: string;
  findings: string[];
  recommendations: string[];
} {
  const assistantMessages = messages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content)
    .join("\n");

  // Extract bullet points as findings and recommendations
  const bulletPoints = assistantMessages.match(/^[-•*]\s+.+$/gm) || [];
  const findings = bulletPoints.slice(0, Math.ceil(bulletPoints.length / 2));
  const recommendations = bulletPoints.slice(Math.ceil(bulletPoints.length / 2));

  // Create summary from first 2-3 sentences
  const sentences = assistantMessages.match(/[^.!?]+[.!?]+/g) || [];
  const summary = sentences.slice(0, 3).join(" ").substring(0, 500);

  return {
    summary: summary || "Professional plumbing assessment based on client information and AI analysis.",
    findings: findings.map((f) => f.replace(/^[-•*]\s+/, "")),
    recommendations: recommendations.map((r) => r.replace(/^[-•*]\s+/, "")),
  };
}

function addHeader(
  doc: jsPDF,
  data: ReportData,
  title: string
): number {
  let yPosition = 15;

  // Add company logo if available
  if (data.companyLogo) {
    try {
      doc.addImage(data.companyLogo, "PNG", 15, yPosition, 30, 30);
    } catch (e) {
      console.warn("Failed to add company logo:", e);
    }
  }

  // Company name
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.companyName, data.companyLogo ? 50 : 15, yPosition + 10);

  // Report title (right aligned)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(ACCENT_COLOR);
  doc.text(title, 195, yPosition + 10, { align: "right" });

  // Reference number and date
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.text(`Reference: ${data.referenceNumber}`, 15, yPosition + 45);
  doc.text(`Date: ${new Date(data.inspectionDate).toLocaleDateString()}`, 15, yPosition + 52);

  // Horizontal line
  doc.setDrawColor(BORDER_COLOR);
  doc.line(15, yPosition + 60, 195, yPosition + 60);

  return yPosition + 70;
}

function addClientDetails(doc: jsPDF, data: ReportData, yPosition: number): number {
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Client & Site Details", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);

  yPosition += 8;
  doc.text(`Client Name: ${data.clientName}`, 15, yPosition);
  yPosition += 6;
  doc.text(`Client Address: ${data.clientAddress}`, 15, yPosition);

  if (data.jobSiteAddress && data.jobSiteAddress !== data.clientAddress) {
    yPosition += 6;
    doc.text(`Job Site Address: ${data.jobSiteAddress}`, 15, yPosition);
  }

  yPosition += 6;
  doc.text(`Inspection Date: ${new Date(data.inspectionDate).toLocaleDateString()}`, 15, yPosition);

  // Horizontal line
  doc.setDrawColor(BORDER_COLOR);
  doc.line(15, yPosition + 8, 195, yPosition + 8);

  return yPosition + 15;
}

export function generateInspectionReport(data: ReportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = addHeader(doc, data, "Plumbing Inspection Report");

  yPosition = addClientDetails(doc, data, yPosition);

  // Problem Summary
  const { summary, findings, recommendations } = extractChatSummary(data.chatMessages);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Problem Summary", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  const summaryLines = doc.splitTextToSize(summary, 180);
  doc.text(summaryLines, 15, yPosition + 7);
  yPosition += summaryLines.length * 5 + 10;

  // Findings
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Findings", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  yPosition += 7;

  findings.forEach((finding) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }
    const findingLines = doc.splitTextToSize(`• ${finding}`, 180);
    doc.text(findingLines, 15, yPosition);
    yPosition += findingLines.length * 5 + 2;
  });

  yPosition += 5;

  // Recommended Actions
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Recommended Actions", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  yPosition += 7;

  recommendations.forEach((rec, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }
    const recLines = doc.splitTextToSize(`${index + 1}. ${rec}`, 180);
    doc.text(recLines, 15, yPosition);
    yPosition += recLines.length * 5 + 2;
  });

  // Photos section if available
  if (data.uploadedImages && data.uploadedImages.length > 0) {
    yPosition += 5;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(ACCENT_COLOR);
    doc.text("Photos Submitted", 15, yPosition);
    yPosition += 10;

    data.uploadedImages.forEach((img, index) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 15;
      }
      try {
        doc.addImage(img, "JPEG", 15, yPosition, 60, 60);
        doc.setFont("Helvetica", "italic");
        doc.setFontSize(9);
        doc.text("Photo submitted by client", 15, yPosition + 65);
        yPosition += 75;
      } catch (e) {
        console.warn("Failed to add image:", e);
      }
    });
  }

  // Disclaimer
  yPosition += 10;
  if (yPosition > pageHeight - 30) {
    doc.addPage();
    yPosition = 15;
  }

  doc.setFont("Helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor("#666666");
  const disclaimerText =
    "This report is based on information provided by the client and AI-assisted analysis. It is recommended that a licensed plumber inspect the site before work commences.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, 180);
  doc.text(disclaimerLines, 15, yPosition);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#999999");
    doc.text(
      `Generated by PlumbAssist | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Download
  const filename = `PlumbAssist-Report-${data.referenceNumber}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}

export function generateQuoteReport(data: ReportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = addHeader(doc, data, "Plumbing Quote");

  // Valid until date (14 days from today)
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  doc.text(`Valid Until: ${validUntil.toLocaleDateString()}`, 195, yPosition - 25, { align: "right" });

  yPosition = addClientDetails(doc, data, yPosition);

  // Scope of Work
  const { summary } = extractChatSummary(data.chatMessages);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Scope of Work", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  const scopeLines = doc.splitTextToSize(summary, 180);
  doc.text(scopeLines, 15, yPosition + 7);
  yPosition += scopeLines.length * 5 + 12;

  // Line Items Table
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Line Items", 15, yPosition);
  yPosition += 8;

  const tableData: string[][] = [
    ["Description", "Qty", "Unit Price", "Total"],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  autoTable(doc, {
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
    startY: yPosition,
    margin: { left: 15, right: 15 },
    headStyles: {
      fillColor: ACCENT_COLOR,
      textColor: "#FFFFFF",
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: TEXT_COLOR,
    },
    alternateRowStyles: {
      fillColor: LIGHT_GREY,
    },
    didDrawPage: (data) => {
      yPosition = (data as any).pageCount > 1 ? 15 : yPosition + 50;
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Totals section
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Subtotal:", 140, yPosition);
  doc.text("R ___________", 165, yPosition);

  yPosition += 7;
  doc.text("VAT (15%):", 140, yPosition);
  doc.text("R ___________", 165, yPosition);

  yPosition += 7;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total:", 140, yPosition);
  doc.text("R ___________", 165, yPosition);

  // Terms & Conditions
  yPosition += 15;
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 15;
  }

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Terms & Conditions", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(TEXT_COLOR);
  const termsText =
    "Quote valid for 14 days. 50% deposit required before work commences. All work carried out in accordance with applicable standards and local authority requirements.";
  const termsLines = doc.splitTextToSize(termsText, 180);
  doc.text(termsLines, 15, yPosition + 7);

  // Acceptance Section
  yPosition += termsLines.length * 4 + 15;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_COLOR);
  doc.text("Acceptance", 15, yPosition);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(TEXT_COLOR);
  yPosition += 8;
  doc.text("Client Signature: ________________________", 15, yPosition);
  yPosition += 8;
  doc.text("Date: ________________________", 15, yPosition);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#999999");
    doc.text(
      `Generated by PlumbAssist | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Download
  const filename = `PlumbAssist-Quote-${data.referenceNumber}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
