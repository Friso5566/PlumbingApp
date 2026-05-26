/**
 * Job Storage Utility
 * Handles all localStorage operations for job management
 */

import { Job, JobStats } from "./jobTypes";

const STORAGE_KEY = "plumbassist_jobs";
const LAST_JOB_NUMBER_KEY = "plumbassist_last_job_number";

/**
 * Generate a unique job reference number in format PA-YYYY-NNNN
 */
export function generateJobReferenceNumber(): string {
  const year = new Date().getFullYear();
  let lastNumber = parseInt(localStorage.getItem(LAST_JOB_NUMBER_KEY) || "0", 10);
  lastNumber += 1;
  localStorage.setItem(LAST_JOB_NUMBER_KEY, lastNumber.toString());
  return `PA-${year}-${String(lastNumber).padStart(4, "0")}`;
}

/**
 * Load all jobs from localStorage
 */
export function loadAllJobs(): Job[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading jobs:", error);
    return [];
  }
}

/**
 * Save a single job to localStorage
 */
export function saveJob(job: Job): void {
  try {
    const jobs = loadAllJobs();
    const existingIndex = jobs.findIndex((j) => j.id === job.id);

    if (existingIndex >= 0) {
      jobs[existingIndex] = { ...job, updatedAt: new Date().toISOString() };
    } else {
      jobs.push(job);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error("Error saving job:", error);
  }
}

/**
 * Get a specific job by ID
 */
export function getJobById(jobId: string): Job | null {
  try {
    const jobs = loadAllJobs();
    return jobs.find((j) => j.id === jobId) || null;
  } catch (error) {
    console.error("Error getting job:", error);
    return null;
  }
}

/**
 * Delete a job by ID
 */
export function deleteJob(jobId: string): boolean {
  try {
    const jobs = loadAllJobs();
    const filtered = jobs.filter((j) => j.id !== jobId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    return false;
  }
}

/**
 * Update job status and add timeline entry
 */
export function updateJobStatus(jobId: string, newStatus: string): boolean {
  try {
    const job = getJobById(jobId);
    if (!job) return false;

    job.status = newStatus as any;
    job.updatedAt = new Date().toISOString();

    // Add timeline entry
    job.timeline.push({
      timestamp: new Date().toISOString(),
      action: `Moved to ${newStatus}`,
      type: "status-change",
    });

    saveJob(job);
    return true;
  } catch (error) {
    console.error("Error updating job status:", error);
    return false;
  }
}

/**
 * Add a document reference to a job
 */
export function addDocumentToJob(jobId: string, document: any): boolean {
  try {
    const job = getJobById(jobId);
    if (!job) return false;

    job.documents.push({
      id: `doc-${Date.now()}`,
      type: document.type || "other",
      filename: document.filename,
      dateGenerated: new Date().toISOString(),
      fileSize: document.fileSize || 0,
      base64Data: document.base64Data,
    });

    job.timeline.push({
      timestamp: new Date().toISOString(),
      action: `Document generated: ${document.filename}`,
      type: "document",
    });

    saveJob(job);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
}

/**
 * Add a note to a job's timeline
 */
export function addNoteToJob(jobId: string, note: string): boolean {
  try {
    const job = getJobById(jobId);
    if (!job) return false;

    job.internalNotes = note;
    job.updatedAt = new Date().toISOString();

    job.timeline.push({
      timestamp: new Date().toISOString(),
      action: "Internal note added",
      type: "note",
    });

    saveJob(job);
    return true;
  } catch (error) {
    console.error("Error adding note:", error);
    return false;
  }
}

/**
 * Search jobs across multiple fields
 */
export function searchJobs(searchTerm: string): Job[] {
  try {
    const jobs = loadAllJobs();
    const term = searchTerm.toLowerCase();

    return jobs.filter((job) => {
      return (
        job.id.toLowerCase().includes(term) ||
        job.title.toLowerCase().includes(term) ||
        job.client.name.toLowerCase().includes(term) ||
        job.client.phone?.toLowerCase().includes(term) ||
        job.client.address.street.toLowerCase().includes(term) ||
        job.client.address.suburb.toLowerCase().includes(term) ||
        job.issueSummary.toLowerCase().includes(term) ||
        job.internalNotes.toLowerCase().includes(term)
      );
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return [];
  }
}

/**
 * Filter jobs by various criteria
 */
export function filterJobs(
  jobs: Job[],
  filters: {
    status?: string[];
    priority?: string[];
    jobType?: string[];
    monthOnly?: boolean;
  }
): Job[] {
  let filtered = [...jobs];

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((j) => filters.status!.includes(j.status));
  }

  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter((j) => filters.priority!.includes(j.priority));
  }

  if (filters.jobType && filters.jobType.length > 0) {
    filtered = filtered.filter((j) => filters.jobType!.includes(j.jobType));
  }

  if (filters.monthOnly) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    filtered = filtered.filter((j) => j.createdAt >= monthStart && j.createdAt <= monthEnd);
  }

  return filtered;
}

/**
 * Sort jobs by various criteria
 */
export function sortJobs(
  jobs: Job[],
  sortBy: "newest" | "oldest" | "scheduled" | "client-name" | "priority"
): Job[] {
  const sorted = [...jobs];

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "scheduled":
      return sorted.sort((a, b) => {
        if (!a.scheduledDate) return 1;
        if (!b.scheduledDate) return -1;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      });
    case "client-name":
      return sorted.sort((a, b) => a.client.name.localeCompare(b.client.name));
    case "priority":
      const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
      return sorted.sort(
        (a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
      );
    default:
      return sorted;
  }
}

/**
 * Calculate job statistics
 */
export function calculateJobStats(): JobStats {
  try {
    const jobs = loadAllJobs();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === "open" || j.status === "in-progress").length;
    const awaitingAcceptance = jobs.filter((j) => j.status === "quoted").length;
    const completedThisMonth = jobs.filter((j) => {
      const jobDate = new Date(j.createdAt);
      return (j.status === "complete" || j.status === "invoiced") && jobDate >= monthStart && jobDate <= monthEnd;
    }).length;

    return {
      totalJobs,
      activeJobs,
      awaitingAcceptance,
      completedThisMonth,
    };
  } catch (error) {
    console.error("Error calculating stats:", error);
    return {
      totalJobs: 0,
      activeJobs: 0,
      awaitingAcceptance: 0,
      completedThisMonth: 0,
    };
  }
}

/**
 * Clear all jobs (for testing/reset)
 */
export function clearAllJobs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_JOB_NUMBER_KEY);
  } catch (error) {
    console.error("Error clearing jobs:", error);
  }
}
