import {
  CDIcon,
  COHIcon,
  CTRLIcon,
  DPRIcon,
  DSIcon,
  ExpMath,
  MMathIcon,
  NormalIcon,
  OIIcon,
  PAIcon,
  SPAIcon,
  SSIcon,
  VSIcon,
  XCP1Icon,
  XCRIcon,
  XOPIcon,
} from "./nodeIcons";

export const NODE_CONFIG = {
  dataSource: {
    name: "Data Source",
    shortName: "DS",
    category: "Data Manipulation",
    icon: DSIcon,
  },

  dataPreprocessor: {
    name: "Data Preprocessor",
    shortName: "DPR",
    category: "Data Manipulation",
    icon: DPRIcon,
  },

  expMath: {
    name: "Expression Math",
    shortName: "ExpMath",
    category: "Math",
    icon: ExpMath,
  },

  controller: {
    name: "Controller",
    shortName: "CTRL",
    category: "PID Monitoring",
    icon: CTRLIcon,
  },

  pa: {
    name: "PA",
    shortName: "PA",
    category: "PID Monitoring",
    icon: PAIcon,
  },

  multiMath: {
    name: "Multi-Math",
    shortName: "MMath",
    category: "Math",
    icon: MMathIcon,
  },

  coherency: {
    name: "Coherency",
    shortName: "COH",
    category: "Statistics",
    icon: COHIcon,
  },

  spectrumAnalysis: {
    name: "Spectrum Analysis",
    shortName: "SPA",
    category: "Statistics",
    icon: SPAIcon,
  },

  valveStiction: {
    name: "Valve Stiction",
    shortName: "VS",
    category: "PID Monitoring",
    icon: VSIcon,
  },

  diagnosis: {
    name: "Diagnosis",
    shortName: "CD",
    category: "PID Monitoring",
    icon: CDIcon,
  },

  oscillationIndex: {
    name: "Oscillation Index",
    shortName: "OI",
    category: "PID Monitoring",
    icon: OIIcon,
  },

  crossCorrelation: {
    name: "Cross Correlation",
    shortName: "XCR",
    category: "Statistics",
    icon: XCRIcon,
  },

  crossSpectrum: {
    name: "Cross Spectrum",
    shortName: "XCP1",
    category: "Statistics",
    icon: XCP1Icon,
  },

  xop: {
    name: "XOP",
    shortName: "XOP",
    category: "APC Monitoring",
    icon: XOPIcon,
  },

  selectorSwitch: {
    name: "Selector Switch",
    shortName: "SS",
    category: "Math",
    icon: SSIcon,
  },

  normal: {
    name: "Normal",
    shortName: "NORMAL",
    category: "Math",
    icon: NormalIcon,
  },
} as const;
