/**
 * Job Management System - Type Definitions
 * Defines all types and interfaces for the jobs feature
 */

export type JobStatus = "open" | "quoted" | "in-progress" | "complete" | "invoiced";
export type JobPriority = "low" | "medium" | "high" | "emergency";
export type JobType = "diagnosis" | "repair" | "installation" | "maintenance" | "emergency" | "quote-only";
export type EstimatedDuration = "30-min" | "1-hour" | "2-hours" | "half-day" | "full-day";

export interface ClientDetails {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    province: string;
  };
}

export interface TimelineEntry {
  timestamp: string;
  action: string;
  details?: string;
  type: "created" | "status-change" | "document" | "note" | "chat-resumed";
}

export interface DocumentReference {
  id: string;
  type: "quote" | "inspection" | "invoice" | "other";
  filename: string;
  dateGenerated: string;
  fileSize: number;
  base64Data?: string;
}

export interface Job {
  id: string; // Reference number: PA-YYYY-NNNN
  createdAt: string;
  updatedAt: string;
  status: JobStatus;
  priority: JobPriority;
  jobType: JobType;
  title: string;
  issueSummary: string;
  internalNotes: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDuration: EstimatedDuration;
  client: ClientDetails;
  conversation: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  }>;
  documents: DocumentReference[];
  timeline: TimelineEntry[];
}

export interface JobFilters {
  status?: JobStatus[];
  priority?: JobPriority[];
  jobType?: JobType[];
  searchTerm?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface JobSortOption {
  field: "created" | "scheduled" | "client-name" | "priority" | "updated";
  direction: "asc" | "desc";
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  awaitingAcceptance: number;
  completedThisMonth: number;
}
