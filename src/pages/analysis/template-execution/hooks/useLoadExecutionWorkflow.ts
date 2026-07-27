import { useEffect } from "react";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { buildExecutionCanvas } from "../helpers/executionCanvas";
import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/executionWorkflow.service";
import { buildTemplateCanvas } from "../helpers/templateCanvas";

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

        const canvas = buildExecutionCanvas(itemId, workflow);

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
