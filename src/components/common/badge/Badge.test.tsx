import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test";
import { Check } from "lucide-react";

import Badge from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(
      <Badge variant="success">
        Completed
      </Badge>,
    );

    expect(
      screen.getByText("Completed"),
    ).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <Badge
        variant="success"
        icon={
          <Check
            data-testid="badge-icon"
            size={14}
          />
        }
      >
        Success
      </Badge>,
    );

    expect(
      screen.getByTestId("badge-icon"),
    ).toBeInTheDocument();
  });

  it("applies success solid variant", () => {
    const { container } = render(
      <Badge variant="success">
        Success
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "bg-badge-success-solid-background",
      "border-badge-success-solid-border",
      "text-badge-success-solid-foreground",
    );
  });

  it("applies outline fill", () => {
    const { container } = render(
      <Badge
        variant="warning"
        fill="outline"
      >
        Warning
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "bg-badge-warning-outline-background",
      "border-badge-warning-outline-border",
      "text-badge-warning-outline-foreground",
    );
  });

  it("applies selected size", () => {
    const { container } = render(
      <Badge
        variant="info"
        size="lg"
      >
        Info
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "h-7",
    );
  });

  it("uses default size and fill", () => {
    const { container } = render(
      <Badge variant="neutral">
        Neutral
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "h-6",
    );

    expect(badge).toHaveClass(
      "bg-badge-neutral-solid-background",
      "border-badge-neutral-solid-border",
      "text-badge-neutral-solid-foreground",
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <Badge
        variant="neutral"
        className="custom-class"
      >
        Badge
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "custom-class",
    );
  });

  it("renders base styles", () => {
    const { container } = render(
      <Badge variant="neutral">
        Badge
      </Badge>,
    );

    const badge =
      container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-full",
      "font-medium",
      "whitespace-nowrap",
    );
  });
});