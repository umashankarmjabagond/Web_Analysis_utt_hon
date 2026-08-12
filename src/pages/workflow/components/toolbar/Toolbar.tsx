import {
  ArrowLeft,
  MousePointer2,
  GitBranch,
  Pencil,
  Grid2X2,
  Undo2,
  Redo2,
  Circle,
  Square,
  Type,
  Download,
  Upload,
  MoveRight,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ToolbarButton from "./ToolbarButton";
import { useWorkflowStore } from "../../../../store/workflowStore";
import Dropdown from "../../../../components/forms/dropdown/Dropdown";
import { useState } from "react";
import Dialog from "../../../../components/common/dialogue/Dialog";
import Input from "../../../../components/forms/input/Input";
import Button from "../../../../components/forms/button/Button";
import Notification from "../../../../components/common/notification/Notification";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes/routesConstant";

export default function Toolbar() {
  const { t } = useTranslation();
  const {
    nodes,
    activeTool,
    setActiveTool,
    deleteSelectedNodes,
    deleteSelectedEdges,
    undo,
    redo,
    clearWorkflow,
  } = useWorkflowStore();

  const navigate = useNavigate();

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<
    "success" | "warning"
  >("success");

  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [templateType, setTemplateType] = useState<"regulatory" | "mpc" | null>(
    null,
  );

  const [templateName, setTemplateName] = useState("");

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

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

    console.log("Saved Template:", newTemplate);

    setIsSaveDialogOpen(false);
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
    clearWorkflow();

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-12 items-center rounded-[6px] border border-app-divider bg-component-toolbar-background px-1 xl: justify-between">
      {/* LEFT */}

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1[141px pr-1 text-xs text-white md:px] md:text-sm md:pr-4">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            size={16}
          />
          <span>{t("NEW_TEMPLATE")}</span>
        </div>

        <ToolbarButton
          title={t("TOOLBAR_POINTER")}
          active={activeTool === "pointer"}
          icon={MousePointer2}
          onClick={() => setActiveTool("pointer")}
        />

        <ToolbarButton title={t("TOOLBAR_CONNECTOR_1")} icon={MoveRight} />

        <ToolbarButton
          title={t("TOOLBAR_CONNECTOR_2")}
          active={activeTool === "connect"}
          icon={GitBranch}
          onClick={() => setActiveTool("connect")}
        />

        <div className="relative xl:hidden">
          <button
            onClick={() => {
              setShowMoreMenu((prev) => !prev);
              setShowActionMenu(false);
            }}
            className="flex items-center gap-1 rounded border border-app-divider px-1 py-1 text-xs text-white"
          >
            {t("TOOLBAR_MORE")}
            <ChevronDown size={14} />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 flex flex-col rounded-md border border-app-divider bg-component-toolbar-background shadow-xl">
              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white">
                <Pencil size={14} />
              </button>

              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white">
                <Grid2X2 size={14} />
              </button>

              <button
                onClick={undo}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white"
              >
                <Undo2 size={14} />
              </button>

              <button
                onClick={redo}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white"
              >
                <Redo2 size={14} />
              </button>

              <button
                onClick={() => {
                  deleteSelectedEdges();
                  deleteSelectedNodes();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white"
              >
                <Circle size={14} />
              </button>

              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white">
                <Square size={14} />
              </button>

              <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white">
                <Type size={14} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT TABLET */}

        <div className="relative xl:hidden">
          <button
            onClick={() => {
              setShowActionMenu((prev) => !prev);
              setShowMoreMenu(false);
            }}
            className="flex items-center gap-1 rounded border border-app-divider px-1 py-1 text-xs text-white"
          >
            {t("TOOLBAR_ACTIONS")}
            <ChevronDown size={14} />
          </button>

          {showActionMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-app-divider bg-component-toolbar-background shadow-xl">
              <button className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-app-surface">
                {t("TOOLBAR_IMPORT_TEMPLATE")}
              </button>

              <button className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-app-surface">
                {t("TOOLBAR_EXPORT_TEMPLATE")}
              </button>

              <div className="border-t border-app-divider p-2">
                <Dropdown
                  placeholder={t("TOOLBAR_SAVE_AS")}
                  items={[
                    {
                      label: t("TOOLBAR_CUSTOM_REGULATORY_TEMPLATE"),
                      value: "regulatory",
                    },
                    {
                      label: t("TOOLBAR_CUSTOM_MPC_TEMPLATES"),
                      value: "mpc",
                    },
                  ]}
                  onSelect={(item) => {
                    if (nodes.length === 0) {
                      setNotificationType("warning");
                      setNotificationTitle(t("TOOLBAR_NOTHING_TO_SAVE"));
                      setNotificationMessage(
                        t("TOOLBAR_CREATE_WORKFLOW_FIRST"),
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
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2">
          <ToolbarButton title={t("TOOLBAR_PENCIL")} icon={Pencil} />

          <ToolbarButton title={t("TOOLBAR_GRID")} icon={Grid2X2} />

          <ToolbarButton
            title={t("TOOLBAR_UNDO")}
            icon={Undo2}
            onClick={undo}
          />

          <ToolbarButton
            title={t("TOOLBAR_REDO")}
            icon={Redo2}
            onClick={redo}
          />

          <ToolbarButton
            title={t("COMMON_DELETE")}
            icon={Circle}
            onClick={() => {
              deleteSelectedEdges();
              deleteSelectedNodes();
            }}
          />

          <ToolbarButton title={t("TOOLBAR_RECTANGLE")} icon={Square} />

          <ToolbarButton title={t("TOOLBAR_TEXT")} icon={Type} />
        </div>
      </div>

      {/* RIGHT */}

      {/* RIGHT DESKTOP */}

      <div className="hidden xl:flex items-center gap-6 text-sm">
        <button className="flex items-center gap-1 text-app-action-primary text-sm hover:text-white transition-colors">
          <Upload size={15} />
          {t("TOOLBAR_IMPORT_TEMPLATE")}
        </button>

        <button className="flex items-center gap-1 text-app-default-border text-sm hover:text-white transition-colors">
          <Download size={15} />
          {t("TOOLBAR_EXPORT_TEMPLATE")}
        </button>

        <Dropdown
          placeholder={t("TOOLBAR_SAVE_AS")}
          items={[
            {
              label: t("TOOLBAR_CUSTOM_REGULATORY_TEMPLATE"),
              value: "regulatory",
            },
            {
              label: t("TOOLBAR_CUSTOM_MPC_TEMPLATES"),
              value: "mpc",
            },
          ]}
          onSelect={(item) => {
            if (nodes.length === 0) {
              setNotificationType("warning");
              setNotificationTitle(t("TOOLBAR_NOTHING_TO_SAVE"));
              setNotificationMessage(t("TOOLBAR_CREATE_WORKFLOW_BEFORE_SAVE"));

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
          }}
        />
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
      >
        <div className="flex flex-col gap-6 text-sm">
          <Input
            className="w-[288px] h-8 rounded bg-app-surface border border-search-border text-[14px] text-white"
            label={t("TOOLBAR_TEMPLATE_NAME")}
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={t("TOOLBAR_ADD_TEMPLATE_NAME")}
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
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
        <div className="fixed right-6 top-20 z-[9999]">
          <Notification
            type={notificationType}
            title={notificationTitle}
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
    </div>
  );
}
