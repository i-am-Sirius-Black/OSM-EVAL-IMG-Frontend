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

// import Toolbar from '../AnnotationTools/Toolbar';
// import EvaluationPanel from '../EvaluationPanel/EvaluationPanel';
// import useAnnotations from '../../hooks/useAnnotations';
// import { use, useCallback, useEffect, useRef, useState } from 'react';
// import ImageViewer from '../PdfViewer/ImageViewer';
// import { saveAnnotations } from '../../services/annotationService';
// import { replace, useNavigate, useParams } from 'react-router-dom';
// import evaluationService from '../../services/evaluationService';
// import toast from 'react-hot-toast';
// import Timer from './Timer';
// import CloudIcon from '@mui/icons-material/Cloud';
// import CloudDoneIcon from '@mui/icons-material/CloudDone';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ConfirmationPopup from './Popup/ConfirmationPopup';

// function EvaluationLayout() {

//   const { copyId: copyId } = useParams();

//   const {
//     annotations,
//     selectedTool,
//     setAnnotations,
//     setSelectedTool,
//     handleAnnotate,
//     handleDrawAnnotation, // New draw annotation handler
//     handleRemoveAnnotation,
//     handleRemoveLastAnnotation,
//     handleUpdateAnnotation,
//   } = useAnnotations()

//   // Placeholder marks for evaluation panel
//   const [marks, setMarks] = useState({});

// // Use copyId from URL
// const [copyId, setCopyId] = useState(copyId );

// const [restored, setRestored] = useState(false); // New flag to track restoration of session

// const [isSaving, setIsSaving] = useState(false); // Tracking if saving is in progress
// const [showSaveIcon, setShowSaveIcon] = useState(false);
// const [showBackConfirmation, setShowBackConfirmation] = useState(false);

// //timer
// const timerRef = useRef(null);

// const hideIconTimerRef = useRef(null);

// const navigate = useNavigate();
// console.log("Eval Layout rerendering");

//   // Clear the timer when component unmounts
//   useEffect(() => {
//     return () => {
//       if (hideIconTimerRef.current) {
//         clearTimeout(hideIconTimerRef.current);
//       }
//     };
//   }, []);

// // Restore state from localStorage when component mounts
// useEffect(() => {
//   if (copyId) {
//     console.log("Copy ID from URL:", copyId);
//     setCopyId(copyId);

//     setIsSaving(true); // Indicate that the state is being restored

//     const savedState = localStorage.getItem(`evaluationState-${copyId}`);

//     if (savedState) {
//       const { annotations: savedAnnotations, marks: savedMarks, seconds: savedSeconds } = JSON.parse(savedState);

//       setAnnotations(savedAnnotations || []);
//       setMarks(savedMarks || {});
//     } else {
//       console.log("No saved state found. Initializing default state.");
//       setAnnotations([]);
//       setMarks({});
//     }

//     setRestored(true); // Mark restoration as complete
//     setIsSaving(false); // Indicate that the restoration is complete
//   }
// }, [copyId]);

// //?v2, with hiding save icon
//  // Save annotations with debounce and handle icon visibility
//  useEffect(() => {
//   if (restored && copyId) {
//     const debounceTimeout = 3000; // 3 seconds debounce time

//     // Show the saving icon immediately
//     setIsSaving(true);
//     setShowSaveIcon(true);
//     console.log("Saving state to localStorage...");

//     const saveTimeout = setTimeout(() => {
//       const state = {
//         annotations,
//         marks,
//       };
//       localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify(state));
//       console.log("State saved to localStorage:", copyId, "state->", state);

//       // Show the success icon
//       setIsSaving(false);

//       // Set a timer to hide the success icon after 3 seconds
//       if (hideIconTimerRef.current) {
//         clearTimeout(hideIconTimerRef.current);
//       }

//       hideIconTimerRef.current = setTimeout(() => {
//         setShowSaveIcon(false);
//       }, 3000); // Hide after 3 seconds
//     }, debounceTimeout);

//     return () => {
//       clearTimeout(saveTimeout);
//       if (hideIconTimerRef.current) {
//         clearTimeout(hideIconTimerRef.current);
//       }
//       setIsSaving(false);
//     };
//   }
// }, [annotations, marks, copyId, restored]);

// // Update copyId if URL parameter changes
// useEffect(() => {
//   if (copyId) {
//     console.log("Copy ID from URL:", copyId);
//     setCopyId(copyId);

//   }
// }, [copyId]);

//   const handleResetAnnotations = () => {
//     try {
//       // Only reset annotations, preserve marks
//       setAnnotations([]);
//       setSelectedTool(null);
//       const seconds = getElapsedTime();
//       // Update localStorage with empty annotations but keep existing marks
//       const currentState = JSON.parse(localStorage.getItem(`evaluationState-${copyId}`) || '{}');
//       localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify({
//         annotations: [],
//         marks: currentState.marks || marks,
//         seconds
//       }));

//       // Show success message
//       toast('Annotations Cleared! Marks preserved.', {
//         icon: '🗑️',
//       });

//       // Trigger save icon to show "saved" state
//       setIsSaving(true);
//       setShowSaveIcon(true);
//       setTimeout(() => {
//         setIsSaving(false);
//         if (hideIconTimerRef.current) {
//           clearTimeout(hideIconTimerRef.current);
//         }
//         hideIconTimerRef.current = setTimeout(() => {
//           setShowSaveIcon(false);
//         }, 3000);
//       }, 500);

//     } catch (error) {
//       toast.error('Error resetting annotations. Please try again.');
//       console.error('Error during annotation reset:', error);
//     }
//   };

//   const handleResetEval = () => {
//     try {
//       // Only reset marks, preserve annotations
//       setMarks({});
//       const seconds = getElapsedTime();
//       // Update localStorage with empty marks but keep existing annotations
//       const currentState = JSON.parse(localStorage.getItem(`evaluationState-${copyId}`) || '{}');
//       localStorage.setItem(`evaluationState-${copyId}`, JSON.stringify({
//         annotations: currentState.annotations || annotations,
//         marks: {},
//         seconds
//       }));

//       // Show success message
//       toast('All Marks Reset!', {
//         icon: '🧹',
//       });

//       // Trigger save icon to show "saved" state
//       setIsSaving(true);
//       setShowSaveIcon(true);
//       setTimeout(() => {
//         setIsSaving(false);
//         if (hideIconTimerRef.current) {
//           clearTimeout(hideIconTimerRef.current);
//         }
//         hideIconTimerRef.current = setTimeout(() => {
//           setShowSaveIcon(false);
//         }, 3000);
//       }, 500);

//     } catch (error) {
//       toast.error('Error resetting marks. Please try again.');
//       console.error('Error during marks reset:', error);
//     }
//   };

//   //?v1.2 simple toast message

//   const handleSubmitCopy = async (submissionData) => {

//     const seconds = getElapsedTime();
//     if(seconds < 600) {
//       toast.error('Evaluation time is less than 10 minutes.');
//       return false; // Indicate failure to caller
//     }

//     try {
//       // Step 1: Save Annotations
//       const annotationResponse = await saveAnnotations(copyId, {
//         annotations: submissionData.annotations,
//         drawAnnotations: submissionData.drawAnnotations,
//       });

//       if (!annotationResponse.data.success) {
//         toast.error(annotationResponse.data.message || 'Failed to save annotations.');
//         return false; // Indicate failure to caller
//       }

//       // Step 2: Save Evaluation
//       const evaluationData = {
//         copyid: copyId,
//         obt_mark: submissionData.totalMarks,
//         max_mark: 100, // Hardcoded max marks for now
//         status: 'Evaluated',
//         eval_time: seconds,
//         eval_id: submissionData.userId, // Replace with actual user ID
//         bag_id: 'BAG001', // Replace with actual bag ID if available
//       };

//       const evaluationResponse = await evaluationService.saveEvaluation(evaluationData);
//       console.log('evaluationResponse for evaluation layout:', evaluationResponse);

//       // Clear localStorage after successful submission
//       localStorage.removeItem(`evaluationState-${copyId}`);

//       toast.success('Evaluation submitted successfully!');
//       return true; // Indicate success to caller
//     } catch (error) {
//       console.error('Error during submission:', error);
//       toast.error(`Submission failed: ${error.message || 'Unknown error occurred'}`);
//       return false; // Indicate failure to caller
//     }
//   };

//   const getElapsedTime = () => {
//     return timerRef.current?.getCurrentTime() || 0;
//   }

//   const handleBack = () => {
//     setShowBackConfirmation(true); // Show confirmation popup, include time in message if needed
//   };

//   const confirmBack = () => {
//     setShowBackConfirmation(false);
//     navigate(-1);
//   };

//   return (
//     <div className="flex flex-col h-screen overflow-hidden">
//         {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-6 py-2 flex justify-between items-center shrink-0">
//         <div className='flex items-center gap-4'>
//         <button className='hover:text-red-500 hover:animate-pulse' onClick={handleBack}><ArrowBackIcon/></button>
//         <h1 onClick={handleBack} className="text-lg font-semibold text-gray-800">OSM Evaluation</h1>
//         </div>
//         <div className="flex items-center gap-4">

//           {showSaveIcon && (
//             isSaving ? (
//               <CloudIcon className="text-gray-300 animate-pulse" />
//             ) : (
//               <CloudDoneIcon className="text-green-500" />
//             )
//           )}

//         <Timer
//             ref={timerRef}
//             isActive={true}
//             onToggle={(active) => console.log(active)}
//             showControls={true}
//           />
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Toolbar */}
//         <div className="w-16 lg:w-20 bg-white border-r border-gray-200 flex-shrink-0 py-8">
//           <Toolbar
//             selectedTool={selectedTool}
//             setSelectedTool={setSelectedTool}
//             handleRemoveLastAnnotation={handleRemoveLastAnnotation}
//             handleReset={handleResetAnnotations}
//           />
//         </div>

//         {/* Image Viewer */}
//         <div className="flex-1 bg-gray-50 relative">
//           <div className="absolute inset-0 overflow-auto px-4 lg:px-6 py-4">
//             <ImageViewer
//               copyId={copyId}
//               annotations={annotations}
//               selectedTool={selectedTool}
//               handleAnnotate={handleAnnotate}
//               handleDrawAnnotation={handleDrawAnnotation}
//               handleRemoveAnnotation={handleRemoveAnnotation}
//               handleUpdateAnnotation={handleUpdateAnnotation}
//             />
//           </div>
//         </div>

//         {/* Evaluation Panel */}
//         <div className="w-80 lg:w-96 bg-white border-l border-gray-200 flex-shrink-0 overflow-hidden">
//           <div className="h-full overflow-auto p-4">
//             <EvaluationPanel
//               copyId={copyId}
//               marks={marks}
//               setMarks={setMarks}
//               annotations={annotations}
//               submitCopy={handleSubmitCopy}
//               handleRemoveAnnotation={handleRemoveAnnotation}
//               handleReset={handleResetEval}
//             />
//           </div>
//         </div>
//       </div>

//   {/* Back confirmation popup */}
//   <ConfirmationPopup
//     isOpen={showBackConfirmation}
//     onClose={() => setShowBackConfirmation(false)}
//     onConfirm={confirmBack}
//     message="Are you sure you want to go back? Any unsaved changes will be lost."
//   />

//     </div>
//   );

// }

// export default EvaluationLayout;

//* v1.2 Hybrid Autosave System combining localStorage with server-based persistence
import Toolbar from "../AnnotationTools/Toolbar";
import EvaluationPanel from "../EvaluationPanel/EvaluationPanel";
import useAnnotations from "../../hooks/useAnnotations";
import { useEffect, useRef, useState } from "react";
import ImageViewer from "../PdfViewer/ImageViewer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import evaluationService from "../../services/evaluationService";
import toast from "react-hot-toast";
import Timer from "./Timer";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConfirmationPopup from "./Popup/ConfirmationPopup";
import API_ROUTES from "../../api/routes";
import { useAuth } from "../context/AuthContext";
import api from "../../api/axios";
import { constants } from "../../utils/constants";

function EvaluationLayout() {
    const navigate = useNavigate();
  // const { copyId: urlCopyId } = useParams();

    const location = useLocation();
  
  // Get copyId from location state instead of URL params
// Destructure all needed values from location.state in one line
const { copyId: stateCopyId, subjectCode, isReevaluation} = location.state || {};


  const { user } = useAuth();
  const evaluatorId = user?.uid || null;

  const { AUTOSAVE } = API_ROUTES;

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

  // Placeholder marks for evaluation panel
  const [marks, setMarks] = useState({});

// Use copyId from URL
// const [copyId, setCopyId] = useState(urlCopyId || null);

  const [copyId, setCopyId] = useState(stateCopyId || null);
  

  const [restored, setRestored] = useState(false); // New flag to track restoration of session

  const [isSaving, setIsSaving] = useState(false); // Tracking if saving is in progress
  const [showSaveIcon, setShowSaveIcon] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [navigationPending, setNavigationPending] = useState(false);

  //timer
  const timerRef = useRef(null);

  const hideIconTimerRef = useRef(null);



//TODO: Testing this feature for future implementation
// useEffect(() => {
//   if (!restored || !copyId) return;

//   const handleBeforeUnload = (event) => {
//     // Save synchronously
//     const state = {
//       annotations,
//       marks,
//       seconds: getElapsedTime()
//     };
//     console.log("State saved to localStorage:", copyId, "state->", state);

//     event.preventDefault();
//     event.returnValue = ''; // Required for Chrome
//   };

//   window.addEventListener('beforeunload', handleBeforeUnload);
  
//   return () => {
//     window.removeEventListener('beforeunload', handleBeforeUnload);
//   };
// }, [restored, copyId]);




  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (hideIconTimerRef.current) {
        clearTimeout(hideIconTimerRef.current);
      }
    };
  }, []);

  // Use to clean up any "undefined" entries in localStorage
  useEffect(() => {
    // Clean up any "undefined" entries in localStorage
    localStorage.removeItem("evaluationState-undefined");
    localStorage.removeItem("evaluationState-null");
  }, []);

  //* Restore state from localStorage component mounts
  useEffect(() => {
    if (copyId && copyId !== "undefined") {
      console.log("Copy ID from URL:", copyId);
      setCopyId(copyId);
      setIsSaving(true); // Indicate that the state is being restored

      // First try to get data from localStorage (fastest)
      const savedState = localStorage.getItem(`evaluationState-${copyId}`);

      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          const { annotations: savedAnnotations, marks: savedMarks, seconds: savedSeconds } =
            parsedState;

          // Check if we actually have meaningful data (not just empty arrays/objects)
          const hasAnnotations =
            savedAnnotations &&
            Array.isArray(savedAnnotations) &&
            savedAnnotations.length > 0;
          const hasMarks = savedMarks && Object.keys(savedMarks).length > 0;
          const hasSeconds = savedSeconds > 0;

          if (hasAnnotations || hasMarks || hasSeconds) {
            setAnnotations(savedAnnotations || []);
            setMarks(savedMarks || {});
            setTimeInSeconds(savedSeconds || 0);
            setRestored(true);
            setIsSaving(false);
          } else {
            console.log("Empty state in localStorage, checking server...");
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      } else {
        console.log(
          "No saved state found in localStorage. Fetching from server..."
        );
      }
    }

  }, [copyId, setAnnotations, evaluatorId, copyId]);

//* Hybrid Autosave System (now only localStorage, no server)
useEffect(() => {
  if (restored && copyId && copyId !== "undefined") {
    const localDebounceTimeout = constants.LOCAL_TIMEOUT;

    // Show the saving icon immediately
    setIsSaving(true);
    setShowSaveIcon(true);

    // Local save timeout (quick save to localStorage)
    const localSaveTimeout = setTimeout(() => {
      const state = {
        annotations,
        marks,
        seconds: getElapsedTime(),
      };
      localStorage.setItem(
        `evaluationState-${copyId}`,
        JSON.stringify(state)
      );
      console.log("State saved to localStorage:", copyId);

      // Show success icon
      setIsSaving(false);
    }, localDebounceTimeout);

    // Set a timer to hide the success icon
    if (hideIconTimerRef.current) {
      clearTimeout(hideIconTimerRef.current);
    }

    hideIconTimerRef.current = setTimeout(() => {
      setShowSaveIcon(false);
    }, 3000);

    return () => {
      clearTimeout(localSaveTimeout);
      if (hideIconTimerRef.current) {
        clearTimeout(hideIconTimerRef.current);
      }
      setIsSaving(false);
    };
  }
}, [annotations, marks, copyId, restored]);

  // Update copyId if URL parameter changes
  useEffect(() => {
    if (copyId) {
      console.log("Copy ID from URL:", copyId);
      setCopyId(copyId);
    }
  }, [copyId]);

  const handleResetAnnotations = async () => {
    try {
      // Reset annotations locally
      setAnnotations([]);
      setSelectedTool(null);
      const seconds = getElapsedTime();

      // Get current state for keeping marks
      const currentState = JSON.parse(
        localStorage.getItem(`evaluationState-${copyId}`) || "{}"
      );

      // Update local state
      const newState = {
        annotations: [],
        marks: currentState.marks || marks,
        seconds,
      };

      // Save to localStorage
      localStorage.setItem(
        `evaluationState-${copyId}`,
        JSON.stringify(newState)
      );

      // Show success message
      toast("Annotations Cleared! Marks preserved.", {
        icon: "🗑️",
      });

      // Trigger save icon to show "saved" state
      setIsSaving(true);
      setShowSaveIcon(true);
      setTimeout(() => {
        setIsSaving(false);
        if (hideIconTimerRef.current) {
          clearTimeout(hideIconTimerRef.current);
        }
        hideIconTimerRef.current = setTimeout(() => {
          setShowSaveIcon(false);
        }, 3000);
      }, 500);
    } catch (error) {
      toast.error("Error resetting annotations. Please try again.");
      console.error("Error during annotation reset:", error);
    }
  };

  const handleResetEval = async () => {
    try {
      // Reset marks locally
      setMarks({});
      const seconds = getElapsedTime();

      // Get current state for keeping annotations
      const currentState = JSON.parse(
        localStorage.getItem(`evaluationState-${copyId}`) || "{}"
      );

      // Update local state
      const newState = {
        annotations: currentState.annotations || annotations,
        marks: {}, // Empty marks
        seconds,
      };

      // Save to localStorage
      localStorage.setItem(
        `evaluationState-${copyId}`,
        JSON.stringify(newState)
      );

      // Show success message
      toast("All Marks Reset!", {
        icon: "🧹",
      });

      // Trigger save icon to show "saved" state
      setIsSaving(true);
      setShowSaveIcon(true);
      setTimeout(() => {
        setIsSaving(false);
        if (hideIconTimerRef.current) {
          clearTimeout(hideIconTimerRef.current);
        }
        hideIconTimerRef.current = setTimeout(() => {
          setShowSaveIcon(false);
        }, 3000);
      }, 500);
    } catch (error) {
      toast.error("Error resetting marks. Please try again.");
      console.error("Error during marks reset:", error);
    }
  };


  //? V2 with both eval+ annotations submission in single call also reevaluation save
 const handleSubmitCopy = async (submissionData) => {
  const seconds = getElapsedTime();
  try {
    if (isReevaluation) {
      // Re-evaluation payload
      const payload = {
        copyid: copyId,
        obt_mark2: submissionData.obtMarks,
        eval_id2: user.uid,
        eval_time2: seconds,
        annotations2: submissionData.annotations,
        draw_annotations2: submissionData.drawAnnotations,
      };
      const result = await evaluationService.submitReevaluation(payload);

      if (!result.success) {
        toast.error(result.message || "Failed to submit re-evaluation.");
        return false;
      }
      toast.success("Re-evaluation submitted successfully!");
    } else {
      // Normal evaluation payload
      const payload = {
        copyid: copyId,
        obt_mark: submissionData.obtMarks,
        max_mark: submissionData.maxMarks,
        status: "Evaluated",
        eval_time: seconds,
        eval_id: user.uid,
        bag_id: "BAG001",
        annotations: submissionData.annotations,
        drawAnnotations: submissionData.drawAnnotations,
      };
      const result = await evaluationService.saveEvaluationAndAnnotations(payload);

      if (!result.success) {
        toast.error(result.message || "Failed to save evaluation.");
        return false;
      }
      toast.success("Evaluation submitted successfully!");
    }

    // After successful submission:
    localStorage.removeItem(`evaluationState-${copyId}`);

    return true;
  } catch (error) {
    toast.error(error.message || "Submission failed.");
    return false;
  }
};
 


  const getElapsedTime = () => {
    return timerRef.current?.getCurrentTime() || 0;
  };

 // Update the back handler
  const handleBack = () => {
    // First prompt for confirmation
    setShowBackConfirmation(true);
  };

  const confirmBack = () => {
    setShowBackConfirmation(false);
    // Set the navigation trigger instead of navigating immediately
    setNavigationPending(true);
  };

  // Add a new effect that responds to navigation trigger
useEffect(() => {
  if (navigationPending) {
    // Force immediate save (both local and server)
    const saveState = () => {
      try {
        // 1. Save to localStorage immediately
        const state = {
          annotations,
          marks,
          seconds: getElapsedTime(),
        };
        localStorage.setItem(
          `evaluationState-${copyId}`, 
          JSON.stringify(state)
        );
        
        // 2. Navigate after saving - don't use await here as navigate() doesn't return a promise
        navigate(-1);
      } catch (error) {
        console.error("Error during navigation save:", error);
        // Navigate anyway to avoid trapping the user
        navigate(-1);
      }
    };
    
    saveState();
  }
}, [navigationPending]);
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-4 lg:px-6 py-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button
            className="hover:text-red-500 hover:animate-pulse"
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </button>
          <h1
            onClick={handleBack}
            className="text-lg font-semibold text-gray-800"
          >
            OSM Evaluation
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {showSaveIcon &&
            (isSaving ? (
              <CloudIcon className="text-gray-300 animate-pulse" />
            ) : (
              <CloudDoneIcon className="text-green-500" />
            ))}

          <Timer
            ref={timerRef}
            isActive={true}
            onToggle={(active) => console.log(active)}
            showControls={true}
            initialSeconds={timeInSeconds}
          />
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
            handleReset={handleResetAnnotations}
          />
        </div>

        {/* Image Viewer */}
        <div className="flex-1 bg-gray-50 relative">
          <div className="absolute inset-0 overflow-auto px-4 lg:px-6 py-4">
            <ImageViewer
              copyId={copyId}
              subjectCode={subjectCode}
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
              subjectCode={subjectCode}
              marks={marks}
              setMarks={setMarks}
              annotations={annotations}
              submitCopy={handleSubmitCopy}
              handleRemoveAnnotation={handleRemoveAnnotation}
              handleReset={handleResetEval}
              isReevaluation={isReevaluation}
              navigate={navigate}
            />
          </div>
        </div>
      </div>

      {/* Back confirmation popup */}
      <ConfirmationPopup
        isOpen={showBackConfirmation}
        onClose={() => setShowBackConfirmation(false)}
        onConfirm={confirmBack}
        message="Are you sure you want to go back? Any unsaved changes will be lost."
      />
    </div>
  );
}

export default EvaluationLayout;
