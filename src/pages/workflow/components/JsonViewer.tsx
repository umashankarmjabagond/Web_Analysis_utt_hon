import { useMemo } from "react";

import { useWorkflowStore } from "../../../store/workflowStore";
import { flowToBackend } from "../../../utils/utils";

import type { WorkflowNode } from "../../../types/workFlowTypes";

export default function JsonViewer() {
  const { nodes, edges, selectedNode } = useWorkflowStore();

  const backendJson = useMemo(() => {
    return flowToBackend(nodes as WorkflowNode[], edges);
  }, [nodes, edges]);

  return (
    <div className="flex h-full w-96 flex-col border-l border-[#444] bg-[#1F1F1F]">
      {/* Header */}
      <div className="border-b border-[#444] p-4">
        <h2 className="text-lg font-semibold text-white">Workflow JSON</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="rounded bg-[#2B2B2B] p-3 text-xs text-green-300">
          {JSON.stringify(backendJson, null, 2)}
        </pre>

        <h2 className="mt-6 mb-3 text-lg font-semibold text-white">
          Selected Element
        </h2>

        <pre className="rounded bg-[#2B2B2B] p-3 text-xs text-blue-300">
          {JSON.stringify(
            (selectedNode as WorkflowNode | null)?.data?.element ?? null,
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
