import { useState } from "react";
import TreeNode from "./TreeNode";
import type { TreeProps } from "../../../types/commonTypes";

export default function Tree({ nodes, selectedId, onSelect }: TreeProps) {
  const [expandedIds, setExpandedIds] = useState(new Set<string>());

  const handleToggle = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }

      return next;
    });
  };

  return (
    <div>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onToggle={handleToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
