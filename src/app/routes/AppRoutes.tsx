import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import { ROUTES } from "../../constants/routes/routesConstant";
import WorkflowBuilder from "../../pages/workflow/WorkflowBuilder";
import Dashboard from "../../pages/dashboard/Dashboard";
import DashboardContent from "../../pages/dashboard/DashboardContent";
import DataSourcePreview from "../../components/dataSource/DataSourcePreview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
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
      </Route>
      <Route path="/data-source-preview" element={<DataSourcePreview />} />
    </Routes>
  );
}
