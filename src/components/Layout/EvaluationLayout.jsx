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



//?v1.1 seprating out the logic of the drawing annotations (currently working)

import Toolbar from '../AnnotationTools/Toolbar';
import EvaluationPanel from '../EvaluationPanel/EvaluationPanel';
import useAnnotations from '../../hooks/useAnnotations';
import { use, useCallback, useEffect, useState } from 'react';
import ImageViewer from '../PdfViewer/ImageViewer';
import { saveAnnotations } from '../../services/annotationService';
import { useParams } from 'react-router-dom';
import evaluationService from '../../services/evaluationService';

function EvaluationLayout() {

  const { copyId: urlCopyId } = useParams();

  const {
    annotations,
    selectedTool,
    setAnnotations,
    setSelectedTool,
    handleAnnotate,
    handleDrawAnnotation, // New draw annotation handler
    handleRemoveAnnotation,
    handleRemoveLastAnnotation,
    handleUpdateAnnotation,
  } = useAnnotations();

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Placeholder marks for evaluation panel
  const [marks, setMarks] = useState({});

// Use copyId from URL
const [copyId, setCopyId] = useState(urlCopyId );

const [restored, setRestored] = useState(false); // New flag to track restoration


// Restore state from localStorage when component mounts
useEffect(() => {
  if (urlCopyId) {
    console.log("Copy ID from URL:", urlCopyId);
    setCopyId(urlCopyId);

    const savedState = localStorage.getItem(`evaluationState-${urlCopyId}`);
    console.log("Saved state from localStorage:", savedState);

    if (savedState) {
      const { annotations: savedAnnotations, marks: savedMarks, seconds: savedSeconds, timerActive: savedTimerActive } = JSON.parse(savedState);

      setAnnotations(savedAnnotations || []);
      setMarks(savedMarks || {});
      setSeconds(savedSeconds || 0);
      setTimerActive(savedTimerActive || false);
    } else {
      console.log("No saved state found. Initializing default state.");
      setAnnotations([]);
      setMarks({});
      setSeconds(0);
      setTimerActive(true);
    }

    setRestored(true); // Mark restoration as complete
  }
}, [urlCopyId]);

// Save annotations and marks to localStorage whenever they change
useEffect(() => {
  if (restored && copyId) { // Only save after restoration is complete
    const saveState = () => {
      const state = {
        annotations,
        marks,
        timerActive,
        seconds,
      };
      localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify(state));
    };

    saveState();
  }
}, [annotations, marks, copyId, restored]);


// Update copyId if URL parameter changes
useEffect(() => {
  if (urlCopyId) {
    console.log("Copy ID from URL:", urlCopyId);
    setCopyId(urlCopyId);
    
    // Reset timer when new copy is loaded
    setSeconds(0);
    setTimerActive(true);
  }
}, [urlCopyId]);


  // Reset handler to clear all state
  const handleReset = () => {
    setAnnotations([]);
    setMarks({});
    setSeconds(0);
    setTimerActive(false);
    localStorage.removeItem(`evaluationState-${copyId}`);
  };


    // Format time to HH:MM:SS
    const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
    };
    
    
    // Timer effect
    useEffect(() => {
      let interval = null;
      
      if (timerActive) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds + 1);
        }, 1000);
      }
      
      return () => clearInterval(interval);
    }, [timerActive]);


    // const handleSaveEvaluation = async () => {
    //   const evaluationData = {
    //     copyid: copyId,
    //     obt_mark: obtMark,
    //     max_mark: maxMark,
    //     status: 'Evaluated',
    //     eval_time: evalTime,
    //     eval_id: evalId,
    //     bag_id: bagId,
    //   };
  
    //   try {
    //     const response = await evaluationService.saveEvaluation(evaluationData);
    //     console.log('Evaluation saved successfully:', response);
    //     alert('Evaluation saved successfully!');
    //   } catch (error) {
    //     console.error('Error saving evaluation:', error);
    //     alert('Failed to save evaluation. Please try again.');
    //   }
    // };

    // const handleSaveAnnotation = async () => {
    //   try {
    //     const response = await saveAnnotations(copyId, annotations);
        
    //     if (response.data.success) {
    //       if (response.status === 201) {
    //         console.log("Annotations saved successfully");
    //       } else if (response.status === 200) {
    //         console.log("Annotations updated successfully");
    //       }
    //       // Clear saved state after successful submission
    //       localStorage.removeItem(`evaluationState-${copyId}`);
    //     } else {
    //       console.error("Failed to save annotations");
    //     }
    
    //     alert(response.data.message || "Annotations saved successfully");
    //   } catch (error) {
    //     console.error("Error saving annotations:", error);
    //   }
    // };


    const handleSubmitCopy = async (submissionData) => {
      try {
        // Step 1: Save Annotations
        const annotationResponse = await saveAnnotations(copyId, {
          annotations: submissionData.annotations,
          drawAnnotations: submissionData.drawAnnotations,
        });
    
        if (annotationResponse.data.success) {
          console.log('Annotations saved successfully:', annotationResponse.data);
        } else {
          console.error('Failed to save annotations:', annotationResponse.data.message);
          alert(annotationResponse.data.message || 'Failed to save annotations.');
          return; // Stop further execution if annotations fail
        }
    
        // Step 2: Save Evaluation
        const evaluationData = {
          copyid: copyId,
          obt_mark: submissionData.totalMarks,
          max_mark: 100, // Hardcoded max marks for now
          status: 'Evaluated',
          eval_time: seconds,
          eval_id: submissionData.userId, // Replace with actual user ID
          bag_id: 'BAG001', // Replace with actual bag ID if available
        };
    
        const evaluationResponse = await evaluationService.saveEvaluation(evaluationData);
        console.log('Evaluation saved successfully:', evaluationResponse);
        alert('Evaluation submitted successfully!');
      } catch (error) {
        console.error('Error during submission:', error);
        alert('Failed to submit evaluation. Please try again.');
      }
    };


  return (
    <div className="flex flex-col h-screen overflow-hidden ">
        {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-6 py-2 flex justify-between items-center shrink-0">
        <h1 className="text-lg font-semibold text-gray-800">OSM Evaluation</h1>
        <div className="flex items-center gap-4">
          {/* Timer with Material UI clock icon */}
          <div title='Pause/Play' onClick={() => setTimerActive(!timerActive)}  className="flex items-center text-xs gap-1 hover:text-gray-600">
             <svg className={`h-4 w-4 ${timerActive ? 'text-blue-600' : 'text-red-600'}`} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
            </svg>
            <span className="font-medium">{formatTime(seconds)}</span>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 lg:w-20 bg-white border-r border-gray-200 flex-shrink-0 py-8">
          <Toolbar
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            handleRemoveLastAnnotation={handleRemoveLastAnnotation}
            handleReset={handleReset}
          />
        </div>
  
        {/* Image Viewer */}
        <div className="flex-1 bg-gray-50 relative">
          <div className="absolute inset-0 overflow-auto px-4 lg:px-6 py-4">
            <ImageViewer
              copyId={copyId}
              annotations={annotations}
              selectedTool={selectedTool}
              handleAnnotate={handleAnnotate}
              handleDrawAnnotation={handleDrawAnnotation}
              handleRemoveAnnotation={handleRemoveAnnotation}
              handleUpdateAnnotation={handleUpdateAnnotation}
            />
          </div>
        </div>
  
        {/* Evaluation Panel */}
        <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex-shrink-0 overflow-hidden">
          <div className="h-full overflow-auto p-4">
            <EvaluationPanel 
              marks={marks} 
              setMarks={setMarks} 
              annotations={annotations} 
              submitCopy={handleSubmitCopy}
            />
          </div>
        </div>
      </div>
    </div>
  );

}

export default EvaluationLayout;