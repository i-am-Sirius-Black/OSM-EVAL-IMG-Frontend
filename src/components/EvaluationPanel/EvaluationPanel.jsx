import { memo, useEffect, useState } from 'react';
import QuestionInput from './QuestionInput';

const EvaluationPanel = memo(({ marks, setMarks, annotations }) => {

      // 🔘 For alert modal
      const [showAlert, setShowAlert] = useState(false);

  const questions = [
    { id: 'Q1', maxMarks: 20 },
    { id: 'Q2', maxMarks: 20 },
    { id: 'Q3', maxMarks: 20 },
    { id: 'Q4A', maxMarks: 30 },
    { id: 'Q4B', maxMarks: 10 },
  ];

  const annotatedPages = Array.from(new Set(annotations.map((a) => a.page)));
  const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);



    // 🔍 Find unannotated pages  // future usage
    // const totalPages = 36;
    // const allPages = Array.from({ length: totalPages }, (_, i) => i + 1);
    // const notAnnotatedPages = allPages.filter((p) => !annotatedPages.includes(p));
  


  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total Marks:</span>
            <span className="text-lg font-bold text-red-600">{totalMarks} / 100</span>
          </div>
        </div>
        <div className="space-y-3">
          {questions.map((q) => (
            <QuestionInput
              key={q.id}
              question={q}
              value={marks[q.id] || ''}
              onChange={(value) => setMarks((prev) => ({ ...prev, [q.id]: value }))}
            />
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-600">
          <span>Pages Annotated: </span>
          <span className="font-medium">{annotatedPages.length} / 36</span>
        </div>
      </div>


    </div>
  );
});

export default EvaluationPanel;