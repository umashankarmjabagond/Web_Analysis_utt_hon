import BaseNode from "./BaseNode";
import ExecutionHeaderNode from "./ExecutionHeaderNode";
import ExecutionRowNode from "./ExecutionRowNode";

export const nodeTypes = {
  executionRow: ExecutionRowNode,
  executionHeader: ExecutionHeaderNode,

  base: BaseNode,

  dataSource: BaseNode,
  dataPreprocessor: BaseNode,
  expMath: BaseNode,
  controller: BaseNode,
  pa: BaseNode,
  multiMath: BaseNode,
  coherency: BaseNode,
  spectrumAnalysis: BaseNode,
  valveStiction: BaseNode,
  diagnosis: BaseNode,
  oscillationIndex: BaseNode,
  crossCorrelation: BaseNode,
  crossSpectrum: BaseNode,
  xop: BaseNode,
  selectorSwitch: BaseNode,
  normal: BaseNode,
};
