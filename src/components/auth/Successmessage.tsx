import React from 'react';
import { Link } from 'react-router-dom';

interface SuccessMessageProps {
  message: string | null;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="text-center">
      <p className="text-green-500 text-sm">{message}</p>
      <Link to={'/auth/login'} className="w-full mt-4 rounded cursor-pointer">
        Go to Login
      </Link>
    </div>
  );
};

export default SuccessMessage;
