import { useWorkflowStore } from "../../../store/workflowStore";

export default function JsonViewer() {
  const { nodes, edges, selectedNode } = useWorkflowStore();

  return (
    <div className="flex h-full w-96 flex-col border-l">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-white text-xl font-bold">Workflow JSON</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <pre className="rounded bg-slate-100 p-3 text-xs whitespace-pre-wrap break-words">
          {JSON.stringify(
            {
              nodes,
              edges,
            },
            null,
            2,
          )}
        </pre>

        <h2 className="text-white mt-6 mb-4 text-xl font-bold">
          Selected Node
        </h2>

        <pre className="rounded bg-slate-100 p-3 text-xs whitespace-pre-wrap break-words">
          {JSON.stringify(selectedNode, null, 2)}
        </pre>
      </div>
    </div>
  );
}
