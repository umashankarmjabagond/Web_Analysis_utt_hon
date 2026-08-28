import { describe, it, expect } from "vitest";
import {
  buildChildrenMap,
  buildCompactSequence,
  buildInDegreeMap,
  computeLongestPathToEnd,
  type SequenceEdge,
  type SequenceNode,
} from "./compactSequenceBuilder";

describe("buildChildrenMap", () => {
  it("maps each node to its direct child nodes", () => {
    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
    ];

    const result = buildChildrenMap(edges);

    expect(result.get("A")).toEqual(["B", "C"]);
    expect(result.get("B")).toEqual(["D"]);
  });
});

describe("buildInDegreeMap", () => {
  it("counts multiple icoming edges for a node", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 0, y: 0 },
      { id: "C", x: 0, y: 0 },
      { id: "D", x: 0, y: 0 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "C", target: "D" },
    ];

    const result = buildInDegreeMap(nodes, edges);

    expect(result.get("A")).toEqual(0);
    expect(result.get("B")).toEqual(1);
    expect(result.get("C")).toEqual(1);
    expect(result.get("D")).toEqual(2);
  });
});

describe("computeLongestPathToEnd", () => {
  it("maps total hop counts for each node from that node to the end", () => {
    const nodeIds: string[] = ["A", "B", "C", "D", "E"];
    const children = new Map<string, string[]>([
      ["A", ["B"]],
      ["B", ["C"]],
      ["C", ["D"]],
      ["D", ["E"]],
      ["E", []],
    ]);

    const result = computeLongestPathToEnd(nodeIds, children);

    expect(result.get("A")).toEqual(4);
    expect(result.get("B")).toEqual(3);
    expect(result.get("C")).toEqual(2);
    expect(result.get("D")).toEqual(1);
    expect(result.get("E")).toEqual(0);
  });

  it("uses the longest path when a node has multiple children", () => {
    const nodeIds: string[] = ["A", "B", "C", "D", "E", "F"];
    const children = new Map<string, string[]>([
      ["A", ["B", "C"]],
      ["B", ["D"]],
      ["C", ["E"]],
      ["D", []],
      ["E", ["F"]],
      ["F", []],
    ]);

    const result = computeLongestPathToEnd(nodeIds, children);

    expect(result.get("A")).toEqual(3);
    expect(result.get("B")).toEqual(1);
    expect(result.get("C")).toEqual(2);
    expect(result.get("D")).toEqual(0);
    expect(result.get("E")).toEqual(1);
    expect(result.get("F")).toEqual(0);
  });
});

describe("buildCompactSequence", () => {
  // Simple linear flow
  // A → B → C
  // expected  - ["A", "B", "C"]
  it("returns nodes in squence order for a linear flow", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 100, y: 0 },
      { id: "C", x: 200, y: 0 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "B", target: "C" },
    ];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A", "B", "C"]);
  });

  //   Branch - verifies short branch is preferred
  it("places the shorter branch before the longer continuation", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 100, y: 0 },
      { id: "C", x: 100, y: 100 },
      { id: "D", x: 200, y: 0 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
    ];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A", "C", "B", "D"]);
  });

  //   Branch Merge
  it("waits for all parent nodes before placing a merge node", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 100, y: 0 },
      { id: "C", x: 100, y: 100 },
      { id: "D", x: 200, y: 0 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
      { source: "B", target: "D" },
      { source: "C", target: "D" },
    ];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A", "B", "C", "D"]);
  });

  //   Multiple ready nodes - x position
  it("uses x position to break ties when ready nodes have the same path length", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 300, y: 0 },
      { id: "C", x: 200, y: 0 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
    ];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A", "C", "B"]);
  });

  //   Multiple ready nodes - y position
  it("uses y position to break ties when path length and x position are the same", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 100, y: 100 },
      { id: "C", x: 100, y: 50 },
    ];

    const edges: SequenceEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "C" },
    ];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A", "C", "B"]);
  });

  //   Single node
  it("returns the single node when the graph contains only one node", () => {
    const nodes: SequenceNode[] = [{ id: "A", x: 0, y: 0 }];

    const edges: SequenceEdge[] = [];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["A"]);
  });

  //   Disconnected nodes
  it("includes disconnected nodes in the sequence", () => {
    const nodes: SequenceNode[] = [
      { id: "A", x: 0, y: 0 },
      { id: "B", x: 100, y: 0 },
      { id: "C", x: 50, y: 100 },
    ];

    const edges: SequenceEdge[] = [{ source: "A", target: "B" }];

    const result = buildCompactSequence(nodes, edges);

    expect(result).toEqual(["C", "A", "B"]);
  });
});
