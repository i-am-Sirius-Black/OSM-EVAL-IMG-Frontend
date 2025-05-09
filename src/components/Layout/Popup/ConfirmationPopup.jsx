// Custom Confirmation Popup component
const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with click-away functionality */}
        <div 
          className="absolute inset-0 bg-black/30" 
          onClick={onClose}
        ></div>
        
        {/* Popup card */}
        <div className="bg-white rounded-lg shadow-lg w-80 p-4 z-10 animate-fadeIn">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Going Back?</h3>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default ConfirmationPopup;