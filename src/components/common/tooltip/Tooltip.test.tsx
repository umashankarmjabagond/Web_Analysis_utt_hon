import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import Tooltip from "./Tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip Content">
        <button>Hover Me</button>
      </Tooltip>,
    );

    expect(
      screen.getByRole("button", { name: "Hover Me" }),
    ).toBeInTheDocument();
  });

  it("shows tooltip on mouse enter", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content">
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Tooltip Content")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content">
        <button>Hover Me</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");

    await user.hover(button);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(button);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content">
        <button>Focus Me</button>
      </Tooltip>,
    );

    await user.tab();

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByText("Tooltip Content")).toBeInTheDocument();
  });

  it("hides tooltip on blur", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Tooltip content="Tooltip Content">
          <button>Focus Me</button>
        </Tooltip>
        <button>Next Button</button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.tab();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not render tooltip when content is empty", () => {
    render(
      <Tooltip content="">
        <button>Hover Me</button>
      </Tooltip>,
    );

    expect(
      screen.getByRole("button", { name: "Hover Me" }),
    ).toBeInTheDocument();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not render tooltip when disabled", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content" disabled>
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders custom maxWidth", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content" maxWidth={500}>
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toHaveStyle({
      maxWidth: "500px",
    });
  });

  it("renders custom className", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip Content" className="custom-tooltip">
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toHaveClass("custom-tooltip");
  });

  it("renders arrow by default", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip content="Tooltip Content">
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    const arrow = container.querySelector(".rotate-45");

    expect(arrow).toBeInTheDocument();
  });

  it("does not render arrow when showArrow is false", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip content="Tooltip Content" showArrow={false}>
        <button>Hover Me</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    const arrow = container.querySelector(".rotate-45");

    expect(arrow).not.toBeInTheDocument();
  });

  it.each([["top"], ["bottom"], ["left"], ["right"]])(
    "renders tooltip with %s placement",
    async (placement) => {
      const user = userEvent.setup();

      render(
        <Tooltip
          content="Tooltip Content"
          placement={placement as "top" | "bottom" | "left" | "right"}
        >
          <button>Hover Me</button>
        </Tooltip>,
      );

      await user.hover(screen.getByRole("button"));

      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    },
  );
});
