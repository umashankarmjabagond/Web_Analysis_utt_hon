import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";

import { render, screen } from "../../test";
import Table from "./Table";

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

  it("does not render global search input when filterable is false", () => {
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

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
  });

  it("renders pagination controls when pagination is enabled", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
  });

  it("does not render pagination when pagination is disabled", () => {
    render(<Table data={data} columns={columns} />);

    expect(screen.queryByText(/Page/i)).not.toBeInTheDocument();
  });

  it("renders page size dropdown", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    expect(screen.getByText("Show 10")).toBeInTheDocument();
  });

  it("changes page size", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    const select = screen.getByRole("combobox");

    await user.click(select);

    const option = screen.getByText("Show 20");

    await user.click(option);

    expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();
  });

  it("renders pagination buttons", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBe(4);
  });

  it("disables first and previous buttons on first page", () => {
    render(<Table data={pagedData} columns={columns} pagination />);

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();

    expect(buttons[2]).toBeEnabled();
    expect(buttons[3]).toBeEnabled();
  });

  it("moves to next page", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[2]);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    expect(screen.getByText("User10")).toBeInTheDocument();

    expect(screen.queryByText("User0")).not.toBeInTheDocument();
  });

  it("moves to last page", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[3]);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    expect(screen.getByText("User19")).toBeInTheDocument();
  });

  it("moves back to previous page", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    const buttons = screen.getAllByRole("button");

    await user.click(buttons[2]);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    const updatedButtons = screen.getAllByRole("button");

    await user.click(updatedButtons[1]);

    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();

    expect(screen.getByText("User0")).toBeInTheDocument();
  });

  it("moves to first page", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    let buttons = screen.getAllByRole("button");

    await user.click(buttons[3]);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    buttons = screen.getAllByRole("button");

    await user.click(buttons[0]);

    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();

    expect(screen.getByText("User0")).toBeInTheDocument();
  });

  it("renders sortable mode", () => {
    render(<Table data={data} columns={columns} sortable />);

    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("sorts ascending when sortable header is clicked", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    await user.click(screen.getByText("Name"));

    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("Jane");

    expect(rows[2]).toHaveTextContent("John");
  });

  it("sorts descending when sortable header is clicked twice", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    const header = screen.getByText("Name");

    await user.click(header);
    await user.click(header);

    const rows = screen.getAllByRole("row");

    expect(rows[1]).toHaveTextContent("John");

    expect(rows[2]).toHaveTextContent("Jane");
  });

  it("renders ascending sort icon after first click", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    await user.click(screen.getByText("Name"));

    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("renders descending sort icon after second click", async () => {
    const user = userEvent.setup();

    render(<Table data={data} columns={columns} sortable />);

    const header = screen.getByText("Name");

    await user.click(header);
    await user.click(header);

    expect(document.querySelector("svg")).toBeInTheDocument();
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

  it("renders zebra stripes mode without affecting rendering", () => {
    render(<Table data={data} columns={columns} zebraStripes />);

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();
  });

  it("handles pagination button clicks without errors", async () => {
    const user = userEvent.setup();

    render(<Table data={pagedData} columns={columns} pagination />);

    let buttons = screen.getAllByRole("button");

    await user.click(buttons[2]);

    buttons = screen.getAllByRole("button");

    await user.click(buttons[1]);

    buttons = screen.getAllByRole("button");

    await user.click(buttons[3]);

    buttons = screen.getAllByRole("button");

    await user.click(buttons[0]);

    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
  });
});
