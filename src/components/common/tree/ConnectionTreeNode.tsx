import { CornerDownRight, X } from "lucide-react";

import Checkbox from "../../forms/checkbox/CheckBox";

import { cn } from "../../../utils/utils";

import type { ConnectionTreeNodeProps } from "../../../types/commonTypes";

export default function ConnectionTreeNode({
  node,
  checkedIds,
  onCheck,
  showCheckbox = true,
  showShared = false,
  rightPanel = false,
  onRemove,
}: ConnectionTreeNodeProps) {
  const isChecked = checkedIds.includes(node.id);

  return (
    <div className="my-0">
      <div
        className={cn(
          "group flex min-h-10 items-center rounded-sm px-2 hover:bg-tree-node-hover-background",
          !rightPanel &&
            isChecked &&
            "bg-tree-node-hover-background text-accordion-list-count",
        )}
      >
        <div className="flex w-full items-center gap-2">
          {showCheckbox && (
            <Checkbox
              checked={isChecked}
              onChange={() => onCheck(node.id)}
              className={cn(
                !isChecked &&
                  "text-foreground-tertiary group-hover:text-foreground",
              )}
            />
          )}
          <CornerDownRight
            size={14}
            className={cn(
              "shrink-0",
              rightPanel
                ? isChecked
                  ? "text-accordion-list-count"
                  : "text-foreground-tertiary"
                : isChecked
                  ? "text-accordion-list-count"
                  : "text-foreground-tertiary group-hover:text-foreground",
            )}
          />

          <div className="flex w-full items-center justify-between">
            <span
              className={cn(
                "truncate h-5 text-[13px] leading-[19.5px] font-medium tracking-[0px]",
                rightPanel
                  ? "text-foreground"
                  : isChecked
                    ? "text-accordion-list-count"
                    : "text-foreground-tertiary group-hover:text-foreground",
              )}
            >
              {node.label}
            </span>
            <div className="flex items-center gap-3">
              {showShared && isChecked && (
                <span className="text-[12px] font-bold text-primary">
                  SHARED
                </span>
              )}

              {rightPanel && (
                <button
                  type="button"
                  onClick={() => onRemove?.(node.id)}
                  className="cursor-pointer"
                >
                  <X size={14} className="text-foreground-tertiary" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
