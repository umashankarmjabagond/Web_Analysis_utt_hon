import {
  Position,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";
import type {
  EdgePathResult,
  EdgePathType,
  HandleCoordinates,
  PathBounds,
} from "../../../../types/templateExecution";

type GetHandleCoordinatesParams = {
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeIconHeight: number;
  handleId: string | null | undefined;
};

type GetEdgePathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

// Handles in BaseNode are attached to the icon box only (not the label
// below it), so this must be called with icon height, not full node height.
export const getHandleCoordinates = ({
  nodeX,
  nodeY,
  nodeWidth,
  nodeIconHeight,
  handleId,
}: GetHandleCoordinatesParams): HandleCoordinates => {
  switch (handleId) {
    case "top":
      return {
        x: nodeX + nodeWidth / 2,
        y: nodeY,
        position: Position.Top,
      };
    case "bottom":
      return {
        x: nodeX + nodeWidth / 2,
        y: nodeY + nodeIconHeight,
        position: Position.Bottom,
      };
    case "left":
      return {
        x: nodeX,
        y: nodeY + nodeIconHeight / 2,
        position: Position.Left,
      };
    case "right":
    default:
      return {
        x: nodeX + nodeWidth,
        y: nodeY + nodeIconHeight / 2,
        position: Position.Right,
      };
  }
};

// Same routing functions ExecuctionWorkflowEdge uses to draw the edge.
// Reusing this here guarantees layout and rendering never drift apart.
export const getPathFn = (pathType: EdgePathType) => {
  switch (pathType) {
    case "smoothstep":
      return getSmoothStepPath;
    case "straight":
      return getStraightPath;
    case "bezier":
    default:
      return getBezierPath;
  }
};

export const getEdgePath = (
  pathType: EdgePathType,
  params: GetEdgePathParams,
): EdgePathResult => {
  const [path, labelX, labelY, offsetX, offsetY] = getPathFn(pathType)(params);

  return { path, labelX, labelY, offsetX, offsetY };
};

// Renders the path in a detached, invisible SVG element to read its real
// geometry via getBBox(). This is a synchronous, in-memory operation —
// nothing here is attached to the visible UI or waits for a real paint.
export const measurePathBounds = (path: string): PathBounds => {
  const svgNamespace = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNamespace, "svg");
  svg.style.position = "absolute";
  svg.style.width = "0";
  svg.style.height = "0";
  svg.style.overflow = "hidden";
  svg.style.visibility = "hidden";

  const pathElement = document.createElementNS(svgNamespace, "path");
  pathElement.setAttribute("d", path);
  svg.appendChild(pathElement);

  document.body.appendChild(svg);
  const bbox = pathElement.getBBox();
  document.body.removeChild(svg);

  return {
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
  };
};
