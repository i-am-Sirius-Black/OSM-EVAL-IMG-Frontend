import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    uid: '',
    pass: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateUID = async () => {
    try {
      const response = await api.get('/getNewUID'); // Call the backend API
      if (response.status === 200) {
        setFormData({ ...formData, uid: response.data.newUID }); // Set the new UID
      } else {
        setError('Failed to generate UID. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Internal server error while generating UID.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/register', formData);

      if (response.status === 201) {
        setSuccess(response.data.message || 'Registration successful!');
        setFormData({ name: '', email: '', phoneNumber: '', uid: '', pass: '' });

        // Redirect to '/' after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Internal server error. Please try again later.');
    }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Create an Account</h1>
          <p className="text-sm text-gray-500 text-center mt-2">Sign up to get started</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your name"
                  autoComplete="off"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your phone number"
                  autoComplete="off"
                  required
                />
              </div>

              {/* UID */}
              <div className="space-y-2">
                <label htmlFor="uid" className="block text-sm font-medium text-gray-700">
                  UID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="uid"
                    type="text"
                    name="uid"
                    value={formData.uid}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Generate UID"
                    autoComplete="off"
                    disabled
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateUID}
                    className="px-2 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="pass" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="pass"
                type="password"
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                autoComplete="off"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </div>

        {/* Login Link Section */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 p-2">
            © 2025 TTSPL. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;