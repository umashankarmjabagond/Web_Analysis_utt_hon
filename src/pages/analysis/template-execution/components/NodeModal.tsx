import Dialog from "../../../../components/common/dialogue/Dialog";
import { useWorkflowCanvasInteractions } from "../../../../hooks/useWorkflowInteractions";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import ControllerConfiguration from "../../../controllerConfiguration/ControllerConfiguration";

export default function NodeModal() {
  const selectedNodeId = useTemplateExecutionStore(
    (state) => state.selectedNodeId,
  );
  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const isNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.isNodeDrawerOpen,
  );

  const { handleNodeDrawerClose } = useWorkflowCanvasInteractions();

  if (!selectedNodeId || !isNodeDrawerOpen) return null;

  const node = nodes.find((node) => node.id === selectedNodeId);

  if (
    !node ||
    node.type === "executionRow" ||
    node.type === "executionHeader"
  ) {
    return null;
  }

  let content = null;

  switch (node.type) {
    case "controller":
      content = <ControllerConfiguration />;
      break;
  }

  if (!content) return null;

  return (
    <Dialog
      isOpen={isNodeDrawerOpen}
      subtitle="Controller HDS2"
      title="CTRL"
      onClose={handleNodeDrawerClose}
      width={750}
    >
      {content}
    </Dialog>
  );
}
