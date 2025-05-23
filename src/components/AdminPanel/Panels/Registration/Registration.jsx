// import React, { useState } from "react";
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

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Basic form validation
//       if (
//         !formData.name.trim() ||
//         !formData.email.trim() ||
//         !formData.phone.trim()
//       ) {
//         toast.error("Please fill in all required fields");
//         setLoading(false);
//         return;
//       }

//       // Call API to register evaluator
//       const response = await api.post(
//         "/api/admin/register-evaluator",
//         formData
//       );

//       // Check for success based on the controller response format
//       if (response.data && response.data.success) {
//         toast.success(
//           response.data.message || "Evaluator registered successfully!"
//         );
//         setGeneratedCredentials({
//           uid: response.data.uid,
//           password: response.data.password,
//           name: response.data.name,
//           email: response.data.email,
//         });

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//         });
//       } else {
//         // Handle unexpected success response format
//         toast.error("Unexpected response format from server");
//         console.error("Unexpected response format:", response.data);
//       }
//     } catch (error) {
//       console.error("Registration error:", error);

//       // Extract error message from controller's response format
//       const errorMessage =
//         error.response?.data?.error || "Failed to register evaluator";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopyCredentials = () => {
//     if (!generatedCredentials) return;

//     const text = `
//   Name: ${generatedCredentials.name}
//   Email: ${generatedCredentials.email}
//   User ID: ${generatedCredentials.uid}
//   Password: ${generatedCredentials.password}
//       `;

//     navigator.clipboard.writeText(text.trim());
//     toast.success("Credentials copied to clipboard!");
//   };

//   const handleCreateAnother = () => {
//     setGeneratedCredentials(null);
//   };

//   const handleCloseModal = () => {
//     setGeneratedCredentials(null);
//   };

//   return (
//     <div className="bg-white h-full flex flex-col">
//       {/* Header */}
//       <div className="px-8 py-3 border-b border-gray-100">
//         <p className="text-gray-600 text-sm">
//           Register new evaluators and generate login credentials
//         </p>
//       </div>

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
//           <div className="w-full max-w-sm">
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
  });

  const [loading, setLoading] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentialsHistory, setCredentialsHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

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
          password: response.data.password,
          name: response.data.name,
          email: response.data.email,
        };

        setGeneratedCredentials(credentials);
        saveToHistory(credentials);

        setFormData({
          name: "",
          email: "",
          phone: "",
        });
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
Password: ${credentials.password}
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

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-3 border-b border-gray-100 flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          Register new evaluators and generate login credentials
        </p>
        {credentialsHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {showHistory
              ? "Hide History"
              : `History (${credentialsHistory.length})`}
          </button>
        )}
      </div>

      {/* History Panel */}
      {showHistory && credentialsHistory.length > 0 && (
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                Recent Credentials
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <table className="min-w-full text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Password</th>
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
                      <td className="px-3 py-2 text-gray-600">
                        {cred.password}
                      </td>
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
          <div className="w-full max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-900"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
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
                  "Create Evaluator"
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Login credentials are automatically generated and should be shared
          securely
        </p>
      </div>
    </div>
  );
};

export default Registration;
