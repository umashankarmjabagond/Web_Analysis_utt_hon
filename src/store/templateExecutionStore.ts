import type { Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type ExecutionStatus =
  | "not-started"
  | "pending"
  | "in-progress"
  | "completed";

interface TemplateExecutionState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedExecutionIds: string[];
  executionStatus: ExecutionStatus;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNode: (nodeId: string, changes: Partial<Node>) => void;
  setSelectedNode: (nodeId: string) => void;
  toggleExecution: (itemId: string) => void;
  loadWorkFlow: (nodes: Node[], edges: Edge[]) => void;
}

export const useTemplateExecutionStore = create<TemplateExecutionState>()(
  immer((set) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedExecutionIds: [],
    executionStatus: "not-started",

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    updateNode: (nodeId, changes) => {
      set((state) => {
        const node = state.nodes.find((node) => node.id === nodeId);
        if (node) {
          Object.assign(node, changes);
        }
      });
    },

    setSelectedNode: (nodeId) => {
      set({ selectedNodeId: nodeId });
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
