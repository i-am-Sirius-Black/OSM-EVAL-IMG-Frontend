import { Route, Routes } from 'react-router-dom';
import EvaluationLayout from './components/Layout/EvaluationLayout';
import Login from './Pages/Login';
import SubjectSelectionPage from './components/SubjectSelection/SubjectSelectionPage';
import Dashboard from './components/Home/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';

function App() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUserData = localStorage.getItem('evalUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard userData={userData}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject-selection"
          element={
            <ProtectedRoute>
              <SubjectSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <EvaluationLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;