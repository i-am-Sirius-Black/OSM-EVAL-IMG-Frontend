import { useEffect, useRef } from 'react';

const SuccessModal = ({ 
  credentials, 
  onCopy, 
  onCreateAnother, 
  showPassword, 
  setShowPassword,
  onClose
}) => {
  const modalRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="relative max-w-md w-full mx-auto bg-white rounded-lg p-5 border border-green-200"
      >
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-base font-medium text-gray-900 text-center mb-3">
          Registration Successful
        </h3>
        
        <div className="bg-white rounded-md p-4 border border-gray-200 mb-4">
          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-medium">{credentials.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{credentials.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">User ID</p>
              <p className="font-medium">{credentials.uid}</p>
            </div>
            <div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">Password</p>
                <button 
                  type="button" 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="font-medium">
                {showPassword ? credentials.password : '••••••••••'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onCopy}
            className="flex-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Copy
          </button>
          <button
            onClick={onCreateAnother}
            className="flex-1 flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;