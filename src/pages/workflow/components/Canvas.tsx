import { useCallback, useEffect } from "react";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";

import type { Edge } from "@xyflow/react";

import type {
  WorkflowListItem,
  WorkflowNode,
} from "../../../types/workFlowTypes";

import Toolbar from "./toolbar/Toolbar";
import { useWorkflowStore } from "../../../store/workflowStore";
import { edgeTypes, nodeTypes } from "../../../types/workFlowTypes";

/**
 * Generates a unique backend element name.
 */
const generateUniqueName = (
  baseName: string,
  existingNodes: WorkflowNode[],
): string => {
  let index = 1;

  while (
    existingNodes.some(
      (node) => node.data.element.Name === `${baseName}${index}`,
    )
  ) {
    index++;
  }

  return `${baseName}${index}`;
};

export default function Canvas() {
  const {
    nodes,
    edges,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteSelectedNodes,
    deleteSelectedEdges,
    setSelectedNode,
    activeTool,
    saveHistory,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow<WorkflowNode, Edge>();

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");

      if (!raw) return;

      const item: WorkflowListItem = JSON.parse(raw);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const element = structuredClone(item.element);

      element.Name = generateUniqueName(
        element.elementType,
        nodes as WorkflowNode[],
      );

      const node: WorkflowNode = {
        id: element.Name,

        type: "baseNode",

        position,

        data: {
          label: item.title,
          element,
        },
      };

      addNode(node);
    },
    [addNode, nodes, screenToFlowPosition],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNode(node);
    },
    [setSelectedNode],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteSelectedEdges();
        deleteSelectedNodes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelectedEdges, deleteSelectedNodes]);

  const handleNodeDragStart = useCallback(() => {
    saveHistory();
  }, [saveHistory]);

  return (
    <div className="h-full flex-1 bg-[#1f1f1f]">
      <Toolbar />

      <ReactFlow<WorkflowNode, Edge>
        nodes={nodes as WorkflowNode[]}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        nodesDraggable={activeTool === "pointer"}
        elementsSelectable={activeTool === "pointer"}
        panOnDrag={activeTool === "pointer"}
        nodesConnectable
        connectOnClick={activeTool === "connect"}
        onNodeDragStart={handleNodeDragStart}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
