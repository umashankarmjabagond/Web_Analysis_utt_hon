import { Outlet } from "react-router-dom";
import Header from "../../../components/common/header/Header";
import Sidebar from "../../../components/common/sidebar/Sidebar";
import LeftPanel from "../../../components/common/leftPanel/LeftPanel";

export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-[#1f1f1f]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <LeftPanel />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
