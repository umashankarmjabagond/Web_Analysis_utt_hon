import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import Dialog from "./Dialog";

describe("Dialog", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Dialog isOpen={false} title="Delete Project" onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(screen.queryByText("Delete Project")).not.toBeInTheDocument();
  });

  it("renders title", () => {
    render(
      <Dialog isOpen title="Delete Project" onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Delete Project",
      }),
    ).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <Dialog
        isOpen
        title="Delete Project"
        subtitle="Please confirm"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    expect(screen.getByText("Please confirm")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(
      <Dialog isOpen title="Delete Project" onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(screen.queryByText("Please confirm")).not.toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <Dialog isOpen title="Delete Project" onClose={vi.fn()}>
        <p>Dialog Body</p>
      </Dialog>,
    );

    expect(screen.getByText("Dialog Body")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Dialog isOpen title="Delete Project" onClose={handleClose}>
        Content
      </Dialog>,
    );

    const closeButton = screen.getByRole("button");

    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom width", () => {
    const { container } = render(
      <Dialog isOpen title="Delete Project" width={800} onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    const dialog = container.querySelector("[style]") as HTMLElement;

    expect(dialog).toHaveStyle({
      width: "800px",
    });
  });

  it("applies custom dialog className", () => {
    const { container } = render(
      <Dialog
        isOpen
        title="Connections"
        className="custom-dialog"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const dialog = container.querySelector("[style]") as HTMLElement;

    expect(dialog.className).toContain("custom-dialog");
  });

  it("applies custom title className", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        titleClassName="connections-title"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const title = screen.getByRole("heading", {
      name: "Connections",
    });

    expect(title.className).toContain("connections-title");
  });

  it("applies custom subtitle className", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        subtitle="Inputs feeding SPA"
        subtitleClassName="connections-subtitle"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const subtitle = screen.getByText("Inputs feeding SPA");

    expect(subtitle.className).toContain("connections-subtitle");
  });

  it("applies custom header className", () => {
    const { container } = render(
      <Dialog
        isOpen
        title="Connections"
        headerClassName="connections-header"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const header = container.querySelector(".connections-header");

    expect(header).toBeInTheDocument();
  });

  it("applies custom close button className", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        closeButtonClassName="connections-close"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const closeButton = screen.getByRole("button");

    expect(closeButton.className).toContain("connections-close");
  });

  it("renders custom close icon when closeIcon is provided", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        closeIcon={<span data-testid="custom-close-icon">Close</span>}
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    expect(screen.getByTestId("custom-close-icon")).toBeInTheDocument();
  });

  it("renders default X icon when closeIcon is not provided", () => {
    const { container } = render(
      <Dialog isOpen title="Connections" onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    // lucide X renders an SVG inside the close button
    const closeButton = screen.getByRole("button");

    expect(closeButton.querySelector("svg")).toBeInTheDocument();

    expect(
      container.querySelector('[data-testid="custom-close-icon"]'),
    ).not.toBeInTheDocument();
  });

  it("supports Connections-style customization without a variant", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        subtitle="Inputs feeding SPA"
        width={424}
        showIcon={false}
        titleClassName="text-[20px] font-extrabold leading-[30px]"
        subtitleClassName="text-[12px] font-medium leading-4 normal-case"
        headerClassName="px-8 pb-5 pt-7"
        closeButtonClassName="mt-1"
        closeIcon={<span data-testid="connections-close-icon">X</span>}
        onClose={vi.fn()}
      >
        Connections content
      </Dialog>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Connections",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Inputs feeding SPA")).toBeInTheDocument();

    expect(screen.getByText("Connections content")).toBeInTheDocument();

    expect(screen.getByTestId("connections-close-icon")).toBeInTheDocument();
  });
});
