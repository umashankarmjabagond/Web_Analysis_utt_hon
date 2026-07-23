import standaloneWorkflow from "./Standalone_BK3BFC0126.json";

import type {
  BackendElement,
  BackendWorkflow,
  WorkflowSection,
} from "../../types/workFlowTypes";

/* -------------------------------------------------------------------------- */
/*                               Helper Method                                */
/* -------------------------------------------------------------------------- */

const createElement = (name: string, elementType: string): BackendElement => ({
  Name: name,

  elementType,

  ParentNames: null,

  tagMap: {},

  ConnectedAttributes: {},

  ExpressionMap: {},

  properties: {},

  paProperties: {},
});

/* -------------------------------------------------------------------------- */
/*                           Workflow Template List                           */
/* -------------------------------------------------------------------------- */

export const catalogSections: WorkflowSection[] = [
  {
    title: "Regulatory Templates",
    items: [
      {
        id: "1",
        title: "Standalone",
        element: createElement("Standalone", "Standalone"),
      },
      {
        id: "2",
        title: "Standalone (Tu..)",
        element: createElement("StandaloneTurbo", "Standalone"),
      },
      {
        id: "3",
        title: "Positioner",
        element: createElement("Positioner", "Positioner"),
      },
      {
        id: "4",
        title: "Selector",
        element: createElement("Selector", "Selector"),
      },
      {
        id: "5",
        title: "Instrument",
        element: createElement("Instrument", "Instrument"),
      },
      {
        id: "6",
        title: "Analyzer",
        element: createElement("Analyzer", "Analyzer"),
      },
    ],
  },

  {
    title: "MPC Templates",
    items: [
      {
        id: "7",
        title: "RMPCT",
        element: createElement("RMPCT", "RMPCT"),
      },
      {
        id: "8",
        title: "DMC",
        element: createElement("DMC", "DMC"),
      },
      {
        id: "9",
        title: "Generic APC",
        element: createElement("GenericAPC", "GenericAPC"),
      },
      {
        id: "10",
        title: "Estimator",
        element: createElement("Estimator", "Estimator"),
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                             Saved Workflows                                */
/* -------------------------------------------------------------------------- */

export const attributeSections: WorkflowSection[] = [
  {
    title: "Saved Workflows",
    items: [
      {
        id: "flow1",
        title: standaloneWorkflow.LoopName,
        element: createElement(
          standaloneWorkflow.TemplateName,
          standaloneWorkflow.TemplateName,
        ),
      },
      {
        id: "flow2",
        title: "Flow 2",
        element: createElement("Flow2", "Standalone"),
      },
      {
        id: "flow3",
        title: "Flow 3",
        element: createElement("Flow3", "Standalone"),
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                            Dummy Backend Workflows                         */
/* -------------------------------------------------------------------------- */

const workflow = standaloneWorkflow as BackendWorkflow;

export const dummyWorkflows: Record<string, BackendWorkflow> = {
  flow1: workflow,

  flow2: {
    ...structuredClone(workflow),
    LoopName: "FLOW_2",
    AnalysisName: "Flow2",
  },

  flow3: {
    ...structuredClone(workflow),
    LoopName: "FLOW_3",
    AnalysisName: "Flow3",
  },
};
