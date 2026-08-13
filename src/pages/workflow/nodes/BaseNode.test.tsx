import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import BaseNode from "./BaseNode";


vi.mock("@xyflow/react", () => ({
  Handle: ({
    type,
  }: {
    type: string;
  }) => (
    <div
      data-testid={`handle-${type}`}
    />
  ),

  Position: {
    Left: "left",
    Right: "right",
  },
}));

vi.mock(
  "../workflowPanelData ",
  () => {
    const MockIcon = ({
      className,
    }: {
      className?: string;
    }) => (
      <svg
        data-testid="catalog-icon"
        className={className}
      />
    );

    return {
  attributeCatalogSections: [
    {
      items: [
        {
          id: "catalog-1",
          icon: MockIcon,
        },
        {
          id: "catalog-2",
          icon: undefined,
        },
      ],
    },
  ],
};
  },
);

const mockElement = {
  Name: "Test Element",
  ParentNames: [],
  elementType: "DataSource",
}

describe("BaseNode", () => {
  it("renders node label", () => {
    render(
  <BaseNode
    data={{
      label: "My Node",
      element: mockElement,
    }}
  />,
);

    expect(
      screen.getByText("My Node"),
    ).toBeInTheDocument();
  });

  it("renders target handle", () => {
  render(
    <BaseNode
      data={{
        label: "Node",
        element: mockElement,
      }}
    />,
  );

    expect(
      screen.getByTestId(
        "handle-target",
      ),
    ).toBeInTheDocument();
  });

  it("renders source handle", () => {
  render(
    <BaseNode
      data={{
        label: "Node",
        element: mockElement,
      }}
    />,
  );

    expect(
      screen.getByTestId(
        "handle-source",
      ),
    ).toBeInTheDocument();
  });

  it("renders catalog icon when catalogId exists", () => {
    render(
  <BaseNode
    data={{
      label: "Node",
      catalogId: "catalog-1",
      element: mockElement,
    }}
  />,
);

    expect(
      screen.getByTestId(
        "catalog-icon",
      ),
    ).toBeInTheDocument();
  });

  it("renders fallback icon when catalogId is missing", () => {
  const { container } = render(
    <BaseNode
      data={{
        label: "Node",
        element: mockElement,
      }}
    />,
  );


    expect(
      container.querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("renders fallback icon when catalogId is unknown", () => {
  const { container } = render(
    <BaseNode
      data={{
        label: "Node",
        catalogId: "unknown",
        element: mockElement,
      }}
    />,
  );

    expect(
      container.querySelector("svg"),
    ).toBeInTheDocument();
  });

  it("applies DataSink border styling", () => {
    const { container } = render(
  <BaseNode
    data={{
      label: "Sink",
      element: {
        ...mockElement,
        elementType: "DataSink",
      },
    }}
  />,
);

    expect(
      container.innerHTML,
    ).toContain(
      "border-[#555555]",
    );
  });

  it("applies non DataSink border styling", () => {
    const { container } = render(
  <BaseNode
    data={{
      label: "Source",
      element: {
        ...mockElement,
        elementType: "DataSource",
      },
    }}
  />,
);

    expect(
      container.innerHTML,
    ).toContain(
      "border-[#36B94A]",
    );
  });

  it("handles lowercase datasink", () => {
  const { container } = render(
    <BaseNode
      data={{
        label: "Node",
        element: {
          ...mockElement,
          elementType: "datasink",
        },
      }}
    />,
  );


    expect(
      container.innerHTML,
    ).toContain(
      "border-[#555555]",
    );
  });

  it("renders datasource icon color", () => {
    render(
  <BaseNode
    data={{
      label: "Node",
      catalogId: "catalog-1",
      element: mockElement,
    }}
  />,
);

    expect(
      screen.getByTestId(
        "catalog-icon",
      ),
    ).toHaveClass(
      "text-[#45C95A]",
    );
  });

  it("renders datasink icon color", () => {
  render(
    <BaseNode
      data={{
        label: "Node",
        catalogId: "catalog-1",
        element: {
          ...mockElement,
          elementType: "DataSink",
        },
      }}
    />,
  );

  expect(
    screen.getByTestId("catalog-icon"),
  ).toHaveClass(
    "text-[#8A8A8A]",
  );
});

  it("renders datasink label color", () => {
  const { container } = render(
    <BaseNode
      data={{
        label: "Node",
        element: {
          ...mockElement,
          elementType: "DataSink",
        },
      }}
    />,
  );

    expect(
      container.innerHTML,
    ).toContain(
      "text-[#8A8A8A]",
    );
  });

  it("renders non datasink label color", () => {
  const { container } = render(
    <BaseNode
      data={{
        label: "Node",
        element: {
          ...mockElement,
          elementType: "DataSource",
        },
      }}
    />,
  );

    expect(
      container.innerHTML,
    ).toContain(
      "text-[#B8B8B8]",
    );
  });
});