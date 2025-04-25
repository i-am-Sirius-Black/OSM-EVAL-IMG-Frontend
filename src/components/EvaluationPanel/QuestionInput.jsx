import { useState } from "react";

function QuestionInput({ question, value, onChange }) {
    const [warning, setWarning] = useState(null);
  
    const handleChange = (e) => {
      const val = Number(e.target.value);
      if (val > question.maxMarks) {
        setWarning(`Marks cannot exceed ${question.maxMarks}.`);
      } else {
        setWarning(null);
        onChange(val);
      }
    };
  
    return (
      <div className="flex items-center justify-between  bg-gray-50 p-3 rounded-lg shadow-sm">
        <span className="text-sm font-medium text-gray-700">{question.id}</span>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            max={question.maxMarks}
            value={value}
            onChange={handleChange}
            className="w-16 p-2 text-xs text-center border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <span className="text-sm text-gray-500">/ {question.maxMarks}</span>
        </div>
        {warning && (
          <div className="absolute mt-12 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md text-xs">
            {warning}
          </div>
        )}
      </div>
    );
  }
  
  export default QuestionInput;