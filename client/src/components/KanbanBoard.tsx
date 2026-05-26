import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, MoreVertical } from "lucide-react";
import Sortable from "sortablejs";
import { Job, JobStatus } from "@/lib/jobTypes";
import { updateJobStatus } from "@/lib/jobStorage";

interface KanbanBoardProps {
  jobs: Job[];
  onJobClick?: (jobId: string) => void;
  onStatusChange?: (jobId: string, newStatus: JobStatus) => void;
  onRefresh?: () => void;
}

const STATUSES: { value: JobStatus; label: string; emoji: string; color: string }[] = [
  { value: "open", label: "Open", emoji: "🔵", color: "bg-blue-50" },
  { value: "quoted", label: "Quoted", emoji: "📄", color: "bg-purple-50" },
  { value: "in-progress", label: "In Progress", emoji: "🔧", color: "bg-amber-50" },
  { value: "complete", label: "Complete", emoji: "✅", color: "bg-green-50" },
  { value: "invoiced", label: "Invoiced", emoji: "🧾", color: "bg-teal-50" },
];

export function KanbanBoard({ jobs, onJobClick, onStatusChange, onRefresh }: KanbanBoardProps) {
  const sortableRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    // Initialize Sortable for each column
    STATUSES.forEach((status) => {
      const element = sortableRefs.current[status.value];
      if (element) {
        Sortable.create(element, {
          group: "jobs",
          animation: 150,
          ghostClass: "opacity-50",
          onEnd: (evt) => {
            const jobId = evt.item.getAttribute("data-job-id");
            const newStatus = evt.to.getAttribute("data-status") as JobStatus;

            if (jobId && newStatus) {
              updateJobStatus(jobId, newStatus);
              onStatusChange?.(jobId, newStatus);
              onRefresh?.();
            }
          },
        });
      }
    });

    return () => {
      // Cleanup Sortable instances
      STATUSES.forEach((status) => {
        const element = sortableRefs.current[status.value];
        if (element && (element as any).__sortableInstance) {
          (element as any).__sortableInstance.destroy();
        }
      });
    };
  }, [onStatusChange, onRefresh]);

  const getJobsByStatus = (status: JobStatus): Job[] => {
    return jobs.filter((job) => job.status === status);
  };

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

  const getPriorityBorderColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "border-l-4 border-green-500",
      medium: "border-l-4 border-amber-500",
      high: "border-l-4 border-red-500",
      emergency: "border-l-4 border-red-600 animate-pulse",
    };
    return colors[priority] || "";
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUSES.map((status) => {
          const statusJobs = getJobsByStatus(status.value);

          return (
            <div key={status.value} className="w-80 flex-shrink-0">
              {/* Column Header */}
              <div className="bg-gray-200 rounded-t-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{status.emoji}</span>
                  <h3 className="font-semibold text-gray-800">{status.label}</h3>
                  <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {statusJobs.length}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Column Content */}
              <div
                ref={(el) => {
                  if (el) sortableRefs.current[status.value] = el;
                }}
                data-status={status.value}
                className={`${status.color} rounded-b-lg p-3 min-h-96 space-y-3`}
              >
                {statusJobs.length === 0 ? (
                  <div className="flex items-center justify-center h-96 text-gray-400 text-sm">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📭</div>
                      <p>No jobs</p>
                    </div>
                  </div>
                ) : (
                  statusJobs.map((job) => (
                    <Card
                      key={job.id}
                      data-job-id={job.id}
                      className={`p-3 cursor-move hover:shadow-md transition ${getPriorityBorderColor(job.priority)}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm flex-1 line-clamp-2">{job.title}</h4>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-xs text-gray-600">
                          {job.client.name} • {job.client.address.suburb}
                        </p>

                        <p className="text-xs text-gray-700 line-clamp-2">{job.issueSummary}</p>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t">
                          <span className="text-xs font-medium text-gray-600">{job.id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs gap-1"
                            onClick={() => onJobClick?.(job.id)}
                          >
                            <MessageSquare className="w-3 h-3" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
