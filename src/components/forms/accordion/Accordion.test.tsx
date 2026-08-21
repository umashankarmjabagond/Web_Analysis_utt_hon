import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";
import Accordion from "./Accordion";

describe("Accordion", () => {
  // ---------------------------------------------------------
  // Existing / Template Accordion
  // ---------------------------------------------------------

  it("renders title", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(screen.getByText("Metrics")).toBeInTheDocument();
  });

  it("renders count when provided", () => {
    render(
      <Accordion title="Metrics" count={5}>
        <div>Content</div>
      </Accordion>,
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("does not render count when count is undefined", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("renders children when defaultOpen is true", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("does not render children when defaultOpen is false", () => {
    render(
      <Accordion title="Metrics" defaultOpen={false}>
        <div>Content</div>
      </Accordion>,
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("opens accordion when clicked", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Metrics" defaultOpen={false}>
        <div>Content</div>
      </Accordion>,
    );

    const button = screen.getByRole("button");

    await user.click(button);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("closes accordion when clicked while open", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    const button = screen.getByRole("button");

    await user.click(button);

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  it("toggles multiple times", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Metrics" defaultOpen={false}>
        <div>Content</div>
      </Accordion>,
    );

    const button = screen.getByRole("button");

    await user.click(button);

    expect(screen.getByText("Content")).toBeInTheDocument();

    await user.click(button);

    expect(screen.queryByText("Content")).not.toBeInTheDocument();

    await user.click(button);

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders complex children", () => {
    render(
      <Accordion title="Metrics">
        <div>Item 1</div>
        <div>Item 2</div>
      </Accordion>,
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();

    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  // ---------------------------------------------------------
  // Connections / Enhanced Accordion
  // ---------------------------------------------------------

  it("renders enhanced accordion with icon, subtitle and action", () => {
    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span data-testid="connection-icon">Icon</span>}
        action={<button type="button">Edit</button>}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(screen.getByText("HDSC1_INFRL")).toBeInTheDocument();

    expect(screen.getByText("Multi Math")).toBeInTheDocument();

    expect(screen.getByTestId("connection-icon")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Edit",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Connection Content")).toBeInTheDocument();
  });

  it("renders enhanced accordion content when defaultOpen is true", () => {
    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(screen.getByText("Connection Content")).toBeInTheDocument();
  });

  it("does not render enhanced accordion content when defaultOpen is false", () => {
    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
        defaultOpen={false}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(screen.queryByText("Connection Content")).not.toBeInTheDocument();
  });

  it("renders collapse button when enhanced accordion is open", () => {
    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(
      screen.getByRole("button", {
        name: "Collapse",
      }),
    ).toBeInTheDocument();
  });

  it("renders expand button when enhanced accordion is closed", () => {
    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
        defaultOpen={false}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(
      screen.getByRole("button", {
        name: "Expand",
      }),
    ).toBeInTheDocument();
  });

  it("expands enhanced accordion when expand button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
        defaultOpen={false}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(screen.queryByText("Connection Content")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Expand",
      }),
    );

    expect(screen.getByText("Connection Content")).toBeInTheDocument();
  });

  it("collapses enhanced accordion when collapse button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    expect(screen.getByText("Connection Content")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Collapse",
      }),
    );

    expect(screen.queryByText("Connection Content")).not.toBeInTheDocument();
  });

  it("does not collapse enhanced accordion when Edit action is clicked", async () => {
    const user = userEvent.setup();

    const handleEdit = vi.fn();

    render(
      <Accordion
        title="HDSC1_INFRL"
        subtitle="Multi Math"
        icon={<span>Icon</span>}
        action={
          <button type="button" onClick={handleEdit}>
            Edit
          </button>
        }
      >
        <div>Connection Content</div>
      </Accordion>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Edit",
      }),
    );

    expect(handleEdit).toHaveBeenCalledTimes(1);

    expect(screen.getByText("Connection Content")).toBeInTheDocument();
  });
});
