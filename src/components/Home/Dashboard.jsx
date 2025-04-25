// src/components/Home/Dashboard.jsx
import { useState } from 'react';
import Navbar from './Navbar';
import DashboardSummary from './DashboardSummary';
import Evaluation from './Evaluation';
import Reports from './Reports';

export default function Dashboard({userData}) {
  const [activeTab, setActiveTab] = useState('dashboard');

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
    </div>
  );
}