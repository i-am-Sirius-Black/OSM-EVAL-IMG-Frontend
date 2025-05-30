import { Route, Routes } from 'react-router-dom';
import EvaluationLayout from './components/Layout/EvaluationLayout';
import Login from './Pages/Login';
import Dashboard from './components/Home/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './Pages/Register';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ProtectedAdminRoute from './components/AdminPanel/Protected/ProtectedAdminRoute';
import AdminLogin from './components/AdminPanel/Login/AdminLogin';
import PublicRoute from './components/PublicRoute';
import ChangePassword from './Pages/ChangePassword';
import ContactForm from './components/Common/ContactForm';
import NotFound from './components/Common/NotFound';

const AppRoutes = () => (
  <Routes>
    <Route path="/register" element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    } />

    <Route path="/login" element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } />

    <Route path="/change-password" element={<ChangePassword />} />
    <Route path="/admin-login" element={<AdminLogin />} />

    <Route path="/admin" element={
      <ProtectedAdminRoute>
        <AdminPanel />
      </ProtectedAdminRoute>
    } />

    <Route path="/" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />

    <Route path="/evaluate" element={
      <ProtectedRoute>
        <EvaluationLayout />
      </ProtectedRoute>
    } />

    <Route path="/evaluate/:copyId" element={
      <ProtectedRoute>
        <EvaluationLayout />
      </ProtectedRoute>
    } />

    <Route path="/contact" element={
      <ProtectedRoute>
        <ContactForm />
      </ProtectedRoute>
    } />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;