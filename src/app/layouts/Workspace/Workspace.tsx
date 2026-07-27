import { Outlet } from "react-router-dom";
import WorkspaceHeader from "../../../components/common/header/WorkspaceHeader";
import LeftPanel from "../../../components/common/leftPanel/LeftPanel";

export default function Workspace() {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      <WorkspaceHeader />

      <div className="flex flex-1 gap-2 overflow-hidden">
        <LeftPanel />

        <main className="relative flex-1 overflow-hidden rounded-md bg-[#2b2b2b]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
