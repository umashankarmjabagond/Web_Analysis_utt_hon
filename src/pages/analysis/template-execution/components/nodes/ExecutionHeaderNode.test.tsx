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

import ExecutionHeaderNode from "./ExecutionHeaderNode";

const mockToggleSelectedRow =
  vi.fn();

const mockStopPropagation =
  vi.fn();

let mockSelectedRowIds: string[] =
  [];

vi.mock(
  "../../../../../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore:
      vi.fn((selector) =>
        selector({
          selectedRowIds:
            mockSelectedRowIds,
          toggleSelectedRow:
            mockToggleSelectedRow,
        }),
      ),
  }),
);

vi.mock(
  "../../../../../components/forms/checkbox/CheckBox",
  () => ({
    default: ({
      checked,
      onChange,
      onClick,
    }: {
      checked?: boolean;
      onChange?: () => void;
      onClick?: (
        e: {
          stopPropagation: () => void;
        },
      ) => void;
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
                mockStopPropagation,
            })
          }
        >
          click
        </button>
      </>
    ),
  }),
);

const createNode = () =>
  ({
    data: {
      itemId: "ASSET_001",
    },
    dragging: false,
    zIndex: 0,
    selectable: true,
    deletable: true,
    selected: false,
    draggable: true,
    id: "header-1",
    type: "executionHeader",
  } as Parameters<
    typeof ExecutionHeaderNode
  >[0]);

describe(
  "ExecutionHeaderNode",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      mockSelectedRowIds = [];
    });

    it("renders itemId", () => {
      render(
        <ExecutionHeaderNode
          {...createNode()}
        />,
      );

      expect(
        screen.getByText(
          "ASSET_001",
        ),
      ).toBeInTheDocument();
    });

    it("renders unchecked checkbox", () => {
      render(
        <ExecutionHeaderNode
          {...createNode()}
        />,
      );

      expect(
        screen.getByTestId(
          "checkbox-change",
        ),
      ).toHaveAttribute(
        "data-checked",
        "false",
      );
    });

    it("renders checked checkbox when row is selected", () => {
      mockSelectedRowIds = [
        "ASSET_001",
      ];

      render(
        <ExecutionHeaderNode
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

    it("calls toggleSelectedRow on checkbox change", () => {
      render(
        <ExecutionHeaderNode
          {...createNode()}
        />,
      );

      fireEvent.click(
        screen.getByTestId(
          "checkbox-change",
        ),
      );

      expect(
        mockToggleSelectedRow,
      ).toHaveBeenCalledWith(
        "ASSET_001",
      );
    });

    it("calls stopPropagation on checkbox click", () => {
      render(
        <ExecutionHeaderNode
          {...createNode()}
        />,
      );

      fireEvent.click(
        screen.getByTestId(
          "checkbox-click",
        ),
      );

      expect(
        mockStopPropagation,
      ).toHaveBeenCalled();
    });
  },
);