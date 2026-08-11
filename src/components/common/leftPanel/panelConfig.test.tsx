import { describe, expect, it } from "vitest";

import { panelConfig } from "./panelConfig";
import { ROUTES } from "../../../constants/routes/routesConstant";

describe("panelConfig", () => {
  it("contains two panel configurations", () => {
    expect(panelConfig).toHaveLength(2);
  });

  it("contains Workflow panel configuration", () => {
    expect(panelConfig[0]).toMatchObject({
      path: ROUTES.WORKFLOW,
      header: "Workflow Nodes",
    });

    expect(panelConfig[0].component).toBeTruthy();
  });

  it("contains Dashboard panel configuration", () => {
    expect(panelConfig[1]).toMatchObject({
      path: ROUTES.DASHBOARD,
      header: "Plant Hierarchy",
    });

    expect(panelConfig[1].component).toBeTruthy();
  });

  it("has valid path, header and component for every panel", () => {
    panelConfig.forEach((panel) => {
      expect(panel.path).toBeTruthy();
      expect(panel.header).toBeTruthy();
      expect(panel.component).toBeTruthy();
    });
  });
});
