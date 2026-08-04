import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";

import type { WorkflowListItem } from "../types/workFlowTypes";

export type ActiveTool = "pointer" | "connect";

interface WorkflowSnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];

  selectedNode: Node | null;

  // NEW
  selectedEdge: Edge | null;

  activeTool: ActiveTool;

  history: WorkflowSnapshot[];

  future: WorkflowSnapshot[];

  addNode: (node: Node) => void;

  setNodes: (nodes: Node[]) => void;

  setEdges: (edges: Edge[]) => void;

  setSelectedNode: (node: Node | null) => void;

  // NEW
  setSelectedEdge: (edge: Edge | null) => void;

  setActiveTool: (tool: ActiveTool) => void;

  saveHistory: () => void;

  undo: () => void;

  redo: () => void;

  onNodesChange: (changes: NodeChange[]) => void;

  onEdgesChange: (changes: EdgeChange[]) => void;

  onConnect: (connection: Connection) => void;

  deleteSelectedNodes: () => void;

  deleteSelectedEdges: () => void;
  clearWorkflow: () => void;
  setWorkflow: (nodes: Node[], edges: Edge[]) => void;

  pendingCatalogItem: WorkflowListItem | null;

  setPendingCatalogItem: (
    item: WorkflowListItem | null,
  ) => void;

}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],

  edges: [],

  selectedNode: null,

  // NEW
  selectedEdge: null,

  activeTool: "pointer",

  history: [],

  future: [],

  pendingCatalogItem: null,

  setNodes: (nodes) =>
    set({
      nodes,
    }),

  setEdges: (edges) =>
    set({
      edges,
    }),

  setSelectedNode: (node) =>
    set({
      selectedNode: node,
    }),

  // NEW
  setSelectedEdge: (edge) =>
    set({
      selectedEdge: edge,
    }),

    setPendingCatalogItem: (item) =>
  set({
    pendingCatalogItem: item,
  }),

  setActiveTool: (tool) =>
    set({
      activeTool: tool,
    }),

  saveHistory: () => {
    const { nodes, edges, history } = get();

    set({
      history: [
        ...history,
        {
          nodes: structuredClone(nodes),
          edges: structuredClone(edges),
        },
      ],

      future: [],
    });
  },

  undo: () => {
    const { history, nodes, edges, future } = get();

    if (history.length === 0) return;

    const previous = history[history.length - 1];

    set({
      nodes: previous.nodes,

      edges: previous.edges,

      history: history.slice(0, -1),

      future: [
        {
          nodes: structuredClone(nodes),
          edges: structuredClone(edges),
        },
        ...future,
      ],
    });
  },

  redo: () => {
    const { future, history, nodes, edges } = get();

    if (future.length === 0) return;

    const next = future[0];

    set({
      nodes: next.nodes,

      edges: next.edges,

      future: future.slice(1),

      history: [
        ...history,
        {
          nodes: structuredClone(nodes),
          edges: structuredClone(edges),
        },
      ],
    });
  },

  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      pendingCatalogItem: null,
      history: [],
      future: [],
      activeTool: "pointer",
    }),

  addNode: (node) => {
    get().saveHistory();

    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) => {
    get().saveHistory();

    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    get().saveHistory();

    set((state) => {
      if (connection.source === connection.target) {
        return state;
      }

      const exists = state.edges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target,
      );

      if (exists) {
        return state;
      }

      return {
        edges: addEdge(
          {
            ...connection,
            type: "workflow",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          state.edges,
        ),
      };
    });
  },

  deleteSelectedNodes: () => {
    get().saveHistory();

    set((state) => {
      const selectedIds = state.nodes
        .filter((node) => node.selected)
        .map((node) => node.id);

      return {
        nodes: state.nodes.filter((node) => !selectedIds.includes(node.id)),

        edges: state.edges.filter(
          (edge) =>
            !selectedIds.includes(edge.source) &&
            !selectedIds.includes(edge.target),
        ),

        selectedNode: null,

        // NEW
        selectedEdge: null,
      };
    });
  },

  deleteSelectedEdges: () => {
    get().saveHistory();

    set((state) => ({
      edges: state.edges.filter((edge) => !edge.selected),

      // NEW
      selectedEdge: null,
    }));
  },
  setWorkflow: (nodes, edges) =>
  set({
    nodes,
    edges,
    selectedNode: null,
    selectedEdge: null,
    pendingCatalogItem: null,
  }),
}));
