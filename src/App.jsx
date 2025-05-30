import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/context/AuthContext';
import { useEffect } from 'react';
import AppRoutes from './AppRoutes';

function App() {
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);
    return () => document.removeEventListener('contextmenu', disableContextMenu);
  }, []);

  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;