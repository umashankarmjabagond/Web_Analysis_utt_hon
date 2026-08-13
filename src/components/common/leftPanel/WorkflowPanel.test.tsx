import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "../../../test";

import {
  mockCatalogSections,
  mockAttributeCatalogSections,
} from "../../../test/mocks/workflowPanelData";

const setPendingCatalogItem = vi.fn();

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
  default: ({ title, children }: any) => (
    <div data-testid="accordion">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

vi.mock("../../../pages/workflow/components/TemplateCard", () => ({
  default: ({ title, onClick, onDragStart, draggable }: any) => (
    <button draggable={draggable} onClick={onClick} onDragStart={onDragStart}>
      {title}
    </button>
  ),
}));

import WorkflowPanel from "./WorkflowPanel";

describe("WorkflowPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1400;
  });

  it("renders catalog title", () => {
    render(<WorkflowPanel />);
    expect(screen.getByText("Catalog")).toBeInTheDocument();
  });

  it("renders both tabs", () => {
    render(<WorkflowPanel />);

    expect(
      screen.getByRole("button", { name: "Templates" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Attributes" }),
    ).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<WorkflowPanel />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows template items by default", () => {
    render(<WorkflowPanel />);

    expect(screen.getByRole("button", { name: "Pump" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Valve" })).toBeInTheDocument();
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
  });

  it("calls setPendingCatalogItem on mobile", async () => {
    window.innerWidth = 768;

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).toHaveBeenCalledTimes(1);
  });

  it("does not call setPendingCatalogItem on desktop", async () => {
    window.innerWidth = 1400;

    const user = userEvent.setup();

    render(<WorkflowPanel />);

    await user.click(
      screen.getByRole("button", {
        name: "Pump",
      }),
    );

    expect(setPendingCatalogItem).not.toHaveBeenCalled();
  });

  it("renders accordion", () => {
    render(<WorkflowPanel />);

    expect(screen.getByTestId("accordion")).toBeInTheDocument();
  });

  it("handles drag start", () => {
    render(<WorkflowPanel />);

    const card = screen.getByRole("button", {
      name: "Pump",
    });

    const setData = vi.fn();

    fireEvent.dragStart(card, {
      dataTransfer: {
        setData,
        effectAllowed: "",
      },
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

    fireEvent.dragStart(card, {
      dataTransfer: {
        setData,
        effectAllowed: "",
      },
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

    const dataTransfer: any = {
      setData: vi.fn(),
      effectAllowed: "",
    };

    fireEvent.dragStart(card, {
      dataTransfer,
    });

    expect(dataTransfer.effectAllowed).toBe("move");
  });
});
