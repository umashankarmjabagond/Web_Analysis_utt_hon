import { beforeEach, describe, expect, it } from "vitest";

import { useTemplateExecutionStore } from "./templateExecutionStore";
import { EXECUTION_ACTION } from "../types/templateExecution";

describe("templateExecutionStore", () => {
  beforeEach(() => {
    useTemplateExecutionStore.setState({
      nodes: [],
      edges: [],
      selectedExecutionItem: null,
      selectedNodeIds: [],
      selectedRowIds: [],
      executionAction: EXECUTION_ACTION.IDLE,
      isNodeDrawerOpen: false,
    });
  });

  it("sets nodes", () => {
    const nodes = [
      {
        id: "node-1",
      },
    ];

    useTemplateExecutionStore
      .getState()
      .setNodes(nodes as never);

    expect(
      useTemplateExecutionStore.getState()
        .nodes,
    ).toEqual(nodes);
  });

  it("sets edges", () => {
    const edges = [
      {
        id: "edge-1",
      },
    ];

    useTemplateExecutionStore
      .getState()
      .setEdges(edges as never);

    expect(
      useTemplateExecutionStore.getState()
        .edges,
    ).toEqual(edges);
  });

  it("sets selected execution item", () => {
    const item = {
      id: "item-1",
    };

    useTemplateExecutionStore
      .getState()
      .setSelectedExecutionItem(
        item as never,
      );

    expect(
      useTemplateExecutionStore.getState()
        .selectedExecutionItem,
    ).toEqual(item);
  });

  it("sets execution action", () => {
    useTemplateExecutionStore
      .getState()
      .setExecutionAction(
        EXECUTION_ACTION.EXECUTE,
      );

    expect(
      useTemplateExecutionStore.getState()
        .executionAction,
    ).toBe(
      EXECUTION_ACTION.EXECUTE,
    );
  });

  it("opens node drawer", () => {
    useTemplateExecutionStore
      .getState()
      .setNodeDrawerOpen(true);

    expect(
      useTemplateExecutionStore.getState()
        .isNodeDrawerOpen,
    ).toBe(true);
  });

  it("closes node drawer", () => {
    useTemplateExecutionStore
      .getState()
      .setNodeDrawerOpen(false);

    expect(
      useTemplateExecutionStore.getState()
        .isNodeDrawerOpen,
    ).toBe(false);
  });

  it("updates existing node", () => {
  const node = {
    id: "node-1",
  };

  useTemplateExecutionStore.setState({
    nodes: [node] as never,
  });

  useTemplateExecutionStore
    .getState()
    .updateNode(
      "node-1",
      {
        updated: true,
      } as never,
    );

  expect(
    useTemplateExecutionStore.getState()
      .nodes[0],
  ).toMatchObject({
    id: "node-1",
    updated: true,
  });
});

  it("does not update non existing node", () => {
    useTemplateExecutionStore.setState({
      nodes: [
        {
          id: "node-1",
        },
      ] as never,
    });

    useTemplateExecutionStore
      .getState()
      .updateNode("node-2", {
        name: "Changed",
      } as never);

    expect(
      useTemplateExecutionStore.getState()
        .nodes,
    ).toEqual([
      {
        id: "node-1",
      },
    ]);
  });

  it("adds selected node when not already selected", () => {
    useTemplateExecutionStore
      .getState()
      .toggleSelectedNode(
        "node-1",
      );

    expect(
      useTemplateExecutionStore.getState()
        .selectedNodeIds,
    ).toEqual(["node-1"]);
  });

  it("removes selected node when already selected", () => {
    useTemplateExecutionStore.setState({
      selectedNodeIds: ["node-1"],
    });

    useTemplateExecutionStore
      .getState()
      .toggleSelectedNode(
        "node-1",
      );

    expect(
      useTemplateExecutionStore.getState()
        .selectedNodeIds,
    ).toEqual([]);
  });

  it("adds selected row when not already selected", () => {
    useTemplateExecutionStore
      .getState()
      .toggleSelectedRow(
        "row-1",
      );

    expect(
      useTemplateExecutionStore.getState()
        .selectedRowIds,
    ).toEqual(["row-1"]);
  });

  it("removes selected row when already selected", () => {
    useTemplateExecutionStore.setState({
      selectedRowIds: ["row-1"],
    });

    useTemplateExecutionStore
      .getState()
      .toggleSelectedRow(
        "row-1",
      );

    expect(
      useTemplateExecutionStore.getState()
        .selectedRowIds,
    ).toEqual([]);
  });

  it("loads workflow", () => {
    const nodes = [
      {
        id: "node-1",
      },
    ];

    const edges = [
      {
        id: "edge-1",
      },
    ];

    useTemplateExecutionStore
      .getState()
      .loadWorkflow(
        nodes as never,
        edges as never,
      );

    expect(
      useTemplateExecutionStore.getState()
        .nodes,
    ).toEqual(nodes);

    expect(
      useTemplateExecutionStore.getState()
        .edges,
    ).toEqual(edges);
  });

  it("resets UI state when loading workflow", () => {
    useTemplateExecutionStore.setState({
      selectedNodeIds: ["node-1"],
      selectedRowIds: ["row-1"],
      isNodeDrawerOpen: true,
      executionAction:
        EXECUTION_ACTION.EXECUTE,
    });

    useTemplateExecutionStore
      .getState()
      .loadWorkflow([], []);

    const state =
      useTemplateExecutionStore.getState();

    expect(
      state.selectedNodeIds,
    ).toEqual([]);

    expect(
      state.selectedRowIds,
    ).toEqual([]);

    expect(
      state.isNodeDrawerOpen,
    ).toBe(false);

    expect(
      state.executionAction,
    ).toBe(
      EXECUTION_ACTION.IDLE,
    );
  });
});