import BaseNode from "./BaseNode";
import ExecutionHeaderNode from "./ExecutionHeaderNode";
import ExecutionRowNode from "./ExecutionRowNode";

export const nodeTypes = {
  executionRow: ExecutionRowNode,
  executionHeader: ExecutionHeaderNode,
  base: BaseNode,
  dataSource: BaseNode,
  dataSink: BaseNode,
  dataPreprocessing: BaseNode,
  math: BaseNode,
  sorter: BaseNode,
};
