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

import { useWorkflowStore } from "../../../store/workflowStore";

type CatalogTab = "templates" | "attributes";

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");
  const [search, setSearch] = useState("");

  const { setPendingCatalogItem } = useWorkflowStore();

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

  const handleTabletClick = (item: WorkflowListItem) => {
    if (window.innerWidth < 1280) {
      setPendingCatalogItem(item);
    }
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
        <Input
          className="w-[288px] h-8 rounded px-8 bg-app-surface border border-search-border text-[14px] text-text-secondary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          startAdornment={<Search size={16} strokeWidth={2.5} />}
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
                icon={item.icon}
                draggable
                onClick={() => handleTabletClick(item)}
                onDragStart={(event) => handleDragStart(event, item)}
              />
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
