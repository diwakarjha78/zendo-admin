import React from 'react';
import { Toaster } from 'sonner';
import Budgetpromptmanagement from './Budgetpromptmanagement';
import Designstyles from './Designstyles';

const Contentmanagement: React.FC = () => {
  return (
    <div className="p-4">
      <Toaster />
      <div className="text-3xl font-semibold capitalize mb-6">Content Management</div>
      <div className="flex flex-col gap-10">
        <Budgetpromptmanagement />
        <Designstyles />
      </div>
    </div>
  );
};

export default Contentmanagement;
