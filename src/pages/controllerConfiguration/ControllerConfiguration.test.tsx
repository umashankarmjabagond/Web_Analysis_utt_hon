import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ControllerConfiguration from "./ControllerConfiguration";

/* --------------------------------------------------
 * Mock react-i18next
 * -------------------------------------------------- */

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string | number>) => {
      if (key === "CONTROLLER_STEP" && params) {
        return `Step ${params.current} of ${params.total}`;
      }

      if (key === "CONTROLLER_RESET" && params) {
        return `Reset ${params.field}`;
      }

      return key;
    },
  }),
}));

describe("ControllerConfiguration", () => {
  const defaultProps = {
    onCancel: vi.fn(),
    onFinish: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ==================================================
   * STEP 1
   * ================================================== */

  it("renders Step 1 by default", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    expect(
      screen.getByText("Step 1 of 6 - CONTROLLER_STEP_1_TITLE"),
    ).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_OP_PV_RANGE")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_SAMPLE_INTERVAL")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_SAMPLING_OPTIONS")).toBeInTheDocument();
  });

  it("renders default OP/PV values", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    expect(screen.getByDisplayValue("-5")).toBeInTheDocument();

    expect(screen.getByDisplayValue("0")).toBeInTheDocument();

    expect(screen.getByDisplayValue("105")).toBeInTheDocument();

    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("updates OP Min when the user changes the value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const input = screen.getByDisplayValue("-5");

    fireEvent.change(input, {
      target: {
        value: "-10",
      },
    });

    expect(screen.getByDisplayValue("-10")).toBeInTheDocument();
  });

  it("updates PV Min when the user changes the value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const input = screen.getByDisplayValue("0");

    fireEvent.change(input, {
      target: {
        value: "-20",
      },
    });

    expect(screen.getByDisplayValue("-20")).toBeInTheDocument();
  });

  it("updates OP Max when the user changes the value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const input = screen.getByDisplayValue("105");

    fireEvent.change(input, {
      target: {
        value: "110",
      },
    });

    expect(screen.getByDisplayValue("110")).toBeInTheDocument();
  });

  it("updates PV Max when the user changes the value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const input = screen.getByDisplayValue("100");

    fireEvent.change(input, {
      target: {
        value: "120",
      },
    });

    expect(screen.getByDisplayValue("120")).toBeInTheDocument();
  });

  /* ==================================================
   * RESET
   * ================================================== */

  it("resets OP/PV range fields to their initial values", () => {
    const { container } = render(<ControllerConfiguration {...defaultProps} />);

    const opMin = screen.getByDisplayValue("-5");
    const pvMin = screen.getByDisplayValue("0");
    const opMax = screen.getByDisplayValue("105");
    const pvMax = screen.getByDisplayValue("100");

    fireEvent.change(opMin, {
      target: {
        value: "-20",
      },
    });

    fireEvent.change(pvMin, {
      target: {
        value: "20",
      },
    });

    fireEvent.change(opMax, {
      target: {
        value: "200",
      },
    });

    fireEvent.change(pvMax, {
      target: {
        value: "300",
      },
    });

    const resetIcon = container.querySelector(
      ".text-controller-reset-foreground",
    );

    expect(resetIcon).toBeTruthy();

    fireEvent.click(resetIcon!);

    expect(screen.getByDisplayValue("-5")).toBeInTheDocument();

    expect(screen.getByDisplayValue("0")).toBeInTheDocument();

    expect(screen.getByDisplayValue("105")).toBeInTheDocument();

    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  /* ==================================================
   * SAMPLE INTERVAL
   * ================================================== */

  it("selects specified sample interval", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const specifiedRadio = screen.getByDisplayValue("specified");

    expect(specifiedRadio).not.toBeChecked();

    fireEvent.click(specifiedRadio);

    expect(specifiedRadio).toBeChecked();
  });

  it("updates specified sample interval", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(screen.getByDisplayValue("specified"));

    const input = screen.getByDisplayValue("0.00");

    fireEvent.change(input, {
      target: {
        value: "5.00",
      },
    });

    expect(screen.getByDisplayValue("5.00")).toBeInTheDocument();
  });

  /* ==================================================
   * CHECKBOX
   * ================================================== */

  it("toggles isSlave checkbox", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  /* ==================================================
   * NEXT / BACK
   * ================================================== */

  it("moves from Step 1 to Step 2 when Next is clicked", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    expect(
      screen.getByText("Step 2 of 6 - CONTROLLER_STEP_2_TITLE"),
    ).toBeInTheDocument();
  });

  it("moves from Step 2 back to Step 1", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    expect(
      screen.getByText("Step 2 of 6 - CONTROLLER_STEP_2_TITLE"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_BACK",
      }),
    );

    expect(
      screen.getByText("Step 1 of 6 - CONTROLLER_STEP_1_TITLE"),
    ).toBeInTheDocument();
  });

  it("disables Back button on Step 1", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    expect(
      screen.getByRole("button", {
        name: "BUTTON_BACK",
      }),
    ).toBeDisabled();
  });

  /* ==================================================
   * STEP 2
   * ================================================== */

  it("renders PV, SP and OP normalization fields on Step 2", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    expect(
      screen.getByText("CONTROLLER_NORMALIZATION_DESCRIPTION"),
    ).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_PV")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_SP")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_OP")).toBeInTheDocument();
  });

  it("updates PV normalization value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    /*
     * Input component currently does not connect
     * label -> input using htmlFor/id.
     *
     * Therefore getByLabelText() cannot be used here.
     *
     * Step 2 contains exactly 3 text inputs:
     * PV, SP and OP.
     *
     * The first input is PV.
     */
    const inputs = screen.getAllByRole("textbox");

    expect(inputs).toHaveLength(3);

    const pvInput = inputs[0];

    fireEvent.change(pvInput, {
      target: {
        value: "PV * 100",
      },
    });

    expect(screen.getByDisplayValue("PV * 100")).toBeInTheDocument();
  });

  it("updates SP normalization value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    const inputs = screen.getAllByRole("textbox");

    expect(inputs).toHaveLength(3);

    const spInput = inputs[1];

    fireEvent.change(spInput, {
      target: {
        value: "SP * 10",
      },
    });

    expect(screen.getByDisplayValue("SP * 10")).toBeInTheDocument();
  });

  it("updates OP normalization value", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "BUTTON_NEXT",
      }),
    );

    const inputs = screen.getAllByRole("textbox");

    expect(inputs).toHaveLength(3);

    const opInput = inputs[2];

    fireEvent.change(opInput, {
      target: {
        value: "OP * 5",
      },
    });

    expect(screen.getByDisplayValue("OP * 5")).toBeInTheDocument();
  });

  /* ==================================================
   * STEP 3
   * ================================================== */

  it("renders auxiliary normalization fields on Step 3", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 2; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(screen.getByText("CONTROLLER_AUX_1")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_AUX_2")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_AUX_3")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_IN_GAP")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_FEED_FORWARD")).toBeInTheDocument();
  });

  /* ==================================================
   * STEP 4
   * ================================================== */

  it("renders Bad Data and Plant Information on Step 4", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 3; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(screen.getByText("CONTROLLER_BAD_DATA_OPTIONS")).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_PLANT_INFORMATION"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_ELIMINATION_EXPRESSION"),
    ).toBeInTheDocument();
  });

  it("toggles Allow Robust Diagnostic", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 3; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    const checkboxes = screen.getAllByRole("checkbox");

    const robustDiagnostic = checkboxes[0];

    expect(robustDiagnostic).toBeChecked();

    fireEvent.click(robustDiagnostic);

    expect(robustDiagnostic).not.toBeChecked();
  });

  /* ==================================================
   * STEP 5
   * ================================================== */

  it("renders tuning information on Step 5", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 4; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(
      screen.getByText("CONTROLLER_TUNING_INFORMATION"),
    ).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_COMMENT")).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_TUNING_HISTORY_DAYS"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "CONTROLLER_BROWSE_HISTORY",
      }),
    ).toBeInTheDocument();
  });

  it("updates comment on Step 5", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 4; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    const textareas = screen.getAllByRole("textbox");

    /*
     * Step 5 contains the comment TextArea.
     * Find textarea specifically.
     */
    const textarea = screen.getByRole("textbox", {
      name: "",
    });

    fireEvent.change(textarea, {
      target: {
        value: "Test tuning comment",
      },
    });

    expect(screen.getByDisplayValue("Test tuning comment")).toBeInTheDocument();
  });

  /* ==================================================
   * STEP 6
   * ================================================== */

  it("renders Sensor Limits and Tolerance on Step 6", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(screen.getByText("CONTROLLER_SENSOR_MAX_MIN")).toBeInTheDocument();

    expect(screen.getByText("CONTROLLER_TOLERANCE")).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_SHOW_ADVANCED_SETTINGS"),
    ).toBeInTheDocument();
  });

  /* ==================================================
   * ADVANCED SETTINGS
   * ================================================== */

  it("shows advanced settings by default", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(
      screen.getByText("CONTROLLER_ADVANCED_SETTINGS"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_MAX_MEASUREMENT_CHANGE"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("CONTROLLER_MIN_MEASUREMENT_CHANGE"),
    ).toBeInTheDocument();
  });

  it("hides advanced settings when checkbox is unchecked", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(
      screen.queryByText("CONTROLLER_ADVANCED_SETTINGS"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("CONTROLLER_MAX_MEASUREMENT_CHANGE"),
    ).not.toBeInTheDocument();
  });

  /* ==================================================
   * CANCEL
   * ================================================== */

  it("calls onCancel when Cancel is clicked", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "COMMON_CANCEL",
      }),
    );

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  /* ==================================================
   * FINISH
   * ================================================== */

  it("calls onFinish when Finish is clicked on Step 6", () => {
    render(<ControllerConfiguration {...defaultProps} />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(
        screen.getByRole("button", {
          name: "BUTTON_NEXT",
        }),
      );
    }

    expect(
      screen.getByRole("button", {
        name: "CONTROLLER_FINISH",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "CONTROLLER_FINISH",
      }),
    );

    expect(defaultProps.onFinish).toHaveBeenCalledTimes(1);
  });
});
