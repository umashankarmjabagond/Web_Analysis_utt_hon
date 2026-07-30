import { useCallback, useEffect } from "react";

import {
  Background,
  BackgroundVariant,
  MarkerType,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";

import type { Edge } from "@xyflow/react";

import type {
  WorkflowDragItem,
  WorkflowListItem,
  WorkflowNode,
} from "../../../types/workFlowTypes";

import Toolbar from "./toolbar/Toolbar";
import { useWorkflowStore } from "../../../store/workflowStore";
import { edgeTypes, nodeTypes } from "../../../types/workFlowTypes";

import { backendToFlow } from "../../../utils/utils";

import { useMemo, useState } from "react";
import Dialog from "../../../components/common/dialogue/Dialog";
import {
  attributeCatalogSections,
  dummyWorkflows,
} from "../workflowPanelData ";

import GroupedSelector from "../../../components/forms/select/GroupedSelector";

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
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteSelectedNodes,
    deleteSelectedEdges,
    setSelectedNode,
    setSelectedEdge,
    selectedEdge,
    activeTool,
    saveHistory,
    clearWorkflow,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow<WorkflowNode, Edge>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    clearWorkflow();
  }, [clearWorkflow]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleEdgeInsert = useCallback(
    (edge: { id: string; source: string; target: string }) => {
      setSelectedEdge(edge as any);
      setIsDialogOpen(true);
    },
    [setSelectedEdge],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");

      if (!raw) return;

      const dragItem: WorkflowDragItem = JSON.parse(raw);

      /**
       * ==============================
       * TEMPLATE DROP
       * ==============================
       */
      if (dragItem.type === "template") {
        const backendWorkflow = dummyWorkflows[dragItem.item.id];

        if (!backendWorkflow) return;

        const canvasWorkflow = backendToFlow(backendWorkflow);

        setNodes(canvasWorkflow.nodes);
        setEdges(canvasWorkflow.edges);

        return;
      }

      /**
       * ==============================
       * ATTRIBUTE DROP
       * ==============================
       */

      if (!dragItem.item.element) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const element = structuredClone(dragItem.item.element);

      element.Name = generateUniqueName(
        element.elementType,
        nodes as WorkflowNode[],
      );

      const node: WorkflowNode = {
        id: element.Name,
        type: "baseNode",
        position,
        data: {
          label: dragItem.item.title,
          element,
        },
      };

      addNode(node);
    },
    [addNode, nodes, screenToFlowPosition, setNodes, setEdges],
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

  const flowEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...(edge.data ?? {}),
          onEdgeInsert: handleEdgeInsert,
        },
      })),
    [edges, handleEdgeInsert],
  );

  const handleAddNewNode = (item: WorkflowListItem) => {
    if (!selectedEdge || !item.element) return;

    saveHistory();

    const sourceNode = nodes.find((n) => n.id === selectedEdge.source);
    const targetNode = nodes.find((n) => n.id === selectedEdge.target);

    if (!sourceNode || !targetNode) return;

    const element = structuredClone(item.element);

    element.Name = generateUniqueName(
      element.elementType,
      nodes as WorkflowNode[],
    );

    const newNode: WorkflowNode = {
      id: element.Name,
      type: "baseNode",
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
      data: {
        label: item.title,
        element,
      },
    };

    const newEdges: Edge[] = [
      ...edges.filter((edge) => edge.id !== selectedEdge.id),

      {
        id: `${sourceNode.id}-${newNode.id}`,
        source: sourceNode.id,
        target: newNode.id,
        type: "workflow",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      },

      {
        id: `${newNode.id}-${targetNode.id}`,
        source: newNode.id,
        target: targetNode.id,
        type: "workflow",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      },
    ];

    setNodes([...nodes, newNode]);
    setEdges(newEdges);

    setSelectedEdge(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="relative h-full flex-1 bg-app-surface">
      <div className="absolute left-4 right-3 top-5 z-10">
        <Toolbar />
      </div>

      <ReactFlow<WorkflowNode, Edge>
        nodes={nodes as WorkflowNode[]}
        edges={flowEdges}
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
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-medium text-app-default-border">
              Create New Template
            </h2>

            <p className="mt-4 text-base leading-6 text-app-default-border">
              Create a template from scratch using attributes or predefined
              templates as base from the left pane, customize it to your
              requirements, and save it as a custom template.
            </p>
          </div>
        </div>
      )}

      <Dialog
        isOpen={isDialogOpen}
        title="Add Attribute"
        subtitle="Workflow"
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEdge(null);
        }}
        width={620}
      >
        <GroupedSelector
          placeholder="Select an option"
          sections={attributeCatalogSections.map((section) => ({
            id: section.id,
            title: section.title,
            items: section.items.map((item) => ({
              id: item.id,
              label: item.title,
              value: item,
              icon: item.icon,
            })),
          }))}
          onSelect={(item) => {
            handleAddNewNode(item.value as WorkflowListItem);
          }}
        />
      </Dialog>
    </div>
  );
}
