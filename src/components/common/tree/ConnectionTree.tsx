import { useState } from "react";

import ConnectionTreeNode from "./ConnectionTreeNode";

import type {
  ConnectionTreeProps,
} from "../../../types/commonTypes";

export default function ConnectionTree({
  nodes,
  checkedIds,
  onCheck,
  showCheckbox = true,
}: ConnectionTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["ds", "sample", "ds2", "sample2"]),
  );

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
        <ConnectionTreeNode
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          checkedIds={checkedIds}
          onToggle={handleToggle}
          onCheck={onCheck}
          showCheckbox={showCheckbox}
        />
      ))}
    </div>
  );
}
