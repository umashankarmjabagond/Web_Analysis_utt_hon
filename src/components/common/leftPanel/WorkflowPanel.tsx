import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function WorkflowPanel() {
  const [activeTab, setActiveTab] = useState<CatalogTab>("templates");
  const [search, setSearch] = useState("");

  const { t } = useTranslation();

  const TABS = [
    { id: "templates", label: t("WORKFLOW_TEMPLATES") },
    { id: "attributes", label: t("WORKFLOW_ATTRIBUTES") },
  ] as const;

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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div>
        <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[2.5px] text-foreground-secondary">
          {t("WORKFLOW_CATALOG")}
        </h3>

        {/* Tabs */}
        <div className="flex h-[34px] w-full gap-1 rounded-[4px] p-[2px] shadow-segmented-tab-container border border-[#454545]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-6 flex-1 rounded-[3px] border px-3 py-[2px] text-[13px] font-medium  cursor-pointer",
                activeTab === tab.id
                  ? "h-full bg-tab-active-box text-segmented-tab-active-foreground border-none"
                  : "h-full border-none text-segmented-tab-foreground hover:bg-segmented-tab-hover-background hover:text-segmented-tab-hover-foreground",
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
          className="w-[288px] px-8 border border-[#2E2E2E] h-[32px] bg-[#2E2E2E]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("COMMON_SEARCH")}
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
