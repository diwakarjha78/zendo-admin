import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
  setMessage: (msg: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ email, setEmail, onNext, setMessage, setLoading }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post('/forgetPasswordOtpGenerate', { email });
      setMessage(response.data.message);
      toast.success('OTP has been sent to your email');
      onNext();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="email"
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mt-1 rounded border border-gray-300 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      />
      <Button type="submit" className="w-full mt-2 rounded cursor-pointer">
        Send OTP
      </Button>
    </form>
  );
};

export default EmailForm;
