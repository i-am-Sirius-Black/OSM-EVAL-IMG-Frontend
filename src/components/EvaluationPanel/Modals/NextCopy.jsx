import { useEffect, useState } from "react";

export default function NextCopyModal({ 
  isOpen, 
  onClose, 
  onContinue, 
  timeLeft, 
  remainingCount 
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal panel */}
        <div 
          className="relative mx-auto max-w-sm rounded-lg bg-white shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Title */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Continue to Next Copy?
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-500 mb-4">
              {remainingCount} more {remainingCount === 1 ? 'copy' : 'copies'} in this batch {remainingCount === 1 ? 'is' : 'are'} waiting to be evaluated.
            </p>
            
            {/* Progress bar */}
            <div className="mb-4 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-100 ease-linear" 
                style={{ width: `${(timeLeft / 3) * 100}%` }}
              ></div>
            </div>
            
            {/* Timer text */}
            <p className="text-sm text-gray-500 mb-4 text-center">
              Auto-continuing in {timeLeft} seconds
            </p>
            
            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Return to List
              </button>
              <button
                onClick={onContinue}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}