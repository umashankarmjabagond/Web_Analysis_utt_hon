import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../../test";

import TopTabs from "./TopTabs";

const mockTabs = vi.fn();

vi.mock(
  "../../../components/common/tabs/Tabs",
  () => ({
    Tabs: ({
      items,
    }: {
      items: {
        id: string;
        label: string;
        path: string;
      }[];
    }) => {
      mockTabs(items);

      return (
        <div data-testid="tabs">
          Mock Tabs Component
        </div>
      );
    },
  }),
);

describe("TopTabs", () => {
  it("renders Tabs component", () => {
    render(<TopTabs />);

    expect(
      screen.getByTestId("tabs"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Mock Tabs Component",
      ),
    ).toBeInTheDocument();
  });

  it("passes tabs data to Tabs component", () => {
    render(<TopTabs />);

    expect(mockTabs).toHaveBeenCalledTimes(1);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(
      Array.isArray(tabs),
    ).toBe(true);
  });

  it("passes all seven tabs", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toHaveLength(7);
  });

  it("passes correct import configuration tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs[0]).toEqual({
      id: "import-config",
      label: "Import Configuration File",
      path: "/#",
    });
  });

  it("passes correct regulatory tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "regulatory",
      label: "Regulatory Configuration",
      path: "/#",
    });
  });

  it("passes correct MPC tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "mpc",
      label: "MPC Configuration",
      path: "/#",
    });
  });

  it("passes correct PWO tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "pwo",
      label: "PWO Configuration",
      path: "/#",
    });
  });

  it("passes correct analysis schedule tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "analysis-schedule",
      label: "Analysis Schedule",
      path: "/#",
    });
  });

  it("passes correct custom KPI tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "custom-kpi",
      label: "Custom KPI Configuration",
      path: "/#",
    });
  });

  it("passes correct analysis engine tab", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(tabs).toContainEqual({
      id: "analysis-engine",
      label: "Analysis Engine",
      path: "/dashboard",
    });
  });

  it("contains expected tab ids", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(
      tabs.map(
        (tab: {
          id: string;
        }) => tab.id,
      ),
    ).toEqual([
      "import-config",
      "regulatory",
      "mpc",
      "pwo",
      "analysis-schedule",
      "custom-kpi",
      "analysis-engine",
    ]);
  });

  it("contains expected tab labels", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    expect(
      tabs.map(
        (tab: {
          label: string;
        }) => tab.label,
      ),
    ).toEqual([
      "Import Configuration File",
      "Regulatory Configuration",
      "MPC Configuration",
      "PWO Configuration",
      "Analysis Schedule",
      "Custom KPI Configuration",
      "Analysis Engine",
    ]);
  });

  it("contains analysis engine dashboard path", () => {
    render(<TopTabs />);

    const tabs =
      mockTabs.mock.calls[0][0];

    const analysisEngineTab =
      tabs.find(
        (
          tab: {
            id: string;
            path: string;
          },
        ) =>
          tab.id === "analysis-engine",
      );

    expect(
      analysisEngineTab?.path,
    ).toBe("/dashboard");
  });
});