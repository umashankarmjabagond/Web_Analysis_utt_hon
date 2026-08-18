import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";

import { generateTemplateExecutionMock } from "../../pages/analysis/template-execution/mock/templateExecutionGenerator";

import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "./templateExecutionService";

const MOCK_TOTAL_ROWS = 1000;
const PAGE_SIZE = 10;
const MOCK_DELAY = 3000;

describe("templateExecutionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns execution workflow data", async () => {
    const result = await getExecutionWorkflow("workflow-1");

    expect(result).toEqual(workflowMockData);
  });

  it("logs execution workflow id", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await getExecutionWorkflow("workflow-123");

    expect(consoleSpy).toHaveBeenCalledWith(
      "Fetching execution workflow for id:",
      "workflow-123",
    );

    consoleSpy.mockRestore();
  });

  it("returns only the requested template workflow page", async () => {
    const resultPromise = getTemplateExecutionWorkflows("template-1", {
      offset: 0,
      limit: PAGE_SIZE,
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY);

    const result = await resultPromise;

    const expectedDataset = generateTemplateExecutionMock(MOCK_TOTAL_ROWS);

    expect(result.workflows).toHaveLength(PAGE_SIZE);

    expect(result.workflows).toEqual(
      expectedDataset.workflows.slice(0, PAGE_SIZE),
    );

    expect(result.total).toBe(MOCK_TOTAL_ROWS);
    expect(result.template).toEqual(expectedDataset.template);
  });

  it("returns the correct page using offset and limit", async () => {
    const offset = 20;

    const resultPromise = getTemplateExecutionWorkflows("template-1", {
      offset,
      limit: PAGE_SIZE,
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY);

    const result = await resultPromise;

    const expectedDataset = generateTemplateExecutionMock(MOCK_TOTAL_ROWS);

    expect(result.workflows).toEqual(
      expectedDataset.workflows.slice(offset, offset + PAGE_SIZE),
    );

    expect(result.workflows[0]?.itemId).toBe("56-FFC620");
  });

  it("logs template workflow pagination parameters", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const resultPromise = getTemplateExecutionWorkflows("template-123", {
      offset: 10,
      limit: 10,
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY);

    await resultPromise;

    expect(consoleSpy).toHaveBeenCalledWith(
      "Fetching template workflows: template-123, offset 10, limit 10",
    );

    consoleSpy.mockRestore();
  });

  it("returns fewer workflows when the requested page reaches the end", async () => {
    const offset = 995;
    const limit = 10;

    const resultPromise = getTemplateExecutionWorkflows("template-1", {
      offset,
      limit,
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY);

    const result = await resultPromise;

    expect(result.workflows).toHaveLength(5);

    expect(result.total).toBe(MOCK_TOTAL_ROWS);
  });

  it("does not return more than the requested page size", async () => {
    const resultPromise = getTemplateExecutionWorkflows("template-1", {
      offset: 100,
      limit: PAGE_SIZE,
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY);

    const result = await resultPromise;

    expect(result.workflows.length).toBeLessThanOrEqual(PAGE_SIZE);
  });
});
