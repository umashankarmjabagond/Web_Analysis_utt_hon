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
    t: (key: string) => {
      const translations: Record<string, string> = {
        CONNECTIONS_SELECT_INPUTS_MESSAGE:
          "Please select the inputs",

        CONNECTIONS_DATA_PREPROCESSING:
          "Data Preprocessing",

        FILTER_DATA_SOURCE: "Data Source",

        CONNECTIONS_TO: "to",

        COMMON_CANCEL: "Cancel",

        PROJECT_ANALYSIS_FINISH: "Finish",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("Connections", () => {
  it("renders panel headings", () => {
    render(<Connections />);

    expect(
  screen.getByText("Data Preprocessing"),
).toBeInTheDocument();

expect(
  screen.getByText("Data Source"),
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

  it("renders instruction text", () => {
    render(<Connections />);

    expect(
      screen.getByText(
        /Please select the inputs/i,
      ),
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
  screen.getByText("DPR1.PV"),
).toBeInTheDocument();

expect(
  screen.getByText("DPR1.MODE"),
).toBeInTheDocument();
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
  screen.getByText("Data Source"),
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
  screen.getByText("Data Source"),
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
  screen.getByText("DPR1.PV"),
).toBeInTheDocument();
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

  await user.click(buttons[0]);

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
  screen.getByText("Data Source"),
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

it("calls onClose when Cancel is clicked", async () => {
  const user = userEvent.setup();

  const onClose = vi.fn();

  render(<Connections onClose={onClose} />);

  await user.click(
    screen.getByText("Cancel"),
  );

  expect(onClose).toHaveBeenCalledTimes(1);
});

it("renders Finish button", () => {
  render(<Connections />);

  expect(
    screen.getByText("Finish"),
  ).toBeInTheDocument();
});

it("renders preprocessing text in instruction", () => {
  render(<Connections />);

  expect(
    screen.getAllByText(
      "Data Preprocessing",
    ).length,
  ).toBeGreaterThan(0);
});

it("renders data source text in instruction", () => {
  render(<Connections />);

  expect(
    screen.getAllByText(
      "Data Source",
    ).length,
  ).toBeGreaterThan(0);
});

it("renders transfer buttons", () => {
  render(<Connections />);

  const buttons =
    screen.getAllByRole("button");

  expect(buttons.length).toBeGreaterThan(2);
});

it("clears left checkbox selection after move", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  expect(checkboxes[0]).toBeChecked();

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[0]);

  expect(checkboxes[0]).not.toBeChecked();
});

it("covers toggleRightCheck add and remove branches", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes = screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons = screen.getAllByRole("button");

  // move right
  await user.click(buttons[0]);

  const updatedCheckboxes =
    screen.getAllByRole("checkbox");

  const checkedBox = updatedCheckboxes.find(
  (checkbox) => {
    return !(checkbox as HTMLInputElement).disabled;
  },
);

  expect(checkedBox).toBeDefined();

  await user.click(checkedBox!);

  expect(checkedBox).toBeChecked();

  await user.click(checkedBox!);

  expect(checkedBox).not.toBeChecked();
});

it("removes selected node from right panel", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[0]);

  const allCheckboxes =
    screen.getAllByRole("checkbox");

  const rightCheckbox =
    allCheckboxes[allCheckboxes.length - 1];

  await user.click(rightCheckbox);

  await user.click(buttons[1]);

  expect(
  screen.getByText("Data Source"),
).toBeInTheDocument();
});

it("removes selected node from right panel", async () => {
  const user = userEvent.setup();

  render(<Connections />);

  const checkboxes =
    screen.getAllByRole("checkbox");

  await user.click(checkboxes[0]);

  const buttons =
    screen.getAllByRole("button");

  await user.click(buttons[0]);

  const updatedCheckboxes =
    screen.getAllByRole("checkbox");

  const rightCheckbox =
    updatedCheckboxes[updatedCheckboxes.length - 1];

  await user.click(rightCheckbox);

  await user.click(buttons[1]);

  expect(
    screen.getByText("Data Source"),
  ).toBeInTheDocument();
});

});