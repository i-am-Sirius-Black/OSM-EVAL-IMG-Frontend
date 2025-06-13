// import { useState } from "react";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import UploadPaper from "./Fragmentation/UploadPaper";
// import QuestionFragmentation from "./Fragmentation/QuestionFragmentation";
// import EditFragmentation from "./Fragmentation/EditFragmentation";

// const FragmentationPanel = () => {
//   const [activeTab, setActiveTab] = useState("uploadPaper");

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "uploadPaper":
//         return <UploadPaper />;
//       case "questionStructure":
//         return <QuestionFragmentation />;
//       case "editFragmentation":
//         return <EditFragmentation />;  
//       default:
//         return <UploadPaper />;
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Tab Navigation */}
//       <nav className="flex space-x-8 border-b border-gray-200 mb-6">
//         <button
//           onClick={() => setActiveTab("uploadPaper")}
//           className={`${
//             activeTab === "uploadPaper"
//               ? "border-blue-500 text-gray-900"
//               : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//           } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//         >
//           <CloudUploadIcon className="mr-2" />
//           <span>Upload Paper</span>
//         </button>
//         <button
//           onClick={() => setActiveTab("questionStructure")}
//           className={`${
//             activeTab === "questionStructure"
//               ? "border-blue-500 text-gray-900"
//               : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//           } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//         >
//           Paper Fragmentation
//         </button>
//         <button
//           onClick={() => setActiveTab("editFragmentation")}
//           className={`${
//             activeTab === "editFragmentation"
//               ? "border-blue-500 text-gray-900"
//               : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
//           } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
//         >
//           Edit Fragmentation
//         </button>
//       </nav>

//       {/* Tab Content */}
//       <div className="flex-1 overflow-y-auto">
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default FragmentationPanel;


//?v2 with QuestionImageUpload tab 

import { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import UploadPaper from "./Fragmentation/UploadPaper";
import QuestionFragmentation from "./Fragmentation/QuestionFragmentation";
import EditFragmentation from "./Fragmentation/EditFragmentation";
import QuestionImageManager from "./Fragmentation/QuestionImageManager";

const FragmentationPanel = () => {
  const [activeTab, setActiveTab] = useState("uploadPaper");

  const renderTabContent = () => {
    switch (activeTab) {
      case "uploadPaper":
        return <UploadPaper />;
      case "questionStructure":
        return <QuestionFragmentation />;
      case "editFragmentation":
        return <EditFragmentation />;
      case "questionImages":
        return <QuestionImageManager />;
      default:
        return <UploadPaper />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("uploadPaper")}
          className={`${
            activeTab === "uploadPaper"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          <CloudUploadIcon className="mr-2" />
          <span>Upload Paper</span>
        </button>
        <button
          onClick={() => setActiveTab("questionStructure")}
          className={`${
            activeTab === "questionStructure"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Paper Fragmentation
        </button>
        <button
          onClick={() => setActiveTab("editFragmentation")}
          className={`${
            activeTab === "editFragmentation"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          Edit Fragmentation
        </button>
        <button
          onClick={() => setActiveTab("questionImages")}
          className={`${
            activeTab === "questionImages"
              ? "border-blue-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          } inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium`}
        >
          <ImageIcon className="mr-2" />
          <span>Question Images</span>
        </button>
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FragmentationPanel;