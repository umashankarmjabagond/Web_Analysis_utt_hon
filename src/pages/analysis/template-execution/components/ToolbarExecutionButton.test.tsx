import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { CirclePlay } from "lucide-react";

import ToolbarExecutionButton from "./ToolbarExecutionButton";

describe("ToolbarExecutionButton", () => {
  it("renders the label", () => {
    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
      />,
    );

    expect(
      screen.getByText("Execute"),
    ).toBeInTheDocument();
  });

  it("renders the icon", () => {
    const { container } = render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
      />,
    );

    expect(
      container.querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();

    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
        onClick={onClick}
      />,
    );

    fireEvent.click(
      screen.getByRole("button"),
    );

    expect(onClick).toHaveBeenCalledTimes(
      1,
    );
  });

  it("applies active style when active is true", () => {
    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
        active
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "text-foreground-accent",
    );
  });

  it("applies inactive style when active is false", () => {
    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
        active={false}
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "text-foreground-muted",
    );
  });

  it("uses inactive style by default", () => {
    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toHaveClass(
      "text-foreground-muted",
    );
  });

  it("renders without onClick", () => {
    render(
      <ToolbarExecutionButton
        icon={CirclePlay}
        label="Execute"
      />,
    );

    expect(
      screen.getByRole("button"),
    ).toBeInTheDocument();
  });
});