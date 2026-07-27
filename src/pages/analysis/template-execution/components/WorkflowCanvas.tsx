import { useMemo, useState } from "react";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";

import { nodeTypes } from "./nodes/nodeTypes";
import { useLoadExecutionWorkflow } from "../hooks/useLoadExecutionWorkflow";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Connections from "../../../connections/Connections";
import Drawer from "../../../../components/drawer/Drawer";
import { Tabs } from "../../../../components/common/tabs/Tabs";
import { edgeTypes } from "./edges/edgeTypes";

interface WorkflowCanvasProps {
  templateId: string;
  itemId: string;
}

export default function WorkflowCanvas({
  templateId,
  itemId,
}: WorkflowCanvasProps) {
  useLoadExecutionWorkflow(templateId, itemId);

  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const edges = useTemplateExecutionStore((state) => state.edges);

  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState("table");
  // const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const tabs = useMemo(
    () => [
      {
        id: "table",
        label: "View Data",
        component: KpiTable,
      },
      {
        id: "errors",
        label: "Calculated KPIs and Errors",
        component: CalculatedKpisAndErrors,
      },
      {
        id: "connections",
        label: "Connections",
        component: Connections,
      },
    ],
    [],
  );

  const handleNodeClick = () => {
    // setSelectedNode(node);
    setOpened(true);
  };

  return (
    <>
      <div className="h-full bg-app-surface cursor-pointer">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // fitView
          onNodeClick={handleNodeClick}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            color="var(--app-surface-elevated)"
            size={3}
            variant={BackgroundVariant.Dots}
            gap={25}
          />
        </ReactFlow>
      </div>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        size="xl"
      >
        <div className="flex h-full flex-col">
          <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </Drawer>
    </>
  );
}
