import { useCallback, useEffect, useRef } from "react";
import { useTemplateExecutionStore } from "../store/templateExecutionStore";
import { buildTemplateItemFlow } from "../pages/analysis/template-execution/flowBuilders/templateItemFlowBuilder.ts";
import {
  getExecutionWorkflow,
  getTemplateExecutionWorkflows,
} from "../services/analysisTemplateExecution/templateExecutionService.ts";
import { buildTemplateCanvas } from "../pages/analysis/template-execution/flowBuilders/templateFlowBuilder.ts";
import type { ExecutionViewMode } from "../types/templateExecution.ts";

const PAGE_SIZE = 10;

export const useLoadExecutionWorkflow = (
  templateId: string,
  itemId?: string,
) => {
  // Canvas actions
  const loadWorkflow = useTemplateExecutionStore((state) => state.loadWorkflow);
  const appendWorkflow = useTemplateExecutionStore(
    (state) => state.appendWorkflow,
  );

  // Selection
  const setSelectedExecutionItem = useTemplateExecutionStore(
    (state) => state.setSelectedExecutionItem,
  );

  // view mode
  const executionViewMode = useTemplateExecutionStore(
    (state) => state.executionViewMode,
  );

  // Pagination state
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
  const nextYRef = useRef<number | undefined>(undefined);

  const loadMore = useCallback(async () => {
    if (itemId || isLoadingMore || !hasMore) return; // no pagination for single-item view

    setIsLoadingMore(true);

    try {
      const offset = offsetRef.current;
      const startY = nextYRef.current;

      const { response, canvas } = await fetchWorkflows(
        templateId,
        executionViewMode,
        offset,
        startY,
      );

      appendWorkflow(canvas.nodes, canvas.edges);

      offsetRef.current = offset + response.workflows.length;
      nextYRef.current = canvas.nextY;

      setHasMore(offsetRef.current < response.total);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    templateId,
    itemId,
    executionViewMode,
    isLoadingMore,
    hasMore,
    appendWorkflow,
    setHasMore,
    setIsLoadingMore,
  ]);

  useEffect(() => {
    if (!templateId && !itemId) return;

    offsetRef.current = 0;
    nextYRef.current = undefined;

    const loadInitial = async () => {
      if (itemId) {
        const response = await getExecutionWorkflow(itemId);
        const canvas = buildTemplateItemFlow(itemId, response.workflow);
        setSelectedExecutionItem(response.asset);
        loadWorkflow(canvas.nodes, canvas.edges);
        return;
      }

      setIsLoadingMore(true);

      try {
        const { response, canvas } = await fetchWorkflows(
          templateId,
          executionViewMode,
          0,
          undefined,
        );

        setSelectedExecutionItem(response.template);
        loadWorkflow(canvas.nodes, canvas.edges); // resets hasMore/isLoadingMore

        offsetRef.current = response.workflows.length;
        nextYRef.current = canvas.nextY;

        setHasMore(offsetRef.current < response.total);
      } finally {
        setIsLoadingMore(false);
      }
    };

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, itemId, executionViewMode]);

  return { loadMore, hasMore, isLoadingMore };
};

const fetchWorkflows = async (
  templateId: string,
  executionViewMode: ExecutionViewMode,
  offset: number,
  startY?: number,
) => {
  const response = await getTemplateExecutionWorkflows(templateId, {
    offset,
    limit: PAGE_SIZE,
  });

  const canvas = buildTemplateCanvas(
    response.workflows,
    executionViewMode,
    startY,
  );

  return { response, canvas };
};
