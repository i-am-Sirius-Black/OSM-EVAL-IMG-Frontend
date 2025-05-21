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
import { saveAnnotations } from "../../services/annotationService";
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
  const { copyId: stateCopyId, subjectCode } = location.state || {};


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


  console.log("Eval Layout rerendering");



useEffect(() => {
  if (!restored || !copyId) return;

  const handleBeforeUnload = (event) => {
    // Save synchronously
    const state = {
      annotations,
      marks,
      seconds: getElapsedTime()
    };
    console.log("State saved to localStorage:", copyId, "state->", state);

    event.preventDefault();
    event.returnValue = ''; // Required for Chrome
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [restored, copyId]);




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

  //*Hybrid Restore System
  // Restore state from localStorage or server when component mounts
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
            fetchFromServer();
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
          fetchFromServer();
        }
      } else {
        console.log(
          "No saved state found in localStorage. Fetching from server..."
        );
        fetchFromServer();
      }
    }

    async function fetchFromServer() {
      try {
        if (!evaluatorId) {
          toast.error(
            "There was an error fetching your data. Please try again."
          );
          console.log("Evaluator ID not found. Cannot fetch from server.");
          setRestored(true);
          setIsSaving(false);
          setAnnotations([]);
          setMarks({});
          setTimeInSeconds(0);
          return;
        }

        const response = await api.get(AUTOSAVE.GET(evaluatorId, copyId));
        const data = response.data;
        console.log("Response.data from server hybrid restore:", data);

        if (data.success && data.data) {
          // Check if we got meaningful data from server
          const hasAnnotations =
            data.data.annotations &&
            Array.isArray(data.data.annotations) &&
            data.data.annotations.length > 0;
          const hasMarks =
            data.data.marks && Object.keys(data.data.marks).length > 0;
          const hasSeconds = data.data.seconds > 0;

          if (hasAnnotations || hasMarks || hasSeconds) {
            console.log("Found meaningful state on server");
            setAnnotations(data.data.annotations || []);
            setMarks(data.data.marks || {});
            setTimeInSeconds(data.data.seconds || 0);

            // Also update localStorage with this server data
            localStorage.setItem(
              `evaluationState-${copyId}`,
              JSON.stringify({
                annotations: data.data.annotations || [],
                marks: data.data.marks || {},
                seconds: data.data.seconds || 0,
              })
            );

            console.log("State restored from server");
          } else {
            console.log("Empty state on server. Initializing default state.");
            setAnnotations([]);
            setMarks({});
            setTimeInSeconds(0);
          }
        } else {
          console.log(
            "No saved state found on server. Initializing default state."
          );
          setAnnotations([]);
          setMarks({});
        }
      } catch (error) {
        console.error("Error fetching state from server:", error);
        setAnnotations([]);
        setMarks({});
      } finally {
        setRestored(true);
        setIsSaving(false);
      }
    }
  }, [copyId, setAnnotations, evaluatorId, copyId]);

  //* Hybrid Autosave System
  // Save annotations with debounce - hybrid approach (localStorage + server)
  useEffect(() => {
    if (restored && copyId && copyId !== "undefined") {
      const localDebounceTimeout = constants.LOCAL_TIMEOUT;
      const serverDebounceTimeout = constants.SERVER_TIMEOUT;

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

      // Server save timeout (less frequent, but more persistent)
      const serverSaveTimeout = setTimeout(async () => {
        try {
          if (!evaluatorId) {
            toast.error(
              "There was an error fetching your data. Please try again."
            );
            console.log("Evaluator ID not found. Cannot fetch from server.");
            return;
          }
          // Send to server
          const response = await api.post(AUTOSAVE.SAVE, {
            evaluatorId,
            copyId,
            annotations,
            marks,
            seconds: getElapsedTime(),
          });

          const data = response.data;

          if (data.success) {
            console.log("State saved to server:", copyId);
          } else {
            console.error("Failed to save state to server:", data.message);
          }
        } catch (error) {
          console.error("Error saving to server:", error);
          // If server save fails, at least we have localStorage backup
        }
      }, serverDebounceTimeout);

      // Set a timer to hide the success icon
      if (hideIconTimerRef.current) {
        clearTimeout(hideIconTimerRef.current);
      }

      hideIconTimerRef.current = setTimeout(() => {
        setShowSaveIcon(false);
      }, 3000);

      return () => {
        clearTimeout(localSaveTimeout);
        clearTimeout(serverSaveTimeout);
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

      // Also update server state
      try {
        if (!evaluatorId) {
          toast.error(
            "There was an error fetching your data. Please try again."
          );
          console.log("Evaluator ID not found. Cannot fetch from server.");
          return;
        }

        // Send to server immediately - no debounce needed for explicit user actions
        await api.post(AUTOSAVE.SAVE, {
          evaluatorId,
          copyId,
          annotations: [],
          marks: newState.marks,
          seconds: getElapsedTime(),
        });

        console.log("Reset annotations synced to server");
      } catch (serverError) {
        console.error(
          "Failed to sync annotation reset to server:",
          serverError
        );
        // Continue anyway since localStorage is updated
      }

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

      // Also update server state
      try {
        if (!evaluatorId) {
          toast.error(
            "There was an error fetching your data. Please try again."
          );
          console.log("Evaluator ID not found. Cannot fetch from server.");
          return;
        }

        // Send to server immediately - no debounce needed for explicit user actions
        await api.post(AUTOSAVE.SAVE, {
          evaluatorId,
          copyId,
          annotations: newState.annotations, // Keep existing annotations
          marks: {}, // Empty marks
          seconds: getElapsedTime(),
        });

        console.log("Reset marks synced to server");
      } catch (serverError) {
        console.error("Failed to sync marks reset to server:", serverError);
        // Continue anyway since localStorage is updated
      }

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


  const validateTimePassed = (seconds) => {
    if (seconds < constants.MIN_EVAL_TIME) {
      toast(
        `Can't Submit Before ${constants.MIN_EVAL_TIME / 60} Minutes.`,
        {
          icon: "⏳",
          duration: 4000,
        }
      );
      return false;
    }
    return true;
  }

  //?v1.2 simple toast message
  const handleSubmitCopy = async (submissionData) => {
    const seconds = getElapsedTime();
    if (!validateTimePassed(seconds)) {
      return false; // Indicate failure to caller
    }

    try {
      // Step 1: Save Annotations
      const annotationResponse = await saveAnnotations(copyId, {
        annotations: submissionData.annotations,
        drawAnnotations: submissionData.drawAnnotations,
      });

      if (!annotationResponse.data.success) {
        toast.error(
          annotationResponse.data.message || "Failed to save annotations."
        );
        return false; // Indicate failure to caller
      }

      // Step 2: Save Evaluation
      const evaluationData = {
        copyid: copyId,
        obt_mark: submissionData.totalMarks,
        max_mark: 100, // Hardcoded max marks for now
        status: "Evaluated",
        eval_time: seconds,
        eval_id: submissionData.userId, // Replace with actual user ID
        bag_id: "BAG001", // Replace with actual bag ID if available
      };

      await evaluationService.saveEvaluation(evaluationData);
      console.log("Evaluation saved successfully:", evaluationResponse.data);

      // After successful submission:
      // 1. Clear localStorage
      localStorage.removeItem(`evaluationState-${copyId}`);

      // 2. Clear server autosave
      try {
        if (!evaluatorId) {
          toast.error(
            "There was an error fetching your data. Please try again."
          );
          console.log("Evaluator ID not found. Cannot fetch from server.");
          return;
        }
        // Send delete request to server
        await api.delete(AUTOSAVE.DELETE(evaluatorId, copyId));
        console.log("Server autosave cleared successfully");
      } catch (deleteError) {
        console.error("Error deleting server autosave:", deleteError);
        // Continue anyway since this is just cleanup
      }

      toast.success("Evaluation submitted successfully!");
      return true; // Indicate success to caller
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(
        `Submission failed: ${error.message || "Unknown error occurred"}`
      );
      return false; // Indicate failure to caller
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
      const saveState = async () => {
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
          
          // 2. Try to save to server if possible
          if (evaluatorId) {
            try {
              await api.post(AUTOSAVE.SAVE, {
                evaluatorId,
                copyId,
                annotations,
                marks,
                seconds: getElapsedTime(),
              });
              console.log("Final state saved to server before navigation");
            } catch (error) {
              console.error("Could not save to server before navigation:", error);
              // Continue with navigation anyway
            }
          }
          
          // 3. Navigate after saving
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
        <div>
          <p className="text-sm text-gray-800">Sub - {subjectCode}</p>
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
              handleRemoveAnnotation={handleRemoveAnnotation}
              handleReset={handleResetEval}
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
