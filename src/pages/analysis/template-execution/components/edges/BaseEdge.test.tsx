import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Position } from "@xyflow/react";
import ExecutionWorkflowEdge from "./BaseEdge";
import type { ExecutionWorkflowEdgeProps } from "../../../../../types/templateExecution";
import { getPathFn } from "../../flowBuilders/edgeGeometry";
import type React from "react";

vi.mock("@xyflow/react", () => ({
  BaseEdge: ({
    id,
    path,
    style,
  }: {
    id: string;
    path: string;
    style: React.CSSProperties;
  }) => (
    <div
      data-testid="base-edge"
      data-id={id}
      data-path={path}
      data-stroke={style.stroke}
      data-stroke-width={style.strokeWidth}
    />
  ),
  Position: { Left: "left", Right: "right" },
}));

vi.mock("../../flowBuilders/edgeGeometry", () => ({
  getPathFn: vi.fn(() => vi.fn(() => ["mocked-path"])),
}));

const defaultProps: ExecutionWorkflowEdgeProps = {
  id: "edge-1",
  source: "node-1",
  target: "node-2",
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: Position.Left,
  targetPosition: Position.Right,
  selected: false,
  animated: false,
  data: {
    pathType: "bezier",
  },
};

describe("ExecutionWorkflowEdge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders BaseEdge with the calculated path", () => {
    render(<ExecutionWorkflowEdge {...defaultProps} />);

    const edge = screen.getByTestId("base-edge");

    expect(edge).toBeInTheDocument();
    expect(edge).toHaveAttribute("data-id", "edge-1");
    expect(edge).toHaveAttribute("data-path", "mocked-path");
  });

  it("uses the pathType from data", () => {
    render(
      <ExecutionWorkflowEdge
        {...defaultProps}
        data={{ pathType: "smoothstep" }}
      />,
    );

    expect(getPathFn).toHaveBeenCalledWith("smoothstep");
    expect(screen.getByTestId("base-edge")).toHaveAttribute(
      "data-path",
      "mocked-path",
    );
  });

  it("uses default pathType when data is undefined", () => {
    render(<ExecutionWorkflowEdge {...defaultProps} data={undefined} />);

    expect(getPathFn).toHaveBeenCalledWith("default");
  });

  it("passes the edge style to BaseEdge", () => {
    render(<ExecutionWorkflowEdge {...defaultProps} />);

    const edge = screen.getByTestId("base-edge");

    expect(edge).toHaveAttribute("data-stroke", "var(--edge-default)");
    expect(edge).toHaveAttribute("data-stroke-width", "1");
  });
});
