import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { generateJobReferenceNumber, saveJob } from "@/lib/jobStorage";
import { Job, JobStatus, JobPriority, JobType, EstimatedDuration } from "@/lib/jobTypes";

interface SaveJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessages?: Array<{ role: "user" | "assistant" | string; content: string }>;
  onJobSaved?: (job: Job) => void;
}

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "diagnosis", label: "Diagnosis" },
  { value: "repair", label: "Repair" },
  { value: "installation", label: "Installation" },
  { value: "maintenance", label: "Maintenance" },
  { value: "emergency", label: "Emergency" },
  { value: "quote-only", label: "Quote Only" },
];

const PRIORITIES: { value: JobPriority; label: string; emoji: string }[] = [
  { value: "low", label: "Low", emoji: "🟢" },
  { value: "medium", label: "Medium", emoji: "🟡" },
  { value: "high", label: "High", emoji: "🔴" },
  { value: "emergency", label: "Emergency", emoji: "⚡" },
];

const DURATIONS: EstimatedDuration[] = ["30-min", "1-hour", "2-hours", "half-day", "full-day"];

export function SaveJobModal({ isOpen, onClose, chatMessages = [], onJobSaved }: SaveJobModalProps) {
  const [step, setStep] = useState<"client" | "job" | "status" | "notes">("client");

  // Client details
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Western Cape");

  // Job details
  const [jobTitle, setJobTitle] = useState("");
  const [issueSummary, setIssueSummary] = useState("");
  const [jobType, setJobType] = useState<JobType>("repair");
  const [priority, setPriority] = useState<JobPriority>("medium");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState<EstimatedDuration>("1-hour");

  // Status
  const [status, setStatus] = useState<JobStatus>("open");

  // Notes
  const [internalNotes, setInternalNotes] = useState("");

  // Generate summary on mount if we have chat messages
  useEffect(() => {
    if (isOpen && chatMessages.length > 0 && !issueSummary) {
      // Create a 2-3 sentence summary from the last few messages
      const userMessages = chatMessages
        .filter((m) => m.role === "user")
        .slice(-2)
        .map((m) => m.content)
        .join(" ");

      if (userMessages) {
        const summary = userMessages.substring(0, 200) + (userMessages.length > 200 ? "..." : "");
        setIssueSummary(summary);
      }
    }
  }, [isOpen, chatMessages, issueSummary]);

  const handleSave = () => {
    if (!clientName || !jobTitle) {
      alert("Please fill in client name and job title");
      return;
    }

    const job: Job = {
      id: generateJobReferenceNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      priority,
      jobType,
      title: jobTitle,
      issueSummary,
      internalNotes,
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      estimatedDuration,
      client: {
        name: clientName,
        phone: clientPhone || undefined,
        whatsapp: clientWhatsapp || undefined,
        email: clientEmail || undefined,
        address: {
          street,
          suburb,
          city,
          province,
        },
      },
      conversation: chatMessages.map((m) => ({
        role: (m.role === "user" || m.role === "assistant" ? m.role : "user") as "user" | "assistant",
        content: m.content,
      })),
      documents: [],
      timeline: [
        {
          timestamp: new Date().toISOString(),
          action: "Job created",
          type: "created",
        },
      ],
    };

    saveJob(job);
    onJobSaved?.(job);
    handleClose();
  };

  const handleClose = () => {
    setStep("client");
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setClientWhatsapp("");
    setStreet("");
    setSuburb("");
    setCity("");
    setProvince("Western Cape");
    setJobTitle("");
    setIssueSummary("");
    setJobType("repair");
    setPriority("medium");
    setScheduledDate("");
    setScheduledTime("");
    setEstimatedDuration("1-hour");
    setStatus("open");
    setInternalNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Save as Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step indicator */}
          <div className="flex gap-2">
            {["client", "job", "status", "notes"].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s as any)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  step === s ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Client Details */}
          {step === "client" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Client Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Full Name *</Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input type="tel" value={clientWhatsapp} onChange={(e) => setClientWhatsapp(e.target.value)} />
                </div>
              </div>

              <h3 className="font-semibold mt-6">Site Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Street</Label>
                  <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div>
                  <Label>Suburb</Label>
                  <Input value={suburb} onChange={(e) => setSuburb(e.target.value)} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Province</Label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {SA_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Job Details */}
          {step === "job" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Job Details</h3>
              <div>
                <Label>Job Title *</Label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>

              <div>
                <Label>Issue Summary</Label>
                <Textarea
                  value={issueSummary}
                  onChange={(e) => setIssueSummary(e.target.value)}
                  placeholder="2-3 sentence summary of the issue..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type</Label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobType)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Estimated Duration</Label>
                  <select
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value as EstimatedDuration)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scheduled Date</Label>
                  <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
                <div>
                  <Label>Scheduled Time</Label>
                  <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Status & Priority */}
          {step === "status" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Job Status</h3>
              <div className="flex gap-2 flex-wrap">
                {(["open", "quoted", "in-progress", "complete", "invoiced"] as JobStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-full font-medium transition ${
                      status === s
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {s === "open" && "🔵"}
                    {s === "quoted" && "📄"}
                    {s === "in-progress" && "🔧"}
                    {s === "complete" && "✅"}
                    {s === "invoiced" && "🧾"}
                    {" " + s.replace("-", " ")}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold mt-6">Priority</h3>
              <div className="flex gap-2 flex-wrap">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`px-4 py-2 rounded-full font-medium transition ${
                      priority === p.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {step === "notes" && (
            <div className="space-y-4">
              <h3 className="font-semibold">Internal Notes</h3>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Private notes for your reference..."
                rows={6}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
              Save Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
