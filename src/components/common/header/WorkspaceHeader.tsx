import TopTabs from "../../../app/layouts/Workspace/TopTabs";

export default function WorkspaceHeader() {
  return (
    <div
      className="
        flex
        h-11
        w-full
        shrink-0
        items-center
        border-b-1
        border-[#454545]
        bg-[#1b1b1b]
        overflow-x-auto
      "
    >
      <TopTabs />
    </div>
  );
}
