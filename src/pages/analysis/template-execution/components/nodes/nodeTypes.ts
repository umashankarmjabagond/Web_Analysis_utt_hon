import BaseNode from "./BaseNode";
import ExecutionHeaderNode from "./ExecutionHeaderNode";

export const nodeTypes = {
  executionHeader: ExecutionHeaderNode,
  base: BaseNode,
  dataSource: BaseNode,
  dataSink: BaseNode,
  dataPreprocessing: BaseNode,
  math: BaseNode,
  sorter: BaseNode,
};
