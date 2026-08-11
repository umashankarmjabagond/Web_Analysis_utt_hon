import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test";

import LeftPanel from "./LeftPanel";

const mockUseLocation = vi.fn();

vi.mock("./DashboardPanel", () => ({
  default: () => <div data-testid="dashboard-panel">Dashboard Panel</div>,
}));

vi.mock("./WorkflowPanel", () => ({
  default: () => <div data-testid="workflow-panel">Workflow Panel</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

describe("LeftPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard panel", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/dashboard",
    });

    render(<LeftPanel />);

    expect(screen.getByTestId("dashboard-panel")).toBeInTheDocument();

    expect(screen.queryByTestId("workflow-panel")).not.toBeInTheDocument();
  });

  it("renders workflow panel", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/workflow",
    });

    render(<LeftPanel />);

    expect(screen.getByTestId("workflow-panel")).toBeInTheDocument();

    expect(screen.queryByTestId("dashboard-panel")).not.toBeInTheDocument();
  });

  it("renders aside element", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/dashboard",
    });

    const { container } = render(<LeftPanel />);

    expect(container.querySelector("aside")).toBeInTheDocument();
  });

  it("matches nested dashboard routes", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/dashboard/feed-water/pump-101",
    });

    render(<LeftPanel />);

    expect(screen.getByTestId("dashboard-panel")).toBeInTheDocument();
  });

  it("returns null when route is not configured", () => {
    mockUseLocation.mockReturnValue({
      pathname: "/settings",
    });

    const { container } = render(<LeftPanel />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null for empty pathname", () => {
    mockUseLocation.mockReturnValue({
      pathname: "",
    });

    const { container } = render(<LeftPanel />);

    expect(container.firstChild).toBeNull();
  });
});
