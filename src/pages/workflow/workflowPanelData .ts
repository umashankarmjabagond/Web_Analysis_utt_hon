import type {
  BackendWorkflow,
  WorkflowSection,
} from "../../types/workFlowTypes";

import standaloneWorkflow from "./Standalone_BK3BFC0126.json";

/* -------------------------------------------------------------------------- */
/*                              TEMPLATE WORKFLOWS                            */
/* -------------------------------------------------------------------------- */

export const dummyWorkflows: Record<string, BackendWorkflow> = {
  standalone: standaloneWorkflow as BackendWorkflow,
};

export const catalogSections: WorkflowSection[] = [
  {
    title: "Regulatory Templates",
    items: [
      {
        id: "standalone",
        title: "Standalone",
        description: "Standalone PID Template",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                            ATTRIBUTE CATALOG                               */
/* -------------------------------------------------------------------------- */

const createAttribute = (
  id: string,
  title: string,
  description: string,
  elementType: string,
) => ({
  id,
  title,
  description,
  element: {
    Name: title,
    elementType,
    ParentNames: null,
    tagMap: {},
    ConnectedAttributes: {},
    ExpressionMap: {},
    properties: {},
    paProperties: {},
  },
});

export const attributeCatalogSections: WorkflowSection[] = [
  {
    id: "data",
    title: "Data",
    items: [
      createAttribute(
        "datasource",
        "Data Source",
        "Read historian data file",
        "DataSource",
      ),
      createAttribute(
        "datapreprocessor",
        "Data Pre Processor",
        "Data quality + interpolation",
        "DataPreProcessor",
      ),
      createAttribute(
        "datasink",
        "Data Sink",
        "Terminal output collector",
        "DataSink",
      ),
      createAttribute(
        "tagmap",
        "Tag Map",
        "MPC data organization bridge",
        "TagMap",
      ),
      createAttribute(
        "datathrottling",
        "Data Throttling",
        "Compression detection",
        "DataThrottling",
      ),
    ],
  },
  {
    id: "pid",
    title: "PID Analysis",
    items: [
      createAttribute(
        "controller",
        "Controller",
        "PID controller health KPIs",
        "Controller",
      ),
      createAttribute(
        "pa",
        "Performance Assessment",
        "Performance Assessment",
        "PA",
      ),
      createAttribute(
        "oscillationindex",
        "Oscillation Index",
        "Detect oscillation",
        "OscillationIndex",
      ),
      createAttribute(
        "valvestiction",
        "Valve Stiction",
        "Valve health",
        "ValveStiction",
      ),
      createAttribute(
        "coherency",
        "Coherency",
        "Signal coherence analysis",
        "Coherency",
      ),
      createAttribute(
        "diagnosis",
        "Diagnosis",
        "Final PID health decision",
        "Diagnosis",
      ),
      createAttribute(
        "controllerdiag",
        "Controller Diagnostics",
        "Tuning diagnostics",
        "ControllerDiag",
      ),
      createAttribute("tuning", "PID Tuning", "PID tuning", "Tuning"),
    ],
  },
  {
    id: "math",
    title: "Math & Statistics",
    items: [
      createAttribute("math", "Math", ".NET expression evaluation", "Math"),
      createAttribute("pymath", "PyMath", "Python expression block", "PyMath"),
      createAttribute(
        "statistics",
        "Statistics",
        "Signal statistics",
        "Statistics",
      ),
      createAttribute("psd", "PSD", "Spectral analysis", "PSD"),
      createAttribute(
        "sixsigma",
        "Six Sigma",
        "Process capability",
        "SixSigma",
      ),
    ],
  },
  {
    id: "mpc",
    title: "MPC",
    items: [
      createAttribute("rmpct", "RMPCT", "Core MPC KPI computation", "RMPCT"),
      createAttribute("mvpa", "MVPA", "MPC controller analysis", "MVPA"),
      createAttribute("cluster", "Cluster", "Multi-loop grouping", "Cluster"),
      createAttribute(
        "modelid",
        "Model ID",
        "System identification",
        "ModelID",
      ),
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    items: [
      createAttribute(
        "rca",
        "Root Cause Analysis",
        "Root cause analysis",
        "RCA",
      ),
      createAttribute("custom", "Custom", "User defined block", "Custom"),
    ],
  },
];
