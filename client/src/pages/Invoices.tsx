import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  MessageCircle,
  MoreVertical,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Clock,
} from "lucide-react";
import { loadAllInvoices, updateInvoiceStatus, deleteInvoice } from "@/lib/invoiceStorage";
import { InvoiceShareModal } from "@/components/InvoiceShareModal";
import { Invoice, InvoiceStatus } from "@/lib/invoiceTypes";
import { toast } from "sonner";

type SortField = "date" | "amount" | "status" | "client";
type SortDirection = "asc" | "desc";

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const allInvoices = loadAllInvoices();

  // Filter and search
  const filteredInvoices = useMemo(() => {
    let result = allInvoices;

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((inv: Invoice) => inv.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (inv: Invoice) =>
          inv.invoiceNumber.toLowerCase().includes(term) ||
          inv.clientName.toLowerCase().includes(term) ||
          inv.clientEmail?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [allInvoices, statusFilter, searchTerm]);

  // Sort
  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];

    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "date":
          aVal = new Date(a.invoiceDate).getTime();
          bVal = new Date(b.invoiceDate).getTime();
          break;
        case "amount":
          aVal = a.total;
          bVal = b.total;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "client":
          aVal = a.clientName;
          bVal = b.clientName;
          break;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredInvoices, sortField, sortDirection]);

  // Calculate statistics
  const stats = useMemo(() => {
    const outstanding = allInvoices
      .filter((inv: Invoice) => inv.status === "sent" || inv.status === "overdue")
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    const overdue = allInvoices
      .filter((inv: Invoice) => inv.status === "overdue")
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    const paidThisMonth = allInvoices
      .filter((inv: Invoice) => {
        if (inv.status !== "paid" || !inv.paidAt) return false;
        const paidDate = new Date(inv.paidAt);
        const now = new Date();
        return (
          paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return { outstanding, overdue, paidThisMonth };
  }, [allInvoices]);

  const handleStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
    updateInvoiceStatus(invoiceId, newStatus);
    toast.success(`Invoice status updated to ${newStatus}`);
  };

  const handleDelete = (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoiceId);
      toast.success("Invoice deleted");
    }
  };

  const handleShare = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowShareModal(true);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    toast.info("PDF download coming soon");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Invoices
            </h1>
            <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Outstanding Invoices</h3>
              <p className="text-sm text-red-800 mt-1">
                You have <strong>R{stats.overdue.toFixed(2)}</strong> in overdue invoices. Consider sending payment reminders.
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200">
              View Overdue
            </Button>
          </div>
        )}

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Outstanding</p>
                <p className="text-2xl font-bold text-orange-900">R{stats.outstanding.toFixed(2)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Overdue</p>
                <p className="text-2xl font-bold text-red-900">R{stats.overdue.toFixed(2)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Paid This Month</p>
                <p className="text-2xl font-bold text-green-900">R{stats.paidThisMonth.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by invoice number, client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters} size="sm">
                Reset Filters
              </Button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {(["all", "draft", "sent", "overdue", "paid"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status === "all" ? "All Invoices" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        {sortedInvoices.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No invoices found</h3>
            <p className="text-gray-600 mt-2">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Create your first invoice to get started"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedInvoices.map((invoice) => (
              <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Invoice Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="text-xs text-gray-500">Client</p>
                        <p className="font-medium">{invoice.clientName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Invoice Date</p>
                        <p className="font-medium">{formatDate(invoice.invoiceDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="font-medium">{formatDate(invoice.paymentDueDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-bold text-green-600">R{invoice.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare(invoice)}
                      className="text-green-600 hover:bg-green-50"
                      title="Share via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadPDF(invoice)}
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <div className="relative group">
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleStatusChange(invoice.id, "paid")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => handleStatusChange(invoice.id, "sent")}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Mark as Sent
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {selectedInvoice && (
        <InvoiceShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}

function getStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "paid":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
