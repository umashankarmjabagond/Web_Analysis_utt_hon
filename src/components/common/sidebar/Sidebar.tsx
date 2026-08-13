import { NavLink } from "react-router-dom";
import { Home, LayoutGrid } from "lucide-react";
import { ROUTES } from "../../../constants/routes/routesConstant";
import { cn } from "../../../utils/utils";
import { useTranslation } from "react-i18next";

const MENUS = [
  {
    name: "SIDEBAR_WORKFLOW",
    path: ROUTES.WORKFLOW,
    icon: Home,
  },
  {
    name: "SIDEBAR_DASHBOARD",
    path: ROUTES.DASHBOARD,
    icon: LayoutGrid,
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="w-14 bg-surface-primary border-r border-[#383838] px-2 py-3">
      <nav className="flex flex-col items-center">
        {MENUS.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "relative flex h-10 w-full items-center justify-center",
                "transition-colors duration-150",
                isActive
                  ? "bg-[#2b2b2b] rounded-lg"
                  : "bg-transparent hover:bg-[#242424]",
              )
            }
            title={t(name)}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "h-4 w-4",
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
