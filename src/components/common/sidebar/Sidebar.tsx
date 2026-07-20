import { NavLink } from "react-router-dom";
import { ROUTES } from "../../../constants/routes/routesConstant";

const menus = [
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "📊",
  },
  {
    name: "Workflow",
    path: ROUTES.WORKFLOW,
    icon: "🛠",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-16 border-r border-neutral-700 bg-[#252525]">
      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          className={({ isActive }) =>
            `flex h-16 items-center justify-center ${
              isActive ? "bg-blue-600" : "hover:bg-neutral-700"
            }`
          }
        >
          {menu.icon}
        </NavLink>
      ))}
    </aside>
  );
}
