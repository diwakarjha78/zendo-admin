import React, { useEffect, useState, useMemo } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Toaster, toast } from 'sonner';

interface Contact {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: number;
    username: string;
    email: string;
  };
}

interface GetAllContactUsResponse {
  status_code: number;
  message: string;
  data: Contact[];
}

const ITEMS_PER_PAGE = 10;

const Customerfeedback: React.FC = () => {
  // State management
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal state for delete and update
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form state for updating contact
  const [updateForm, setUpdateForm] = useState({
    id: 0,
    full_name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all contact us data
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<GetAllContactUsResponse>('/getAllContactUs');
        const result = response.data;
        if (result.status_code === 200) {
          setContacts(result.data);
        } else {
          setError(result.message || 'No contacts found');
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.response ? String(axiosError.response.data) : axiosError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filtered data based on search input
  const filteredData = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return contacts.filter((contact) => {
      const combinedText = `${contact.full_name} ${contact.email} ${contact.mobile} ${contact.message}`.toLowerCase();
      return combinedText.includes(lowerSearch);
    });
  }, [search, contacts]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Delete contact handler
  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    setDeleteLoading(true);
    try {
      // Call your delete endpoint using id from request body
      const response = await api.delete('/deleteContactUs', { data: { id: selectedContact.id } });
      const result = response.data as { status_code: number; message: string };
      if (result.status_code === 200) {
        setContacts((prev) => prev.filter((contact) => contact.id !== selectedContact.id));
        toast.success('Contact deleted successfully.');
      } else {
        toast.error(result.message || 'Failed to delete contact.');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error('Error deleting contact.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedContact(null);
    }
  };

  // Open update modal and set form values
  const openUpdateModal = (contact: Contact) => {
    setSelectedContact(contact);
    setUpdateForm({
      id: contact.id,
      full_name: contact.full_name,
      email: contact.email,
      mobile: contact.mobile,
      message: contact.message,
    });
    setUpdateModalOpen(true);
  };

  // Handle update form change
  const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  // Update contact handler
  const handleUpdateContact = async () => {
    setUpdateLoading(true);
    try {
      const response = await api.put('/updateContactUs', updateForm);
      const result = response.data as { status_code: number; message: string; data: Contact };
      if (result.status_code === 200) {
        setContacts((prev) =>
          prev.map((contact) => (contact.id === result.data.id ? { ...contact, ...result.data } : contact))
        );
        toast.success('Contact updated successfully.');
        setUpdateModalOpen(false);
      } else {
        toast.error(result.message || 'Failed to update contact.');
      }
    } catch (err) {
      console.error('Error updating contact:', err);
      toast.error('Error updating contact.');
    } finally {
      setUpdateLoading(false);
      setSelectedContact(null);
    }
  };

  return (
    <div className="mt-4">
      <Toaster />
      <div className="p-6 bg-white rounded shadow-md space-y-5">
        {/* Header and Search */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">Customer Feedback</h1>
          <div className="min-w-20 w-full max-w-xs">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded shadow-none focus:outline-none focus:ring-0"
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No feedback found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((contact, idx) => (
                    <TableRow key={contact.id}>
                      <TableCell>{startIndex + idx + 1}</TableCell>
                      <TableCell>{contact.full_name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.mobile}</TableCell>
                      <TableCell>{contact.message}</TableCell>
                      <TableCell>{new Date(contact.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="flex justify-center items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => openUpdateModal(contact)} className="p-1">
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedContact(contact);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-end pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={page === 1}
              className="flex items-center justify-center rounded"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page === totalPages}
              className="flex items-center justify-center rounded"
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
              Are you sure you want to delete feedback from <strong>{selectedContact?.full_name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteContact} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Feedback</DialogTitle>
            <DialogDescription>
              Update the details for <strong>{selectedContact?.full_name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              name="full_name"
              placeholder="Full Name"
              value={updateForm.full_name}
              onChange={handleUpdateFormChange}
            />
            <Input name="email" placeholder="Email" value={updateForm.email} onChange={handleUpdateFormChange} />
            <Input name="mobile" placeholder="Mobile" value={updateForm.mobile} onChange={handleUpdateFormChange} />
            <textarea
              name="message"
              placeholder="Message"
              value={updateForm.message}
              onChange={handleUpdateFormChange}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-1"
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateContact} disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customerfeedback;
