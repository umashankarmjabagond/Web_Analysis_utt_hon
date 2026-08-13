import {
  ChevronLeft,
  StickyNoteX,
  Download,
  Trash2,
  Upload,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToolbarButton from "./ToolbarButton";
import { useWorkflowStore } from "../../../../store/workflowStore";
import Dropdown from "../../../../components/forms/dropdown/Dropdown";
import Dialog from "../../../../components/common/dialogue/Dialog";
import Input from "../../../../components/forms/input/Input";
import Button from "../../../../components/forms/button/Button";
import Notification from "../../../../components/common/notification/Notification";
import { ROUTES } from "../../../../constants/routes/routesConstant";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../utils/utils";

export default function Toolbar() {
  const { t } = useTranslation();

  const {
    nodes,
    edges,
    deleteSelectedNodes,
    deleteSelectedEdges,
    clearWorkflow,
  } = useWorkflowStore();

  const navigate = useNavigate();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const [templateType, setTemplateType] = useState<"regulatory" | "mpc" | null>(
    null,
  );

  const [templateName, setTemplateName] = useState("");

  const [showNotification, setShowNotification] = useState(false);

  const [notificationType, setNotificationType] = useState<
    "success" | "warning"
  >("success");

  const [notificationTitle, setNotificationTitle] = useState("");

  const [notificationMessage, setNotificationMessage] = useState("");

  const handleDelete = () => {
    deleteSelectedEdges();
    deleteSelectedNodes();
  };

  const handleClear = () => {
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    clearWorkflow();
  };

  const handleSave = () => {
    const existingTemplates = JSON.parse(
      localStorage.getItem("workflowTemplates") || "[]",
    );

    const newTemplate = {
      id: crypto.randomUUID(),
      name: templateName,
      type: templateType,
      createdAt: new Date().toISOString(),
    };

    existingTemplates.push(newTemplate);

    localStorage.setItem(
      "workflowTemplates",
      JSON.stringify(existingTemplates),
    );

    // Close dialog
    setIsSaveDialogOpen(false);

    // Success notification
    setNotificationType("success");

    setNotificationTitle(
      templateType === "regulatory"
        ? t("TOOLBAR_SAVED_REGULATORY")
        : t("TOOLBAR_SAVED_MPC"),
    );

    setNotificationMessage(
      templateType === "regulatory"
        ? t("TOOLBAR_FIND_REGULATORY")
        : t("TOOLBAR_FIND_MPC"),
    );

    setShowNotification(true);

    // Clear current workflow
    clearWorkflow();

    // Hide notification
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleSaveAs = (item: { value: string; label: string }) => {
    if (nodes.length === 0) {
      setNotificationType("warning");

      setNotificationTitle("Nothing to Save");

      setNotificationMessage(
        "Please create a workflow before saving the template.",
      );

      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return;
    }

    setTemplateType(item.value as "regulatory" | "mpc");

    const templates = JSON.parse(
      localStorage.getItem("workflowTemplates") || "[]",
    );

    setTemplateName(`Custom_${templates.length + 1}`);

    setIsSaveDialogOpen(true);
  };

  return (
    <>
      <div className=" flex h-12 min-h-9 w-full items-center justify-between border-b border-[#303030] bg-surface-primary px-2        ">
        <div className="flex h-full items-center px-4">
          <div
            className="
              flex
              h-full
              items-center
              gap-1.5
              pr-3
              text-[12px]
              text-white
            "
          >
            <button
              type="button"
              aria-label="Back"
              title="Back"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="
                flex
                items-center
                justify-center
                transition-colors cursor-pointer
                hover:text-white
              "
            >
              <ChevronLeft size={14} strokeWidth={1.8} />
            </button>

            <span className="whitespace-nowrap text-[18px]">
              {t("NEW_TEMPLATE")}
            </span>
            <span className="mx-4 h-5 w-[1px] bg-[#454545]" />
          </div>
        </div>

        <div
          className="
            flex
            h-full
            items-center
            gap-1
          "
        >
          <ToolbarButton title="Delete" icon={Trash2} onClick={handleDelete} />

          <ToolbarButton
            title="Clear Workflow"
            icon={StickyNoteX}
            onClick={handleClear}
            disabled={nodes.length === 0 && edges.length === 0}
            iconClassName={
              nodes.length === 0 && edges.length === 0
                ? "text-toolbar-icon-disabled"
                : "text-white"
            }
          />

          <ToolbarButton
            title="Export Template"
            icon={Download}
            iconClassName="text-white"
          />

          <ToolbarButton
            title="Import Template"
            icon={Upload}
            iconClassName="text-white"
          />

          <div className="ml-1">
            <Dropdown
              placeholder="Save As"
              items={[
                {
                  label: "Custom Regulatory Template",
                  value: "regulatory",
                },
                {
                  label: "Custom MPC Templates",
                  value: "mpc",
                },
              ]}
              onSelect={handleSaveAs}
              menuClassName={cn(
                "w-[280px]",
                "overflow-hidden rounded-md",
                "bg-dropdown-background",
                "shadow-dropdown",
              )}
              itemClassName={cn(
                "w-full h-[40px]",
                "flex items-center",
                "px-3",
                "cursor-pointer",
                "text-dropdown-item-foreground",
                "hover:bg-surface-primary",
                "hover:text-accordion-list-count",
                "last:mb-0",
              )}
            />
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isSaveDialogOpen}
        subtitle={t("TOOLBAR_SAVE_AS")}
        title={
          templateType === "regulatory"
            ? t("TOOLBAR_REGULATORY_TEMPLATE")
            : t("TOOLBAR_MPC_TEMPLATE")
        }
        onClose={() => setIsSaveDialogOpen(false)}
        width={420}
      >
        <div
          className="w-full
            flex
            flex-col
            gap-6
            text-sm
          "
        >
          <Input
            className="
              h-8
             w-full
              rounded
              bg-app-surface
              text-[14px]
              text-white
            "
            label={t("TOOLBAR_TEMPLATE_NAME")}
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            placeholder={t("TOOLBAR_ADD_TEMPLATE_NAME")}
          />

          <div
            className="
              flex
              justify-end
              gap-4
            "
          >
            <Button
              variant="secondary"
              fill="outline"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              {t("COMMON_CANCEL")}
            </Button>

            <Button variant="primary" onClick={handleSave}>
              {t("COMMON_SAVE")}
            </Button>
          </div>
        </div>
      </Dialog>

      {showNotification && (
        <div
          className="
            fixed
            right-6
            top-20
            z-[9999]
          "
        >
          <Notification
            type={notificationType}
            title={notificationTitle}
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
    </>
  );
}
