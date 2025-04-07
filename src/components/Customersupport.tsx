import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { Toaster, toast } from 'sonner';
import Blobimage from './Blobimage';
import Customerfeedback from './Customerfeedback';

interface ContactDetails {
  id: number;
  email: string;
  mobile: string;
  email_image_url?: string;
  mobile_image_url?: string;
}

const Customersupport: React.FC = () => {
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  // For image files
  const [emailImage, setEmailImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  // For image previews (from existing data or new selection)
  const [previewEmailImage, setPreviewEmailImage] = useState<string>('');
  const [previewMobileImage, setPreviewMobileImage] = useState<string>('');

  // Fetch contact details on mount
  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: ContactDetails }>('/getContactDetails');
      // Now expecting res.data.data to be a single object
      if (res.data.data) {
        const data = res.data.data;
        setContact(data);
        setEmail(data.email);
        setMobile(data.mobile);
        if (data.email_image_url) setPreviewEmailImage(data.email_image_url);
        if (data.mobile_image_url) setPreviewMobileImage(data.mobile_image_url);
      }
    } catch (error) {
      toast.error('Error fetching contact details');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setMobile('');
    setEmailImage(null);
    setMobileImage(null);
    setPreviewEmailImage('');
    setPreviewMobileImage('');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
  };

  const handleEmailImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEmailImage(file);
      setPreviewEmailImage(URL.createObjectURL(file));
    }
  };

  const handleMobileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMobileImage(file);
      setPreviewMobileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !mobile) {
      toast.error('Email and Mobile are required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('mobile', mobile);
    if (emailImage) formData.append('email_image', emailImage);
    if (mobileImage) formData.append('mobile_image', mobileImage);

    try {
      let res;
      // If contact exists, update (append id), otherwise create new.
      if (contact) {
        formData.append('id', contact.id.toString());
        res = await api.put('/updateContactDetails', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/createContactDetails', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      toast.success(res.data.message);
      fetchContactDetails();
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving contact details');
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    const confirmDelete = window.confirm('Are you sure you want to delete the contact details?');
    if (!confirmDelete) return;

    try {
      // Sending id in the request body using Axios delete config
      await api.delete('/deleteContactDetails', { data: { id: contact.id } });
      toast.success('Contact details deleted successfully');
      setContact(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting contact details');
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading contact details...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Toaster />
      <Card className="w-full rounded">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold capitalize">Customer Support</CardTitle>
          {contact && !editing && (
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Field with Icon */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-4">
                    {previewEmailImage ? (
                      <Blobimage
                        src={previewEmailImage}
                        alt="Email Icon"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                        <span className="text-gray-500 text-xs">Icon</span>
                      </div>
                    )}
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="flex-1"
                    />
                  </div>
                  <Input id="email_image" type="file" accept="image/*" onChange={handleEmailImageChange} />
                </div>

                {/* Mobile Field with Icon */}
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <div className="flex items-center space-x-4">
                    {previewMobileImage ? (
                      <Blobimage
                        src={previewMobileImage}
                        alt="Mobile Icon"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                        <span className="text-gray-500 text-xs">Icon</span>
                      </div>
                    )}
                    <Input
                      id="mobile"
                      type="text"
                      value={mobile}
                      onChange={handleMobileChange}
                      required
                      className="flex-1"
                    />
                  </div>
                  <Input id="mobile_image" type="file" accept="image/*" onChange={handleMobileImageChange} />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    // Optionally, reset form if canceling edit
                    fetchContactDetails();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // Display Mode: Icon integrated with text
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  {contact?.email_image_url ? (
                    <Blobimage
                      src={contact.email_image_url}
                      alt="Email Icon"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                      <span className="text-gray-500 text-xs">Icon</span>
                    </div>
                  )}
                  <div>
                    <Label className="font-medium">Email</Label>
                    <p className="text-gray-700">{contact?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {contact?.mobile_image_url ? (
                    <Blobimage
                      src={contact.mobile_image_url}
                      alt="Mobile Icon"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                      <span className="text-gray-500 text-xs">Icon</span>
                    </div>
                  )}
                  <div>
                    <Label className="font-medium">Mobile</Label>
                    <p className="text-gray-700">{contact?.mobile || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              {!contact && (
                <div className="flex justify-center">
                  <Button onClick={() => setEditing(true)}>Add Contact Details</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Customerfeedback />
    </div>
  );
};

export default Customersupport;
