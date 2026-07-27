import { useEffect } from "react";
import { useTemplateExecutionStore } from "../store/templateExecutionStore";
import { buildTemplateItemFlow } from "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder.ts";
import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/analysisTemplateExecution/templateExecutionService.ts";
import { buildTemplateCanvas } from "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder.ts";

export const useLoadExecutionWorkflow = (
  templateId: string,
  itemId?: string,
) => {
  const loadWorkFlow = useTemplateExecutionStore((state) => state.loadWorkFlow);

  useEffect(() => {
    if (!templateId && !itemId) return;

    const loadExecutionData = async () => {
      if (itemId) {
        // Load single execution
        const workflow = await getExecutionWorkflow(itemId);

        const canvas = buildTemplateItemFlow(itemId, workflow);

        loadWorkFlow(canvas.nodes, canvas.edges);
      } else {
        // TODO: Load all execution workflows for template
        const workflows = await getTemplateExecutionWorkflows(templateId);

        const canvas = buildTemplateCanvas(workflows);

        loadWorkFlow(canvas.nodes, canvas.edges);
      }
    };

    loadExecutionData();
  }, [templateId, itemId, loadWorkFlow]);
};
