import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import WorkflowEdge from "./BaseEdge";

vi.mock("@xyflow/react", () => ({
  BaseEdge: ({
    id,
    path,
    markerEnd,
    style,
  }: {
    id: string;
    path: string;
    markerEnd?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid="base-edge"
      data-id={id}
      data-path={path}
      data-marker-end={markerEnd}
      data-stroke={style?.stroke}
      data-stroke-width={style?.strokeWidth}
    />
  ),

  getSmoothStepPath: vi.fn(() => [
    "M0,0 L100,100",
  ]),
}));

describe("WorkflowEdge", () => {
  const defaultProps = {
  id: "edge-1",
  source: "node-1",
  target: "node-2",
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: "right" as const,
  targetPosition: "left" as const,
} as React.ComponentProps<typeof WorkflowEdge>;

  it("renders base edge", () => {
    render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toBeInTheDocument();
  });

  it("passes id to BaseEdge", () => {
    render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-id",
      "edge-1",
    );
  });

  it("passes path to BaseEdge", () => {
    render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-path",
      "M0,0 L100,100",
    );
  });

  it("passes markerEnd", () => {
    render(
      <svg>
        <WorkflowEdge
          {...defaultProps}
          markerEnd="arrow"
        />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-marker-end",
      "arrow",
    );
  });

  it("uses default stroke color when not hovered and not selected", () => {
    render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-stroke",
      "#4FB3FF",
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-stroke-width",
      "1",
    );
  });

  it("uses selected styling", () => {
    render(
      <svg>
        <WorkflowEdge
          {...defaultProps}
          selected
        />
      </svg>,
    );

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-stroke-width",
      "1.2",
    );
  });

  it("changes stroke width when hovered", () => {
    const { container } = render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    const group =
      container.querySelector("g");

    fireEvent.mouseEnter(group!);

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-stroke-width",
      "1.2",
    );
  });

  it("restores default stroke width when mouse leaves", () => {
    const { container } = render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    const group =
      container.querySelector("g");

    fireEvent.mouseEnter(group!);

    fireEvent.mouseLeave(group!);

    expect(
      screen.getByTestId("base-edge"),
    ).toHaveAttribute(
      "data-stroke-width",
      "1",
    );
  });

  it("renders transparent interaction path", () => {
    const { container } = render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    const transparentPath =
      container.querySelector(
        'path[stroke="transparent"]',
      );

    expect(
      transparentPath,
    ).toBeInTheDocument();
  });

  it("renders interaction path with pointer events", () => {
    const { container } = render(
      <svg>
        <WorkflowEdge {...defaultProps} />
      </svg>,
    );

    const transparentPath =
      container.querySelector(
        'path[stroke="transparent"]',
      );

    expect(
      transparentPath,
    ).toHaveAttribute(
      "pointer-events",
      "stroke",
    );
  });
});