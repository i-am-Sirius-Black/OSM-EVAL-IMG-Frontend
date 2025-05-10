import React from 'react';

const CustomAlert = ({ message, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        {/* Cancel (X) button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          x
        </button>

        {/* Alert Message */}
        <div className="text-gray-800 text-lg mb-6 text-center">{message}</div>

        {/* OK Button */}
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
