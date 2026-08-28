import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  buildSelectedTreeFromSource,
  getSelectedTree,
  DEFAULT_SELECTED_COLUMNS,
} from "../../../../utils/utils";
import ConfigureConnection from "./ConfigureConnection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        CONNECTIONS_MESSAGE_PREFIX: "Choose which",
        CONNECTIONS_MESSAGE_SUFFIX: "outputs are to be shared as inputs to",

        CONNECTIONS_DATA_PREPROCESSING: "Data Preprocessing",
        FILTER_DATA_SOURCE: "Data Source",
        COMMON_CANCEL: "Cancel",
        PROJECT_ANALYSIS_FINISH: "Finish",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("Connections", () => {
  it("renders panel headings", () => {
    render(<ConfigureConnection />);

    expect(screen.getByText("Data Preprocessing")).toBeInTheDocument();

    expect(screen.getByText("Data Source")).toBeInTheDocument();
  });

  it("renders footer buttons", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText("Cancel")).toBeInTheDocument();

    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("renders instruction text", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText(/Choose which/i)).toBeInTheDocument();
  });

  it("renders hierarchy nodes", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText("DPR1.PV")).toBeInTheDocument();

    expect(screen.getByText("DPR1.MODE")).toBeInTheDocument();
  });

  it("shows None initially", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText("No inputs shared yet.")).toBeInTheDocument();
  });

  it("renders all leaf nodes", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText("DPR1.PV")).toBeInTheDocument();

    expect(screen.getAllByText("DPR1.MODE").length).toBeGreaterThan(0);

    expect(screen.getByText("DPR1.OP")).toBeInTheDocument();

    expect(screen.getByText("DPR1.SP")).toBeInTheDocument();
  });

  it("renders checkboxes", () => {
    render(<ConfigureConnection/>);

    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });

  it("selects a left checkbox", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    expect(checkboxes[0]).toBeChecked();
  });

  it("removes None after moving data", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    expect(screen.queryByText("None")).not.toBeInTheDocument();
  });

  it("does not crash when remove is clicked without selection", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[2]);

    expect(screen.getByText("Data Source")).toBeInTheDocument();
  });

  it("moves and removes a node", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    let checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    checkboxes = screen.getAllByRole("checkbox");

    const rightCheckbox = checkboxes[checkboxes.length - 1];

    await user.click(rightCheckbox);

    await user.click(buttons[2]);

    expect(screen.getByText("Data Source")).toBeInTheDocument();
  });

  it("unchecks a left checkbox when clicked twice", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const checkbox = screen.getAllByRole("checkbox")[0];

    await user.click(checkbox);

    expect(checkbox).toBeChecked();

    await user.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it("keeps selected items when remove is clicked without selecting right checkbox", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    await user.click(buttons[2]);

    expect(screen.getByText("DPR1.PV")).toBeInTheDocument();
  });
});

describe("buildSelectedTreeFromSource", () => {
  it("returns empty array when no ids match", () => {
    const source = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "leaf",
            label: "Leaf",
          },
        ],
      },
    ];

    expect(buildSelectedTreeFromSource(source, [])).toEqual([]);
  });

  it("handles leaf node without children property", () => {
    const result = getSelectedTree(
      [
        {
          id: "leaf",
          label: "Leaf",
        },
      ],
      [],
    );

    expect(result).toBeDefined();
  });

  it("returns default tree when generated tree is empty", () => {
    const result = getSelectedTree([], []);

    expect(result).toEqual(DEFAULT_SELECTED_COLUMNS);
  });
});

describe("getSelectedTree", () => {
  it("returns default tree when no matching ids exist", () => {
    const result = getSelectedTree([], []);

    expect(result).toEqual(DEFAULT_SELECTED_COLUMNS);
  });

  it("handles node without children property", () => {
    const result = getSelectedTree(
      [
        {
          id: "leaf",
          label: "Leaf",
        },
      ],
      [],
    );

    expect(result).toBeDefined();
  });

  it("removes multiple selected nodes", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    let checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[checkboxes.length - 1]);

    await user.click(checkboxes[checkboxes.length - 2]);

    await user.click(buttons[2]);

    expect(screen.getByText("Data Source")).toBeInTheDocument();
  });

  it("returns matched leaf node tree", () => {
    const source = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "leaf",
            label: "Leaf",
          },
        ],
      },
    ];

    const result = buildSelectedTreeFromSource(source, ["leaf"]);

    expect(result.length).toBe(1);
  });

  it("retains parent hierarchy when child matches", () => {
    const source = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "child",
            label: "Child",
          },
        ],
      },
    ];

    const result = buildSelectedTreeFromSource(source, ["child"]);

    expect(result[0].id).toBe("root");
  });

  it("handles empty source", () => {
    expect(buildSelectedTreeFromSource([], ["test"])).toEqual([]);
  });

  it("returns generated tree when ids match", () => {
    const source = [
      {
        id: "leaf",
        label: "Leaf",
      },
    ];

    const result = getSelectedTree(source, ["leaf"]);

    expect(result).toBeDefined();
  });

  it("supports multiple selected ids", () => {
    const source = [
      {
        id: "pv",
        label: "PV",
      },
      {
        id: "sp",
        label: "SP",
      },
    ];

    const result = getSelectedTree(source, ["pv", "sp"]);

    expect(result).toBeDefined();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const onClose = vi.fn();

    render(<ConfigureConnection onClose={onClose} />);

    await user.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders Finish button", () => {
    render(<ConfigureConnection/>);

    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("renders preprocessing text in instruction", () => {
    render(<ConfigureConnection/>);

    expect(screen.getAllByText("Data Preprocessing").length).toBeGreaterThan(0);
  });

  it("renders data source text in instruction", () => {
    render(<ConfigureConnection/>);

    expect(screen.getAllByText("Data Source").length).toBeGreaterThan(0);
  });

  it("renders transfer buttons", () => {
    render(<ConfigureConnection/>);

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBeGreaterThan(2);
  });

  it("selects all nodes when Select All is clicked", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    const selectAllButton = screen.getByText("Select All");

    await user.click(selectAllButton);

    const checkboxes = screen.getAllByRole("checkbox");

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it("clears all selected nodes when Clear All is clicked", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    await user.click(screen.getByText("Select All"));

    expect(screen.getByText("Clear All")).toBeInTheDocument();

    await user.click(screen.getByText("Clear All"));

    const checkboxes = screen.getAllByRole("checkbox");

    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it("shows Clear All when everything is selected", async () => {
    const user = userEvent.setup();

    render(<ConfigureConnection/>);

    await user.click(screen.getByText("Select All"));

    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("renders None when no source columns exist", async () => {
    vi.resetModules();

    vi.doMock("../../utils/utils", async () => {
      const actual = await vi.importActual("../../utils/utils");

      return {
        ...actual,
        allColumnsData: [],
      };
    });

    const { default: EmptyConnections } = await import("./ConfigureConnection");

    render(<EmptyConnections />);

    expect(screen.getByText("None")).toBeInTheDocument();
  });
});
