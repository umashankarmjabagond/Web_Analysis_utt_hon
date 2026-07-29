import type { Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const EXECUTION_STATUS = {
  IDLE: "idle",
  EXECUTE: "execute",
  PAUSE: "pause",
  DELETE: "delete",
} as const;

export type ExecutionItemType = "unit" | "asset";
export type ExecutionStatus =
  (typeof EXECUTION_STATUS)[keyof typeof EXECUTION_STATUS];

export type NodeExecutionStatus =
  | "not-started"
  | "pending"
  | "in-progress"
  | "completed";

interface SelectedExecutionItem {
  id: string;
  name: string;
  type: ExecutionItemType;
}

interface TemplateExecutionState {
  nodes: Node[];
  edges: Edge[];
  selectedExecutionItem: SelectedExecutionItem | null;
  selectedNodeIds: string[];
  selectedExecutionIds: string[];
  executionStatus: ExecutionStatus;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedExecutionItem: (item: SelectedExecutionItem) => void;
  setExecutionStatus: (sttaus: ExecutionStatus) => void;
  updateNode: (nodeId: string, changes: Partial<Node>) => void;
  toggleSelectedNode: (nodeId: string) => void;
  toggleExecution: (itemId: string) => void;
  loadWorkFlow: (nodes: Node[], edges: Edge[]) => void;
}

export const useTemplateExecutionStore = create<TemplateExecutionState>()(
  immer((set) => ({
    nodes: [],
    edges: [],
    selectedExecutionItem: null,
    selectedNodeIds: [],
    selectedExecutionIds: [],
    executionStatus: "idle",

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    setSelectedExecutionItem: (item) => {
      set((state) => {
        state.selectedExecutionItem = item;
      });
    },

    setExecutionStatus: (status) => {
      set({ executionStatus: status });
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

    toggleExecution: (itemId) => {
      set((state) => {
        const index = state.selectedExecutionIds.indexOf(itemId);

        if (index >= 0) {
          state.selectedExecutionIds.splice(index, 1);
        } else {
          state.selectedExecutionIds.push(itemId);
        }
      });
    },

    loadWorkFlow: (nodes, edges) => {
      set({ nodes, edges });
    },
  })),
);
