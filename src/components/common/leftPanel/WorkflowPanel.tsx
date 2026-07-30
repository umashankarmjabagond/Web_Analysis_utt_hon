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
    <div className="flex h-full flex-col bg-app-code-background">
      {/* Header */}
      <div>
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[2.5px] text-button-secondary">
          Catalog
        </h3>

        {/* Tabs */}
        <div className="flex w-[193px] h-7 rounded-[4px] p-[2px] gap-1 bg-[#505050] shadow-[inset_1px_1px_1px_0px_rgba(0,0,0,0.15)]">
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 w-[94px] h-6 rounded-[3px]  border px-3 py-[2px] gap-[10px] text-[13px] font-medium transition ${
              activeTab === "templates"
                ? "bg-button-text-primary border-component-segmented-control-selected-border box-shadow: 1px 1px 1px 0px #00000026 text-white shadow"
                : "text-app-text-secondary border-transparent"
            }`}
          >
            Templates
          </button>

          <button
            onClick={() => setActiveTab("attributes")}
            className={`flex-1 w-[94px] h-6 rounded-[3px] border rounded px-3 py-[2px] gap-[10px] text-[13px] font-medium transition ${
              activeTab === "attributes"
                ? "bg-button-text-primary border-component-segmented-control-selected-border box-shadow: 1px 1px 1px 0px #00000026 text-white shadow"
                : "text-app-text-secondary border-transparent"
            }`}
          >
            Attributes
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <div className="flex w-[288px] h-8 items-center rounded border border-search-border bg-search-background px-3">
          <Search size={16} className="mr-1 text-search-icon" />

          <input
            placeholder="Search..."
            className="flex-1 bg-transparent font-medium italic leading-5 tracking-normal text-[14px] text-white placeholder:text-search-placeholder outline-none"
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
