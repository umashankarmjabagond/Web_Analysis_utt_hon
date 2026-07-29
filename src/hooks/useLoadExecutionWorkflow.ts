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
  const setSelectedExecutionItem = useTemplateExecutionStore(
    (state) => state.setSelectedExecutionItem,
  );

  useEffect(() => {
    if (!templateId && !itemId) return;

    const loadExecutionData = async () => {
      if (itemId) {
        // Load single execution
        const response = await getExecutionWorkflow(itemId);

        const canvas = buildTemplateItemFlow(itemId, response.workflow);

        setSelectedExecutionItem(response.asset);
        loadWorkFlow(canvas.nodes, canvas.edges);
      } else {
        // TODO: Load all execution workflows for template
        const response = await getTemplateExecutionWorkflows(templateId);

        const canvas = buildTemplateCanvas(response.workflows);

        setSelectedExecutionItem(response.template);
        loadWorkFlow(canvas.nodes, canvas.edges);
      }
    };

    loadExecutionData();
  }, [templateId, itemId, loadWorkFlow, setSelectedExecutionItem]);
};
