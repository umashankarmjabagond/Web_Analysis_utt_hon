import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useWorkflowCanvasInteractions } from "./useWorkflowInteractions";
import {
  EXECUTION_ACTION,
  EXECUTION_VIEW_MODE,
  type ExecutionFlowNode,
  type ExecutionItem,
} from "../types/templateExecution";
import {
  useTemplateExecutionStore,
  type TemplateExecutionState,
} from "../store/templateExecutionStore";

vi.mock("../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn(),
}));

describe("useWorkflowCanvasInteractions", () => {
  const setSelectedNodeId = vi.fn();
  const setNodeDrawerOpen = vi.fn();

  const createMockStore = (
    selectedNodeId: string | null = null,
  ): TemplateExecutionState => ({
    nodes: [] as ExecutionFlowNode[],
    setNodes: vi.fn(),

    edges: [],
    setEdges: vi.fn(),

    selectedExecutionItem: null as ExecutionItem | null,
    setSelectedExecutionItem: vi.fn(),

    executionViewMode: EXECUTION_VIEW_MODE.COMPACT,
    setExecutionViewMode: vi.fn(),

    selectedNodeId: selectedNodeId ?? null,
    setSelectedNodeId,

    selectedRowIds: [],
    toggleSelectedRow: vi.fn(),

    isNodeDrawerOpen: false,
    setNodeDrawerOpen,

    executionAction: EXECUTION_ACTION.IDLE,
    setExecutionAction: vi.fn(),

    updateNode: vi.fn(),
    loadWorkflow: vi.fn(),

    hasMoreWorkflows: true,
    setHasMoreWorkflows: vi.fn(),

    isLoadingMoreWorkflows: false,
    setIsLoadingMoreWorkflows: vi.fn(),

    appendWorkflow: vi.fn(),
  });

  const mockStore = (selectedNodeId: string | null = null) => {
    const state = createMockStore(selectedNodeId);

    vi.mocked(useTemplateExecutionStore).mockImplementation((selector) =>
      selector(state),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("opens drawer for success node", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeClick({
      id: "node-1",
      data: {
        status: "success",
      },
    } as never);

    expect(setSelectedNodeId).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).toHaveBeenCalledWith(true);
  });

  it("does not open drawer for warning status", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeClick({
      id: "node-1",
      data: {
        status: "warning",
      },
    } as never);

    expect(setSelectedNodeId).not.toHaveBeenCalled();
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
  });

  it("does not open drawer for error status", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeClick({
      id: "node-1",
      data: {
        status: "error",
      },
    } as never);

    expect(setSelectedNodeId).not.toHaveBeenCalled();
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
  });

  it("opens drawer for success node", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeClick({
      id: "node-1",
      data: {
        status: "success",
      },
    } as never);

    expect(setSelectedNodeId).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).toHaveBeenCalledWith(true);
  });

  it("closes drawer and clears selected node", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeDrawerClose();

    expect(setNodeDrawerOpen).toHaveBeenCalledWith(false);
    expect(setSelectedNodeId).toHaveBeenCalledWith(null);
  });
});
