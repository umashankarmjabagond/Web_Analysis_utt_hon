import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ConnectionTreeNode from "./ConnectionTreeNode";

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
        checkedIds={[]}
        onCheck={mockCheck}
      />,
    );

    expect(screen.getByText("Root Node")).toBeInTheDocument();
  });

  it("renders root parent node", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
          children: [],
        }}
        checkedIds={[]}
        onCheck={mockCheck}
      />,
    );

    expect(screen.getByText("Root Node")).toBeInTheDocument();
  });

  it("renders nested parent node", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
          children: [],
        }}
        checkedIds={[]}
        onCheck={mockCheck}
      />,
    );

    expect(screen.getByText("Root Node")).toBeInTheDocument();
  });

  it("renders checkbox for leaf node", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
          children: [],
        }}
        checkedIds={[]}
        onCheck={mockCheck}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("calls onCheck when checkbox is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
          children: [],
        }}
        checkedIds={[]}
        onCheck={mockCheck}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(mockCheck).toHaveBeenCalledWith("root");
  });

  it("renders checked checkbox", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
          children: [],
        }}
        checkedIds={["root"]}
        onCheck={mockCheck}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not render checkbox when showCheckbox is false", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "root",
          label: "Root Node",
        }}
        checkedIds={[]}
        onCheck={mockCheck}
        showCheckbox={false}
      />,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders SHARED badge when checked", () => {
    render(
      <ConnectionTreeNode
        node={{
          id: "leaf",
          label: "Leaf",
        }}
        checkedIds={["leaf"]}
        onCheck={mockCheck}
        showShared
      />,
    );

    expect(screen.getByText("SHARED")).toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();

    const mockRemove = vi.fn();

    render(
      <ConnectionTreeNode
        node={{
          id: "leaf",
          label: "Leaf",
        }}
        checkedIds={[]}
        onCheck={mockCheck}
        rightPanel
        onRemove={mockRemove}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(mockRemove).toHaveBeenCalledWith("leaf");
  });
});
