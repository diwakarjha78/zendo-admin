import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Settings as SettingsIcon } from 'lucide-react';

const Notificationmenu: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative bg-transparent shadow-none text-black hover:bg-gray-200 rounded-xs hover:cursor-pointer p-[6px]">
          <Bell size={24} />
          <span className="absolute top-0 right-0.5 flex items-center justify-center px-1 text-xs text-white bg-red-600 rounded-full">
            3
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 rounded-xs" align="end">
        {/* Notification Panel Header */}
        <div className="px-4 py-3 border-b bg-white flex items-center justify-between rounded-t-xs">
          <h2 className="font-semibold">NOTIFICATIONS</h2>
          <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-full">New 3</span>
        </div>
        {/* Notification List */}
        <div className="bg-white">
          <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium">A new order has been placed</p>
            <p className="text-xs text-gray-500">5 hours ago</p>
          </div>
          <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium">Completed the task</p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>
          <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium">Settings updated</p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>
          <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium">Event started</p>
            <p className="text-xs text-gray-500">2 days ago</p>
          </div>
        </div>
        {/* Notification Panel Footer */}
        <div className="px-4 py-3 border-t bg-white flex items-center justify-between rounded-b-xs">
          <div className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">All notifications</div>
          <SettingsIcon size={18} className="cursor-pointer" />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notificationmenu;
