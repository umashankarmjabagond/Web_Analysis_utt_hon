import React from "react";
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

import BaseNode from "./BaseNode";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));


const mockHandleNodeSelection =
  vi.fn();

let mockSelectedNodeIds: string[] =
  [];

vi.mock(
  "../../../../../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore:
      vi.fn((selector) =>
        selector({
          selectedNodeIds:
            mockSelectedNodeIds,
        }),
      ),
  }),
);

vi.mock(
  "../../../../../hooks/useWorkflowInteractions",
  () => ({
    useWorkflowCanvasInteractions:
      () => ({
        handleNodeSelection:
          mockHandleNodeSelection,
      }),
  }),
);

vi.mock(
  "../../../../../components/common/tooltip/Tooltip",
  () => ({
    default: ({
      children,
      content,
      disabled,
    }: {
      children: React.ReactNode;
      content?: string | null;
      disabled?: boolean;
    }) => (
      <div
        data-testid="tooltip"
        data-content={
          content ?? ""
        }
        data-disabled={String(
          disabled,
        )}
      >
        {children}
      </div>
    ),
  }),
);

vi.mock(
  "../../../../../components/forms/checkbox/CheckBox",
  () => ({
    default: ({
      onChange,
      onClick,
      checked,
    }: {
      onChange?: () => void;
      onClick?: (
        e: {
          stopPropagation: () => void;
        },
      ) => void;
      checked?: boolean;
    }) => (
      <>
        <button
          data-testid="checkbox-change"
          data-checked={String(
            checked,
          )}
          onClick={onChange}
        >
          change
        </button>

        <button
          data-testid="checkbox-click"
          onClick={() =>
            onClick?.({
              stopPropagation:
                vi.fn(),
            })
          }
        >
          click
        </button>
      </>
    ),
  }),
);

vi.mock(
  "@xyflow/react",
  async () => {
    const actual =
      await vi.importActual(
        "@xyflow/react",
      );

    return {
      ...actual,

      Position: {
        Top: "top",
        Right: "right",
        Bottom: "bottom",
        Left: "left",
      },

      Handle: ({
        id,
        type,
      }: {
        id: string;
        type: string;
      }) => (
        <div
          data-testid="handle"
          data-id={id}
          data-type={type}
        />
      ),
    };
  },
);

vi.mock(
  "./nodeConfig",
  () => ({
    NODE_TYPES: {
      testNode: {
        icon: ({
          size,
        }: {
          size?: number;
        }) => (
          <svg
            data-testid="node-icon"
            data-size={size}
          />
        ),
      },
    },
  }),
);

const createNode = (
  status:
    | "default"
    | "success"
    | "warning"
    | "error" = "default",
) =>
  ({
    id: "node-1",
    type: "testNode",
    data: {
      label: "Test Node",
      status,
    },
    dragging: false,
    zIndex: 0,
    selectable: true,
    deletable: true,
    selected: false,
    draggable: true,
  }) as Parameters<
    typeof BaseNode
  >[0];

describe("BaseNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedNodeIds = [];
  });

  it("renders label", () => {
    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getByText(
        "Test Node",
      ),
    ).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getByTestId(
        "node-icon",
      ),
    ).toBeInTheDocument();
  });

  it("renders checkbox", () => {
    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getByTestId(
        "checkbox-change",
      ),
    ).toBeInTheDocument();
  });

  it("calls handleNodeSelection when checkbox changes", () => {
    render(
      <BaseNode
        {...createNode(
          "success",
        )}
      />,
    );

    fireEvent.click(
      screen.getByTestId(
        "checkbox-change",
      ),
    );

    expect(
      mockHandleNodeSelection,
    ).toHaveBeenCalledWith(
      "node-1",
      "success",
    );
  });

  it("renders handles", () => {
    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getAllByTestId(
        "handle",
      ),
    ).toHaveLength(8);
  });

  it("marks checkbox checked when node is selected", () => {
    mockSelectedNodeIds = [
      "node-1",
    ];

    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getByTestId(
        "checkbox-change",
      ),
    ).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  it("disables tooltip when node is selected", () => {
    mockSelectedNodeIds = [
      "node-1",
    ];

    render(
      <BaseNode
        {...createNode()}
      />,
    );

    expect(
      screen.getByTestId(
        "tooltip",
      ),
    ).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

it("shows warning tooltip message", () => {
  render(
    <BaseNode
      {...createNode(
        "warning",
      )}
    />,
  );

  expect(
    screen.getByTestId(
      "tooltip",
    ),
  ).toHaveAttribute(
    "data-content",
    "NODE_WARNING_MESSAGE",
  );
});

it("shows error tooltip message", () => {
  render(
    <BaseNode
      {...createNode(
        "error",
      )}
    />,
  );

  expect(
    screen.getByTestId(
      "tooltip",
    ),
  ).toHaveAttribute(
    "data-content",
    "NODE_ERROR_MESSAGE",
  );
})