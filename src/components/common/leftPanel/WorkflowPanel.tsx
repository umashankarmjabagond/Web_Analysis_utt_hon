import { useMemo, useState } from "react";

import Accordion from "../../forms/accordion/Accordion";
import TemplateCard from "../../../pages/workflow/components/TemplateCard";

import { useWorkflowStore } from "../../../store/workflowStore";
import {
  attributeSections,
  catalogSections,
  dummyWorkflows,
} from "../../../pages/workflow/workflowPanelData ";
import { fromWorkflowTemplate } from "../../../services/workflowService/workflowMapper";

type CatalogTab = "templates" | "attributes";

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");

  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);

  const panelData = useMemo(() => {
    return activeTab === "templates" ? catalogSections : attributeSections;
  }, [activeTab]);

  const handleCardClick = (item: any) => {
    if (activeTab !== "attributes") return;

    const workflow = dummyWorkflows[item.id];

    if (!workflow) return;

    setNodes(workflow.nodes);
    setEdges(workflow.edges);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold uppercase tracking-[3px] text-white">
          Catalog
        </h3>

        <div className="flex rounded-md bg-[#5A5A5A] p-1">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "templates"
                ? "bg-[#3B3B3B] text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Templates
          </button>

          <button
            onClick={() => setActiveTab("attributes")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "attributes"
                ? "bg-[#3B3B3B] text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Attributes
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <input
          placeholder="Search..."
          className="w-full rounded-md border border-neutral-600 bg-[#3B3B3B] px-3 py-2 text-sm text-white outline-none"
        />
      </div>

      {/* List */}
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
                onClick={() => handleCardClick(item)}
              />
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
