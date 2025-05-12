import React, { useEffect, useRef, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import toast from 'react-hot-toast';

const Notifications = () => {
  // Mock notifications data (to be replaced with API call in future)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New copy #1234 assigned to you",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "Your evaluation of copy #5678 is due soon",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      message: "Testing notification",
      time: "3 days ago",
      read: true,
    },
  ]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
   const notificationRef = useRef(null);
  const notificationBellRef = useRef(null);

  const handleNotificationClick = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };


  // Handle clicks outside of notifications
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside both the dropdown and the bell icon
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        notificationBellRef.current && 
        !notificationBellRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    // Only add listener if dropdown is open
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [notificationsOpen]);


  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="relative">
      <button
      ref={notificationBellRef}
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {unreadCount > 0 ? (
          <>
            <NotificationsIcon className="h-6 w-6" />
            <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[0.7em] rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          </>
        ) : (
          <NotificationsNoneIcon className="h-6 w-6" />
        )}
      </button>
      
      {notificationsOpen && (
        <div  ref={notificationRef} className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.read ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex justify-between">
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No notifications
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200">
                <a onClick={()=>toast.success('Viewed all notifications')} className="text-xs text-blue-600 hover:text-blue-800">
                  View all notifications
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
