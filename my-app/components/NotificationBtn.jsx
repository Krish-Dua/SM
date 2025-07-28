import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import useNotificationStore from '../store/notification';

const NotificationBtn = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
      <Link to="/notifications" className="flex items-center gap-5 px-3 py-2">
        <div className="relative">
          <Heart size={30} className="text-gray-700 dark:text-gray-400" />
          {unread > 0 && (
            <span className="absolute top-0 end-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-bold transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white">
              {unread}
            </span>
          )}
        </div>
        <span className="hidden lg:inline text-xl font-bold">Notifications</span>
      </Link>
  );
};

export default NotificationBtn;
