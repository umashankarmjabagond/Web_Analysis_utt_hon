import { useState } from "react";

import Breadcrumb from "../../forms/breadcrumb/Breadcrumb";
import Tree from "../tree/Tree";

import type {
  BreadcrumbItem,
  TreeNodeData,
} from "../../../types/commonTypes";

const loopHierarchy: TreeNodeData[] = [
  {
    id: "home",
    label: "Home",
    image: "School",
    children: [
      {
        id: "top-river",
        label: "Top River",
        image: "Hospital",
        children: [
          {
            id: "pulp-mill",
            label: "Pulp Mill",
            image: "Building2",
            children: [
              {
                id: "chemical-preparation",
                label: "Chemical Preparation",
                image: "BookA",
                children: [
                  {
                    id: "tank-area",
                    label: "Tank Area",
                    image: "FolderTree",
                  },
                  {
                    id: "pump-house",
                    label: "Pump House",
                    image: "Factory",
                  },
                  {
                    id: "water-treatment",
                    label: "Water Treatment",
                    image: "Droplets",
                  },
                ],
              },
              {
                id: "recovery-boiler",
                label: "Recovery Boiler",
                image: "SquareDashedKanban",
              },
              {
                id: "steam-unit",
                label: "Steam Unit",
                image: "WavesVertical",
              },
            ],
          },
        ],
      },
      {
        id: "site-a",
        label: "Site A",
        image: "Building",
      },
      {
        id: "site-b",
        label: "Site B",
        image: "House",
      },
    ],
  },
];

function findPath(
  nodes: TreeNodeData[],
  targetId: string,
  path: TreeNodeData[] = [],
): TreeNodeData[] | null {
  for (const node of nodes) {
    const currentPath = [...path, node];

    if (node.id === targetId) {
      return currentPath;
    }

    if (node.children) {
      const result = findPath(
        node.children,
        targetId,
        currentPath,
      );

      if (result) {
        return result;
      }
    }
  }

  return null;
}

export default function LoopConfigurationPanel() {
  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [breadcrumbItems, setBreadcrumbItems] =
    useState<BreadcrumbItem[]>([
      {
        id: "home",
        label: "Home",
        image: "School",
      },
    ]);

  const handleTreeSelect = (id: string) => {
    setSelectedId(id);

    const path = findPath(loopHierarchy, id);

    if (!path) {
      return;
    }

    const breadcrumbPath: BreadcrumbItem[] =
      path.map((node) => ({
        id: node.id,
        label: node.label,
        image: node.image,
      }));

    setBreadcrumbItems(breadcrumbPath);
  };

  const handleBreadcrumbClick = (
    item: BreadcrumbItem,
  ) => {
    handleTreeSelect(item.id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-neutral-700 p-4">
        <Breadcrumb
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      <div className="p-4 text-white">
        <Tree
          nodes={loopHierarchy}
          selectedId={selectedId}
          onSelect={handleTreeSelect}
        />
      </div>
    </div>
  );
}