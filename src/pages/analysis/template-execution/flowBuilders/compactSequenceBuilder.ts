import type {
  SequenceEdge,
  SequenceNode,
} from "../../../../types/templateExecution";

// Maps each node id to the list of node ids it points to.
export const buildChildrenMap = (
  edges: SequenceEdge[],
): Map<string, string[]> => {
  const children = new Map<string, string[]>();

  edges.forEach((edge) => {
    const existing = children.get(edge.source) ?? [];
    existing.push(edge.target);
    children.set(edge.source, existing);
  });

  return children;
};

// Counts how many incoming edges each node has. A node is only "ready"
// to be sequenced once every one of its parents has already been placed.
export const buildInDegreeMap = (
  nodes: SequenceNode[],
  edges: SequenceEdge[],
): Map<string, number> => {
  const inDegree = new Map<string, number>();

  nodes.forEach((node) => inDegree.set(node.id, 0));

  edges.forEach((edge) => {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  });

  return inDegree;
};

// For every node, the number of hops on its longest path to a dead end
// (a node with no outgoing edges). Used to prefer short branches first.
export const computeLongestPathToEnd = (
  nodeIds: string[],
  children: Map<string, string[]>,
): Map<string, number> => {
  const longestPathToEnd = new Map<string, number>();

  const visit = (nodeId: string): number => {
    const cached = longestPathToEnd.get(nodeId);
    if (cached !== undefined) return cached;

    const nodeChildren = children.get(nodeId) ?? [];

    const longest =
      nodeChildren.length === 0
        ? 0
        : 1 + Math.max(...nodeChildren.map((childId) => visit(childId)));

    longestPathToEnd.set(nodeId, longest);
    return longest;
  };

  nodeIds.forEach((nodeId) => visit(nodeId));

  return longestPathToEnd;
};

// Topological sort (Kahn's algorithm) where, whenever multiple nodes are
// ready at once, the one with the shortest remaining path to the end is
// placed first. This inserts short branches inline before long
// continuations, and naturally stalls merge nodes (like a node with two
// parents) until every parent has actually been placed — no special
// casing needed for merge points.
export const buildCompactSequence = (
  nodes: SequenceNode[],
  edges: SequenceEdge[],
): string[] => {
  const children = buildChildrenMap(edges);
  const remainingInDegree = buildInDegreeMap(nodes, edges);
  const longestPathToEnd = computeLongestPathToEnd(
    nodes.map((node) => node.id),
    children,
  );
  const positionById = new Map(nodes.map((node) => [node.id, node]));

  const ready: string[] = nodes
    .filter((node) => (remainingInDegree.get(node.id) ?? 0) === 0)
    .map((node) => node.id);

  const sequence: string[] = [];

  while (ready.length > 0) {
    ready.sort((a, b) => {
      const pathDiff =
        (longestPathToEnd.get(a) ?? 0) - (longestPathToEnd.get(b) ?? 0);
      if (pathDiff !== 0) return pathDiff;

      const posA = positionById.get(a)!;
      const posB = positionById.get(b)!;
      if (posA.x !== posB.x) return posA.x - posB.x;
      return posA.y - posB.y;
    });

    const nextId = ready.shift()!;
    sequence.push(nextId);

    const nextChildren = children.get(nextId) ?? [];
    nextChildren.forEach((childId) => {
      const updated = (remainingInDegree.get(childId) ?? 0) - 1;
      remainingInDegree.set(childId, updated);
      if (updated === 0) {
        ready.push(childId);
      }
    });
  }

  return sequence;
};
