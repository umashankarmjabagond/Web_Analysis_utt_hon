import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import { ROUTES } from "../../constants/routes/routesConstant";
import WorkflowBuilder from "../../pages/workflow/WorkflowBuilder";
import Dashboard from "../../pages/dashboard/Dashboard";
import DashboardContent from "../../pages/dashboard/DashboardContent";
import KpiLoop from "../../pages/KPI/KpiLoop";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={ROUTES.WORKFLOW} replace />} />
        <Route path={ROUTES.WORKFLOW} element={<WorkflowBuilder />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path="/dashboard/:plant" element={<DashboardContent />} />
        <Route
          path="/dashboard/:plant/:template"
          element={<DashboardContent />}
        />
        <Route
          path="/dashboard/:plant/:template/:itemId"
          element={<DashboardContent />}
        />
        <Route path={ROUTES.LOOP_CONFIGURATION} element={<KpiLoop />} />
      </Route>
    </Routes>
  );
}
