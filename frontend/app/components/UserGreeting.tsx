'use client';

import { useEffect, useState } from 'react';

interface User {
  email: string;
  name: string;
}

export default function UserGreeting() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const access = localStorage.getItem('access');
    console.log('🪪 Token:', access);
    if (!access) return;

    const fetchUser = async () => {
      try {
        console.log('🌐 Відправляємо fetch...');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        console.log('📬 Response:', res);
        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        console.log('User data:', data);
        setUser(data);
      } catch (err) {
        console.error('User fetch error:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <section>
      <h1 className="text-lg sm:text-2xl font-bold">
        {user ? `Welcome back, ${user.name}!` : 'Welcome to Ziply!'}
      </h1>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        Here’s a quick snapshot of your business. Create a new post to engage your clients!
        <button
          className="ml-2 sm:ml-3 inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs sm:text-sm font-medium shadow"
          type="button"
        >
          + Create Post
        </button>
      </p>
    </section>
  );
}
