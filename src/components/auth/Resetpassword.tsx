import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ResetPasswordProps {
  email: string;
  password: string;
  setPassword: (password: string) => void;
  onNext: () => void;
  setMessage: (msg: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  email,
  password,
  setPassword,
  onNext,
  setMessage,
  loading,
  setLoading,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post('/createPassword', { email, password });
      setMessage(response.data.message);
      toast.success('Password reset successful');
      onNext();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to reset password. Please try again.');
      toast.error('Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="password"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-1 rounded border border-gray-300 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      />
      <Button type="submit" className="w-full mt-2 rounded cursor-pointer" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  );
};

export default ResetPassword;
