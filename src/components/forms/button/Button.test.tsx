import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import Button from "./Button";

describe("Button", () => {
  it("renders button text", () => {
    render(
      <Button>
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Save"),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick}>
        Save
      </Button>,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button
        disabled
        onClick={handleClick}
      >
        Save
      </Button>,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders loading state", () => {
    render(
      <Button loading>
        Save
      </Button>,
    );

    expect(
      screen.getByText("Loading..."),
    ).toBeInTheDocument();
  });

  it("disables button while loading", () => {
    render(
      <Button loading>
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toBeDisabled();
  });

  it("renders icon on the left", () => {
    render(
      <Button
        icon={<span data-testid="icon">★</span>}
      >
        Save
      </Button>,
    );

    expect(
      screen.getByTestId("icon"),
    ).toBeInTheDocument();
  });

  it("renders icon on the right", () => {
    render(
      <Button
        icon={<span data-testid="icon">★</span>}
        iconPosition="right"
      >
        Save
      </Button>,
    );

    expect(
      screen.getByTestId("icon"),
    ).toBeInTheDocument();
  });

  it("renders without icon", () => {
    render(
      <Button>
        Save
      </Button>,
    );

    expect(
      screen.queryByTestId("icon"),
    ).not.toBeInTheDocument();
  });

  it("renders primary variant", () => {
    render(
      <Button variant="primary">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "border-[var(--color-button-primary)]",
    );
  });

  it("renders secondary variant", () => {
    render(
      <Button variant="secondary">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "border-[var(--color-button-focus)]",
    );
  });

  it("renders danger variant", () => {
    render(
      <Button variant="danger">
        Delete
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "border-[var(--color-danger)]",
    );
  });

  it("renders success variant", () => {
    render(
      <Button variant="success">
        Submit
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "border-[var(--color-success)]",
    );
  });

  it("renders small size", () => {
    render(
      <Button size="small">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("min-w-[72px]");
  });

  it("renders medium size", () => {
    render(
      <Button size="medium">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("min-w-[88px]");
  });

  it("renders large size", () => {
    render(
      <Button size="large">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("min-w-[110px]");
  });

  it("renders full width button", () => {
    render(
      <Button fullWidth>
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("w-full");
  });

  it("does not apply full width by default", () => {
    render(
      <Button>
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).not.toHaveClass("w-full");
  });

  it("renders custom className", () => {
    render(
      <Button className="custom-class">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("custom-class");
  });

  it("renders submit type", () => {
    render(
      <Button type="submit">
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("uses button type by default", () => {
    render(
      <Button>
        Save
      </Button>,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("passes additional props", () => {
    render(
      <Button data-testid="custom-button">
        Save
      </Button>,
    );

    expect(
      screen.getByTestId(
        "custom-button",
      ),
    ).toBeInTheDocument();
  });
});