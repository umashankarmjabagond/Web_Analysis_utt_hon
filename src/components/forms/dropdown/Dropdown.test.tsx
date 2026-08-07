import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import Dropdown from "./Dropdown";

describe("Dropdown", () => {
  const items = [
    {
      label: "Edit",
      value: "edit",
    },
    {
      label: "Delete",
      value: "delete",
    },
  ];

  it("renders placeholder", () => {
    render(
      <Dropdown
        items={items}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Select"),
    ).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(
      <Dropdown
        items={items}
        placeholder="Actions"
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Actions"),
    ).toBeInTheDocument();
  });

  it("menu is closed by default", () => {
    render(
      <Dropdown
        items={items}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.queryByText("Edit"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Delete"),
    ).not.toBeInTheDocument();
  });

  it("opens menu when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        items={items}
        onSelect={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      screen.getByText("Edit"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Delete"),
    ).toBeInTheDocument();
  });

  it("closes menu when trigger is clicked twice", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        items={items}
        onSelect={vi.fn()}
      />,
    );

    const trigger =
      screen.getByRole("button");

    await user.click(trigger);

    expect(
      screen.getByText("Edit"),
    ).toBeInTheDocument();

    await user.click(trigger);

    expect(
      screen.queryByText("Edit"),
    ).not.toBeInTheDocument();
  });

  it("calls onSelect when item is clicked", async () => {
    const user = userEvent.setup();

    const handleSelect = vi.fn();

    render(
      <Dropdown
        items={items}
        onSelect={handleSelect}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    await user.click(
      screen.getByText("Edit"),
    );

    expect(handleSelect).toHaveBeenCalledWith(
      items[0],
    );
  });

  it("closes menu after selecting an item", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        items={items}
        onSelect={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    await user.click(
      screen.getByText("Edit"),
    );

    expect(
      screen.queryByText("Delete"),
    ).not.toBeInTheDocument();
  });

  it("renders item icons", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        items={[
          {
            label: "Edit",
            value: "edit",
            icon: (
              <span data-testid="edit-icon">
                ✏️
              </span>
            ),
          },
        ]}
        onSelect={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      screen.getByTestId("edit-icon"),
    ).toBeInTheDocument();
  });

  it("closes menu when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Dropdown
          items={items}
          onSelect={vi.fn()}
        />
        <div data-testid="outside">
          Outside
        </div>
      </>,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      screen.getByText("Edit"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByTestId("outside"),
    );

    expect(
      screen.queryByText("Edit"),
    ).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Dropdown
        items={items}
        className="custom-class"
        onSelect={vi.fn()}
      />,
    );

    expect(
      container.querySelector(".custom-class"),
    ).toBeInTheDocument();
  });

  it("renders empty dropdown items list", async () => {
    const user = userEvent.setup();

    render(
      <Dropdown
        items={[]}
        onSelect={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    expect(
      screen.getByRole("button"),
    ).toBeInTheDocument();
  });

  it("allows selecting second item", async () => {
    const user = userEvent.setup();

    const handleSelect = vi.fn();

    render(
      <Dropdown
        items={items}
        onSelect={handleSelect}
      />,
    );

    await user.click(
      screen.getByRole("button"),
    );

    await user.click(
      screen.getByText("Delete"),
    );

    expect(handleSelect).toHaveBeenCalledWith(
      items[1],
    );
  });
});