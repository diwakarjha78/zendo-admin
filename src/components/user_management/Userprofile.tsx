import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronsLeft, ChevronsRight, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dummy data
const initialData = [
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
];

const ITEMS_PER_PAGE = 10;

const Userprofile: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    return initialData.filter((item) => {
      const fullText = `${item.firstName} ${item.lastName} ${item.email} ${item.phone}`.toLowerCase();
      return fullText.includes(search.toLowerCase());
    });
  }, [search]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="p-4">
      <div className="p-6 bg-white rounded shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">User Profile</h1>
          <div className="min-w-20 w-full max-w-80">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded shadow-none focus:outline-none focus:shadow-none focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">S.No</TableHead>
                <TableHead className="w-[150px]">First Name</TableHead>
                <TableHead className="w-[150px]">Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[150px]">Phone</TableHead>
                <TableHead className="w-[80px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{startIndex + idx + 1}</TableCell>
                    <TableCell>{item.firstName}</TableCell>
                    <TableCell>{item.lastName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell className="flex justify-center items-center gap-3">
                      <button className="text-gray-600 hover:bg-gray-200 rounded p-1 hover:text-blue-500 cursor-pointer">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:bg-gray-200 rounded p-1 hover:text-red-500 cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end pt-2">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1} className="mr-2">
            <ChevronsLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="mx-2 text-sm text-gray-700">
            Page {page} of {totalPages || 1}
          </span>
          <Button variant="outline" size="sm" onClick={handleNext} disabled={page === totalPages || totalPages === 0}>
            Next
            <ChevronsRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
