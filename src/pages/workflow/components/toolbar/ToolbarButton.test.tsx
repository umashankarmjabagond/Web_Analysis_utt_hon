import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Trash2 } from "lucide-react";

import ToolbarButton from "./ToolbarButton";

vi.mock("../../../../components/common/tooltip/Tooltip", () => ({
  default: ({
    content,
    children,
  }: {
    content: string;
    children: React.ReactNode;
    placement?: string;
  }) => (
    <div data-testid="tooltip" data-tooltip-content={content}>
      {children}
    </div>
  ),
}));

describe("ToolbarButton", () => {
  it("renders button", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("passes title to Tooltip", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    const tooltip = screen.getByTestId("tooltip");

    expect(tooltip).toHaveAttribute("data-tooltip-content", "Delete");
  });

  it("sets aria-label from title", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();

    render(
      <ToolbarButton title="Delete" icon={Trash2} onClick={handleClick} />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fail when onClick is not provided", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("applies inactive styles by default", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("text-[#8F8F8F]");

    expect(button).toHaveClass("hover:bg-[#292929]");

    expect(button).toHaveClass("hover:text-white");
  });

  it("applies active styles when active is true", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} active />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-[#315D7A]");

    expect(button).toHaveClass("text-white");
  });

  it("renders button with correct type attribute", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders base classes", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} />);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("h-7");
    expect(button).toHaveClass("h-7");
    expect(button).toHaveClass("w-7");
    expect(button).toHaveClass("items-center");
    expect(button).toHaveClass("justify-center");
    expect(button).toHaveClass("rounded-[3px]");
  });

  it("applies disabled state", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} disabled />);

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("applies custom icon class", () => {
    render(
      <ToolbarButton
        title="Delete"
        icon={Trash2}
        iconClassName="custom-icon"
      />,
    );

    const icon = screen.getByRole("button").querySelector("svg");

    expect(icon).toHaveClass("custom-icon");
  });

  it("applies disabled icon class when disabled", () => {
    render(<ToolbarButton title="Delete" icon={Trash2} disabled />);

    const icon = screen.getByRole("button").querySelector("svg");

    expect(icon).toHaveClass("text-toolbar-icon-disabled");
  });
});
