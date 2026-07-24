import { useEffect, useMemo } from "react";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { buildCanvasData } from "../components/helpers/flowData";
import type { Edge, Node } from "@xyflow/react";
import workflowData from "../components/mock/workflow.json";

const flowData = workflowData as {
  nodes: Node[];
  edges: Edge[];
};

export const useLoadWorkflow = (itemId: string) => {
  const loadWorkFlow = useTemplateExecutionStore((state) => state.loadWorkFlow);

  const initialFlow = useMemo(
    () => buildCanvasData(itemId, flowData),
    [itemId],
  );

  useEffect(() => {
    loadWorkFlow(initialFlow.nodes, initialFlow.edges);
  }, [initialFlow, loadWorkFlow]);
};
