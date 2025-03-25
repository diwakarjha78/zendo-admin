import { Box, ClipboardList, CreditCard, Headset, Image, LayoutDashboard, Settings, Star, UserRound } from 'lucide-react';

const Data = {
  Appsidebar: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    { title: 'User Management', url: '/', icon: UserRound },
    { title: 'Content Management', url: '/calendar', icon: ClipboardList },
    { title: 'Photo Management', url: '/search', icon: Image },
    { title: 'AI Rendering Oversight', url: '/settings', icon: Settings },
    { title: 'Product Integration Management', url: '/settings', icon: Box },
    { title: 'Feedback and Ratings Management', url: '/settings', icon: Star },
    { title: 'Customer Support Management', url: '/settings', icon: Headset },
    { title: 'Security and Payments', url: '/settings', icon: CreditCard },
  ],
  Dashboardlink: [
    { title: 'User Management', url: '/', icon: UserRound },
    { title: 'Content Management', url: '/', icon: ClipboardList },
    { title: 'Photo Management', url: '/', icon: Image },
    { title: 'AI Rendering Oversight', url: '/settings', icon: Settings },
    { title: 'Product Integration Management', url: '/settings', icon: Box },
    { title: 'Feedback and Ratings Management', url: '/settings', icon: Star },
    { title: 'Customer Support Management', url: '/settings', icon: Headset },
    { title: 'Security and Payments', url: '/settings', icon: CreditCard },
  ]
};

export default Data;
