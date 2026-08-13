import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import DashboardPanel from "./DashboardPanel";
import { ROUTES } from "../../../constants/routes/routesConstant";

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockTree = vi.fn();

interface MockTreeProps {
  nodes: unknown[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,

    useNavigate: () => mockNavigate,

    useLocation: () => ({
      pathname: ROUTES.DASHBOARD,
    }),

    useParams: () => mockUseParams(),
  };
});

vi.mock("../tree/Tree", () => ({
  default: (props: MockTreeProps) => {
    mockTree(props);

    return (
      <div data-testid="tree">
        <button
          type="button"
          data-testid="select-node"
          onClick={() => props.onSelect("pump-101")}
        >
          Select Node
        </button>

        <div data-testid="selected-id">{props.selectedId ?? "none"}</div>

        <div data-testid="tree-count">{props.nodes.length}</div>
      </div>
    );
  },
}));

vi.mock("../../../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

describe("DashboardPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({});
  });

  const getSearchInput = () => {
    return screen.getByRole("textbox");
  };

  it("renders search input", () => {
    render(<DashboardPanel />);

    expect(getSearchInput()).toBeInTheDocument();
  });

  it("renders tree component", () => {
    render(<DashboardPanel />);

    expect(screen.getByTestId("tree")).toBeInTheDocument();
  });

  it("updates search value", async () => {
    const user = userEvent.setup();

    render(<DashboardPanel />);

    const input = getSearchInput();

    await user.type(input, "pump");

    expect(input).toHaveValue("pump");
  });

  it("navigates to first plant on initial load", () => {
    render(<DashboardPanel />);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard/feed-water");
  });

  it("does not navigate automatically when plant is selected", () => {
    mockUseParams.mockReturnValue({
      plant: "feed-water",
    });

    render(<DashboardPanel />);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("passes selected plant id to Tree", () => {
    mockUseParams.mockReturnValue({
      plant: "feed-water",
    });

    render(<DashboardPanel />);

    expect(screen.getByTestId("selected-id")).toHaveTextContent("feed-water");
  });

  it("passes selected template id to Tree", () => {
    mockUseParams.mockReturnValue({
      template: "fresh-water",
    });

    render(<DashboardPanel />);

    expect(screen.getByTestId("selected-id")).toHaveTextContent("fresh-water");
  });

  it("passes selected item id to Tree", () => {
    mockUseParams.mockReturnValue({
      itemId: "pump-101",
    });

    render(<DashboardPanel />);

    expect(screen.getByTestId("selected-id")).toHaveTextContent("pump-101");
  });

  it("filters tree when searching", async () => {
    const user = userEvent.setup();

    render(<DashboardPanel />);

    const input = getSearchInput();

    await user.type(input, "pump");

    expect(input).toHaveValue("pump");

    expect(mockTree).toHaveBeenLastCalledWith(
      expect.objectContaining({
        nodes: expect.any(Array),
      }),
    );
  });

  it("navigates when tree node is selected", async () => {
    const user = userEvent.setup();

    render(<DashboardPanel />);

    await user.click(screen.getByTestId("select-node"));

    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard/feed-water/fresh-water/pump-101",
    );
  });

  it("renders search icon input", () => {
    render(<DashboardPanel />);

    expect(getSearchInput()).toBeInTheDocument();
  });

  it("renders filtered tree", () => {
    render(<DashboardPanel />);

    expect(screen.getByTestId("tree-count")).toBeInTheDocument();
  });
});
