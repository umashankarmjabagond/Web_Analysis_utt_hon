import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ExecutionHeaderNode from "./ExecutionHeaderNode";

const createNode = (
  itemId = "ROW-101",
): Parameters<typeof ExecutionHeaderNode>[0] => ({
  id: "header-1",
  type: "executionHeader",
  data: {
    itemId,
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

describe("ExecutionHeaderNode", () => {
  it("renders itemId", () => {
    render(<ExecutionHeaderNode {...createNode()} />);

    expect(screen.getByText("ROW-101")).toBeInTheDocument();
  });
});
