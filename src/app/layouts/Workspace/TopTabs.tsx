import { Tabs } from "../../../components/common/tabs/Tabs";
import { useTranslation } from "react-i18next";

export default function TopTabs() {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "import-config",
      label: t("TAB_IMPORT_CONFIGURATION"),
      path: "/#",
    },
    {
      id: "regulatory",
      label: t("TAB_REGULATORY_CONFIGURATION"),
      path: "/#",
    },
    {
      id: "mpc",
      label: t("TAB_MPC_CONFIGURATION"),
      path: "/#",
    },
    {
      id: "pwo",
      label: t("TAB_PWO_CONFIGURATION"),
      path: "/#",
    },
    {
      id: "analysis-schedule",
      label: t("TAB_ANALYSIS_SCHEDULE"),
      path: "/#",
    },
    {
      id: "custom-kpi",
      label: t("TAB_CUSTOM_KPI_CONFIGURATION"),
      path: "/#",
    },
    {
      id: "analysis-engine",
      label: t("TAB_ANALYSIS_ENGINE"),
      path: "/dashboard",
    },
  ];

  return <Tabs items={tabs} />;
}
