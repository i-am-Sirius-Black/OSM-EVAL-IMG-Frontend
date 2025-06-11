// import { useState, useEffect } from "react";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import api from "../../../../api/axios";
// import toast from "react-hot-toast";

// const UploadPaper = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const [formData, setFormData] = useState({
//     course: "",
//     subject: "",
//     subjectId: "",
//     paperCode: "",
//     maxMarks: 100,
//     title: "",
//   });

//   // Fetch courses then subjects
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const courseResponse = await api.get("/api/exams");
//         setCourses(courseResponse.data.map((course) => course.courseName));
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         toast.error("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Then when a course is selected
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (!formData.course) return;

//       try {
//         setLoading(true);
//         const response = await api.get(
//           `/api/exams/${formData.course}/subjects`
//         );
//         setSubjects(
//           response.data.map((subject) => ({
//             SubjectID: subject.subjectId,
//             Subject: subject.subject,
//             Course: formData.course,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//         toast.error("Failed to load subjects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjects();
//   }, [formData.course]);

//   // Filter subjects when course changes
//   const filteredSubjects = subjects.filter(
//     (subject) => subject.Course === formData.course
//   );

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Auto-set subjectId when subject is selected
//     if (name === "subject") {
//       const selectedSubject = subjects.find((s) => s.Subject === value);
//       if (selectedSubject) {
//         setFormData((prev) => ({
//           ...prev,
//           subject: value,
//           subjectId: selectedSubject.SubjectID,
//         }));
//       }
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//     } else {
//       toast.error("Please select a valid PDF file");
//       setFile(null);
//       e.target.value = "";
//     }
//   };

//   // Upload paper form submission
//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please upload a question paper PDF");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Upload the file
//       const fileFormData = new FormData();
//       fileFormData.append("file", file);
//       fileFormData.append("paperCode", formData.paperCode);
//       fileFormData.append("subjectId", formData.subjectId);

//       const fileResponse = await api.post(
//         "/api/admin/upload-question-paper",
//         fileFormData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       // Create the paper record without questions yet
//       const paperData = {
//         ...formData,
//         filePath: fileResponse.data.filePath,
//         fragmentation: false // Set to false initially
//       };

//       const result = await api.post("/api/admin/create-paper", paperData);

//       toast.success("Question paper uploaded successfully");

//       // Reset form
//       setFormData({
//         course: "",
//         subject: "",
//         subjectId: "",
//         paperCode: "",
//         maxMarks: 100,
//         title: "",
//       });
//       setFile(null);
//       document.getElementById("paperFile").value = "";
      
//       // Suggest moving to fragmentation tab
//       toast.success("Now you can create the question structure", {
//         duration: 5000,
//         icon: '📋'
//       });
      
//     } catch (error) {
//       console.error("Error uploading question paper:", error);
//       toast.error("Failed to upload question paper");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Upload Question Paper
//         </h2>
//       </div>

//       <form onSubmit={handleUploadSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Course Selection */}
//           <div>
//             <label
//               htmlFor="course"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Course
//             </label>
//             <select
//               id="course"
//               name="course"
//               value={formData.course}
//               onChange={handleInputChange}
//               required
//               className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//             >
//               <option value="">Select Course</option>
//               {courses.map((course) => (
//                 <option key={course} value={course}>
//                   {course}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subject Selection */}
//           <div>
//             <label
//               htmlFor="subject"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Subject
//             </label>
//             <select
//               id="subject"
//               name="subject"
//               value={formData.subject}
//               onChange={handleInputChange}
//               required
//               disabled={!formData.course}
//               className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
//                 !formData.course ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               <option value="">Select Subject</option>
//               {filteredSubjects.map((subject) => (
//                 <option key={subject.SubjectID} value={subject.Subject}>
//                   {subject.Subject} ({subject.SubjectID})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Paper Code */}
//           <div>
//             <label
//               htmlFor="paperCode"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Paper Code
//             </label>
//             <input
//               type="text"
//               id="paperCode"
//               name="paperCode"
//               value={formData.paperCode}
//               onChange={handleInputChange}
//               required
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Paper Title */}
//           <div>
//             <label
//               htmlFor="title"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Paper Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Max Marks */}
//           <div>
//             <label
//               htmlFor="maxMarks"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Max Marks
//             </label>
//             <input
//               type="number"
//               id="maxMarks"
//               name="maxMarks"
//               value={formData.maxMarks}
//               onChange={handleInputChange}
//               required
//               min="1"
//               className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label
//               htmlFor="paperFile"
//               className="block text-sm font-medium text-gray-700"
//             >
//               <span className="text-red-500">*</span>Question Paper (PDF)
//             </label>
//             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//               <div className="space-y-1 text-center">
//                 <div className="flex text-sm text-gray-600">
//                   <label
//                     htmlFor="paperFile"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="paperFile"
//                       name="paperFile"
//                       type="file"
//                       className="sr-only"
//                       accept=".pdf"
//                       onChange={handleFileChange}
//                       required
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">PDF up to 10MB</p>
//                 {file && (
//                   <p className="text-sm text-green-600">{file.name} selected</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end pt-5">
//           <button
//             type="button"
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={() => {
//               setFormData({
//                 course: "",
//                 subject: "",
//                 subjectId: "",
//                 paperCode: "",
//                 maxMarks: 100,
//                 title: "",
//               });
//               setFile(null);
//               document.getElementById("paperFile").value = "";
//             }}
//           >
//             Reset
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
//               loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <CloudUploadIcon className="h-4 w-4 mr-1" />
//                 Upload Paper
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UploadPaper;


//? Complete Updated UploadPaper Component with Paper Upload Status Check

import { useState, useEffect } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../../../../api/axios";
import toast from "react-hot-toast";

const UploadPaper = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    course: "",
    subject: "",
    subjectId: "",
    paperCode: "",
    maxMarks: 100,
    title: "",
  });

  // Fetch courses then subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseResponse = await api.get("/api/exams");
        setCourses(courseResponse.data.map((course) => course.courseName));
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Then when a course is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.course) return;

      try {
        setLoading(true);
        const response = await api.get(
          `/api/exams/${formData.course}/subjects`
        );
        setSubjects(
          response.data.map((subject) => ({
            SubjectID: subject.subjectId,
            Subject: subject.subject,
            Course: formData.course,
            isPaperUploaded: subject.isPaperUploaded || false, // Include paper upload status
          }))
        );
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [formData.course]);

  console.log("Subjects with paper upload status:", subjects);
  

  // Filter subjects when course changes
  const filteredSubjects = subjects.filter(
    (subject) => subject.Course === formData.course
  );

  // Count subjects with existing papers
  const subjectsWithPapers = filteredSubjects.filter(s => s.isPaperUploaded).length;
  const totalSubjects = filteredSubjects.length;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent selecting subjects that already have papers
    if (name === "subject") {
      const selectedSubject = subjects.find((s) => s.Subject === value);
      if (selectedSubject && selectedSubject.isPaperUploaded) {
        toast.error("This subject already has a paper uploaded");
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-set subjectId when subject is selected
    if (name === "subject") {
      const selectedSubject = subjects.find((s) => s.Subject === value);
      if (selectedSubject) {
        setFormData((prev) => ({
          ...prev,
          subject: value,
          subjectId: selectedSubject.SubjectID,
        }));
      }
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid PDF file");
      setFile(null);
      e.target.value = "";
    }
  };

  // Upload paper form submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a question paper PDF");
      return;
    }

    // Double-check that the selected subject doesn't already have a paper
    const selectedSubject = subjects.find((s) => s.Subject === formData.subject);
    if (selectedSubject && selectedSubject.isPaperUploaded) {
      toast.error("This subject already has a paper uploaded. Please select a different subject.");
      return;
    }

    try {
      setLoading(true);

      // Upload the file
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      fileFormData.append("paperCode", formData.paperCode);
      fileFormData.append("subjectId", formData.subjectId);

      const fileResponse = await api.post(
        "/api/admin/upload-question-paper",
        fileFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Create the paper record without questions yet
      const paperData = {
        ...formData,
        filePath: fileResponse.data.filePath,
        fragmentation: false // Set to false initially
      };

      const result = await api.post("/api/admin/create-paper", paperData);

      toast.success("Question paper uploaded successfully");

      // Reset form
      setFormData({
        course: "",
        subject: "",
        subjectId: "",
        paperCode: "",
        maxMarks: 100,
        title: "",
      });
      setFile(null);
      document.getElementById("paperFile").value = "";
      
      // Suggest moving to fragmentation tab
      toast.success("Now you can create the question structure", {
        duration: 5000,
        icon: '📋'
      });
      
    } catch (error) {
      console.error("Error uploading question paper:", error);
      toast.error("Failed to upload question paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Upload Question Paper
        </h2>
      </div>

      {/* Paper Upload Status Summary */}
      {/* {formData.course && subjectsWithPapers > 0 && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-sm font-medium text-blue-800">
              Paper Upload Status
            </h3>
          </div>
          <p className="mt-1 text-xs text-blue-600">
            {subjectsWithPapers} out of {totalSubjects} subjects already have papers uploaded.
            {subjectsWithPapers === totalSubjects && (
              <span className="block mt-1 font-medium">All subjects in this course have papers. To add a new paper, select a different course.</span>
            )}
          </p>
        </div>
      )} */}

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Selection */}
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span>Course
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span>Subject
            </label>
            <div className="relative">
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={!formData.course}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                  !formData.course ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map((subject) => (
                  <option 
                    key={subject.SubjectID} 
                    value={subject.Subject}
                    disabled={subject.isPaperUploaded}
                    className={subject.isPaperUploaded ? "text-gray-400 bg-gray-100" : ""}
                  >
                    {subject.Subject} ({subject.SubjectID}) 
                    {subject.isPaperUploaded ? " - Already Uploaded" : ""}
                  </option>
                ))}
              </select>
              
              {/* Count indicator for subjects with papers */}
              {formData.course && subjectsWithPapers > 0 && (
                <div className="absolute right-10 top-2.5 pointer-events-none">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {subjectsWithPapers} with paper
                  </span>
                </div>
              )}
            </div>
            
            {/* Helper text for subjects with papers */}
            {formData.course && subjectsWithPapers > 0 && (
              <p className="mt-1 text-xs text-gray-500 italic">
                Subjects with existing papers are disabled to prevent duplicates
              </p>
            )}
          </div>

          {/* Paper Code */}
          <div>
            <label
              htmlFor="paperCode"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span>Paper Code
            </label>
            <input
              type="text"
              id="paperCode"
              name="paperCode"
              value={formData.paperCode}
              onChange={handleInputChange}
              required
              className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* Paper Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Paper Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* Max Marks */}
          <div>
            <label
              htmlFor="maxMarks"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span>Max Marks
            </label>
            <input
              type="number"
              id="maxMarks"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleInputChange}
              required
              min="1"
              className="mt-1 p-1 px-3 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label
              htmlFor="paperFile"
              className="block text-sm font-medium text-gray-700"
            >
              <span className="text-red-500">*</span>Question Paper (PDF)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="paperFile"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="paperFile"
                      name="paperFile"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {file && (
                  <p className="text-sm text-green-600">{file.name} selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-5">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setFormData({
                course: "",
                subject: "",
                subjectId: "",
                paperCode: "",
                maxMarks: 100,
                title: "",
              });
              setFile(null);
              document.getElementById("paperFile").value = "";
            }}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || (formData.course && subjectsWithPapers === totalSubjects)}
            className={`ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              loading || (formData.course && subjectsWithPapers === totalSubjects) 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <CloudUploadIcon className="h-4 w-4 mr-1" />
                Upload Paper
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPaper;