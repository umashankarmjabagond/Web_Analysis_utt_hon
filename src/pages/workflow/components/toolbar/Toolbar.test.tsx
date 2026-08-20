import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  forwardRef,
  type ChangeEvent,
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import Toolbar from "./Toolbar";

import type { WorkflowNode } from "../../../../types/workFlowTypes";

import { exportWorkflow, importWorkflow } from "../../../../utils/utils";

import { ROUTES } from "../../../../constants/routes/routesConstant";

import type { Edge } from "@xyflow/react";

/* Constants                                                                  */

const MOCK_UUID = "123e4567-e89b-12d3-a456-426614174000";

/* Mocks                                                                      */

const mockNavigate = vi.fn();

const mockExportWorkflow = vi.mocked(exportWorkflow);
const mockImportWorkflow = vi.mocked(importWorkflow);

const mockDeleteSelectedNodes = vi.fn();
const mockDeleteSelectedEdges = vi.fn();
const mockClearWorkflow = vi.fn();
const mockSetNodes = vi.fn();
const mockSetEdges = vi.fn();
const mockSetIsImporting = vi.fn();

const mockToolbarStore = {
  nodes: [] as WorkflowNode[],
  edges: [] as Edge[],
  setNodes: mockSetNodes,
  setEdges: mockSetEdges,
  deleteSelectedNodes: mockDeleteSelectedNodes,
  deleteSelectedEdges: mockDeleteSelectedEdges,
  clearWorkflow: mockClearWorkflow,
  setIsImporting: mockSetIsImporting,
};

const mockDropdownSelect = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../../store/workflowStore", () => ({
  useWorkflowStore: () => mockToolbarStore,
}));

vi.mock("../../../../utils/utils", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../utils/utils")
  >("../../../../utils/utils");

  return {
    ...actual,
    exportWorkflow: vi.fn(),
    importWorkflow: vi.fn(),
  };
});

/* Translation                                                                */

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string): string => {
      const translations: Record<string, string> = {
        NEW_TEMPLATE: "New Template",

        COMMON_DELETE: "Delete",
        COMMON_CANCEL: "Cancel",
        COMMON_SAVE: "Save",
        COMMON_WARNING: "Warning",

        CLEAR_WORKFLOW: "Clear Workflow",

        TOOLBAR_IMPORT_TEMPLATE: "Import Template",
        TOOLBAR_EXPORT_TEMPLATE: "Export Template",
        TOOLBAR_SAVE_AS: "Save As",

        TOOLBAR_CUSTOM_REGULATORY_TEMPLATE: "Custom Regulatory Template",
        TOOLBAR_CUSTOM_MPC_TEMPLATES: "Custom MPC Template",

        TOOLBAR_REGULATORY_TEMPLATE: "Regulatory Template",
        TOOLBAR_MPC_TEMPLATE: "MPC Template",

        TOOLBAR_TEMPLATE_NAME: "Template Name",
        TOOLBAR_ADD_TEMPLATE_NAME: "Add Template Name",

        TOOLBAR_SAVED_REGULATORY: "Saved as Regulatory Template",
        TOOLBAR_SAVED_MPC: "Saved as MPC Template",

        TOOLBAR_FIND_REGULATORY:
          "You can find this template in the Catalog under Templates > Regulatory Templates.",

        TOOLBAR_FIND_MPC:
          "You can find this template in the Catalog under Templates > MPC Templates.",

        TOOLBAR_NOTHING_TO_SAVE: "Nothing to Save",

        TOOLBAR_CREATE_WORKFLOW_BEFORE_SAVE:
          "Please create a workflow before saving the template.",

        TOOLBAR_NOTHING_TO_EXPORT: "Nothing to Export",

        TOOLBAR_CREATE_WORKFLOW_BEFORE_EXPORTING:
          "Please create a workflow before exporting.",

        TOOLBAR_IMPORT_SUCCESS: "Import Successful",

        TOOLBAR_WORKFLOW_IMPORTED_SUCCESSFULLY:
          "Workflow imported successfully.",

        TOOLBAR_IMPORT_FAILED: "Import Failed",

        TOOLBAR_UNABLE_TO_IMPORT_WORKFLOW: "Unable to import workflow.",
      };

      return translations[key] ?? key;
    },
  }),
}));

/* ToolbarButton mock                                                         */

interface MockToolbarButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ComponentType;
}

vi.mock("./ToolbarButton", () => ({
  default: ({ title, onClick, disabled }: MockToolbarButtonProps) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      data-testid={`toolbar-button-${title}`}
    >
      {title}
    </button>
  ),
}));

/* Dropdown mock                                                              */

interface DropdownItem {
  value: string;
  label: string;
}

interface MockDropdownProps {
  placeholder?: string;
  items?: DropdownItem[];
  onSelect?: (item: DropdownItem) => void;
}

vi.mock("../../../../components/forms/dropdown/Dropdown", () => ({
  default: ({ placeholder, items = [], onSelect }: MockDropdownProps) => (
    <div data-testid="dropdown">
      <button type="button" onClick={() => mockDropdownSelect()}>
        {placeholder}
      </button>

      <div>
        {items.map((item) => (
          <button
            type="button"
            key={item.value}
            data-testid={`dropdown-${item.value}`}
            onClick={() => onSelect?.(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

/* Dialog mock                                                                */

interface MockDialogProps {
  isOpen?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  children?: ReactNode;
}

vi.mock("../../../../components/common/dialogue/Dialog", () => ({
  default: ({
    isOpen,
    title,
    subtitle,
    onClose,
    children,
  }: MockDialogProps) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div role="dialog">
        <div>{subtitle}</div>

        <div>{title}</div>

        <button type="button" aria-label="Close dialog" onClick={onClose}>
          Close
        </button>

        {children}
      </div>
    );
  },
}));

/* Input mock                                                                 */

interface MockInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

vi.mock("../../../../components/forms/input/Input", () => ({
  default: forwardRef<HTMLInputElement, MockInputProps>(
    ({ label, onChange, ...props }, ref) => (
      <label>
        {label && <span>{label}</span>}

        <input ref={ref} {...props} onChange={onChange} />
      </label>
    ),
  ),
}));

/* Button mock                                                                */

interface MockButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

vi.mock("../../../../components/forms/button/Button", () => ({
  default: ({ children, onClick, disabled }: MockButtonProps) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

/* Notification mock                                                          */

interface MockNotificationProps {
  type: "success" | "warning";
  title: string;
  message: string;
  onClose?: () => void;
}

vi.mock("../../../../components/common/notification/Notification", () => ({
  default: ({ type, title, message, onClose }: MockNotificationProps) => (
    <div role="alert" data-testid="notification">
      <span data-testid="notification-type">{type}</span>

      <span data-testid="notification-title">{title}</span>

      <span data-testid="notification-message">{message}</span>

      {onClose && (
        <button type="button" onClick={onClose} aria-label="Close notification">
          Close
        </button>
      )}
    </div>
  ),
}));

/* Test helpers                                                               */

const createNode = (selected = false): WorkflowNode =>
  ({
    id: "node-1",
    type: "default",
    position: {
      x: 0,
      y: 0,
    },
    selected,
    data: {},
  }) as WorkflowNode;

const createEdge = (selected = false): Edge => ({
  id: "edge-1",
  source: "node-1",
  target: "node-2",
  selected,
});

const renderToolbar = () => render(<Toolbar />);

const setWorkflow = (nodes: WorkflowNode[], edges: Edge[] = []) => {
  mockToolbarStore.nodes = nodes;
  mockToolbarStore.edges = edges;
};

const getToolbarButton = (name: string) =>
  screen.getByRole("button", {
    name,
  });

/* Tests                                                                      */

describe("Toolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockToolbarStore.nodes = [];
    mockToolbarStore.edges = [];

    localStorage.clear();

    mockImportWorkflow.mockReset();
    mockExportWorkflow.mockReset();

    Object.defineProperty(crypto, "randomUUID", {
      configurable: true,
      value: vi.fn(() => MOCK_UUID),
    });
  });

  /* Basic rendering                                                        */

  it("renders toolbar title", () => {
    renderToolbar();

    expect(screen.getByText("New Template")).toBeInTheDocument();
  });

  it("renders all toolbar buttons", () => {
    renderToolbar();

    expect(getToolbarButton("Delete")).toBeInTheDocument();

    expect(getToolbarButton("Clear Workflow")).toBeInTheDocument();

    expect(getToolbarButton("Import Template")).toBeInTheDocument();

    expect(getToolbarButton("Export Template")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Back",
      }),
    ).toBeInTheDocument();
  });

  /* Navigation                                                             */

  it("navigates back when back button is clicked", () => {
    renderToolbar();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD);
  });

  /* Delete                                                                 */

  it("disables delete when nothing is selected", () => {
    setWorkflow([createNode(false)], [createEdge(false)]);

    renderToolbar();

    expect(getToolbarButton("Delete")).toBeDisabled();
  });

  it("enables delete when a node is selected", () => {
    setWorkflow([createNode(true)], [createEdge(false)]);

    renderToolbar();

    expect(getToolbarButton("Delete")).toBeEnabled();
  });

  it("enables delete when an edge is selected", () => {
    setWorkflow([createNode(false)], [createEdge(true)]);

    renderToolbar();

    expect(getToolbarButton("Delete")).toBeEnabled();
  });

  it("calls delete handlers", () => {
    setWorkflow([createNode(true)], [createEdge(false)]);

    renderToolbar();

    fireEvent.click(getToolbarButton("Delete"));

    expect(mockDeleteSelectedEdges).toHaveBeenCalledTimes(1);

    expect(mockDeleteSelectedNodes).toHaveBeenCalledTimes(1);
  });

  /* Clear workflow                                                         */

  it("disables clear workflow when workflow is empty", () => {
    setWorkflow([], []);

    renderToolbar();

    expect(getToolbarButton("Clear Workflow")).toBeDisabled();
  });

  it("enables clear workflow when nodes are present", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    expect(getToolbarButton("Clear Workflow")).toBeEnabled();
  });

  it("enables clear workflow when edges are present", () => {
    setWorkflow([], [createEdge(false)]);

    renderToolbar();

    expect(getToolbarButton("Clear Workflow")).toBeEnabled();
  });

  it("clears workflow when clear workflow is clicked", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(getToolbarButton("Clear Workflow"));

    expect(mockClearWorkflow).toHaveBeenCalledTimes(1);
  });

  it("does not clear workflow when workflow is empty", () => {
    setWorkflow([], []);

    renderToolbar();

    expect(getToolbarButton("Clear Workflow")).toBeDisabled();

    expect(mockClearWorkflow).not.toHaveBeenCalled();
  });

  /* Save As                                                                 */

  it("shows warning notification when workflow is empty", () => {
    setWorkflow([], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(screen.getByTestId("notification-type")).toHaveTextContent(
      "warning",
    );

    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Nothing to Save",
    );

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "Please create a workflow before saving the template.",
    );
  });

  it("opens regulatory save dialog", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText("Regulatory Template")).toBeInTheDocument();
  });

  it("opens mpc save dialog", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-mpc"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(screen.getByText("MPC Template")).toBeInTheDocument();
  });

  it("prefills generated template name", () => {
    setWorkflow([createNode(false)], []);

    localStorage.setItem(
      "workflowTemplates",
      JSON.stringify([
        {
          id: "existing",
          name: "Existing",
        },
      ]),
    );

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByDisplayValue("Custom_2")).toBeInTheDocument();
  });

  it("updates template name", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    const input = screen.getByDisplayValue("Custom_1");

    fireEvent.change(input, {
      target: {
        value: "My Template",
      },
    });

    expect(screen.getByDisplayValue("My Template")).toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes dialog using dialog onClose", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close dialog",
      }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  /* Save                                                                   */

  it("saves regulatory template", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    const input = screen.getByDisplayValue("Custom_1");

    fireEvent.change(input, {
      target: {
        value: "Regulatory Test",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    const templates = JSON.parse(
      localStorage.getItem("workflowTemplates") ?? "[]",
    ) as Array<{
      id: string;
      name: string;
      type: string;
      createdAt: string;
    }>;

    expect(templates).toHaveLength(1);

    expect(templates[0]).toMatchObject({
      id: MOCK_UUID,
      name: "Regulatory Test",
      type: "regulatory",
    });

    expect(mockClearWorkflow).toHaveBeenCalledTimes(1);
  });

  it("shows regulatory success notification", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    fireEvent.change(screen.getByDisplayValue("Custom_1"), {
      target: {
        value: "Regulatory Test",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Saved as Regulatory Template",
    );

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "You can find this template in the Catalog under Templates > Regulatory Templates.",
    );
  });

  it("shows mpc success notification", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-mpc"));

    fireEvent.change(screen.getByDisplayValue("Custom_1"), {
      target: {
        value: "MPC Test",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Saved as MPC Template",
    );

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "You can find this template in the Catalog under Templates > MPC Templates.",
    );
  });

  it("renders notification component", () => {
    setWorkflow([], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("creates template using randomUUID", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    fireEvent.change(screen.getByDisplayValue("Custom_1"), {
      target: {
        value: "Test Template",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it("loads existing templates before creating template", () => {
    localStorage.setItem(
      "workflowTemplates",
      JSON.stringify([
        {
          id: "1",
          name: "Template One",
        },
        {
          id: "2",
          name: "Template Two",
        },
      ]),
    );

    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByDisplayValue("Custom_3")).toBeInTheDocument();
  });

  it("uses empty array fallback when localStorage returns null", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByDisplayValue("Custom_1")).toBeInTheDocument();
  });

  it("uses empty array fallback while saving when localStorage returns null", () => {
    setWorkflow([createNode(false)], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    fireEvent.change(screen.getByDisplayValue("Custom_1"), {
      target: {
        value: "Test Template",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    const templates = JSON.parse(
      localStorage.getItem("workflowTemplates") ?? "[]",
    ) as Array<{
      name: string;
    }>;

    expect(templates).toHaveLength(1);

    expect(templates[0]?.name).toBe("Test Template");
  });

  it("closes notification when notification onClose is triggered", () => {
    setWorkflow([], []);

    renderToolbar();

    fireEvent.click(screen.getByTestId("dropdown-regulatory"));

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close notification",
      }),
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  /* Export                                                                 */

  it("shows warning notification when exporting empty workflow", () => {
    setWorkflow([], []);

    renderToolbar();

    fireEvent.click(getToolbarButton("Export Template"));

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(screen.getByTestId("notification-type")).toHaveTextContent(
      "warning",
    );

    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Nothing to Export",
    );

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "Please create a workflow before exporting.",
    );

    expect(mockExportWorkflow).not.toHaveBeenCalled();
  });

  it("exports workflow when nodes are present", () => {
    const nodes = [createNode(false)];

    const edges = [createEdge(false)];

    setWorkflow(nodes, edges);

    renderToolbar();

    fireEvent.click(getToolbarButton("Export Template"));

    expect(mockExportWorkflow).toHaveBeenCalledTimes(1);

    expect(mockExportWorkflow).toHaveBeenCalledWith(
      nodes,
      edges,
      "workflow.json",
    );
  });

  /* Import                                                                  */

  it("opens file picker when import template is clicked", () => {
    setWorkflow([], []);

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    expect(fileInput).not.toBeNull();

    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

    fireEvent.click(getToolbarButton("Import Template"));

    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();

    expect(fileInput).toBeInTheDocument();
  });

  it("does nothing when no import file is selected", async () => {
    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    expect(fileInput).not.toBeNull();

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    expect(mockSetIsImporting).not.toHaveBeenCalled();

    expect(mockImportWorkflow).not.toHaveBeenCalled();
  });

  it("imports workflow successfully", async () => {
    const file = new File(['{"nodes":[],"edges":[]}'], "workflow.json", {
      type: "application/json",
    });

    const importedNodes = [createNode(false)];

    const importedEdges = [createEdge(false)];

    mockImportWorkflow.mockResolvedValue({
      nodes: importedNodes,
      edges: importedEdges,
    });

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockImportWorkflow).toHaveBeenCalledWith(file);
    });

    expect(mockSetIsImporting).toHaveBeenCalledWith(true);

    expect(mockSetNodes).toHaveBeenCalledWith(importedNodes);

    expect(mockSetEdges).toHaveBeenCalledWith(importedEdges);

    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);

    expect(screen.getByTestId("notification-title")).toHaveTextContent(
      "Import Successful",
    );
  });

  it("shows import failed notification when import throws an Error", async () => {
    const file = new File(["invalid"], "workflow.json", {
      type: "application/json",
    });

    mockImportWorkflow.mockRejectedValue(new Error("Invalid workflow"));

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-title")).toHaveTextContent(
        "Import Failed",
      );
    });

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "Invalid workflow",
    );

    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
  });

  it("shows default import error when a non-Error is thrown", async () => {
    const file = new File(["invalid"], "workflow.json", {
      type: "application/json",
    });

    mockImportWorkflow.mockRejectedValue("something went wrong");

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-title")).toHaveTextContent(
        "Import Failed",
      );
    });

    expect(screen.getByTestId("notification-message")).toHaveTextContent(
      "Unable to import workflow.",
    );

    expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
  });

  it("resets importing state after successful import", async () => {
    const file = new File(["{}"], "workflow.json", {
      type: "application/json",
    });

    mockImportWorkflow.mockResolvedValue({
      nodes: [],
      edges: [],
    });

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
    });
  });

  it("resets importing state after failed import", async () => {
    const file = new File(["{}"], "workflow.json", {
      type: "application/json",
    });

    mockImportWorkflow.mockRejectedValue(new Error("Import failed"));

    renderToolbar();

    const fileInput = document.querySelector('input[type="file"]');

    if (!(fileInput instanceof HTMLInputElement)) {
      throw new Error("File input was not found");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockSetIsImporting).toHaveBeenLastCalledWith(false);
    });
  });
});
