import { useMemo, useState } from "react";
import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";

import { nodeTypes } from "./nodes/nodeTypes";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Connections from "../../../connections/Connections";
import Drawer from "../../../../components/drawer/Drawer";
import { Tabs } from "../../../../components/common/tabs/Tabs";
import { edgeTypes } from "./edges/edgeTypes";
import Properties from "../../../KPI/Properties";

export default function WorkflowCanvas() {
  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const edges = useTemplateExecutionStore((state) => state.edges);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        id: "properties",
        label: "Properties",
        component: Properties,
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
    setIsDrawerOpen(true);
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

      {}
      <Drawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
