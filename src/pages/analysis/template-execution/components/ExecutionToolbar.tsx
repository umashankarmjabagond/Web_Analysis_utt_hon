import { Monitor, Pen, TextAlignJustify, Trash2, Workflow } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Badge from "../../../../components/common/badge/Badge";
import Button from "../../../../components/forms/button/Button";
import { ROUTES } from "../../../../constants/routes/routesConstant";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import {
  EXECUTION_ACTION,
  EXECUTION_VIEW_MODE,
} from "../../../../types/templateExecution";
import { cn } from "../../../../utils/utils";
import Tooltip from "../../../../components/common/tooltip/Tooltip";

const VIEW_MODES = [
  {
    id: EXECUTION_VIEW_MODE.COMPACT,
    icon: TextAlignJustify,
    tooltipKey: "EXECUTION_TOOLBAR_COMPACT_VIEW",
  },
  {
    id: EXECUTION_VIEW_MODE.COMFORTABLE,
    icon: Workflow,
    tooltipKey: "EXECUTION_TOOLBAR_COMFORTABLE_VIEW",
  },
] as const;

export default function FlowExecutionToolbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectedExecutionItem = useTemplateExecutionStore(
    (state) => state.selectedExecutionItem,
  );
  const setExecutionAction = useTemplateExecutionStore(
    (state) => state.setExecutionAction,
  );

  const executionViewMode = useTemplateExecutionStore(
    (state) => state.executionViewMode,
  );
  const setExecutionViewMode = useTemplateExecutionStore(
    (state) => state.setExecutionViewMode,
  );

  const selectedRowsCount = useTemplateExecutionStore(
    (state) => state.selectedRowIds.length,
  );

  const name = selectedExecutionItem?.name;
  const type = selectedExecutionItem?.type;

  const executeLabel =
    Number(selectedRowsCount) > 0
      ? `${t("EXECUTION_EXECUTE_SELECTED")} (${selectedRowsCount})`
      : t("EXECUTION_EXECUTE");

  const pauseLabel =
    Number(selectedRowsCount) > 0
      ? `${t("EXECUTION_PAUSE_SELECTED")} (${selectedRowsCount})`
      : t("EXECUTION_PAUSE");

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

  const handleEdit = () => {
    //  To do Edit Implementation
    confirm(t("EXECUTION_EDIT_CONFIRMATION"));
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
    <div className="flex h-12 items-center justify-between gap-3 border-b border-[#454545] bg-[#1B1B1B] px-5">
      <div className="flex shrink-0 items-center gap-3">
        <h1 className="text-[20px] font-extrabold leading-[30px] text-[#F0F0F0]">
          {name}
        </h1>

        {type && (
          <Badge
            variant="info"
            fill="outline"
            className="rounded-2xl border-[#4FB3FF66] bg-[#4FB3FF26] px-2 py-0.5"
          >
            {type.toUpperCase()}
          </Badge>
        )}

        <div className="h-6 w-px bg-[#454545]" />

        <Button
          variant="primary"
          size="medium"
          className="h-8 rounded-[6px] bg-[#64C3FF] px-6 font-bold text-[14px] leading-5 text-[#303030]"
          onClick={handleExecute}
        >
          {executeLabel}
        </Button>

        <Button
          variant="secondary"
          fill="solid"
          size="medium"
          className="h-8 rounded-[6px] border border-[#808080] bg-[#404040] px-6 font-bold text-[14px] leading-5 text-[#F0F0F0]"
          onClick={handlePause}
        >
          {pauseLabel}
        </Button>

        <Tooltip
          content={t("EXECUTION_TOOLBAR_EDIT")}
          className="h-7 px-2 text-xs font-normal"
        >
          <Button
            variant="secondary"
            fill="solid"
            size="medium"
            iconOnly
            icon={<Pen size={14} />}
            className="h-8 w-8 shrink-0 rounded-[6px] border border-[#8C8C8C] bg-[#404040] p-0"
            onClick={handleEdit}
            aria-label="Edit"
          />
        </Tooltip>

        <Tooltip
          content={t("EXECUTION_TOOLBAR_DELETE")}
          className="h-7 px-2 text-xs font-normal"
        >
          <Button
            variant="secondary"
            fill="solid"
            size="medium"
            iconOnly
            icon={<Trash2 size={14} />}
            className="h-8 w-8 shrink-0 rounded-[6px] border border-[#8C8C8C] bg-[#404040] p-0"
            onClick={handleDelete}
            aria-label="Delete"
          />
        </Tooltip>
      </div>

      <div className="flex h-[34px]  shrink-0 items-center gap-3">
        <div className="flex h-[34px] w-[62px] items-center rounded-[6px] border border-[#454545] p-0.5">
          {VIEW_MODES.map(({ id, icon: Icon, tooltipKey }) => (
            <Tooltip key={id} content={t(tooltipKey)}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setExecutionViewMode(id)}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-[4px] cursor-pointer border-0",
                  executionViewMode === id
                    ? "bg-[#383838] text-[#F0F0F0]"
                    : "bg-[#1B1B1B] text-[#B0B0B0]",
                )}
                aria-label={t(tooltipKey)}
                aria-pressed={executionViewMode === id}
              >
                <Icon size={14} />
              </Button>
            </Tooltip>
          ))}
        </div>

        <div className="h-6 w-px bg-[#454545]" />

        <Button
          variant="secondary"
          fill="outline"
          icon={<Monitor size={16} />}
          className="h-8 rounded-[6px] border-0 bg-transparent px-6 font-bold text-[14px] leading-5 text-[#64C3FF] hover:bg-transparent"
          onClick={() => navigate(ROUTES.WORKFLOW)}
        >
          {t("EXECUTION_TOOLBAR_ANALYSIS_TEMPLATES")}
        </Button>
      </div>
    </div>
  );
}
