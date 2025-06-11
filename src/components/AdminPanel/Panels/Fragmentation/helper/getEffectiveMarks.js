/**
 * Calculates the effective marks for a question group, considering choice-based options
 * @param {Object} group - The question group object
 * @param {Array} group.subquestions - Array of subquestions
 * @param {boolean} group.choiceBased - Whether the group is choice-based
 * @param {number} group.choiceCount - Number of questions to attempt (for choice-based)
 * @param {string|number} group.maxMarks - Maximum marks for the group
 * @returns {number} Effective total marks for the group
 */
const getEffectiveMarks = (group) => {
  // Handle case where there are no subquestions
  if (!group.subquestions || group.subquestions.length === 0) {
    return parseFloat(group.maxMarks) || 0;
  }

  // Handle choice-based groups
  if (group.choiceBased && group.choiceCount) {
    const subqTotal = group.subquestions.reduce(
      (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
      0
    );
    
    // If all subquestions have the same marks
    const firstMark = parseFloat(group.subquestions[0]?.maxMarks) || 0;
    if (group.subquestions.every(sq => parseFloat(sq.maxMarks) === firstMark)) {
      return group.choiceCount * firstMark;
    }
    
    // Otherwise use average as approximation
    const avgMarksPerSubquestion = subqTotal / group.subquestions.length;
    return group.choiceCount * avgMarksPerSubquestion;
  }

  // Regular case - sum all subquestion marks
  return group.subquestions.reduce(
    (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
    0
  );
};


export default getEffectiveMarks;