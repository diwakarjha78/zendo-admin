import React from 'react';
import { Outlet } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import AppSidebar from './components/Appsidebar';
import { Button } from './components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Profilemenu from './components/Profilemenu';
import Notificationmenu from './components/Notificationmenu';

const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus the search input when opening
  React.useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => setIsSearchOpen(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="sticky top-0 z-10 h-16 px-2 flex items-center shadow bg-white">
          {isSearchOpen ? (
            <div className="flex w-full items-center justify-between p-1 animate-slideDown">
              <Search className="!w-5 !h-5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="mx-3 flex-1 border-none focus:outline-none text-lg"
              />
              <button
                onClick={handleSearchClose}
                className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-1"
              >
                <X className="!w-5 !h-5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              {/* Left side: Sidebar trigger & Search button */}
              <div className="flex items-center gap-3">
                <SidebarTrigger className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer" />
                <Button
                  data-sidebar="trigger"
                  data-slot="sidebar-trigger"
                  size="icon"
                  className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer"
                  onClick={handleSearchOpen}
                >
                  <Search className="!w-5 !h-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              {/* Right side: Welcome text, user avatar, notifications */}
              <div className="flex items-center gap-5">
                <div className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer py-1.5 px-2">
                  <span className="font-semibold">Welcome / Admin</span>
                </div>
                <Profilemenu />
                <Notificationmenu />
              </div>
            </div>
          )}
        </header>

        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>

        <footer className="min-h-[57px] px-4 flex items-center justify-between border-t font-medium">
          <span className="text-sm text-gray-500">© 2025</span>
          <span className="text-sm text-gray-500">
            Powered by{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Zendo
            </a>
          </span>
        </footer>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
