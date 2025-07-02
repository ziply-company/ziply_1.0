'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApiSuccessResponse {
  access: string;
  refresh: string;
  message: string;
}

interface ApiErrorResponse {
  [key: string]: string[] | string;
}

export default function ConfirmRegistrationPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const tokenFromUrl = url.searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Registration token not found. Please use the link from your email.');
      return;
    }

    setToken(tokenFromUrl);

    try {
      const base64Part = tokenFromUrl.split(':')[0];
      const standardBase64 = base64Part.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (standardBase64.length % 4)) % 4);
      const decodedEmail = atob(standardBase64 + padding);
      console.log('Decoded email:', decodedEmail);
      setEmail(decodedEmail);
    } catch (e) {
      console.error(e);
      setError('Invalid token format. Please use the link from your email again.');
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!token) {
      setError('Token is missing. Cannot proceed.');
      setLoading(false);
      return;
    }

    console.log({ name, businessName, email, password, token });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${apiUrl}/accounts/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, business_name: businessName, email, password, token }),
      });

      const data: ApiSuccessResponse | ApiErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        const errorMessages = Object.values(errorData).flat().join(' ');
        throw new Error(errorMessages || 'An unknown error occurred.');
      }

      const successData = data as ApiSuccessResponse;
      setSuccessMessage(successData.message || 'Registration successful! Redirecting...');

      localStorage.setItem('access', successData.access);
      localStorage.setItem('refresh', successData.refresh);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Registration</h2>
        </div>

        {successMessage ? (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading || !token || !!successMessage}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
