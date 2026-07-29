import { CirclePause, CirclePlay, Trash } from "lucide-react";
import ToolbarExecutionButton from "./ToolbarExecutionButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes/routesConstant";
import {
  EXECUTION_STATUS,
  useTemplateExecutionStore,
} from "../../../../store/templateExecutionStore";
import Badge from "../../../../components/common/badge/Badge";

export default function ExecutionToolbar() {
  const navigate = useNavigate();
  const selectedExecutionItem = useTemplateExecutionStore(
    (state) => state.selectedExecutionItem,
  );
  const executionStatus = useTemplateExecutionStore(
    (state) => state.executionStatus,
  );
  const setExecutionStatus = useTemplateExecutionStore(
    (state) => state.setExecutionStatus,
  );

  const name = selectedExecutionItem?.name;
  const type = selectedExecutionItem?.type;

  const handleExecute = () => {
    // To do API integration
    setExecutionStatus(EXECUTION_STATUS.EXECUTE);
    alert("Start Executing ?");
  };

  const handlePause = () => {
    // To do API integration
    setExecutionStatus(EXECUTION_STATUS.PAUSE);
    alert("Pause execution ?");
  };

  const handleDelete = () => {
    // To do API integration
    setExecutionStatus(EXECUTION_STATUS.DELETE);
    alert("Delete Workflow ?");
    setTimeout(() => {
      setExecutionStatus(EXECUTION_STATUS.IDLE);
    }, 1000);
  };

  return (
    <div className="absolute left-4 right-4 top-4 z-10 flex h-12 items-center justify-between rounded-[6px] border border-app-divider bg-app-primary px-4 py-2">
      <div className="flex h-7  items-center gap-4">
        <span className="text-[20px] font-extrabold text-app-text-secondary">
          {name}
        </span>

        {type && (
          <Badge
            variant="info"
            fill="outline"
            className="h-6 px-2 py-1 gap-1 rounded-2xl text-xs"
          >
            {type.toUpperCase()}
          </Badge>
        )}
      </div>

      <div className="flex h-8 w-[300px] items-center gap-2">
        <ToolbarExecutionButton
          icon={CirclePlay}
          label="Execute"
          active={executionStatus === EXECUTION_STATUS.EXECUTE}
          onClick={handleExecute}
        />
        <ToolbarExecutionButton
          icon={CirclePause}
          label="Pause"
          active={executionStatus === EXECUTION_STATUS.PAUSE}
          onClick={handlePause}
        />
        <ToolbarExecutionButton
          icon={Trash}
          label="Delete"
          active={executionStatus === EXECUTION_STATUS.DELETE}
          onClick={handleDelete}
        />
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
