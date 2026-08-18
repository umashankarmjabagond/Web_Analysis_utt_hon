import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ConnectionTreeNode from "./ConnectionTreeNode";

const mockToggle = vi.fn();
const mockCheck = vi.fn();

describe("ConnectionTreeNode", () => {
    it("renders node label", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root Node",
        children: [],
      }}
      level={0}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByText("Root Node"),
  ).toBeInTheDocument();
});

it("renders root parent node", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root",
        children: [],
      }}
      level={0}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByText("Root"),
  ).toBeInTheDocument();
});

it("renders nested parent node", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "child",
        label: "Child",
        children: [],
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByText("Child"),
  ).toBeInTheDocument();
});

it("calls onToggle when chevron is clicked", async () => {
  const user = userEvent.setup();

  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root",
        children: [],
      }}
      level={0}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  const chevron =
    document.querySelector("svg");

  await user.click(chevron!);

  expect(mockToggle).toHaveBeenCalledWith(
    "root",
  );
});

it("renders child nodes when expanded", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root",
        children: [
          {
            id: "leaf",
            label: "Leaf",
          },
        ],
      }}
      level={0}
      expandedIds={new Set(["root"])}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByText("Leaf"),
  ).toBeInTheDocument();
});

it("does not render children when collapsed", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root",
        children: [
          {
            id: "leaf",
            label: "Leaf",
          },
        ],
      }}
      level={0}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.queryByText("Leaf"),
  ).not.toBeInTheDocument();
});

it("renders checkbox for leaf node", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "leaf",
        label: "Leaf",
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByRole("checkbox"),
  ).toBeInTheDocument();
});

it("calls onCheck when checkbox is clicked", async () => {
  const user = userEvent.setup();

  render(
    <ConnectionTreeNode
      node={{
        id: "leaf",
        label: "Leaf",
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  await user.click(
    screen.getByRole("checkbox"),
  );

  expect(mockCheck).toHaveBeenCalledWith(
    "leaf",
  );
});

it("renders checked checkbox", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "leaf",
        label: "Leaf",
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={["leaf"]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByRole("checkbox"),
  ).toBeChecked();
});

it("does not render checkbox when showCheckbox is false", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "leaf",
        label: "Leaf",
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
      showCheckbox={false}
    />,
  );

  expect(
    screen.queryByRole("checkbox"),
  ).not.toBeInTheDocument();
});

it('does not render checkbox for "None" label', () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "none",
        label: "None",
      }}
      level={1}
      expandedIds={new Set()}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.queryByRole("checkbox"),
  ).not.toBeInTheDocument();
});

it("renders expanded node", () => {
  render(
    <ConnectionTreeNode
      node={{
        id: "root",
        label: "Root",
        children: [],
      }}
      level={0}
      expandedIds={new Set(["root"])}
      checkedIds={[]}
      onToggle={mockToggle}
      onCheck={mockCheck}
    />,
  );

  expect(
    screen.getByText("Root"),
  ).toBeInTheDocument();
});
})