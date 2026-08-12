import WorkflowPanel from "./WorkflowPanel";
import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";
import type { PanelConfig } from "../../../types/workFlowTypes";

export const panelConfig: PanelConfig[] = [
  {
    path: ROUTES.WORKFLOW,
    header: "WORKFLOW_NODES",
    component: <WorkflowPanel />,
    layout: "workflow",
  },
  {
    path: ROUTES.DASHBOARD,
    header: "PLANT_HIERARCHY",
    component: <DashboardPanel />,
    layout: "default",
  },
];
