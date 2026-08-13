import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import Properties from "./Properties";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        PROPERTIES_DATA_PREPROCESSING_WIZARD: "Data Preprocessing Wizard",
        COMMON_HELP: "Help",
        COMMON_APPLY_TO_ALL: "Apply to All",
        COMMON_SAVE: "Save",
        COMMON_CANCEL: "Cancel",

        PROPERTIES_EDIT_COLUMNS_EXPRESSIONS: "Edit Columns / Expressions",
        PROPERTIES_EDIT_EXPRESSION: "Edit Expression",
        PROPERTIES_THRESHOLD: "Threshold",
        PROPERTIES_WARNING_THRESHOLD: "Warning Threshold",
        PROPERTIES_ABORT_THRESHOLD: "Abort Threshold",
        PROPERTIES_EXPRESSION: "Expression",
        PROPERTIES_REFERENCE_COLUMN: "Reference Column",
        PROPERTIES_BAD_DATA_EXPRESSION: "Bad Data Expression",
        PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER: "Enter bad data expression",
        PROPERTIES_REPLACEMENT_EXPRESSION: "Replacement Expression",
        PROPERTIES_REPLACEMENT_EXPRESSION_PLACEHOLDER:
          "Enter replacement expression",
        PROPERTIES_REFRESH_BAD_DATA_EXPRESSION: "Refresh bad data expression",
        PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION:
          "Refresh replacement expression",
      };

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    icon,
    "aria-label": ariaLabel,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    "aria-label"?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      data-testid="mock-button"
      {...props}
    >
      {icon}
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
  }) => (
    <div>
      {label && <label>{label}</label>}

      <input aria-label={label} {...props} />

      {error && <span data-testid={`${label}-error`}>{error}</span>}
    </div>
  ),
}));

vi.mock("../../components/forms/select/Select", () => ({
  default: ({
    options,
    value,
    onChange,
    ...props
  }: {
    options: {
      label: string;
      value: string;
    }[];
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    [key: string]: unknown;
  }) => (
    <select
      aria-label="Reference Column"
      value={value}
      onChange={onChange}
      {...props}
    >
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
    placeholder,
    ...props
  }: {
    label?: string;
    placeholder?: string;
    [key: string]: unknown;
  }) => (
    <div>
      {label && <label>{label}</label>}

      <textarea aria-label={label} placeholder={placeholder} {...props} />
    </div>
  ),
}));

vi.mock("../../utils/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
}));

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("Properties", () => {
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders page title", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByText("Data Preprocessing Wizard")).toBeInTheDocument();
  });

  it("renders header action buttons", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByText("Help")).toBeInTheDocument();

    expect(screen.getByText("Apply to All")).toBeInTheDocument();

    expect(screen.getAllByText("Save")).toHaveLength(2);
  });

  it("renders edit columns section", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByText("Edit Columns / Expressions")).toBeInTheDocument();
  });

  it("renders all column options", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByText("01-LC0524.MODE")).toBeInTheDocument();

    expect(screen.getByText("01-LC0524.OP")).toBeInTheDocument();

    expect(screen.getByText("01-LC0524.PV")).toBeInTheDocument();

    expect(screen.getByText("01-LC0524.SP")).toBeInTheDocument();

    expect(screen.getByText("01-LC0524.STATUS")).toBeInTheDocument();
  });

  it("selects reference column when column is clicked", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const pvButton = screen.getByRole("button", {
      name: "01-LC0524.PV",
    });

    fireEvent.click(pvButton);

    expect(pvButton.className).toContain("text-foreground-accent");
  });

  it("renders threshold fields with default values", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const warningInput = screen.getByLabelText(
      "Warning Threshold",
    ) as HTMLInputElement;

    const abortInput = screen.getByLabelText(
      "Abort Threshold",
    ) as HTMLInputElement;

    expect(warningInput.value).toBe("10");

    expect(abortInput.value).toBe("20");
  });

  it("renders reference column select with default value", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const select = screen.getByLabelText(
      "Reference Column",
    ) as HTMLSelectElement;

    expect(select.value).toBe("mode");
  });

  it("changes reference column from select", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const select = screen.getByLabelText(
      "Reference Column",
    ) as HTMLSelectElement;

    fireEvent.change(select, {
      target: {
        value: "pv",
      },
    });

    expect(select.value).toBe("pv");
  });

  it("renders bad data expression field", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByLabelText("Bad Data Expression")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter bad data expression"),
    ).toBeInTheDocument();
  });

  it("renders replacement expression field", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByLabelText("Replacement Expression")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter replacement expression"),
    ).toBeInTheDocument();
  });

  it("updates bad data expression", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const textarea = screen.getByLabelText(
      "Bad Data Expression",
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: {
        value: "PV > 100",
      },
    });

    expect(textarea.value).toBe("PV > 100");
  });

  it("updates replacement expression", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const textarea = screen.getByLabelText(
      "Replacement Expression",
    ) as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: {
        value: "PV = 0",
      },
    });

    expect(textarea.value).toBe("PV = 0");
  });

  it("renders refresh buttons", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(
      screen.getByRole("button", {
        name: "Refresh bad data expression",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Refresh replacement expression",
      }),
    ).toBeInTheDocument();
  });

  it("starts bad expression refresh loading", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const refreshButton = screen.getByRole("button", {
      name: "Refresh bad data expression",
    });

    fireEvent.click(refreshButton);

    expect(refreshButton.querySelector("svg")?.getAttribute("class")).toContain(
      "animate-spin",
    );
  });

  it("starts replacement expression refresh loading", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const refreshButton = screen.getByRole("button", {
      name: "Refresh replacement expression",
    });

    fireEvent.click(refreshButton);

    expect(refreshButton.querySelector("svg")?.getAttribute("class")).toContain(
      "animate-spin",
    );
  });

  it("stops bad expression refresh loading after timeout", async () => {
    vi.useFakeTimers();

    render(<Properties onCancel={mockOnCancel} />);

    const refreshButton = screen.getByRole("button", {
      name: "Refresh bad data expression",
    });

    fireEvent.click(refreshButton);

    expect(refreshButton.querySelector("svg")?.getAttribute("class")).toContain(
      "animate-spin",
    );

    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(
        refreshButton.querySelector("svg")?.getAttribute("class"),
      ).not.toContain("animate-spin");
    });
  });

  it("stops replacement expression refresh loading after timeout", async () => {
    vi.useFakeTimers();

    render(<Properties onCancel={mockOnCancel} />);

    const refreshButton = screen.getByRole("button", {
      name: "Refresh replacement expression",
    });

    fireEvent.click(refreshButton);

    expect(refreshButton.querySelector("svg")?.getAttribute("class")).toContain(
      "animate-spin",
    );

    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(
        refreshButton.querySelector("svg")?.getAttribute("class"),
      ).not.toContain("animate-spin");
    });
  });

  it("renders footer cancel button", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<Properties onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("renders both save buttons", () => {
    render(<Properties onCancel={mockOnCancel} />);

    expect(screen.getAllByText("Save")).toHaveLength(2);
  });

  it("submits valid form without errors", async () => {
    render(<Properties onCancel={mockOnCancel} />);

    const warningInput = screen.getByLabelText("Warning Threshold");

    fireEvent.change(warningInput, {
      target: {
        value: "15",
      },
    });

    const saveButtons = screen.getAllByText("Save");

    fireEvent.click(saveButtons[1]);

    await waitFor(() => {
      expect(
        screen.queryByTestId("Warning Threshold-error"),
      ).not.toBeInTheDocument();
    });
  });

  it("renders validation errors when invalid threshold values are submitted", async () => {
    render(<Properties onCancel={mockOnCancel} />);

    const warningInput = screen.getByLabelText("Warning Threshold");

    const abortInput = screen.getByLabelText("Abort Threshold");

    fireEvent.change(warningInput, {
      target: {
        value: "",
      },
    });

    fireEvent.change(abortInput, {
      target: {
        value: "",
      },
    });

    fireEvent.click(screen.getAllByText("Save")[1]);

    await waitFor(() => {
      expect(screen.getByTestId("Warning Threshold-error")).toBeInTheDocument();

      expect(screen.getByTestId("Abort Threshold-error")).toBeInTheDocument();
    });
  });

  it("keeps selected column and form value in sync", () => {
    render(<Properties onCancel={mockOnCancel} />);

    const opButton = screen.getByRole("button", {
      name: "01-LC0524.OP",
    });

    fireEvent.click(opButton);

    const select = screen.getByLabelText(
      "Reference Column",
    ) as HTMLSelectElement;

    expect(select.value).toBe("op");

    expect(opButton.className).toContain("text-foreground-accent");
  });
});
