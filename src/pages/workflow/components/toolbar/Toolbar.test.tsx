import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import Toolbar from "./Toolbar";

import { act } from "@testing-library/react";

const mockNavigate = vi.fn();

const mockDeleteSelectedNodes = vi.fn();
const mockDeleteSelectedEdges = vi.fn();
const mockClearWorkflow = vi.fn();

const mockStore: {
  nodes: Array<{ id: string }>;
  deleteSelectedNodes: typeof mockDeleteSelectedNodes;
  deleteSelectedEdges: typeof mockDeleteSelectedEdges;
  clearWorkflow: typeof mockClearWorkflow;
} = {
  nodes: [],
  deleteSelectedNodes: mockDeleteSelectedNodes,
  deleteSelectedEdges: mockDeleteSelectedEdges,
  clearWorkflow: mockClearWorkflow,
};

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock(
  "../../../../store/workflowStore",
  () => ({
    useWorkflowStore: () => mockStore,
  }),
);

vi.mock("./ToolbarButton", () => ({
  default: ({
    title,
    onClick,
  }: {
    title: string;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  ),
}));

vi.mock(
  "../../../../components/forms/dropdown/Dropdown",
  () => ({
    default: ({
      onSelect,
    }: {
      onSelect: (
        item: {
          value: string;
          label: string;
        },
      ) => void;
    }) => (
      <div>
        <button
          onClick={() =>
            onSelect({
              value: "regulatory",
              label:
                "Custom Regulatory Template",
            })
          }
        >
          Regulatory Save
        </button>

        <button
          onClick={() =>
            onSelect({
              value: "mpc",
              label:
                "Custom MPC Templates",
            })
          }
        >
          MPC Save
        </button>
      </div>
    ),
  }),
);

vi.mock(
  "../../../../components/common/dialogue/Dialog",
  () => ({
    default: ({
      isOpen,
      title,
      children,
      onClose,
    }: {
      isOpen: boolean;
      title: string;
      children: React.ReactNode;
      onClose?: () => void;
    }) =>
      isOpen ? (
        <div data-testid="dialog">
          <h2>{title}</h2>

          <button
            onClick={onClose}
            data-testid="dialog-close"
          >
            Close
          </button>

          {children}
        </div>
      ) : null,
  }),
);

vi.mock(
  "../../../../components/forms/input/Input",
  () => ({
    default: ({
      label,
      value,
      onChange,
    }: {
      label?: string;
      value?: string;
      onChange?: (
        e: React.ChangeEvent<HTMLInputElement>,
      ) => void;
    }) => (
      <input
        aria-label={label}
        value={value}
        onChange={onChange}
      />
    ),
  }),
);

vi.mock(
  "../../../../components/forms/button/Button",
  () => ({
    default: ({
      children,
      onClick,
    }: {
      children: React.ReactNode;
      onClick?: () => void;
    }) => (
      <button
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    ),
  }),
);

vi.mock(
  "../../../../components/common/notification/Notification",
  () => ({
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

        <button
          data-testid="notification-close"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    ),
  }),
);

describe("Toolbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.nodes = [];

    Storage.prototype.getItem = vi.fn(
      () => "[]",
    );

    Storage.prototype.setItem = vi.fn();

    vi.stubGlobal("crypto", {
      randomUUID: () => "mock-id",
    });
  });

  it("renders toolbar title", () => {
    render(<Toolbar />);

    expect(
      screen.getByText(
        "NEW_TEMPLATE",
      ),
    ).toBeInTheDocument();
  });

  it("renders all toolbar buttons", () => {
    render(<Toolbar />);

    expect(
      screen.getByText("Delete"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Duplicate"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Export Template",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Import Template",
      ),
    ).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    render(<Toolbar />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Back",
      }),
    );

    expect(
      mockNavigate,
    ).toHaveBeenCalledTimes(1);
  });

  it("calls delete handlers", () => {
    render(<Toolbar />);

    fireEvent.click(
      screen.getByText("Delete"),
    );

    expect(
      mockDeleteSelectedEdges,
    ).toHaveBeenCalledTimes(1);

    expect(
      mockDeleteSelectedNodes,
    ).toHaveBeenCalledTimes(1);
  });

  it("shows warning notification when workflow is empty", () => {
    mockStore.nodes = [];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByText(
        "Regulatory Save",
      ),
    );

    expect(
      screen.getByText(
        "Nothing to Save",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Please create a workflow before saving the template.",
      ),
    ).toBeInTheDocument();
  });

  it("opens regulatory save dialog", () => {
    mockStore.nodes = [
      { id: "1" },
    ];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByText(
        "Regulatory Save",
      ),
    );

    expect(
      screen.getByTestId("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "TOOLBAR_REGULATORY_TEMPLATE",
      ),
    ).toBeInTheDocument();
  });

  it("opens mpc save dialog", () => {
    mockStore.nodes = [
      { id: "1" },
    ];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByText(
        "MPC Save",
      ),
    );

    expect(
      screen.getByTestId("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "TOOLBAR_MPC_TEMPLATE",
      ),
    ).toBeInTheDocument();
  });

  it("prefills generated template name", () => {
    mockStore.nodes = [
      { id: "1" },
    ];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByText(
        "Regulatory Save",
      ),
    );

    expect(
      screen.getByDisplayValue(
        "Custom_1",
      ),
    ).toBeInTheDocument();
  });

  it("updates template name", () => {
    mockStore.nodes = [
      { id: "1" },
    ];

    render(<Toolbar />);

    fireEvent.click(
      screen.getByText(
        "Regulatory Save",
      ),
    );

    const input =
      screen.getByLabelText(
        "Template Name",
      );

    fireEvent.change(input, {
      target: {
        value:
          "My Custom Template",
      },
    });

    expect(
      screen.getByDisplayValue(
        "My Custom Template",
      ),
    ).toBeInTheDocument();
  });

  it("closes dialog when cancel is clicked", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_CANCEL",
    ),
  );

  expect(
    screen.queryByTestId(
      "dialog",
    ),
  ).not.toBeInTheDocument();
});

it("saves regulatory template", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_SAVE",
    ),
  );

  expect(
    localStorage.setItem,
  ).toHaveBeenCalled();

  expect(
    mockClearWorkflow,
  ).toHaveBeenCalledTimes(1);
});

it("shows regulatory success notification", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_SAVE",
    ),
  );

  expect(
    screen.getByText(
      "TOOLBAR_SAVED_REGULATORY",
    ),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "TOOLBAR_FIND_REGULATORY",
    ),
  ).toBeInTheDocument();
});

it("shows mpc success notification", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "MPC Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_SAVE",
    ),
  );

  expect(
    screen.getByText(
      "TOOLBAR_SAVED_MPC",
    ),
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      "TOOLBAR_FIND_MPC",
    ),
  ).toBeInTheDocument();
});

it("renders notification component", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_SAVE",
    ),
  );

  expect(
    screen.getByTestId(
      "notification",
    ),
  ).toBeInTheDocument();
});

it("creates template using randomUUID", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  fireEvent.click(
    screen.getByText(
      "COMMON_SAVE",
    ),
  );

  expect(
    localStorage.setItem,
  ).toHaveBeenCalledWith(
    "workflowTemplates",
    expect.stringContaining(
      "mock-id",
    ),
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

  fireEvent.click(
    screen.getByText(
      "Regulatory Save",
    ),
  );

  expect(
    screen.getByDisplayValue(
      "Custom_2",
    ),
  ).toBeInTheDocument();
});

it("uses empty array fallback when localStorage returns null", () => {
  Storage.prototype.getItem = vi.fn(() => null);

  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  expect(
    screen.getByDisplayValue("Custom_1"),
  ).toBeInTheDocument();
});

it("closes dialog using dialog onClose", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  fireEvent.click(
    screen.getByTestId("dialog-close"),
  );

  expect(
    screen.queryByTestId("dialog"),
  ).not.toBeInTheDocument();
});

it("closes notification when notification onClose is triggered", () => {
  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  fireEvent.click(
    screen.getByText("COMMON_SAVE"),
  );

  fireEvent.click(
    screen.getByTestId(
      "notification-close",
    ),
  );

  expect(
    screen.queryByTestId(
      "notification",
    ),
  ).not.toBeInTheDocument();
});

it("uses empty array fallback while saving when localStorage returns null", () => {
  Storage.prototype.getItem = vi.fn(() => null);

  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  fireEvent.click(
    screen.getByText("COMMON_SAVE"),
  );

  expect(
    localStorage.setItem,
  ).toHaveBeenCalled();
});

it("executes success notification timeout callback", () => {
  vi.useFakeTimers();

  mockStore.nodes = [
    { id: "1" },
  ];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  fireEvent.click(
    screen.getByText("COMMON_SAVE"),
  );

  act(() => {
    vi.runAllTimers();
  });

  vi.useRealTimers();
});

it("executes warning notification timeout callback", () => {
  vi.useFakeTimers();

  mockStore.nodes = [];

  render(<Toolbar />);

  fireEvent.click(
    screen.getByText("Regulatory Save"),
  );

  act(() => {
    vi.runAllTimers();
  });

  vi.useRealTimers();
});
});