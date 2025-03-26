import React from 'react';
import { User, CreditCard, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Profilemenu: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <img src="/logo.png" alt="zendo-logo" className="rounded-full w-7 h-7 cursor-pointer" />
          <span className="absolute bottom-0 right-0 block w-1.5 h-1.5 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 rounded-xs absolute top-1 -right-2" align="end">
        <div className="bg-white">
          <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <User size={16} />
            <span className="text-sm font-medium">Profile</span>
          </div>
          <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <CreditCard size={16} />
            <span className="text-sm font-medium">Billing</span>
          </div>
          <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <SettingsIcon size={16} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </div>
        <button className="px-4 py-3 flex items-center gap-2.5 cursor-pointer text-sm font-medium hover:bg-gray-50 border-t w-full">
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default Profilemenu;
