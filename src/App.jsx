import { Route, Routes } from 'react-router-dom';
import EvaluationLayout from './components/Layout/EvaluationLayout';
import Login from './Pages/Login';
import SubjectSelectionPage from './components/SubjectSelection/SubjectSelectionPage';
import Dashboard from './components/Home/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Register from './Pages/Register';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ProtectedAdminRoute from './components/AdminPanel/Protected/ProtectedAdminRoute';
import AdminLogin from './components/AdminPanel/Login/AdminLogin';
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/context/AuthContext';

function App() {

  return (
    <>

    <AuthProvider>
    <Toaster position="top-center" reverseOrder={false} />
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/register"  element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
        <Route path="/login"  element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          } 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard/>
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
          path="/evaluate"
          element={
            <ProtectedRoute>
              <EvaluationLayout />
            </ProtectedRoute>
          }
        />
         {/* Evaluation route with copyId parameter */}
         <Route
          path="/evaluate/:copyId"
          element={
            <ProtectedRoute>
              <EvaluationLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
    </AuthProvider>
    </>
  );
}

export default App;