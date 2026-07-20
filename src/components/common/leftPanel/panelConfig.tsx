import WorkflowPanel from "./WorkflowPanel";
import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";

export const panelConfig = [
  {
    path: ROUTES.WORKFLOW,
    component: <WorkflowPanel />,
  },
  {
    path: ROUTES.DASHBOARD,
    component: <DashboardPanel />,
  },
];
