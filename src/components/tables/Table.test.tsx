import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";

import { render, screen } from "../../test";
import Table from "./Table";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        COMMON_SEARCH: "Search...",
        COMMON_FILTER: "Filter...",
        COMMON_LOADING: "Loading...",
        TABLE_NO_RECORDS_FOUND: "No records found",
        TABLE_PAGE: "Page",
        TABLE_OF: "of",
        TABLE_SHOW: "Show",
      };

      return translations[key] ?? key;
    },
  }),
}));

type TestData = {
  name: string;
  age: number;
};

const data: TestData[] = [
  {
    name: "John",
    age: 25,
  },
  {
    name: "Jane",
    age: 30,
  },
];

const pagedData: TestData[] = Array.from(
  { length: 20 },
  (_, index): TestData => ({
    name: `User${index}`,
    age: index,
  }),
);

const columns: ColumnDef<TestData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: (info) => info.getValue(),
  },
];

const groupedColumns: ColumnDef<TestData>[] = [
  {
    header: "Group",
    columns: [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "age",
        header: "Age",
      },
    ],
  },
];

const nestedGroupedColumns: ColumnDef<TestData>[] = [
  {
    header: "Person Info",
    columns: [
      {
        header: "Identity",
        columns: [
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "age",
            header: "Age",
          },
        ],
      },
    ],
  },
];

const placeholderColumns: ColumnDef<TestData>[] = [
  {
    header: "Group A",
    columns: [
      {
        accessorKey: "name",
        header: "Name",
      },
    ],
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

/**
 * Returns only the four actual pagination buttons.
 *
 * The reusable Select component also contains buttons,
 * so using getAllByRole("button")[0..3] is unreliable.
 */
const getPaginationButtons = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll("button")).filter((button) =>
    button.className.includes("w-8"),
  );
};

describe("Table", () => {
  it("renders table element", () => {
    const { container } = render(<Table data={data} columns={columns} />);

    expect(container.querySelector("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();

    expect(screen.getByText("25")).toBeInTheDocument();

    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<Table data={data} columns={columns} loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders default empty message", () => {
    render(<Table data={[]} columns={columns} />);

    expect(screen.getByText("No records found")).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(<Table data={[]} columns={columns} emptyMessage="Nothing Here" />);

    expect(screen.getByText("Nothing Here")).toBeInTheDocument();
  });

  it("renders global search input when filterable", () => {
    render(<Table data={data} columns={columns} filterable />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("does not render global search when filterable is false", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  it("updates global filter input", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} filterable />);

    const input = screen.getByPlaceholderText("Search...");

    await user.type(input, "John");

    expect(input).toHaveValue("John");
  });

  it("renders column filters when filterable", () => {
    render(<Table data={data} columns={columns} filterable />);

    expect(screen.getAllByPlaceholderText("Filter...")).toHaveLength(2);
  });

  it("updates column filter", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} filterable />);

    const filters = screen.getAllByPlaceholderText("Filter...");

    await user.type(filters[0], "John");

    expect(filters[0]).toHaveValue("John");
  });

  it("filters rows using column filter", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} filterable />);

    const filters = screen.getAllByPlaceholderText("Filter...");

    await user.type(filters[0], "John");

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
  });

  it("renders pagination when enabled", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("does not render pagination when disabled", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.queryByText(/Page 1 of/i)).not.toBeInTheDocument();
  });

  it("renders default page size", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    expect(screen.getByText("Show 10")).toBeInTheDocument();
  });

  it("renders all pagination buttons", () => {
    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    const buttons = getPaginationButtons(container);

    expect(buttons).toHaveLength(4);
  });

  it("disables first and previous buttons on first page", () => {
    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    const buttons = getPaginationButtons(container);

    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();

    expect(buttons[2]).toBeEnabled();
    expect(buttons[3]).toBeEnabled();
  });

  it("moves to next page", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    const buttons = getPaginationButtons(container);

    // 0 = first
    // 1 = previous
    // 2 = next
    // 3 = last
    await user.click(buttons[2]);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    expect(screen.getByText("User10")).toBeInTheDocument();

    expect(screen.queryByText("User0")).not.toBeInTheDocument();
  });

  it("moves to last page", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    const buttons = getPaginationButtons(container);

    await user.click(buttons[3]);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    expect(screen.getByText("User19")).toBeInTheDocument();
  });

  it("moves back to previous page", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    let buttons = getPaginationButtons(container);

    await user.click(buttons[2]);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    buttons = getPaginationButtons(container);

    await user.click(buttons[1]);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    expect(screen.getByText("User0")).toBeInTheDocument();
  });

  it("moves to first page", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    let buttons = getPaginationButtons(container);

    await user.click(buttons[3]);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    buttons = getPaginationButtons(container);

    await user.click(buttons[0]);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    expect(screen.getByText("User0")).toBeInTheDocument();
  });

  it("renders sortable mode", () => {
    render(<Table data={data} columns={columns} sortable />);

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("sorts ascending when header is clicked", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    await user.click(screen.getByText("Name"));

    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("Jane");
    expect(rows[2]).toHaveTextContent("John");
  });

  it("sorts descending when header is clicked twice", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    const header = screen.getByText("Name");

    await user.click(header);
    await user.click(header);

    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("John");
    expect(rows[2]).toHaveTextContent("Jane");
  });

  it("renders ascending sort icon", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={data} columns={columns} sortable />,
    );

    await user.click(screen.getByText("Name"));

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders descending sort icon", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={data} columns={columns} sortable />,
    );

    const header = screen.getByText("Name");

    await user.click(header);
    await user.click(header);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders grouped headers", () => {
    render(<Table data={data} columns={groupedColumns} />);

    expect(screen.getByText("Group")).toBeInTheDocument();

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders nested grouped headers", () => {
    render(<Table data={data} columns={nestedGroupedColumns} />);

    expect(screen.getByText("Person Info")).toBeInTheDocument();

    expect(screen.getByText("Identity")).toBeInTheDocument();

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders placeholder header branch", () => {
    render(<Table data={data} columns={placeholderColumns} />);

    expect(screen.getByText("Group A")).toBeInTheDocument();

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("applies custom wrapper class", () => {
    const { container } = render(
      <Table data={data} columns={columns} className="custom-wrapper" />,
    );

    expect(container.querySelector(".custom-wrapper")).toBeInTheDocument();
  });

  it("applies custom table class", () => {
    const { container } = render(
      <Table data={data} columns={columns} tableClassName="custom-table" />,
    );

    expect(container.querySelector(".custom-table")).toBeInTheDocument();
  });

  it("renders sticky header mode", () => {
    const { container } = render(
      <Table data={data} columns={columns} stickyHeader />,
    );

    const header = container.querySelector("th");

    expect(header).toHaveClass("sticky");
  });

  it("renders zebra stripes mode", () => {
    render(<Table data={data} columns={columns} zebraStripes />);

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("handles pagination button clicks", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Table data={pagedData} columns={columns} pagination />,
    );

    let buttons = getPaginationButtons(container);

    await user.click(buttons[2]);

    buttons = getPaginationButtons(container);

    await user.click(buttons[1]);

    buttons = getPaginationButtons(container);

    await user.click(buttons[3]);

    buttons = getPaginationButtons(container);

    await user.click(buttons[0]);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("renders page size options", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    expect(screen.getByText("Show 10")).toBeInTheDocument();

    const show10 = screen.getByText("Show 10");

    await user.click(show10);

    expect(screen.getByText("Show 20")).toBeInTheDocument();

    expect(screen.getByText("Show 30")).toBeInTheDocument();

    expect(screen.getByText("Show 50")).toBeInTheDocument();
  });
});
