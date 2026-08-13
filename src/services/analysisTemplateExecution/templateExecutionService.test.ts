import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
} from "vitest";

import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";
import templateWorkflowMockData from "../../pages/analysis/template-execution/mock/templateExecution.mock.json";

import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "./templateExecutionService";

describe(
  "templateExecutionService",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it(
      "returns execution workflow data",
      async () => {
        const result =
          await getExecutionWorkflow(
            "workflow-1",
          );

        expect(
          result,
        ).toEqual(
          workflowMockData,
        );
      },
    );

    it(
      "logs execution workflow id",
      async () => {
        const consoleSpy = vi
          .spyOn(console, "log")
          .mockImplementation(
            () => {},
          );

        await getExecutionWorkflow(
          "workflow-123",
        );

        expect(
          consoleSpy,
        ).toHaveBeenCalledWith(
          "Fetching execution workflow for id:",
          "workflow-123",
        );

        consoleSpy.mockRestore();
      },
    );

    it(
      "returns template execution workflow data",
      async () => {
        const result =
          await getTemplateExecutionWorkflows(
            "template-1",
          );

        expect(
          result,
        ).toEqual(
          templateWorkflowMockData,
        );
      },
    );

    it(
      "logs template workflow id",
      async () => {
        const consoleSpy = vi
          .spyOn(console, "log")
          .mockImplementation(
            () => {},
          );

        await getTemplateExecutionWorkflows(
          "template-123",
        );

        expect(
          consoleSpy,
        ).toHaveBeenCalledWith(
          "Fetching template execution workflows for template id:",
          "template-123",
        );

        consoleSpy.mockRestore();
      },
    );

    it(
      "returns workflow mock data for any id",
      async () => {
        const result =
          await getExecutionWorkflow(
            "any-id",
          );

        expect(
          result,
        ).toBe(
          workflowMockData,
        );
      },
    );

    it(
      "returns template mock data for any template id",
      async () => {
        const result =
          await getTemplateExecutionWorkflows(
            "any-template-id",
          );

        expect(
          result,
        ).toBe(
          templateWorkflowMockData,
        );
      },
    );
  },
);