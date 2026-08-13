import Header from "../../../components/common/header/Header";
import Sidebar from "../../../components/common/sidebar/Sidebar";
import Workspace from "../Workspace/Workspace";

export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-app-background">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <Workspace />
      </div>
    </div>
  );
}
