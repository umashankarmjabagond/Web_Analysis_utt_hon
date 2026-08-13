import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import { render, screen } from "../../test";
import ProjectAnalysisDialog from "./ProjectAnalysisDialog";

type MockDialogProps = {
  isOpen: boolean;
  title?: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

type MockButtonProps = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  "aria-label"?: string;
};

type MockInputProps = {
  label?: string;
  placeholder?: string;
};

type MockTextAreaProps = {
  label?: string;
  placeholder?: string;
};

vi.mock("../../components/common/dialogue/Dialog", () => ({
  default: ({ isOpen, title, onClose, children }: MockDialogProps) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div role="dialog">
        <h2>{title}</h2>

        <button type="button" aria-label="Close drawer" onClick={onClose}>
          Close
        </button>

        {children}
      </div>
    );
  },
}));

vi.mock("../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    disabled,
    "aria-label": ariaLabel,
  }: MockButtonProps) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../components/forms/input/Input", () => ({
  default: ({ label, placeholder }: MockInputProps) => (
    <div>
      <label>
        {label}
        <input placeholder={placeholder} />
      </label>
    </div>
  ),
}));

vi.mock("../../components/forms/textarea/TextArea", () => ({
  default: ({ label, placeholder }: MockTextAreaProps) => (
    <div>
      <label>
        {label}
        <textarea placeholder={placeholder} />
      </label>
    </div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        PROJECT_ANALYSIS_TITLE: "Project and Analysis",
        PROJECT_ANALYSIS_CHOOSE_PROJECT: "Choose Project",
        PROJECT_ANALYSIS_NEW: "New",
        PROJECT_ANALYSIS_CLONE: "Clone",
        PROJECT_ANALYSIS_SERVER: "Server",
        PROJECT_ANALYSIS_INPUT_TEXT: "Enter server",
        PROJECT_ANALYSIS_CHECKOUT_ANALYSIS: "Check out this analysis",
        PROJECT_ANALYSIS_DESCRIPTION: "Description",
        PROJECT_ANALYSIS_DESCRIPTION_PLACEHOLDER: "Check out this analysis",
        PROJECT_ANALYSIS_CREATED_BY: "Created by",
        COMMON_HELP: "Help",
        BUTTON_BACK: "Back",
        BUTTON_NEXT: "Next",
        PROJECT_ANALYSIS_FINISH: "Finish",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("ProjectAnalysisDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const onClose = vi.fn();

    render(<ProjectAnalysisDialog isOpen={true} onClose={onClose} />);

    return {
      onClose,
    };
  };

  it("renders dialog title", () => {
    renderComponent();

    expect(screen.getByText("Project and Analysis")).toBeInTheDocument();
  });

  it("renders project list", () => {
    renderComponent();

    expect(screen.getByLabelText("Analyzer")).toBeInTheDocument();

    expect(screen.getByLabelText("CO2")).toBeInTheDocument();

    expect(screen.getByLabelText("Positioner")).toBeInTheDocument();
  });

  it("renders server input", () => {
    renderComponent();

    expect(screen.getByText("Server")).toBeInTheDocument();
  });

  it("renders created by input", () => {
    renderComponent();

    expect(screen.getByText("Created by")).toBeInTheDocument();
  });

  it("renders description textarea", () => {
    renderComponent();

    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders description placeholder", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText("Check out this analysis"),
    ).toBeInTheDocument();
  });

  it("renders checkout analysis checkbox", () => {
    renderComponent();

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders Help button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Help",
      }),
    ).toBeInTheDocument();
  });

  it("renders New button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "New",
      }),
    ).toBeInTheDocument();
  });

  it("renders Back button disabled initially", () => {
    renderComponent();

    const backButton = screen.getByRole("button", {
      name: "Back",
    });

    expect(backButton).toBeDisabled();
  });

  it("renders Next button disabled initially", () => {
    renderComponent();

    const nextButton = screen.getByRole("button", {
      name: "Next",
    });

    expect(nextButton).toBeDisabled();
  });

  it("selects a project", async () => {
    const user = userEvent.setup();

    renderComponent();

    const analyzerRadio = screen.getByLabelText("Analyzer");

    await user.click(analyzerRadio);

    expect(analyzerRadio).toBeChecked();
  });

  it("enables Next button after selecting a project", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeEnabled();
  });

  it("does not enable Next button without selecting a project", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeDisabled();
  });

  it("moves to second step when Next is clicked", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Finish",
      }),
    ).toBeInTheDocument();
  });

  it("shows Clone button after moving to second step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Clone",
      }),
    ).toBeInTheDocument();
  });

  it("enables Back button after moving to second step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Back",
      }),
    ).toBeEnabled();
  });

  it("shows selected project in second step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(screen.getByText("Analyzer")).toBeInTheDocument();
  });

  it("returns to first step when Back is clicked", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Finish",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows project list again after clicking Back", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(screen.getByLabelText("Analyzer")).toBeInTheDocument();

    expect(screen.getByLabelText("CO2")).toBeInTheDocument();

    expect(screen.getByLabelText("Positioner")).toBeInTheDocument();
  });

  it("calls onClose when Finish is clicked", async () => {
    const user = userEvent.setup();

    const { onClose } = renderComponent();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Finish",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when dialog close action is triggered", async () => {
    const user = userEvent.setup();

    const { onClose } = renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: "Close drawer",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders project selection radio buttons", () => {
    renderComponent();

    expect(screen.getByLabelText("Analyzer")).toHaveAttribute("type", "radio");

    expect(screen.getByLabelText("CO2")).toHaveAttribute("type", "radio");

    expect(screen.getByLabelText("Positioner")).toHaveAttribute(
      "type",
      "radio",
    );
  });

  it("only selected project is checked", async () => {
    const user = userEvent.setup();

    renderComponent();

    const analyzerRadio = screen.getByLabelText("Analyzer");

    const co2Radio = screen.getByLabelText("CO2");

    await user.click(analyzerRadio);

    expect(analyzerRadio).toBeChecked();
    expect(co2Radio).not.toBeChecked();

    await user.click(co2Radio);

    expect(analyzerRadio).not.toBeChecked();
    expect(co2Radio).toBeChecked();
  });

  it("does not show Clone button initially", () => {
    renderComponent();

    expect(
      screen.queryByRole("button", {
        name: "Clone",
      }),
    ).not.toBeInTheDocument();
  });

  it("does not show Finish button initially", () => {
    renderComponent();

    expect(
      screen.queryByRole("button", {
        name: "Finish",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows Clone button only after selecting a project and clicking Next", async () => {
    const user = userEvent.setup();

    renderComponent();

    expect(
      screen.queryByRole("button", {
        name: "Clone",
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Analyzer"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Clone",
      }),
    ).toBeInTheDocument();
  });

  it("keeps Next disabled when no project is selected", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeDisabled();
  });

  it("renders dialog when isOpen is true", () => {
    const onClose = vi.fn();

    render(<ProjectAnalysisDialog isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Project and Analysis")).toBeInTheDocument();
  });

  it("does not render project list when isOpen is false", () => {
    const onClose = vi.fn();

    render(<ProjectAnalysisDialog isOpen={false} onClose={onClose} />);

    expect(screen.queryByLabelText("Analyzer")).not.toBeInTheDocument();
  });

  it("can select a different project before proceeding", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(screen.getByLabelText("CO2"));

    expect(screen.getByLabelText("CO2")).toBeChecked();

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(screen.getByText("CO2")).toBeInTheDocument();
  });

  it("can finish after selecting CO2", async () => {
    const user = userEvent.setup();

    const { onClose } = renderComponent();

    await user.click(screen.getByLabelText("CO2"));

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Finish",
      }),
    ).toBeEnabled();

    await user.click(
      screen.getByRole("button", {
        name: "Finish",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
