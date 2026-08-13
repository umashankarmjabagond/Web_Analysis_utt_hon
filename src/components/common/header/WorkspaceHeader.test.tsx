import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test";

import WorkspaceHeader from "./WorkspaceHeader";

vi.mock("../../../app/layouts/Workspace/TopTabs", () => ({
  default: () => <div data-testid="top-tabs">Top Tabs</div>,
}));

describe("WorkspaceHeader", () => {
  it("renders workspace header", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByTestId("top-tabs")).toBeInTheDocument();
  });

  it("renders TopTabs", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByText("Top Tabs")).toBeInTheDocument();
  });

  it("renders both workspace header and TopTabs", () => {
    render(<WorkspaceHeader />);

    expect(screen.getByTestId("top-tabs")).toBeInTheDocument();

    expect(screen.getByText("Top Tabs")).toBeInTheDocument();
  });
});
