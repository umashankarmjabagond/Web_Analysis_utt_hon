import Header from "../../../components/common/header/Header";
import Sidebar from "../../../components/common/sidebar/Sidebar";
import Workspace from "../Workspace/Workspace";

export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-[#1f1f1f]">
      <Header />

      <div className="flex flex-1 gap-2 overflow-hidden p-2">
        <Sidebar />

        <Workspace />
      </div>
    </div>
  );
}
