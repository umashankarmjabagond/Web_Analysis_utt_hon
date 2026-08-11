import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Sidebar from "./Sidebar";
import { ROUTES } from "../../../constants/routes/routesConstant";

const renderSidebar = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Sidebar />
    </MemoryRouter>,
  );
};

describe("Sidebar", () => {
  it("renders sidebar", () => {
    const { container } = renderSidebar(ROUTES.WORKFLOW);

    expect(container.querySelector("aside")).toBeInTheDocument();
  });

  it("renders Workflow menu", () => {
    renderSidebar(ROUTES.WORKFLOW);

    expect(screen.getByRole("link", { name: /workflow/i })).toHaveAttribute(
      "href",
      ROUTES.WORKFLOW,
    );
  });

  it("renders Dashboard menu", () => {
    renderSidebar(ROUTES.WORKFLOW);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      ROUTES.DASHBOARD,
    );
  });

  it("shows Workflow as active", () => {
    const { container } = renderSidebar(ROUTES.WORKFLOW);

    expect(
      container.querySelector(".bg-selection-indicator"),
    ).toBeInTheDocument();
  });

  it("shows Dashboard as active", () => {
    const { container } = renderSidebar(ROUTES.DASHBOARD);

    expect(
      container.querySelector(".bg-selection-indicator"),
    ).toBeInTheDocument();
  });

  it("renders exactly two navigation links", () => {
    renderSidebar(ROUTES.WORKFLOW);

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
