import type { Edge } from "@xyflow/react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  EXECUTION_ACTION,
  type ExecutionAction,
  type ExecutionFlowNode,
  type ExecutionItem,
} from "../types/templateExecution";

interface TemplateExecutionState {
  // Workflow
  nodes: ExecutionFlowNode[];
  setNodes: (nodes: ExecutionFlowNode[]) => void;

  edges: Edge[];
  setEdges: (edges: Edge[]) => void;

  // Context
  selectedExecutionItem: ExecutionItem | null; // Unit or Asset
  setSelectedExecutionItem: (item: ExecutionItem) => void;

  // Selection
  selectedNodeIds: string[];
  toggleSelectedNode: (nodeId: string) => void;

  selectedRowIds: string[];
  toggleSelectedRow: (rowId: string) => void;

  isNodeDrawerOpen: boolean;
  setNodeDrawerOpen: (isOpen: boolean) => void;

  // Toolbar
  executionAction: ExecutionAction;
  setExecutionAction: (sttaus: ExecutionAction) => void;

  // Workflow Operations
  updateNode: (nodeId: string, changes: Partial<ExecutionFlowNode>) => void;
  loadWorkflow: (nodes: ExecutionFlowNode[], edges: Edge[]) => void;
}

export const useTemplateExecutionStore = create<TemplateExecutionState>()(
  immer((set) => ({
    nodes: [],
    edges: [],
    selectedExecutionItem: null,
    selectedNodeIds: [],
    selectedRowIds: [],
    executionAction: EXECUTION_ACTION.IDLE,
    isNodeDrawerOpen: false,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    setSelectedExecutionItem: (item) => {
      set((state) => {
        state.selectedExecutionItem = item;
      });
    },

    setExecutionAction: (status) => {
      set({ executionAction: status });
    },

    setNodeDrawerOpen: (isOpen) => {
      set((state) => {
        state.isNodeDrawerOpen = isOpen;
      });
    },

    updateNode: (nodeId, changes) => {
      set((state) => {
        const node = state.nodes.find((node) => node.id === nodeId);
        if (node) {
          Object.assign(node, changes);
        }
      });
    },

    toggleSelectedNode: (nodeId) => {
      set((state) => {
        const index = state.selectedNodeIds.indexOf(nodeId);

        if (index >= 0) {
          state.selectedNodeIds.splice(index, 1);
        } else {
          state.selectedNodeIds.push(nodeId);
        }
      });
    },

    toggleSelectedRow: (rowId) => {
      set((state) => {
        const index = state.selectedRowIds.indexOf(rowId);

        if (index >= 0) {
          state.selectedRowIds.splice(index, 1);
        } else {
          state.selectedRowIds.push(rowId);
        }
      });
    },

    loadWorkflow: (nodes, edges) => {
      set((state) => {
        state.nodes = nodes;
        state.edges = edges;

        // Reset transient UI state
        state.selectedNodeIds = [];
        state.selectedRowIds = [];
        state.isNodeDrawerOpen = false;
        state.executionAction = EXECUTION_ACTION.IDLE;
      });
    },
  })),
);
