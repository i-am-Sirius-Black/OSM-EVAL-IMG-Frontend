
const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg p-5 w-80">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Reset Annotation Markings</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to reset all annotations and marks on this copy?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default ResetConfirmationModal;