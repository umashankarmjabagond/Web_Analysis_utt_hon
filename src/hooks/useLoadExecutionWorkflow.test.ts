import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useLoadExecutionWorkflow } from "./useLoadExecutionWorkflow";

import { useTemplateExecutionStore } from "../store/templateExecutionStore";

import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/analysisTemplateExecution/templateExecutionService";

import { buildTemplateItemFlow } from "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder";

import { buildTemplateCanvas } from "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder";

vi.mock(
  "../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore: vi.fn(),
  }),
);

vi.mock(
  "../services/analysisTemplateExecution/templateExecutionService",
  () => ({
    getExecutionWorkflow: vi.fn(),
    getTemplateExecutionWorkflows:
      vi.fn(),
  }),
);

vi.mock(
  "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder",
  () => ({
    buildTemplateItemFlow: vi.fn(),
  }),
);

vi.mock(
  "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder",
  () => ({
    buildTemplateCanvas: vi.fn(),
  }),
);

describe(
  "useLoadExecutionWorkflow",
  () => {
    const loadWorkflow = vi.fn();

    const setSelectedExecutionItem =
      vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();

      (
        useTemplateExecutionStore as any
      ).mockImplementation(
        (selector: any) =>
          selector({
            loadWorkflow,
            setSelectedExecutionItem,
          }),
      );
    });

    it(
      "does nothing when templateId and itemId are missing",
      () => {
        renderHook(() =>
          useLoadExecutionWorkflow(
            "",
          ),
        );

        expect(
          getExecutionWorkflow,
        ).not.toHaveBeenCalled();

        expect(
          getTemplateExecutionWorkflows,
        ).not.toHaveBeenCalled();

        expect(
          loadWorkflow,
        ).not.toHaveBeenCalled();

        expect(
          setSelectedExecutionItem,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "loads single execution workflow when itemId is provided",
      async () => {
        const mockResponse = {
          workflow: {
            id: "workflow",
          },
          asset: {
            id: "asset",
          },
        };

        const mockCanvas = {
          nodes: [
            { id: "1" },
          ],
          edges: [
            { id: "e1" },
          ],
        };

        (
          getExecutionWorkflow as any
        ).mockResolvedValue(
          mockResponse,
        );

        (
          buildTemplateItemFlow as any
        ).mockReturnValue(
          mockCanvas,
        );

        renderHook(() =>
          useLoadExecutionWorkflow(
            "template-1",
            "item-1",
          ),
        );

        await waitFor(() => {
          expect(
            getExecutionWorkflow,
          ).toHaveBeenCalledWith(
            "item-1",
          );
        });

        expect(
          buildTemplateItemFlow,
        ).toHaveBeenCalledWith(
          "item-1",
          mockResponse.workflow,
        );

        expect(
          setSelectedExecutionItem,
        ).toHaveBeenCalledWith(
          mockResponse.asset,
        );

        expect(
          loadWorkflow,
        ).toHaveBeenCalledWith(
          mockCanvas.nodes,
          mockCanvas.edges,
        );
      },
    );

    it(
      "loads template execution workflows when itemId is not provided",
      async () => {
        const mockResponse = {
          workflows: [
            {
              id: "workflow-1",
            },
          ],
          template: {
                      id: "template",
        },
      };

      const mockCanvas = {
        nodes: [
          { id: "1" },
        ],
        edges: [
          { id: "e1" },
        ],
      };

      (
        getTemplateExecutionWorkflows as any
      ).mockResolvedValue(
        mockResponse,
      );

      (
        buildTemplateCanvas as any
      ).mockReturnValue(
        mockCanvas,
      );

      renderHook(() =>
        useLoadExecutionWorkflow(
          "template-1",
        ),
      );

      await waitFor(() => {
        expect(
          getTemplateExecutionWorkflows,
        ).toHaveBeenCalledWith(
          "template-1",
        );
      });

      expect(
        buildTemplateCanvas,
      ).toHaveBeenCalledWith(
        mockResponse.workflows,
      );

      expect(
        setSelectedExecutionItem,
      ).toHaveBeenCalledWith(
        mockResponse.template,
      );

      expect(
        loadWorkflow,
      ).toHaveBeenCalledWith(
        mockCanvas.nodes,
        mockCanvas.edges,
      );
    },
  );
},
); 