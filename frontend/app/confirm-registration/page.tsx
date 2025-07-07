'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './conf-reg.css';

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
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {successMessage ? (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded" role="alert">
          <span className="font-medium">Success!</span> {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-2 border rounded"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading || !token || !!successMessage}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
          Log in
        </Link>
      </p>
    </main>
  );
}
