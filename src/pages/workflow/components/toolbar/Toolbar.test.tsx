import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import type { ReactNode } from "react";

import Toolbar from "./Toolbar";

const mockNavigate = vi.fn();

const mockDeleteSelectedNodes = vi.fn();
const mockDeleteSelectedEdges = vi.fn();
const mockClearWorkflow = vi.fn();
const mockSetNodes = vi.fn();
const mockSetEdges = vi.fn();
const mockSetIsImporting = vi.fn();

const mockExportWorkflow = vi.fn();
const mockImportWorkflow = vi.fn();

const mockStore: {
  nodes: Array<{ id: string }>;
  edges: Array<{ id: string }>;
  deleteSelectedNodes: typeof mockDeleteSelectedNodes;
  deleteSelectedEdges: typeof mockDeleteSelectedEdges;
  clearWorkflow: typeof mockClearWorkflow;
  setNodes: typeof mockSetNodes;
  setEdges: typeof mockSetEdges;
  setIsImporting: typeof mockSetIsImporting;
} = {
  nodes: [],
  edges: [],
  deleteSelectedNodes: mockDeleteSelectedNodes,
  deleteSelectedEdges: mockDeleteSelectedEdges,
  clearWorkflow: mockClearWorkflow,
  setNodes: mockSetNodes,
  setEdges: mockSetEdges,
  setIsImporting: mockSetIsImporting,
};

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../../store/workflowStore", () => ({
  useWorkflowStore: () => mockStore,
}));

vi.mock("../../../../utils/utils", () => ({
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),

  exportWorkflow: (...args: unknown[]) => {
    mockExportWorkflow(...args);
  },

  importWorkflow: (...args: unknown[]) => {
    return mockImportWorkflow(...args);
  },
}));

vi.mock("./ToolbarButton", () => ({
  default: ({
    title,
    onClick,
    disabled = false,
  }: {
    title: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {title}
    </button>
  ),
}));

vi.mock("../../../../components/forms/dropdown/Dropdown", () => ({
  default: ({
    onSelect,
  }: {
    onSelect: (item: { value: string; label: string }) => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onSelect({
            value: "regulatory",
            label: "Custom Regulatory Template",
          })
        }
      >
        Regulatory Save
      </button>

      <button
        type="button"
        onClick={() =>
          onSelect({
            value: "mpc",
            label: "Custom MPC Templates",
          })
        }
      >
        MPC Save
      </button>
    </div>
  ),
}));

vi.mock("../../../../components/common/dialogue/Dialog", () => ({
  default: ({
    isOpen,
    title,
    children,
    onClose,
  }: {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose?: () => void;
    width?: number;
    subtitle?: string;
  }) =>
    isOpen ? (
      <div data-testid="dialog">
        <h2>{title}</h2>

        <button type="button" onClick={onClose} data-testid="dialog-close">
          Close
        </button>

        {children}
      </div>
    ) : null,
}));

vi.mock("../../../../components/forms/input/Input", () => {
  const MockInput = ({
    label,
    value,
    onChange,
    ...props
  }: {
    label?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
  }) => (
    <input aria-label={label} value={value} onChange={onChange} {...props} />
  );

  return {
    default: MockInput,
  };
});

vi.mock("../../../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    disabled = false,
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("../../../../components/common/notification/Notification", () => ({
  default: ({
    title,
    message,
    onClose,
  }: {
    title: string;
    message: string;
    onClose?: () => void;
  }) => (
    <div data-testid="notification">
      <div>{title}</div>
      <div>{message}</div>

      <button type="button" data-testid="notification-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe("Toolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.nodes = [];
    mockStore.edges = [];

    mockImportWorkflow.mockReset();
    mockExportWorkflow.mockReset();

    Storage.prototype.getItem = vi.fn(() => "[]");
    Storage.prototype.setItem = vi.fn();

    vi.stubGlobal("crypto", {
      randomUUID: () => "mock-id",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders toolbar title", () => {
    render(<Toolbar />);

    expect(screen.getByText("NEW_TEMPLATE")).toBeInTheDocument();
  });

  it("renders all toolbar buttons", () => {
    render(<Toolbar />);

    expect(screen.getByText("Delete")).toBeInTheDocument();

    expect(screen.getByText("Clear Workflow")).toBeInTheDocument();

    expect(screen.getByText("Export Template")).toBeInTheDocument();

    expect(screen.getByText("Import Template")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    render(<Toolbar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("calls delete handlers", () => {
    render(<Toolbar />);

    fireEvent.click(screen.getByText("Delete"));

    expect(mockDeleteSelectedEdges).toHaveBeenCalledTimes(1);

    expect(mockDeleteSelectedNodes).toHaveBeenCalledTimes(1);
  });

  it("disables clear workflow when workflow is empty", () => {
    mockStore.nodes = [];
    mockStore.edges = [];

    render(<Toolbar />);

    const clearButton = screen.getByRole("button", {
      name: "Clear Workflow",
    });

    expect(clearButton).toBeDisabled();
  });

  it("enables clear workflow when nodes are present", () => {
    mockStore.nodes = [
      {
        id: "node-1",
      },
    ];

    mockStore.edges = [];

    render(<Toolbar />);

    const clearButton = screen.getByRole("button", {
      name: "Clear Workflow",
    });

    expect(clearButton).not.toBeDisabled();
  });

  it("enables clear workflow when edges are present", () => {
    mockStore.nodes = [];

    mockStore.edges = [
      {
        id: "edge-1",
      },
    ];

    render(<Toolbar />);

    const clearButton = screen.getByRole("button", {
      name: "Clear Workflow",
    });

    expect(clearButton).not.toBeDisabled();
  });

  it("clears workflow when clear workflow is clicked", () => {
    mockStore.nodes = [
      {
        id: "node-1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear Workflow",
      }),
    );

    expect(mockClearWorkflow).toHaveBeenCalledTimes(1);
  });

  it("does not clear workflow when workflow is empty", () => {
    mockStore.nodes = [];
    mockStore.edges = [];

    render(<Toolbar />);

    const clearButton = screen.getByRole("button", {
      name: "Clear Workflow",
    });

    expect(clearButton).toBeDisabled();

    expect(mockClearWorkflow).not.toHaveBeenCalled();
  });

  it("shows warning notification when workflow is empty", () => {
    mockStore.nodes = [];
    mockStore.edges = [];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    expect(screen.getByText("Nothing to Save")).toBeInTheDocument();

    expect(
      screen.getByText("Please create a workflow before saving the template."),
    ).toBeInTheDocument();
  });

  it("opens regulatory save dialog", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    expect(screen.getByText("TOOLBAR_REGULATORY_TEMPLATE")).toBeInTheDocument();
  });

  it("opens mpc save dialog", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("MPC Save"));

    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    expect(screen.getByText("TOOLBAR_MPC_TEMPLATE")).toBeInTheDocument();
  });

  it("prefills generated template name", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    expect(screen.getByDisplayValue("Custom_1")).toBeInTheDocument();
  });

  it("updates template name", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    const input = screen.getByLabelText("TOOLBAR_TEMPLATE_NAME");

    fireEvent.change(input, {
      target: {
        value: "My Custom Template",
      },
    });

    expect(screen.getByDisplayValue("My Custom Template")).toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_CANCEL"));

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("closes dialog using dialog onClose", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByTestId("dialog-close"));

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("saves regulatory template", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(localStorage.setItem).toHaveBeenCalled();

    expect(mockClearWorkflow).toHaveBeenCalledTimes(1);
  });

  it("shows regulatory success notification", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(screen.getByText("TOOLBAR_SAVED_REGULATORY")).toBeInTheDocument();

    expect(screen.getByText("TOOLBAR_FIND_REGULATORY")).toBeInTheDocument();
  });

  it("shows mpc success notification", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("MPC Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(screen.getByText("TOOLBAR_SAVED_MPC")).toBeInTheDocument();

    expect(screen.getByText("TOOLBAR_FIND_MPC")).toBeInTheDocument();
  });

  it("renders notification component", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(screen.getByTestId("notification")).toBeInTheDocument();
  });

  it("creates template using randomUUID", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "workflowTemplates",
      expect.stringContaining("mock-id"),
    );
  });

  it("loads existing templates before creating template", () => {
    Storage.prototype.getItem = vi.fn(() =>
      JSON.stringify([
        {
          id: "existing",
          name: "Template1",
        },
      ]),
    );

    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    expect(screen.getByDisplayValue("Custom_2")).toBeInTheDocument();
  });

  it("uses empty array fallback when localStorage returns null", () => {
    Storage.prototype.getItem = vi.fn(() => null);

    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    expect(screen.getByDisplayValue("Custom_1")).toBeInTheDocument();
  });

  it("uses empty array fallback while saving when localStorage returns null", () => {
    Storage.prototype.getItem = vi.fn(() => null);

    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("closes notification when notification onClose is triggered", () => {
    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    fireEvent.click(screen.getByTestId("notification-close"));

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  it("executes success notification timeout callback", () => {
    vi.useFakeTimers();

    mockStore.nodes = [
      {
        id: "1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    fireEvent.click(screen.getByText("COMMON_SAVE"));

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  it("executes warning notification timeout callback", () => {
    vi.useFakeTimers();

    mockStore.nodes = [];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Regulatory Save"));

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // EXPORT TESTS
  // --------------------------------------------------

  it("shows warning notification when exporting empty workflow", () => {
    mockStore.nodes = [];
    mockStore.edges = [];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Export Template"));

    expect(screen.getByText("Nothing to Export")).toBeInTheDocument();

    expect(
      screen.getByText("Please create a workflow before exporting."),
    ).toBeInTheDocument();

    expect(mockExportWorkflow).not.toHaveBeenCalled();
  });

  it("exports workflow when nodes are present", () => {
    mockStore.nodes = [
      {
        id: "node-1",
      },
    ];

    mockStore.edges = [
      {
        id: "edge-1",
      },
    ];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Export Template"));

    expect(mockExportWorkflow).toHaveBeenCalledTimes(1);

    expect(mockExportWorkflow).toHaveBeenCalledWith(
      mockStore.nodes,
      mockStore.edges,
      "workflow.json",
    );
  });

  it("executes export warning notification timeout", () => {
    vi.useFakeTimers();

    mockStore.nodes = [];
    mockStore.edges = [];

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Export Template"));

    expect(screen.getByTestId("notification")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // IMPORT TESTS
  // --------------------------------------------------

  it("opens file picker when import template is clicked", () => {
    const clickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {});

    render(<Toolbar />);

    fireEvent.click(screen.getByText("Import Template"));

    expect(clickSpy).toHaveBeenCalledTimes(1);

    clickSpy.mockRestore();
  });

  it("does nothing when no import file is selected", async () => {
    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [],
          value: "",
        },
      });
    });

    expect(mockSetIsImporting).not.toHaveBeenCalled();

    expect(mockImportWorkflow).not.toHaveBeenCalled();
  });

  it("imports workflow successfully", async () => {
    const importedWorkflow = {
      nodes: [
        {
          id: "imported-node",
        },
      ],
      edges: [
        {
          id: "imported-edge",
        },
      ],
    };

    mockImportWorkflow.mockResolvedValue(importedWorkflow);

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(
      [
        JSON.stringify({
          nodes: importedWorkflow.nodes,
          edges: importedWorkflow.edges,
        }),
      ],
      "workflow.json",
      {
        type: "application/json",
      },
    );

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(mockSetIsImporting).toHaveBeenCalledWith(true);

    expect(mockImportWorkflow).toHaveBeenCalledTimes(1);

    expect(mockImportWorkflow).toHaveBeenCalledWith(file);

    expect(mockSetNodes).toHaveBeenCalledWith(importedWorkflow.nodes);

    expect(mockSetEdges).toHaveBeenCalledWith(importedWorkflow.edges);

    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);

    expect(screen.getByText("Import Successful")).toBeInTheDocument();

    expect(
      screen.getByText("Workflow imported successfully."),
    ).toBeInTheDocument();
  });

  it("shows import failed notification when import throws an Error", async () => {
    mockImportWorkflow.mockRejectedValue(new Error("Invalid workflow file"));

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["invalid workflow"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(screen.getByText("Import Failed")).toBeInTheDocument();

    expect(screen.getByText("Invalid workflow file")).toBeInTheDocument();

    expect(mockSetIsImporting).toHaveBeenCalledWith(true);

    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
  });

  it("shows default import error when a non-Error is thrown", async () => {
    mockImportWorkflow.mockRejectedValue("invalid file");

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["invalid workflow"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(screen.getByText("Import Failed")).toBeInTheDocument();

    expect(screen.getByText("Unable to import workflow.")).toBeInTheDocument();
  });

  it("executes import success notification timeout", async () => {
    vi.useFakeTimers();

    mockImportWorkflow.mockResolvedValue({
      nodes: [
        {
          id: "node-1",
        },
      ],
      edges: [],
    });

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["{}"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(screen.getByTestId("notification")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  it("executes import failure notification timeout", async () => {
    vi.useFakeTimers();

    mockImportWorkflow.mockRejectedValue(new Error("Import error"));

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["invalid"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(screen.getByTestId("notification")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  it("resets importing state after successful import", async () => {
    mockImportWorkflow.mockResolvedValue({
      nodes: [],
      edges: [],
    });

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["{}"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(mockSetIsImporting).toHaveBeenCalledWith(true);
    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
  });

  it("resets importing state after failed import", async () => {
    mockImportWorkflow.mockRejectedValue(new Error("Import failed"));

    render(<Toolbar />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(["invalid"], "workflow.json", {
      type: "application/json",
    });

    await act(async () => {
      fireEvent.change(fileInput, {
        target: {
          files: [file],
        },
      });
    });

    expect(mockSetIsImporting).toHaveBeenCalledWith(true);
    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
  });
});
