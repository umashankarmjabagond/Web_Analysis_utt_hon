import { render, screen } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import WorkflowBuilder from "./WorkflowBuilder";

const mockProvider = vi.fn();
const mockCanvas = vi.fn();

vi.mock("@xyflow/react", () => ({
  ReactFlowProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    mockProvider();

    return (
      <div data-testid="react-flow-provider">
        {children}
      </div>
    );
  },
}));

vi.mock("./components/Canvas", () => ({
  default: () => {
    mockCanvas();

    return (
      <div data-testid="canvas">
        Canvas
      </div>
    );
  },
}));

describe("WorkflowBuilder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders ReactFlowProvider", () => {
    render(<WorkflowBuilder />);

    expect(
      screen.getByTestId(
        "react-flow-provider",
      ),
    ).toBeInTheDocument();
  });

  it("renders Canvas", () => {
    render(<WorkflowBuilder />);

    expect(
      screen.getByTestId(
        "canvas",
      ),
    ).toBeInTheDocument();
  });

  it("renders provider exactly once", () => {
    render(<WorkflowBuilder />);

    expect(
      mockProvider,
    ).toHaveBeenCalledTimes(1);
  });

  it("renders canvas exactly once", () => {
    render(<WorkflowBuilder />);

    expect(
      mockCanvas,
    ).toHaveBeenCalledTimes(1);
  });

  it("places Canvas inside ReactFlowProvider", () => {
    render(<WorkflowBuilder />);

    const provider =
      screen.getByTestId(
        "react-flow-provider",
      );

    expect(
      provider,
    ).toContainElement(
      screen.getByTestId(
        "canvas",
      ),
    );
  });

  it("renders outer layout container", () => {
    const { container } =
      render(
        <WorkflowBuilder />,
      );

    expect(
      container.querySelector(
        ".flex.h-full.min-h-0.flex-col",
      ),
    ).toBeInTheDocument();
  });

  it("renders inner layout container", () => {
    const { container } =
      render(
        <WorkflowBuilder />,
      );

    expect(
      container.querySelector(
        ".flex.flex-1.min-h-0.overflow-hidden",
      ),
    ).toBeInTheDocument();
  });
});