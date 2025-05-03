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
import { replace, useNavigate, useParams } from 'react-router-dom';
import evaluationService from '../../services/evaluationService';
import toast from 'react-hot-toast';
import Timer from './Timer';

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
  } = useAnnotations()

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Placeholder marks for evaluation panel
  const [marks, setMarks] = useState({});

// Use copyId from URL
const [copyId, setCopyId] = useState(urlCopyId );

const [restored, setRestored] = useState(false); // New flag to track restoration of session

const [isSaving, setIsSaving] = useState(false); // Tracking if saving is in progress
const navigate = useNavigate();

console.log("Eval Layout rerendering");


// Restore state from localStorage when component mounts
useEffect(() => {
  if (urlCopyId) {
    console.log("Copy ID from URL:", urlCopyId);
    setCopyId(urlCopyId);

    setIsSaving(true); // Indicate that the state is being restored

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
    setIsSaving(false); // Indicate that the restoration is complete
  }
}, [urlCopyId]);

// Save annotations and marks to localStorage whenever they change
// useEffect(() => {

//   if (restored && copyId) { // Only save after restoration is complete
//     setLoadingSessionData(true);

//     const saveState = () => {
//       const state = {
//         annotations,
//         marks,
//         timerActive,
//         seconds,
//       };
//       localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify(state));
//     };

//     saveState();
//     setLoadingSessionData(false);
//   }
// }, [annotations, marks, copyId, restored]);


//* Save annotations and marks to localStorage with debounce
useEffect(() => {
  if (restored && copyId) { // Only save after restoration is complete
    const debounceTimeout = 3000; // 3 seconds debounce time
    setIsSaving(true); // Start saving process

    const saveTimeout = setTimeout(() => {
      const state = {
        annotations,
        marks,
        timerActive,
      };
      localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify(state));
      console.log("State saved to localStorage:", state);
      setIsSaving(false); // Save process complete
    }, debounceTimeout);

    return () => {
      clearTimeout(saveTimeout); // Clear timeout if dependencies change
      setIsSaving(false); // Reset saving state if interrupted
    };
  }
}, [annotations, marks, copyId, restored, timerActive]);


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
    try {
      setAnnotations([]);
      setMarks({});
      setSeconds(0);
      setTimerActive(true);
      setSelectedTool(null);
      localStorage.removeItem(`evaluationState-${copyId}`);
      toast('All Cleared!', {
        icon: '🗑️',
      });
    } catch (error) {
      toast.error('Error resetting state. Please try again.');
      console.error('Error during reset:', error);
    }
  };


    // const handleSubmitCopy = async (submissionData) => {
    //   try {
    //     // Step 1: Save Annotations
    //     const annotationResponse = await saveAnnotations(copyId, {
    //       annotations: submissionData.annotations,
    //       drawAnnotations: submissionData.drawAnnotations,
    //     });
    
    //     if (annotationResponse.data.success) {
    //       console.log('Annotations saved successfully:', annotationResponse.data);
    //     } else {
    //       console.error('Failed to save annotations:', annotationResponse.data.message);
    //       alert(annotationResponse.data.message || 'Failed to save annotations.');
    //       return; // Stop further execution if annotations fail
    //     }
    
    //     // Step 2: Save Evaluation
    //     const evaluationData = {
    //       copyid: copyId,
    //       obt_mark: submissionData.totalMarks,
    //       max_mark: 100, // Hardcoded max marks for now
    //       status: 'Evaluated',
    //       eval_time: seconds,
    //       eval_id: submissionData.userId, // Replace with actual user ID
    //       bag_id: 'BAG001', // Replace with actual bag ID if available
    //     };
    
    //     const evaluationResponse = await evaluationService.saveEvaluation(evaluationData);
    //     console.log('Evaluation saved successfully:', evaluationResponse);
    //   } catch (error) {
    //     console.error('Error during submission:', error);
    //     alert('Failed to submit evaluation. Please try again.');
    //   }
    // };

  //?using toast.promise to show loading and success/error messages
  // const handleSubmitCopy = async (submissionData) => {
  //   return toast.promise(
  //     // Promise chain to be monitored by toast
  //     (async () => {
  //       // Step 1: Save Annotations
  //       const annotationResponse = await saveAnnotations(copyId, {
  //         annotations: submissionData.annotations,
  //         drawAnnotations: submissionData.drawAnnotations,
  //       });
        
  //       if (!annotationResponse.data.success) {
  //         throw new Error(annotationResponse.data.message || 'Failed to save annotations.');
  //       }
        
  //       // Step 2: Save Evaluation
  //       const evaluationData = {
  //         copyid: copyId,
  //         obt_mark: submissionData.totalMarks,
  //         max_mark: 100, // Hardcoded max marks for now
  //         status: 'Evaluated',
  //         eval_time: seconds,
  //         eval_id: submissionData.userId,
  //         bag_id: 'BAG001',
  //       };
        
  //       const evaluationResponse = await evaluationService.saveEvaluation(evaluationData);
        
  //       // Clear local storage after successful submission
  //       localStorage.removeItem(`evaluationState-${copyId}`);
        
  //       // Add a short delay before navigating to home page
  //       setTimeout(() => {
  //         navigate('/');
  //       }, 1500); // 1.5 second delay to let the success message be visible
        
  //       return { annotationResponse, evaluationResponse };
  //     })(),
  //     {
  //       loading: 'Submitting evaluation...',
  //       success: 'Evaluation submitted successfully!',
  //       error: (err) => `Submission failed: ${err.message}`,
  //     }
  //   );
  // };



  //?v1.2 simple toast message

  const handleSubmitCopy = async (submissionData) => {
    
    try {
      // Step 1: Save Annotations
      const annotationResponse = await saveAnnotations(copyId, {
        annotations: submissionData.annotations,
        drawAnnotations: submissionData.drawAnnotations,
      });
  
      if (!annotationResponse.data.success) {
        toast.error(annotationResponse.data.message || 'Failed to save annotations.');
        return false; // Indicate failure to caller
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
      console.log('evaluationResponse for evaluation layout:', evaluationResponse);
      
      // Clear localStorage after successful submission
      localStorage.removeItem(`evaluationState-${copyId}`);
      
      toast.success('Evaluation submitted successfully!');
      return true; // Indicate success to caller
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error(`Submission failed: ${error.message || 'Unknown error occurred'}`);
      return false; // Indicate failure to caller
    }
  };


  const handleLogoClick = () => {
    if (window.confirm('Are you sure you want to navigate to the home page?')) {
      navigate('/', { replace: true });
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden ">
        {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-6 py-2 flex justify-between items-center shrink-0">
        <h1 onClick={handleLogoClick} className="text-lg font-semibold text-gray-800">OSM Evaluation</h1>
        <div className="flex items-center gap-4">
          {/* Timer with Material UI clock icon */}
          {/* <Timer 
          initialSeconds={seconds}
          isActive={timerActive}
          onToggle={(isActive) => setTimerActive(isActive)}
          onTimeUpdate={(newSeconds) => setSeconds(newSeconds)}
        /> */}  
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
              copyId={copyId}
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

