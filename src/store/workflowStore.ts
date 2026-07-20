import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MarkerType,
} from "@xyflow/react";

import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";

export type ActiveTool = "pointer" | "connect";

interface WorkflowSnapshot {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];

  selectedNode: Node | null;

  activeTool: ActiveTool;

  history: WorkflowSnapshot[];

  future: WorkflowSnapshot[];

  addNode: (node: Node) => void;

  setNodes: (nodes: Node[]) => void;

  setEdges: (edges: Edge[]) => void;

  setSelectedNode: (node: Node | null) => void;

  setActiveTool: (tool: ActiveTool) => void;

  saveHistory: () => void;

  undo: () => void;

  redo: () => void;

  onNodesChange: (changes: NodeChange[]) => void;

  onEdgesChange: (changes: EdgeChange[]) => void;

  onConnect: (connection: Connection) => void;

  deleteSelectedNodes: () => void;

  deleteSelectedEdges: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],

  edges: [],

  selectedNode: null,

  activeTool: "pointer",

  history: [],

  future: [],

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
      };
    });
  },

  deleteSelectedEdges: () => {
    get().saveHistory();

    set((state) => ({
      edges: state.edges.filter((edge) => !edge.selected),
    }));
  },
}));
