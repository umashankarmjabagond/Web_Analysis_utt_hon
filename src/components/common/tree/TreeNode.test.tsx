import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import TreeNode from "./TreeNode";

const onToggle = vi.fn();
const onSelect = vi.fn();

const parentNode = {
  id: "1",
  label: "Parent",
  image: "folder.png",
  children: [
    {
      id: "2",
      label: "Child",
      image: "file.png",
    },
  ],
};

describe("TreeNode", () => {
  it("renders node label", () => {
    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("calls onSelect when node clicked", async () => {
    const user = userEvent.setup();

    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("calls onToggle when chevron clicked", async () => {
    const user = userEvent.setup();

    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    const chevron = document.querySelector("svg")!;

    await user.click(chevron);

    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("renders children when expanded", () => {
    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set(["1"])}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("does not render children when collapsed", () => {
    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    expect(screen.queryByText("Child")).not.toBeInTheDocument();
  });

  it("applies selected styles", () => {
    render(
      <TreeNode
        node={parentNode}
        level={0}
        expandedIds={new Set()}
        selectedId="1"
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole("button")).toHaveClass(
      "bg-tree-node-selected-background",
    );
  });

  it("renders leaf node without chevron", () => {
    render(
      <TreeNode
        node={{
          id: "3",
          label: "Leaf",
          image: "",
        }}
        level={0}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    expect(screen.getByText("Leaf")).toBeInTheDocument();

    expect(document.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders correct indentation", () => {
    render(
      <TreeNode
        node={parentNode}
        level={2}
        expandedIds={new Set()}
        selectedId=""
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    const wrapper = screen.getByText("Parent").parentElement;

    expect(wrapper).toHaveStyle({
      paddingLeft: "48px",
    });
  });
});
