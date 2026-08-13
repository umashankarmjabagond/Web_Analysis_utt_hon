import { fireEvent, render, screen } from "../../test";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Drawer from "./Drawer";

describe("Drawer", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  const renderDrawer = (
    props: Partial<React.ComponentProps<typeof Drawer>> = {},
  ) => {
    return render(
      <Drawer opened onClose={onClose} {...props}>
        Drawer Content
      </Drawer>,
    );
  };

  it("renders children", () => {
    renderDrawer();

    expect(screen.getByText("Drawer Content")).toBeInTheDocument();
  });

  it("renders string title", () => {
    renderDrawer({
      title: "My Drawer",
    });

    expect(screen.getByText("My Drawer")).toBeInTheDocument();
  });

  it("renders ReactNode title", () => {
    renderDrawer({
      title: <span>Custom Title</span>,
    });

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders footer", () => {
    renderDrawer({
      footer: <div>Footer Content</div>,
    });

    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("does not render footer when footer is not provided", () => {
    renderDrawer();

    expect(screen.queryByText("Footer Content")).not.toBeInTheDocument();
  });

  it("renders close button when title exists", () => {
    renderDrawer({
      title: "My Drawer",
    });

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBeGreaterThan(0);
  });

  it("calls onClose when close button is clicked", () => {
    renderDrawer({
      title: "My Drawer",
    });

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBeGreaterThan(0);

    fireEvent.click(buttons[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies bodyClassName", () => {
    const { container } = renderDrawer({
      bodyClassName: "custom-body",
    });

    expect(container.querySelector(".custom-body")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderDrawer({
      className: "custom-drawer",
    });

    expect(container.querySelector(".custom-drawer")).toBeInTheDocument();
  });

  it("renders overlay variant by default", () => {
    const { container } = renderDrawer();

    const overlay = container.querySelector(".bg-drawer-overlay");

    expect(overlay).toBeInTheDocument();
  });

  it("does not render overlay for panel variant", () => {
    const { container } = renderDrawer({
      variant: "panel",
    });

    const overlay = container.querySelector(".bg-drawer-overlay");

    expect(overlay).not.toBeInTheDocument();
  });

  it("calls onClose when overlay is clicked and closeOnOverlayClick is true", () => {
    const { container } = renderDrawer({
      closeOnOverlayClick: true,
    });

    const overlay = container.querySelector(".bg-drawer-overlay");

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay is clicked and closeOnOverlayClick is false", () => {
    const { container } = renderDrawer({
      closeOnOverlayClick: false,
    });

    const overlay = container.querySelector(".bg-drawer-overlay");

    expect(overlay).toBeInTheDocument();

    fireEvent.click(overlay as HTMLElement);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", () => {
    renderDrawer();

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when another key is pressed", () => {
    renderDrawer();

    fireEvent.keyDown(document, {
      key: "Enter",
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("sets body overflow to hidden when opened", () => {
    renderDrawer();

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when drawer is closed", () => {
    const { rerender } = renderDrawer();

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Drawer opened={false} onClose={onClose}>
        Drawer Content
      </Drawer>,
    );

    expect(document.body.style.overflow).toBe("");
  });

  it("does not change body overflow for panel variant", () => {
    renderDrawer({
      variant: "panel",
    });

    expect(document.body.style.overflow).toBe("");
  });

  it("renders left position", () => {
    const { container } = renderDrawer({
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-x-0");
  });

  it("renders right position", () => {
    const { container } = renderDrawer({
      position: "right",
    });

    const drawer = container.querySelector(".right-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-x-0");
  });

  it("renders top position", () => {
    const { container } = renderDrawer({
      position: "top",
    });

    const drawer = container.querySelector(".left-0.top-0.w-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-y-0");
  });

  it("renders bottom position", () => {
    const { container } = renderDrawer({
      position: "bottom",
    });

    const drawer = container.querySelector(".bottom-0.left-0.w-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-y-0");
  });

  it("renders closed drawer with close transform", () => {
    const { container } = renderDrawer({
      opened: false,
    });

    const drawer = container.querySelector(".bottom-0.left-0.w-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-y-full");
  });

  it("renders closed left drawer with correct transform", () => {
    const { container } = renderDrawer({
      opened: false,
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("-translate-x-full");
  });

  it("renders closed right drawer with correct transform", () => {
    const { container } = renderDrawer({
      opened: false,
      position: "right",
    });

    const drawer = container.querySelector(".right-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("translate-x-full");
  });

  it("renders closed top drawer with correct transform", () => {
    const { container } = renderDrawer({
      opened: false,
      position: "top",
    });

    const drawer = container.querySelector(".left-0.top-0.w-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass("-translate-y-full");
  });

  it("supports small size", () => {
    const { container } = renderDrawer({
      size: "sm",
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveStyle({
      width: "320px",
    });
  });

  it("supports medium size", () => {
    const { container } = renderDrawer({
      size: "md",
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveStyle({
      width: "420px",
    });
  });

  it("supports large size", () => {
    const { container } = renderDrawer({
      size: "lg",
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveStyle({
      width: "560px",
    });
  });

  it("supports extra large size", () => {
    const { container } = renderDrawer({
      size: "xl",
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveStyle({
      width: "680px",
    });
  });

  it("supports full size", () => {
    const { container } = renderDrawer({
      size: "full",
      position: "left",
    });

    const drawer = container.querySelector(".left-0.top-0.h-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveStyle({
      width: "100%",
    });
  });

  it("uses height for top position", () => {
    const { container } = renderDrawer({
      position: "top",
      size: "lg",
    });

    const drawer = container.querySelector(".left-0.top-0.w-full");

    expect(drawer).toBeInTheDocument();

    expect(drawer).toHaveStyle({
      height: "560px",
    });
  });

  it("uses height for bottom position", () => {
    const { container } = renderDrawer({
      position: "bottom",
      size: "xl",
    });

    const drawer = container.querySelector(".bottom-0.left-0.w-full");

    expect(drawer).toBeInTheDocument();

    expect(drawer).toHaveStyle({
      height: "680px",
    });
  });

  it("does not apply drawer size style for panel variant", () => {
    const { container } = renderDrawer({
      variant: "panel",
      position: "left",
      size: "lg",
    });

    const drawer = container.querySelector(".relative.w-full");

    expect(drawer).toBeInTheDocument();
    expect(drawer).not.toHaveStyle({
      width: "560px",
    });
  });

  it("renders title as heading when title is a string", () => {
    renderDrawer({
      title: "Drawer Title",
    });

    expect(
      screen.getByRole("heading", {
        name: "Drawer Title",
      }),
    ).toBeInTheDocument();
  });

  it("renders title without creating a heading when title is a ReactNode", () => {
    renderDrawer({
      title: <div>Custom React Title</div>,
    });

    expect(screen.getByText("Custom React Title")).toBeInTheDocument();
  });

  it("renders footer content correctly", () => {
    renderDrawer({
      footer: <button type="button">Footer Action</button>,
    });

    expect(
      screen.getByRole("button", {
        name: "Footer Action",
      }),
    ).toBeInTheDocument();
  });
});
