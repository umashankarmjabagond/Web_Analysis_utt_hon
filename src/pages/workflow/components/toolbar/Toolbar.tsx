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
        ? "Saved as Regulatory Template"
        : "Saved as MPC Template",
    );

    setNotificationMessage(
      templateType === "regulatory"
        ? "You can find this template in the Catalog under Templates > Regulatory Templates."
        : "You can find this template in the Catalog under Templates > MPC Templates.",
    );

    setShowNotification(true);
    clearWorkflow();

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-12 items-center rounded-[6px] border border-app-divider bg-component-toolbar-background px-1 lg: justify-between">
      {/* LEFT */}

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1[141px pr-1 text-xs text-white md:px] md:text-sm md:pr-4">
          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            size={16}
          />
          <span>New Template</span>
        </div>

        <ToolbarButton
          title="Pointer"
          active={activeTool === "pointer"}
          icon={<MousePointer2 size={15} />}
          onClick={() => setActiveTool("pointer")}
        />

        <ToolbarButton title="Connector 1" icon={<MoveRight size={15} />} />

        <ToolbarButton
          title="Connector 2"
          active={activeTool === "connect"}
          icon={<GitBranch size={15} />}
          onClick={() => setActiveTool("connect")}
        />

        <div className="relative lg:hidden">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex items-center gap-1 rounded border border-app-divider px-1 py-1 text-xs text-white"
          >
            More
            <ChevronDown size={14} />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 flex flex-col rounded-md border border-app-divider bg-component-toolbar-background shadow-lg">
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

        <div className="relative lg:hidden">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="flex items-center gap-1 rounded border border-app-divider px-1 py-1 text-xs text-white"
          >
            Actions
            <ChevronDown size={14} />
          </button>

          {showActionMenu && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-md border border-app-divider bg-component-toolbar-background shadow-lg">
              <button className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-app-surface">
                Import Template
              </button>

              <button className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-app-surface">
                Export Template
              </button>

              <div className="border-t border-app-divider p-2">
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
                  onSelect={(item) => {
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
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <ToolbarButton title="Pencil" icon={<Pencil size={15} />} />

          <ToolbarButton title="Grid" icon={<Grid2X2 size={15} />} />

          <ToolbarButton
            title="Undo"
            icon={<Undo2 size={15} />}
            onClick={undo}
          />

          <ToolbarButton
            title="Redo"
            icon={<Redo2 size={15} />}
            onClick={redo}
          />

          <ToolbarButton
            title="Delete"
            icon={<Circle size={15} />}
            onClick={() => {
              deleteSelectedEdges();
              deleteSelectedNodes();
            }}
          />

          <ToolbarButton title="Rectangle" icon={<Square size={15} />} />

          <ToolbarButton title="Text" icon={<Type size={15} />} />
        </div>
      </div>

      {/* RIGHT */}

      {/* RIGHT DESKTOP */}

      <div className="hidden lg:flex items-center gap-6 text-sm">
        <button className="flex items-center gap-1 text-app-action-primary text-sm hover:text-white transition-colors">
          <Upload size={15} />
          Import Template
        </button>

        <button className="flex items-center gap-1 text-app-default-border text-sm hover:text-white transition-colors">
          <Download size={15} />
          Export Template
        </button>

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
          onSelect={(item) => {
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
          }}
        />
      </div>

      <Dialog
        isOpen={isSaveDialogOpen}
        subtitle="SAVE AS"
        title={
          templateType === "regulatory" ? "Regulatory Template" : "MPC Template"
        }
        onClose={() => setIsSaveDialogOpen(false)}
      >
        <div className="flex flex-col gap-6 text-sm">
          <Input
            className="w-[288px] h-8 rounded bg-app-surface border border-search-border text-[14px] text-white"
            label="Template Name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="add template name"
          />

          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button variant="primary" onClick={handleSave}>
              Save
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
