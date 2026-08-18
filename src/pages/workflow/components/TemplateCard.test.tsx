import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { Database } from "lucide-react";

import TemplateCard from "./TemplateCard";

describe("TemplateCard", () => {
  it("renders title", () => {
    render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    expect(
      screen.getByText(
        "Data Processing",
      ),
    ).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
        icon={Database}
      />,
    );

    expect(
      container.querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("does not render icon when icon is not provided", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    expect(
      container.querySelector("svg"),
    ).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();

    render(
      <TemplateCard
        title="Data Processing"
        onClick={handleClick}
      />,
    );

    fireEvent.click(
      screen.getByText(
        "Data Processing",
      ),
    );

    expect(
      handleClick,
    ).toHaveBeenCalledTimes(1);
  });

  it("calls onDragStart when dragging starts", () => {
    const handleDragStart = vi.fn();

    const { container } = render(
      <TemplateCard
        title="Data Processing"
        draggable
        onDragStart={handleDragStart}
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    fireEvent.dragStart(card);

    expect(
      handleDragStart,
    ).toHaveBeenCalledTimes(1);
  });

  it("sets draggable=true when draggable prop is true", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
        draggable
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveAttribute(
      "draggable",
      "true",
    );
  });

  it("uses draggable=false by default", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveAttribute(
      "draggable",
      "false",
    );
  });

  it("applies grab cursor classes when draggable", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
        draggable
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveClass(
      "cursor-grab",
    );

    expect(card.className).toContain(
      "active:cursor-grabbing",
    );
  });

  it("applies pointer cursor when not draggable", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveClass(
      "cursor-pointer",
    );
  });

  it("applies base layout classes", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveClass(
      "flex",
      "h-20",
      "flex-col",
      "items-center",
      "justify-center",
      "rounded",
    );
  });

  it("applies card theme classes", () => {
    const { container } = render(
      <TemplateCard
        title="Data Processing"
      />,
    );

    const card =
      container.firstChild as HTMLElement;

    expect(card).toHaveClass(
      "border-card-border",
      "bg-card-background",
      "text-card-foreground",
    );
  });

  it("renders title text correctly", () => {
    render(
      <TemplateCard
        title="Template A"
      />,
    );

    expect(
      screen.getByText(
        "Template A",
      ),
    ).toBeInTheDocument();
  });

  it("renders icon with expected styling", () => {
    const { container } = render(
      <TemplateCard
        title="Template A"
        icon={Database}
      />,
    );

    const icon =
      container.querySelector("svg");

    expect(icon).toHaveClass(
      "mb-2",
      "text-card-foreground",
    );
  });

  it("renders icon with configured size", () => {
    const { container } = render(
      <TemplateCard
        title="Template A"
        icon={Database}
      />,
    );

    const icon =
      container.querySelector("svg");

    expect(icon).toHaveAttribute(
      "width",
      "18",
    );

    expect(icon).toHaveAttribute(
      "height",
      "18",
    );
  });

  it("renders title inside span", () => {
    render(
      <TemplateCard
        title="Template A"
      />,
    );

    const title =
      screen.getByText(
        "Template A",
      );

    expect(
      title.tagName,
    ).toBe("SPAN");
  });
});