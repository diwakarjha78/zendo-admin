import React, { useEffect, useState } from 'react';
import { User, CreditCard, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Logout from './auth/Logout';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { Avatar, AvatarFallback } from './ui/avatar';
import Blobimage from './Blobimage';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  mobile: string;
  provider_id?: string | null;
  provider: string;
  fcm_token?: string;
  token: string;
  refresh_token: string;
  image_url?: string;
  subscription: boolean;
  is_active: boolean;
  is_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

const Profilemenu: React.FC = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get<{ data: UserProfile }>('/userGetProfileData', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response:', res.data);
        if (res.data?.data) {
          setProfile(res.data.data);
        } else {
          console.error('Unexpected API response:', res.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [token]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Avatar className="h-9 w-9 shadow border-gray-100 border cursor-pointer select-none">
            {profile?.image_url ? (
              <Blobimage src={profile.image_url} className="w-full h-full object-cover" alt="profile-image" />
            ) : (
              <AvatarFallback>{profile?.username.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <span className="absolute bottom-0 right-0 block w-1.5 h-1.5 bg-green-500 rounded-full ring-2 ring-white" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0 rounded-xs absolute top-1 -right-2" align="end">
        <div className="bg-white">
          <Link to={'/profile'} className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <User size={16} />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <CreditCard size={16} />
            <span className="text-sm font-medium">Billing</span>
          </div>
          <div className="px-4 py-3 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
            <SettingsIcon size={16} />
            <span className="text-sm font-medium">Settings</span>
          </div>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-4 py-3 flex items-center gap-2.5 cursor-pointer text-sm font-medium hover:bg-gray-50 border-t w-full"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      </PopoverContent>
      <Logout open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen} />
    </Popover>
  );
};

export default Profilemenu;
