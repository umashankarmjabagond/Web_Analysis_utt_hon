import WorkflowPanel from "./WorkflowPanel";
import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";
import LoopConfigurationPanel from "./LoopConfigurationPanel";

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
  {
    path: ROUTES.LOOP_CONFIGURATION,
    component: <LoopConfigurationPanel />,
  }
];
