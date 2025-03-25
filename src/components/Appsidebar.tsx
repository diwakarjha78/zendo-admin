import React from 'react';
import { Link } from 'react-router-dom';
import { LockOpen, LogOut, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Data from '@/lib/data';

const AppSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full bg-white">
        <header className="px-2 py-4 flex gap-3 items-center font-bold text-xl shadow">
          <img src="/logo.png" alt="zendo-logo" className="rounded-full w-9 h-9" />
          <span>Zendo Admin</span>
        </header>

        <SidebarGroup className="p-0 m-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {Data.Appsidebar.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-gray-200 rounded-none px-4 py-6">
                    <Link to={item.url} className='flex items-center gap-3'>
                      <item.icon className="!w-5 !h-5" />
                      <span className='font-medium'>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-2 border-t flex justify-around items-center">
          <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-2">
            <Settings size={24} />
          </div>
          <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-2">
            <LockOpen size={24} />
          </div>
          <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-2">
            <LogOut size={24} />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
