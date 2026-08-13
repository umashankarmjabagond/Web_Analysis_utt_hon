import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TemplateExecution from "./index";
import { useLoadExecutionWorkflow } from "../../../hooks/useLoadExecutionWorkflow";

vi.mock(
  "../../../hooks/useLoadExecutionWorkflow",
  () => ({
    useLoadExecutionWorkflow: vi.fn(),
  }),
);

vi.mock(
  "./components/ExecutionToolbar",
  () => ({
    default: () => (
      <div data-testid="execution-toolbar">
        Execution Toolbar
      </div>
    ),
  }),
);

vi.mock(
  "./components/WorkflowCanvas",
  () => ({
    default: ({
      executionContext,
    }: {
      executionContext: string;
    }) => (
      <div
        data-testid="workflow-canvas"
        data-context={executionContext}
      >
        Workflow Canvas
      </div>
    ),
  }),
);

const renderComponent = (
  itemId?: string,
) =>
  render(
    <TemplateExecution
      plant="plant-1"
      template="template-1"
      itemId={itemId}
    />,
  );
  
describe("TemplateExecution", () => {
  it("renders execution toolbar", () => {
  renderComponent();

  expect(
    screen.getByTestId(
      "execution-toolbar",
    ),
  ).toBeInTheDocument();
});

  it("renders workflow canvas", () => {
  renderComponent();

  expect(
    screen.getByTestId(
      "workflow-canvas",
    ),
  ).toBeInTheDocument();
});

  it("uses unit execution context when itemId is not provided", () => {
    renderComponent();

    expect(
      screen.getByTestId(
        "workflow-canvas",
      ),
    ).toHaveAttribute(
      "data-context",
      "unit",
    );
  });

  it("uses asset execution context when itemId is provided", () => {
    renderComponent("asset-123");

    expect(
      screen.getByTestId(
        "workflow-canvas",
      ),
    ).toHaveAttribute(
      "data-context",
      "asset",
    );
  });

  it("calls useLoadExecutionWorkflow with template only", () => {
    renderComponent();

    expect(
      useLoadExecutionWorkflow,
    ).toHaveBeenCalledWith(
      "template-1",
      undefined,
    );
  });

  it("calls useLoadExecutionWorkflow with template and itemId", () => {
    renderComponent("asset-123");

    expect(
      useLoadExecutionWorkflow,
    ).toHaveBeenCalledWith(
      "template-1",
      "asset-123",
    );
  });
});