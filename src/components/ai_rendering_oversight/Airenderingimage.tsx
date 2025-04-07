import React, { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import Blobimage from '../Blobimage';

interface UserWithRenderings {
  id: number;
  username: string;
  email: string;
  mobile: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  rendering_images: string[];
}

const ITEMS_PER_PAGE = 10;

const Airenderingimage: React.FC = () => {
  const [users, setUsers] = useState<UserWithRenderings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/getAllUsersRenderingImage');
        if (response.data.status_code === 200) {
          setUsers(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch rendering images');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || 'Error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return users.filter(
      (user) => user.username.toLowerCase().includes(lowerSearch) || user.email.toLowerCase().includes(lowerSearch)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4">
      <div className="p-6 bg-white rounded shadow space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">AI Rendering Images</h2>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {error && <div className="text-red-500 text-center">{error}</div>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rendering Images</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((user, idx) => (
                    <TableRow key={user.id}>
                      <TableCell>{startIndex + idx + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        {user.rendering_images.map((imgUrl, index) => (
                          <Blobimage
                            key={index}
                            src={imgUrl}
                            alt={`rendering-${user.id}-${index}`}
                            className="w-16 h-16 rounded border object-cover"
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airenderingimage;
