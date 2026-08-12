import { render, screen } from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ExecutionWorkflowEdge from "./BaseEdge";

import type { ExecutionWorkflowEdgeProps } from "../../../../../types/templateExecution";

import { Position } from "@xyflow/react";

vi.mock("@xyflow/react", () => ({
  BaseEdge: ({
    id,
    path,
    markerEnd,
  }: {
    id: string;
    path: string;
    markerEnd?: string;
  }) => (
    <div
      data-testid="base-edge"
      data-id={id}
      data-path={path}
      data-marker={markerEnd}
    />
  ),

  getBezierPath: vi.fn(
    () => ["bezier-path"],
  ),

  getSmoothStepPath: vi.fn(
    () => ["smooth-path"],
  ),

  getStraightPath: vi.fn(
    () => ["straight-path"],
  ),

  Position: {
    Left: "left",
    Right: "right",
  },
}));

const defaultProps: ExecutionWorkflowEdgeProps = {
  id: "edge-1",
  source: "node-1",
  target: "node-2",
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  markerEnd: "arrow",
  selected: false,
  animated: false,
  data: {
    pathType: "bezier",
  },
};


describe(
  "ExecutionWorkflowEdge",
  () => {
    it("renders BaseEdge", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
          data={{
            pathType: "bezier",
          }}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toBeInTheDocument();
    });

    it("uses bezier path", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
          data={{
            pathType: "bezier",
          }}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toHaveAttribute(
        "data-path",
        "bezier-path",
      );
    });

    it("uses smoothstep path", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
          data={{
            pathType:
              "smoothstep",
          }}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toHaveAttribute(
        "data-path",
        "smooth-path",
      );
    });

    it("uses straight path", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
          data={{
            pathType:
              "straight",
          }}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toHaveAttribute(
        "data-path",
        "straight-path",
      );
    });

    it("uses default pathType when data is undefined", () => {
  render(
    <ExecutionWorkflowEdge
      {...defaultProps}
      data={undefined}
    />,
  );

  expect(
    screen.getByTestId(
      "base-edge",
    ),
  ).toHaveAttribute(
    "data-path",
    "bezier-path",
  );
});

    it("passes id to BaseEdge", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toHaveAttribute(
        "data-id",
        "edge-1",
      );
    });

    it("passes markerEnd to BaseEdge", () => {
      render(
        <ExecutionWorkflowEdge
          {...defaultProps}
        />,
      );

      expect(
        screen.getByTestId(
          "base-edge",
        ),
      ).toHaveAttribute(
        "data-marker",
        "arrow",
      );
    });
  },
);