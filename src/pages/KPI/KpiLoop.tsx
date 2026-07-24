import { useMemo, useState } from "react";

import CalculatedKpisAndErrors from "./CalculatedKpisAndErrors";
import KpiTable from "./KpiTable";
import Drawer from "../../components/drawer/Drawer";
import { Tabs } from "../../components/common/tabs/Tabs";
import Connections from "../connections/Connections";

const workflow = [
  {
    id: 1,
    label: "Data\nSource",
    color: "bg-green-900 border-green-700",
  },
  {
    id: 2,
    label: "Data\nPreproc",
    color: "bg-green-900 border-green-700",
  },
  {
    id: 3,
    label: "Multi\nMath",
    color: "bg-green-900 border-green-700",
  },
  {
    id: 4,
    label: "Math",
    color: "bg-yellow-700 border-yellow-500",
  },
  {
    id: 5,
    label: "Controller",
    color: "bg-red-800 border-red-600",
  },
  {
    id: 6,
    label: "PA",
    color: "bg-red-900 border-red-700",
  },
  {
    id: 7,
    label: "Multi\nMath",
    color: "bg-green-900 border-green-700",
  },
  {
    id: 8,
    label: "Math",
    color: "bg-green-900 border-green-700",
  },
];

const KpiLoop = () => {
  const [opened, setOpened] = useState(false);
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
        id: "connections",
        label: "Connections",
        component: Connections,
      },
    ],
    [],
  );

  const handleNodeClick = () => {
    setOpened(true);
  };

  return (
    <>
      <div className="rounded-md bg-[#1f1f1f] p-5">
        <div className="flex items-center overflow-x-auto">
          {workflow.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <button
                onClick={handleNodeClick}
                className={`flex h-16 w-24 cursor-pointer items-center justify-center rounded border text-center text-xs font-medium text-white transition-all duration-200 hover:scale-105 ${item.color}`}
              >
                <span className="whitespace-pre-line">{item.label}</span>
              </button>

              {index !== workflow.length - 1 && (
                <>
                  <div className="h-[2px] w-8 bg-gray-500" />
                  <div className="-ml-1 border-y-4 border-l-8 border-y-transparent border-l-gray-500" />
                </>
              )}
            </div>
          ))}
        </div>
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
};

export default KpiLoop;
