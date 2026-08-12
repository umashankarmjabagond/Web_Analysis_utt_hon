import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ProjectAnalysisDialog from "./ProjectAnalysisDialog";

describe("ProjectAnalysisDialog", () => {
  const renderComponent = () => {
    const onClose = vi.fn();

    render(
      <ProjectAnalysisDialog
        isOpen={true}
        onClose={onClose}
      />,
    );

    return {
      onClose,
    };
  };

  it("renders dialog title", () => {
    renderComponent();

    expect(
      screen.getByText(
        "Project and Analysis",
      ),
    ).toBeInTheDocument();
  });

  it("renders project list", () => {
    renderComponent();

    expect(
      screen.getByText("Analyzer"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("CO2"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Positioner"),
    ).toBeInTheDocument();
  });

  it("renders inputs and textarea", () => {
  renderComponent();

  expect(
    screen.getByText("Server"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Created by"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Description"),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "Check out this analysis",
    ),
  ).toBeInTheDocument();
});

  it("has Next button disabled initially", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeDisabled();
  });

  it("enables Next button after project selection", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

    expect(
      screen.getByRole("button", {
        name: "Next",
      }),
    ).toBeEnabled();
  });

  it("selects a project", async () => {
    const user = userEvent.setup();

    renderComponent();

    const radio =
      screen.getByLabelText(
        "Analyzer",
      );

    await user.click(radio);

    expect(radio).toBeChecked();
  });

  it("moves to next step when Next is clicked", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

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

  it("shows Clone button in next step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

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

  it("enables Back button in next step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

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

  it("returns to first step when Back is clicked", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

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
  });

  it("calls onClose when Finish is clicked", async () => {
    const user = userEvent.setup();

    const { onClose } =
      renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

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

    expect(onClose).toHaveBeenCalledTimes(
      1,
    );
  });

  it("renders Help button", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: /help/i,
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

  it("shows selected project in next step", async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.click(
      screen.getByLabelText(
        "Analyzer",
      ),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Next",
      }),
    );

    expect(
      screen.getAllByText(
        "Analyzer",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("has Back button disabled initially", () => {
    renderComponent();

    expect(
      screen.getByRole("button", {
        name: "Back",
      }),
    ).toBeDisabled();
  });

  it("renders project checkout checkbox", () => {
    renderComponent();

    expect(
      screen.getByRole(
        "checkbox",
      ),
    ).toBeInTheDocument();
  });
});