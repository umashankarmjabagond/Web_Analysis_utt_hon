import { useNavigate } from "react-router-dom";
import type { TreeNodeData } from "../../../types/commonTypes";
import Tree from "../tree/Tree";
import { useState } from "react";
import { Image } from "lucide-react";
import { ROUTES } from "../../../constants/routes/routesConstant";

export default function DashboardPanel() {
  const navigate = useNavigate();

  const TREE_DATA: TreeNodeData[] = [
    {
      id: "feed-water",
      label: "Feed Water",
      children: [
        {
          id: "fresh-water",
          label: "Fresh Water",
          image: <Image size={16} />,
          children: [
            {
              id: "pump-101",
              label: "Pump 101",
            },
            {
              id: "pump-102",
              label: "Pump 102",
            },
            {
              id: "compressor-101",
              label: "Compressor 101",
            },
          ],
        },
        {
          id: "raw-water",
          label: "Raw Water",
          image: <Image size={16} />,
          children: [
            {
              id: "tank-201",
              label: "Tank 201",
            },
            {
              id: "valve-202",
              label: "Valve 202",
            },
          ],
        },
      ],
    },
    {
      id: "power-boiler",
      label: "Power Boiler",
      children: [
        {
          id: "pgb1",
          label: "PBG1",
          image: <Image size={16} />,
          children: [
            {
              id: "pump-301",
              label: "Pump 301",
            },
            {
              id: "motor-302",
              label: "Motor 302",
            },
          ],
        },
        {
          id: "pgb2",
          label: "PBG2",
          image: <Image size={16} />,
          children: [
            {
              id: "56-FFC618",
              label: "56-FFC618",
            },
            {
              id: "56-FFC619",
              label: "56-FFC619",
            },

            {
              id: "56-FFC620",
              label: "56-FFC620",
            },
            {
              id: "56-FFC621",
              label: "56-FFC621",
            },

            {
              id: "56-FFC622",
              label: "56-FFC622",
            },
            {
              id: "56-FFC623",
              label: "56-FFC623",
            },

            {
              id: "56-FFC624",
              label: "56-FFC624",
            },
            {
              id: "56-FFC625",
              label: "56-FFC625",
            },
          ],
        },
      ],
    },
  ];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (nodeId: string) => {
    setSelectedId(nodeId);

    const routeSegments = findPath(TREE_DATA, nodeId);
    if (!routeSegments) return;

    const route = `${ROUTES.DASHBOARD}/${routeSegments.join("/")}`;
    navigate(route);
  };

  return (
    <Tree nodes={TREE_DATA} selectedId={selectedId} onSelect={handleSelect} />
  );
}

const findPath = (
  nodes: TreeNodeData[],
  targetId: string,
  currentPath: string[] = [],
): string[] | null => {
  for (const node of nodes) {
    const accumulatedPath = [...currentPath, node.id];

    if (node.id === targetId) {
      return accumulatedPath;
    }

    if (node.children?.length) {
      const result = findPath(node.children, targetId, accumulatedPath);

      if (result) {
        return result;
      }
    }
  }

  return null;
};
