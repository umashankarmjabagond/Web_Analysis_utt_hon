import { Box, ChevronRight } from "lucide-react";
import type { TreeNodeProps } from "../../../types/commonTypes";

export default function TreeNode({
  node,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const hasChildren = !!node?.children?.length;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isLeaf = !hasChildren;

  return (
    <div className="my-2">
      <div
        className={`flex items-center gap-2 h-10 rounded-md px-2 py-2 cursor-pointer ${
          isSelected
            ? "bg-slate-600 text-white hover:bg-slate-700"
            : "hover:bg-slate-100"
        }`}
        onClick={isLeaf ? () => onSelect(node.id) : undefined}
      >
        <span>
          {hasChildren && (
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
            />
          )}
        </span>

        <Box size={16} className="shrink-0" />

        <span className="truncate text-sm">{node.label}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-6">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
