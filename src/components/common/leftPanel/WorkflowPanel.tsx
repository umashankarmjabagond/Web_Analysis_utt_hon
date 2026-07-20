const nodeList = [
  {
    type: "email",
    label: "📧 Email",
  },
  {
    type: "api",
    label: "🌐 API",
  },
  {
    type: "delay",
    label: "⏳ Delay",
  },
  {
    type: "condition",
    label: "🔀 Condition",
  },
];

export default function WorkflowPanel() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-neutral-700 p-4">
        <h2 className="text-lg font-semibold text-white">Workflow Nodes</h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white outline-none"
        />
      </div>

      {/* Nodes */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-3">
        {nodeList.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
            className="cursor-grab rounded-lg border border-neutral-600 bg-neutral-700 p-3 text-white transition hover:bg-neutral-600 active:cursor-grabbing"
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
}
