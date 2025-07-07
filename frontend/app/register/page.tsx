'use client';

import { useState, FormEvent } from 'react';
import './register.css';

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
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {successMessage ? (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded" role="alert">
          <span className="font-medium">Success!</span> {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      )}
    </main>
  );
}
