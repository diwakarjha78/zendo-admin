import React from 'react';
import usePagetitle from '@/hooks/usePagetitle';
import { Toaster } from 'sonner';
import Userdesignswipes from './Userdesignswipes';
import Userbudgetestimation from './Userbudgetestimation';
import Userimageupload from './Userimageupload';

const Useractivity: React.FC = () => {
  usePagetitle('User Profile');
  return (
    <div className="p-4">
      <Toaster />
      <div className="text-3xl font-semibold capitalize mb-6">User Activity</div>
      <div className="flex flex-col gap-10">
        <Userdesignswipes />
        <Userbudgetestimation />
        <Userimageupload />
      </div>
    </div>
  );
};

export default Useractivity;
