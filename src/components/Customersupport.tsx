import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { Toaster, toast } from 'sonner';
import Blobimage from './Blobimage';

interface ContactDetails {
  email: string;
  mobile: string;
  email_image_url?: string;
  mobile_image_url?: string;
}

const Customersupport: React.FC = () => {
  // We'll merge the two objects returned by the API into a single object.
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
      const res = await api.get<{ data: any }>('/getContactDetails');
      // Expecting res.data.data to be an array of two objects:
      // index 0: { email: '...', image_url: '...' }
      // index 1: { mobile: '...', image_url: '...' }
      if (Array.isArray(res.data.data) && res.data.data.length >= 2) {
        const data = res.data.data;
        const merged: ContactDetails = {
          email: data[0].email,
          email_image_url: data[0].image_url,
          mobile: data[1].mobile,
          mobile_image_url: data[1].image_url,
        };
        setContact(merged);
        // Populate form fields with merged data
        setEmail(merged.email);
        setMobile(merged.mobile);
        if (merged.email_image_url) setPreviewEmailImage(merged.email_image_url);
        if (merged.mobile_image_url) setPreviewMobileImage(merged.mobile_image_url);
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
      // If contact exists, update; otherwise, create new.
      if (contact) {
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
    try {
      // Since there's no id in the merged object, our backend should be set up to delete the single contact record.
      await api.delete('/deleteContactDetails');
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
    <div className="p-4 max-w-3xl mx-auto">
      <Toaster />
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
          <CardTitle>Customer Support</CardTitle>
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" type="text" value={mobile} onChange={handleMobileChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email_image">Email Image</Label>
                  <Input id="email_image" type="file" accept="image/*" onChange={handleEmailImageChange} />
                  {previewEmailImage && (
                    <img
                      src={previewEmailImage}
                      alt="Email Preview"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile_image">Mobile Image</Label>
                  <Input id="mobile_image" type="file" accept="image/*" onChange={handleMobileImageChange} />
                  {previewMobileImage && (
                    <img
                      src={previewMobileImage}
                      alt="Mobile Preview"
                      className="mt-2 w-32 h-32 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // Display mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">Email</Label>
                  <p className="text-gray-700">{contact?.email || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Mobile</Label>
                  <p className="text-gray-700">{contact?.mobile || 'Not provided'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 flex flex-col items-center">
                  <Label className="font-medium">Email Image</Label>
                  {contact?.email_image_url ? (
                    <Blobimage src={contact.email_image_url} alt="Email" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded border">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 flex flex-col items-center">
                  <Label className="font-medium">Mobile Image</Label>
                  {contact?.mobile_image_url ? (
                    <Blobimage src={contact.mobile_image_url} alt="Mobile" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded border">
                      <span>No Image</span>
                    </div>
                  )}
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
    </div>
  );
};

export default Customersupport;
