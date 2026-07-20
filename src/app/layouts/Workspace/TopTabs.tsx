import { NavLink } from "react-router-dom";

const tabs = [
  {
    label: "Import Configuration File",
    path: "/#",
  },
  {
    label: "Regulatory Configuration",
    path: "/#",
  },
  {
    label: "MPC Configuration",
    path: "/#",
  },
  {
    label: "PWO Configuration",
    path: "/#",
  },
  {
    label: "Analysis Schedule",
    path: "/#",
  },
  {
    label: "Custom KPI Configuration",
    path: "/#",
  },
  {
    label: "Analysis Engine",
    path: "/workflow",
  },
];

export default function TopTabs() {
  return (
    <nav className="flex h-full items-center overflow-x-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `flex h-full items-center whitespace-nowrap border-b-2 px-6 text-sm font-medium transition-colors ${
              isActive
                ? "border-sky-500 text-white"
                : "border-transparent text-neutral-400 hover:text-white"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
