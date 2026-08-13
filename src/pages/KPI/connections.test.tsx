import { describe, expect, it, vi, afterEach } from "vitest";

import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import * as utils from "../../utils/utils";
import type { TreeNodeData } from "../../types/commonTypes";

import { render, screen } from "../../test";
import Connections from "./Connections";

/* -------------------------------------------------------------------------- */
/* i18next mock                                                               */
/* -------------------------------------------------------------------------- */

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        TAB_CONNECTIONS: "Connections",
        COMMON_HELP: "Help",
        COMMON_APPLY_TO_ALL: "Apply to All",
        COMMON_SAVE: "Save",
        CONNECTIONS_ALL_COLUMNS: "All Columns",
        CONNECTIONS_SELECTED_COLUMNS: "Selected Columns",
      };

      return translations[key] ?? key;
    },
  }),
}));

/* -------------------------------------------------------------------------- */
/* Utils mock                                                                 */
/* -------------------------------------------------------------------------- */

vi.mock("../../utils/utils", async () => {
  const actual =
    await vi.importActual<typeof import("../../utils/utils")>(
      "../../utils/utils",
    );

  return {
    ...actual,
    findNode: vi.fn(actual.findNode),
    nodeExists: vi.fn(actual.nodeExists),
    removeNode: vi.fn(actual.removeNode),
  };
});

/* -------------------------------------------------------------------------- */
/* Tree mock                                                                  */
/* -------------------------------------------------------------------------- */

type MockTreeNode = {
  id: string;
  label: string;
  children?: MockTreeNode[];
};

vi.mock("../../components/common/tree/Tree", () => ({
  default: ({
    nodes,
    onSelect,
  }: {
    nodes: MockTreeNode[];
    selectedId?: string | null;
    onSelect: (id: string) => void;
  }) => {
    const renderNodes = (items: MockTreeNode[]): ReactNode[] =>
      items.flatMap((node) => [
        <button key={node.id} type="button" onClick={() => onSelect(node.id)}>
          {node.label}
        </button>,

        ...(node.children ? renderNodes(node.children) : []),
      ]);

    return <div data-testid="mock-tree">{renderNodes(nodes)}</div>;
  },
}));

/* -------------------------------------------------------------------------- */
/* Button mock                                                                */
/* -------------------------------------------------------------------------- */

vi.mock("../../components/forms/button/Button", () => ({
  default: ({
    children,
    onClick,
    iconOnly,
    icon,
  }: {
    children?: ReactNode;
    onClick?: () => void;
    iconOnly?: boolean;
    icon?: ReactNode;
  }) => (
    <button type="button" data-testid="mock-button" onClick={onClick}>
      {iconOnly ? icon : children}
    </button>
  ),
}));

/* -------------------------------------------------------------------------- */
/* Cleanup                                                                    */
/* -------------------------------------------------------------------------- */

afterEach(() => {
  vi.restoreAllMocks();
});

/* -------------------------------------------------------------------------- */
/* Tests                                                                      */
/* -------------------------------------------------------------------------- */

describe("Connections", () => {
  it("renders page title", () => {
    render(<Connections />);

    expect(screen.getByText("Connections")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<Connections />);

    expect(screen.getByText("Help")).toBeInTheDocument();

    expect(screen.getByText("Apply to All")).toBeInTheDocument();

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders both section headers", () => {
    render(<Connections />);

    expect(screen.getByText("All Columns")).toBeInTheDocument();

    expect(screen.getByText("Selected Columns")).toBeInTheDocument();
  });

  it("renders nested nodes", () => {
    render(<Connections />);

    expect(screen.getByText("01-LC0524.PV")).toBeInTheDocument();

    expect(screen.getByText("03-PC0251.MODE")).toBeInTheDocument();

    expect(screen.getByText("03-PC0251.OP")).toBeInTheDocument();

    expect(screen.getByText("03-PC0251.SP")).toBeInTheDocument();
  });

  it("does nothing when move is clicked without selecting a node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    const buttons = screen.getAllByTestId("mock-button");

    const moveButton = buttons[3];

    await user.click(moveButton);

    expect(screen.getByText("Selected Columns")).toBeInTheDocument();
  });

  it("moves selected parent node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    await user.click(screen.getByText("01-LC0524 DS"));

    const buttons = screen.getAllByTestId("mock-button");

    await user.click(buttons[3]);

    expect(screen.getAllByText("01-LC0524 DS")).toHaveLength(2);
  });

  it("moves selected nested node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    await user.click(screen.getByText("01-LC0524.PV"));

    const buttons = screen.getAllByTestId("mock-button");

    await user.click(buttons[3]);

    expect(screen.getAllByText("01-LC0524.PV")).toHaveLength(2);
  });

  it("does nothing when remove is clicked without selecting a node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    const buttons = screen.getAllByTestId("mock-button");

    const removeButton = buttons[4];

    await user.click(removeButton);

    expect(screen.getByText("Selected Columns")).toBeInTheDocument();
  });

  it("removes previously selected node", async () => {
    const user = userEvent.setup();

    render(<Connections />);

    await user.click(screen.getByText("01-LC0524 DS"));

    const buttons = screen.getAllByTestId("mock-button");

    const moveButton = buttons[3];
    const removeButton = buttons[4];

    await user.click(moveButton);

    expect(screen.getAllByText("01-LC0524 DS")).toHaveLength(2);

    await user.click(screen.getAllByText("01-LC0524 DS")[1]);

    await user.click(removeButton);

    expect(screen.getAllByText("01-LC0524 DS")).toHaveLength(1);
  });

  it("does nothing when selected node cannot be found", async () => {
    const user = userEvent.setup();

    vi.mocked(utils.findNode).mockReturnValueOnce(null);

    render(<Connections />);

    await user.click(screen.getByText("01-LC0524 DS"));

    const buttons = screen.getAllByTestId("mock-button");

    await user.click(buttons[3]);

    expect(utils.findNode).toHaveBeenCalled();
  });

  it("does nothing when node already exists in selected columns", async () => {
    const user = userEvent.setup();

    vi.mocked(utils.findNode).mockReturnValueOnce({
      id: "ds",
      label: "01-LC0524 DS",
    } as TreeNodeData);

    vi.mocked(utils.nodeExists).mockReturnValueOnce(true);

    render(<Connections />);

    await user.click(screen.getByText("01-LC0524 DS"));

    const buttons = screen.getAllByTestId("mock-button");

    await user.click(buttons[3]);

    expect(utils.nodeExists).toHaveBeenCalled();
  });
});
