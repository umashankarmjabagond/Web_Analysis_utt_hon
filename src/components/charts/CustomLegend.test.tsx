import { describe, expect, it } from "vitest";
import { render, screen } from "../../test";

import CustomLegend from "./CustomLegend";

describe("CustomLegend", () => {
  const data = [
    { name: "Good", value: 10, fill: "#22c55e" },
    { name: "Warning", value: 4, fill: "#fbbf24" },
    { name: "Error", value: 3, fill: "#ef4444" },
  ];

  it("renders a name for each legend item", () => {
    render(<CustomLegend data={data} width={140} />);

    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders a value for each legend item", () => {
    render(<CustomLegend data={data} width={140} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders one color indicator per item", () => {
    const { container } = render(<CustomLegend data={data} width={140} />);
    const indicators = container.querySelectorAll('[style*="background-color"]');

    expect(indicators).toHaveLength(3);
  });

  it("applies the correct fill color to each indicator", () => {
    const { container } = render(<CustomLegend data={data} width={140} />);
    const indicators = container.querySelectorAll('[style*="background-color"]');

    expect(indicators[0]).toHaveStyle({ backgroundColor: "#22c55e" });
    expect(indicators[1]).toHaveStyle({ backgroundColor: "#fbbf24" });
    expect(indicators[2]).toHaveStyle({ backgroundColor: "#ef4444" });
  });

  it("applies the given width to the container", () => {
    const { container } = render(<CustomLegend data={data} width={140} />);
    expect(container.firstChild).toHaveStyle({ width: "140px" });
  });

  it("renders nothing when data is empty", () => {
    const { container } = render(<CustomLegend data={[]} width={140} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("renders the correct number of rows for the given data", () => {
    const { container } = render(<CustomLegend data={data} width={140} />);
    expect(container.querySelectorAll(".contents")).toHaveLength(3);
  });

  it("renders a single item correctly", () => {
    render(
      <CustomLegend
        data={[{ name: "Good", value: 42, fill: "#22c55e" }]}
        width={140}
      />,
    );

    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
