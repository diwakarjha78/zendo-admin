import React, { useEffect, useState, useMemo } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import Blobimage from '../Blobimage';

interface SwipePreference {
  image_id: number;
  image_url: string;
  liked: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: SwipePreference[];
}

interface GetAllUsersResponse {
  status_code: number;
  message: string;
  data: User[];
}

const ITEMS_PER_PAGE = 10;

const Userdesignswipes: React.FC = () => {
  // Local State
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<GetAllUsersResponse>('/getAllUsersWithPreferences');
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

  const filteredData = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return users.filter((user) => {
      const fullText = `${user.username} ${user.email} ${user.mobile}`.toLowerCase();
      return fullText.includes(lowerSearch);
    });
  }, [search, users]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Reset page to 1 when search input changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div>
      <div className="p-6 bg-white rounded shadow-md space-y-5">
        {/* Header / Search */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold capitalize">Design Swipes</h1>
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
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[250px]">Images (Swipe Preferences)</TableHead>
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
                      <TableCell>
                        <div className="flex gap-2">
                          {user.preferences.slice(0, 4).map((pref) => (
                            <div key={pref.image_id} className="relative">
                              <Blobimage
                                src={pref.image_url}
                                alt={`Pref-${pref.image_id}`}
                                className="w-16 h-16 object-cover rounded border"
                              />
                              {pref.liked ? (
                                <span className="absolute top-0 left-0 bg-green-100 text-black shadow-2xl text-xs px-1 py-0.5 rounded-br">
                                  Liked
                                </span>
                              ) : (
                                <span className="absolute top-0 left-0 bg-orange-200 text-black shadow-2xl text-xs px-1 py-0.5 rounded-br">
                                  Disliked
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
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
    </div>
  );
};

export default Userdesignswipes;
