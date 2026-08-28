import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Drawer from "../../../../components/drawer/Drawer";
import KpiTable from "../../../KPI/KpiTable";
import CalculatedKpisAndErrors from "../../../KPI/CalculatedKpisAndErrors";
import Properties from "../../../KPI/Properties";
import Connections from "../../../workflow/components/ConfigureConnection/ConfigureConnection";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { Tabs } from "../../../../components/common/tabs/Tabs";

export default function ExecutionNodeDrawer() {
  const { t } = useTranslation();

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
        component: () => (
          <Properties onCancel={() => setNodeDrawerOpen(false)} />
        ),
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
