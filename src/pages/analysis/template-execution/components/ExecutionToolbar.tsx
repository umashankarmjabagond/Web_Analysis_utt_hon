import { CirclePause, CirclePlay, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import ToolbarExecutionButton from "./ToolbarExecutionButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes/routesConstant";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import Badge from "../../../../components/common/badge/Badge";
import { EXECUTION_ACTION } from "../../../../types/templateExecution";

export default function ExecutionToolbar() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const selectedExecutionItem = useTemplateExecutionStore(
    (state) => state.selectedExecutionItem,
  );
  const executionAction = useTemplateExecutionStore(
    (state) => state.executionAction,
  );
  const setExecutionAction = useTemplateExecutionStore(
    (state) => state.setExecutionAction,
  );

  const name = selectedExecutionItem?.name;
  const type = selectedExecutionItem?.type;

  const handleExecute = () => {
    // To do API integration
    setExecutionAction(EXECUTION_ACTION.EXECUTE);
    confirm(t("EXECUTION_START_CONFIRMATION"));
  };

  const handlePause = () => {
    // To do API integration
    setExecutionAction(EXECUTION_ACTION.PAUSE);
    confirm(t("EXECUTION_PAUSE_CONFIRMATION"));
  };

  const handleDelete = () => {
    // To do API integration
    setExecutionAction(EXECUTION_ACTION.DELETE);
    confirm(t("EXECUTION_DELETE_CONFIRMATION"));
    setTimeout(() => {
      setExecutionAction(EXECUTION_ACTION.IDLE);
    }, 1000);
  };

  return (
    <div className="absolute left-4 right-4 top-4 z-10 flex h-12 items-center justify-between rounded-[6px] border border-border-default bg-background px-4 py-2">
      <div className="flex h-7  items-center gap-4">
        <span className="text-[20px] font-extrabold text-foreground-secondary">
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
          label={t("EXECUTION_EXECUTE")}
          active={executionAction === EXECUTION_ACTION.EXECUTE}
          onClick={handleExecute}
        />
        <ToolbarExecutionButton
          icon={CirclePause}
          label={t("EXECUTION_PAUSE")}
          active={executionAction === EXECUTION_ACTION.PAUSE}
          onClick={handlePause}
        />
        <ToolbarExecutionButton
          icon={Trash}
          label={t("COMMON_DELETE")}
          active={executionAction === EXECUTION_ACTION.DELETE}
          onClick={handleDelete}
        />
      </div>

      <div className="flex h-8 items-center">
        <button
          className="h-8 w-[161px] rounded-[4px] px-4 py-1.5 text-[14px] text-foreground-accent cursor-pointer"
          onClick={() => navigate(ROUTES.WORKFLOW)}
        >
          {t("ANALYSIS_TEMPLATES")}
        </button>
      </div>
    </div>
  );
}
