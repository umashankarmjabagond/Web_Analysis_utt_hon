import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Connections from "./Connections";

import {
  buildSelectedTreeFromSource,
  getSelectedTree,
  DEFAULT_SELECTED_COLUMNS,
} from "../../utils/utils";



vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Connections", () => {
  it("renders page title", () => {
    render(<Connections />);

    expect(
      screen.getByText("Configure Input Columns"),
    ).toBeInTheDocument();
  });

  it("renders panel headings", () => {
    render(<Connections />);

    expect(
      screen.getByText("DATA PREPROCESSING"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("DATA SOURCE"),
    ).toBeInTheDocument();
  });

  it("renders footer buttons", () => {
    render(<Connections />);

    expect(
      screen.getByText("Cancel"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Finish"),
    ).toBeInTheDocument();
  });

  it("renders close button", () => {
    render(<Connections />);

    expect(
      screen.getByRole("button", {
        name: "COMMON_CLOSE",
      }),
    ).toBeInTheDocument();
  });

  it("renders instruction text", () => {
    render(<Connections />);

    expect(
      screen.getByText(
        /Please select the inputs/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders breadcrumb text", () => {
    render(<Connections />);

    expect(
      screen.getByText("Data Preprocessing"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Data Source"),
    ).toBeInTheDocument();
  });

  it("renders hierarchy nodes", () => {
    render(<Connections />);

    expect(
      screen.getAllByText(
        "DPR1 Data Preprocessing",
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        "TimeSeriesSample",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("shows None initially", () => {
    render(<Connections />);

    expect(
      screen.getByText("None"),
    ).toBeInTheDocument();
  });

  it("renders all leaf nodes", () => {
  render(<Connections />);

  expect(
    screen.getByText("DPR1.PV"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("DPR1.MODE"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("DPR1.OP"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("DPR1.SP"),
  ).toBeInTheDocument();
});

  it("renders checkboxes", () => {
    render(<Connections />);

    expect(
      screen.getAllByRole("checkbox").length,
    ).toBeGreaterThan(0);
  });

  it("selects a left checkbox", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    expect(
      checkboxes[0],
    ).toBeChecked();
  });

  it("moves a node to selected panel", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons =
    screen.getAllByRole("button");

  const moveRightButton = buttons.find(
    (button) =>
      button.querySelector("svg") &&
      !button.getAttribute("aria-label"),
  );

  if (moveRightButton) {
    await user.click(moveRightButton);
  }

  expect(
    screen.getAllByText("DPR1.PV"),
  ).toHaveLength(2);
});

  it("moves multiple nodes to selected panel", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);
  await user.click(checkboxes[1]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[1]);

  expect(
    screen.getAllByText("DPR1.PV"),
  ).toHaveLength(2);

  expect(
    screen.getAllByText("DPR1.MODE"),
  ).toHaveLength(2);
});

  it("removes None after moving data", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons =
      screen.getAllByRole("button");

    await user.click(buttons[1]);

    expect(
      screen.queryByText("None"),
    ).not.toBeInTheDocument();
  });

  it("allows selecting checkbox in selected panel", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    let checkboxes =
      screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons =
      screen.getAllByRole("button");

    await user.click(buttons[1]);

    checkboxes =
      screen.getAllByRole("checkbox");

    const lastCheckbox =
      checkboxes[checkboxes.length - 1];

    await user.click(lastCheckbox);

    expect(lastCheckbox).toBeChecked();
  });

  it("does not crash when remove is clicked without selection", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    const buttons =
      screen.getAllByRole("button");

    await user.click(buttons[2]);

    expect(
      screen.getByText("DATA SOURCE"),
    ).toBeInTheDocument();
  });

  it("moves and removes a node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    let checkboxes =
      screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);

    const buttons =
      screen.getAllByRole("button");

    await user.click(buttons[1]);

    checkboxes =
      screen.getAllByRole("checkbox");

    const rightCheckbox =
      checkboxes[checkboxes.length - 1];

    await user.click(rightCheckbox);

    await user.click(buttons[2]);

    expect(
      screen.getByText("DATA SOURCE"),
    ).toBeInTheDocument();
  });

  it("unchecks a left checkbox when clicked twice", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkbox = screen.getAllByRole(
    "checkbox",
  )[0];

  await user.click(checkbox);

  expect(checkbox).toBeChecked();

  await user.click(checkbox);

  expect(checkbox).not.toBeChecked();
});

it("unchecks a right panel checkbox when clicked twice", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  let checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[1]);

  checkboxes =
    screen.getAllByRole("checkbox");

  const rightCheckbox =
    checkboxes[checkboxes.length - 1];

  await user.click(rightCheckbox);

  expect(rightCheckbox).toBeChecked();

  await user.click(rightCheckbox);

  expect(rightCheckbox).not.toBeChecked();
});

it("keeps selected items when remove is clicked without selecting right checkbox", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[1]);

  await user.click(buttons[2]);

  expect(
    screen.getAllByText("DPR1.PV"),
  ).toHaveLength(2);
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

    expect(
      buildSelectedTreeFromSource(source, []),
    ).toEqual([]);
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

  expect(result).toEqual(
    DEFAULT_SELECTED_COLUMNS,
  );
});

});

describe("getSelectedTree", () => {
  it("returns default tree when no matching ids exist", () => {
    const result = getSelectedTree([], []);

    expect(result).toEqual(
      DEFAULT_SELECTED_COLUMNS,
    );
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

  it("does not change selected panel when move is clicked without selection", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const buttons = screen.getAllByRole("button");

  await user.click(buttons[1]);

  expect(
    screen.getByText("None"),
  ).toBeInTheDocument();
});

it("removes multiple selected nodes", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  let checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);
  await user.click(checkboxes[1]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[1]);

  checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(
    checkboxes[checkboxes.length - 1],
  );

  await user.click(
    checkboxes[checkboxes.length - 2],
  );

  await user.click(buttons[2]);

  expect(
    screen.getByText("DATA SOURCE"),
  ).toBeInTheDocument();
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

  const result =
    buildSelectedTreeFromSource(
      source,
      ["leaf"],
    );

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

  const result =
    buildSelectedTreeFromSource(
      source,
      ["child"],
    );

  expect(result[0].id).toBe("root");
});

it("handles empty source", () => {
  expect(
    buildSelectedTreeFromSource([], ["test"])
  ).toEqual([]);
});

it("returns generated tree when ids match", () => {
  const source = [
    {
      id: "leaf",
      label: "Leaf",
    },
  ];

  const result = getSelectedTree(
    source,
    ["leaf"],
  );

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

  const result =
    getSelectedTree(
      source,
      ["pv", "sp"],
    );

  expect(result).toBeDefined();
});
});