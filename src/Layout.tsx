import React from 'react';
import { Outlet } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import AppSidebar from './components/Appsidebar';
import { Button } from './components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="px-2 py-4 flex justify-between gap-3 items-center shadow">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer" />
            <Button
              data-sidebar="trigger"
              data-slot="sidebar-trigger"
              size="icon"
              className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer"
            >
              <Search className="!w-5 !h-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <div className="flex items-center gap-5">
            <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer py-1 px-2">
              <span className="font-semibold  ">Welcome / Admin</span>
            </div>
            <img src="/logo.png" alt="zendo-logo" className="rounded-full w-7 h-7 cursor-pointer" />
            <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-[6px]">
              <Bell size={24} />
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
