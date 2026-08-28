import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DialogDataPreprocessing from "./DialogDataPreprocessing";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../components/common/dialogue/Dialog", () => ({
  default: ({
    children,
    title,
    isOpen,
  }: {
    children: React.ReactNode;
    title: string;
    isOpen: boolean;
  }) =>
    isOpen ? (
      <div data-testid="dialog">
        <div>{title}</div>
        {children}
      </div>
    ) : null,
}));

vi.mock("../../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock("../../../components/forms/input/Input", () => ({
  default: ({
    label,
    placeholder,
    value,
    onChange,
  }: {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  ),
}));

vi.mock("../../../components/forms/textarea/TextArea", () => ({
  default: ({
    label,
    placeholder,
    value,
    onChange,
  }: {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  }) => (
    <label>
      {label}
      <textarea
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  ),
}));

describe("DialogDataPreprocessing", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the dialog when isOpen is true", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("does not render the dialog when isOpen is false", () => {
      render(<DialogDataPreprocessing isOpen={false} onClose={onClose} />);

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders the dialog title", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(screen.getByText("Data Preprocessing (DPP)")).toBeInTheDocument();
    });

    it("renders the column expressions heading", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByText("PROPERTIES_EDIT_COLUMNS_EXPRESSIONS"),
      ).toBeInTheDocument();
    });

    it("renders the expressions heading", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByText("PROPERTIES_EDIT_EXPRESSIONS"),
      ).toBeInTheDocument();
    });
  });

  describe("column list", () => {
    it("renders all available columns", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByRole("button", {
          name: "Mode (.MODE)",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "OP (.OP)",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "PV (.PV)",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "SP (.SP)",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Required Flag (.REQ)",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Test (.TM)",
        }),
      ).toBeInTheDocument();
    });

    it("renders exactly six column buttons", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const columnButtons = [
        "Mode (.MODE)",
        "OP (.OP)",
        "PV (.PV)",
        "SP (.SP)",
        "Required Flag (.REQ)",
        "Test (.TM)",
      ];

      columnButtons.forEach((column) => {
        expect(
          screen.getByRole("button", {
            name: column,
          }),
        ).toBeInTheDocument();
      });
    });

    it("selects Mode (.MODE) initially", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const modeButton = screen.getByRole("button", {
        name: "Mode (.MODE)",
      });

      expect(modeButton.className).toContain("bg-surface-hover");

      expect(screen.getByText("SELECTED COLUMN")).toBeInTheDocument();

      const selectedColumn = screen.getAllByText("Mode (.MODE)");

      expect(selectedColumn.length).toBe(2);
    });

    it("selects OP (.OP) when OP is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const opButton = screen.getByRole("button", {
        name: "OP (.OP)",
      });

      fireEvent.click(opButton);

      expect(opButton.className).toContain("bg-surface-hover");

      expect(screen.getAllByText("OP (.OP)").length).toBe(2);

      const modeButton = screen.getByRole("button", {
        name: "Mode (.MODE)",
      });

      expect(modeButton.className).toContain("bg-transparent");
    });

    it("selects PV (.PV) when PV is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "PV (.PV)",
        }),
      );

      expect(screen.getAllByText("PV (.PV)").length).toBe(2);
    });

    it("selects SP (.SP) when SP is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "SP (.SP)",
        }),
      );

      expect(screen.getAllByText("SP (.SP)").length).toBe(2);
    });

    it("selects Required Flag (.REQ) when clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Required Flag (.REQ)",
        }),
      );

      expect(screen.getAllByText("Required Flag (.REQ)").length).toBe(2);
    });

    it("selects Test (.TM) when Test is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Test (.TM)",
        }),
      );

      expect(screen.getAllByText("Test (.TM)").length).toBe(2);
    });
  });

  describe("selected column", () => {
    it("shows Mode (.MODE) initially", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const selectedColumns = screen.getAllByText("Mode (.MODE)");

      expect(selectedColumns.length).toBeGreaterThan(0);
    });

    it("shows OP (.OP) after selecting OP", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "OP (.OP)",
        }),
      );

      expect(screen.getAllByText("OP (.OP)").length).toBe(2);
    });

    it("shows Test (.TM) after selecting Test", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Test (.TM)",
        }),
      );

      expect(screen.getAllByText("Test (.TM)").length).toBe(2);
    });
  });

  describe("threshold inputs", () => {
    it("renders Warning Threshold input", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_WARNING_THRESHOLD"),
      ).toBeInTheDocument();
    });

    it("renders Abort Threshold input", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_ABORT_THRESHOLD"),
      ).toBeInTheDocument();
    });

    it("renders Enter placeholder for Warning Threshold", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_WARNING_THRESHOLD"),
      ).toHaveAttribute("placeholder", "Enter");
    });

    it("renders Enter placeholder for Abort Threshold", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_ABORT_THRESHOLD"),
      ).toHaveAttribute("placeholder", "Enter");
    });

    it("updates Warning Threshold value", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_WARNING_THRESHOLD");

      fireEvent.change(input, {
        target: {
          value: "10",
        },
      });

      expect(input).toHaveValue("10");
    });

    it("updates Abort Threshold value", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_ABORT_THRESHOLD");

      fireEvent.change(input, {
        target: {
          value: "20",
        },
      });

      expect(input).toHaveValue("20");
    });
  });

  describe("expressions", () => {
    it("renders Bad Data Expression textarea", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_BAD_DATA_EXPRESSION"),
      ).toBeInTheDocument();
    });

    it("renders Replacement Expression textarea", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_REPLACEMENT_EXPRESSION"),
      ).toBeInTheDocument();
    });

    it("renders the Bad Data Expression placeholder", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_BAD_DATA_EXPRESSION"),
      ).toHaveAttribute(
        "placeholder",
        "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
      );
    });

    it("renders Enter placeholder for Replacement Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_REPLACEMENT_EXPRESSION"),
      ).toHaveAttribute("placeholder", "Enter");
    });

    it("updates Bad Data Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByLabelText("PROPERTIES_BAD_DATA_EXPRESSION");

      fireEvent.change(textarea, {
        target: {
          value: "value > 100",
        },
      });

      expect(textarea).toHaveValue("value > 100");
    });

    it("updates Replacement Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByLabelText(
        "PROPERTIES_REPLACEMENT_EXPRESSION",
      );

      fireEvent.change(textarea, {
        target: {
          value: "0",
        },
      });

      expect(textarea).toHaveValue("0");
    });
  });

  describe("refresh buttons", () => {
    it("renders Bad Data Expression refresh button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_REFRESH_BAD_DATA_EXPRESSION"),
      ).toBeInTheDocument();
    });

    it("renders Replacement Expression refresh button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByLabelText("PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION"),
      ).toBeInTheDocument();
    });

    it("clears Bad Data Expression when refresh is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByLabelText("PROPERTIES_BAD_DATA_EXPRESSION");

      fireEvent.change(textarea, {
        target: {
          value: "test expression",
        },
      });

      expect(textarea).toHaveValue("test expression");

      fireEvent.click(
        screen.getByLabelText("PROPERTIES_REFRESH_BAD_DATA_EXPRESSION"),
      );

      expect(textarea).toHaveValue("");
    });

    it("clears Replacement Expression when refresh is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByLabelText(
        "PROPERTIES_REPLACEMENT_EXPRESSION",
      );

      fireEvent.change(textarea, {
        target: {
          value: "replacement value",
        },
      });

      expect(textarea).toHaveValue("replacement value");

      fireEvent.click(
        screen.getByLabelText("PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION"),
      );

      expect(textarea).toHaveValue("");
    });
  });

  describe("refresh timeout completion", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("stops the bad data refresh spinner after the timeout elapses", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const refreshButton = screen.getByLabelText(
        "PROPERTIES_REFRESH_BAD_DATA_EXPRESSION",
      );

      fireEvent.click(refreshButton);
      expect(refreshButton.getAttribute("class")).toContain("animate-spin");

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(refreshButton.getAttribute("class")).not.toContain("animate-spin");
      expect(refreshButton.getAttribute("class")).toContain("hover:rotate-90");
    });

    it("stops the replacement expression refresh spinner after the timeout elapses", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const refreshButton = screen.getByLabelText(
        "PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION",
      );

      fireEvent.click(refreshButton);
      expect(refreshButton.getAttribute("class")).toContain("animate-spin");

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(refreshButton.getAttribute("class")).not.toContain("animate-spin");
      expect(refreshButton.getAttribute("class")).toContain("hover:rotate-90");
    });
  });

  describe("footer buttons", () => {
    it("renders Help button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByRole("button", {
          name: "COMMON_HELP",
        }),
      ).toBeInTheDocument();
    });

    it("renders Apply to All button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByRole("button", {
          name: "COMMON_APPLY_TO_ALL",
        }),
      ).toBeInTheDocument();
    });

    it("renders Cancel button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByRole("button", {
          name: "COMMON_CANCEL",
        }),
      ).toBeInTheDocument();
    });

    it("renders Save button", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByRole("button", {
          name: "COMMON_SAVE",
        }),
      ).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "COMMON_CANCEL",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Save is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "COMMON_SAVE",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when Apply to All is clicked", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "COMMON_APPLY_TO_ALL",
        }),
      );

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
