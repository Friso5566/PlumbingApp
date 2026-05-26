import { Job } from "./jobTypes";
import { Invoice } from "./invoiceTypes";

/**
 * Client profile with history and statistics
 */
export interface ClientProfile {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalJobs: number;
  totalSpent: number;
  averageJobValue: number;
  lastJobDate?: string;
  firstJobDate?: string;
  jobTypes: string[];
  invoices: Invoice[];
  jobs: Job[];
  isRepeatClient: boolean;
  repeatClientScore: number; // 0-100
}

/**
 * Detect if a client is a repeat customer
 */
export function isRepeatClient(clientName: string, jobs: Job[], invoices: Invoice[]): boolean {
  const normalizedName = normalizeClientName(clientName);

  // Check jobs
  const matchingJobs = jobs.filter((job) => normalizeClientName(job.client.name) === normalizedName);

  // Check invoices
  const matchingInvoices = invoices.filter((inv) => normalizeClientName(inv.clientName) === normalizedName);

  return matchingJobs.length > 1 || matchingInvoices.length > 1;
}

/**
 * Get client profile with history
 */
export function getClientProfile(clientName: string, jobs: Job[], invoices: Invoice[]): ClientProfile {
  const normalizedName = normalizeClientName(clientName);

  // Find all matching jobs
  const clientJobs = jobs.filter((job) => normalizeClientName(job.client.name) === normalizedName);

  // Find all matching invoices
  const clientInvoices = invoices.filter((inv) => normalizeClientName(inv.clientName) === normalizedName);

  // Calculate statistics
  const totalSpent = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const averageJobValue = clientJobs.length > 0 ? totalSpent / clientJobs.length : 0;

  // Get job types
  const jobTypesSet = new Set(clientJobs.map((job) => job.jobType));
  const jobTypes = Array.from(jobTypesSet);

  // Get dates
  const allDates = [
    ...clientJobs.map((job) => new Date(job.createdAt)),
    ...clientInvoices.map((inv) => new Date(inv.createdAt)),
  ];

  const lastJobDate = allDates.length > 0 ? new Date(Math.max(...allDates.map((d) => d.getTime()))).toISOString() : undefined;
  const firstJobDate = allDates.length > 0 ? new Date(Math.min(...allDates.map((d) => d.getTime()))).toISOString() : undefined;

  // Calculate repeat client score
  const repeatClientScore = calculateRepeatClientScore({
    jobCount: clientJobs.length,
    invoiceCount: clientInvoices.length,
    totalSpent,
    daysSinceLastJob: lastJobDate ? Math.floor((Date.now() - new Date(lastJobDate).getTime()) / (1000 * 60 * 60 * 24)) : 999,
  });

  return {
    name: clientName,
    phone: clientJobs[0]?.client.phone,
    email: clientJobs[0]?.client.email,
    address: clientJobs[0]
      ? `${clientJobs[0].client.address.street}, ${clientJobs[0].client.address.suburb}`
      : undefined,
    totalJobs: clientJobs.length,
    totalSpent,
    averageJobValue,
    lastJobDate,
    firstJobDate,
    jobTypes,
    invoices: clientInvoices,
    jobs: clientJobs,
    isRepeatClient: clientJobs.length > 1 || clientInvoices.length > 1,
    repeatClientScore,
  };
}

/**
 * Calculate repeat client score (0-100)
 * Higher score = more valuable repeat client
 */
function calculateRepeatClientScore(stats: {
  jobCount: number;
  invoiceCount: number;
  totalSpent: number;
  daysSinceLastJob: number;
}): number {
  let score = 0;

  // Job frequency (max 30 points)
  if (stats.jobCount >= 5) score += 30;
  else if (stats.jobCount >= 3) score += 20;
  else if (stats.jobCount >= 2) score += 10;

  // Invoice count (max 20 points)
  if (stats.invoiceCount >= 5) score += 20;
  else if (stats.invoiceCount >= 3) score += 15;
  else if (stats.invoiceCount >= 1) score += 10;

  // Total spent (max 30 points)
  if (stats.totalSpent >= 5000) score += 30;
  else if (stats.totalSpent >= 2000) score += 20;
  else if (stats.totalSpent >= 500) score += 10;

  // Recency (max 20 points)
  if (stats.daysSinceLastJob <= 30) score += 20;
  else if (stats.daysSinceLastJob <= 90) score += 15;
  else if (stats.daysSinceLastJob <= 180) score += 10;
  else if (stats.daysSinceLastJob <= 365) score += 5;

  return Math.min(score, 100);
}

/**
 * Normalize client name for comparison
 */
function normalizeClientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

/**
 * Find similar clients (fuzzy matching)
 */
export function findSimilarClients(clientName: string, jobs: Job[], invoices: Invoice[], threshold: number = 0.7): ClientProfile[] {
  const uniqueClients = new Set<string>();

  // Collect unique client names
  jobs.forEach((job) => uniqueClients.add(job.client.name));
  invoices.forEach((inv) => uniqueClients.add(inv.clientName));

  const clientNamesArray = Array.from(uniqueClients);

  // Find similar names
  const similar: ClientProfile[] = [];
  clientNamesArray.forEach((name) => {
    const similarity = calculateStringSimilarity(clientName, name);
    if (similarity >= threshold && name.toLowerCase() !== clientName.toLowerCase()) {
      const profile = getClientProfile(name, jobs, invoices);
      similar.push(profile);
    }
  });

  return similar.sort((a, b) => b.repeatClientScore - a.repeatClientScore);
}

/**
 * Calculate string similarity (0-1)
 * Using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function getEditDistance(s1: string, s2: string): number {
  const costs: number[] = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}

/**
 * Get client statistics summary
 */
export function getClientStatistics(profile: ClientProfile): {
  label: string;
  value: string;
}[] {
  return [
    { label: "Total Jobs", value: profile.totalJobs.toString() },
    { label: "Total Spent", value: `R${profile.totalSpent.toFixed(2)}` },
    { label: "Avg Job Value", value: `R${profile.averageJobValue.toFixed(2)}` },
    { label: "Job Types", value: profile.jobTypes.join(", ") || "N/A" },
    { label: "Last Job", value: profile.lastJobDate ? formatDate(profile.lastJobDate) : "N/A" },
    { label: "First Job", value: profile.firstJobDate ? formatDate(profile.firstJobDate) : "N/A" },
  ];
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
 * Get repeat client badge text
 */
export function getRepeatClientBadge(profile: ClientProfile): string | null {
  if (!profile.isRepeatClient) return null;

  if (profile.repeatClientScore >= 80) return "VIP Client";
  if (profile.repeatClientScore >= 60) return "Valued Client";
  if (profile.repeatClientScore >= 40) return "Repeat Client";

  return "Returning Client";
}

/**
 * Get repeat client badge color
 */
export function getRepeatClientBadgeColor(score: number): string {
  if (score >= 80) return "bg-purple-100 text-purple-800";
  if (score >= 60) return "bg-blue-100 text-blue-800";
  if (score >= 40) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}
