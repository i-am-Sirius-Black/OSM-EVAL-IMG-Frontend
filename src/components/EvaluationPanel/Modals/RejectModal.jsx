import { useState } from 'react';

const REJECT_REASONS = [
  { id: 'ufm', label: 'UFM' },
  { id: 'download_issue', label: 'Answer script not downloading issue' },
  { id: 'quality_issue', label: 'Image Quality Issue' },
  { id: 'others', label: 'Others' }
];

const RejectModal = ({ copyId, isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-1">Copy ID</div>
          <div className="text-lg font-semibold">{copyId}</div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              {REJECT_REASONS.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-400 text-xs ml-1">
                ({description.length}/256)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 256))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rejection reason details..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!reason) {
                alert('Please select a rejection category');
                return;
              }
              onConfirm({ reason, description });
            }}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;