import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../test";

import GroupedSelector from "./GroupedSelector";

describe("GroupedSelector", () => {
  const sections = [
    {
      id: "section-1",
      title: "Documents",
      items: [
        {
          id: "file-1",
          label: "Report.pdf",
        },
        {
          id: "file-2",
          label: "Summary.docx",
        },
      ],
    },
  ];

  it("renders default placeholder", () => {
    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Select an option"),
    ).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(
      <GroupedSelector
        placeholder="Choose file"
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Choose file"),
    ).toBeInTheDocument();
  });

  it("renders section title", () => {
    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Documents"),
    ).toBeInTheDocument();
  });

  it("renders section items", () => {
    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Report.pdf"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Summary.docx"),
    ).toBeInTheDocument();
  });

  it("calls onSelect when item is clicked", async () => {
    const user = userEvent.setup();

    const handleSelect = vi.fn();

    render(
      <GroupedSelector
        sections={sections}
        onSelect={handleSelect}
      />,
    );

    await user.click(
      screen.getByText("Report.pdf"),
    );

    expect(handleSelect).toHaveBeenCalledWith(
      sections[0].items[0],
    );
  });

  it("closes selector after selecting an item", async () => {
    const user = userEvent.setup();

    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    await user.click(
      screen.getByText("Report.pdf"),
    );

    expect(
      screen.queryByText("Summary.docx"),
    ).not.toBeInTheDocument();
  });

  it("toggles closed when header is clicked", async () => {
    const user = userEvent.setup();

    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    const headerButton =
      screen.getByRole("button", {
        name: /select an option/i,
      });

    await user.click(headerButton);

    expect(
      screen.queryByText("Report.pdf"),
    ).not.toBeInTheDocument();
  });

  it("reopens when header is clicked twice", async () => {
    const user = userEvent.setup();

    render(
      <GroupedSelector
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    const headerButton =
      screen.getByRole("button", {
        name: /select an option/i,
      });

    await user.click(headerButton);

    expect(
      screen.queryByText("Report.pdf"),
    ).not.toBeInTheDocument();

    await user.click(headerButton);

    expect(
      screen.getByText("Report.pdf"),
    ).toBeInTheDocument();
  });

  it("shows no options available when all sections are empty", () => {
    render(
      <GroupedSelector
        sections={[
          {
            id: "empty",
            title: "Empty",
            items: [],
          },
        ]}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("No options available"),
    ).toBeInTheDocument();
  });

  it("renders multiple sections", () => {
    render(
      <GroupedSelector
        sections={[
          {
            id: "one",
            title: "Documents",
            items: [
              {
                id: "1",
                label: "File A",
              },
            ],
          },
          {
            id: "two",
            title: "Images",
            items: [
              {
                id: "2",
                label: "Image A",
              },
            ],
          },
        ]}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Documents"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Images"),
    ).toBeInTheDocument();
  });

    it("does not toggle when disabled", async () => {
    const user = userEvent.setup();

    render(
      <GroupedSelector
        disabled
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    const headerButton =
  screen.getByRole("button", {
    name: /select an option/i,
  });

    await user.click(headerButton);

    expect(
      screen.getByText("Report.pdf"),
    ).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(
      <GroupedSelector
        disabled
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
  screen.getByRole("button", {
    name: /select an option/i,
  }),
).toBeDisabled();

  });

  it("applies custom className", () => {
    const { container } = render(
      <GroupedSelector
        className="custom-class"
        sections={sections}
        onSelect={vi.fn()}
      />,
    );

    expect(
      container.querySelector(".custom-class"),
    ).toBeInTheDocument();
  });
});