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

  it("renders title for default variant", () => {
    render(
      <Dialog isOpen title="Delete Project" onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(screen.getByText("Delete Project")).toBeInTheDocument();
  });

  it("renders subtitle for default variant", () => {
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

  it("renders connections variant title and subtitle", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        subtitle="Inputs feeding SPA"
        variant="connections"
        onClose={vi.fn()}
      >
        Connections content
      </Dialog>,
    );

    expect(screen.getByText("Connections")).toBeInTheDocument();

    expect(screen.getByText("Inputs feeding SPA")).toBeInTheDocument();

    expect(screen.getByText("Connections content")).toBeInTheDocument();
  });

  it("uses default variant when variant is not provided", () => {
    render(
      <Dialog
        isOpen
        title="Default Dialog"
        subtitle="Default subtitle"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    expect(screen.getByText("Default Dialog")).toBeInTheDocument();

    expect(screen.getByText("Default subtitle")).toBeInTheDocument();
  });

  it("does not uppercase the connections subtitle", () => {
    render(
      <Dialog
        isOpen
        title="Connections"
        subtitle="Inputs feeding SPA"
        variant="connections"
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    expect(screen.getByText("Inputs feeding SPA")).toBeInTheDocument();

    expect(screen.queryByText("INPUTS FEEDING SPA")).not.toBeInTheDocument();
  });

  it("renders connections dialog with custom width", () => {
    const { container } = render(
      <Dialog
        isOpen
        title="Connections"
        subtitle="Inputs feeding SPA"
        variant="connections"
        width={424}
        onClose={vi.fn()}
      >
        Content
      </Dialog>,
    );

    const dialog = container.querySelector("[style]") as HTMLElement;

    expect(dialog).toHaveStyle({
      width: "424px",
    });
  });
});
