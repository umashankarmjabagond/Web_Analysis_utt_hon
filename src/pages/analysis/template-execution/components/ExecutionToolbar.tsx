import { CirclePause, CirclePlay, Trash } from "lucide-react";
import ToolbarExecutionButton from "./ToolbarExecutionButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes/routesConstant";

export default function ExecutionToolbar() {
  const navigate = useNavigate();
  return (
    <div className="absolute left-4 right-4 top-4 z-10 flex h-12 items-center justify-between rounded-[6px] border border-app-divider bg-app-primary px-4 py-2">
      <div className="flex h-7  items-center gap-4">
        <span className="text-[20px] font-extrabold text-app-text-secondary">
          PGB2
        </span>

        {/* <Badge label="UNIT" variant="unit" /> */}
        {/* TODO - Reusable */}
        <span className="text-app-text-secondary border px-2 rounded-full">
          Badge - Unit
        </span>
      </div>

      <div className="flex h-8 w-[300px] items-center gap-2">
        <ToolbarExecutionButton icon={CirclePlay} label="Execute" active />
        <ToolbarExecutionButton icon={CirclePause} label="Pause" />
        <ToolbarExecutionButton icon={Trash} label="Delete" />
      </div>

      <div className="flex h-8 items-center">
        <button
          className="h-8 w-[161px] rounded-[4px] px-4 py-1.5 text-[14px] text-app-action-primary cursor-pointer"
          onClick={() => navigate(ROUTES.WORKFLOW)}
        >
          Analysis Templates
        </button>
      </div>
    </div>
  );
}
