import {
  describe,
  expect,
  it,
} from "vitest";
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
  (_, index) => ({
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
  it("renders column headers", () => {
    render(
      <Table
        data={data}
        columns={columns}
      />,
    );

    expect(
      screen.getByText("Name"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Age"),
    ).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(
      <Table
        data={data}
        columns={columns}
      />,
    );

    expect(
      screen.getByText("John"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Jane"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("25"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("30"),
    ).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <Table
        data={data}
        columns={columns}
        loading
      />,
    );

    expect(
      screen.getByText("Loading..."),
    ).toBeInTheDocument();
  });

  it("renders default empty message", () => {
    render(
      <Table
        data={[]}
        columns={columns}
      />,
    );

    expect(
      screen.getByText(
        "No records found",
      ),
    ).toBeInTheDocument();
  });

  it("renders custom empty message", () => {
    render(
      <Table
        data={[]}
        columns={columns}
        emptyMessage="Nothing Here"
      />,
    );

    expect(
      screen.getByText(
        "Nothing Here",
      ),
    ).toBeInTheDocument();
  });

  it("renders global search input when filterable", () => {
    render(
      <Table
        data={data}
        columns={columns}
        filterable
      />,
    );

    expect(
      screen.getByPlaceholderText(
        "Search...",
      ),
    ).toBeInTheDocument();
  });

  it("updates global filter input", async () => {
    const user = userEvent.setup();

    render(
      <Table
        data={data}
        columns={columns}
        filterable
      />,
    );

    const input =
      screen.getByPlaceholderText(
        "Search...",
      );

    await user.type(
      input,
      "John",
    );

    expect(input).toHaveValue(
      "John",
    );
  });

  it("renders column filters when filterable", () => {
    render(
      <Table
        data={data}
        columns={columns}
        filterable
      />,
    );

    expect(
      screen.getAllByPlaceholderText(
        "Filter...",
      ).length,
    ).toBeGreaterThan(0);
  });

  it("renders pagination controls", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByText(/Page/i),
    ).toBeInTheDocument();
  });

  it("renders page size dropdown", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByDisplayValue(
        "Show 10",
      ),
    ).toBeInTheDocument();
  });

  it("renders first page button", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByText("<<"),
    ).toBeInTheDocument();
  });

  it("renders previous page button", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByText("<"),
    ).toBeInTheDocument();
  });

  it("renders next page button", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByText(">"),
    ).toBeInTheDocument();
  });

  it("renders last page button", () => {
    render(
      <Table
        data={data}
        columns={columns}
        pagination
      />,
    );

    expect(
      screen.getByText(">>"),
    ).toBeInTheDocument();
  });

  it("applies custom wrapper class", () => {
    const { container } = render(
      <Table
        data={data}
        columns={columns}
        className="custom-wrapper"
      />,
    );

    expect(
      container.querySelector(
        ".custom-wrapper",
      ),
    ).toBeInTheDocument();
  });

  it("applies custom table class", () => {
    const { container } = render(
      <Table
        data={data}
        columns={columns}
        tableClassName="custom-table"
      />,
    );

    expect(
      container.querySelector(
        ".custom-table",
      ),
    ).toBeInTheDocument();
  });

  it("renders sticky header mode", () => {
    render(
      <Table
        data={data}
        columns={columns}
        stickyHeader
      />,
    );

    expect(
      screen.getByText("Name"),
    ).toBeInTheDocument();
  });

  it("renders zebra stripes mode", () => {
    render(
      <Table
        data={data}
        columns={columns}
        zebraStripes
      />,
    );

    expect(
      screen.getByText("John"),
    ).toBeInTheDocument();
  });

  it("renders sortable mode", () => {
    render(
      <Table
        data={data}
        columns={columns}
        sortable
      />,
    );

    expect(
      screen.getByText("Name"),
    ).toBeInTheDocument();
  });

  it("handles sort click", async () => {
    const user = userEvent.setup();

    render(
      <Table
        data={data}
        columns={columns}
        sortable
      />,
    );

    await user.click(
      screen.getByText("Name"),
    );
  });

  it("renders table element", () => {
    const { container } = render(
      <Table
        data={data}
        columns={columns}
      />,
    );

    expect(
      container.querySelector(
        "table",
      ),
    ).toBeInTheDocument();
  });

  it("updates column filter", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={data}
      columns={columns}
      filterable
    />,
  );

  const filters =
    screen.getAllByPlaceholderText(
      "Filter...",
    );

  await user.type(
    filters[0],
    "John",
  );

  expect(filters[0]).toHaveValue(
    "John",
  );
});

it("changes page size", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  const select =
    screen.getByRole("combobox");

  await user.selectOptions(
    select,
    "20",
  );

  expect(select).toHaveValue(
    "20",
  );
});

it("clicks first page button", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  await user.click(
    screen.getByText("<<"),
  );
});

it("clicks previous page button", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  await user.click(
    screen.getByText("<"),
  );
});

it("clicks next page button", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  await user.click(
    screen.getByText(">"),
  );
});

it("clicks last page button", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  await user.click(
    screen.getByText(">>"),
  );
});

it("renders descending sort icon", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={data}
      columns={columns}
      sortable
    />,
  );

  const header =
    screen.getByText("Name");

  await user.click(header);
  await user.click(header);

  expect(
    screen.getByText("▼"),
  ).toBeInTheDocument();
});

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

it("renders grouped headers", () => {
  render(
    <Table
      data={data}
      columns={groupedColumns}
    />,
  );

  expect(
    screen.getByText("Group"),
  ).toBeInTheDocument();
});

it("covers previous pagination handlers", async () => {
  const user = userEvent.setup();

  render(
    <Table
      data={pagedData}
      columns={columns}
      pagination
    />,
  );

  await user.click(screen.getByText(">"));
  await user.click(screen.getByText("<<"));

  await user.click(screen.getByText(">"));
  await user.click(screen.getByText("<"));
});

it("renders nested grouped headers", () => {
  render(
    <Table
      data={data}
      columns={nestedGroupedColumns}
    />,
  );

  expect(
    screen.getByText("Person Info"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Identity"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Name"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Age"),
  ).toBeInTheDocument();
});

it("covers placeholder header branch", () => {
  render(
    <Table
      data={data}
      columns={placeholderColumns}
    />,
  );

  expect(
    screen.getByText("Group A"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Name"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Age"),
  ).toBeInTheDocument();
});


});