export default function DashboardPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-neutral-700 p-4">
        <h2 className="font-semibold text-white">Assets</h2>
      </div>

      <div className="p-4">
        <input
          placeholder="Search..."
          className="w-full rounded bg-neutral-700 px-3 py-2 text-white"
        />
      </div>

      <div className="text-white flex-1 overflow-auto">
        <button className="w-full px-4 py-3 text-left hover:bg-neutral-700">
          Feed Water
        </button>

        <button className="w-full px-4 py-3 text-left hover:bg-neutral-700">
          Power Boiler
        </button>

        <button className="w-full px-4 py-3 text-left hover:bg-neutral-700">
          Steam
        </button>
      </div>
    </div>
  );
}
