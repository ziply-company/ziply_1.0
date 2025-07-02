'use client';

import { useState, FormEvent } from 'react';

// Define types for the API responses to avoid using 'any'
interface ApiSuccessResponse {
  message: string;
}

interface ApiErrorResponse {
  detail?: string;
  email?: string[];
}

export default function EmailStartPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // It's recommended to use environment variables for the API URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${apiUrl}/accounts/email-start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // By typing the JSON response, we gain type safety and satisfy the linter.
      const data: ApiSuccessResponse | ApiErrorResponse = await response.json();

      if (!response.ok) {
        // We can safely cast to the error type within this block.
        const errorData = data as ApiErrorResponse;
        // Handle errors from DRF. They might be in the format { email: ["message"] }
        if (errorData.email && Array.isArray(errorData.email)) {
          throw new Error(errorData.email[0]);
        }
        throw new Error(errorData.detail || 'An unknown error occurred.');
      }

      // In the success case, we can cast to the success type.
      setSuccessMessage(
        (data as ApiSuccessResponse).message ||
          'A confirmation email has been sent. Please check your inbox.',
      );
      setEmail(''); // Clear the input field after successful submission
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Register</h2>
        <p className="text-center text-gray-600">
          Enter your email to receive a confirmation link.
        </p>

        {successMessage ? (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
