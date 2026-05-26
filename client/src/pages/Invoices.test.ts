import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadAllInvoices, saveInvoice, updateInvoiceStatus, deleteInvoice } from "@/lib/invoiceStorage";
import { Invoice, InvoiceStatus } from "@/lib/invoiceTypes";

describe("Invoices Page", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("Invoice Loading and Filtering", () => {
    it("should load all invoices from storage", () => {
      const testInvoice: Invoice = {
        id: "test-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "John Doe",
        clientPhone: "+27123456789",
        clientEmail: "john@example.com",
        clientAddress: "123 Main St",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lineItems: [
          {
            id: "item-1",
            description: "Labour",
            quantity: 2,
            unit: "hour",
            unitPrice: 150,
            vatable: true,
          },
        ],
        subtotal: 300,
        vatAmount: 45,
        total: 345,
        status: "sent" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "Thank you for your business",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(testInvoice);
      const invoices = loadAllInvoices();

      expect(invoices).toHaveLength(1);
      expect(invoices[0].invoiceNumber).toBe("PA-INV-2026-0001");
      expect(invoices[0].clientName).toBe("John Doe");
    });

    it("should filter invoices by status", () => {
      const invoices: Invoice[] = [
        {
          id: "draft-1",
          invoiceNumber: "PA-INV-2026-0001",
          clientName: "Client A",
          clientPhone: "+27123456789",
          clientEmail: "a@example.com",
          clientAddress: "Address A",
          clientVAT: "4123456789",
          billFromName: "PlumbAssist",
          billFromAddress: "456 Oak Ave",
          billFromLicence: "PL123456",
          billFromVAT: "4987654321",
          invoiceDate: new Date().toISOString(),
          paymentDueDate: new Date().toISOString(),
          lineItems: [],
          subtotal: 100,
          vatAmount: 15,
          total: 115,
          status: "draft" as InvoiceStatus,
          paymentTerms: "Net 30",
          thankYouMessage: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "sent-1",
          invoiceNumber: "PA-INV-2026-0002",
          clientName: "Client B",
          clientPhone: "+27123456789",
          clientEmail: "b@example.com",
          clientAddress: "Address B",
          clientVAT: "4123456789",
          billFromName: "PlumbAssist",
          billFromAddress: "456 Oak Ave",
          billFromLicence: "PL123456",
          billFromVAT: "4987654321",
          invoiceDate: new Date().toISOString(),
          paymentDueDate: new Date().toISOString(),
          lineItems: [],
          subtotal: 200,
          vatAmount: 30,
          total: 230,
          status: "sent" as InvoiceStatus,
          paymentTerms: "Net 30",
          thankYouMessage: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      invoices.forEach((inv) => saveInvoice(inv));
      const allInvoices = loadAllInvoices();
      const sentInvoices = allInvoices.filter((inv) => inv.status === "sent");

      expect(sentInvoices).toHaveLength(1);
      expect(sentInvoices[0].invoiceNumber).toBe("PA-INV-2026-0002");
    });

    it("should search invoices by client name", () => {
      const invoice1: Invoice = {
        id: "test-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "John Smith",
        clientPhone: "+27123456789",
        clientEmail: "john@example.com",
        clientAddress: "123 Main St",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date().toISOString(),
        lineItems: [],
        subtotal: 100,
        vatAmount: 15,
        total: 115,
        status: "sent" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const invoice2: Invoice = {
        ...invoice1,
        id: "test-2",
        invoiceNumber: "PA-INV-2026-0002",
        clientName: "Jane Doe",
      };

      saveInvoice(invoice1);
      saveInvoice(invoice2);

      const allInvoices = loadAllInvoices();
      const searchResults = allInvoices.filter((inv) => inv.clientName.toLowerCase().includes("john"));

      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].clientName).toBe("John Smith");
    });
  });

  describe("Invoice Status Management", () => {
    it("should update invoice status", () => {
      const invoice: Invoice = {
        id: "test-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "Test Client",
        clientPhone: "+27123456789",
        clientEmail: "test@example.com",
        clientAddress: "Test Address",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date().toISOString(),
        lineItems: [],
        subtotal: 100,
        vatAmount: 15,
        total: 115,
        status: "draft" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(invoice);
      updateInvoiceStatus("test-1", "sent");

      const updated = loadAllInvoices()[0];
      expect(updated.status).toBe("sent");
      expect(updated.sentAt).toBeDefined();
    });

    it("should mark invoice as paid and set paidAt timestamp", () => {
      const invoice: Invoice = {
        id: "test-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "Test Client",
        clientPhone: "+27123456789",
        clientEmail: "test@example.com",
        clientAddress: "Test Address",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date().toISOString(),
        lineItems: [],
        subtotal: 100,
        vatAmount: 15,
        total: 115,
        status: "sent" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(invoice);
      updateInvoiceStatus("test-1", "paid");

      const updated = loadAllInvoices()[0];
      expect(updated.status).toBe("paid");
      expect(updated.paidAt).toBeDefined();
    });
  });

  describe("Invoice Deletion", () => {
    it("should delete an invoice", () => {
      const invoice: Invoice = {
        id: "test-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "Test Client",
        clientPhone: "+27123456789",
        clientEmail: "test@example.com",
        clientAddress: "Test Address",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date().toISOString(),
        lineItems: [],
        subtotal: 100,
        vatAmount: 15,
        total: 115,
        status: "draft" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(invoice);
      expect(loadAllInvoices()).toHaveLength(1);

      deleteInvoice("test-1");
      expect(loadAllInvoices()).toHaveLength(0);
    });
  });

  describe("Financial Summary Calculations", () => {
    it("should calculate outstanding amount correctly", () => {
      const sentInvoice: Invoice = {
        id: "sent-1",
        invoiceNumber: "PA-INV-2026-0001",
        clientName: "Client A",
        clientPhone: "+27123456789",
        clientEmail: "a@example.com",
        clientAddress: "Address A",
        clientVAT: "4123456789",
        billFromName: "PlumbAssist",
        billFromAddress: "456 Oak Ave",
        billFromLicence: "PL123456",
        billFromVAT: "4987654321",
        invoiceDate: new Date().toISOString(),
        paymentDueDate: new Date().toISOString(),
        lineItems: [],
        subtotal: 1000,
        vatAmount: 150,
        total: 1150,
        status: "sent" as InvoiceStatus,
        paymentTerms: "Net 30",
        thankYouMessage: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const paidInvoice: Invoice = {
        ...sentInvoice,
        id: "paid-1",
        invoiceNumber: "PA-INV-2026-0002",
        total: 500,
        status: "paid" as InvoiceStatus,
        paidAt: new Date().toISOString(),
      };

      saveInvoice(sentInvoice);
      saveInvoice(paidInvoice);

      const allInvoices = loadAllInvoices();
      const outstanding = allInvoices
        .filter((inv) => inv.status === "sent" || inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.total, 0);

      expect(outstanding).toBe(1150);
    });
  });
});
