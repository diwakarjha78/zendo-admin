import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import usePagetitle from '@/hooks/usePagetitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  usePagetitle('Login - Zendo Admin');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('https://zondo.brancosoft.ae/api/v1/login', {
        email,
        password,
        fcm_token: '',
      });

      const data = res.data;

      if (data.status_code === 200) {
        if (!data.data.is_admin) {
          setError('Cannot login without an admin account.');
          setLoading(false);
          return;
        }

        // Store tokens based on "remember me" choice
        if (rememberMe) {
          localStorage.setItem('zendo_at', data.data.token);
          localStorage.setItem('zendo_rt', data.data.refresh_token);
        } else {
          sessionStorage.setItem('zendo_at', data.data.token);
          sessionStorage.setItem('zendo_rt', data.data.refresh_token);
        }
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center sm:bg-gray-50 p-4">
      <Card className="w-full max-w-md rounded-none shadow-none border-none sm:rounded-lg sm:shadow-lg">
        <CardHeader className="text-center">
          <img src="/logo.png" alt="zendo-logo" className="mx-auto mb-2 h-16 w-16 rounded-full" />
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 rounded border border-gray-300 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0"
            />

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 rounded border border-gray-300 shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full mt-2 rounded cursor-pointer" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="w-full flex justify-end mt-2">
            <Link to="/auth/forgot-password" className="text-sm text-blue-500">
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
