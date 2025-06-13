import { useState } from "react";
import EvaluatorStatus from "./Dashboard/EvaluatorStatus";
import AssignSubjects from "./Dashboard/AssignSubjects";
import AssignedStatus from "./Dashboard/AssignedStatus";
import Evaluators from "./Dashboard/Evaluators";

const DashboardPanel = () => {
  const [activeTab, setActiveTab] = useState("evaluatorStatus");

  const renderTabContent = () => {
    switch (activeTab) {
      case "evaluators":
        return <Evaluators />;
      case "evaluatorStatus":
        return <EvaluatorStatus />;
      case "assign":
        return <AssignSubjects />;
      case "assigned-status":
        return <AssignedStatus />;
      default:
        return <EvaluatorStatus />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("evaluatorStatus")}
          className={`${
            activeTab === "evaluatorStatus"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Evaluator Status
        </button>
        <button
          onClick={() => setActiveTab("evaluators")}
          className={`${
            activeTab === "evaluators"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Evaluators
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`${
            activeTab === "assign"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Assign Subjects
        </button>
        <button
          onClick={() => setActiveTab("assigned-status")}
          className={`${
            activeTab === "assigned-status"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Assignment Status
        </button>
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DashboardPanel;