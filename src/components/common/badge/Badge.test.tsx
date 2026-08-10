import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test";
import { Check } from "lucide-react";

import Badge from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge variant="success">Completed</Badge>);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <Badge
        variant="success"
        icon={<Check data-testid="badge-icon" size={14} />}
      >
        Success
      </Badge>,
    );

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
  });

  it("applies success solid variant", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);

    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "bg-app-badge-success-background",
      "text-app-badge-success-text",
    );
  });

  it("applies outline fill", () => {
    const { container } = render(
      <Badge variant="warning" fill="outline">
        Warning
      </Badge>,
    );

    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass(
      "border-app-badge-warning-outline",
      "text-app-badge-warning-outline",
    );
  });

  it("applies selected size", () => {
    const { container } = render(
      <Badge variant="info" size="lg">
        Info
      </Badge>,
    );

    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("h-7", "px-3", "text-base");
  });

  it("uses default size and fill", () => {
    const { container } = render(<Badge variant="neutral">Neutral</Badge>);

    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("h-6");
    expect(badge).toHaveClass("bg-app-badge-neutral-background");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Badge variant="error" className="custom-class">
        Error
      </Badge>,
    );

    const badge = container.firstChild as HTMLElement;

    expect(badge).toHaveClass("custom-class");
  });

  it("renders base styles", () => {
    const { container } = render(<Badge variant="neutral">Badge</Badge>);

    const badge = container.firstChild as HTMLElement;

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
