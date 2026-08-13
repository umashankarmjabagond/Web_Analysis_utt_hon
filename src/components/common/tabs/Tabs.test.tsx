import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test";

import { Tabs } from "./Tabs";

const FirstComponent = () => <div>First Component</div>;
const SecondComponent = () => <div>Second Component</div>;

const defaultItems = [
  {
    id: "tab1",
    label: "Tab One",
    component: FirstComponent,
  },
  {
    id: "tab2",
    label: "Tab Two",
    component: SecondComponent,
  },
];

describe("Tabs", () => {
  it("renders all tabs", () => {
    render(<Tabs items={defaultItems} activeTab="tab1" />);

    expect(screen.getByRole("button", { name: "Tab One" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Tab Two" })).toBeInTheDocument();
  });

  it("renders active tab content", () => {
    render(<Tabs items={defaultItems} activeTab="tab1" />);

    expect(screen.getByText("First Component")).toBeInTheDocument();

    expect(screen.queryByText("Second Component")).not.toBeInTheDocument();
  });

  it("calls onTabChange when another tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <Tabs items={defaultItems} activeTab="tab1" onTabChange={onTabChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Tab Two" }));

    expect(onTabChange).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith("tab2");
  });

  it("does not call onTabChange for disabled tab", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    render(
      <Tabs
        items={[
          ...defaultItems,
          {
            id: "tab3",
            label: "Disabled",
            disabled: true,
            component: FirstComponent,
          },
        ]}
        activeTab="tab1"
        onTabChange={onTabChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Disabled" }));

    expect(onTabChange).not.toHaveBeenCalled();
  });

  it("does not render content when renderContent is false", () => {
    render(
      <Tabs items={defaultItems} activeTab="tab1" renderContent={false} />,
    );

    expect(screen.queryByText("First Component")).not.toBeInTheDocument();
  });

  it("renders navigation tabs", () => {
    const navItems = [
      {
        id: "workflow",
        label: "Workflow",
        path: "/workflow",
      },
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
      },
    ];

    render(<Tabs items={navItems} />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/workflow");
    expect(links[1]).toHaveAttribute("href", "/dashboard");
  });

  it("does not render component for navigation tabs", () => {
    const navItems = [
      {
        id: "workflow",
        label: "Workflow",
        path: "/workflow",
        component: FirstComponent,
      },
    ];

    render(<Tabs items={navItems} />);

    expect(screen.queryByText("First Component")).not.toBeInTheDocument();
  });
});
