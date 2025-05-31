
// import { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import Evaluation from "./Evaluation";
// // import EvaluationStatus from "./EvaluationStatus";
// import AssignCopies from "./AssignCopies";
// import { useAuth } from "../context/AuthContext";
// import Loader from "../Common/Loader";
// import ReevaluateCopy from "./ReevaluateCopy";
// import api from "../../api/axios.js";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState(2);
//   const [isReevalAssigned, setIsReevalAssigned] = useState(false);  
//   const [reevalCopies, setReevalCopies] = useState([]);  
//   const { user, loading } = useAuth();


//    useEffect(() => {
//     // Check if the user has any re-evaluation assignments
//     const checkReevalAssigned = async () => {
//       try {
//         const response = await api.get("/api/evaluator/check-reeval-assigned");
//         setReevalCopies(response.data.assignments);
//         if(response.data.hasAssignments){
//           setIsReevalAssigned(true);
//         }
//         else{
//           setIsReevalAssigned(false);
//         }
//       } catch (error) {
//         console.error("Error checking re-evaluation assignments:", error);
//         setIsReevalAssigned(false);
//       }
//     };

//     checkReevalAssigned();
//   },[]);


//   return (
//     <div className="min-h-screen bg-gray-50">
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <Navbar
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             userData={user}
//             isReevalAssigned={isReevalAssigned}
//           />
          
//           {activeTab === 1 && <AssignCopies setActiveTab={setActiveTab} />}
//           {activeTab === 2 && <Evaluation setActiveTab={setActiveTab} />}
//           {activeTab === 3 && <ReevaluateCopy setActiveTab={setActiveTab} reevalCopies={reevalCopies}/>}
//         </>
//       )}
//     </div>
//   );
// }



//? New lightweight status check before

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Evaluation from "./Evaluation";
import AssignCopies from "./AssignCopies";
import { useAuth } from "../context/AuthContext";
import Loader from "../Common/Loader";
import ReevaluateCopy from "./ReevaluateCopy";
import api from "../../api/axios.js";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(2);
  const [reevalStatus, setReevalStatus] = useState({
    hasAssignments: false,
    count: 0
  });
  const [reevalCopies, setReevalCopies] = useState([]);
  const [reevalLoading, setReevalLoading] = useState(false);
  const [showCountDot, setShowCountDot] = useState(true);
  const { user, loading } = useAuth();

  // Check reevaluation status periodically
  useEffect(() => {
    const checkReevalStatus = async () => {
      try {
        const response = await api.get("/api/evaluator/reevaluations/status");
        setReevalStatus({
          hasAssignments: response.data.hasAssignments,
          count: response.data.count
        });
      } catch (error) {
        console.error("Error checking reevaluation status:", error);
      }
    };

    checkReevalStatus();
    
    // Then check every 5 minutes
    const interval = setInterval(checkReevalStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // load the reevaluation data when the tab is selected
  useEffect(() => {
    if (activeTab === 3 && reevalStatus.hasAssignments) {
      const fetchReevalCopies = async () => {
        setReevalLoading(true);
        try {
          const response = await api.get("/api/evaluator/check-reeval-assigned");
          setReevalCopies(response.data.assignments || []);
        } catch (error) {
          console.error("Error fetching reevaluation copies:", error);
        } finally {
          setReevalLoading(false);
        }
      };
      
      fetchReevalCopies();
    }
  }, [activeTab, reevalStatus.hasAssignments]);

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userData={user}
            reevalStatus={reevalStatus}
            showCountDot={showCountDot}
            setShowCountDot={setShowCountDot}
          />
          
          {activeTab === 1 && <AssignCopies setActiveTab={setActiveTab} />}
          {activeTab === 2 && <Evaluation setActiveTab={setActiveTab} />}
          {activeTab === 3 && <ReevaluateCopy 
            setActiveTab={setActiveTab} 
            reevalCopies={reevalCopies}
            loading={reevalLoading}
          />}
        </>
      )}
    </div>
  );
}