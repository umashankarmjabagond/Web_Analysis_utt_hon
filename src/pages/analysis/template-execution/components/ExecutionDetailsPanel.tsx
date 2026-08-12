import { useMemo, useState } from "react";
import { Tabs } from "../../../../components/common/tabs/Tabs";
import Drawer from "../../../../components/drawer/Drawer";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Properties from "../../../KPI/Properties";
import Connections from "../../../KPI/Connections";
import { useTranslation } from "react-i18next";
export default function ExecutionDetailsPanel() {
  const { t } = useTranslation();

  const DetailsPanel = Drawer;

  const [activeTab, setActiveTab] = useState("table");

  const tabs = useMemo(
    () => [
      {
        id: "table",
        label: t("TAB_VIEW_DATA"),
        component: KpiTable,
      },
      {
        id: "errors",
        label: t("TAB_CALCULATED_KPIS_ERRORS"),
        component: CalculatedKpisAndErrors,
      },
      {
        id: "properties",
        label: t("TAB_PROPERTIES"),
        component: Properties,
      },
      {
        id: "connections",
        label: t("TAB_CONNECTIONS"),
        component: Connections,
      },
    ],
    [t],
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
