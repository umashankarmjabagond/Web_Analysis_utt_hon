import { useNavigate } from "react-router-dom";

export default function DashboardPanel() {
  const navigate = useNavigate();

  const items = [
    {
      name: "Feed Water",
      route: "feed-water",
    },
    {
      name: "Power Boiler",
      route: "power-boiler",
    },
    {
      name: "Steam",
      route: "steam",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <input
          placeholder="Search..."
          className="w-full rounded bg-neutral-700 px-3 py-2 text-white"
        />
      </div>

      <div className="flex-1 overflow-auto text-white">
        {items.map((item) => (
          <button
            key={item.route}
            onClick={() => navigate(`/dashboard/${item.route}`)}
            className="w-full px-4 py-3 text-left hover:bg-neutral-700"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
