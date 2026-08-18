  import { ChevronRight, FolderOpen, CornerUpLeft, BookText } from "lucide-react";

  import Checkbox from "../../forms/checkbox/CheckBox";

  import { cn } from "../../../utils/utils";

  import type {
    ConnectionTreeNodeProps,
  } from "../../../types/commonTypes";

  export default function ConnectionTreeNode({
    node,
    level,
    expandedIds,
    checkedIds,
    onToggle,
    onCheck,
    showCheckbox = true,
  }: ConnectionTreeNodeProps) {
    const hasChildren = node.children !== undefined;

    const isExpanded = expandedIds.has(node.id);

    const isChecked = checkedIds.includes(node.id);

    return (
      <div className="my-1">
        <div
          className={cn(
            "flex min-h-10 items-center rounded-sm px-2 hover:bg-tree-node-hover-background",
            isChecked && "bg-tree-node-selected-background",
          )}
        >
          <div
            className="flex w-full items-center gap-2"
            style={{
              paddingLeft: `${level * 20}px`,
            }}
          >
            {hasChildren ? (
              <ChevronRight
                size={16}
                className={cn(
                  "cursor-pointer text-muted-foreground transition-transform",
                  isExpanded && "rotate-90",
                )}
                onClick={() => onToggle(node.id)}
              />
            ) : (
              <div className="w-4" />
            )}

            {!hasChildren && showCheckbox && node.label !== "None" && (
              <Checkbox checked={isChecked} onChange={() => onCheck(node.id)} />
            )}

            {hasChildren ? (
              level === 0 ? (
                <BookText size={14} className="shrink-0 text-primary" />
              ) : (
                <FolderOpen size={14} className="shrink-0 text-primary" />
              )
            ) : (
              <CornerUpLeft
                size={14}
                className="shrink-0 text-muted-foreground"
              />
            )}

            <span className="truncate h-5 text-[13px] leading-[19.5px] font-medium tracking-[0px] text-text-primary">
              {node.label}
            </span>
          </div>
        </div>

        {hasChildren &&
          isExpanded &&
          node.children?.map((child) => (
            <ConnectionTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              checkedIds={checkedIds}
              onToggle={onToggle}
              onCheck={onCheck}
              showCheckbox={showCheckbox}
            />
          ))}
      </div>
    );
  }
