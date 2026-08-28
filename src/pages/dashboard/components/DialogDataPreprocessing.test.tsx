import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DialogDataPreprocessing from "./DialogDataPreprocessing";

// ---------------------------------------------------------
// i18n mock
// ---------------------------------------------------------

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

// ---------------------------------------------------------
// Dialog mock
// ---------------------------------------------------------

vi.mock("../../../components/common/dialogue/Dialog", () => ({
  default: ({
    isOpen,
    title,
    subtitle,
    children,
  }: {
    isOpen: boolean;
    title: string;
    subtitle: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div data-testid="dialog">
        <div>{title}</div>
        <div>{subtitle}</div>
        {children}
      </div>
    );
  },
}));

// ---------------------------------------------------------
// Button mock
// ---------------------------------------------------------

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
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// ---------------------------------------------------------
// Input mock
// ---------------------------------------------------------

vi.mock("../../../components/forms/input/Input", () => ({
  default: ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }) => (
    <div>
      <label>
        {label}
        <input aria-label={label} value={value} onChange={onChange} />
      </label>
    </div>
  ),
}));

// ---------------------------------------------------------
// TextArea mock
// ---------------------------------------------------------

vi.mock("../../../components/forms/textarea/TextArea", () => ({
  default: ({
    label,
    placeholder,
    value,
    onChange,
  }: {
    label: string;
    placeholder: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  }) => (
    <div>
      <label>
        {label}
        <textarea
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  ),
}));

// ---------------------------------------------------------
// Select mock
// ---------------------------------------------------------

vi.mock("../../../components/forms/select/Select", () => ({
  default: ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    options: Array<{
      value: string;
      label: string;
    }>;
  }) => (
    <select aria-label="Reference Column" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

// ---------------------------------------------------------
// Tests
// ---------------------------------------------------------

describe("DialogDataPreprocessing", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  // ========================================================
  // VISIBILITY
  // ========================================================

  describe("visibility", () => {
    it("does not render the dialog when isOpen is false", () => {
      render(<DialogDataPreprocessing isOpen={false} onClose={onClose} />);

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders the dialog when isOpen is true", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });
  });

  // ========================================================
  // HEADER
  // ========================================================

  describe("header", () => {
    it("renders the title using the translation key", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(screen.getByText("PROPERTIES_DPR_TITLE")).toBeInTheDocument();
    });

    it("renders the correct subtitle using the translation key", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByText("PROPERTIES_DPR_SUBTITLE_LABEL"),
      ).toBeInTheDocument();
    });
  });

  // ========================================================
  // COLUMN LIST
  // ========================================================

  describe("column list", () => {
    const columns = [
      "HDS2.MODE",
      "HDS2.OP",
      "HDS2.PV",
      "HDS2.SP",
      "01-LC200.MODE",
      "01-LC200.OP",
      "01-LC200.PV",
      "01-LC200.SP",
      "02-PC237.MODE",
      "02-PC237.OP",
      "02-PC237.PV",
      "02-PC237.SP",
      "03-TC274.MODE",
      "03-TC274.OP",
      "03-TC274.PV",
      "03-TC274.SP",
    ];

    it("renders all 16 columns", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const buttons = screen.getByTestId("dialog").querySelectorAll("button");

      columns.forEach((column) => {
        const columnButton = Array.from(buttons).find((button) =>
          button.textContent?.includes(column),
        );

        expect(columnButton).toBeInTheDocument();
      });
    });

    it("selects HDS2.MODE by default", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const buttons = screen.getByTestId("dialog").querySelectorAll("button");

      const row = Array.from(buttons).find((button) =>
        button.textContent?.includes("HDS2.MODE"),
      );

      expect(row).toBeInTheDocument();
      expect(row?.querySelector("svg")).toBeInTheDocument();
    });

    it("changes the selected column", async () => {
      const user = userEvent.setup();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const buttons = screen.getByTestId("dialog").querySelectorAll("button");

      const row = Array.from(buttons).find((button) =>
        button.textContent?.includes("01-LC200.PV"),
      );

      expect(row).toBeInTheDocument();

      await user.click(row!);

      // Current component does not change the subtitle
      // when the selected column changes.
      expect(
        screen.getByText("PROPERTIES_DPR_SUBTITLE_LABEL"),
      ).toBeInTheDocument();

      expect(row?.querySelector("svg")).toBeInTheDocument();
    });

    it("removes the checkmark from the previous selected column", async () => {
      const user = userEvent.setup();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const buttons = screen.getByTestId("dialog").querySelectorAll("button");

      const oldRow = Array.from(buttons).find((button) =>
        button.textContent?.includes("HDS2.MODE"),
      );

      const newRow = Array.from(buttons).find((button) =>
        button.textContent?.includes("03-TC274.OP"),
      );

      expect(oldRow).toBeInTheDocument();
      expect(newRow).toBeInTheDocument();

      await user.click(newRow!);

      expect(oldRow?.querySelector("svg")).not.toBeInTheDocument();

      expect(newRow?.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ========================================================
  // THRESHOLDS
  // ========================================================

  describe("threshold inputs", () => {
    it("renders Warning Threshold with an empty default value", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_WARNING_THRESHOLD");

      expect(input).toHaveValue("");
    });

    it("renders Abort Threshold with an empty default value", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_ABORT_THRESHOLD");

      expect(input).toHaveValue("");
    });

    it("updates Warning Threshold", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_WARNING_THRESHOLD");

      fireEvent.change(input, {
        target: {
          value: "75",
        },
      });

      expect(input).toHaveValue("75");
    });

    it("updates Abort Threshold", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const input = screen.getByLabelText("PROPERTIES_ABORT_THRESHOLD");

      fireEvent.change(input, {
        target: {
          value: "50",
        },
      });

      expect(input).toHaveValue("50");
    });
  });

  // ========================================================
  // REFERENCE COLUMN
  // ========================================================

  describe("reference column", () => {
    it("renders HDS2.MODE as the default reference column", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const select = screen.getByLabelText("Reference Column");

      expect(select).toHaveValue("HDS2.MODE");
    });

    it("allows changing the reference column", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const select = screen.getByLabelText("Reference Column");

      fireEvent.change(select, {
        target: {
          value: "02-PC237.PV",
        },
      });

      expect(select).toHaveValue("02-PC237.PV");
    });
  });

  // ========================================================
  // EXPRESSIONS
  // ========================================================

  describe("expressions", () => {
    it("renders Bad Data Expression textarea", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(
        screen.getByPlaceholderText(
          "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
        ),
      ).toBeInTheDocument();
    });

    it("renders Replacement Expression textarea", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      expect(screen.getByPlaceholderText("Enter")).toBeInTheDocument();
    });

    it("updates Bad Data Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByPlaceholderText(
        "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
      );

      fireEvent.change(textarea, {
        target: {
          value: "PV < -999",
        },
      });

      expect(textarea).toHaveValue("PV < -999");
    });

    it("updates Replacement Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByPlaceholderText("Enter");

      fireEvent.change(textarea, {
        target: {
          value: "PREV(PV)",
        },
      });

      expect(textarea).toHaveValue("PREV(PV)");
    });
  });

  // ========================================================
  // REFRESH
  // ========================================================

  describe("refresh icons", () => {
    it("clears Bad Data Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByPlaceholderText(
        "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
      );

      fireEvent.change(textarea, {
        target: {
          value: "some expression",
        },
      });

      expect(textarea).toHaveValue("some expression");

      const wrapper = textarea.closest(".flex.items-start.gap-2");

      expect(wrapper).not.toBeNull();

      const icon = wrapper?.querySelector("svg");

      expect(icon).not.toBeNull();

      fireEvent.click(icon!);

      expect(textarea).toHaveValue("");
    });

    it("clears Replacement Expression", () => {
      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const textarea = screen.getByPlaceholderText("Enter");

      fireEvent.change(textarea, {
        target: {
          value: "replacement value",
        },
      });

      expect(textarea).toHaveValue("replacement value");

      const wrapper = textarea.closest(".flex.items-start.gap-2");

      expect(wrapper).not.toBeNull();

      const icon = wrapper?.querySelector("svg");

      expect(icon).not.toBeNull();

      fireEvent.click(icon!);

      expect(textarea).toHaveValue("");
    });

    it("adds animate-spin only to the Bad Data refresh icon", () => {
      vi.useFakeTimers();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const badDataTextarea = screen.getByPlaceholderText(
        "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
      );

      const replacementTextarea = screen.getByPlaceholderText("Enter");

      const badDataWrapper = badDataTextarea.closest(".flex.items-start.gap-2");

      const replacementWrapper = replacementTextarea.closest(
        ".flex.items-start.gap-2",
      );

      const badDataIcon = badDataWrapper?.querySelector("svg");

      const replacementIcon = replacementWrapper?.querySelector("svg");

      expect(badDataIcon).not.toBeNull();
      expect(replacementIcon).not.toBeNull();

      fireEvent.click(badDataIcon!);

      expect(badDataIcon?.classList.contains("animate-spin")).toBe(true);

      expect(replacementIcon?.classList.contains("animate-spin")).toBe(false);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(badDataIcon?.classList.contains("animate-spin")).toBe(false);
    });

    it("adds animate-spin only to the Replacement refresh icon", () => {
      vi.useFakeTimers();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      const badDataTextarea = screen.getByPlaceholderText(
        "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
      );

      const replacementTextarea = screen.getByPlaceholderText("Enter");

      const badDataWrapper = badDataTextarea.closest(".flex.items-start.gap-2");

      const replacementWrapper = replacementTextarea.closest(
        ".flex.items-start.gap-2",
      );

      const badDataIcon = badDataWrapper?.querySelector("svg");

      const replacementIcon = replacementWrapper?.querySelector("svg");

      expect(badDataIcon).not.toBeNull();
      expect(replacementIcon).not.toBeNull();

      fireEvent.click(replacementIcon!);

      expect(replacementIcon?.classList.contains("animate-spin")).toBe(true);

      expect(badDataIcon?.classList.contains("animate-spin")).toBe(false);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(replacementIcon?.classList.contains("animate-spin")).toBe(false);
    });
  });

  // ========================================================
  // FOOTER
  // ========================================================

  describe("footer actions", () => {
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

    it("calls onClose when Cancel is clicked", async () => {
      const user = userEvent.setup();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      await user.click(
        screen.getByRole("button", {
          name: "COMMON_CANCEL",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Save is clicked", async () => {
      const user = userEvent.setup();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      await user.click(
        screen.getByRole("button", {
          name: "COMMON_SAVE",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when Apply to All is clicked", async () => {
      const user = userEvent.setup();

      render(<DialogDataPreprocessing isOpen={true} onClose={onClose} />);

      await user.click(
        screen.getByRole("button", {
          name: "COMMON_APPLY_TO_ALL",
        }),
      );

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
