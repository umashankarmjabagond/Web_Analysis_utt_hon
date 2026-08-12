import { Outlet, useLocation } from "react-router-dom";

import WorkspaceHeader from "../../../components/common/header/WorkspaceHeader";
import LeftPanel from "../../../components/common/leftPanel/LeftPanel";
import { panelConfig } from "../../../components/common/leftPanel/panelConfig";
import Toolbar from "../../../pages/workflow/components/toolbar/Toolbar";

export default function Workspace() {
  const location = useLocation();

  const panel = panelConfig.find((item) =>
    location.pathname.startsWith(item.path),
  );

  const isWorkflowLayout = panel?.layout === "workflow";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <WorkspaceHeader />
      {isWorkflowLayout && <Toolbar />}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <LeftPanel />
        <main className="relative min-w-0 flex-1 overflow-hidden bg-[#111111]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
