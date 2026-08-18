import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TemplateExecution from "./index";
import { useLoadExecutionWorkflow } from "../../../hooks/useLoadExecutionWorkflow";

const mockLoadMore = vi.fn();

vi.mock("../../../hooks/useLoadExecutionWorkflow", () => ({
  useLoadExecutionWorkflow: vi.fn(),
}));

vi.mock("./components/ExecutionToolbar", () => ({
  default: () => <div data-testid="execution-toolbar">Execution Toolbar</div>,
}));

vi.mock("./components/WorkflowCanvas", () => ({
  default: ({
    executionContext,
    loadMore,
    hasMore,
    isLoadingMore,
  }: {
    executionContext: string;
    loadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  }) => (
    <div
      data-testid="workflow-canvas"
      data-context={executionContext}
      data-has-more={String(hasMore)}
      data-loading={String(isLoadingMore)}
      data-load-more={loadMore === mockLoadMore ? "connected" : "not-connected"}
    >
      Workflow Canvas
    </div>
  ),
}));

const renderComponent = (itemId?: string) =>
  render(
    <TemplateExecution plant="plant-1" template="template-1" itemId={itemId} />,
  );

describe("TemplateExecution", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useLoadExecutionWorkflow).mockReturnValue({
      loadMore: mockLoadMore,
      hasMore: true,
      isLoadingMore: false,
    });
  });

  it("renders execution toolbar", () => {
    renderComponent();

    expect(screen.getByTestId("execution-toolbar")).toBeInTheDocument();
  });

  it("renders workflow canvas", () => {
    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toBeInTheDocument();
  });

  it("uses unit execution context when itemId is not provided", () => {
    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-context",
      "unit",
    );
  });

  it("uses asset execution context when itemId is provided", () => {
    renderComponent("asset-123");

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-context",
      "asset",
    );
  });

  it("calls useLoadExecutionWorkflow with template only", () => {
    renderComponent();

    expect(useLoadExecutionWorkflow).toHaveBeenCalledWith(
      "template-1",
      undefined,
    );
  });

  it("calls useLoadExecutionWorkflow with template and itemId", () => {
    renderComponent("asset-123");

    expect(useLoadExecutionWorkflow).toHaveBeenCalledWith(
      "template-1",
      "asset-123",
    );
  });

  it("passes loadMore to WorkflowCanvas", () => {
    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-load-more",
      "connected",
    );
  });

  it("passes hasMore to WorkflowCanvas", () => {
    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-has-more",
      "true",
    );
  });

  it("passes isLoadingMore to WorkflowCanvas", () => {
    vi.mocked(useLoadExecutionWorkflow).mockReturnValue({
      loadMore: mockLoadMore,
      hasMore: true,
      isLoadingMore: true,
    });

    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });

  it("passes hasMore false to WorkflowCanvas", () => {
    vi.mocked(useLoadExecutionWorkflow).mockReturnValue({
      loadMore: mockLoadMore,
      hasMore: false,
      isLoadingMore: false,
    });

    renderComponent();

    expect(screen.getByTestId("workflow-canvas")).toHaveAttribute(
      "data-has-more",
      "false",
    );
  });
});
