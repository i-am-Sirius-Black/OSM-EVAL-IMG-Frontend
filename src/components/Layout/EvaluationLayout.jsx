// import Toolbar from '../AnnotationTools/Toolbar';

// import EvaluationPanel from '../EvaluationPanel/EvaluationPanel';
// import useAnnotations from '../../hooks/useAnnotations';
// import { useState } from 'react';
// import PDFViewer from '../PdfViewer/PdfViewer';
// import ImageViewer from '../PdfViewer/ImageViewer';
// import { useUserIP } from '../../hooks/ShowUserIP';

// function EvaluationLayout() {
//   const {
//     annotations,
//     selectedTool,
//     setSelectedTool,
//     handleAnnotate,
//     handleRemoveAnnotation,
//     handleRemoveLastAnnotation,
//     handleUpdateAnnotation,
//   } = useAnnotations();

//   // Placeholder marks for evaluation panel
//   const [marks, setMarks] = useState({});

//   const ip =useUserIP();

//   return (
//     <div className="grid grid-rows-[auto_1fr] h-screen">
//       {/* Header (minimal for now) */}
//       <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
//         <h1 className="text-lg font-semibold text-gray-800">OSM Evaluation</h1>
//         {ip&&(<h2 className='text-xs'>IP Address: <span className="font-semibold">{ip}</span></h2> )}
//       </div>

//       {/* Main Content */}
//       <div className="grid grid-cols-[5%_70%_25%] h-full overflow-hidden">
//         {/* Toolbar */}
//         <div className="bg-white border-r border-gray-200 flex flex-col items-center py-4">
//           <Toolbar
//             selectedTool={selectedTool}
//             setSelectedTool={setSelectedTool}
//             handleRemoveLastAnnotation={handleRemoveLastAnnotation}
//           />
//         </div>

//         {/* PDF Viewer */}
//         {/* <div className="bg-gray-100 overflow-y-auto px-8 py-4">
//           <PDFViewer
//             pdfUrl="http://172.18.18.223:3000/api/copies/pdf-stream?copyId=44054016"
//             annotations={annotations}
//             selectedTool={selectedTool}
//             handleAnnotate={handleAnnotate}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//           />
//         </div> */}

//         {/* Image Viewer */}
//         <div className="bg-gray-100 overflow-y-auto px-8 py-4">
//           <ImageViewer
//             copyId="123"
//             annotations={annotations}
//             selectedTool={selectedTool}
//             handleAnnotate={handleAnnotate}
//             handleRemoveAnnotation={handleRemoveAnnotation}
//             handleUpdateAnnotation={handleUpdateAnnotation}
//           />
//         </div>

//         {/* Evaluation Panel */}
//         <div className="bg-white border-l border-gray-200 p-4 flex flex-col">
//           <EvaluationPanel marks={marks} setMarks={setMarks} annotations={annotations} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EvaluationLayout;



//?v1.1 seprating out the logic of the drawing annotations

import Toolbar from '../AnnotationTools/Toolbar';
import EvaluationPanel from '../EvaluationPanel/EvaluationPanel';
import useAnnotations from '../../hooks/useAnnotations';
import { useState } from 'react';
import ImageViewer from '../PdfViewer/ImageViewer';
import { useUserIP } from '../../hooks/ShowUserIP';
import { saveAnnotations } from '../../services/annotationService';

function EvaluationLayout() {
  const {
    annotations,
    selectedTool,
    setSelectedTool,
    handleAnnotate,
    handleDrawAnnotation, // New draw annotation handler
    handleRemoveAnnotation,
    handleRemoveLastAnnotation,
    handleUpdateAnnotation,
  } = useAnnotations();

  // Placeholder marks for evaluation panel
  const [marks, setMarks] = useState({});
  const [copyId, setCopyId] = useState("123"); // Placeholder for copyId, replace with actual value
  const ip = useUserIP();

  const handleSaveAnnotation = async () => {
    try {
      const response = await saveAnnotations(copyId, annotations);
      
      if(response.data.success){
        if (response.status === 201) {
          console.log("Annotations saved successfully");
        }else if (response.status === 200) {
          console.log("Annotations updated successfully");
        }
      }else {
        console.error("Failed to save annotations");
      }

      alert(response.data.message || "Annotations saved successfully");

    } catch (error) {
      console.error("Error saving annotations:", error);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr] h-screen">
      {/* Header (minimal for now) */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">OSM Evaluation</h1>
        {ip && (<h2 className='text-xs'>IP Address: <span className="font-semibold">{ip}</span></h2>)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[5%_70%_25%] h-full overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-r border-gray-200 flex flex-col items-center py-4">
          <Toolbar
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            handleRemoveLastAnnotation={handleRemoveLastAnnotation}
          />
        </div>

        {/* Image Viewer */}
        <div className="bg-gray-100 overflow-y-auto px-8 py-4">
          <ImageViewer
            copyId={copyId}
            annotations={annotations}
            selectedTool={selectedTool}
            handleAnnotate={handleAnnotate}
            handleDrawAnnotation={handleDrawAnnotation} // Pass the new draw handler
            handleRemoveAnnotation={handleRemoveAnnotation}
            handleUpdateAnnotation={handleUpdateAnnotation}
          />
        </div>

        {/* Evaluation Panel */}
        <div className="bg-white border-l border-gray-200 p-4 flex flex-col">
          <EvaluationPanel marks={marks} setMarks={setMarks} annotations={annotations} saveAnnotations={handleSaveAnnotation}/>
        </div>
        
      </div>
    </div>
  );
}

export default EvaluationLayout;