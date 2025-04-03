// Logout.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Logout: React.FC<LogoutProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('zendo_at');
      localStorage.removeItem('zendo_rt');
      sessionStorage.removeItem('zendo_at');
      sessionStorage.removeItem('zendo_rt');
      navigate('/auth/login');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>Are you sure you want to logout?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              handleLogout();
            }}
            className="cursor-pointer"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Logout;
