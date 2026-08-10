import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "../../test";

import Drawer from "./Drawer";

describe("Drawer", () => {
  const onClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  it("renders children", () => {
    render(
      <Drawer opened onClose={onClose}>
        <div>Drawer Content</div>
      </Drawer>,
    );

    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(
      <Drawer opened onClose={onClose} title="My Drawer">
        <div>Content</div>
      </Drawer>,
    );

    expect(screen.getByText("My Drawer")).toBeInTheDocument();
  });

  it("renders custom title element", () => {
    render(
      <Drawer opened onClose={onClose} title={<span>Custom Title</span>}>
        <div>Content</div>
      </Drawer>,
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Drawer opened onClose={onClose} footer={<button>Save</button>}>
        <div>Content</div>
      </Drawer>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", async () => {
    const user = userEvent.setup();

    render(
      <Drawer opened onClose={onClose} title="Drawer">
        <div>Content</div>
      </Drawer>,
    );

    await user.click(screen.getByLabelText("Close drawer"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(
      <Drawer opened onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll when opened", () => {
    render(
      <Drawer opened onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scroll on unmount", () => {
    const { unmount } = render(
      <Drawer opened onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Drawer opened onClose={onClose} closeOnOverlayClick>
        <div>Content</div>
      </Drawer>,
    );

    const overlay = container.querySelector(".bg-black\\/40");

    expect(overlay).toBeInTheDocument();

    await user.click(overlay!);

    expect(onClose).toHaveBeenCalled();
  });

  it("does not close when overlay click is disabled", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Drawer opened onClose={onClose} closeOnOverlayClick={false}>
        <div>Content</div>
      </Drawer>,
    );

    const overlay = container.querySelector(".bg-black\\/40");

    await user.click(overlay!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders panel variant", () => {
    const { container } = render(
      <Drawer variant="panel" opened onClose={onClose}>
        <div>Panel Content</div>
      </Drawer>,
    );

    expect(screen.getByText("Panel Content")).toBeInTheDocument();
    expect(container.querySelector(".relative")).toBeInTheDocument();
  });

  it.each(["left", "right", "top", "bottom"] as const)(
    "renders %s position",
    (position) => {
      render(
        <Drawer opened position={position} onClose={onClose}>
          <div>Content</div>
        </Drawer>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    },
  );

  it.each(["sm", "md", "lg", "xl", "full"] as const)(
    "renders %s size",
    (size) => {
      render(
        <Drawer opened size={size} position="left" onClose={onClose}>
          <div>Content</div>
        </Drawer>,
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    },
  );

  it("applies custom body class", () => {
    const { container } = render(
      <Drawer opened bodyClassName="custom-body" onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    expect(container.querySelector(".custom-body")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Drawer opened className="custom-drawer" onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    expect(container.querySelector(".custom-drawer")).toBeInTheDocument();
  });

  it("does not register escape listener for panel variant", () => {
    render(
      <Drawer variant="panel" opened onClose={onClose}>
        <div>Content</div>
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).not.toHaveBeenCalled();
  });
});
