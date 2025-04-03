import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import Blobimage from './Blobimage';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  mobile: string;
  provider_id?: string | null;
  provider: string;
  fcm_token?: string;
  token: string;
  refresh_token: string;
  image_url?: string;
  subscription: boolean;
  is_active: boolean;
  is_admin: boolean;
  createdAt: string;
  updatedAt: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ username: string; mobile: string }>({
    username: '',
    mobile: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Replace with your real auth token retrieval
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ data: UserProfile }>('/userGetProfileData', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response:', res.data);
        if (res.data?.data) {
          setProfile(res.data.data);
          setFormData({
            username: res.data.data.username,
            mobile: res.data.data.mobile,
          });
          // Set preview to existing image if available
          if (res.data.data.image_url) {
            setImagePreview(res.data.data.image_url);
          }
        } else {
          console.error('Unexpected API response:', res.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Generate a preview for the selected image file
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const updateData = new FormData();
    updateData.append('username', formData.username);
    updateData.append('mobile', formData.mobile);
    // Use "image" as required by the multer configuration
    if (file) {
      updateData.append('image', file);
    }

    try {
      const res = await api.post<{ data: UserProfile }>('/userUpdateProfile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data?.data) {
        setProfile(res.data.data);
        setEditing(false);
      } else {
        setError('Unexpected response from server.');
        console.error('Unexpected API response:', res.data);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Card className="p-6 space-y-2">
          <CardHeader>
            <CardTitle>Loading profile...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <Card className="p-6 space-y-2">
          <CardHeader>
            <CardTitle>Profile not found</CardTitle>
            <CardDescription>Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile header */}
      <Card>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 shadow border-gray-100 border">
              {profile.image_url ? (
                <Blobimage src={profile.image_url} className="w-full h-full object-cover" alt="profile-image" />
              ) : (
                <AvatarFallback>{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold leading-none">{profile.username}</h1>
                {profile.is_admin && <Badge variant="secondary">Admin</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Mode: Form */}
      {editing ? (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Edit Profile</CardTitle>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="cursor-pointer transition-all duration-300 ease-in-out">
                  {submitting ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditing(false)}
                  className="transition-all duration-300 ease-in-out cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-muted-foreground">
                  Username
                </Label>
                <input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="block text-sm font-medium text-muted-foreground">
                  Mobile Number
                </Label>
                <input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="mt-1 block w-full rounded border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="image" className="block text-sm font-medium text-muted-foreground">
                  Profile Image
                </Label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-colors"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-40 w-40 rounded-full object-cover border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </form>
        </Card>
      ) : (
        // Display mode
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="transition-all duration-300 ease-in-out cursor-pointer"
            >
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Username</Label>
                <p className="mt-1">{profile.username}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Email Address</Label>
                <p className="mt-1">{profile.email}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Phone Number</Label>
                <p className="mt-1">{profile.mobile}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Provider</Label>
                <p className="mt-1">{profile.provider}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Account Status</Label>
                <p className="mt-1">{profile.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
