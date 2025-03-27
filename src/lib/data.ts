import {
  Box,
  ClipboardList,
  CreditCard,
  Headset,
  Image,
  LayoutDashboard,
  Settings,
  Star,
  UserRound,
} from 'lucide-react';

const Data = {
  Appsidebar: [
    { title: 'Dashboard', url: '/', icon: LayoutDashboard },
    {
      title: 'User Management',
      url: '/',
      icon: UserRound,
      isOption: true,
      subOptions: [
        {
          title: 'User Profiles',
          url: '/user-profiles',
          icon: UserRound,
        },
        {
          title: 'User Activity',
          url: '/user-activity',
          icon: UserRound,
        },
        {
          title: 'Account Status',
          url: '/account-status',
          icon: UserRound,
        },
        {
          title: 'Registration Management',
          url: '/registration-management',
          icon: UserRound,
        },
      ],
    },
    { title: 'Content Management', url: '/calendar', icon: ClipboardList },
    {
      title: 'Photo Management',
      url: '/search',
      icon: Image,
      isOption: true,
      subOptions: [
        {
          title: 'Photo Gallery Oversight',
          url: '/photo-gallery',
          icon: UserRound,
        },
        {
          title: 'Image Storage Management',
          url: '/image-storage',
          icon: UserRound,
        },
      ],
    },
    {
      title: 'AI Rendering Oversight',
      url: '/settings',
      icon: Settings,
      isOption: true,
      subOptions: [
        {
          title: 'AI Algorithm Management',
          url: '/ai-algorithm',
          icon: UserRound,
        },
        {
          title: 'Rendering Logs',
          url: '/rendering-logs',
          icon: UserRound,
        },
        {
          title: 'Render Queue Management',
          url: '/render-queue',
          icon: UserRound,
        },
        {
          title: 'Customization Control',
          url: '/customization-control',
          icon: UserRound,
        },
      ],
    },
    { title: 'Product Integration Management', url: '/settings', icon: Box },
    {
      title: 'Feedback and Ratings',
      url: '/settings',
      icon: Star,
      isOption: true,
      subOptions: [
        {
          title: 'User Feedback Review',
          url: '/user-feedback-review',
          icon: UserRound,
        },
        {
          title: 'Rating System Management',
          url: '/rating-sysytem',
          icon: UserRound,
        },
        {
          title: 'Designer Feedback',
          url: '/designer-feedback',
          icon: UserRound,
        },
      ],
    },
    {
      title: 'Customer Support',
      url: '/settings',
      icon: Headset,
      isOption: true,
      subOptions: [
        {
          title: 'Support Ticket System',
          url: '/support-ticket-system',
          icon: UserRound,
        },
        {
          title: 'FAQ Management',
          url: '/faq-management',
          icon: UserRound,
        },
        {
          title: 'Chat and Email Support',
          url: '/designer-feedback',
          icon: UserRound,
        },
      ],
    },
    {
      title: 'Security and Payments',
      url: '/settings',
      icon: CreditCard,
      isOption: true,
      subOptions: [
        {
          title: 'Transaction Management',
          url: '/transaction-management',
          icon: UserRound,
        },
        {
          title: 'Security Controls',
          url: '/security-controls',
          icon: UserRound,
        },
        {
          title: 'Data Encryption',
          url: '/data-encryption',
          icon: UserRound,
        },
      ],
    },
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
  ],
  Userprofiles: [
    { firstName: 'Amit', lastName: 'Kumar', email: 'amit@gmail.com', phone: '9586512430' },
    { firstName: 'Brijesh', lastName: 'Kumar', email: 'brijesh@gmail.com', phone: '9651245743' },
    { firstName: 'Charu', lastName: 'Singh', email: 'charu@gmail.com', phone: '9651241234' },
    { firstName: 'Dinkar', lastName: 'Singh', email: 'dinkar@gmail.com', phone: '9651245632' },
    { firstName: 'Kamla', lastName: 'Singh', email: 'kamla@gmail.com', phone: '9651245633' },
    { firstName: 'Mala', lastName: 'Verma', email: 'mala@gmail.com', phone: '9651245634' },
    { firstName: 'Nitin', lastName: 'Verma', email: 'nitin@gmail.com', phone: '9651245635' },
    { firstName: 'Pankaj', lastName: 'Sharma', email: 'pankaj@gmail.com', phone: '9651245636' },
    { firstName: 'Rahul', lastName: 'Kumar', email: 'rahul@gmail.com', phone: '9651245637' },
    { firstName: 'Amit', lastName: 'Kumar', email: 'amit@gmail.com', phone: '9586512430' },
    { firstName: 'Brijesh', lastName: 'Kumar', email: 'brijesh@gmail.com', phone: '9651245743' },
    { firstName: 'Charu', lastName: 'Singh', email: 'charu@gmail.com', phone: '9651241234' },
    { firstName: 'Dinkar', lastName: 'Singh', email: 'dinkar@gmail.com', phone: '9651245632' },
    { firstName: 'Kamla', lastName: 'Singh', email: 'kamla@gmail.com', phone: '9651245633' },
    { firstName: 'Mala', lastName: 'Verma', email: 'mala@gmail.com', phone: '9651245634' },
    { firstName: 'Nitin', lastName: 'Verma', email: 'nitin@gmail.com', phone: '9651245635' },
    { firstName: 'Pankaj', lastName: 'Sharma', email: 'pankaj@gmail.com', phone: '9651245636' },
    { firstName: 'Rahul', lastName: 'Kumar', email: 'rahul@gmail.com', phone: '9651245637' },
    { firstName: 'Amit', lastName: 'Kumar', email: 'amit@gmail.com', phone: '9586512430' },
    { firstName: 'Brijesh', lastName: 'Kumar', email: 'brijesh@gmail.com', phone: '9651245743' },
    { firstName: 'Charu', lastName: 'Singh', email: 'charu@gmail.com', phone: '9651241234' },
    { firstName: 'Dinkar', lastName: 'Singh', email: 'dinkar@gmail.com', phone: '9651245632' },
    { firstName: 'Kamla', lastName: 'Singh', email: 'kamla@gmail.com', phone: '9651245633' },
    { firstName: 'Mala', lastName: 'Verma', email: 'mala@gmail.com', phone: '9651245634' },
    { firstName: 'Nitin', lastName: 'Verma', email: 'nitin@gmail.com', phone: '9651245635' },
    { firstName: 'Pankaj', lastName: 'Sharma', email: 'pankaj@gmail.com', phone: '9651245636' },
    { firstName: 'Rahul', lastName: 'Kumar', email: 'rahul@gmail.com', phone: '9651245637' },
  ],
};

export default Data;
