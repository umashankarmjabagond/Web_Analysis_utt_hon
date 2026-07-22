import { Tabs } from "../../../components/common/tabs/Tabs";

const tabs = [
  {
    id: "import-config",
    label: "Import Configuration File",
    path: "/#",
  },
  {
    id: "regulatory",
    label: "Regulatory Configuration",
    path: "/#",
  },
  {
    id: "mpc",
    label: "MPC Configuration",
    path: "/#",
  },
  {
    id: "pwo",
    label: "PWO Configuration",
    path: "/#",
  },
  {
    id: "analysis-schedule",
    label: "Analysis Schedule",
    path: "/#",
  },
  {
    id: "custom-kpi",
    label: "Custom KPI Configuration",
    path: "/dashboard",
  },
  {
    id: "analysis-engine",
    label: "Analysis Engine",
    path: "/workflow",
  },
];

export default function TopTabs() {
  return <Tabs items={tabs} />;
}
