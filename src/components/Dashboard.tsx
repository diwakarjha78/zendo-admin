import React from 'react';
import Data from '@/lib/data';
import { Link } from 'react-router-dom';
import usePagetitle from '@/hooks/usePagetitle';

const Dashboard: React.FC = () => {
  usePagetitle('Dashboard');
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Data.Dashboardlink.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center rounded text-center shadow-sm bg-white">
            {/* Icon link with hover scale animation */}
            <Link
              to={'/'}
              className="py-10 w-full flex justify-center items-center transition duration-200 hover:scale-110 bg-transparent rounded-t"
            >
              <item.icon className="!w-12 !h-12" />
            </Link>
            <div className="py-2 bg-gray-200 w-full rounded-b">
              <h2 className="text-sm font-medium">{item.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
