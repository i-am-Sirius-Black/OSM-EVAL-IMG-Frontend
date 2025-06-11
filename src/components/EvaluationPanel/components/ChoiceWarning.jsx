import React from 'react';

const ChoiceWarning = ({ question, markedCount }) => {
  if (!question.isChoiceBased) return null;
  
  // If too many parts are marked, show a warning to remove some
  if (markedCount > question.choiceAttemptCount) {
    return (
      <div className="mt-2 text-xs text-red-600 font-medium">
        Please remove {markedCount - question.choiceAttemptCount} marked part(s).
        Only {question.choiceAttemptCount} parts should be evaluated.
      </div>
    );
  }
  
  // If we need more parts marked, show a hint
  if (markedCount < question.choiceAttemptCount) {
    return (
      <div className="mt-2 text-xs text-blue-600 font-medium">
        Please mark {question.choiceAttemptCount - markedCount} more part(s) for this question.
      </div>
    );
  }
  
  // If exactly the right number are marked, show confirmation
  return (
    <div className="mt-2 text-xs text-green-600 font-medium">
      Perfect! You've marked exactly {question.choiceAttemptCount} parts as required.
    </div>
  );
};

export default ChoiceWarning;