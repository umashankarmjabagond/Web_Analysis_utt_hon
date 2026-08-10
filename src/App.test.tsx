import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "./App";

vi.mock("./app/routes/AppRoutes", () => ({
  default: () => (
    <div data-testid="app-routes">
      App Routes
    </div>
  ),
}));

describe("App", () => {
  it("renders AppRoutes", () => {
    render(<App />);

    expect(
      screen.getByTestId("app-routes"),
    ).toBeInTheDocument();
  });

  it("renders AppRoutes content", () => {
    render(<App />);

    expect(
      screen.getByText("App Routes"),
    ).toBeInTheDocument();
  });

  it("renders AppRoutes exactly once", () => {
    render(<App />);

    expect(
      screen.getAllByTestId(
        "app-routes",
      ),
    ).toHaveLength(1);
  });
});