import { useState } from "react";
import CheckedCopies from "./Advanced/CheckedCopies";
import RejectedCopies from "./Advanced/RejectedCopies";
import ReevaluationStats from "./Advanced/ReevaluationStats";
import ReevaluationAssignment from "./Advanced/ReevaluationAssignment";
import Stats from "./Advanced/Stats";

const AdvancedPanel = () => {
  const [activeTab, setActiveTab] = useState("copies");

  const renderTabContent = () => {
    switch (activeTab) {
      case "copies":
        return <CheckedCopies />;
      case "rejected":
        return <RejectedCopies />;
      case "reeval-stats":
        return <ReevaluationStats />;
      case "reevalAssignment":
        return <ReevaluationAssignment />;
      case "stats":
        return <Stats />;
      default:
        return <CheckedCopies />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("copies")}
          className={`${
            activeTab === "copies"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Checked Copies
        </button>
        <button
          onClick={() => setActiveTab("rejected")}
          className={`${
            activeTab === "rejected"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Rejected Copies
        </button>
        <button
          onClick={() => setActiveTab("reeval-stats")}
          className={`${
            activeTab === "reeval-stats"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Re-Evaluation
        </button>
        <button
          onClick={() => setActiveTab("reevalAssignment")}
          className={`${
            activeTab === "reevalAssignment"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Re-Evaluation Assignment
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`${
            activeTab === "stats"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Analytics
        </button>
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdvancedPanel;