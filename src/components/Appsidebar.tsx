import React, { useState } from 'react';
import Data from '@/lib/data';
import { Link } from 'react-router-dom';
import { ChevronRight, LockOpen, LogOut, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Logout from './auth/Logout';

const AppSidebar: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  return (
    <Sidebar>
      <SidebarContent className="relative flex flex-col h-screen bg-white">
        <header className="sticky top-0 z-10 h-16 px-2 flex gap-3 items-center font-bold text-xl shadow">
          <img src="/logo.png" alt="zendo-logo" className="rounded-full w-9 h-9" />
          <span>Zendo Admin</span>
        </header>
        <SidebarGroup className="flex-1 overflow-y-auto p-0 m-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {Data.Appsidebar.map((item, index) => {
                // If item has sub-options, render Collapsible
                if (item.isOption && item.subOptions) {
                  return (
                    <SidebarMenuItem key={index}>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-4 py-3 data-[state=open]:bg-gray-200">
                            <item.icon className="!w-5 !h-5" />
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform data-[state=open]:rotate-90 !w-4 !h-4" />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="bg-gray-100">
                          {item.subOptions.map((subItem, subIndex) => (
                            <SidebarMenuItem key={subIndex}>
                              <SidebarMenuButton asChild className="hover:bg-gray-200 rounded-none px-7 py-6">
                                <Link to={subItem.url} className="flex items-center gap-3">
                                  <span className="text-sm">{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild className="hover:bg-gray-200 rounded-none px-4 py-6">
                      <Link to={item.url ?? '#'} className="flex items-center gap-3">
                        <item.icon className="!w-5 !h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="sticky bottom-0 z-10 p-2 border-t border-gray-200 flex justify-around items-center shadow-md">
          <div className="bg-transparent text-black hover:bg-gray-200 rounded cursor-pointer p-2 transition-colors">
            <Settings size={24} />
          </div>
          <div className="bg-transparent text-black hover:bg-gray-200 rounded cursor-pointer p-2 transition-colors">
            <LockOpen size={24} />
          </div>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="bg-transparent text-black hover:bg-gray-200 rounded cursor-pointer p-2 transition-colors"
          >
            <LogOut size={24} />
          </div>
        </div>
      </SidebarContent>
      <Logout open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />
    </Sidebar>
  );
};

export default AppSidebar;
