import TopTabs from "../../../app/layouts/Workspace/TopTabs";

export default function WorkspaceHeader() {
  return (
    <div
      className="
        flex
        h-14
        w-full
        shrink-0
        items-center
        border-b
        border-[#333333]
        bg-[#1b1b1b]
      "
    >
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          overflow-x-auto
        "
      >
        <TopTabs />
      </div>
    </div>
  );
}
