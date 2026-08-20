import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExecutionRowNode from "./ExecutionRowNode";

const mockToggleSelectedRow = vi.fn();
let mockSelectedRowIds: string[] = [];

vi.mock("../../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn((selector) =>
    selector({
      selectedRowIds: mockSelectedRowIds,
      toggleSelectedRow: mockToggleSelectedRow,
    }),
  ),
}));

vi.mock("../../../../../components/forms/checkbox/CheckBox", () => ({
  default: ({
    checked,
    onChange,
    onClick,
  }: {
    checked?: boolean;
    onChange?: () => void;
    onClick?: (event: { stopPropagation: () => void }) => void;
  }) => (
    <input
      data-testid="checkbox"
      type="checkbox"
      checked={checked}
      onClick={onClick}
      onChange={onChange}
      readOnly
    />
  ),
}));

const createRowNode = (
  itemId = "ROW-101",
): Parameters<typeof ExecutionRowNode>[0] => ({
  id: "row-1",
  type: "executionRow",
  data: {
    itemId,
  },
  dragging: false,
  zIndex: 0,
  selectable: true,
  deletable: true,
  selected: false,
  draggable: true,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
});

describe("Execution row node", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectedRowIds = [];
  });

  it("renders unchecked checkbox when row is not selected", () => {
    render(<ExecutionRowNode {...createRowNode()} />);

    expect(screen.getByTestId("checkbox")).not.toBeChecked();
  });

  it("renders checked checkbox when row is selected", () => {
    mockSelectedRowIds = ["ROW-101"];

    render(<ExecutionRowNode {...createRowNode()} />);

    expect(screen.getByTestId("checkbox")).toBeChecked();
  });

  it("toggles the row selection when checkbox changes", () => {
    render(<ExecutionRowNode {...createRowNode()} />);

    fireEvent.click(screen.getByTestId("checkbox"));

    expect(mockToggleSelectedRow).toHaveBeenCalledWith("ROW-101");
  });

  it("renders default styles when row is not selected", () => {
    render(<ExecutionRowNode {...createRowNode()} />);

    expect(screen.getByTestId("execution-row")).toHaveClass(
      "border-[#454545]",
      "bg-[#1B1B1B]",
    );
  });

  it("renders selected styles when row is selected", () => {
    mockSelectedRowIds = ["ROW-101"];

    render(<ExecutionRowNode {...createRowNode()} />);

    expect(screen.getByTestId("execution-row")).toHaveClass(
      "border-[#4FB3FF]",
      "bg-[#4FB3FF29]",
    );
  });
});
