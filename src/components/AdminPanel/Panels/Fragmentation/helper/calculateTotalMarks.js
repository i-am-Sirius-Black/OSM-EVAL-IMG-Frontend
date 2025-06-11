export const calculateTotalMarks = (questionGroups) => {
  return questionGroups.reduce((total, group) => {
    if (group.subquestions.length === 0) {
      return total + (parseFloat(group.maxMarks) || 0);
    } else if (group.choiceBased) {
      const totalSubMarks = group.subquestions.reduce(
        (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
        0
      );

      if (group.subquestions.every(sq => sq.maxMarks === group.subquestions[0].maxMarks)) {
        return total + (group.choiceCount * (parseFloat(group.subquestions[0].maxMarks) || 0));
      }

      const avgMarksPerSubquestion = totalSubMarks / group.subquestions.length;
      return total + (group.choiceCount * avgMarksPerSubquestion);
    } else {
      const subquestionsTotal = group.subquestions.reduce(
        (sum, sq) => sum + (parseFloat(sq.maxMarks) || 0),
        0
      );
      return total + subquestionsTotal;
    }
  }, 0);
};
