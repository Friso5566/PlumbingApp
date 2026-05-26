import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateJobReferenceNumber,
  loadAllJobs,
  saveJob,
  getJobById,
  deleteJob,
  updateJobStatus,
  addDocumentToJob,
  addNoteToJob,
  searchJobs,
  filterJobs,
  sortJobs,
  calculateJobStats,
  clearAllJobs,
} from "./jobStorage";
import { Job } from "./jobTypes";

describe("Job Storage", () => {
  beforeEach(() => {
    clearAllJobs();
  });

  afterEach(() => {
    clearAllJobs();
  });

  describe("generateJobReferenceNumber", () => {
    it("should generate reference numbers in correct format", () => {
      const ref1 = generateJobReferenceNumber();
      const ref2 = generateJobReferenceNumber();

      expect(ref1).toMatch(/^PA-\d{4}-\d{4}$/);
      expect(ref2).toMatch(/^PA-\d{4}-\d{4}$/);
      expect(ref1).not.toBe(ref2);
    });

    it("should increment reference numbers sequentially", () => {
      const ref1 = generateJobReferenceNumber();
      const ref2 = generateJobReferenceNumber();
      const ref3 = generateJobReferenceNumber();

      const num1 = parseInt(ref1.split("-")[2]);
      const num2 = parseInt(ref2.split("-")[2]);
      const num3 = parseInt(ref3.split("-")[2]);

      expect(num2).toBe(num1 + 1);
      expect(num3).toBe(num2 + 1);
    });
  });

  describe("saveJob and loadAllJobs", () => {
    it("should save and load jobs", () => {
      const job: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Test Job",
        issueSummary: "Test summary",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "John Doe",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Test Suburb",
            city: "Test City",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job);
      const jobs = loadAllJobs();

      expect(jobs).toHaveLength(1);
      expect(jobs[0].id).toBe("PA-2026-0001");
      expect(jobs[0].title).toBe("Test Job");
    });

    it("should update existing job", () => {
      const job: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Original Title",
        issueSummary: "Test summary",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "John Doe",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Test Suburb",
            city: "Test City",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job);
      job.title = "Updated Title";
      saveJob(job);

      const jobs = loadAllJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].title).toBe("Updated Title");
    });
  });

  describe("getJobById", () => {
    it("should retrieve job by ID", () => {
      const job: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Test Job",
        issueSummary: "Test summary",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "John Doe",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Test Suburb",
            city: "Test City",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job);
      const retrieved = getJobById("PA-2026-0001");

      expect(retrieved).not.toBeNull();
      expect(retrieved?.title).toBe("Test Job");
    });

    it("should return null for non-existent job", () => {
      const retrieved = getJobById("PA-2026-9999");
      expect(retrieved).toBeNull();
    });
  });

  describe("deleteJob", () => {
    it("should delete job by ID", () => {
      const job: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Test Job",
        issueSummary: "Test summary",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "John Doe",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Test Suburb",
            city: "Test City",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job);
      expect(loadAllJobs()).toHaveLength(1);

      deleteJob("PA-2026-0001");
      expect(loadAllJobs()).toHaveLength(0);
    });
  });

  describe("updateJobStatus", () => {
    it("should update job status and add timeline entry", () => {
      const job: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Test Job",
        issueSummary: "Test summary",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "John Doe",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Test Suburb",
            city: "Test City",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job);
      updateJobStatus("PA-2026-0001", "quoted");

      const updated = getJobById("PA-2026-0001");
      expect(updated?.status).toBe("quoted");
      expect(updated?.timeline).toHaveLength(1);
      expect(updated?.timeline[0].type).toBe("status-change");
    });
  });

  describe("searchJobs", () => {
    beforeEach(() => {
      const job1: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Geyser Repair",
        issueSummary: "Geyser not heating water",
        internalNotes: "Check element",
        estimatedDuration: "1-hour",
        client: {
          name: "John Smith",
          phone: "082 123 4567",
          address: {
            street: "123 Main St",
            suburb: "Claremont",
            city: "Cape Town",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      const job2: Job = {
        id: "PA-2026-0002",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "quoted",
        priority: "high",
        jobType: "installation",
        title: "Pipe Installation",
        issueSummary: "Install new water pipes",
        internalNotes: "",
        estimatedDuration: "2-hours",
        client: {
          name: "Jane Doe",
          phone: "083 987 6543",
          address: {
            street: "456 Oak Ave",
            suburb: "Newlands",
            city: "Cape Town",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job1);
      saveJob(job2);
    });

    it("should search by job title", () => {
      const results = searchJobs("Geyser");
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Geyser Repair");
    });

    it("should search by client name", () => {
      const results = searchJobs("John Smith");
      expect(results).toHaveLength(1);
      expect(results[0].client.name).toBe("John Smith");
    });

    it("should search by suburb", () => {
      const results = searchJobs("Claremont");
      expect(results).toHaveLength(1);
      expect(results[0].client.address.suburb).toBe("Claremont");
    });

    it("should search by issue summary", () => {
      const results = searchJobs("heating");
      expect(results).toHaveLength(1);
      expect(results[0].issueSummary).toContain("heating");
    });
  });

  describe("filterJobs", () => {
    beforeEach(() => {
      const jobs: Job[] = [
        {
          id: "PA-2026-0001",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "open",
          priority: "low",
          jobType: "repair",
          title: "Job 1",
          issueSummary: "Test",
          internalNotes: "",
          estimatedDuration: "1-hour",
          client: {
            name: "Client 1",
            address: {
              street: "St 1",
              suburb: "Sub 1",
              city: "City 1",
              province: "Western Cape",
            },
          },
          conversation: [],
          documents: [],
          timeline: [],
        },
        {
          id: "PA-2026-0002",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "quoted",
          priority: "high",
          jobType: "installation",
          title: "Job 2",
          issueSummary: "Test",
          internalNotes: "",
          estimatedDuration: "2-hours",
          client: {
            name: "Client 2",
            address: {
              street: "St 2",
              suburb: "Sub 2",
              city: "City 2",
              province: "Western Cape",
            },
          },
          conversation: [],
          documents: [],
          timeline: [],
        },
      ];

      jobs.forEach(saveJob);
    });

    it("should filter by status", () => {
      const results = filterJobs(loadAllJobs(), { status: ["open"] });
      expect(results).toHaveLength(1);
      expect(results[0].status).toBe("open");
    });

    it("should filter by priority", () => {
      const results = filterJobs(loadAllJobs(), { priority: ["high"] });
      expect(results).toHaveLength(1);
      expect(results[0].priority).toBe("high");
    });

    it("should filter by job type", () => {
      const results = filterJobs(loadAllJobs(), { jobType: ["repair"] });
      expect(results).toHaveLength(1);
      expect(results[0].jobType).toBe("repair");
    });
  });

  describe("sortJobs", () => {
    beforeEach(() => {
      const jobs: Job[] = [
        {
          id: "PA-2026-0001",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          status: "open",
          priority: "low",
          jobType: "repair",
          title: "Job 1",
          issueSummary: "Test",
          internalNotes: "",
          estimatedDuration: "1-hour",
          client: {
            name: "Zoe",
            address: {
              street: "St 1",
              suburb: "Sub 1",
              city: "City 1",
              province: "Western Cape",
            },
          },
          conversation: [],
          documents: [],
          timeline: [],
        },
        {
          id: "PA-2026-0002",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "quoted",
          priority: "high",
          jobType: "installation",
          title: "Job 2",
          issueSummary: "Test",
          internalNotes: "",
          estimatedDuration: "2-hours",
          client: {
            name: "Alice",
            address: {
              street: "St 2",
              suburb: "Sub 2",
              city: "City 2",
              province: "Western Cape",
            },
          },
          conversation: [],
          documents: [],
          timeline: [],
        },
      ];

      jobs.forEach(saveJob);
    });

    it("should sort by newest first", () => {
      const results = sortJobs(loadAllJobs(), "newest");
      expect(results[0].id).toBe("PA-2026-0002");
      expect(results[1].id).toBe("PA-2026-0001");
    });

    it("should sort by client name", () => {
      const results = sortJobs(loadAllJobs(), "client-name");
      expect(results[0].client.name).toBe("Alice");
      expect(results[1].client.name).toBe("Zoe");
    });

    it("should sort by priority", () => {
      const results = sortJobs(loadAllJobs(), "priority");
      expect(results[0].priority).toBe("high");
      expect(results[1].priority).toBe("low");
    });
  });

  describe("calculateJobStats", () => {
    it("should calculate correct statistics", () => {
      const job1: Job = {
        id: "PA-2026-0001",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "open",
        priority: "medium",
        jobType: "repair",
        title: "Job 1",
        issueSummary: "Test",
        internalNotes: "",
        estimatedDuration: "1-hour",
        client: {
          name: "Client 1",
          address: {
            street: "St 1",
            suburb: "Sub 1",
            city: "City 1",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      const job2: Job = {
        id: "PA-2026-0002",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "quoted",
        priority: "high",
        jobType: "installation",
        title: "Job 2",
        issueSummary: "Test",
        internalNotes: "",
        estimatedDuration: "2-hours",
        client: {
          name: "Client 2",
          address: {
            street: "St 2",
            suburb: "Sub 2",
            city: "City 2",
            province: "Western Cape",
          },
        },
        conversation: [],
        documents: [],
        timeline: [],
      };

      saveJob(job1);
      saveJob(job2);

      const stats = calculateJobStats();
      expect(stats.totalJobs).toBe(2);
      expect(stats.activeJobs).toBe(1);
      expect(stats.awaitingAcceptance).toBe(1);
    });
  });
});
