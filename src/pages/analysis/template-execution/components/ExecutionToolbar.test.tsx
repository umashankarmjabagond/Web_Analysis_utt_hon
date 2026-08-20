import { fireEvent, render, screen } from "@testing-library/react";
import FlowExecutionToolbar from "./ExecutionToolbar";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import {
  EXECUTION_ACTION,
  EXECUTION_VIEW_MODE,
  type ExecutionAction,
  type ExecutionViewMode,
} from "../../../../types/templateExecution";
import { ROUTES } from "../../../../constants/routes/routesConstant";
import i18n from "../../../../i18n/index";

const { t } = i18n;

let mockSelectedExecutionItem:
  | {
      name: string;
      type?: string;
    }
  | undefined = {
  name: "Test Template",
  type: "UNIT",
};

let mockSelectedRowIds: string[] = [];
let mockExecutionAction: ExecutionAction = EXECUTION_ACTION.IDLE;
const mockSetExecutionAction = vi.fn();

const mockConfirm = vi.fn();
vi.stubGlobal("confirm", mockConfirm);

let executionViewMode: ExecutionViewMode = EXECUTION_VIEW_MODE.COMPACT;
const mockSetExecutionViewMode = vi.fn((mode: ExecutionViewMode) => {
  executionViewMode = mode;
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn((selector) =>
    selector({
      selectedExecutionItem: mockSelectedExecutionItem,
      selectedRowIds: mockSelectedRowIds,
      executionAction: mockExecutionAction,
      setExecutionAction: mockSetExecutionAction,
      executionViewMode,
      setExecutionViewMode: mockSetExecutionViewMode,
    }),
  ),
}));

vi.mock("../../../../components/common/badge/Badge", () => ({
  default: ({ children }: { children: ReactNode }) => (
    <div data-testid="badge">{children}</div>
  ),
}));

describe("ExecutionToolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelectedRowIds = [];
    mockExecutionAction = EXECUTION_ACTION.IDLE;
    executionViewMode = EXECUTION_VIEW_MODE.COMPACT;

    mockSelectedExecutionItem = {
      name: "Test Template",
      type: "UNIT",
    };

    vi.useRealTimers();
  });

  it("renders the execution toolbar", () => {
    render(<FlowExecutionToolbar />);
  });

  it("renders the name", () => {
    render(<FlowExecutionToolbar />);

    expect(screen.getByText("Test Template")).toBeInTheDocument();
  });

  it("renders badge with type", () => {
    render(<FlowExecutionToolbar />);

    expect(screen.getByTestId("badge")).toHaveTextContent("UNIT");
  });

  it("does not render badge when type is undefined", () => {
    mockSelectedExecutionItem = {
      name: "Test Template",
    };

    render(<FlowExecutionToolbar />);

    expect(screen.queryByTestId("badge")).not.toBeInTheDocument();
  });

  it("renders the Execute All button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", { name: t("EXECUTION_EXECUTE") }),
    ).toBeInTheDocument();
  });

  it("renders the Pause All button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", { name: t("EXECUTION_PAUSE") }),
    ).toBeInTheDocument();
  });

  it("renders the Edit button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", { name: t("EXECUTION_TOOLBAR_EDIT") }),
    ).toBeInTheDocument();
  });

  it("renders the Delete button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", { name: t("EXECUTION_TOOLBAR_DELETE") }),
    ).toBeInTheDocument();
  });

  it("renders the segmented tab compact view button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", { name: t("EXECUTION_TOOLBAR_COMPACT_VIEW") }),
    ).toBeInTheDocument();
  });

  it("renders the segmented tab comfortable view button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", {
        name: t("EXECUTION_TOOLBAR_COMFORTABLE_VIEW"),
      }),
    ).toBeInTheDocument();
  });

  it("renders the analysis templates button", () => {
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", {
        name: t("EXECUTION_TOOLBAR_ANALYSIS_TEMPLATES"),
      }),
    ).toBeInTheDocument();
  });

  it("shows Execute Selected when rows are selected", () => {
    mockSelectedRowIds = ["row-1"];
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", {
        name: `${t("EXECUTION_EXECUTE_SELECTED")} (1)`,
      }),
    ).toBeInTheDocument();
  });

  it("shows Pause Selected when rows are selected", () => {
    mockSelectedRowIds = ["row-1"];
    render(<FlowExecutionToolbar />);
    expect(
      screen.getByRole("button", {
        name: `${t("EXECUTION_PAUSE_SELECTED")} (1)`,
      }),
    ).toBeInTheDocument();
  });

  it("execute all rows", () => {
    render(<FlowExecutionToolbar />);
    const executeButton = screen.getByRole("button", {
      name: t("EXECUTION_EXECUTE"),
    });

    fireEvent.click(executeButton);
    expect(mockSetExecutionAction).toHaveBeenCalledWith(
      EXECUTION_ACTION.EXECUTE,
    );
    expect(mockConfirm).toHaveBeenCalled();
  });

  it("executes selected rows", () => {
    mockSelectedRowIds = ["row-1"];

    render(<FlowExecutionToolbar />);

    const executeSelectedButton = screen.getByRole("button", {
      name: `${t("EXECUTION_EXECUTE_SELECTED")} (1)`,
    });

    fireEvent.click(executeSelectedButton);
    expect(mockSetExecutionAction).toHaveBeenCalledWith(
      EXECUTION_ACTION.EXECUTE,
    );
    expect(mockConfirm).toHaveBeenCalled();
  });

  it("pause all rows", () => {
    render(<FlowExecutionToolbar />);
    const pauseButton = screen.getByRole("button", {
      name: t("EXECUTION_PAUSE"),
    });

    fireEvent.click(pauseButton);
    expect(mockSetExecutionAction).toHaveBeenCalledWith(EXECUTION_ACTION.PAUSE);
    expect(mockConfirm).toHaveBeenCalledWith(t("EXECUTION_PAUSE_CONFIRMATION"));
  });

  it("pauses selected rows", () => {
    mockSelectedRowIds = ["row-1"];

    render(<FlowExecutionToolbar />);

    const pauseSelectedButton = screen.getByRole("button", {
      name: `${t("EXECUTION_PAUSE_SELECTED")} (1)`,
    });

    fireEvent.click(pauseSelectedButton);
    expect(mockSetExecutionAction).toHaveBeenCalledWith(EXECUTION_ACTION.PAUSE);
    expect(mockConfirm).toHaveBeenCalledWith(t("EXECUTION_PAUSE_CONFIRMATION"));
  });

  it("opens the edit confirmation", () => {
    render(<FlowExecutionToolbar />);
    const editButton = screen.getByRole("button", {
      name: t("EXECUTION_TOOLBAR_EDIT"),
    });

    fireEvent.click(editButton);
    expect(mockConfirm).toHaveBeenCalledWith(t("EXECUTION_EDIT_CONFIRMATION"));
  });

  it("deletes the execution item", () => {
    vi.useFakeTimers();

    render(<FlowExecutionToolbar />);
    const deleteButton = screen.getByRole("button", {
      name: t("EXECUTION_TOOLBAR_DELETE"),
    });

    fireEvent.click(deleteButton);
    expect(mockSetExecutionAction).toHaveBeenCalledWith(
      EXECUTION_ACTION.DELETE,
    );

    expect(mockConfirm).toHaveBeenCalledWith(
      t("EXECUTION_DELETE_CONFIRMATION"),
    );

    vi.advanceTimersByTime(1000);

    expect(mockSetExecutionAction).toHaveBeenCalledWith(EXECUTION_ACTION.IDLE);

    vi.useRealTimers();
  });

  it("changes the execution view mode to comfortable view", () => {
    render(<FlowExecutionToolbar />);

    const comfortableViewButton = screen.getByRole("button", {
      name: t("EXECUTION_TOOLBAR_COMFORTABLE_VIEW"),
    });

    fireEvent.click(comfortableViewButton);

    expect(mockSetExecutionViewMode).toHaveBeenCalledWith(
      EXECUTION_VIEW_MODE.COMFORTABLE,
    );
  });

  it("changes the execution view mode to compact view", () => {
    executionViewMode = EXECUTION_VIEW_MODE.COMFORTABLE;

    render(<FlowExecutionToolbar />);

    const compactViewButton = screen.getByRole("button", {
      name: t("EXECUTION_TOOLBAR_COMPACT_VIEW"),
    });

    fireEvent.click(compactViewButton);

    expect(mockSetExecutionViewMode).toHaveBeenCalledWith(
      EXECUTION_VIEW_MODE.COMPACT,
    );
  });

  it("navigates to workflow page", () => {
    render(<FlowExecutionToolbar />);

    const analysisTemplatesButton = screen.getByRole("button", {
      name: t("EXECUTION_TOOLBAR_ANALYSIS_TEMPLATES"),
    });

    fireEvent.click(analysisTemplatesButton);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.WORKFLOW);
  });

  it("marks the active execution view mode as pressed", () => {
    executionViewMode = EXECUTION_VIEW_MODE.COMPACT;

    render(<FlowExecutionToolbar />);

    expect(
      screen.getByRole("button", { name: t("EXECUTION_TOOLBAR_COMPACT_VIEW") }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", {
        name: t("EXECUTION_TOOLBAR_COMFORTABLE_VIEW"),
      }),
    ).toHaveAttribute("aria-pressed", "false");
  });
});
