import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../test";

import Drawer from "./Drawer";

vi.mock("lucide-react", () => ({
  X: () => <span data-testid="close-icon">X</span>,
}));

describe("Drawer", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <Drawer opened onClose={onClose}>
        <div>Drawer Content</div>
      </Drawer>,
    );

    expect(
      screen.getByText("Drawer Content"),
    ).toBeInTheDocument();
  });

  it("renders title string", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        title="My Drawer"
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("My Drawer"),
    ).toBeInTheDocument();
  });

  it("renders title react node", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        title={<div>Custom Title</div>}
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("Custom Title"),
    ).toBeInTheDocument();
  });

  it("renders footer", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        footer={<div>Footer Content</div>}
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("Footer Content"),
    ).toBeInTheDocument();
  });

  it("renders close button when title exists", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        title="Drawer"
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByRole("button", {
        name: "Close drawer",
      }),
    ).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        title="Drawer"
      >
        Content
      </Drawer>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close drawer",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders footer only when provided", () => {
    render(
      <Drawer opened onClose={onClose}>
        Content
      </Drawer>,
    );

    expect(
      screen.queryByText("Footer Content"),
    ).not.toBeInTheDocument();
  });

  it("applies bodyClassName", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        bodyClassName="custom-body"
      >
        Content
      </Drawer>,
    );

    expect(
      document.querySelector(".custom-body"),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Drawer
        opened
        onClose={onClose}
        className="custom-drawer"
      >
        Content
      </Drawer>,
    );

    expect(
      document.querySelector(".custom-drawer"),
    ).toBeInTheDocument();
  });

  it("renders overlay variant by default", () => {
    const { container } = render(
      <Drawer opened onClose={onClose}>
        Content
      </Drawer>,
    );

    expect(
      container.querySelector(
        ".bg-black\\/40",
      ),
    ).toBeInTheDocument();
  });

  it("does not render overlay in panel variant", () => {
    const { container } = render(
      <Drawer
        variant="panel"
        opened
        onClose={onClose}
      >
        Content
      </Drawer>,
    );

    expect(
      container.querySelector(
        ".bg-black\\/40",
      ),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when overlay clicked and closeOnOverlayClick is true", () => {
    const { container } = render(
      <Drawer
        opened
        onClose={onClose}
        closeOnOverlayClick
      >
        Content
      </Drawer>,
    );

    const overlay =
      container.querySelector(
        ".bg-black\\/40",
      );

    fireEvent.click(overlay!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when overlay clicked and closeOnOverlayClick is false", () => {
    const { container } = render(
      <Drawer
        opened
        onClose={onClose}
      >
        Content
      </Drawer>,
    );

    const overlay =
      container.querySelector(
        ".bg-black\\/40",
      );

    fireEvent.click(overlay!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when escape key is pressed", () => {
    render(
      <Drawer opened onClose={onClose}>
        Content
      </Drawer>,
    );

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose for different key", () => {
    render(
      <Drawer opened onClose={onClose}>
        Content
      </Drawer>,
    );

    fireEvent.keyDown(document, {
      key: "Enter",
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("sets body overflow when opened", () => {
    render(
      <Drawer opened onClose={onClose}>
        Content
      </Drawer>,
    );

    expect(
      document.body.style.overflow,
    ).toBe("hidden");
  });

  it("renders left position", () => {
    render(
      <Drawer
        opened
        position="left"
        onClose={onClose}
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("renders right position", () => {
    render(
      <Drawer
        opened
        position="right"
        onClose={onClose}
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("renders top position", () => {
    render(
      <Drawer
        opened
        position="top"
        onClose={onClose}
      >
        Content
      </Drawer>,
    );

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("renders bottom position", () => {
    render(
      <Drawer
        opened
        position="bottom"
              onClose={onClose}
    >
      Content
    </Drawer>,
  );

  expect(
    screen.getByText("Content"),
  ).toBeInTheDocument();
});

it("supports custom size", () => {
  render(
    <Drawer
      opened
      position="left"
      size="xl"
      onClose={onClose}
    >
      Content
    </Drawer>,
  );

  expect(
    screen.getByText("Content"),
  ).toBeInTheDocument();
});

it("renders closed drawer", () => {
  render(
    <Drawer
      opened={false}
      onClose={onClose}
    >
      Content
    </Drawer>,
  );

  expect(
    screen.getByText("Content"),
  ).toBeInTheDocument();
});

it("renders close icon", () => {
  render(
    <Drawer
      opened
      title="Drawer"
      onClose={onClose}
    >
      Content
    </Drawer>,
  );

  expect(
    screen.getByTestId(
      "close-icon",
    ),
  ).toBeInTheDocument();
});
});