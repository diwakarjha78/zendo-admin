import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SuccessMessageProps {
  message: string | null;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="text-center">
      <p className="text-green-500 text-sm">{message}</p>
      <Button className="w-full mt-4 rounded cursor-pointer">
        <Link to={'/auth/login'} className="w-full rounded cursor-pointer">
          Go to Login
        </Link>
      </Button>
    </div>
  );
};

export default SuccessMessage;
