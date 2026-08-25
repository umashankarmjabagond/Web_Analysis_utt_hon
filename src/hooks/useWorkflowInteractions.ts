import { useTemplateExecutionStore } from "../store/templateExecutionStore";
import type { BaseFlowNode } from "../types/templateExecution";

export function useWorkflowCanvasInteractions() {
  const setSelectedNodeId = useTemplateExecutionStore(
    (state) => state.setSelectedNodeId,
  );

  const setNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.setNodeDrawerOpen,
  );

  const handleNodeClick = (node: BaseFlowNode) => {
    const { id, data } = node;

    if (data.status === "warning" || data.status === "error") {
      return;
    }

    setSelectedNodeId(id);
    setNodeDrawerOpen(true);
  };

  const handleNodeDrawerClose = () => {
    setNodeDrawerOpen(false);
    setSelectedNodeId(null);
  };

  return {
    handleNodeClick,
    handleNodeDrawerClose,
  };
}
