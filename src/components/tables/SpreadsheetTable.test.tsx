import { describe, expect, it } from "vitest";
import { render, screen } from "../../test";

import SpreadsheetTable from "./SpreadsheetTable";

describe("SpreadsheetTable", () => {
  it("renders no data message when data is empty", () => {
    render(<SpreadsheetTable data={[]} />);

    expect(
      screen.getByText("No data available"),
    ).toBeInTheDocument();
  });

  it("renders no data message when data is undefined", () => {
    render(
      <SpreadsheetTable
        data={undefined as never}
      />,
    );

    expect(
      screen.getByText("No data available"),
    ).toBeInTheDocument();
  });

  it("renders array data", () => {
    render(
      <SpreadsheetTable
        data={[
          ["John", 25],
          ["Jane", 30],
        ]}
      />,
    );

    expect(
      screen.getByText("John"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Jane"),
    ).toBeInTheDocument();
  });

  it("renders object data", () => {
    render(
      <SpreadsheetTable
        data={[
          {
            name: "John",
            age: 25,
          },
        ]}
      />,
    );

    expect(
      screen.getByText("John"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("25"),
    ).toBeInTheDocument();
  });

  it("renders excel column headers", () => {
    render(
      <SpreadsheetTable
        data={[
          ["A", "B", "C"],
        ]}
      />,
    );

    expect(
  screen.getAllByText("A").length,
).toBeGreaterThan(0);

expect(
  screen.getAllByText("B").length,
).toBeGreaterThan(0);

expect(
  screen.getAllByText("C").length,
).toBeGreaterThan(0);

});

  it("renders row numbers", () => {
    render(
      <SpreadsheetTable
        data={[
          ["one"],
          ["two"],
        ]}
      />,
    );

    expect(
      screen.getByText("1"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("2"),
    ).toBeInTheDocument();
  });

  it("renders string values", () => {
    render(
      <SpreadsheetTable
        data={[["Hello"]]}
      />,
    );

    expect(
      screen.getByText("Hello"),
    ).toBeInTheDocument();
  });

  it("renders number values", () => {
    render(
      <SpreadsheetTable
        data={[[123]]}
      />,
    );

    expect(
      screen.getByText("123"),
    ).toBeInTheDocument();
  });

  it("handles boolean true values", () => {
  const { container } = render(
    <SpreadsheetTable
      data={[[true]]}
    />,
  );

  expect(
  container.querySelectorAll("td"),
).toHaveLength(1);
});

  it("handles boolean false values", () => {
  const { container } = render(
    <SpreadsheetTable
      data={[[false]]}
    />,
  );

  expect(
    container.querySelectorAll("td"),
  ).toHaveLength(1);
});

  const arrayValue = [
  "A",
  "B",
  "C",
] as unknown as never;

render(
  <SpreadsheetTable
    data={[[arrayValue]]}
  />,
);

  const objectValue = {
  name: "Test",
} as unknown as never;

render(
  <SpreadsheetTable
    data={[[objectValue]]}
  />,
);

  it("renders empty string for null values", () => {
    const { container } = render(
      <SpreadsheetTable
        data={[[null]]}
      />,
    );

    const cells =
      container.querySelectorAll("td");

    expect(cells[0]).toBeInTheDocument();
    expect(
      cells[0].textContent,
    ).toBe("");
  });

  it("renders editable cells", () => {
    const { container } = render(
      <SpreadsheetTable
        data={[["Editable"]]}
      />,
    );

    const cell =
      container.querySelector("td");

    expect(cell).toHaveAttribute(
      "contenteditable",
      "true",
    );
  });

  it("renders correct number of cells", () => {
    const { container } = render(
      <SpreadsheetTable
        data={[
          ["A", "B"],
          ["C", "D"],
        ]}
      />,
    );

    expect(
      container.querySelectorAll("td"),
    ).toHaveLength(4);
  });

  it("renders correct number of rows", () => {
    const { container } = render(
      <SpreadsheetTable
        data={[
          ["A"],
          ["B"],
          ["C"],
        ]}
      />,
    );

    expect(
      container.querySelectorAll(
        "tbody tr",
      ),
    ).toHaveLength(3);
  });

  it("renders table element", () => {
    const { container } = render(
      <SpreadsheetTable
        data={[["A"]]}
      />,
    );

    expect(
      container.querySelector(
        "table",
      ),
    ).toBeInTheDocument();
  });

  it("handles uneven row lengths", () => {
    render(
      <SpreadsheetTable
        data={[
          ["A", "B", "C"],
          ["D"],
        ]}
      />,
    );

   expect(
  screen.getAllByText("A").length,
).toBeGreaterThan(0);

expect(
  screen.getByText("D"),
).toBeInTheDocument();
  });
});