import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";

import Properties from "./Properties";

/* -------------------------------------------------------------------------- */
/*                              Component Mocks                               */
/* -------------------------------------------------------------------------- */

vi.mock("../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    type = "button",
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
  }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("../../components/forms/input/Input", () => ({
  default: ({
    label,
    error,
    ...props
  }: {
    label?: string;
    error?: string;
    [key: string]: unknown;
  }) => {
    const inputId =
      typeof props.id === "string"
        ? props.id
        : typeof props.name === "string"
          ? props.name
          : label;

    return (
      <div>
        {label && <label htmlFor={inputId}>{label}</label>}

        <input id={inputId} {...props} />

        {error && <span role="alert">{error}</span>}
      </div>
    );
  },
}));

vi.mock("../../components/forms/select/Select", () => ({
  default: ({
    options = [],
    ...props
  }: {
    options?: {
      label: string;
      value: string;
    }[];
    [key: string]: unknown;
  }) => (
    <select aria-label="Reference Column" {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock("../../components/forms/textarea/TextArea", () => ({
  default: ({
    label,
    ...props
  }: {
    label?: string;
    [key: string]: unknown;
  }) => {
    const textareaId =
      typeof props.id === "string"
        ? props.id
        : typeof props.name === "string"
          ? props.name
          : label;

    return (
      <div>
        {label && <label htmlFor={textareaId}>{label}</label>}

        <textarea id={textareaId} {...props} />
      </div>
    );
  },
}));

/* -------------------------------------------------------------------------- */
/*                              Properties Tests                              */
/* -------------------------------------------------------------------------- */

describe("Properties", () => {
  /* ------------------------------------------------------------------------ */
  /*                              Rendering                                   */
  /* ------------------------------------------------------------------------ */

  it("renders page title", () => {
    render(<Properties />);

    expect(screen.getByText("Data Preprocessing Wizard")).toBeInTheDocument();
  });

  it("renders header buttons", () => {
    render(<Properties />);

    expect(
      screen.getByRole("button", {
        name: "Help",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Apply To All",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: "Save",
      }),
    ).toHaveLength(2);
  });

  it("renders section headings", () => {
    render(<Properties />);

    expect(screen.getByText("Threshold")).toBeInTheDocument();

    expect(screen.getByText("Expression")).toBeInTheDocument();
  });

  it("renders all column options", () => {
    render(<Properties />);

    expect(screen.getAllByText("01-LC0524.MODE").length).toBeGreaterThan(0);

    expect(screen.getAllByText("01-LC0524.OP").length).toBeGreaterThan(0);

    expect(screen.getAllByText("01-LC0524.PV").length).toBeGreaterThan(0);

    expect(screen.getAllByText("01-LC0524.SP").length).toBeGreaterThan(0);

    expect(screen.getAllByText("01-LC0524.STATUS").length).toBeGreaterThan(0);
  });

  /* ------------------------------------------------------------------------ */
  /*                           Default Values                                 */
  /* ------------------------------------------------------------------------ */

  it("renders default warning threshold", () => {
    render(<Properties />);

    expect(screen.getByLabelText("Warning Threshold %")).toHaveValue("10");
  });

  it("renders default abort threshold", () => {
    render(<Properties />);

    expect(screen.getByLabelText("Abort Threshold %")).toHaveValue("20");
  });

  it("renders default reference column", () => {
    render(<Properties />);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("mode");
  });

  /* ------------------------------------------------------------------------ */
  /*                         Warning Threshold                                */
  /* ------------------------------------------------------------------------ */

  it("updates warning threshold", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const input = screen.getByLabelText("Warning Threshold %");

    await user.clear(input);
    await user.type(input, "15");

    expect(input).toHaveValue("15");
  });

  /* ------------------------------------------------------------------------ */
  /*                          Abort Threshold                                 */
  /* ------------------------------------------------------------------------ */

  it("updates abort threshold", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const input = screen.getByLabelText("Abort Threshold %");

    await user.clear(input);
    await user.type(input, "25");

    expect(input).toHaveValue("25");
  });

  /* ------------------------------------------------------------------------ */
  /*                           Reference Column                               */
  /* ------------------------------------------------------------------------ */

  it("updates reference column from select", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const select = screen.getByRole("combobox", {
      name: "Reference Column",
    });

    await user.selectOptions(select, "pv");

    expect(select).toHaveValue("pv");
  });

  /* ------------------------------------------------------------------------ */
  /*                        Bad Data Expression                               */
  /* ------------------------------------------------------------------------ */

  it("updates bad data expression", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const textarea = screen.getByLabelText("Bad Data Expression");

    await user.type(textarea, "bad data formula");

    expect(textarea).toHaveValue("bad data formula");
  });

  /* ------------------------------------------------------------------------ */
  /*                     Replacement Expression                              */
  /* ------------------------------------------------------------------------ */

  it("updates replacement expression", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const textarea = screen.getByLabelText("Replacement Expression");

    await user.type(textarea, "replacement formula");

    expect(textarea).toHaveValue("replacement formula");
  });

  /* ------------------------------------------------------------------------ */
  /*                         Left Panel Selection                             */
  /* ------------------------------------------------------------------------ */

  it("changes selected column from left panel", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const pvButtons = screen.getAllByRole("button", {
      name: "01-LC0524.PV",
    });

    expect(pvButtons.length).toBeGreaterThan(0);

    await user.click(pvButtons[0]);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("pv");
  });

  it("changes selected column to mode", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const buttons = screen.getAllByRole("button", {
      name: "01-LC0524.MODE",
    });

    await user.click(buttons[0]);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("mode");
  });

  it("changes selected column to op", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const buttons = screen.getAllByRole("button", {
      name: "01-LC0524.OP",
    });

    await user.click(buttons[0]);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("op");
  });

  it("changes selected column to sp", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const buttons = screen.getAllByRole("button", {
      name: "01-LC0524.SP",
    });

    await user.click(buttons[0]);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("sp");
  });

  it("changes selected column to status", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const buttons = screen.getAllByRole("button", {
      name: "01-LC0524.STATUS",
    });

    await user.click(buttons[0]);

    expect(
      screen.getByRole("combobox", {
        name: "Reference Column",
      }),
    ).toHaveValue("status");
  });

  /* ------------------------------------------------------------------------ */
  /*                         Complete Form                                    */
  /* ------------------------------------------------------------------------ */

  it("updates the entire form", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const warningInput = screen.getByLabelText("Warning Threshold %");

    const abortInput = screen.getByLabelText("Abort Threshold %");

    const referenceColumn = screen.getByRole("combobox", {
      name: "Reference Column",
    });

    const badExpression = screen.getByLabelText("Bad Data Expression");

    const replacementExpression = screen.getByLabelText(
      "Replacement Expression",
    );

    await user.clear(warningInput);
    await user.type(warningInput, "50");

    await user.clear(abortInput);
    await user.type(abortInput, "80");

    await user.selectOptions(referenceColumn, "status");

    await user.type(badExpression, "bad expression");

    await user.type(replacementExpression, "replacement expression");

    expect(warningInput).toHaveValue("50");

    expect(abortInput).toHaveValue("80");

    expect(referenceColumn).toHaveValue("status");

    expect(badExpression).toHaveValue("bad expression");

    expect(replacementExpression).toHaveValue("replacement expression");
  });

  /* ------------------------------------------------------------------------ */
  /*                              Help                                        */
  /* ------------------------------------------------------------------------ */

  it("allows clicking Help", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const helpButton = screen.getByRole("button", {
      name: "Help",
    });

    await user.click(helpButton);

    expect(helpButton).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------------ */
  /*                           Apply To All                                   */
  /* ------------------------------------------------------------------------ */

  it("allows clicking Apply To All", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const applyButton = screen.getByRole("button", {
      name: "Apply To All",
    });

    await user.click(applyButton);

    expect(applyButton).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------------ */
  /*                               Save                                       */
  /* ------------------------------------------------------------------------ */

  it("renders two Save buttons", () => {
    render(<Properties />);

    expect(
      screen.getAllByRole("button", {
        name: "Save",
      }),
    ).toHaveLength(2);
  });

  it("allows clicking header Save", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const saveButtons = screen.getAllByRole("button", {
      name: "Save",
    });

    await user.click(saveButtons[0]);

    expect(saveButtons[0]).toBeInTheDocument();
  });

  it("allows clicking footer Save", async () => {
    const user = userEvent.setup();

    render(<Properties />);

    const saveButtons = screen.getAllByRole("button", {
      name: "Save",
    });

    await user.click(saveButtons[1]);

    expect(saveButtons[1]).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------------ */
  /*                              Cancel                                      */
  /* ------------------------------------------------------------------------ */

  it("renders Cancel button", () => {
    render(<Properties />);

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();

    const onCancel = vi.fn();

    render(<Properties onCancel={onCancel} />);

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  /* ------------------------------------------------------------------------ */
  /*                         Refresh Actions                                  */
  /* ------------------------------------------------------------------------ */

  it("starts bad expression refresh loading", () => {
    vi.useFakeTimers();

    try {
      render(<Properties />);

      const refreshButton = screen.getByRole("button", {
        name: "Refresh bad data expression",
      });

      act(() => {
        fireEvent.click(refreshButton);
      });

      expect(refreshButton).toHaveClass("animate-spin");

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(refreshButton).not.toHaveClass("animate-spin");
    } finally {
      vi.useRealTimers();
    }
  });

  it("starts replacement expression refresh loading", () => {
    vi.useFakeTimers();

    try {
      render(<Properties />);

      const refreshButton = screen.getByRole("button", {
        name: "Refresh replacement expression",
      });

      act(() => {
        fireEvent.click(refreshButton);
      });

      expect(refreshButton).toHaveClass("animate-spin");

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(refreshButton).not.toHaveClass("animate-spin");
    } finally {
      vi.useRealTimers();
    }
  });

  /* ------------------------------------------------------------------------ */
  /*                              Smoke Test                                  */
  /* ------------------------------------------------------------------------ */

  it("renders without crashing", () => {
    expect(() => {
      render(<Properties />);
    }).not.toThrow();
  });
});
