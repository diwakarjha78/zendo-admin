import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Trash2 } from 'lucide-react';
import api from '@/lib/api';

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string;
}

const Notificationmenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/getAllAdminNotifications');
      if (res.data.status_code === 200) {
        setNotifications(res.data.data);
        const unread = res.data.data.filter((n: Notification) => !n.is_read);
        setUnreadCount(unread.length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Mark a notification as read by sending its id in the request body
  const markAsRead = async (id: number) => {
    try {
      await api.post('/markAdminNotificationAsRead', { id });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      await Promise.all(unreadNotifications.map((notif) => api.post('/markAdminNotificationAsRead', { id: notif.id })));
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Delete a single notification by using its id in the route
  const deleteNotification = async (id: number) => {
    try {
      // Add animation class before deletion if needed
      await api.delete(`/deleteAdminNotification/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Delete all notifications by looping through each id
  const deleteAllNotifications = async () => {
    try {
      await Promise.all(notifications.map((n) => api.delete(`/deleteAdminNotification/${n.id}`)));
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting all notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative bg-transparent shadow-none text-black hover:bg-gray-200 rounded-xs hover:cursor-pointer p-[6px]">
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0.5 flex items-center justify-center px-1 text-xs text-white bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xs" align="end">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-white flex items-center justify-between rounded-t-xs">
          <h2 className="font-semibold text-sm">NOTIFICATIONS</h2>
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-blue-600 hover:underline transition-colors duration-200 cursor-pointer"
          >
            Mark All Read
          </button>
        </div>

        {/* Notification list */}
        <div className="max-h-72 overflow-y-auto bg-white">
          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-2 flex justify-between items-start group transition-all duration-300 
                  ${!notif.is_read ? 'bg-gray-50 border-y' : 'bg-white'} hover:bg-gray-50`}
              >
                <div onClick={() => markAsRead(notif.id)} className="flex-1 cursor-pointer">
                  <p className={`text-sm ${!notif.is_read ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                  <p className="text-xs text-gray-500">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
                <Trash2
                  size={14}
                  className="text-gray-400 hover:text-red-500 mt-1 ml-2 cursor-pointer transition-colors duration-200"
                  onClick={() => deleteNotification(notif.id)}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-white flex items-center justify-end rounded-b-xs">
          <button
            onClick={deleteAllNotifications}
            className="text-sm font-medium text-blue-600 hover:underline transition-colors duration-200 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notificationmenu;
