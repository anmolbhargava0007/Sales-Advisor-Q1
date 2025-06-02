
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="p-8 bg-gray-800 rounded-lg shadow-sm border border-gray-700 max-w-md text-center">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Dashboard
        </h2>
        <p className="text-gray-300 mb-6">
          Dashboard functionality coming soon.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
