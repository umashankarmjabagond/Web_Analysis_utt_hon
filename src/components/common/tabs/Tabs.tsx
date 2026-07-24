import { NavLink } from "react-router-dom";
import type { TabsProps } from "../../../types/commonTypes";

const variants = {
  primary: {
    active: "border-tab-active-border text-tab-active-text",
    inactive:
      "border-transparent text-tab-inactive-text hover:border-tab-active-border hover:text-tab-active-text",
  },

  secondary: {
    active: "border-secondary text-tab-active-text",
    inactive:
      "border-transparent text-tab-inactive-text hover:border-secondary hover:text-secondary",
  },
};

export function Tabs({
  items,
  activeTab,
  onTabChange,
  variant = "primary",
}: TabsProps) {
  const activeItem = items.find((item) => item.id === activeTab);
  const ActiveComponent = activeItem?.component;

  const isNavigationTabs = items.some((item) => item.path);

  const selectedVariant = variants[variant];

  return (
    <>
      <div className="flex flex-wrap">
        {items.map((item) => {
          if (item.path) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                    isActive ? selectedVariant.active : selectedVariant.inactive
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          }

          return (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => onTabChange?.(item.id)}
              className={`px-4 py-2 cursor-pointer border-b-2 transition-colors ${
                activeTab === item.id
                  ? selectedVariant.active
                  : selectedVariant.inactive
              } ${item.disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {!isNavigationTabs && ActiveComponent && (
        <div className="mt-4 h-full">
          <ActiveComponent />
        </div>
      )}
    </>
  );
}
