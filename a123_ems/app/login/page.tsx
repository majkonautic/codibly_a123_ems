'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1A1D23] mb-2">
              Battery Management System
            </h1>
            <p className="text-xl font-semibold text-[#1A1D23]">Welcome back</p>
            <p className="text-sm text-[#6B7280] mt-1">Login to your A123 Systems account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#1A1D23] font-medium">
                Email
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="m@example.com"
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#1A1D23] font-medium">
                  Password
                </Label>
                <a href="#" className="text-sm text-[#FF8C00] hover:text-[#E67E00]">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 bg-white border border-[#E5E7EB] rounded-md text-[#1A1D23] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#1A1D23]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#FF8C00] focus:ring-[#FF8C00] border-[#E5E7EB] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-[#6B7280]">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-2.5 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>

            {/* Demo Credentials Info */}
            <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-4">
              <p className="text-sm text-[#6B7280] text-center">
                <span className="font-medium">Demo credentials:</span>
                <br />
                Username: <span className="font-mono text-[#FF8C00]">demo</span>
                <br />
                Password: <span className="font-mono text-[#FF8C00]">demo123</span>
              </p>
            </div>
          </form>

          {/* Footer Links */}
          <div className="text-center text-xs text-[#6B7280]">
            <p>
              By clicking continue, you agree to our{' '}
              <a href="#" className="text-[#FF8C00] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#FF8C00] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{' '}
              <a href="#" className="text-[#FF8C00] hover:text-[#E67E00] font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/battery-storage.jpg"
          alt="A123 Battery Storage Container"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-95"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/10 to-transparent"></div>

        {/* Optional: Add A123 branding overlay */}
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
            A123 Systems
          </h2>
          <p className="text-lg drop-shadow-md">
            Advanced Battery Energy Storage Solutions
          </p>
        </div>
      </div>
    </div>
  );
}