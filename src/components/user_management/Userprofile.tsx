import React, { useEffect, useState, useMemo } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api'; // Our custom axios instance with interceptors
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePagetitle from '@/hooks/usePagetitle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';

//
// 1) Define TypeScript Interfaces
//
interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  is_active: boolean;
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
}

interface GetAllUsersResponse {
  status_code: number;
  message: string;
  data: User[];
}

//
// 2) Pagination Items per page
//
const ITEMS_PER_PAGE = 10;

//
// 3) The Component
//
const Userprofile: React.FC = () => {
  usePagetitle('User Profile');

  // Local State
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // State for deletion modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // State for restore modal
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  // Selected user for confirmation (delete or restore)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  //
  // 4) Fetch Users from the API
  //
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using the custom api instance
        const response = await api.get<GetAllUsersResponse>('/getAllUsers');
        const result = response.data;
        if (result.status_code === 200) {
          setUsers(result.data);
        } else {
          setError(result.message || 'Failed to fetch users');
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          setError(String(axiosError.response.data) || 'Error fetching users');
        } else {
          setError(axiosError.message || 'Error fetching users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //
  // 5) Filter Data by Search
  //
  const filteredData = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return users.filter((user) => {
      const fullText = `${user.username} ${user.email} ${user.mobile}`.toLowerCase();
      return fullText.includes(lowerSearch);
    });
  }, [search, users]);

  //
  // 6) Pagination Logic
  //
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Reset page to 1 when search input changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  //
  // 7) Delete User Handler (Soft Delete)
  //
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      // Call the /deleteUser endpoint with userId as query parameter.
      const response = await api.get(`/deleteUser?userId=${selectedUser.id}`);
      const result = response.data as { status_code: number; message: string; data?: User };
      if (result.status_code === 200) {
        // Update the user to inactive
        setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, is_active: false } : user)));
        toast.success(`${selectedUser.username} has been successfully deactivated.`);
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Error deleting user');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  //
  // 8) Restore User Handler
  //
  const handleRestoreUser = async () => {
    if (!selectedUser) return;
    setRestoreLoading(true);
    try {
      // Call the restore API endpoint with the userId as a query parameter
      const response = await api.get(`/restoreDeletedUser?userId=${selectedUser.id}`);
      const result = response.data as { status_code: number; message: string; data?: User };
      if (result.status_code === 200) {
        // Update the user to active
        setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, is_active: true } : user)));
        toast.success(result.message || `${selectedUser.username} has been restored.`);
      } else {
        toast.error(result.message || 'Failed to restore user');
      }
    } catch (err) {
      console.error('Error restoring user:', err);
      toast.error('Error restoring user');
    } finally {
      setRestoreLoading(false);
      setRestoreModalOpen(false);
      setSelectedUser(null);
    }
  };

  //
  // 9) Render
  //
  return (
    <div className="p-4">
      {/* Sonner Toaster for notifications */}
      <Toaster />
      <div className="p-6 bg-white rounded shadow-md space-y-5">
        {/* Header / Search */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {/* Error Message */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">S.No</TableHead>
                  <TableHead className="w-[150px]">Username</TableHead>
                  <TableHead className="w-[150px]">Email</TableHead>
                  <TableHead className="w-[150px]">Phone</TableHead>
                  <TableHead className="w-[100px]">Active</TableHead>
                  <TableHead className="w-[180px]">Created At</TableHead>
                  <TableHead className="w-[180px]">Updated At</TableHead>
                  <TableHead className="w-[80px] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((user, idx) => (
                    <TableRow key={user.id}>
                      <TableCell>{startIndex + idx + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-red-600 font-medium">No</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                      <TableCell className="flex justify-center items-center gap-3">
                        {user.is_active ? (
                          // Delete Button
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteModalOpen(true);
                            }}
                            className="text-gray-600 hover:bg-gray-200 rounded p-1 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          // Restore Button
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setRestoreModalOpen(true);
                            }}
                            className="text-gray-600 hover:bg-gray-200 rounded p-1 hover:text-green-500 cursor-pointer"
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && (
          <div className="flex items-center justify-end pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={page === 1}
              className="cursor-pointer flex items-center justify-center rounded"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm text-gray-700">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page === totalPages || totalPages === 0}
              className="cursor-pointer flex items-center justify-center rounded"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{selectedUser?.username}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Modal */}
      <Dialog open={restoreModalOpen} onOpenChange={setRestoreModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Restore</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore user <strong>{selectedUser?.username}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRestoreModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestoreUser} disabled={restoreLoading}>
              {restoreLoading ? 'Restoring...' : 'Restore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Userprofile;
