import { useMemo, useState } from "react";

import Accordion from "../../forms/accordion/Accordion";
import TemplateCard from "../../../pages/workflow/components/TemplateCard";

import { useWorkflowStore } from "../../../store/workflowStore";

import type { WorkflowListItem } from "../../../types/workFlowTypes";
import {
  attributeSections,
  catalogSections,
  dummyWorkflows,
} from "../../../pages/workflow/workflowPanelData ";
import { backendToFlow } from "../../../utils/utils";

type CatalogTab = "templates" | "attributes";

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");

  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);

  const panelData = useMemo(() => {
    return activeTab === "templates" ? catalogSections : attributeSections;
  }, [activeTab]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    item: WorkflowListItem,
  ) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(item));

    event.dataTransfer.effectAllowed = "move";
  };

  const handleCardClick = (item: WorkflowListItem) => {
    const backendWorkflow = dummyWorkflows[item.id];

    if (!backendWorkflow) return;

    const canvasWorkflow = backendToFlow(backendWorkflow);

    setNodes(canvasWorkflow.nodes);
    setEdges(canvasWorkflow.edges);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[3px] text-white">
          Catalog
        </h3>

        <div className="flex rounded-md bg-[#5A5A5A] p-1">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "templates"
                ? "bg-[#3B3B3B] text-white"
                : "text-gray-300"
            }`}
          >
            Templates
          </button>

          <button
            onClick={() => setActiveTab("attributes")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "attributes"
                ? "bg-[#3B3B3B] text-white"
                : "text-gray-300"
            }`}
          >
            Attributes
          </button>
        </div>
      </div>

      <div className="px-4">
        <input
          placeholder="Search..."
          className="w-full rounded-md border border-neutral-600 bg-[#3B3B3B] px-3 py-2 text-sm text-white outline-none"
        />
      </div>

      <div className="mt-4 flex-1 space-y-4 overflow-auto px-4 pb-4">
        {panelData.map((section) => (
          <Accordion
            key={section.title}
            title={section.title}
            count={section.items.length}
          >
            {section.items.map((item) => (
              <TemplateCard
                key={item.id}
                title={item.title}
                draggable={activeTab === "templates"}
                onDragStart={
                  activeTab === "templates"
                    ? (event) => handleDragStart(event, item)
                    : undefined
                }
                onClick={
                  activeTab === "attributes"
                    ? () => handleCardClick(item)
                    : undefined
                }
              />
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
