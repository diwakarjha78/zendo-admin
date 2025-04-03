import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';

interface VerifyOtpProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  onNext: () => void;
  setMessage: (msg: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  timer: number;
  canResend: boolean;
  handleResend: () => void;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({
  email,
  otp,
  setOtp,
  onNext,
  setMessage,
  loading,
  setLoading,
  timer,
  canResend,
  handleResend,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post('/forgetPasswordOtpVerify', { email, otp });
      setMessage(response.data.message);
      toast.success('OTP verified successfully');
      onNext();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="otp"
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="mt-1 rounded border border-gray-300 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
      />
      <Button type="submit" className="w-full mt-2 rounded cursor-pointer" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
      <div className="text-center mt-2">
        <button
          type="button"
          className={`text-blue-500 underline ${!canResend ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleResend}
          disabled={!canResend || loading}
        >
          {canResend ? 'Resend OTP?' : `Resend OTP in ${timer}s`}
        </button>
      </div>
    </form>
  );
};

export default VerifyOtp;
