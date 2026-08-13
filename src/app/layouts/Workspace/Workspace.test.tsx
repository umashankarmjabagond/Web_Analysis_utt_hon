import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test";

import Workspace from "./Workspace";

vi.mock(
  "../../../components/common/header/WorkspaceHeader",
  () => ({
    default: () => (
      <div data-testid="workspace-header">
        Workspace Header
      </div>
    ),
  }),
);

vi.mock(
  "../../../components/common/leftPanel/LeftPanel",
  () => ({
    default: () => (
      <div data-testid="left-panel">
        Left Panel
      </div>
    ),
  }),
);

vi.mock(
  "react-router-dom",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("react-router-dom")
      >();

    return {
      ...actual,
      Outlet: () => (
        <div data-testid="outlet">
          Outlet Content
        </div>
      ),
    };
  },
);

describe("Workspace", () => {
  it("renders workspace header", () => {
    render(<Workspace />);

    expect(
      screen.getByTestId("workspace-header"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Workspace Header"),
    ).toBeInTheDocument();
  });

  it("renders left panel", () => {
    render(<Workspace />);

    expect(
      screen.getByTestId("left-panel"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Left Panel"),
    ).toBeInTheDocument();
  });

  it("renders outlet", () => {
    render(<Workspace />);

    expect(
      screen.getByTestId("outlet"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Outlet Content"),
    ).toBeInTheDocument();
  });

  it("renders all child components", () => {
  render(<Workspace />);

  expect(
    screen.getByTestId("workspace-header"),
  ).toBeInTheDocument();

  expect(
    screen.getByTestId("left-panel"),
  ).toBeInTheDocument();

    expect(
    screen.getByTestId("outlet"),
  ).toBeInTheDocument();
});

it("renders one workspace header", () => {
  render(<Workspace />);

  expect(
    screen.getAllByTestId(
      "workspace-header",
    ),
  ).toHaveLength(1);
});

it("renders one left panel", () => {
  render(<Workspace />);

  expect(
    screen.getAllByTestId(
      "left-panel",
    ),
  ).toHaveLength(1);
});

it("renders one outlet", () => {
  render(<Workspace />);

  expect(
    screen.getAllByTestId(
      "outlet",
    ),
  ).toHaveLength(1);
});

it("renders all mocked content text", () => {
  render(<Workspace />);

  expect(
    screen.getByText(
      "Workspace Header",
    ),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "Left Panel",
    ),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "Outlet Content",
    ),
  ).toBeInTheDocument();
});
});