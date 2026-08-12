import { render, screen } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DashboardContent from "./DashboardContent";

const mockUseParams = vi.fn();
const mockTemplateExecution = vi.fn();

vi.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
}));

vi.mock("./Dashboard", () => ({
  default: () => (
    <div data-testid="dashboard">
      Dashboard
    </div>
  ),
}));

vi.mock(
  "../analysis/template-execution",
  () => ({
    default: (props: {
      plant: string;
      template: string;
      itemId?: string;
    }) => {
      mockTemplateExecution(props);

      return (
        <div data-testid="template-execution">
          Template Execution
        </div>
      );
    },
  }),
);

describe("DashboardContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    "renders Dashboard when template is undefined",
    () => {
      mockUseParams.mockReturnValue(
        {
          plant: "Plant1",
          itemId: "Item1",
        },
      );

      render(
        <DashboardContent />,
      );

      expect(
        screen.getByTestId(
          "dashboard",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId(
          "template-execution",
        ),
      ).not.toBeInTheDocument();
    },
  );

  it(
    "renders TemplateExecution when template exists",
    () => {
      mockUseParams.mockReturnValue(
        {
          plant: "Plant1",
          template:
            "Template1",
          itemId: "Item1",
        },
      );

      render(
        <DashboardContent />,
      );

      expect(
        screen.getByTestId(
          "template-execution",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId(
          "dashboard",
        ),
      ).not.toBeInTheDocument();
    },
  );

  it(
    "passes correct props to TemplateExecution",
    () => {
      mockUseParams.mockReturnValue(
        {
          plant: "Plant1",
          template:
            "Template1",
          itemId: "Item1",
        },
      );

      render(
        <DashboardContent />,
      );

      expect(
        mockTemplateExecution,
      ).toHaveBeenCalled();

      expect(
        mockTemplateExecution
          .mock.calls[0][0],
      ).toEqual({
        plant: "Plant1",
        template:
          "Template1",
        itemId: "Item1",
      });
    },
  );

  it(
    "passes undefined itemId when itemId is not present",
    () => {
      mockUseParams.mockReturnValue(
        {
          plant: "Plant1",
          template:
            "Template1",
        },
      );

      render(
        <DashboardContent />,
      );

      expect(
        mockTemplateExecution
          .mock.calls[0][0],
      ).toEqual({
        plant: "Plant1",
        template:
          "Template1",
        itemId: undefined,
      });
    },
  );
});