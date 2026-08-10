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
import { cn } from "../../../utils/utils";

type CatalogTab = "templates" | "attributes";

const TABS = [
  { id: "templates", label: "Templates" },
  { id: "attributes", label: "Attributes" },
] as const;

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
    <div className="flex h-full flex-col bg-[#272727]">
      {/* Header */}
      <div>
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[2.5px] text-foreground-secondary">
          Catalog
        </h3>

        {/* Tabs */}
        <div className="flex h-7 w-[193px] gap-1 rounded-[4px] bg-segmented-tab-container-background p-[2px] shadow-segmented-tab-container">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-6 flex-1 rounded-[3px] border px-3 py-[2px] text-[13px] font-medium transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "border-segmented-tab-active-border bg-segmented-tab-active-background text-segmented-tab-active-foreground"
                  : "border-segmented-tab-border bg-segmented-tab-background text-segmented-tab-foreground hover:border-segmented-tab-hover-border hover:bg-segmented-tab-hover-background hover:text-segmented-tab-hover-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mt-4">
        <Input
          className="w-[288px] px-8"
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
