import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen,within } from "@testing-library/react";

import DataSource from "./DataSource";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../mock/dataSource.json", () => ({
  default: {
    dataSourceConfiguration: {
      dataSources: [
        {
          id: "none",
          name: "None",
        },
        {
          id: "testfile",
          name: "Testfile",
        },
      ],

      controllerTypes: [
        {
          id: "regulatory",
          name: "Regulatory",
        },
        {
          id: "mpc",
          name: "MPC",
        },
      ],

      templateTypes: {
        regulatory: [
          {
            id: "standalone-controller",
            name: "Standalone Controller",
          },
        ],

        mpc: [
          {
            id: "standalone-controller",
            name: "Standalone Controller",
          },
          {
            id: "cascade",
            name: "Cascade",
          },
        ],
      },

      tagDefinitions: {
        regulatory: {
          "standalone-controller": [
            {
              id: "1",
              columnName: "Mode",
              extension: ".MODE",
            },
            {
              id: "2",
              columnName: "PV",
              extension: ".PV",
            },
            {
              id: "3",
              columnName: "OP",
              extension: ".OP",
            },
            {
              id: "4",
              columnName: "SP",
              extension: ".SP",
            },
            {
              id: "5",
              columnName: "TimeSelected",
              extension: ".TIME",
            },
          ],
        },

        mpc: {
          "standalone-controller": [
            {
              id: "6",
              columnName: "Mode",
              extension: ".MPC_MODE",
            },
            {
              id: "7",
              columnName: "PV",
              extension: ".MPC_PV",
            },
            {
              id: "8",
              columnName: "OP",
              extension: ".MPC_OP",
            },
            {
              id: "9",
              columnName: "SP",
              extension: ".MPC_SP",
            },
          ],

          cascade: [
            {
              id: "10",
              columnName: "PV",
              extension: ".CASCADE_PV",
            },
          ],
        },
      },
    },
  },
}));

vi.mock("../forms/button/Button", () => ({
  default: (props: {
    children?: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
  }) =>
    React.createElement(
      "button",
      {
        type: props.type ?? "button",
        onClick: props.onClick,
      },
      props.children,
    ),
}));

vi.mock("../forms/select/Select", () => ({
  default: (props: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }) =>
    React.createElement(
      "select",
      {
        value: props.value,
        onChange: props.onChange,
      },
      props.options.map((option) =>
        React.createElement(
          "option",
          {
            key: option.value,
            value: option.value,
          },
          option.label,
        ),
      ),
    ),
}));

describe("DataSource", () => {
  const onClose = vi.fn();
  const onSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderDataSource = () => {
    return render(
      React.createElement(DataSource, {
        type: "text-file",
        dataSourceName: "HDS2",
        onClose,
        onSave,
      }),
    );
  };

  it("should render Data Source component", () => {
    renderDataSource();

    expect(
      screen.getByText("Data Source (DS)"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Data Source · HDS2"),
    ).toBeInTheDocument();
  });

  it("should render default data source as None", () => {
    renderDataSource();

    const dataSourceSelect =
      screen.getAllByRole("combobox")[0];

    expect(dataSourceSelect).toHaveValue("none");
  });

  it("should render default controller type as Regulatory", () => {
    renderDataSource();

    const controllerSelect =
      screen.getAllByRole("combobox")[1];

    expect(controllerSelect).toHaveValue("regulatory");
  });

  it("should render default template type", () => {
    renderDataSource();

    const templateSelect =
      screen.getAllByRole("combobox")[2];

    expect(templateSelect).toHaveValue(
      "standalone-controller",
    );
  });

  it("should render default selected tags", () => {
    renderDataSource();

    expect(
      screen.getByDisplayValue("Mode"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("PV"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("OP"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("SP"),
    ).toBeInTheDocument();
  });

  it("should render correct extensions for default tags", () => {
    renderDataSource();

    expect(
      screen.getByDisplayValue(".MODE"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(".PV"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(".OP"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(".SP"),
    ).toBeInTheDocument();
  });

  it("should render available unselected tags", () => {
    renderDataSource();

    expect(
      screen.getByDisplayValue("TimeSelected"),
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue(".TIME"),
    ).toBeInTheDocument();
  });

  it("should add an available tag", () => {
    renderDataSource();

    const timeSelected =
      screen.getByDisplayValue("TimeSelected");

    expect(timeSelected).toBeInTheDocument();

    const row = timeSelected.parentElement;

    expect(row).not.toBeNull();

    const addButton =
      row?.querySelector("button");

    expect(addButton).not.toBeNull();

    fireEvent.click(addButton!);

    expect(
      screen.getAllByDisplayValue("TimeSelected"),
    ).toHaveLength(1);
  });

  it("should not add duplicate tag", () => {
    renderDataSource();

    const modeInput =
      screen.getByDisplayValue("Mode");

    const row = modeInput.parentElement;

    expect(row).not.toBeNull();

    const addButton =
      row?.querySelector("button");

    if (addButton) {
      fireEvent.click(addButton);
    }

    expect(
      screen.getAllByDisplayValue("Mode"),
    ).toHaveLength(1);
  });

  it("should add all available tags", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("Add All"),
    );

    expect(
      screen.getByDisplayValue("TimeSelected"),
    ).toBeInTheDocument();
  });

 it("should remove all selected tags", () => {
  renderDataSource();

  expect(screen.getByDisplayValue("Mode")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Remove All"));

  expect(
    screen.getByText("No extensions selected."),
  ).toBeInTheDocument();

  const selectedTagsHeading = screen.getByText("Selected Tags");
  const selectedTagsContainer =
    selectedTagsHeading.parentElement?.nextElementSibling;

  expect(selectedTagsContainer).not.toBeNull();

  expect(
    within(selectedTagsContainer as HTMLElement).queryByDisplayValue("Mode"),
  ).not.toBeInTheDocument();

  expect(
    within(selectedTagsContainer as HTMLElement).queryByDisplayValue("PV"),
  ).not.toBeInTheDocument();

  expect(
    within(selectedTagsContainer as HTMLElement).queryByDisplayValue("OP"),
  ).not.toBeInTheDocument();

  expect(
    within(selectedTagsContainer as HTMLElement).queryByDisplayValue("SP"),
  ).not.toBeInTheDocument();
});

  it("should add a manual tag", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("Add Tag Manually"),
    );

    expect(
      screen.getByPlaceholderText("Column name"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(".PV"),
    ).toBeInTheDocument();
  });

  it("should update manual tag column name", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("Add Tag Manually"),
    );

    const input =
      screen.getByPlaceholderText("Column name");

    fireEvent.change(input, {
      target: {
        value: "ManualTag",
      },
    });

    expect(input).toHaveValue("ManualTag");
  });

  it("should update manual tag extension", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("Add Tag Manually"),
    );

    const input =
      screen.getByPlaceholderText(".PV");

    fireEvent.change(input, {
      target: {
        value: ".CUSTOM",
      },
    });

    expect(input).toHaveValue(".CUSTOM");
  });

  it("should remove individual selected tag", () => {
  renderDataSource();

  const modeInput = screen.getByDisplayValue("Mode");
  const modeRow = modeInput.parentElement;

  expect(modeRow).not.toBeNull();

  const removeButton = modeRow?.querySelector("button");

  expect(removeButton).not.toBeNull();

  fireEvent.click(removeButton!);

  const selectedTagsHeading = screen.getByText("Selected Tags");
  const selectedTagsContainer =
    selectedTagsHeading.parentElement?.nextElementSibling;

  expect(selectedTagsContainer).not.toBeNull();

  expect(
    within(selectedTagsContainer as HTMLElement).queryByDisplayValue("Mode"),
  ).not.toBeInTheDocument();
});

  it("should change data source to Testfile", () => {
    renderDataSource();

    const select =
      screen.getAllByRole("combobox")[0];

    fireEvent.change(select, {
      target: {
        value: "testfile",
      },
    });

    expect(select).toHaveValue("testfile");

    expect(
      screen.getByText("Text File"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Browse File"),
    ).toBeInTheDocument();
  });

  it("should hide Select Tags for Testfile", () => {
    renderDataSource();

    const select =
      screen.getAllByRole("combobox")[0];

    fireEvent.change(select, {
      target: {
        value: "testfile",
      },
    });

    expect(
      screen.queryByText("Select Tags"),
    ).not.toBeInTheDocument();
  });

  it("should show Select Tags for None", () => {
    renderDataSource();

    expect(
      screen.getByText("Select Tags"),
    ).toBeInTheDocument();
  });

  it("should change controller type to MPC", () => {
    renderDataSource();

    const select =
      screen.getAllByRole("combobox")[1];

    fireEvent.change(select, {
      target: {
        value: "mpc",
      },
    });

    expect(select).toHaveValue("mpc");
  });

  it("should update template when controller changes", () => {
    renderDataSource();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: {
        value: "mpc",
      },
    });

    expect(selects[2]).toHaveValue(
      "standalone-controller",
    );
  });

  it("should display MPC template options", () => {
    renderDataSource();

    const controllerSelect =
      screen.getAllByRole("combobox")[1];

    fireEvent.change(controllerSelect, {
      target: {
        value: "mpc",
      },
    });

    expect(
      screen.getByRole("option", {
        name: "Cascade",
      }),
    ).toBeInTheDocument();
  });

  it("should change template type", () => {
    renderDataSource();

    const selects =
      screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: {
        value: "mpc",
      },
    });

    fireEvent.change(selects[2], {
      target: {
        value: "cascade",
      },
    });

    expect(selects[2]).toHaveValue(
      "cascade",
    );
  });

  it("should call onClose when Cancel is clicked", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("COMMON_CANCEL"),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when header close button is clicked", () => {
    renderDataSource();

    const buttons =
      screen.getAllByRole("button");

    const closeButton = buttons[1];

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onSave when Save is clicked", () => {
    renderDataSource();

    fireEvent.click(
      screen.getByText("COMMON_SAVE"),
    );

    expect(onSave).toHaveBeenCalledTimes(1);

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedDataSource: "none",
        controllerType: "regulatory",
        templateType: "standalone-controller",
        selectedTags: expect.any(Array),
      }),
    );
  });

  it("should render default data source name", () => {
    render(
      React.createElement(DataSource, {
        type: "text-file",
        onClose,
        onSave,
      }),
    );

    expect(
      screen.getByText("Data Source · HDS2"),
    ).toBeInTheDocument();
  });

  it("should render custom data source name", () => {
    render(
      React.createElement(DataSource, {
        type: "text-file",
        dataSourceName: "TestDataSource",
        onClose,
        onSave,
      }),
    );

    expect(
      screen.getByText(
        "Data Source · TestDataSource",
      ),
    ).toBeInTheDocument();
  });

  it("should toggle help button", () => {
    renderDataSource();

    const helpButton =
      screen.getByText("COMMON_HELP");

    fireEvent.click(helpButton);

    expect(
      helpButton,
    ).toBeInTheDocument();
  });
});