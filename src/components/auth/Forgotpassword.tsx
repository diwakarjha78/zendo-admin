import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Toaster } from 'sonner';
import EmailForm from './Emailform'; // similar refactored component for email
import VerifyOtp from './Verifyotp';
import ResetPassword from './Resetpassword';
import SuccessMessage from './Successmessage'; // your success message component

type ViewType = 'email' | 'verify' | 'reset' | 'success';

const Forgotpassword: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (currentView === 'verify') {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
      } else {
        setCanResend(true);
      }
    }
  }, [timer, currentView]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex min-h-screen w-screen flex-col items-center justify-center sm:bg-gray-50 p-4">
        <Card className="w-full max-w-md rounded-none shadow-none border-none sm:rounded-lg sm:shadow-lg">
          <CardHeader className="text-center">
            <img src="/logo.png" alt="zendo-logo" className="mx-auto mb-2 h-16 w-16 rounded-full" />
            <CardTitle className="text-2xl">
              {currentView === 'email' && 'Forgot Your Password?'}
              {currentView === 'verify' && 'Verify OTP'}
              {currentView === 'reset' && 'Reset Password'}
              {currentView === 'success' && 'Success'}
            </CardTitle>
            <CardDescription>
              {currentView === 'email' && 'Input your registered email to reset your password'}
              {currentView === 'verify' && `Enter the OTP sent to your email (${email})`}
              {currentView === 'reset' && 'Create a new password'}
              {currentView === 'success' && 'Your password has been reset successfully'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {currentView === 'email' && (
              <EmailForm
                email={email}
                setEmail={setEmail}
                onNext={() => setCurrentView('verify')}
                setMessage={setMessage}
                setLoading={setLoading}
                loading={loading}
              />
            )}
            {currentView === 'verify' && (
              <VerifyOtp
                email={email}
                otp={otp}
                setOtp={setOtp}
                onNext={() => setCurrentView('reset')}
                setMessage={setMessage}
                loading={loading}
                setLoading={setLoading}
                timer={timer}
                canResend={canResend}
                handleResend={() => {
                  setCanResend(false);
                  setTimer(60);
                  // Call resend function from parent or within the component as needed
                }}
              />
            )}
            {currentView === 'reset' && (
              <ResetPassword
                email={email}
                password={password}
                setPassword={setPassword}
                onNext={() => setCurrentView('success')}
                setMessage={setMessage}
                loading={loading}
                setLoading={setLoading}
              />
            )}
            {currentView === 'success' && <SuccessMessage message={message} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Forgotpassword;
