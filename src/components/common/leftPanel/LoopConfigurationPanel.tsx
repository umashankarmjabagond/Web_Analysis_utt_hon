import { useState } from "react";

import Breadcrumb from "../../forms/breadcrumb/Breadcrumb";

import type { BreadcrumbItem } from "../../../types/commonTypes";

export default function LoopConfigurationPanel() {
  const [breadcrumbItems] = useState<BreadcrumbItem[]>([
    {
      id: "home",
      label: "Home",
      icon: "School",
    },
  ]);

  const handleBreadcrumbClick = (
    item: BreadcrumbItem,
  ) => {
    console.log("Breadcrumb clicked:", item);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-neutral-700 p-4">
        <Breadcrumb
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>
    </div>
  );
}