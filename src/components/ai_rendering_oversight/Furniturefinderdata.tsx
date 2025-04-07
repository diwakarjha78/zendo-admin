import React, { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsLeft, ChevronsRight, Loader2, Trash2 } from 'lucide-react';
import Blobimage from '../Blobimage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FurnitureItem {
  title: string;
  price?: { value: string };
  source: string;
  link: string;
  thumbnail: string;
  in_stock: boolean;
}

interface Rendering {
  rendering_id: number;
  ai_image: string;
  createdAt: string;
  furniture?: Record<string, FurnitureItem[]>;
}

interface UserRenderData {
  id: number;
  username: string;
  email: string;
  renderings: Rendering[];
}

const ITEMS_PER_PAGE = 10;

const FurnitureFinder: React.FC = () => {
  const [users, setUsers] = useState<UserRenderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRendering, setSelectedRendering] = useState<{
    user: UserRenderData;
    rendering: Rendering;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/getAllUserRenderingData');
      if (res.data.status_code === 200) {
        setUsers(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (renderingIds: number[]) => {
    if (!renderingIds.length) return;
    try {
      setLoading(true);
      const res = await api.post('/deleteRenderingImage', renderingIds);
      if (res.data.status_code === 200) {
        fetchData();
      } else {
        setError(res.data.message || 'Failed to delete');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Rendering Modal */}
      <Dialog open={!!selectedRendering} onOpenChange={() => setSelectedRendering(null)}>
        <DialogContent className="max-w-[90vw] w-full max-h-[90vh] overflow-y-auto bg-white rounded shadow-lg">
          {selectedRendering && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">Rendering Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <Blobimage
                  src={selectedRendering.rendering.ai_image}
                  alt={`rendering-${selectedRendering.rendering.rendering_id}`}
                  className="w-full object-contain rounded-xl border"
                />
                <div className="flex flex-col gap-5">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-lg font-medium">
                      <span className="text-gray-600">Username:</span> {selectedRendering.user.username}
                    </p>
                    <p className="text-lg font-medium">
                      <span className="text-gray-600">Email:</span> {selectedRendering.user.email}
                    </p>
                    <p className="text-md text-gray-500">
                      <span className="text-gray-700 font-semibold">Created:</span>{' '}
                      {new Date(selectedRendering.rendering.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {selectedRendering.rendering.furniture &&
                    Object.entries(selectedRendering.rendering.furniture).length > 0 && (
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-md text-gray-700">Furniture Items</h4>
                        {Object.entries(selectedRendering.rendering.furniture).map(([category, items]) =>
                          items.map((item, idx) => (
                            <div key={`${category}-${idx}`} className="p-3 border rounded-md bg-white space-y-1">
                              <p>
                                <strong>Category:</strong> {category}
                              </p>
                              <p>
                                <strong>Title:</strong> {item.title}
                              </p>
                              <p>
                                <strong>Price:</strong> {item.price?.value || 'N/A'}
                              </p>
                              <p>
                                <strong>Source:</strong> {item.source}
                              </p>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                View Source
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleDelete([selectedRendering.rendering.rendering_id]);
                      setSelectedRendering(null);
                    }}
                    className="cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Image
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Main UI */}
      <div className="p-6 bg-white rounded shadow-md space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-800">User Rendering Data</h2>
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
                  <TableHead>Images</TableHead>
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
                      <TableCell className="flex gap-2 flex-wrap max-w-[300px]">
                        {user.renderings.map((rendering) => (
                          <Blobimage
                            key={rendering.rendering_id}
                            src={rendering.ai_image}
                            alt={`rendering-${rendering.rendering_id}`}
                            className="w-16 h-16 object-cover rounded cursor-pointer border"
                            onClick={() => setSelectedRendering({ user, rendering })}
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

        {totalPages > 1 && (
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

export default FurnitureFinder;
