import TemplateCard from "../../../pages/workflow/components/TemplateCard";
import { catalogSections } from "../../../pages/workflow/workflowPanelData ";
import Accordion from "../../forms/accordion/Accordion";

export default function WorkflowPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <input
          placeholder="Search..."
          className="w-full rounded-md border border-neutral-600 bg-[#3B3B3B] px-3 py-2 text-sm text-white outline-none"
        />
      </div>

      <div className="flex-1 space-y-4 overflow-auto px-4 pb-4">
        {catalogSections.map((section) => (
          <Accordion
            key={section.title}
            title={section.title}
            count={section.items.length}
          >
            {section.items.map((item) => (
              <TemplateCard key={item.id} title={item.title} />
            ))}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
