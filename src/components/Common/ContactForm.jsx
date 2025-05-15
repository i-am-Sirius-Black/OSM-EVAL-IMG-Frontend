import { useState, useEffect } from 'react';
import { constants } from '../../utils/constants';

const { contact } = constants;

const ContactForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Error state for validation
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Handle animation with CSS transitions
  useEffect(() => {
    if (submitted) {
      setFadeIn(true);
    }
  }, [submitted]);

  // Form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setSubmitted(false);
        setFadeIn(false);
      }, 3000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-5xl mx-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
          {/* Left section - Contact info */}
          <div className="w-2/5 bg-gradient-to-br from-gray-600 to-gray-800 text-white p-8 hidden md:block">
            <h1 className="text-2xl font-medium mb-8">Get in touch</h1>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-4 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.25 6.75C2.25 15.034 8.966 21.75 17.25 21.75H19.5C20.0967 21.75 20.669 21.5129 21.091 21.091C21.5129 20.669 21.75 20.0967 21.75 19.5V18.128C21.75 17.612 21.399 17.162 20.898 17.037L16.475 15.931C16.035 15.821 15.573 15.986 15.302 16.348L14.332 17.641C14.05 18.017 13.563 18.183 13.122 18.021C11.4849 17.4191 9.99815 16.4686 8.76478 15.2352C7.53141 14.0018 6.58087 12.5151 5.979 10.878C5.817 10.437 5.983 9.95 6.359 9.668L7.652 8.698C8.015 8.427 8.179 7.964 8.069 7.525L6.963 3.102C6.90214 2.85869 6.76172 2.6427 6.56405 2.48834C6.36638 2.33397 6.1228 2.25008 5.872 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm opacity-90">{contact.phone}</p>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-4 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.75 6.75V17.25C21.75 18.4926 20.7426 19.5 19.5 19.5H4.5C3.25736 19.5 2.25 18.4926 2.25 17.25V6.75M21.75 6.75C21.75 5.50736 20.7426 4.5 19.5 4.5H4.5C3.25736 4.5 2.25 5.50736 2.25 6.75M21.75 6.75V6.99366C21.75 7.77979 21.2608 8.47182 20.5208 8.80438L13.0208 12.0544C12.3947 12.3417 11.6053 12.3417 10.9792 12.0544L3.47925 8.80438C2.73921 8.47182 2.25 7.77979 2.25 6.99366V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm opacity-90">{contact.email}</p>
              </div>
              
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-4 mt-0.5 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10.5C15 12.1569 13.6569 13.5 12 13.5C10.3431 13.5 9 12.1569 9 10.5C9 8.84315 10.3431 7.5 12 7.5C13.6569 7.5 15 8.84315 15 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 10.5C19.5 17.6421 12 21.75 12 21.75C12 21.75 4.5 17.6421 4.5 10.5C4.5 6.35786 7.85786 3 12 3C16.1421 3 19.5 6.35786 19.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-sm opacity-90">{contact.address}</p>
              </div>
            </div>

            {/* Uncomment if you want to add social media links */}
            {/* <div className="mt-12">
              <h2 className="text-sm font-medium mb-3">Follow us</h2>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div> */}

          </div>
          
          {/* Right section - Form */}
          <div className="w-full md:w-3/5 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-800">Send a message</h2>
              <p className="text-sm text-gray-500 mt-1">We'll get back to you as soon as possible</p>
            </div>
            
            {submitted ? (
              <div 
                className={`h-64 flex items-center justify-center transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Message sent!</h3>
                  <p className="text-sm text-gray-500 mt-1">We'll be in touch soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full py-2 px-3 text-gray-700 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : ''}`}
                      placeholder="Full name"
                    />
                    {errors.name && <span className="absolute right-3 top-2.5 text-xs text-red-500">{errors.name}</span>}
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full py-2 px-3 text-gray-700 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="Email address"
                    />
                    {errors.email && <span className="absolute right-3 top-2.5 text-xs text-red-500">{errors.email}</span>}
                  </div>
                </div>
                
                <div>
                  <div className="relative">
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full h-28 py-2 px-3 text-gray-700 text-sm bg-gray-50 border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.message ? 'border-red-400' : ''}`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && <span className="absolute right-3 top-2.5 text-xs text-red-500">{errors.message}</span>}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded shadow-sm transition-colors"
                >
                  Send message
                </button>
              </form>
            )}
            
            {/* Mobile contact info */}
            <div className="mt-8 md:hidden">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Contact information</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;