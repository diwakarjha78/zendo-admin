import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Blobimage from '../Blobimage';

interface BudgetEstimationData {
  id?: number;
  title: string;
  pricelist: string[];
  image_url: string;
}

const Budgetpromptmanagement: React.FC = () => {
  // View/edit toggle
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  // Instead of a comma separated string, we maintain an array for dynamic pricelist fields
  const [pricelistItems, setPricelistItems] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Data state for the current record
  const [estimation, setEstimation] = useState<BudgetEstimationData | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch the current budget estimation on component mount
  const fetchBudgetEstimation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/getBudgetEstimation');
      const result = response.data;
      if (result.status_code === 200 && result.data) {
        const data = result.data;
        setEstimation(data);
        setTitle(data.title);
        setPricelistItems(data.pricelist);
      } else {
        setEstimation(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        (axiosError.response?.data as string) ||
          axiosError.message ||
          'Error fetching data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetEstimation();
  }, []);

  // Update image preview when file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreviewImage('');
  }, [file]);

  // Handler for dynamic pricelist item change
  const handlePriceItemChange = (index: number, value: string) => {
    const updatedItems = [...pricelistItems];
    updatedItems[index] = value;
    setPricelistItems(updatedItems);
  };

  // Handler to add a new pricelist item field
  const addPriceItem = () => {
    setPricelistItems([...pricelistItems, '']);
  };

  // Handler to remove a pricelist item field
  const removePriceItem = (index: number) => {
    const updatedItems = pricelistItems.filter((_, i) => i !== index);
    setPricelistItems(updatedItems);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!file) {
      setError('Image is required');
      setSubmitLoading(false);
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      setSubmitLoading(false);
      return;
    }

    // Clean pricelist: trim each item and filter out empties
    const cleanedPricelist = pricelistItems
      .map((item) => item.trim())
      .filter((item) => item !== '');
    if (cleanedPricelist.length === 0) {
      setError('Pricelist must contain at least one item');
      setSubmitLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('pricelist', JSON.stringify(cleanedPricelist));
      formData.append('image', file);

      const response = await api.post('/budgetEstimation', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = response.data;
      if (result.status_code === 200) {
        setSuccessMsg(result.message);
        // Refresh the record and exit edit mode
        await fetchBudgetEstimation();
        setIsEditing(false);
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        (axiosError.response?.data as string) ||
          axiosError.message ||
          'Error submitting form'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Cancel editing and reset form values
  const handleCancel = () => {
    if (estimation) {
      setTitle(estimation.title);
      setPricelistItems(estimation.pricelist);
    }
    setFile(null);
    setIsEditing(false);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow-md space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Budget Prompt Management</h1>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="cursor-pointer"
          >
            Edit
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* View Mode */}
          {!isEditing && estimation && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Title Column */}
              <div>
                <p className="text-lg font-semibold mb-1">Title</p>
                <p className="text-gray-700">{estimation.title}</p>
              </div>

              {/* Pricelist Column */}
              <div>
                <p className="text-lg font-semibold mb-1">Pricelist</p>
                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                  {estimation.pricelist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* Image Column */}
              <div>
                <p className="text-lg font-semibold mb-1">Image</p>
                {estimation.image_url && (
                  <div className="mt-2">
                    <Blobimage
                      src={estimation.image_url}
                      alt="Budget Estimation"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pricelist
                </label>
                <div className="space-y-2">
                  {pricelistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handlePriceItemChange(index, e.target.value)
                        }
                        placeholder={`Item ${index + 1}`}
                        className="w-full"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePriceItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPriceItem}
                >
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  className="w-full"
                />
              </div>
              {previewImage && (
                <div>
                  <p className="text-sm text-gray-600">Image Preview:</p>
                  <Blobimage
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
              {error && <p className="text-red-500">{error}</p>}
              {successMsg && <p className="text-green-500">{successMsg}</p>}
              <div className="flex items-center space-x-4">
                <Button type="submit" disabled={submitLoading}>
                  {submitLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* No record found view */}
          {!loading && !estimation && !isEditing && (
            <div className="border rounded p-6 text-center space-y-4">
              <p className="text-gray-600">No budget estimation record found.</p>
              <Button onClick={() => setIsEditing(true)}>
                Create Budget Estimation
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Budgetpromptmanagement;
