import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders nothing when items are empty", () => {
    const { container } = render(<Breadcrumb items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders breadcrumb items", () => {
    render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "Home",
          },
        ]}
      />,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onItemClick when item is clicked", async () => {
    const user = userEvent.setup();

    const handleClick = vi.fn();

    render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "Home",
          },
        ]}
        onItemClick={handleClick}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);

    expect(handleClick).toHaveBeenCalledWith(
      {
        id: "1",
        label: "Home",
      },
      0,
    );
  });

  it("does not throw when onItemClick is not provided", async () => {
    const user = userEvent.setup();

    render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "Home",
          },
        ]}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(true).toBe(true);
  });

  it("renders multiple breadcrumb buttons", () => {
    render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "Home",
          },
          {
            id: "2",
            label: "Dashboard",
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders icon when image is provided", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "School",
            image: "School",
          },
        ]}
      />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders chevron separator for multiple items", () => {
    const { container } = render(
      <Breadcrumb
        items={[
          {
            id: "1",
            label: "Home",
          },
          {
            id: "2",
            label: "Dashboard",
          },
        ]}
      />,
    );

    const svgs = container.querySelectorAll("svg");

    expect(svgs.length).toBeGreaterThan(0);
  });
});
