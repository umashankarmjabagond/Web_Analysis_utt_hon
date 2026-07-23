import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import { ROUTES } from "../../constants/routes/routesConstant";
import WorkflowBuilder from "../../pages/workflow/WorkflowBuilder";
import Dashboard from "../../pages/dashboard/Dashboard";
import DashboardContent from "../../pages/dashboard/DashboardContent";
import LoopConfigurationPage from "../../pages/loop-configuration/LoopConfigurationPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={ROUTES.WORKFLOW} replace />} />
        <Route path={ROUTES.WORKFLOW} element={<WorkflowBuilder />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path="/dashboard/:section" element={<DashboardContent />} />
        <Route path={ROUTES.LOOP_CONFIGURATION} element={<LoopConfigurationPage />} />
      </Route>
    </Routes>
  );
}
