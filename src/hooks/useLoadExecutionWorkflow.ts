import { useCallback, useEffect, useRef } from "react";
import { useTemplateExecutionStore } from "../store/templateExecutionStore";
import { buildTemplateItemFlow } from "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder.ts";
import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/analysisTemplateExecution/templateExecutionService.ts";
import { buildTemplateCanvas } from "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder.ts";

const PAGE_SIZE = 10;

export const useLoadExecutionWorkflow = (
  templateId: string,
  itemId?: string,
) => {
  const loadWorkflow = useTemplateExecutionStore((state) => state.loadWorkflow);
  const appendWorkflow = useTemplateExecutionStore(
    (state) => state.appendWorkflow,
  );
  const setSelectedExecutionItem = useTemplateExecutionStore(
    (state) => state.setSelectedExecutionItem,
  );
  const hasMore = useTemplateExecutionStore((state) => state.hasMoreWorkflows);
  const setHasMore = useTemplateExecutionStore(
    (state) => state.setHasMoreWorkflows,
  );
  const isLoadingMore = useTemplateExecutionStore(
    (state) => state.isLoadingMoreWorkflows,
  );
  const setIsLoadingMore = useTemplateExecutionStore(
    (state) => state.setIsLoadingMoreWorkflows,
  );

  const offsetRef = useRef(0);

  const loadMore = useCallback(async () => {
    console.log("load more is caled", itemId, isLoadingMore, hasMore);
    if (itemId || isLoadingMore || !hasMore) return; // no pagination for single-item view

    setIsLoadingMore(true);
    console.log("Loading started");

    const offset = offsetRef.current;

    const response = await getTemplateExecutionWorkflows(templateId, {
      offset,
      limit: PAGE_SIZE,
    });

    const canvas = buildTemplateCanvas(response.workflows, offset);
    appendWorkflow(canvas.nodes, canvas.edges);

    offsetRef.current = offset + response.workflows.length;
    setHasMore(offsetRef.current < response.total);
    setIsLoadingMore(false);
  }, [
    templateId,
    itemId,
    isLoadingMore,
    hasMore,
    appendWorkflow,
    setHasMore,
    setIsLoadingMore,
  ]);

  useEffect(() => {
    if (!templateId && !itemId) return;

    offsetRef.current = 0;

    const loadInitial = async () => {
      if (itemId) {
        const response = await getExecutionWorkflow(itemId);
        const canvas = buildTemplateItemFlow(itemId, response.workflow);
        setSelectedExecutionItem(response.asset);
        loadWorkflow(canvas.nodes, canvas.edges);
        return;
      }

      setIsLoadingMore(true);
      const response = await getTemplateExecutionWorkflows(templateId, {
        offset: 0,
        limit: PAGE_SIZE,
      });

      const canvas = buildTemplateCanvas(response.workflows, 0);
      setSelectedExecutionItem(response.template);
      loadWorkflow(canvas.nodes, canvas.edges); // resets hasMore/isLoadingMore

      offsetRef.current = response.workflows.length;
      setHasMore(offsetRef.current < response.total);
      setIsLoadingMore(false);
    };

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, itemId]);

  return { loadMore, hasMore, isLoadingMore };
};
