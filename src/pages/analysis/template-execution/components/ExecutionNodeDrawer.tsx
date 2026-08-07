import { useMemo, useState } from "react";
import Drawer from "../../../../components/drawer/Drawer";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Properties from "../../../KPI/Properties";
import Connections from "../../../KPI/Connections";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { Tabs } from "../../../../components/common/tabs/Tabs";

export default function ExecutionNodeDrawer() {
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
        component: () => (
          <Properties 
            onCancel={() => setNodeDrawerOpen(false)}/>
        ),
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

  return (
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
        {isNodeDrawerOpen && ActiveTabComponent && <ActiveTabComponent />}
      </div>
    </Drawer>
  );
}
