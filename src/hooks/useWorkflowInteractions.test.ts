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
  const toggleSelectedNode = vi.fn();
  const setNodeDrawerOpen = vi.fn();

  const createMockStore = (
    selectedNodeIds: string[] = [],
  ): TemplateExecutionState => ({
    nodes: [] as ExecutionFlowNode[],
    setNodes: vi.fn(),

    edges: [],
    setEdges: vi.fn(),

    selectedExecutionItem: null as ExecutionItem | null,
    setSelectedExecutionItem: vi.fn(),

    executionViewMode: EXECUTION_VIEW_MODE.COMPACT,
    setExecutionViewMode: vi.fn(),

    selectedNodeIds,
    toggleSelectedNode,

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

  const mockStore = (selectedNodeIds: string[] = []) => {
    const state = createMockStore(selectedNodeIds);

    vi.mocked(useTemplateExecutionStore).mockImplementation((selector) =>
      selector(state),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore();
  });

  it("toggles selected node", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeSelection("node-1", "success");

    expect(toggleSelectedNode).toHaveBeenCalledWith("node-1");
  });

  it("does not open drawer for warning status", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeSelection("node-1", "warning");

    expect(toggleSelectedNode).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
  });

  it("does not open drawer for error status", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeSelection("node-1", "error");

    expect(toggleSelectedNode).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
  });

  it("does not open drawer when node is already selected", () => {
    mockStore(["node-1"]);

    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeSelection("node-1", "success");

    expect(toggleSelectedNode).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).not.toHaveBeenCalled();
  });

  it("opens drawer for unselected success node", () => {
    const { result } = renderHook(() => useWorkflowCanvasInteractions());

    result.current.handleNodeSelection("node-1", "success");

    expect(toggleSelectedNode).toHaveBeenCalledWith("node-1");
    expect(setNodeDrawerOpen).toHaveBeenCalledWith(true);
  });
});
