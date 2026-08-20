import { describe, expect, it } from "vitest";
import {
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
} from "@xyflow/react";
import {
  getEdgePath,
  getHandleCoordinates,
  getPathFn,
  measurePathBounds,
} from "./edgeGeometry";
import type { EdgePathType } from "../../../../types/templateExecution";

describe("getHandleCoordinates", () => {
  const baseParams = {
    nodeX: 100,
    nodeY: 200,
    nodeWidth: 30,
    nodeIconHeight: 30,
  };

  it("returns coordinates for top handle", () => {
    const result = getHandleCoordinates({ ...baseParams, handleId: "top" });

    expect(result).toEqual({
      x: 115,
      y: 200,
      position: Position.Top,
    });
  });

  it("returns coordinates for bottom handle", () => {
    const result = getHandleCoordinates({ ...baseParams, handleId: "bottom" });

    expect(result).toEqual({
      x: 115,
      y: 230,
      position: Position.Bottom,
    });
  });

  it("returns coordinates for left handle", () => {
    const result = getHandleCoordinates({ ...baseParams, handleId: "left" });

    expect(result).toEqual({
      x: 100,
      y: 215,
      position: Position.Left,
    });
  });

  it("returns coordinates for right handle", () => {
    const result = getHandleCoordinates({ ...baseParams, handleId: "right" });

    expect(result).toEqual({
      x: 130,
      y: 215,
      position: Position.Right,
    });
  });

  it("uses right handle for an unknown handle id", () => {
    const result = getHandleCoordinates({ ...baseParams, handleId: "unknown" });

    expect(result).toEqual({
      x: 130,
      y: 215,
      position: Position.Right,
    });
  });
});

describe("getPathFn", () => {
  it("returns smoothstep path function", () => {
    expect(getPathFn("smoothstep")).toBe(getSmoothStepPath);
  });

  it("returns straight path function", () => {
    expect(getPathFn("straight")).toBe(getStraightPath);
  });

  it("returns bezier path function", () => {
    expect(getPathFn("bezier")).toBe(getBezierPath);
  });

  it("falls back to bezier for an unknown path type", () => {
    expect(getPathFn("unknown" as EdgePathType)).toBe(getBezierPath);
  });
});

describe("getEdgePath", () => {
  const params = {
    sourceX: 0,
    sourceY: 0,
    sourcePosition: Position.Right,
    targetX: 100,
    targetY: 100,
    targetPosition: Position.Left,
  };

  it.each(["straight", "smoothstep", "bezier"] as const)(
    "returns edge path geometry for %s",
    (pathType) => {
      const result = getEdgePath(pathType, params);

      expect(result).toEqual(
        expect.objectContaining({
          path: expect.any(String),
          labelX: 50,
          labelY: 50,
          offsetX: 50,
          offsetY: 50,
        }),
      );
    },
  );
});

describe("measurePathBounds", () => {
  it("returns the bounding box of the path", () => {
    const mockBBox = {
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    };

    const originalCreateElementNS = document.createElementNS;

    vi.spyOn(document, "createElementNS").mockImplementation(
      (namespace, qualifiedName) => {
        const element = originalCreateElementNS.call(
          document,
          namespace,
          qualifiedName,
        );

        if (qualifiedName === "path") {
          const pathElement = element as SVGPathElement;

          pathElement.getBBox = () => mockBBox as DOMRect;
        }

        return element;
      },
    );

    const result = measurePathBounds("M 0 0 L 100 50");

    expect(result).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 50,
    });
  });
});
