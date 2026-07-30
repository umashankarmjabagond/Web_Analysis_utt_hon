import { useTemplateExecutionStore } from "../store/templateExecutionStore";
import type { NodeStatus } from "../types/templateExecution";

export function useWorkflowCanvasInteractions() {
  const selectedNodeIds = useTemplateExecutionStore(
    (state) => state.selectedNodeIds,
  );
  const toggleSelectedNode = useTemplateExecutionStore(
    (state) => state.toggleSelectedNode,
  );

  const setNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.setNodeDrawerOpen,
  );

  const handleNodeSelection = (nodeId: string, status: NodeStatus) => {
    const checked = selectedNodeIds.includes(nodeId);
    toggleSelectedNode(nodeId);

    if (status === "warning" || status === "error") {
      return;
    }

    if (checked) return;
    setNodeDrawerOpen(true);
  };

  return {
    handleNodeSelection,
  };
}
