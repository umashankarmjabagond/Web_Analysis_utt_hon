import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../test";

import MainLayout from "./MainLayout";

vi.mock(
  "../../../components/common/header/Header",
  () => ({
    default: () => (
      <div data-testid="header">
        Header Component
      </div>
    ),
  }),
);

vi.mock(
  "../../../components/common/sidebar/Sidebar",
  () => ({
    default: () => (
      <div data-testid="sidebar">
        Sidebar Component
      </div>
    ),
  }),
);

vi.mock(
  "../Workspace/Workspace",
  () => ({
    default: () => (
      <div data-testid="workspace">
        Workspace Component
      </div>
    ),
  }),
);

describe("MainLayout", () => {
  it("renders Header component", () => {
    render(<MainLayout />);

    expect(
      screen.getByTestId("header"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Header Component",
      ),
    ).toBeInTheDocument();
  });

  it("renders Sidebar component", () => {
    render(<MainLayout />);

    expect(
      screen.getByTestId("sidebar"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Sidebar Component",
      ),
    ).toBeInTheDocument();
  });

  it("renders Workspace component", () => {
    render(<MainLayout />);

    expect(
      screen.getByTestId("workspace"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Workspace Component",
      ),
    ).toBeInTheDocument();
  });

  it("renders all child components", () => {
    render(<MainLayout />);

    expect(
      screen.getByTestId("header"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("sidebar"),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("workspace"),
    ).toBeInTheDocument();
  });

  it("renders exactly one Header component", () => {
    render(<MainLayout />);

    expect(
      screen.getAllByTestId("header"),
    ).toHaveLength(1);
  });

  it("renders exactly one Sidebar component", () => {
    render(<MainLayout />);

    expect(
      screen.getAllByTestId("sidebar"),
    ).toHaveLength(1);
  });

  it("renders exactly one Workspace component", () => {
    render(<MainLayout />);

    expect(
      screen.getAllByTestId("workspace"),
    ).toHaveLength(1);
  });
});