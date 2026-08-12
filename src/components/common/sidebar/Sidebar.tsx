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
    <aside className="w-16 bg-surface" style={{ background: "#272727" }}>
      <nav className="flex flex-col items-center gap-1 p-2">
        {MENUS.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className="relative flex h-10 w-full items-center justify-center p-2"
            title={t(name)}
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
