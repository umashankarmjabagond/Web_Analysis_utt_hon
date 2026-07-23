import { ChevronRight } from "lucide-react";
import type { TreeNodeProps } from "../../../types/commonTypes";

export default function TreeNode({
  node,
  level,
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
    <div className="my-2 text-white">
      <button
        type="button"
        className={`flex h-10 w-full items-center gap-2  cursor-pointer transition-colors ${
          isSelected
            ? "border-l-4 border-l-[#64C3FF] bg-[#0B4872] text-white"
            : "border-l-4 border-l-transparent hover:bg-[#353535]"
        }`}
        onClick={isLeaf ? () => onSelect(node.id) : undefined}
      >
        <div
          className="flex h-full w-full items-center gap-2 px-2"
          style={{ paddingLeft: `${8 + level * 20}px` }}
        >
          <span>
            {hasChildren && (
              <ChevronRight
                color="#64C3FF"
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

          {node.image}

          <span className="truncate text-sm">{node.label}</span>
        </div>
      </button>

      {hasChildren && isExpanded && (
        <>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
    </div>
  );
}
