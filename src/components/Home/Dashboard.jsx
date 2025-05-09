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