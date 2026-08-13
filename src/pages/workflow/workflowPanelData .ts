import type {
  BackendWorkflow,
  WorkflowSection,
} from "../../types/workFlowTypes";

import {
  Database,
  HardDrive,
  Table,
  ArrowUpDown,
  SlidersHorizontal,
  Activity,
  Braces,
  Waves,
  Cpu,
  Sigma,
  Calculator,
  Code2,
  Binary,
  GitCompare,
  Boxes,
  Workflow,
  ScanSearch,
  ChartSpline,
  TrendingUp,
  FunctionSquare,
  SquareSigma,
  ChartBar,
  Network,
  FlaskConical,
  Link2,
  Brain,
  FileCode2,
  SquareStack,
  MapPinned,
  GitBranch,
  Gauge,
  BrainCircuit,
} from "lucide-react";

import standaloneWorkflow from "./Standalone_BK3BFC0126.json";

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
        icon: Boxes,
        description: "Standalone PID Template",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "standalone-tu",
        title: "Standalone (Tu...)",
        icon: SquareStack,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "positioner",
        title: "Positioner",
        icon: MapPinned,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "selector",
        title: "Selector",
        icon: GitBranch,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "instrument",
        title: "Instrument",
        icon: Gauge,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "analyzer",
        title: "Analyzer",
        icon: ScanSearch,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
    ],
  },
  {
    title: "MPC Templates",
    items: [
      {
        id: "rmpct",
        title: "RMPCT",
        icon: Cpu,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "dmc",
        title: "DMC",
        icon: Workflow,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "generic-apc",
        title: "Generic APC",
        icon: Boxes,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
      {
        id: "estimator",
        title: "Estimator",
        icon: BrainCircuit,
        description: "",
        element: {
          Name: "",
          elementType: "Template",
          ParentNames: null,
        },
      },
    ],
  },
];

const createAttribute = (
  id: string,
  title: string,
  description: string,
  elementType: string,
  icon: any,
) => ({
  id,
  title,
  description,
  icon,
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
    id: "data-manipulation",
    title: "Data Manipulation",
    items: [
      createAttribute(
        "datasource",
        "Data Source",
        "Read historian data",
        "DataSource",
        Database,
      ),
      createAttribute(
        "datasink",
        "Data Sink",
        "Write output",
        "DataSink",
        HardDrive,
      ),
      createAttribute(
        "datapreprocessor",
        "Data Preprocessor",
        "Preprocess data",
        "DataPreProcessor",
        Table,
      ),
      createAttribute(
        "sorter",
        "Sorter",
        "Sort records",
        "Sorter",
        ArrowUpDown,
      ),
    ],
  },

  {
    id: "pid-monitoring",
    title: "PID Monitoring",
    items: [
      createAttribute(
        "controller",
        "Controller",
        "Controller KPIs",
        "Controller",
        SlidersHorizontal,
      ),
      createAttribute("pa", "PA", "Performance Assessment", "PA", Activity),
      createAttribute(
        "oscillationindex",
        "Oscillation Index",
        "Oscillation detection",
        "OscillationIndex",
        Waves,
      ),
      createAttribute(
        "valvestiction",
        "Valve Stiction",
        "Valve health",
        "ValveStiction",
        Braces,
      ),
    ],
  },

  {
    id: "apc-monitoring",
    title: "APC Monitoring",
    items: [
      createAttribute("rmpct", "RMPCT", "", "RMPCT", Cpu),
      createAttribute("dmc", "DMC", "", "DMC", Cpu),
      createAttribute("macs", "MACS", "", "MACS", Cpu),
      createAttribute("mvpa", "MVPA", "", "MVPA", Activity),
      createAttribute("estimator", "Estimator", "", "Estimator", Brain),
      createAttribute("cpo", "CPO", "", "CPO", Cpu),
      createAttribute("connoisser", "Connoisser", "", "Connoisser", ScanSearch),
      createAttribute("genericapc", "Generic APC", "", "GenericAPC", Workflow),
    ],
  },

  {
    id: "taiji",
    title: "Taiji",
    items: [
      createAttribute("planttest", "Plant Test", "", "PlantTest", FlaskConical),
      createAttribute("plantmodel", "Plant Model", "", "PlantModel", Network),
    ],
  },

  {
    id: "correlation",
    title: "Correlation Mapping",
    items: [
      createAttribute("cccm", "CCCM", "", "CCCM", Link2),
      createAttribute(
        "correlationmatrix",
        "Correlation Matrix",
        "",
        "CorrelationMatrix",
        ChartSpline,
      ),
    ],
  },

  {
    id: "math",
    title: "Math",
    items: [
      createAttribute("math", "Math", "", "Math", Calculator),
      createAttribute("comcode", "COM CodeBlock", "", "COMCodeBlock", Code2),
      createAttribute(
        "matlabcode",
        "Matlab CodeBlock",
        "",
        "MatlabCodeBlock",
        FileCode2,
      ),
      createAttribute("classifier", "Classifier", "", "Classifier", Binary),
      createAttribute(
        "multimath",
        "Multi Math",
        "",
        "MultiMath",
        FunctionSquare,
      ),
      createAttribute(
        "selectorswitch",
        "Selector Switch",
        "",
        "SelectorSwitch",
        GitCompare,
      ),
    ],
  },

  {
    id: "sixsigma",
    title: "Six sigma calculations",
    items: [
      createAttribute("sixsigma", "Six Sigma", "", "SixSigma", Sigma),
      createAttribute("cpcpk", "CpCpk", "", "CpCpk", SquareSigma),
      createAttribute("ppppk", "PpPpk", "", "PpPpk", SquareSigma),
    ],
  },

  {
    id: "statistics",
    title: "Statistics",
    items: [
      createAttribute(
        "crossspectrum",
        "Cross Spectrum",
        "",
        "CrossSpectrum",
        ChartBar,
      ),
      createAttribute("coherency", "Coherency", "", "Coherency", TrendingUp),
      createAttribute(
        "crosscorrelation",
        "Cross Correlation",
        "",
        "CrossCorrelation",
        ChartSpline,
      ),
    ],
  },

  {
    id: "custom",
    title: "Custom Elements",
    items: [createAttribute("python", "Python", "", "Python", FileCode2)],
  },
];
