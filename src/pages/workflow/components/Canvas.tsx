import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ConnectionLineType,
  ConnectionMode,
  MarkerType,
  ReactFlow,
  useReactFlow,
  type Edge,
} from "@xyflow/react";
import {
  edgeTypes,
  nodeTypes,
  type WorkflowDragItem,
  type WorkflowListItem,
  type WorkflowNode,
} from "../../../types/workFlowTypes";
import { useWorkflowStore } from "../../../store/workflowStore";
import { backendToFlow } from "../../../utils/utils";
import Dialog from "../../../components/common/dialogue/Dialog";
import {
  attributeCatalogSections,
  dummyWorkflows,
} from "../workflowPanelData ";
import ZoomControls from "./ZoomControls";
import AttributeSelector from "../../../components/forms/select/AttributeSelector";
import NodeContextMenu from "./NodeContextMenu";

type NodeInsertDirection = "top" | "right" | "bottom" | "left";

interface NodeInsertRequest {
  nodeId: string;
  direction: NodeInsertDirection;
}

interface NodeContextMenuState {
  x: number;
  y: number;
  node: WorkflowNode;
}

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

const getCatalogIdFromElementType = (
  elementType?: string,
): string | undefined => {
  if (!elementType) {
    return undefined;
  }

  const normalizedType = elementType.toLowerCase();

  for (const section of attributeCatalogSections) {
    const item = section.items.find(
      (item) => item.element?.elementType?.toLowerCase() === normalizedType,
    );

    if (item) {
      return item.id;
    }
  }

  return undefined;
};

const addCatalogIdsToNodes = (nodes: WorkflowNode[]): WorkflowNode[] => {
  return nodes.map((node) => ({
    ...node,

    data: {
      ...node.data,

      catalogId: getCatalogIdFromElementType(node.data.element?.elementType),
    },
  }));
};

export default function Canvas() {
  const { t } = useTranslation();

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
    activeTool,
    saveHistory,
    clearWorkflow,
    pendingCatalogItem,
    setPendingCatalogItem,
    isImporting,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow<WorkflowNode, Edge>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [nodeInsertRequest, setNodeInsertRequest] =
    useState<NodeInsertRequest | null>(null);

  const [contextMenu, setContextMenu] = useState<NodeContextMenuState | null>(
    null,
  );

  useEffect(() => {
    clearWorkflow();
  }, [clearWorkflow]);

  useEffect(() => {
    if (!pendingCatalogItem) {
      return;
    }

    if (pendingCatalogItem.element?.elementType === "Template") {
      const backendWorkflow = dummyWorkflows[pendingCatalogItem.id];

      if (backendWorkflow) {
        const canvasWorkflow = backendToFlow(backendWorkflow);

        const nodesWithCatalogIds = addCatalogIdsToNodes(
          canvasWorkflow.nodes as WorkflowNode[],
        );

        setNodes(nodesWithCatalogIds);

        setEdges(canvasWorkflow.edges);
      }

      setPendingCatalogItem(null);
      return;
    }

    // Attribute
    const element = structuredClone(pendingCatalogItem.element);

    element.Name = generateUniqueName(
      element.elementType,
      nodes as WorkflowNode[],
    );

    const node: WorkflowNode = {
      id: element.Name,
      type: "baseNode",
      position: {
        x: 400,
        y: 250,
      },
      data: {
        label: pendingCatalogItem.title,
        element,
        catalogId: pendingCatalogItem.id,
      },
    };

    addNode(node);

    setPendingCatalogItem(null);
  }, [
    pendingCatalogItem,
    addNode,
    nodes,
    setNodes,
    setEdges,
    setPendingCatalogItem,
  ]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");

      if (!raw) return;

      const dragItem: WorkflowDragItem = JSON.parse(raw);

      if (dragItem.type === "template") {
        const backendWorkflow = dummyWorkflows[dragItem.item.id];

        if (!backendWorkflow) return;

        const canvasWorkflow = backendToFlow(backendWorkflow);

        const nodesWithCatalogIds = addCatalogIdsToNodes(
          canvasWorkflow.nodes as WorkflowNode[],
        );

        setNodes(nodesWithCatalogIds);

        setEdges(canvasWorkflow.edges);

        return;
      }

      if (!dragItem.item.element) {
        return;
      }

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
          catalogId: dragItem.item.id,
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

  const handleNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: WorkflowNode) => {
      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        node,
      });
    },
    [],
  );
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setContextMenu(null);
  }, [setSelectedNode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteSelectedEdges();
        deleteSelectedNodes();
      }

      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedEdges, deleteSelectedNodes]);

  const handleNodeDragStart = useCallback(() => {
    saveHistory();
  }, [saveHistory]);

  const handleNodeInsert = useCallback((request: NodeInsertRequest) => {
    setNodeInsertRequest(request);
    setIsDialogOpen(true);
  }, []);

  const flowNodes = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onNodeInsert: handleNodeInsert,
    },
  }));

  const flowEdges = edges;

  // const handleAddNewNode = (item: WorkflowListItem) => {
  //   if (!selectedEdge || !item.element) {
  //     return;
  //   }

  //   saveHistory();

  //   const sourceNode = nodes.find((node) => node.id === selectedEdge.source);

  //   const targetNode = nodes.find((node) => node.id === selectedEdge.target);

  //   if (!sourceNode || !targetNode) {
  //     return;
  //   }

  //   const element = structuredClone(item.element);

  //   element.Name = generateUniqueName(
  //     element.elementType,
  //     nodes as WorkflowNode[],
  //   );

  //   const newNode: WorkflowNode = {
  //     id: element.Name,
  //     type: "baseNode",
  //     position: {
  //       x: (sourceNode.position.x + targetNode.position.x) / 2,
  //       y: (sourceNode.position.y + targetNode.position.y) / 2,
  //     },
  //     data: {
  //       label: item.title,
  //       element,
  //       catalogId: item.id,
  //     },
  //   };

  //   const newEdges: Edge[] = [
  //     ...edges.filter((edge) => edge.id !== selectedEdge.id),

  //     {
  //       id: `${sourceNode.id}-${newNode.id}`,
  //       source: sourceNode.id,
  //       target: newNode.id,
  //       type: "workflow",
  //       markerEnd: {
  //         type: MarkerType.ArrowClosed,
  //       },
  //     },

  //     {
  //       id: `${newNode.id}-${targetNode.id}`,
  //       source: newNode.id,
  //       target: targetNode.id,
  //       type: "workflow",
  //       markerEnd: {
  //         type: MarkerType.ArrowClosed,
  //       },
  //     },
  //   ];

  //   setNodes([...nodes, newNode]);
  //   setEdges(newEdges);

  //   setSelectedEdge(null);
  //   setIsDialogOpen(false);
  // };

  const NODE_INSERT_OFFSET = 100;
  const handleNodeInsertSelection = (item: WorkflowListItem) => {
    if (!nodeInsertRequest || !item.element) {
      return;
    }

    const existingNode = nodes.find(
      (node) => node.id === nodeInsertRequest.nodeId,
    );

    if (!existingNode) {
      return;
    }

    saveHistory();

    const element = structuredClone(item.element);

    element.Name = generateUniqueName(
      element.elementType,
      nodes as WorkflowNode[],
    );

    const { x, y } = existingNode.position;

    let newPosition = { x, y };

    switch (nodeInsertRequest.direction) {
      case "top":
        newPosition = { x, y: y - NODE_INSERT_OFFSET };
        break;
      case "right":
        newPosition = { x: x + NODE_INSERT_OFFSET, y };
        break;
      case "bottom":
        newPosition = { x, y: y + NODE_INSERT_OFFSET };
        break;
      case "left":
        newPosition = { x: x - NODE_INSERT_OFFSET, y };
        break;
    }

    const newNode: WorkflowNode = {
      id: element.Name,
      type: "baseNode",
      position: newPosition,
      data: {
        label: item.title,
        element,
        catalogId: item.id,
      },
    };

    let newEdge: Edge;
    // nodeInsertRequest.direction === "top" ||
    // nodeInsertRequest.direction === "left"
    //   ? {
    //       id: `${newNode.id}-${existingNode.id}`,
    //       source: newNode.id,
    //       target: existingNode.id,
    //       type: "workflow",
    //       markerEnd: {
    //         type: MarkerType.ArrowClosed,
    //       },
    //     }
    //   : {
    //       id: `${existingNode.id}-${newNode.id}`,
    //       source: existingNode.id,
    //       target: newNode.id,
    //       type: "workflow",
    //       markerEnd: {
    //         type: MarkerType.ArrowClosed,
    //       },
    //     };

    switch (nodeInsertRequest.direction) {
      case "top":
        newEdge = {
          id: `${existingNode.id}-${newNode.id}`,
          source: existingNode.id,
          sourceHandle: "top-handle",
          target: newNode.id,
          targetHandle: "bottom-handle",
          type: "workflow",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        break;

      case "right":
        newEdge = {
          id: `${existingNode.id}-${newNode.id}`,
          source: existingNode.id,
          sourceHandle: "right-handle",
          target: newNode.id,
          targetHandle: "left-handle",
          type: "workflow",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        break;

      case "bottom":
        newEdge = {
          id: `${existingNode.id}-${newNode.id}`,
          source: existingNode.id,
          sourceHandle: "bottom-handle",
          target: newNode.id,
          targetHandle: "top-handle",
          type: "workflow",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        break;

      case "left":
        newEdge = {
          id: `${existingNode.id}-${newNode.id}`,
          source: existingNode.id,
          sourceHandle: "left-handle",
          target: newNode.id,
          targetHandle: "right-handle",
          type: "workflow",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        break;
    }
    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setNodeInsertRequest(null);
    setIsDialogOpen(false);
  };

  const handleAttributeSelect = (item: WorkflowListItem) => {
    if (!nodeInsertRequest) {
      return;
    }

    handleNodeInsertSelection(item);
  };
  return (
    <div className="relative h-full w-full">
      <ReactFlow<WorkflowNode, Edge>
        className="!bg-[#111111]"
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        fitView
        nodesDraggable={activeTool === "pointer"}
        elementsSelectable={activeTool === "pointer"}
        panOnDrag={activeTool === "pointer"}
        nodesConnectable
        connectOnClick={activeTool === "connect"}
        onNodeDragStart={handleNodeDragStart}
        proOptions={{
          hideAttribution: true,
        }}
        connectionMode={ConnectionMode.Loose}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: "#4FB3FF",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
        }}
      >
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="max-w-lg text-center">
              <h2 className="text-4xl font-medium text-foreground-tertiary">
                {t("CANVAS_CREATE_NEW_TEMPLATE")}
              </h2>

              <p className="mt-4 text-base leading-6 text-foreground-tertiary">
                {t("CANVAS_CREATE_TEMPLATE_DESCRIPTION")}
              </p>
            </div>
          </div>
        )}
        <ZoomControls />
      </ReactFlow>

      {isImporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#111111]/80">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <p className="text-sm text-white">Importing, please wait...</p>
          </div>
        </div>
      )}
      {contextMenu && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          // onAction={handleContextMenuAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      <Dialog
        isOpen={isDialogOpen}
        title={t("CANVAS_ADD_ATTRIBUTE")}
        subtitle={t("CANVAS_WORKFLOW")}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEdge(null);
        }}
        width={274}
        showIcon={false}
        headerClassName="hidden"
        bodyClassName="p-0"
      >
        <AttributeSelector
          items={attributeCatalogSections.flatMap((section) =>
            section.items.map((item) => ({
              id: item.id,
              label: item.title,
              // icon: item.icon,
              value: item,
            })),
          )}
          onSelect={(item) => {
            handleAttributeSelect(item.value as WorkflowListItem);
          }}
        />
      </Dialog>
    </div>
  );
}
