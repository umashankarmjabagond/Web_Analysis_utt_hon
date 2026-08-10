import { ChevronRight } from "lucide-react";
import type { TreeNodeProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

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
  // const isLeaf = !hasChildren;

  return (
    <div className="my-2">
      <button
        type="button"
        className={cn(
          "flex h-10 w-full cursor-pointer items-center gap-2 border-l-4 bg-tree-node-background transition-colors",
          isSelected
            ? "border-l-tree-node-selected-border bg-tree-node-selected-background text-tree-node-selected-foreground"
            : "border-l-tree-node-border hover:bg-tree-node-hover-background",
        )}
        // onClick={isLeaf ? () => onSelect(node.id) : undefined}
        onClick={() => onSelect(node.id)}
      >
        <div
          className="flex h-full w-full items-center gap-2 px-2"
          style={{ paddingLeft: `${8 + level * 20}px` }}
        >
          <span>
            {hasChildren && (
              <ChevronRight
                size={16}
                className={cn(
                  "text-tree-expander transition-transform duration-200 hover:tree-expander-hover",
                  isExpanded && "rotate-90",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(node.id);
                }}
              />
            )}
          </span>

          {node.image}

          <span className="truncate text-sm text-tree-node-foreground">
            {node.label}
          </span>
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
