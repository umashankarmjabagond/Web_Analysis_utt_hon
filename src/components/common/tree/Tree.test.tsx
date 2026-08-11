import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import Tree from "./Tree";

const onSelect = vi.fn();

const treeData = [
  {
    id: "1",
    label: "Parent",
    image: "",
    children: [
      {
        id: "2",
        label: "Child",
        image: "",
      },
    ],
  },
];

describe("Tree", () => {
  it("renders root node", () => {
    render(<Tree nodes={treeData} selectedId="" onSelect={onSelect} />);

    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("does not render child initially", () => {
    render(<Tree nodes={treeData} selectedId="" onSelect={onSelect} />);

    expect(screen.queryByText("Child")).not.toBeInTheDocument();
  });

  it("expands children when chevron is clicked", async () => {
    const user = userEvent.setup();

    render(<Tree nodes={treeData} selectedId="" onSelect={onSelect} />);

    const chevron = document.querySelector("svg")!;

    await user.click(chevron);

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("collapses children when chevron clicked twice", async () => {
    const user = userEvent.setup();

    render(<Tree nodes={treeData} selectedId="" onSelect={onSelect} />);

    const chevron = document.querySelector("svg")!;

    await user.click(chevron);
    expect(screen.getByText("Child")).toBeInTheDocument();

    await user.click(chevron);

    expect(screen.queryByText("Child")).not.toBeInTheDocument();
  });

  it("calls onSelect when node clicked", async () => {
    const user = userEvent.setup();

    render(<Tree nodes={treeData} selectedId="" onSelect={onSelect} />);

    await user.click(screen.getByText("Parent"));

    expect(onSelect).toHaveBeenCalledWith("1");
  });
});
