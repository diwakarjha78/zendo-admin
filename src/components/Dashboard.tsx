import React from 'react';
import Data from '@/lib/data';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Data.Dashboardlink.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded text-center shadow-sm"
          >
            <Link to={'/'} className='py-10 w-full flex justify-center items-center'>
              <item.icon className='!w-12 !h-12' />
            </Link>
            <div className='py-2 bg-gray-100 w-full'>
              <h2 className="text-sm font-medium">{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
