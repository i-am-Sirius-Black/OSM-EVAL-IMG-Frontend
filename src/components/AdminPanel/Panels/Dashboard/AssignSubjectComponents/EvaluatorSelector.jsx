import { useState } from "react";


// EvaluatorSelector Component
const EvaluatorSelector = ({ evaluators, selectedEvaluator, setSelectedEvaluator }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredEvaluators = evaluators.filter(evaluator => 
    evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evaluator.email && evaluator.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">Evaluator</label>
        {selectedEvaluator && (
          <button 
            onClick={() => setSelectedEvaluator(null)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear
          </button>
        )}
      </div>
      
      {!selectedEvaluator ? (
        <>
          <div className="relative mb-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Search by name or email..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {filteredEvaluators.map(evaluator => (
              <div 
                key={evaluator.id}
                onClick={() => setSelectedEvaluator(evaluator)}
                className="px-3 py-2 text-sm rounded border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300"
              >
                <div className="font-medium truncate">{evaluator.name}</div>
                {evaluator.email && (
                  <div className="text-xs text-gray-500 truncate">{evaluator.email}</div>
                )}
                {evaluator.copyCount > 0 && (
                  <div className="mt-1 text-xs text-blue-600">
                    {evaluator.copyCount} {evaluator.copyCount === 1 ? 'copy' : 'copies'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="font-medium">{selectedEvaluator.name}</div>
          {selectedEvaluator.email && (
            <div className="text-sm text-gray-600">{selectedEvaluator.email}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluatorSelector;