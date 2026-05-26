import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Briefcase, Plus, Search, Filter, LayoutGrid, List, ChevronRight, MessageSquare, MoreVertical } from "lucide-react";
import { loadAllJobs, calculateJobStats, searchJobs, filterJobs, sortJobs } from "@/lib/jobStorage";
import { Job, JobStatus } from "@/lib/jobTypes";
import { SaveJobModal } from "@/components/SaveJobModal";
import { KanbanBoard } from "@/components/KanbanBoard";

type ViewMode = "list" | "kanban";

export default function Jobs() {
  const [, setLocation] = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, awaitingAcceptance: 0, completedThisMonth: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "scheduled" | "client-name" | "priority">("newest");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [thisMonthOnly, setThisMonthOnly] = useState(false);

  // Load jobs on mount
  useEffect(() => {
    loadJobsData();
  }, []);

  const loadJobsData = () => {
    const allJobs = loadAllJobs();
    setJobs(allJobs);
    setStats(calculateJobStats());
  };

  // Search and filter jobs
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Search
    if (searchTerm) {
      result = searchJobs(searchTerm);
    }

    // Filter
    result = filterJobs(result, {
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
      jobType: selectedJobTypes.length > 0 ? selectedJobTypes : undefined,
      monthOnly: thisMonthOnly,
    });

    // Sort
    result = sortJobs(result, sortBy);

    return result;
  }, [jobs, searchTerm, selectedStatuses, selectedPriorities, selectedJobTypes, sortBy, thisMonthOnly]);

  const getStatusColor = (status: JobStatus) => {
    const colors: Record<JobStatus, string> = {
      open: "bg-blue-100 text-blue-800",
      quoted: "bg-purple-100 text-purple-800",
      "in-progress": "bg-amber-100 text-amber-800",
      complete: "bg-green-100 text-green-800",
      invoiced: "bg-teal-100 text-teal-800",
    };
    return colors[status];
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "border-l-4 border-green-500",
      medium: "border-l-4 border-amber-500",
      high: "border-l-4 border-red-500",
      emergency: "border-l-4 border-red-600 animate-pulse",
    };
    return colors[priority] || "";
  };

  const getStatusEmoji = (status: JobStatus) => {
    const emojis: Record<JobStatus, string> = {
      open: "🔵",
      quoted: "📄",
      "in-progress": "🔧",
      complete: "✅",
      invoiced: "🧾",
    };
    return emojis[status];
  };

  const formatScheduledDate = (date?: string) => {
    if (!date) return "Not scheduled";
    const jobDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (jobDate.toDateString() === today.toDateString()) return "Today";
    if (jobDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return jobDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">My Jobs</h1>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {stats.totalJobs} jobs
              </span>
            </div>
            <Button onClick={() => setShowSaveModal(true)} className="bg-blue-500 hover:bg-blue-600 gap-2">
              <Plus className="w-4 h-4" />
              New Job
            </Button>
          </div>

          {/* Dashboard Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedStatuses([]);
                setSelectedPriorities([]);
              }}
            >
              <div className="text-sm text-gray-600">📋 Total Jobs</div>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedStatuses(["open", "in-progress"]);
              }}
            >
              <div className="text-sm text-gray-600">🔧 Active</div>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedStatuses(["quoted"]);
              }}
            >
              <div className="text-sm text-gray-600">📄 Awaiting</div>
              <div className="text-2xl font-bold">{stats.awaitingAcceptance}</div>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedStatuses(["complete", "invoiced"]);
                setThisMonthOnly(true);
              }}
            >
              <div className="text-sm text-gray-600">✅ Completed</div>
              <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search jobs, clients, addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["open", "quoted", "in-progress", "complete", "invoiced"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatuses((prev) =>
                      prev.includes(status as JobStatus)
                        ? prev.filter((s) => s !== status)
                        : [...prev, status as JobStatus]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedStatuses.includes(status as JobStatus)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setThisMonthOnly(!thisMonthOnly)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  thisMonthOnly ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                This Month
              </button>
            </div>

            {/* Sort and View Toggle */}
            <div className="flex justify-between items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="scheduled">Scheduled Date</option>
                <option value="client-name">Client Name</option>
                <option value="priority">Priority</option>
              </select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("kanban")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === "kanban" ? (
          <KanbanBoard
            jobs={filteredJobs}
            onJobClick={(jobId) => setLocation(`/jobs/${jobId}`)}
            onRefresh={loadJobsData}
          />
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No jobs yet</h2>
            <p className="text-gray-600 mb-4">Start a chat to diagnose a plumbing issue, then save it as a job to track it here.</p>
            <Button onClick={() => setLocation("/")} className="bg-blue-500 hover:bg-blue-600">
              Start a New Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className={`p-4 hover:shadow-md transition ${getPriorityColor(job.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusEmoji(job.status)} {job.status}
                      </span>
                      <span className="text-xs font-medium text-gray-600">{job.jobType}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.client.name} • {job.client.address.suburb}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">{job.issueSummary}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                      <span>📅 {formatScheduledDate(job.scheduledDate)}</span>
                      <span>🆔 {job.id}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/jobs/${job.id}`)}
                      className="gap-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SaveJobModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} onJobSaved={loadJobsData} />
    </div>
  );
}
