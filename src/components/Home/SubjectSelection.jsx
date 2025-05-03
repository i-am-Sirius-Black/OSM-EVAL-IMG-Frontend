// src/components/Home/SubjectSelection.jsx
export default function SubjectSelection({ selectedSubject, handleSubjectChange, subjects }) {
    return (
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          {/* <h2 className="text-lg font-medium text-gray-900 mb-4">Select Subject to Evaluate</h2> */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Subject to Evaluate
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={handleSubjectChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a subject</option>
                {subjects.map((sub) => (
                  <option key={sub.subjectId} value={sub.subjectId}>
                    {sub.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }