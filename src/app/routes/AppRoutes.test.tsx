import { describe, expect, it, vi } from "vitest";

import {
  MemoryRouter,
} from "react-router-dom";

import { render, screen } from "@testing-library/react";

import AppRoutes from "./AppRoutes";

vi.mock(
  "../layouts/MainLayout/MainLayout",
  async () => {
    const { Outlet } = await import(
      "react-router-dom"
    );

    return {
      default: () => (
        <div data-testid="main-layout">
          Main Layout
          <Outlet />
        </div>
      ),
    };
  },
);

vi.mock(
  "../../pages/workflow/WorkflowBuilder",
  () => ({
    default: () => (
      <div data-testid="workflow-builder">
        Workflow Builder
      </div>
    ),
  }),
);

vi.mock(
  "../../pages/dashboard/Dashboard",
  () => ({
    default: () => (
      <div data-testid="dashboard">
        Dashboard
      </div>
    ),
  }),
);

vi.mock(
  "../../pages/dashboard/DashboardContent",
  () => ({
    default: () => (
      <div data-testid="dashboard-content">
        Dashboard Content
      </div>
    ),
  }),
);

vi.mock(
  "../../constants/routes/routesConstant",
  () => ({
    ROUTES: {
      DASHBOARD: "/dashboard",
      WORKFLOW: "/workflow",
    },
  }),
);

describe("AppRoutes", () => {
  it("redirects root route to dashboard", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId("dashboard"),
    ).toBeInTheDocument();
  });

  it("renders workflow route", () => {
    render(
      <MemoryRouter
        initialEntries={["/workflow"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId(
        "workflow-builder",
      ),
    ).toBeInTheDocument();
  });

  it("renders dashboard route", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId("dashboard"),
    ).toBeInTheDocument();
  });

  it("renders dashboard content for plant route", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/dashboard/plant1",
        ]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId(
        "dashboard-content",
      ),
    ).toBeInTheDocument();
  });

  it("renders dashboard content for plant and template route", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/dashboard/plant1/template1",
        ]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId(
        "dashboard-content",
      ),
    ).toBeInTheDocument();
  });

  it("renders dashboard content for plant template and item route", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/dashboard/plant1/template1/item1",
        ]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId(
        "dashboard-content",
      ),
    ).toBeInTheDocument();
  });

  it("renders main layout", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getByTestId("main-layout"),
    ).toBeInTheDocument();
  });

  it("renders one main layout", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByTestId(
        "main-layout",
      ),
    ).toHaveLength(1);
  });

  it("renders one dashboard component", () => {
    render(
      <MemoryRouter
        initialEntries={["/dashboard"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByTestId(
        "dashboard",
      ),
    ).toHaveLength(1);
  });

  it("renders one workflow builder component", () => {
    render(
      <MemoryRouter
        initialEntries={["/workflow"]}
      >
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(
      screen.getAllByTestId(
        "workflow-builder",
      ),
    ).toHaveLength(1);
  });
});