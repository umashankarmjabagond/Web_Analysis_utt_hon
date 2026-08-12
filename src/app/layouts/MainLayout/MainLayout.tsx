import Header from "../../../components/common/header/Header";
import Sidebar from "../../../components/common/sidebar/Sidebar";
import Workspace from "../Workspace/Workspace";

export default function MainLayout() {
  return (
    <div className="flex h-screen flex-col bg-app-background">
      <Header />

      <div
        className="flex flex-1 gap-2 overflow-hidden pt-2 pr-2 py-2"
        // style={{ border: "5px solid red" }}
      >
        <Sidebar />

        <Workspace />
      </div>
    </div>
  );
}
