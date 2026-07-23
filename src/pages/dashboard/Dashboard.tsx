import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/common/dialogue/Dialog";
import Button from "../../components/forms/button/Button";
import type { StatCardData } from "../../types/dashboardTypes";
import StatCard from "./components/StatCard";

const statCards: StatCardData[] = [
  {
    title: "TOTAL UNITS",
    chartData: [
      {
        name: "Good",
        value: 10,
      },
      {
        name: "Warning",
        value: 4,
      },
      {
        name: "Error",
        value: 3,
      },
    ],
  },

  {
    title: "MPC ASSETS",
    chartData: [
      {
        name: "Good",
        value: 154,
      },
      {
        name: "Warning",
        value: 20,
      },
      {
        name: "Error",
        value: 9,
      },
    ],
  },

  {
    title: "TOTAL CONTROLLERS",
    chartData: [
      {
        name: "Good",
        value: 300,
      },
      {
        name: "Warning",
        value: 30,
      },
      {
        name: "Error",
        value: 12,
      },
    ],
  },

  {
    title: "REGULATORY ASSETS",
    chartData: [
      {
        name: "Good",
        value: 90,
      },
      {
        name: "Warning",
        value: 30,
      },
      {
        name: "Error",
        value: 9,
      },
    ],
  },
];

export function StatusSummaryTable() {
  return (
    <div className="flex justify-end p-2">
      {/* <button
        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
        onClick={() => setIsOpen(true)}
      >
        This is the engine click here to go to workflow builder
      </button> */}
      
      <Button variant="primary" size="large" onClick={() => setIsOpen(true)}>
        This is the engine click here to go to workflow builder
      </Button>
      <br />
      <Dialog
        isOpen={isOpen}
        title="Regulatory Template"
        subtitle="Save As"
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-lg font-medium text-white">
              Template Name
            </label>

            <input
              className="w-full rounded-md border border-gray-500 bg-[#2F2F2F] px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Custom_1"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-sky-500 px-6 py-2 text-sky-400"
            >
              Cancel
            </button>

            <button
              onClick={() => navigate("/workflow")}
              className="rounded-md bg-sky-500 px-6 py-2 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    <div className="h-[392px] rounded-md border border-zinc-700 bg-[#2c2c2c] p-4">
      <h2 className="text-xs uppercase tracking-widest">
        Unit Wise Status Summary
      </h2>
    </div>
  );
}

export function WarningTable() {
  return (
    <div className="h-[420px] rounded-md border border-zinc-700 bg-[#2c2c2c] p-4">
      <h2 className="text-xs uppercase tracking-widest">
        Warning & Error Summary
      </h2>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#202020] text-white p-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-wide">Power Boiler</h1>

        <span className="rounded-full border border-sky-500 px-2 py-0.5 text-xs font-medium text-sky-400">
          AREA
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-[46%_54%] gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="w-full max-w-[320px]">
              <StatCard data={card} />
            </div>
          ))}
        </div>

        <StatusSummaryTable />
      </div>

      <div className="mt-4">
        <WarningTable />
      </div>
    </div>
  );
}
