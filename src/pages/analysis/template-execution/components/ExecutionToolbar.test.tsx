import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ExecutionToolbar from "./ExecutionToolbar";
import { ROUTES } from "../../../../constants/routes/routesConstant";

import {
  EXECUTION_ACTION,
  type ExecutionAction,
} from "../../../../types/templateExecution";

import type { ReactNode } from "react";

const mockNavigate = vi.fn();
const mockSetExecutionAction = vi.fn();

let mockExecutionAction: ExecutionAction =
  EXECUTION_ACTION.IDLE;

let mockSelectedExecutionItem:
  | {
      name: string;
      type?: string;
    }
  | undefined = {
  name: "Test Asset",
  type: "asset",
};

vi.mock("react-router-dom", () => ({
  useNavigate: () =>
    mockNavigate,
}));

vi.mock(
  "../../../../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore:
      vi.fn((selector) =>
        selector({
          selectedExecutionItem:
            mockSelectedExecutionItem,
          executionAction:
            mockExecutionAction,
          setExecutionAction:
            mockSetExecutionAction,
        }),
      ),
  }),
);

vi.mock(
  "../../../../components/common/badge/Badge",
  () => ({
    default: ({
      children,
    }: {
      children: ReactNode;
    }) => (
      <div data-testid="badge">
        {children}
      </div>
    ),
  }),
);

vi.mock(
  "./ToolbarExecutionButton",
  () => ({
    default: ({
      label,
      onClick,
      active,
    }: {
      label: string;
      onClick: () => void;
      active?: boolean;
    }) => (
      <button
        data-testid={`btn-${label}`}
        data-active={String(active)}
        onClick={onClick}
      >
        {label}
      </button>
    ),
  }),
);

describe(
  "ExecutionToolbar",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      mockExecutionAction =
        EXECUTION_ACTION.IDLE;

      mockSelectedExecutionItem =
        {
          name: "Test Asset",
          type: "asset",
        };

      vi.stubGlobal(
        "confirm",
        vi.fn(),
      );
    });

        it("renders execution item name", () => {
      render(
        <ExecutionToolbar />,
      );

      expect(
        screen.getByText(
          "Test Asset",
        ),
      ).toBeInTheDocument();
    });

    it("renders badge with type", () => {
      render(
        <ExecutionToolbar />,
      );

      expect(
        screen.getByTestId(
          "badge",
        ),
      ).toHaveTextContent(
        "ASSET",
      );
    });

    it("does not render badge when type is undefined", () => {
  mockSelectedExecutionItem =
    {
      name: "Test Asset",
    };

  render(
    <ExecutionToolbar />,
  );

  expect(
    screen.queryByTestId(
      "badge",
    ),
  ).not.toBeInTheDocument();
});


    it("handles execute action", () => {
      render(
        <ExecutionToolbar />,
      );

      fireEvent.click(
        screen.getByTestId(
          "btn-Execute",
        ),
      );

      expect(
        mockSetExecutionAction,
      ).toHaveBeenCalledWith(
        EXECUTION_ACTION.EXECUTE,
      );

      expect(
        confirm,
      ).toHaveBeenCalledWith(
        "Start Executing ?",
      );
    });

    it("handles pause action", () => {
      render(
        <ExecutionToolbar />,
      );

      fireEvent.click(
        screen.getByTestId(
          "btn-Pause",
        ),
      );

      expect(
        mockSetExecutionAction,
      ).toHaveBeenCalledWith(
        EXECUTION_ACTION.PAUSE,
      );

      expect(
        confirm,
      ).toHaveBeenCalledWith(
        "Pause execution ?",
      );
    });

    it("handles delete action", () => {
      vi.useFakeTimers();

      render(
        <ExecutionToolbar />,
      );

      fireEvent.click(
        screen.getByTestId(
          "btn-Delete",
        ),
      );

      expect(
        mockSetExecutionAction,
      ).toHaveBeenCalledWith(
        EXECUTION_ACTION.DELETE,
      );

      expect(
        confirm,
      ).toHaveBeenCalledWith(
        "Delete Workflow ?",
      );

      vi.advanceTimersByTime(
        1000,
      );

      expect(
        mockSetExecutionAction,
      ).toHaveBeenCalledWith(
        EXECUTION_ACTION.IDLE,
      );

      vi.useRealTimers();
    });

    it("shows execute as active", () => {
      mockExecutionAction =
        EXECUTION_ACTION.EXECUTE;

      render(
        <ExecutionToolbar />,
      );

      expect(
        screen.getByTestId(
          "btn-Execute",
        ),
      ).toHaveAttribute(
        "data-active",
        "true",
      );
    });

    it("shows pause as active", () => {
      mockExecutionAction =
        EXECUTION_ACTION.PAUSE;

      render(
        <ExecutionToolbar />,
      );

      expect(
        screen.getByTestId(
          "btn-Pause",
        ),
      ).toHaveAttribute(
        "data-active",
        "true",
      );
    });

    it("shows delete as active", () => {
      mockExecutionAction =
        EXECUTION_ACTION.DELETE;

      render(
        <ExecutionToolbar />,
      );

      expect(
        screen.getByTestId(
          "btn-Delete",
        ),
      ).toHaveAttribute(
        "data-active",
        "true",
      );
    });

    it("navigates to workflow page", () => {
      render(
        <ExecutionToolbar />,
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name:
              "Analysis Templates",
          },
        ),
      );

      expect(
        mockNavigate,
      ).toHaveBeenCalledWith(
        ROUTES.WORKFLOW,
      );
    });

    it("renders when selectedExecutionItem is undefined", () => {
  mockSelectedExecutionItem =
    undefined;

  render(
    <ExecutionToolbar />,
  );

  expect(
    screen.getByRole("button", {
      name: "Analysis Templates",
    }),
  ).toBeInTheDocument();
});

  },
);