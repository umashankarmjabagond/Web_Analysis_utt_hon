import { NavLink } from "react-router-dom";
import { Home, LayoutGrid } from "lucide-react";
import { ROUTES } from "../../../constants/routes/routesConstant";
import { cn } from "../../../utils/utils";

const menus = [
  {
    name: "Workflow",
    path: ROUTES.WORKFLOW,
    icon: Home,
  },
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: LayoutGrid,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-16 rounded-md bg-surface">
      <nav className="flex flex-col items-center gap-1 p-2">
        {menus.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className="relative flex h-10 w-full items-center justify-center p-2"
            title={name}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-1 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-[1px] bg-selection-indicator" />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-foreground" : "text-foreground-secondary",
                  )}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
