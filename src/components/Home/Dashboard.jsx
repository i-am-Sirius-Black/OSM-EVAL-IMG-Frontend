// src/components/Home/Dashboard.jsx
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import DashboardSummary from './DashboardSummary';
import Evaluation from './Evaluation';
import Reports from './Reports';
import CheckingStatus from './CheckingStatus';
import { useAuth } from '../context/AuthContext';
import Loader from '../Common/Loader';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { user, loading } = useAuth();

  console.log("userData in Dashboard:", user); // Log userData to check its value

  // Redirect admin users to a different view
  if(!loading && user && user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <p className="mb-4">Welcome <span className='text-blue-600 font-bold'>{user.name || 'Guest'}</span> to the admin dashboard. You have access to additional administrative features.</p>
            <a 
              href="/admin" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? <Loader/> : (
        <>
              <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userData={user}/>
              {activeTab === 'dashboard' && (
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <DashboardSummary />
                  <div className="mt-6">
                    <CheckingStatus />
                  </div>
                </main>
              )}
              {activeTab === 'evaluation' && <Evaluation />}
              {activeTab === 'reports' && <Reports />}
              <div className="nav-item">
        </div>
        </>
      )}

    </div>
  );
}