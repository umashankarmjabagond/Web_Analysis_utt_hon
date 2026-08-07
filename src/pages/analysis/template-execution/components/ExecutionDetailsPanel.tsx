import { useMemo, useState } from "react";
import { Tabs } from "../../../../components/common/tabs/Tabs";
import Drawer from "../../../../components/drawer/Drawer";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Properties from "../../../KPI/Properties";
import Connections from "../../../KPI/Connections";

export default function ExecutionDetailsPanel() {
  const DetailsPanel = Drawer;

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

  return (
    <DetailsPanel
      variant="panel"
      opened={true}
      onClose={() => {}}
      className="flex-1"
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
    </DetailsPanel>
  );
}
