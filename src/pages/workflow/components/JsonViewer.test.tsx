import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import JsonViewer from "./JsonViewer";

const { flowToBackend } = vi.hoisted(() => ({
  flowToBackend: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../utils/utils", () => ({
  flowToBackend,
}));

let storeState: {
  nodes: unknown[];
  edges: unknown[];
  selectedNode: unknown;
};

vi.mock("../../../store/workflowStore", () => ({
  useWorkflowStore: () => storeState,
}));

beforeEach(() => {
  vi.clearAllMocks();

  flowToBackend.mockReturnValue({
    workflow: "test",
  });

  storeState = {
    nodes: [],
    edges: [],
    selectedNode: null,
  };
});

describe("JsonViewer", () => {
  it("renders headers", () => {
    render(<JsonViewer />);

    expect(screen.getByText("WORKFLOW_JSON")).toBeInTheDocument();

    expect(screen.getByText("SELECTED_ELEMENT")).toBeInTheDocument();
  });

  it("calls flowToBackend with nodes and edges", () => {
    storeState.nodes = [
      {
        id: "node-1",
      },
    ];

    storeState.edges = [
      {
        id: "edge-1",
      },
    ];

    render(<JsonViewer />);

    expect(flowToBackend).toHaveBeenCalledWith(
      storeState.nodes,
      storeState.edges,
    );
  });

  it("renders backend json", () => {
    flowToBackend.mockReturnValue({
      workflow: "test",
    });

    render(<JsonViewer />);

    expect(screen.getByText(/"workflow": "test"/)).toBeInTheDocument();
  });

  it("renders selected node element json", () => {
    storeState.selectedNode = {
      data: {
        element: {
          Name: "Temperature",
          elementType: "Attribute",
        },
      },
    };

    render(<JsonViewer />);

    expect(screen.getByText(/Temperature/)).toBeInTheDocument();

    expect(screen.getByText(/Attribute/)).toBeInTheDocument();
  });

  it("renders null when selectedNode is null", () => {
    storeState.selectedNode = null;

    render(<JsonViewer />);

    const nullValues = screen.getAllByText("null");

    expect(nullValues.length).toBeGreaterThan(0);
  });

  it("renders selected node when element is undefined", () => {
    storeState.selectedNode = {
      data: {},
    };

    render(<JsonViewer />);

    const nullValues = screen.getAllByText("null");

    expect(nullValues.length).toBeGreaterThan(0);
  });

  it("updates backend json when flowToBackend returns different data", () => {
    flowToBackend.mockReturnValue({
      id: "workflow-1",
      nodes: [
        {
          id: "node-1",
        },
      ],
    });

    render(<JsonViewer />);

    expect(screen.getByText(/"id": "workflow-1"/)).toBeInTheDocument();

    expect(screen.getByText(/"nodes"/)).toBeInTheDocument();
  });
});
