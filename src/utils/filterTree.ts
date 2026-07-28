import type { TreeNodeData } from "../types/commonTypes";

export const filterTree = (
  nodes: TreeNodeData[],
  search: string,
): TreeNodeData[] => {
  if (!search.trim()) {
    return nodes;
  }

  const query = search.toLowerCase();

  return nodes.reduce<TreeNodeData[]>((acc, node) => {
    const isMatch = node.label.toLowerCase().includes(query);

    if (isMatch) {
      acc.push(node);
      return acc;
    }

    const filteredChildren = node.children
      ? filterTree(node.children, query)
      : [];

    if (filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};
