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

    expect(screen.getByText("Delete Project")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
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

    const button = screen.getByRole("button");

    await user.click(button);

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
});
