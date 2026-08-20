import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import { useLoadExecutionWorkflow } from "./useLoadExecutionWorkflow";
import { useTemplateExecutionStore } from "../store/templateExecutionStore";

import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/analysisTemplateExecution/templateExecutionService";

import { buildTemplateItemFlow } from "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder";
import { buildTemplateCanvas } from "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder";

vi.mock("../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn(),
}));

vi.mock(
  "../services/analysisTemplateExecution/templateExecutionService",
  () => ({
    getExecutionWorkflow: vi.fn(),
    getTemplateExecutionWorkflows: vi.fn(),
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

describe("useLoadExecutionWorkflow", () => {
  const loadWorkflow = vi.fn();
  const appendWorkflow = vi.fn();
  const setSelectedExecutionItem = vi.fn();

  const setHasMore = vi.fn();
  const setIsLoadingMore = vi.fn();

  const mockStore = ({
    hasMoreWorkflows = true,
    isLoadingMoreWorkflows = false,
  } = {}) => {
    (
      useTemplateExecutionStore as unknown as {
        mockImplementation: (
          implementation: (selector: (state: unknown) => unknown) => unknown,
        ) => void;
      }
    ).mockImplementation((selector) =>
      selector({
        loadWorkflow,
        appendWorkflow,
        setSelectedExecutionItem,
        hasMoreWorkflows,
        setHasMoreWorkflows: setHasMore,
        isLoadingMoreWorkflows,
        setIsLoadingMoreWorkflows: setIsLoadingMore,
      }),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("does nothing when templateId and itemId are missing", () => {
    renderHook(() => useLoadExecutionWorkflow(""));

    expect(getExecutionWorkflow).not.toHaveBeenCalled();
    expect(getTemplateExecutionWorkflows).not.toHaveBeenCalled();
    expect(loadWorkflow).not.toHaveBeenCalled();
    expect(setSelectedExecutionItem).not.toHaveBeenCalled();
  });

  it("loads single execution workflow when itemId is provided", async () => {
    const mockResponse = {
      workflow: {
        nodes: [],
        edges: [],
      },
      asset: {
        id: "asset-1",
        name: "Asset 1",
        type: "asset",
      },
    };

    const mockCanvas = {
      nodes: [{ id: "node-1" }],
      edges: [{ id: "edge-1" }],
    };

    vi.mocked(getExecutionWorkflow).mockResolvedValue(mockResponse as never);
    vi.mocked(buildTemplateItemFlow).mockReturnValue(mockCanvas as never);

    renderHook(() => useLoadExecutionWorkflow("template-1", "item-1"));

    await waitFor(() => {
      expect(getExecutionWorkflow).toHaveBeenCalledWith("item-1");
    });

    expect(buildTemplateItemFlow).toHaveBeenCalledWith(
      "item-1",
      mockResponse.workflow,
    );

    expect(setSelectedExecutionItem).toHaveBeenCalledWith(mockResponse.asset);

    expect(loadWorkflow).toHaveBeenCalledWith(
      mockCanvas.nodes,
      mockCanvas.edges,
    );

    expect(getTemplateExecutionWorkflows).not.toHaveBeenCalled();
  });

  it("loads the initial template page", async () => {
    const response = {
      workflows: Array.from({ length: 10 }, (_, index) => ({
        itemId: `item-${index}`,
        workflow: {
          nodes: [],
          edges: [],
        },
      })),
      template: {
        id: "template-1",
        name: "Template 1",
        type: "unit",
      },
      total: 1000,
    };

    const canvas = {
      nodes: [{ id: "node-initial" }],
      edges: [{ id: "edge-initial" }],
      nextY: 1248,
    };

    vi.mocked(getTemplateExecutionWorkflows).mockResolvedValue(
      response as never,
    );

    vi.mocked(buildTemplateCanvas).mockReturnValue(canvas as never);

    renderHook(() => useLoadExecutionWorkflow("template-1"));

    await waitFor(() => {
      expect(getTemplateExecutionWorkflows).toHaveBeenCalledWith("template-1", {
        offset: 0,
        limit: 10,
      });
    });

    expect(buildTemplateCanvas).toHaveBeenCalledWith(
      response.workflows,
      undefined,
    );

    expect(setSelectedExecutionItem).toHaveBeenCalledWith(response.template);

    expect(loadWorkflow).toHaveBeenCalledWith(canvas.nodes, canvas.edges);

    expect(setHasMore).toHaveBeenCalledWith(true);

    expect(setIsLoadingMore).toHaveBeenCalledWith(true);
    expect(setIsLoadingMore).toHaveBeenLastCalledWith(false);
  });

  it("loads the next page using the current offset and canvas nextY", async () => {
    const initialWorkflows = Array.from({ length: 10 }, (_, index) => ({
      itemId: `item-${index}`,
      workflow: {
        nodes: [],
        edges: [],
      },
    }));

    const nextWorkflows = Array.from({ length: 10 }, (_, index) => ({
      itemId: `item-${index + 10}`,
      workflow: {
        nodes: [],
        edges: [],
      },
    }));

    const initialResponse = {
      workflows: initialWorkflows,
      template: {
        id: "template-1",
        name: "Template 1",
        type: "unit",
      },
      total: 1000,
    };

    const nextResponse = {
      workflows: nextWorkflows,
      template: initialResponse.template,
      total: 1000,
    };

    const initialCanvas = {
      nodes: [{ id: "node-initial" }],
      edges: [{ id: "edge-initial" }],
      nextY: 1248,
    };

    const nextCanvas = {
      nodes: [{ id: "node-next" }],
      edges: [{ id: "edge-next" }],
      nextY: 2472,
    };

    vi.mocked(getTemplateExecutionWorkflows)
      .mockResolvedValueOnce(initialResponse as never)
      .mockResolvedValueOnce(nextResponse as never);

    vi.mocked(buildTemplateCanvas)
      .mockReturnValueOnce(initialCanvas as never)
      .mockReturnValueOnce(nextCanvas as never);

    const { result } = renderHook(() => useLoadExecutionWorkflow("template-1"));

    await waitFor(() => {
      expect(getTemplateExecutionWorkflows).toHaveBeenCalledTimes(1);
    });

    await result.current.loadMore();

    expect(getTemplateExecutionWorkflows).toHaveBeenNthCalledWith(
      2,
      "template-1",
      {
        offset: 10,
        limit: 10,
      },
    );

    expect(buildTemplateCanvas).toHaveBeenNthCalledWith(
      2,
      nextWorkflows,
      initialCanvas.nextY,
    );

    expect(appendWorkflow).toHaveBeenCalledWith(
      nextCanvas.nodes,
      nextCanvas.edges,
    );

    expect(setHasMore).toHaveBeenLastCalledWith(true);
  });

  it("stops loading when there are no more workflows", async () => {
    mockStore({ hasMoreWorkflows: false });

    const response = {
      workflows: [],
      template: {
        id: "template-1",
        name: "Template 1",
        type: "unit",
      },
      total: 0,
    };

    vi.mocked(getTemplateExecutionWorkflows).mockResolvedValue(
      response as never,
    );

    vi.mocked(buildTemplateCanvas).mockReturnValue({
      nodes: [],
      edges: [],
      nextY: 24,
    } as never);

    const { result } = renderHook(() => useLoadExecutionWorkflow("template-1"));

    await waitFor(() => {
      expect(getTemplateExecutionWorkflows).toHaveBeenCalledTimes(1);
    });

    await result.current.loadMore();

    expect(getTemplateExecutionWorkflows).toHaveBeenCalledTimes(1);
    expect(appendWorkflow).not.toHaveBeenCalled();
  });

  it("stops loading while another request is in progress", async () => {
    mockStore({ isLoadingMoreWorkflows: true });

    const response = {
      workflows: [],
      template: {
        id: "template-1",
        name: "Template 1",
        type: "unit",
      },
      total: 1000,
    };

    vi.mocked(getTemplateExecutionWorkflows).mockResolvedValue(
      response as never,
    );

    vi.mocked(buildTemplateCanvas).mockReturnValue({
      nodes: [],
      edges: [],
      nextY: 24,
    } as never);

    const { result } = renderHook(() => useLoadExecutionWorkflow("template-1"));

    await waitFor(() => {
      expect(getTemplateExecutionWorkflows).toHaveBeenCalledTimes(1);
    });

    await result.current.loadMore();

    expect(getTemplateExecutionWorkflows).toHaveBeenCalledTimes(1);
    expect(appendWorkflow).not.toHaveBeenCalled();
  });

  it("does not load more for single item execution", async () => {
    const response = {
      workflow: {
        nodes: [],
        edges: [],
      },
      asset: {
        id: "asset-1",
        name: "Asset 1",
        type: "asset",
      },
    };

    vi.mocked(getExecutionWorkflow).mockResolvedValue(response as never);

    vi.mocked(buildTemplateItemFlow).mockReturnValue({
      nodes: [],
      edges: [],
    } as never);

    const { result } = renderHook(() =>
      useLoadExecutionWorkflow("template-1", "item-1"),
    );

    await waitFor(() => {
      expect(getExecutionWorkflow).toHaveBeenCalledWith("item-1");
    });

    await result.current.loadMore();

    expect(getTemplateExecutionWorkflows).not.toHaveBeenCalled();
    expect(appendWorkflow).not.toHaveBeenCalled();
  });
});
