import { useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";

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

  const handleNodeSelection = useTemplateExecutionStore(
    (state) => state.handleNodeSelection,
  );

  const isNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.isNodeDrawerOpen,
  );

  const setNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.setNodeDrawerOpen,
  );

  const [activeTab, setActiveTab] = useState("table");

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
  const activeTabItem = tabs.find((tab) => tab.id === activeTab);
  const ActiveTabComponent = activeTabItem?.component;

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    if (node.type === "executionHeader") {
      return;
    }

    // Open Drawer
    handleNodeSelection(node.id);
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

      {isNodeDrawerOpen && (
        <Drawer
          opened={isNodeDrawerOpen}
          onClose={() => setNodeDrawerOpen(false)}
          position="bottom"
          size="xl"
          title={
            <Tabs
              items={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              renderContent={false}
            />
          }
        >
          <div className="h-full overflow-hidden">
            {ActiveTabComponent && <ActiveTabComponent />}
          </div>
        </Drawer>
      )}
    </>
  );
}
