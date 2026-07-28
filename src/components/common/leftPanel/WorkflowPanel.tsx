import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import Accordion from "../../forms/accordion/Accordion";
import TemplateCard from "../../../pages/workflow/components/TemplateCard";

import type {
  WorkflowDragItem,
  WorkflowListItem,
} from "../../../types/workFlowTypes";
import {
  attributeCatalogSections,
  catalogSections,
} from "../../../pages/workflow/workflowPanelData ";

type CatalogTab = "templates" | "attributes";

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");

  const panelData = useMemo(
    () =>
      activeTab === "templates" ? catalogSections : attributeCatalogSections,
    [activeTab],
  );

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    item: WorkflowListItem,
  ) => {
    const dragItem: WorkflowDragItem = {
      type: activeTab === "templates" ? "template" : "attribute",
      item,
    };

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(dragItem),
    );

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex h-full flex-col bg-[#2B2B2B]">
      {/* Header */}
      <div>
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[2.5px] text-[#F5F5F5]">
          Catalog
        </h3>

        {/* Tabs */}
        <div className="flex rounded bg-[#5A5A5A] p-0.5">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 rounded px-3 py-1.5 text-[13px] font-medium transition ${
              activeTab === "templates"
                ? "bg-[#3F3F3F] text-white shadow"
                : "text-[#D0D0D0]"
            }`}
          >
            Templates
          </button>

          <button
            onClick={() => setActiveTab("attributes")}
            className={`flex-1 rounded px-3 py-1.5 text-[13px] font-medium transition ${
              activeTab === "attributes"
                ? "bg-[#3F3F3F] text-white shadow"
                : "text-[#D0D0D0]"
            }`}
          >
            Attributes
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <div className="flex h-9 items-center rounded border border-[#6B6B6B] bg-[#2F2F2F] px-3">
          <Search size={14} className="mr-2 text-[#B5B5B5]" />

          <input
            placeholder="Search..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#A8A8A8] outline-none"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-5">
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
                draggable
                onDragStart={(event) => handleDragStart(event, item)}
              />
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
