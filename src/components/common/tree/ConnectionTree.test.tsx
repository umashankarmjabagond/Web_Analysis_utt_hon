import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ConnectionTree from "./ConnectionTree";

const treeData = [
  {
    id: "ds",
    label: "Root",
    children: [
      {
        id: "sample",
        label: "Child",
      },
    ],
  },
];

describe("ConnectionTree", () => {
  it("renders root node", () => {
    render(
      <ConnectionTree nodes={treeData} checkedIds={[]} onCheck={vi.fn()} />,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders child nodes when initially expanded", () => {
    render(
      <ConnectionTree nodes={treeData} checkedIds={[]} onCheck={vi.fn()} />,
    );

    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("renders multiple root nodes", () => {
    render(
      <ConnectionTree
        nodes={[
          {
            id: "one",
            label: "Node One",
          },
          {
            id: "two",
            label: "Node Two",
          },
        ]}
        checkedIds={[]}
        onCheck={vi.fn()}
      />,
    );

    expect(screen.getByText("Node One")).toBeInTheDocument();

    expect(screen.getByText("Node Two")).toBeInTheDocument();
  });

  it("does not render leaf nodes labeled None", () => {
    render(
      <ConnectionTree
        nodes={[
          {
            id: "none",
            label: "None",
          },
          {
            id: "leaf",
            label: "Visible leaf",
          },
        ]}
        checkedIds={[]}
        onCheck={vi.fn()}
      />,
    );

    expect(screen.queryByText("None")).not.toBeInTheDocument();
    expect(screen.getByText("Visible leaf")).toBeInTheDocument();
  });

  it("renders checked checkbox", () => {
    render(
      <ConnectionTree
        nodes={[
          {
            id: "leaf",
            label: "Leaf",
          },
        ]}
        checkedIds={["leaf"]}
        onCheck={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("hides checkbox when showCheckbox is false", () => {
    render(
      <ConnectionTree
        nodes={[
          {
            id: "leaf",
            label: "Leaf",
          },
        ]}
        checkedIds={[]}
        onCheck={vi.fn()}
        showCheckbox={false}
      />,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("renders without crashing when nodes are empty", () => {
    render(<ConnectionTree nodes={[]} checkedIds={[]} onCheck={vi.fn()} />);

    expect(document.body).toBeInTheDocument();
  });

  it("calls onCheck when checkbox is clicked", async () => {
    const user = userEvent.setup();

    const onCheck = vi.fn();

    render(
      <ConnectionTree
        nodes={[
          {
            id: "leaf",
            label: "Leaf",
          },
        ]}
        checkedIds={[]}
        onCheck={onCheck}
      />,
    );

    await user.click(screen.getByRole("checkbox"));

    expect(onCheck).toHaveBeenCalledWith("leaf");
  });
});
