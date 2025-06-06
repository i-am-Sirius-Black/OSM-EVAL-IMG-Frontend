//?v3. new fields

//?v2 localstorage history saving constants

const HISTORY_KEY = "credentialsHistory";
const HISTORY_EXPIRY_MS = 1000 * 60 * 60 * 12; // 12 hours

//? v2 with credentials generation history
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../api/axios";
import SuccessModal from "./SuccessModal";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaarNumber: "",
    address: "",
    instituteName: "",
    instituteCode: "",
    facultyId: "",
  });

  const [loading, setLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsHistory, setCredentialsHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const now = Date.now();

    // Filter expired entries
    const validHistory = stored.filter(
      (entry) => now - entry.timestamp < HISTORY_EXPIRY_MS
    );

    setCredentialsHistory(validHistory);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveToHistory = (credentials) => {
    const newEntry = {
      ...credentials,
      timestamp: Date.now(),
      id: Date.now(), // unique ID
    };

    const updatedHistory = [newEntry, ...credentialsHistory];

    // Update state
    setCredentialsHistory(updatedHistory);

    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone is required");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^\d]/g, ''))) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (!formData.aadhaarNumber.trim()) {
      toast.error("Aadhaar number is required");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    
    // Basic Aadhaar validation (12 digits)
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(formData.aadhaarNumber.replace(/[^\d]/g, ''))) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.instituteName.trim()) {
      toast.error("Institute name is required");
      return;
    }
    if (!formData.instituteCode.trim()) {
      toast.error("Institute code is required");
      return;
    }
    if (!formData.facultyId.trim()) {
      toast.error("Faculty ID is required");
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post(
        "/api/admin/register-evaluator",
        formData
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || "Evaluator registered successfully!"
        );

        const credentials = {
          uid: response.data.uid,
          // password: response.data.password,
          name: response.data.name,
          email: response.data.email,
        };

        setGeneratedCredentials(credentials);
        saveToHistory(credentials);

        setFormData({
          name: "",
          email: "",
          phone: "",
          aadhaarNumber: "",
          address: "",
          instituteName: "",
          instituteCode: "",
          facultyId: "",
        });
        
        setCurrentStep(1);
      } else {
        toast.error("Unexpected response format from server");
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to register evaluator";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = (credentials = generatedCredentials) => {
    if (!credentials) return;

    const text = `
Name: ${credentials.name}
Email: ${credentials.email}
User ID: ${credentials.uid}
    `;

    navigator.clipboard.writeText(text.trim());
    toast.success("Credentials copied to clipboard!");
  };

  const handleCreateAnother = () => {
    setGeneratedCredentials(null);
  };

  const handleCloseModal = () => {
    setGeneratedCredentials(null);
  };

  const clearHistory = () => {
    setCredentialsHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success("History cleared");
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Form step content
  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Basic Information
            </h3>
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Details
            </h3>
            <div className="space-y-5">
              {/* Aadhaar Number */}
              <div>
                <label
                  htmlFor="aadhaarNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Aadhaar Number <span className="text-red-600">*</span>
                </label>
                <input
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter 12-digit number without spaces
                </p>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter full address"
                  required
                />
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Institution Details
            </h3>
            <div className="space-y-5">
              {/* Institute Name */}
              <div>
                <label
                  htmlFor="instituteName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Institute Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="instituteName"
                  name="instituteName"
                  type="text"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter institute name"
                  required
                />
              </div>

              {/* Institute Code */}
              <div>
                <label
                  htmlFor="instituteCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Institute Code <span className="text-red-600">*</span>
                </label>
                <input
                  id="instituteCode"
                  name="instituteCode"
                  type="text"
                  value={formData.instituteCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter institute code"
                  required
                />
              </div>

              {/* Faculty ID */}
              <div>
                <label
                  htmlFor="facultyId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Faculty ID <span className="text-red-600">*</span>
                </label>
                <input
                  id="facultyId"
                  name="facultyId"
                  type="text"
                  value={formData.facultyId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  placeholder="Enter faculty ID"
                  required
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Register Evaluator</h2>
          <p className="text-sm text-gray-600 mt-1">
            Register new evaluators and generate login credentials
          </p>
        </div>
        {credentialsHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors flex items-center"
          >
            {showHistory ? (
              <span>Hide History</span>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History ({credentialsHistory.length})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* History Panel */}
      {showHistory && credentialsHistory.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Recent Credentials
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-colors flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">ID</th>
                    {/* <th className="px-3 py-2">Password</th> */}
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {credentialsHistory.map((cred) => (
                    <tr key={cred.id} className="hover:bg-gray-50 text-xs">
                      <td className="px-3 py-2 font-medium text-gray-900">
                        {cred.name}
                      </td>
                      <td className="px-3 py-2 text-gray-600">{cred.email}</td>
                      <td className="px-3 py-2 text-gray-600">{cred.uid}</td>
                      {/* <td className="px-3 py-2 text-gray-600">
                        {cred.password}
                      </td> */}
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleCopyCredentials(cred)}
                          className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-6">
        {generatedCredentials ? (
          <SuccessModal
            credentials={generatedCredentials}
            onCopy={handleCopyCredentials}
            onCreateAnother={handleCreateAnother}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onClose={handleCloseModal}
          />
        ) : (
          <div className="w-full max-w-2xl">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="relative">
                      <div 
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                          currentStep === step
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : currentStep > step
                            ? "border-green-500 bg-green-50 text-green-500"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {currentStep > step ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-max text-xs font-medium text-gray-500">
                        {step === 1 ? "Basic Info" : step === 2 ? "Personal" : "Institution"}
                      </div>
                    </div>
                    {step < 3 && (
                      <div 
                        className={`w-16 h-1 ${
                          currentStep > step ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 mt-6">
              {renderFormContent()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      <>
                        Create Evaluator
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Login credentials are automatically generated and should be shared securely with evaluators
        </p>
      </div>
    </div>
  );
};

export default Registration;












// //?v2 localstorage history saving constants

// const HISTORY_KEY = "credentialsHistory";
// const HISTORY_EXPIRY_MS = 1000 * 60 * 60 * 12; // 12 hours

// //? v2 with credentials generation history
// import React, { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";
// import api from "../../../../api/axios";
// import SuccessModal from "./SuccessModal";

// const Registration = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [generatedCredentials, setGeneratedCredentials] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [credentialsHistory, setCredentialsHistory] = useState([]);
//   const [showHistory, setShowHistory] = useState(false);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
//     const now = Date.now();

//     // Filter expired entries
//     const validHistory = stored.filter(
//       (entry) => now - entry.timestamp < HISTORY_EXPIRY_MS
//     );

//     setCredentialsHistory(validHistory);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const saveToHistory = (credentials) => {
//     const newEntry = {
//       ...credentials,
//       timestamp: Date.now(),
//       id: Date.now(), // unique ID
//     };

//     const updatedHistory = [newEntry, ...credentialsHistory];

//     // Update state
//     setCredentialsHistory(updatedHistory);

//     // Save to localStorage
//     localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (
//         !formData.name.trim() ||
//         !formData.email.trim() ||
//         !formData.phone.trim()
//       ) {
//         toast.error("Please fill in all required fields");
//         setLoading(false);
//         return;
//       }

//       const response = await api.post(
//         "/api/admin/register-evaluator",
//         formData
//       );

//       if (response.data && response.data.success) {
//         toast.success(
//           response.data.message || "Evaluator registered successfully!"
//         );

//         const credentials = {
//           uid: response.data.uid,
//           password: response.data.password,
//           name: response.data.name,
//           email: response.data.email,
//         };

//         setGeneratedCredentials(credentials);
//         saveToHistory(credentials);

//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//         });
//       } else {
//         toast.error("Unexpected response format from server");
//         console.error("Unexpected response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       const errorMessage =
//         error.response?.data?.error || "Failed to register evaluator";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopyCredentials = (credentials = generatedCredentials) => {
//     if (!credentials) return;

//     const text = `
// Name: ${credentials.name}
// Email: ${credentials.email}
// User ID: ${credentials.uid}
// Password: ${credentials.password}
//     `;

//     navigator.clipboard.writeText(text.trim());
//     toast.success("Credentials copied to clipboard!");
//   };

//   const handleCreateAnother = () => {
//     setGeneratedCredentials(null);
//   };

//   const handleCloseModal = () => {
//     setGeneratedCredentials(null);
//   };

//   const clearHistory = () => {
//     setCredentialsHistory([]);
//     localStorage.removeItem(HISTORY_KEY);
//     toast.success("History cleared");
//   };

//   const formatTimestamp = (timestamp) => {
//     return new Date(timestamp).toLocaleString();
//   };

//   return (
//     <div className="bg-white h-full flex flex-col">
//       {/* Header */}
//       <div className="px-8 py-3 border-b border-gray-100 flex justify-between items-center">
//         <p className="text-gray-600 text-sm">
//           Register new evaluators and generate login credentials
//         </p>
//         {credentialsHistory.length > 0 && (
//           <button
//             onClick={() => setShowHistory(!showHistory)}
//             className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
//           >
//             {showHistory
//               ? "Hide History"
//               : `History (${credentialsHistory.length})`}
//           </button>
//         )}
//       </div>

//       {/* History Panel */}
//       {showHistory && credentialsHistory.length > 0 && (
//         <div className="border-b border-gray-100 bg-gray-50">
//           <div className="px-8 py-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-sm font-medium text-gray-900">
//                 Recent Credentials
//               </h3>
//               <button
//                 onClick={clearHistory}
//                 className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
//               >
//                 Clear All
//               </button>
//             </div>
//             <div className="space-y-2 max-h-48 overflow-y-auto">
//               <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
//                 <thead className="bg-gray-50 text-gray-700">
//                   <tr>
//                     <th className="px-3 py-2">Name</th>
//                     <th className="px-3 py-2">Email</th>
//                     <th className="px-3 py-2">ID</th>
//                     <th className="px-3 py-2">Password</th>
//                     <th className="px-3 py-2 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {credentialsHistory.map((cred) => (
//                     <tr key={cred.id} className="hover:bg-gray-50 text-xs">
//                       <td className="px-3 py-2 font-medium text-gray-900">
//                         {cred.name}
//                       </td>
//                       <td className="px-3 py-2 text-gray-600">{cred.email}</td>
//                       <td className="px-3 py-2 text-gray-600">{cred.uid}</td>
//                       <td className="px-3 py-2 text-gray-600">
//                         {cred.password}
//                       </td>
//                       <td className="px-3 py-2 text-center">
//                         <button
//                           onClick={() => handleCopyCredentials(cred)}
//                           className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
//                         >
//                           Copy
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="flex-1 flex items-center justify-center px-8 py-6">
//         {generatedCredentials ? (
//           <SuccessModal
//             credentials={generatedCredentials}
//             onCopy={handleCopyCredentials}
//             onCreateAnother={handleCreateAnother}
//             showPassword={showPassword}
//             setShowPassword={setShowPassword}
//             onClose={handleCloseModal}
//           />
//         ) : (
//           <div className="w-full max-w-xl">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Full Name */}
//               <div className="space-y-1">
//                 <label
//                   htmlFor="name"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                   placeholder="Enter full name"
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="space-y-1">
//                 <label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                   placeholder="Enter email address"
//                   required
//                 />
//               </div>

//               {/* Phone */}
//               <div className="space-y-1">
//                 <label
//                   htmlFor="phone"
//                   className="text-sm font-medium text-gray-900"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
//                   placeholder="Enter phone number"
//                   required
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Creating...
//                   </div>
//                 ) : (
//                   "Create Evaluator"
//                 )}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>

//       {/* Footer Note */}
//       <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
//         <p className="text-xs text-gray-500 text-center">
//           Login credentials are automatically generated and should be shared
//           securely
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Registration;
