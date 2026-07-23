import type {
  WorkflowCanvasData,
  WorkflowSection,
} from "../../types/workFlowTypes";

export const catalogSections: WorkflowSection[] = [
  {
    title: "Regulatory Templates",
    items: [
      { id: "1", title: "Standalone" },
      { id: "2", title: "Standalone (Tu..)" },
      { id: "3", title: "Positioner" },
      { id: "4", title: "Selector" },
      { id: "5", title: "Instrument" },
      { id: "6", title: "Analyzer" },
    ],
  },
  {
    title: "MPC Templates",
    items: [
      { id: "7", title: "RMPCT" },
      { id: "8", title: "DMC" },
      { id: "9", title: "Generic APC" },
      { id: "10", title: "Estimator" },
    ],
  },
];

export const attributeSections: WorkflowSection[] = [
  {
    title: "Saved Workflows",
    items: [
      {
        id: "flow1",
        title: "Flow 1",
      },
      {
        id: "flow2",
        title: "Flow 2",
      },
      {
        id: "flow3",
        title: "Flow 3",
      },
    ],
  },
];

export const dummyWorkflows: Record<string, WorkflowCanvasData> = {
  flow1: {
    nodes: [
      {
        id: "1",
        type: "baseNode",
        position: { x: 100, y: 100 },
        data: { label: "Standalone" },
      },
      {
        id: "2",
        type: "baseNode",
        position: { x: 350, y: 100 },
        data: { label: "Instrument" },
      },
      {
        id: "3",
        type: "baseNode",
        position: { x: 220, y: 280 },
        data: { label: "Analyzer" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "1",
        target: "2",
        type: "workflow",
      },
      {
        id: "e2",
        source: "2",
        target: "3",
        type: "workflow",
      },
    ],
  },

  flow2: {
    nodes: [
      {
        id: "1",
        type: "baseNode",
        position: { x: 100, y: 100 },
        data: { label: "Standalone" },
      },
      {
        id: "2",
        type: "baseNode",
        position: { x: 400, y: 250 },
        data: { label: "Standalone (Tu..)" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "1",
        target: "2",
        type: "workflow",
      },
    ],
  },

  flow3: {
    nodes: [
      {
        id: "1",
        type: "baseNode",
        position: { x: 150, y: 150 },
        data: { label: "Generic APC" },
      },
    ],
    edges: [],
  },
};
