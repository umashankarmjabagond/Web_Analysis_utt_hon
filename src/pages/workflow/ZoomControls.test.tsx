import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useReactFlow, useViewport } from "@xyflow/react";
import ZoomControls from "./components/ZoomControls";

vi.mock("@xyflow/react", () => ({
  useReactFlow: vi.fn(),
  useViewport: vi.fn(),
}));

const zoomInMock = vi.fn();
const zoomOutMock = vi.fn();
const zoomToMock = vi.fn();

describe("ZoomControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useReactFlow).mockReturnValue({
      zoomIn: zoomInMock,
      zoomOut: zoomOutMock,
      zoomTo: zoomToMock,
    } as unknown as ReturnType<typeof useReactFlow>);

    vi.mocked(useViewport).mockReturnValue({
      zoom: 1,
      x: 0,
      y: 0,
    });
  });

  it("renders zoom controls", () => {
    render(<ZoomControls />);

    expect(
      screen.getByRole("button", { name: "Zoom out" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reset zoom" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument();
  });

  it("displays the current zoom percentage", () => {
    render(<ZoomControls />);

    expect(
      screen.getByRole("button", { name: "Reset zoom" }),
    ).toHaveTextContent("100%");
  });

  it("calls zoomOut when zoom out button is clicked", async () => {
    const user = userEvent.setup();

    render(<ZoomControls />);

    await user.click(screen.getByRole("button", { name: "Zoom out" }));

    expect(zoomOutMock).toHaveBeenCalledTimes(1);
  });

  it("calls zoomIn when zoom in button is clicked", async () => {
    const user = userEvent.setup();

    render(<ZoomControls />);

    await user.click(screen.getByRole("button", { name: "Zoom in" }));

    expect(zoomInMock).toHaveBeenCalledTimes(1);
  });

  it("resets zoom to 100% when percentage button is clicked", async () => {
    const user = userEvent.setup();

    render(<ZoomControls />);

    await user.click(screen.getByRole("button", { name: "Reset zoom" }));

    expect(zoomToMock).toHaveBeenCalledTimes(1);
    expect(zoomToMock).toHaveBeenCalledWith(1);
  });

  it("rounds the zoom value to the nearest percentage", () => {
    vi.mocked(useViewport).mockReturnValue({
      zoom: 1.256,
      x: 0,
      y: 0,
    });

    render(<ZoomControls />);

    expect(
      screen.getByRole("button", { name: "Reset zoom" }),
    ).toHaveTextContent("126%");
  });

  it("displays zoom percentage below 100%", () => {
    vi.mocked(useViewport).mockReturnValue({
      zoom: 0.75,
      x: 0,
      y: 0,
    });

    render(<ZoomControls />);

    expect(
      screen.getByRole("button", { name: "Reset zoom" }),
    ).toHaveTextContent("75%");
  });
});
