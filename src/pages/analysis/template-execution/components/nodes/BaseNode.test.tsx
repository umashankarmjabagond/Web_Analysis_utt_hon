import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BaseNode from "./BaseNode";
import type { NodeStatus } from "../../../../../types/templateExecution";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./nodeConfig", () => ({
  NODE_TYPES: {
    base: {
      icon: ({ size, className }: { size?: number; className: string }) => (
        <div
          data-testid="node-icon"
          data-size={String(size ?? "")}
          className={className}
        />
      ),
    },
  },
}));

vi.mock("@xyflow/react", () => ({
  Position: {
    Top: "top",
    Right: "right",
    Bottom: "bottom",
    Left: "left",
  },

  Handle: ({
    id,
    type,
    position,
  }: {
    id: string;
    type: string;
    position: string;
  }) => (
    <div
      data-testid="handle"
      data-id={id}
      data-type={type}
      data-position={position}
    />
  ),
}));

const createNode = (status: NodeStatus = "default") => ({
  id: "node-1",
  type: "base",
  data: {
    label: "Test Node",
    status,
  },
  dragging: false,
  zIndex: 0,
  selectable: true,
  deletable: true,
  selected: false,
  draggable: true,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
});

describe("BaseNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders node label", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getByText("Test Node")).toBeInTheDocument();
  });

  it("renders node icon", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getByTestId("node-icon")).toBeInTheDocument();
  });

  it("renders target and source handles for all four positions", () => {
    render(<BaseNode {...createNode()} />);

    const handles = screen.getAllByTestId("handle");

    expect(handles).toHaveLength(8);

    expect(
      handles.filter((handle) => handle.getAttribute("data-type") === "target"),
    ).toHaveLength(4);

    expect(
      handles.filter((handle) => handle.getAttribute("data-type") === "source"),
    ).toHaveLength(4);
  });

  it("renders handles on all positions", () => {
    render(<BaseNode {...createNode()} />);

    const handles = screen.getAllByTestId("handle");

    expect(
      handles.filter(
        (handle) => handle.getAttribute("data-position") === "top",
      ),
    ).toHaveLength(2);

    expect(
      handles.filter(
        (handle) => handle.getAttribute("data-position") === "right",
      ),
    ).toHaveLength(2);

    expect(
      handles.filter(
        (handle) => handle.getAttribute("data-position") === "bottom",
      ),
    ).toHaveLength(2);

    expect(
      handles.filter(
        (handle) => handle.getAttribute("data-position") === "left",
      ),
    ).toHaveLength(2);
  });

  it("returns null when node type metadata is missing", () => {
    const { container } = render(
      <BaseNode {...createNode()} type="unknownType" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it.each([
    ["default", "bg-[#2E2E2E]", "border-[#454545]", "text-[#909090]"],
    ["success", "bg-[#0A150A]", "border-[#68D560]", "text-[#68D560]"],
    ["warning", "bg-[#FF96401A]", "border-[#FF9640]", "text-[#FF9640]"],
    ["error", "bg-[#FF52471A]", "border-[#FF5247]", "text-[#FF5247]"],
  ] as const)(
    "renders correct styles for %s status",
    (status, background, border, iconColor) => {
      render(<BaseNode {...createNode(status)} />);
      const node = screen.getByTestId("node");
      expect(node).toHaveClass(background, border);

      const icon = screen.getByTestId("node-icon");
      expect(icon).toHaveClass("shrink-0", iconColor);
    },
  );
});
