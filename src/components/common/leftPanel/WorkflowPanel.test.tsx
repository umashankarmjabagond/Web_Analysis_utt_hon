import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "../../../test";

import {
  mockCatalogSections,
  mockAttributeCatalogSections,
} from "../../../test/mocks/workflowPanelData";
import WorkflowPanel from "./WorkflowPanel";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const setPendingCatalogItem = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        WORKFLOW_CATALOG: "Catalog",
        WORKFLOW_TEMPLATES: "Templates",
        WORKFLOW_ATTRIBUTES: "Attributes",
        COMMON_SEARCH: "Search...",
      };

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../../store/workflowStore", () => ({
  useWorkflowStore: () => ({
    setPendingCatalogItem,
  }),
}));

vi.mock("../../../pages/workflow/workflowPanelData ", () => ({
  catalogSections: mockCatalogSections,
  attributeCatalogSections: mockAttributeCatalogSections,
}));

vi.mock("../../forms/accordion/Accordion", () => ({
  default: ({
    title,
    count,
    children,
  }: {
    title: string;
    count?: number;
    children: React.ReactNode;
  }) => (
    <div data-testid="accordion">
      <div data-testid="accordion-title">{title}</div>

      {count !== undefined && (
        <span data-testid="accordion-count">{count}</span>
      )}

      <div>{children}</div>
    </div>
  ),
}));

vi.mock("../../../pages/workflow/components/TemplateCard", () => ({
  default: ({
    title,
    onClick,
    onDragStart,
    draggable,
  }: {
    title: string;
    onClick?: () => void;
    onDragStart?: (event: React.DragEvent) => void;
    draggable?: boolean;
  }) => (
    <button
      type="button"
      draggable={draggable}
      onClick={onClick}
      onDragStart={onDragStart}
      data-testid={`template-card-${title}`}
    >
      {title}
    </button>
  ),
}));

vi.mock("../../forms/input/Input", () => ({
  default: ({
    value,
    onChange,
    placeholder,
    ...props
  }: {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    [key: string]: unknown;
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

vi.mock("../../utils/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
}));

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("WorkflowPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1400,
    });
  });

  it("renders catalog title", () => {
    render(<WorkflowPanel />);

    expect(screen.getByText("Catalog")).toBeInTheDocument();
  });

  it("renders both tabs", () => {
    render(<WorkflowPanel />);

    expect(
      screen.getByRole("button", {
        name: "Templates",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Attributes",
      }),
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<WorkflowPanel />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows template items by default", () => {
    render(<WorkflowPanel />);

    expect(
      screen.getByRole("button", {
        name: "Pump",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Valve",
      }),
    ).toBeInTheDocument();
  });

  it("switches to attributes tab", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Attributes",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Temperature",
      }),
    ).toBeInTheDocument();
  });

  it("removes template items when switching to attributes tab", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Attributes",
      }),
    );

    expect(
      screen.queryByRole("button", {
        name: "Pump",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Valve",
      }),
    ).not.toBeInTheDocument();
  });

  it("filters template items", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.type(screen.getByPlaceholderText("Search..."), "Pump");

    expect(
      screen.getByRole("button", {
        name: "Pump",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Valve",
      }),
    ).not.toBeInTheDocument();
  });

  it("filters search ignoring case", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.type(screen.getByPlaceholderText("Search..."), "pump");

    expect(
      screen.getByRole("button", {
        name: "Pump",
      }),
    ).toBeInTheDocument();
  });

  it("shows no items when search does not match", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.type(screen.getByPlaceholderText("Search..."), "XYZ");

    expect(
      screen.queryByRole("button", {
        name: "Pump",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Valve",
      }),
    ).not.toBeInTheDocument();
  });

  it("does not filter when search contains only spaces", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.type(screen.getByPlaceholderText("Search..."), "   ");

    expect(
      screen.getByRole("button", {
        name: "Pump",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Valve",
      }),
    ).toBeInTheDocument();
  });

  it("filters attributes after switching to attributes tab", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Attributes",
      }),
    );

    await user.type(screen.getByPlaceholderText("Search..."), "Temperature");

    expect(
      screen.getByRole("button", {
        name: "Temperature",
      }),
    ).toBeInTheDocument();
  });

  it("calls setPendingCatalogItem on mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).toHaveBeenCalledTimes(1);
  });

  it("passes clicked item to setPendingCatalogItem on mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Pump",
      }),
    );
  });

  it("does not call setPendingCatalogItem on desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1400,
    });

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).not.toHaveBeenCalled();
  });

  it("does not call setPendingCatalogItem when width is exactly 1280", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1280,
    });

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).not.toHaveBeenCalled();
  });

  it("calls setPendingCatalogItem below 1280 width", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1279,
    });

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).toHaveBeenCalledTimes(1);
  });

  it("renders accordion", () => {
    render(<WorkflowPanel />);

    expect(screen.getByTestId("accordion")).toBeInTheDocument();
  });

  it("passes section title to accordion", () => {
    render(<WorkflowPanel />);

    expect(screen.getByTestId("accordion-title")).toHaveTextContent(
      mockCatalogSections[0].title,
    );
  });

  it("passes correct item count to accordion", () => {
    render(<WorkflowPanel />);

    expect(screen.getByTestId("accordion-count")).toHaveTextContent(
      String(mockCatalogSections[0].items.length),
    );
  });

  it("handles drag start", () => {
    render(<WorkflowPanel />);

    const card = screen.getByRole("button", {
      name: "Pump",
    });

    const setData = vi.fn();

    const dataTransfer = {
      setData,
      effectAllowed: "",
    };

    fireEvent.dragStart(card, {
      dataTransfer,
    });

    expect(setData).toHaveBeenCalled();

    expect(setData.mock.calls[0][0]).toBe("application/reactflow");
  });

  it("passes correct drag payload", () => {
    render(<WorkflowPanel />);

    const card = screen.getByRole("button", {
      name: "Pump",
    });

    const setData = vi.fn();

    const dataTransfer = {
      setData,
      effectAllowed: "",
    };

    fireEvent.dragStart(card, {
      dataTransfer,
    });

    const payload = JSON.parse(setData.mock.calls[0][1]);

    expect(payload.type).toBe("template");

    expect(payload.item.title).toBe("Pump");
  });

  it("changes effectAllowed to move", () => {
    render(<WorkflowPanel />);

    const card = screen.getByRole("button", {
      name: "Pump",
    });

    const dataTransfer = {
      setData: vi.fn(),
      effectAllowed: "",
    };

    fireEvent.dragStart(card, {
      dataTransfer,
    });

    expect(dataTransfer.effectAllowed).toBe("move");
  });

  it("uses attribute type in drag payload when dragging from attributes tab", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Attributes",
      }),
    );

    const card = screen.getByRole("button", {
      name: "Temperature",
    });

    const setData = vi.fn();

    const dataTransfer = {
      setData,
      effectAllowed: "",
    };

    fireEvent.dragStart(card, {
      dataTransfer,
    });

    const payload = JSON.parse(setData.mock.calls[0][1]);

    expect(payload.type).toBe("attribute");

    expect(payload.item.title).toBe("Temperature");
  });

  it("does not render items from empty filtered sections", async () => {
    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.type(screen.getByPlaceholderText("Search..."), "XYZ");

    expect(screen.queryByTestId("accordion")).not.toBeInTheDocument();
  });
});
