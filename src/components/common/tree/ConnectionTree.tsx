import ConnectionTreeNode from "./ConnectionTreeNode";

import type {
  ConnectionTreeProps,
  TreeNodeData,
} from "../../../types/commonTypes";

export default function ConnectionTree({
  nodes,
  checkedIds,
  onCheck,
  showCheckbox = true,
  showShared = false,
  rightPanel = false,
  onRemove,
}: ConnectionTreeProps) {
  const flattenNodes = (treeNodes: TreeNodeData[]): TreeNodeData[] => {
    const result: TreeNodeData[] = [];

    treeNodes.forEach((node) => {
      if (!node.children?.length) {
        if (node.label !== "None") {
          result.push(node);
        }
      } else {
        result.push(...flattenNodes(node.children));
      }
    });

    return result;
  };

  const leafNodes = flattenNodes(nodes);

  return (
    <div>
      {leafNodes.map((node) => (
        <ConnectionTreeNode
          key={node.id}
          node={node}
          checkedIds={checkedIds}
          onCheck={onCheck}
          showCheckbox={showCheckbox}
          showShared={showShared}
          rightPanel={rightPanel}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
