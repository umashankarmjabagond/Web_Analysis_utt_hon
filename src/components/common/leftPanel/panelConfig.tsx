import WorkflowPanel from "./WorkflowPanel";
import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";

export const panelConfig = [
  {
    path: ROUTES.WORKFLOW,
    header: "WORKFLOW_NODES",
    component: <WorkflowPanel />,
  },
  {
    path: ROUTES.DASHBOARD,
    header: "PLANT_HIERARCHY",
    component: <DashboardPanel />,
  },
];
