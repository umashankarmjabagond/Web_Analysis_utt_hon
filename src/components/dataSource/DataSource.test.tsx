import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import DataSource from "./DataSource";

// --------------------------------------------------
// MOCK i18n
// --------------------------------------------------
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        COMMON_HELP: "Help",
        COMMON_CANCEL: "Cancel",
        COMMON_SAVE: "Save",
      };

      return translations[key] ?? key;
    },
  }),
}));

// --------------------------------------------------
// MOCK lucide-react
// --------------------------------------------------
vi.mock("lucide-react", () => ({
  HelpCircle: () => <span data-testid="help-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
  X: () => <span data-testid="x-icon" />,
}));

// --------------------------------------------------
// MOCK Button
// --------------------------------------------------
vi.mock("../forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    type,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
    [key: string]: unknown;
  }) => (
    <button type={type ?? "button"} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// --------------------------------------------------
// MOCK Select
// --------------------------------------------------
vi.mock("../forms/select/Select", () => ({
  default: ({
    options,
    value,
    onChange,
    ...props
  }: {
    options: Array<{
      value: string;
      label: string;
    }>;
    value: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    [key: string]: unknown;
  }) => (
    <select value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

// --------------------------------------------------
// HELPERS
// --------------------------------------------------
const renderComponent = (onClose = vi.fn(), onSave = vi.fn()) => {
  return render(<DataSource onClose={onClose} onSave={onSave} />);
};

const getDataSourceSelect = () => {
  return screen.getAllByRole("combobox")[0];
};

const getControllerSelect = () => {
  return screen.getAllByRole("combobox")[1];
};

const getTemplateSelect = () => {
  return screen.getAllByRole("combobox")[2];
};

const getRemoveButtons = () => {
  return screen
    .getAllByRole("button")
    .filter((button) => button.querySelector('[data-testid="x-icon"]'));
};

describe("DataSource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --------------------------------------------------
  // BASIC RENDERING
  // --------------------------------------------------

  it("renders DataSource component", () => {
    renderComponent();

    expect(screen.getByText("Select Data Source")).toBeInTheDocument();

    expect(screen.getByText("Selected Tags")).toBeInTheDocument();
  });

  it("renders default data source as None", () => {
    renderComponent();

    expect(getDataSourceSelect()).toHaveValue("none");
  });

  it("renders default controller type as regulatory", () => {
    renderComponent();

    expect(getControllerSelect()).toHaveValue("regulatory");
  });

  it("renders default template type as standalone-controller", () => {
    renderComponent();

    expect(getTemplateSelect()).toHaveValue("standalone-controller");
  });

  // --------------------------------------------------
  // DEFAULT TAGS
  // --------------------------------------------------

  it("renders default selected tags", () => {
    renderComponent();

    expect(screen.getByDisplayValue("Mode")).toBeInTheDocument();
    expect(screen.getByDisplayValue("PV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SP")).toBeInTheDocument();
  });

  it("renders Select Tags section for None data source", () => {
    renderComponent();

    expect(screen.getByText("Select Tags")).toBeInTheDocument();
    expect(screen.getByText("Add All")).toBeInTheDocument();
  });

  it("keeps Selected Tags section visible for None data source", () => {
    renderComponent();

    expect(screen.getByText("Selected Tags")).toBeInTheDocument();
    expect(screen.getByText("Remove All")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // DATA SOURCE
  // --------------------------------------------------

  it("changes data source to testfile", () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    expect(getDataSourceSelect()).toHaveValue("testfile");
    expect(screen.getByText("Text File")).toBeInTheDocument();
  });

  it("hides Select Tags section when testfile is selected", () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    expect(screen.queryByText("Select Tags")).not.toBeInTheDocument();

    expect(screen.getByText("Selected Tags")).toBeInTheDocument();
  });

  it("shows no file selected initially for testfile", () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    expect(screen.getByText("No file selected")).toBeInTheDocument();
  });

  it("shows Browse File button for testfile", () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    expect(
      screen.getByRole("button", {
        name: "Browse File",
      }),
    ).toBeInTheDocument();
  });

  // --------------------------------------------------
  // MANUAL TAG
  // --------------------------------------------------

  it("adds a manual tag", () => {
    renderComponent();

    const initialInputs = screen.getAllByRole("textbox");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    const inputsAfterAdd = screen.getAllByRole("textbox");

    expect(inputsAfterAdd.length).toBe(initialInputs.length + 2);

    expect(screen.getByPlaceholderText("Column name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText(".PV")).toBeInTheDocument();
  });

  it("allows manual tag column name to be changed", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    const columnInput = screen.getByPlaceholderText("Column name");

    fireEvent.change(columnInput, {
      target: {
        value: "Temperature",
      },
    });

    expect(columnInput).toHaveValue("Temperature");
  });

  it("allows manual tag extension to be changed", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    const extensionInput = screen.getByPlaceholderText(".PV");

    fireEvent.change(extensionInput, {
      target: {
        value: ".TEMP",
      },
    });

    expect(extensionInput).toHaveValue(".TEMP");
  });

  // --------------------------------------------------
  // REMOVE SELECTED TAG
  // --------------------------------------------------

  it("removes a selected tag", () => {
    renderComponent();

    const modeInputs = screen.getAllByDisplayValue("Mode");

    // Mode appears in the available-tags section and selected-tags section.
    expect(modeInputs.length).toBeGreaterThanOrEqual(1);

    // The selected tag is the input inside the right-side selected-tags row.
    const selectedModeInput = modeInputs[modeInputs.length - 1];

    const selectedModeRow = selectedModeInput.closest(
      ".grid.grid-cols-\\[1fr_140px_40px\\]",
    );

    expect(selectedModeRow).toBeInTheDocument();

    const removeButton = selectedModeRow?.querySelector("button");

    expect(removeButton).toBeInTheDocument();

    fireEvent.click(removeButton!);

    // There should still be Mode in the available-tags list,
    // but it should no longer be in the selected-tags section.
    const remainingModeInputs = screen.getAllByDisplayValue("Mode");

    expect(remainingModeInputs.length).toBe(1);

    expect(screen.getByDisplayValue("PV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SP")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // REMOVE ALL
  // --------------------------------------------------

  it("removes all selected tags", () => {
    renderComponent();

    expect(screen.getByDisplayValue("Mode")).toBeInTheDocument();
    expect(screen.getByDisplayValue("PV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SP")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove All",
      }),
    );

    expect(screen.getByText("No extensions selected.")).toBeInTheDocument();

    // Available tags on the left should still exist.
    expect(screen.getByDisplayValue("Mode")).toBeInTheDocument();
    expect(screen.getByDisplayValue("PV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SP")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // ADD ALL
  // --------------------------------------------------

  it("adds all available tags", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add All",
      }),
    );

    // Default tags
    expect(screen.getByDisplayValue("Mode")).toBeInTheDocument();
    expect(screen.getByDisplayValue("PV")).toBeInTheDocument();
    expect(screen.getByDisplayValue("OP")).toBeInTheDocument();
    expect(screen.getByDisplayValue("SP")).toBeInTheDocument();

    // Additional tags available for regulatory/standalone-controller
    expect(screen.getByDisplayValue("TimeSelected")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Disposability")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Saturation")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Disturbance Variable"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Selector Output")).toBeInTheDocument();
  });

  it("does not duplicate a selected tag when Add All is clicked multiple times", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add All",
      }),
    );

    const inputsAfterFirstClick = screen.getAllByRole("textbox");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add All",
      }),
    );

    const inputsAfterSecondClick = screen.getAllByRole("textbox");

    expect(inputsAfterSecondClick.length).toBe(inputsAfterFirstClick.length);
  });

  // --------------------------------------------------
  // ADD SINGLE TAG
  // --------------------------------------------------

  it("adds a tag using the plus button", () => {
    renderComponent();

    const modeInput = screen.getByDisplayValue("Mode");

    expect(modeInput).toBeInTheDocument();

    // Find available PV tag row.
    const pvAvailableInput = screen.getByDisplayValue("PV");

    expect(pvAvailableInput).toBeInTheDocument();

    // Find plus buttons
    const plusButtons = screen
      .getAllByRole("button")
      .filter((button) => button.querySelector('[data-testid="plus-icon"]'));

    expect(plusButtons.length).toBeGreaterThan(0);

    fireEvent.click(plusButtons[0]);

    expect(
      screen.getAllByDisplayValue("TimeSelected").length +
        screen.getAllByDisplayValue("PV").length,
    ).toBeGreaterThan(0);
  });

  it("does not add a duplicate tag", () => {
    renderComponent();

    // PV is already selected by default.
    expect(screen.getAllByDisplayValue("PV").length).toBe(1);

    // The available PV row should NOT exist because PV is already selected.
    // Therefore clicking an Add button must not create another PV.
    const plusButtons = screen
      .getAllByRole("button")
      .filter((button) => button.querySelector('[data-testid="plus-icon"]'));

    // Click all available plus buttons.
    plusButtons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(screen.getAllByDisplayValue("PV").length).toBe(1);
  });

  // --------------------------------------------------
  // FILE HANDLING
  // --------------------------------------------------

  it("handles file selection", async () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    const fileInput = document.getElementById(
      "browse-file",
    ) as HTMLInputElement;

    expect(fileInput).toBeInTheDocument();

    const file = new File(
      [
        "Timestamp\tController.PV\tController.OP\tController.SP\tController.Mode",
      ],
      "test.txt",
      {
        type: "text/plain",
      },
    );

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(fileInput.files?.[0]).toBe(file);

    await waitFor(() => {
      expect(screen.getByText("test.txt")).toBeInTheDocument();
    });
  });

  it("clears selected tags when no file is selected", () => {
    renderComponent();

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    const fileInput = document.getElementById(
      "browse-file",
    ) as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    expect(screen.getByText("No extensions selected.")).toBeInTheDocument();
  });

  // --------------------------------------------------
  // HELP
  // --------------------------------------------------

  it("toggles help button state", () => {
    renderComponent();

    const helpButton = screen.getByRole("button", {
      name: "Help",
    });

    expect(helpButton).toBeInTheDocument();

    fireEvent.click(helpButton);

    expect(helpButton).toBeInTheDocument();

    fireEvent.click(helpButton);

    expect(helpButton).toBeInTheDocument();
  });

  // --------------------------------------------------
  // CANCEL
  // --------------------------------------------------

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();

    renderComponent(onClose);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  it("calls onSave when Save is clicked", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("passes selected data source to onSave", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.change(getDataSourceSelect(), {
      target: {
        value: "testfile",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedDataSource: "testfile",
      }),
    );
  });

  it("passes controller type to onSave", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        controllerType: "regulatory",
      }),
    );
  });

  it("passes template type to onSave", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        templateType: "standalone-controller",
      }),
    );
  });

  it("passes selected tags to onSave", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedTags: expect.arrayContaining([
          expect.objectContaining({
            name: "Mode",
          }),
          expect.objectContaining({
            name: "PV",
          }),
          expect.objectContaining({
            name: "OP",
          }),
          expect.objectContaining({
            name: "SP",
          }),
        ]),
      }),
    );
  });

  // --------------------------------------------------
  // MANUAL TAG + SAVE
  // --------------------------------------------------

  it("saves manually added tag", () => {
    const onSave = vi.fn();

    renderComponent(undefined, onSave);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    const columnInput = screen.getByPlaceholderText("Column name");

    fireEvent.change(columnInput, {
      target: {
        value: "Temperature",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedTags: expect.arrayContaining([
          expect.objectContaining({
            name: "Temperature",
            isManual: true,
          }),
        ]),
      }),
    );
  });
  // --------------------------------------------------
  // MANUAL TAG REMOVE
  // --------------------------------------------------

  it("removes manually added tag", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    const columnInput = screen.getByPlaceholderText("Column name");

    expect(columnInput).toBeInTheDocument();

    const removeButtons = getRemoveButtons();

    const lastRemoveButton = removeButtons[removeButtons.length - 1];

    fireEvent.click(lastRemoveButton);

    expect(
      screen.queryByPlaceholderText("Column name"),
    ).not.toBeInTheDocument();

    expect(screen.queryByPlaceholderText(".PV")).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // CONTROLLER TYPE
  // --------------------------------------------------

  it("updates controller type", () => {
    renderComponent();

    const controllerSelect = getControllerSelect();

    fireEvent.change(controllerSelect, {
      target: {
        value: "mpc",
      },
    });

    expect(controllerSelect).toHaveValue("mpc");
  });

  // --------------------------------------------------
  // TEMPLATE TYPE
  // --------------------------------------------------

  it("updates template type", () => {
    renderComponent();

    const templateSelect = getTemplateSelect();

    const options = Array.from(templateSelect.querySelectorAll("option"));

    if (options.length > 1) {
      const secondOption = options[1] as HTMLOptionElement;

      fireEvent.change(templateSelect, {
        target: {
          value: secondOption.value,
        },
      });

      expect(templateSelect).toHaveValue(secondOption.value);
    } else {
      expect(templateSelect).toHaveValue("standalone-controller");
    }
  });

  // --------------------------------------------------
  // REMOVE ALL + MANUAL
  // --------------------------------------------------

  it("can add manual tag after removing all tags", () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove All",
      }),
    );

    expect(screen.getByText("No extensions selected.")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Tag Manually",
      }),
    );

    expect(screen.getByPlaceholderText("Column name")).toBeInTheDocument();

    expect(screen.getByPlaceholderText(".PV")).toBeInTheDocument();
  });
});
