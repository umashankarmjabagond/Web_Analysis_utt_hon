import { useCallback, useEffect } from "react";

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";

import type { Node } from "@xyflow/react";

import Toolbar from "./toolbar/Toolbar";
import { useWorkflowStore } from "../../../store/workflowStore";
import { nodeTypes } from "../../../types/nodeTypes";
import { edgeTypes } from "../../../types/edgeTypes";

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

  const { screenToFlowPosition } = useReactFlow();

  /**
   * Allow Drop
   */
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Drop Node
   */
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node: Node = {
        id: crypto.randomUUID(),

        type: "baseNode",

        position,

        data: {
          label: type,
        },
      };

      addNode(node);
    },
    [addNode, screenToFlowPosition],
  );

  /**
   * Node Click
   */
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode],
  );

  /**
   * Empty Canvas Click
   */
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  /**
   * Delete Key
   */
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
    <div className="flex-1 h-full bg-[#1f1f1f]">
      <Toolbar />
      <ReactFlow
        nodes={nodes}
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
        /* ===== Toolbar Control ===== */

        nodesDraggable={activeTool === "pointer"}
        elementsSelectable={activeTool === "pointer"}
        panOnDrag={activeTool === "pointer"}
        nodesConnectable={true}
        connectOnClick={activeTool === "connect"}
        onNodeDragStart={handleNodeDragStart}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
