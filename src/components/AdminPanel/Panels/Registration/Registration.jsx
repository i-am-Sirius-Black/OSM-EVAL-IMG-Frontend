import React, { useState } from "react";
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic form validation
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Mock response instead of API call
      const mockResponse = {
        data: {
          uid: "uid123",
          password: "1234",
          name: formData.name,
          email: formData.email,
        },
      };

      if (mockResponse.data) {
        toast.success("Evaluator registered successfully!");
        setGeneratedCredentials({
          uid: mockResponse.data.uid,
          password: mockResponse.data.password,
          name: mockResponse.data.name,
          email: mockResponse.data.email,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register evaluator");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!generatedCredentials) return;

    const text = `
      Name: ${generatedCredentials.name}
      Email: ${generatedCredentials.email}
      User ID: ${generatedCredentials.uid}
      Password: ${generatedCredentials.password}
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

  //   const [formData, setFormData] = useState({
  //     name: '',
  //     email: '',
  //     phone: '',
  //   });

  //   const [loading, setLoading] = useState(false);
  //   const [generatedCredentials, setGeneratedCredentials] = useState(null);
  //   const [showPassword, setShowPassword] = useState(false);

  //   const handleInputChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     try {
  //       // Basic form validation
  //       if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
  //         toast.error('Please fill in all required fields');
  //         setLoading(false);
  //         return;
  //       }

  //       // Call API to register evaluator
  //       const response = await api.post('/api/admin/register-evaluator', formData);

  //       if (response.data) {
  //         toast.success('Evaluator registered successfully!');
  //         setGeneratedCredentials({
  //           uid: response.data.uid,
  //           password: response.data.password,
  //           name: response.data.name || formData.name,
  //           email: response.data.email || formData.email
  //         });

  //         // Reset form
  //         setFormData({
  //           name: '',
  //           email: '',
  //           phone: '',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Registration error:', error);
  //       const errorMessage = error.response?.data?.error || 'Failed to register evaluator';
  //       toast.error(errorMessage);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handleCopyCredentials = () => {
  //     if (!generatedCredentials) return;

  //     const text = `
  // Name: ${generatedCredentials.name}
  // Email: ${generatedCredentials.email}
  // User ID: ${generatedCredentials.uid}
  // Password: ${generatedCredentials.password}
  //     `;

  //     navigator.clipboard.writeText(text.trim());
  //     toast.success('Credentials copied to clipboard!');
  //   };

  //   const handleCreateAnother = () => {
  //     setGeneratedCredentials(null);
  //   };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        {/* <h2 className="text-lg font-semibold text-gray-800">Evaluator Registration</h2> */}
        <p className="mt-1 text-sm text-gray-500">
          Register new evaluators and generate their login credentials
        </p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
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
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter evaluator's full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
                      Registering...
                    </>
                  ) : (
                    "Register Evaluator"
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Footer info - Made more compact */}
      <div className="px-5 py-3 bg-gray-50 rounded-b-lg text-xs text-gray-600">
        <p className="font-medium text-gray-700 mb-1">Note:</p>
        <p>
          User ID and password are automatically generated. Please share these
          credentials securely with the evaluator.
        </p>
      </div>
    </div>
  );
};

export default Registration;

