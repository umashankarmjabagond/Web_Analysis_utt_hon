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
import Input from "../../forms/input/Input";

type CatalogTab = "templates" | "attributes";

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");
  const [search, setSearch] = useState("");

  const panelData = useMemo(
    () =>
      activeTab === "templates" ? catalogSections : attributeCatalogSections,
    [activeTab],
  );

  const filteredPanelData = useMemo(() => {
    if (!search.trim()) return panelData;

    const query = search.toLowerCase();

    return panelData
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(query),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [panelData, search]);

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
        <Input
          className="w-[288px] h-8 rounded-[4px] px-8 bg-app-surface border border-app-default-border-strong text-[14px] text-text-secondary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          startAdornment={
            <Search size={16} strokeWidth={2.5} color="#D0D0D0" />
          }
        />
      </div>

      {/* Sections */}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-5">
        {filteredPanelData.map((section) => (
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
