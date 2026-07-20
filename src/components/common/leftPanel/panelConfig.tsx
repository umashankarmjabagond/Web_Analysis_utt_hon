import WorkflowPanel from "./WorkflowPanel";
import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";

export const panelConfig = [
  {
    path: ROUTES.WORKFLOW,
    header: "Workflow Nodes",
    component: <WorkflowPanel />,
  },
  {
    path: ROUTES.DASHBOARD,
    header: "Plant Hierarchy",
    component: <DashboardPanel />,
  },
];
