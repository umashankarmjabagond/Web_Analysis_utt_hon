import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";
import Accordion from "./Accordion";

describe("Accordion", () => {
  it("renders title", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(
      screen.getByText("Metrics"),
    ).toBeInTheDocument();
  });

  it("renders count when provided", () => {
    render(
      <Accordion
        title="Metrics"
        count={5}
      >
        <div>Content</div>
      </Accordion>,
    );

    expect(
      screen.getByText("5"),
    ).toBeInTheDocument();
  });

  it("does not render count when count is undefined", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(
      screen.queryByText("5"),
    ).not.toBeInTheDocument();
  });

  it("renders children when defaultOpen is true", () => {
    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("does not render children when defaultOpen is false", () => {
    render(
      <Accordion
        title="Metrics"
        defaultOpen={false}
      >
        <div>Content</div>
      </Accordion>,
    );

    expect(
      screen.queryByText("Content"),
    ).not.toBeInTheDocument();
  });

  it("opens accordion when clicked", async () => {
    const user = userEvent.setup();

    render(
      <Accordion
        title="Metrics"
        defaultOpen={false}
      >
        <div>Content</div>
      </Accordion>,
    );

    const button =
      screen.getByRole("button");

    await user.click(button);

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("closes accordion when clicked while open", async () => {
    const user = userEvent.setup();

    render(
      <Accordion title="Metrics">
        <div>Content</div>
      </Accordion>,
    );

    const button =
      screen.getByRole("button");

    await user.click(button);

    expect(
      screen.queryByText("Content"),
    ).not.toBeInTheDocument();
  });

  it("toggles multiple times", async () => {
    const user = userEvent.setup();

    render(
      <Accordion
        title="Metrics"
        defaultOpen={false}
      >
        <div>Content</div>
      </Accordion>,
    );

    const button =
      screen.getByRole("button");

    await user.click(button);

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();

    await user.click(button);

    expect(
      screen.queryByText("Content"),
    ).not.toBeInTheDocument();

    await user.click(button);

    expect(
      screen.getByText("Content"),
    ).toBeInTheDocument();
  });

  it("renders complex children", () => {
    render(
      <Accordion title="Metrics">
        <div>Item 1</div>
        <div>Item 2</div>
      </Accordion>,
    );

    expect(
      screen.getByText("Item 1"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Item 2"),
    ).toBeInTheDocument();
  });
});