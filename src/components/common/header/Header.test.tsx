import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test";

import Header from "./Header";

describe("Header", () => {
  it("renders the application title", () => {
    render(<Header />);

    expect(screen.getByText("Honeywell")).toBeInTheDocument();
  });

  it("renders four action buttons", () => {
    render(<Header />);

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("renders header element", () => {
    const { container } = render(<Header />);

    expect(container.querySelector("header")).toBeInTheDocument();
  });
});
