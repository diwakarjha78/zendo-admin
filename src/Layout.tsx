import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import AppSidebar from './components/Appsidebar';
import { Button } from './components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Profilemenu from './components/Profilemenu';
import Notificationmenu from './components/Notificationmenu';
import Data from './lib/data';

const Layout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search input when opening
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearchOpen = () => setIsSearchOpen(true);
  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Filter the sidebar items from Data.Appsidebar based on the search query.
  const filteredSidebarItems = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return Data.Appsidebar.filter((item) => {
      const mainMatch = item.title.toLowerCase().includes(lowerQuery);
      const subMatch = item.subOptions && item.subOptions.some((sub) => sub.title.toLowerCase().includes(lowerQuery));
      return mainMatch || subMatch;
    });
  }, [searchQuery]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="sticky top-0 z-10 h-16 px-2 flex items-center shadow bg-white">
          {isSearchOpen ? (
            // Wrap the search input and results in a relative container.
            <div className="relative w-full animate-slideDown">
              <div className="flex items-center justify-between p-1">
                <Search className="!w-5 !h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search sidebar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mx-3 flex-1 border-none focus:outline-none text-lg"
                />
                <button
                  onClick={handleSearchClose}
                  className="bg-transparent shadow-none text-black hover:bg-gray-200 rounded hover:cursor-pointer p-1"
                >
                  <X className="!w-5 !h-5" />
                </button>
              </div>
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 bg-white shadow border rounded mt-5 p-2 overflow-auto z-10">
                  {filteredSidebarItems.length > 0 ? (
                    filteredSidebarItems.map((item, idx) => {
                      // Directly use the icon component from the data.
                      const IconComponent = item.icon;
                      return (
                        <div key={idx} className="mb-2">
                          {/* Main Item */}
                          <Link
                            to={item.url}
                            className="flex items-center px-2 py-1 hover:bg-gray-100 rounded"
                            onClick={handleSearchClose}
                          >
                            {IconComponent && <IconComponent className="mr-2" size={16} />}
                            <span>{item.title}</span>
                          </Link>
                          {/* Render sub-options if available */}
                          {item.subOptions &&
                            item.subOptions
                              .filter((sub) => sub.title.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map((sub, subIdx) => {
                                const SubIconComponent = sub.icon;
                                return (
                                  <Link
                                    key={subIdx}
                                    to={sub.url}
                                    className="flex items-center pl-6 pr-2 py-1 hover:bg-gray-100 rounded"
                                    onClick={handleSearchClose}
                                  >
                                    {SubIconComponent && <SubIconComponent className="mr-2" size={16} />}
                                    <span>{sub.title}</span>
                                  </Link>
                                );
                              })}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-2 py-1 text-gray-500">No results found.</div>
                  )}
                </div>
              )}
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
                  <span className="sr-only">Search</span>
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
