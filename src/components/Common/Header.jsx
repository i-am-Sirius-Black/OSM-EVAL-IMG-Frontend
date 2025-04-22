import { FileCopyIcon } from '@mui/icons-material';
import Timer from '../Common/Timer'; // Assume you have this component
import InternetSpeedDisplay from '../Common/InternetSpeedDisplay'; // Assume you have this

function Header({ selectedCopy, setSelectedCopy, copies, selectedSubject, handleSubmit }) {
  const handleCopySelection = (e) => {
    const selectedCopyId = parseInt(e.target.value);
    setSelectedCopy(copies.find((copy) => copy.s_no === selectedCopyId));
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      {/* Copy Selector */}
      <div className="relative w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FileCopyIcon className="w-5 h-5 text-gray-500" />
        </div>
        <select
          value={selectedCopy?.s_no || ''}
          onChange={handleCopySelection}
          className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="" disabled>
            Select a Copy
          </option>
          {copies.map((copy) => (
            <option key={copy.copy_barcode} value={copy.s_no}>
              {copy.copy_barcode}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">Subject:</span>
          <span className="text-sm font-semibold text-gray-900">{selectedSubject}</span>
        </div>
        <Timer isRunning={!!selectedCopy} onSubmit={handleSubmit} copyId={selectedCopy?.copy_barcode} />
        <InternetSpeedDisplay />
      </div>
    </div>
  );
}

export default Header;