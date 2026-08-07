import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Plus } from "lucide-react";

import { render, screen } from "../../../test";

import IconButton from "./IconButton";

describe("IconButton", () => {
  it("renders button", () => {
    render(
      <IconButton
        icon={<Plus />}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toBeInTheDocument();
  });

  it("renders lucide icon", () => {
    const { container } = render(
      <IconButton
        icon={<Plus />}
      />,
    );

    expect(
      container.querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("renders non-react icon content", () => {
    render(
      <IconButton
        icon="X"
      />,
    );

    expect(
      screen.getByText("X"),
    ).toBeInTheDocument();
  });

  it("renders small size", () => {
    render(
      <IconButton
        size="sm"
        icon={<Plus />}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("h-7");
  });

    it("renders medium size by default", () => {
    render(
      <IconButton
        icon={<Plus />}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("h-[46px]");
  });

  it("renders large size", () => {
    render(
      <IconButton
        size="lg"
        icon={<Plus />}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("h-12");
  });

  it("applies custom className", () => {
    render(
      <IconButton
        icon={<Plus />}
        className="custom-class"
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass("custom-class");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton
        icon={<Plus />}
        onClick={handleClick}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      handleClick,
    ).toHaveBeenCalledTimes(1);
  });

  it("supports disabled state", () => {
    render(
      <IconButton
        icon={<Plus />}
        disabled
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toBeDisabled();
  });

  it("passes additional props", () => {
    render(
      <IconButton
        icon={<Plus />}
        data-testid="icon-button"
      />,
    );

    expect(
      screen.getByTestId("icon-button"),
    ).toBeInTheDocument();
  });

  it("renders button type from props", () => {
    render(
      <IconButton
        icon={<Plus />}
        type="submit"
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("uses default button type", () => {
    render(
      <IconButton
        icon={<Plus />}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("renders children icon with cloned props", () => {
    const { container } = render(
      <IconButton
        size="lg"
        icon={<Plus />}
      />,
    );

    const svg = container.querySelector("svg");

    expect(svg).toBeInTheDocument();
  });

  it("does not trigger click when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <IconButton
        icon={<Plus />}
        disabled
        onClick={handleClick}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      handleClick,
    ).not.toHaveBeenCalled();
  });
});