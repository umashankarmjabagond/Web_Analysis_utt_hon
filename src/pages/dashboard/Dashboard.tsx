import { useNavigate } from "react-router-dom";
import Dialog from "../../components/common/dialogue/Dialog";
import { useState } from "react";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex justify-end p-2">
      <button
        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
        onClick={() => setIsOpen(true)}
      >
        This is the engine click here to go to workflow builder
      </button>
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
    </div>
  );
};

export default Dashboard;
