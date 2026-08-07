import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import TextArea from "./TextArea";

describe("TextArea", () => {
  it("renders textarea", () => {
    render(<TextArea />);

    expect(
      screen.getByRole("textbox"),
    ).toBeInTheDocument();
  });

  it("renders label", () => {
    render(
      <TextArea label="Description" />,
    );

    expect(
      screen.getByText("Description"),
    ).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    render(<TextArea />);

    expect(
      screen.queryByText("Description"),
    ).not.toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(
      <TextArea helperText="Enter details" />,
    );

    expect(
      screen.getByText("Enter details"),
    ).toBeInTheDocument();
  });

  it("renders error text", () => {
    render(
      <TextArea error="Required field" />,
    );

    expect(
      screen.getByText("Required field"),
    ).toBeInTheDocument();
  });

  it("does not render helper text when error exists", () => {
    render(
      <TextArea
        helperText="Enter details"
        error="Required field"
      />,
    );

    expect(
      screen.queryByText("Enter details"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Required field"),
    ).toBeInTheDocument();
  });

  it("uses default variant when no error", () => {
    render(<TextArea />);

    expect(
      screen.getByRole("textbox"),
    ).toHaveClass(
      "border-[var(--color-border-1)]",
    );
  });

  it("uses error variant when error exists", () => {
    render(
      <TextArea error="Required field" />,
    );

    expect(
      screen.getByRole("textbox"),
    ).toHaveClass(
      "border-[var(--color-danger)]",
    );
  });

  it("uses default rows value", () => {
    render(<TextArea />);

    expect(
      screen.getByRole("textbox"),
    ).toHaveAttribute(
      "rows",
      "4",
    );
  });

  it("renders custom rows value", () => {
    render(
      <TextArea rows={8} />,
    );

    expect(
      screen.getByRole("textbox"),
    ).toHaveAttribute(
      "rows",
      "8",
    );
  });

  it("allows typing text", async () => {
    const user = userEvent.setup();

    render(<TextArea />);

    const textarea =
      screen.getByRole("textbox");

    await user.type(
      textarea,
      "Test content",
    );

    expect(
      textarea,
    ).toHaveValue("Test content");
  });

  it("applies full width by default", () => {
    const { container } = render(
      <TextArea />,
    );

    expect(
      container.querySelector(".w-full"),
    ).toBeInTheDocument();
  });

  it("renders without full width when false", () => {
    const { container } = render(
      <TextArea fullWidth={false} />,
    );

    const wrapper =
      container.firstChild;

    expect(wrapper).not.toHaveClass(
      "w-full",
    );
  });

  it("applies custom className", () => {
    render(
      <TextArea className="custom-class" />,
    );

    expect(
      screen.getByRole("textbox"),
    ).toHaveClass("custom-class");
  });

  it("passes additional props", () => {
    render(
      <TextArea
        data-testid="custom-textarea"
      />,
    );

    expect(
      screen.getByTestId(
        "custom-textarea",
      ),
    ).toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(
      <TextArea
        placeholder="Enter text"
      />,
    );

    expect(
      screen.getByPlaceholderText(
        "Enter text",
      ),
    ).toBeInTheDocument();
  });
});