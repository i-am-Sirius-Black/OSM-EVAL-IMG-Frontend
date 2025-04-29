// src/components/Home/Dashboard.jsx
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import DashboardSummary from './DashboardSummary';
import Evaluation from './Evaluation';
import Reports from './Reports';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const storedUserData = localStorage.getItem('evalUserData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  console.log("userData in Dashboard:", userData); // Log userData to check its value
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} userData={userData}/>
      {activeTab === 'dashboard' && (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <DashboardSummary />
        </main>
      )}
      {activeTab === 'evaluation' && <Evaluation />}
      {activeTab === 'reports' && <Reports />}
      <div className="nav-item">
</div>
    </div>
  );
}