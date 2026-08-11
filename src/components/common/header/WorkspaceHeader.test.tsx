import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test";

import WorkspaceHeader from "./WorkspaceHeader";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useLocation: () => ({
      pathname: "/dashboard",
    }),
  };
});

// Mock panelConfig
vi.mock("../leftPanel/panelConfig", () => ({
  panelConfig: [
    {
      path: "/dashboard",
      header: "Plant Hierarchy",
      component: null,
    },
  ],
}));

// Mock TopTabs
vi.mock("../../../app/layouts/Workspace/TopTabs", () => ({
  default: () => <div>Top Tabs</div>,
}));

describe("WorkspaceHeader", () => {
  it("renders panel header", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByText("Plant Hierarchy")).toBeInTheDocument();
  });

  it("renders TopTabs", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByText("Top Tabs")).toBeInTheDocument();
  });

  it("renders both header and TopTabs", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByText("Plant Hierarchy")).toBeInTheDocument();
    expect(screen.getByText("Top Tabs")).toBeInTheDocument();
  });
});
