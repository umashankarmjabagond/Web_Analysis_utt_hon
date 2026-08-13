import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "../../../test";

import TopTabs from "./TopTabs";

interface TabItem {
  id: string;
  label: string;
  path: string;
}

const { mockTabs } = vi.hoisted(() => ({
  mockTabs: vi.fn<(items: TabItem[]) => void>(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        TAB_IMPORT_CONFIGURATION: "Import Configuration File",

        TAB_REGULATORY_CONFIGURATION: "Regulatory Configuration",

        TAB_MPC_CONFIGURATION: "MPC Configuration",

        TAB_PWO_CONFIGURATION: "PWO Configuration",

        TAB_ANALYSIS_SCHEDULE: "Analysis Schedule",

        TAB_CUSTOM_KPI_CONFIGURATION: "Custom KPI Configuration",

        TAB_ANALYSIS_ENGINE: "Analysis Engine",
      };

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../../components/common/tabs/Tabs", () => ({
  Tabs: ({ items }: { items: TabItem[] }) => {
    mockTabs(items);

    return <div data-testid="tabs">Mock Tabs Component</div>;
  },
}));

describe("TopTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<TopTabs />);
  };

  const getTabs = (): TabItem[] => {
    const calls = mockTabs.mock.calls;

    expect(calls.length).toBeGreaterThan(0);

    const tabs = calls[0]?.[0];

    expect(tabs).toBeDefined();

    return tabs as TabItem[];
  };

  it("renders Tabs component", () => {
    renderComponent();

    expect(screen.getByTestId("tabs")).toBeInTheDocument();

    expect(screen.getByText("Mock Tabs Component")).toBeInTheDocument();
  });

  it("passes tabs data to Tabs component", () => {
    renderComponent();

    expect(mockTabs).toHaveBeenCalledTimes(1);

    const tabs = getTabs();

    expect(Array.isArray(tabs)).toBe(true);
  });

  it("passes all seven tabs", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toHaveLength(7);
  });

  it("passes correct import configuration tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs[0]).toEqual({
      id: "import-config",
      label: "Import Configuration File",
      path: "/#",
    });
  });

  it("passes correct regulatory tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "regulatory",
      label: "Regulatory Configuration",
      path: "/#",
    });
  });

  it("passes correct MPC tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "mpc",
      label: "MPC Configuration",
      path: "/#",
    });
  });

  it("passes correct PWO tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "pwo",
      label: "PWO Configuration",
      path: "/#",
    });
  });

  it("passes correct analysis schedule tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "analysis-schedule",
      label: "Analysis Schedule",
      path: "/#",
    });
  });

  it("passes correct custom KPI tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "custom-kpi",
      label: "Custom KPI Configuration",
      path: "/#",
    });
  });

  it("passes correct analysis engine tab", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs).toContainEqual({
      id: "analysis-engine",
      label: "Analysis Engine",
      path: "/dashboard",
    });
  });

  it("contains expected tab ids", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs.map((tab) => tab.id)).toEqual([
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
    renderComponent();

    const tabs = getTabs();

    expect(tabs.map((tab) => tab.label)).toEqual([
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
    renderComponent();

    const tabs = getTabs();

    const analysisEngineTab = tabs.find((tab) => tab.id === "analysis-engine");

    expect(analysisEngineTab).toBeDefined();

    expect(analysisEngineTab?.path).toBe("/dashboard");
  });

  it("contains correct paths for configuration tabs", () => {
    renderComponent();

    const tabs = getTabs();

    const configurationTabs = tabs.filter(
      (tab) => tab.id !== "analysis-engine",
    );

    expect(configurationTabs.every((tab) => tab.path === "/#")).toBe(true);
  });

  it("contains unique tab ids", () => {
    renderComponent();

    const tabs = getTabs();

    const ids = tabs.map((tab) => tab.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains non-empty tab labels", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs.every((tab) => tab.label.trim().length > 0)).toBe(true);
  });

  it("contains non-empty tab paths", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs.every((tab) => tab.path.trim().length > 0)).toBe(true);
  });

  it("passes tabs in the expected order", () => {
    renderComponent();

    const tabs = getTabs();

    expect(tabs.map((tab) => tab.id)).toEqual([
      "import-config",
      "regulatory",
      "mpc",
      "pwo",
      "analysis-schedule",
      "custom-kpi",
      "analysis-engine",
    ]);
  });
});
