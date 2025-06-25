import React from 'react';
import Image from 'next/image'; // Import the Image component from Next.js

const staffMembers = [
  {
    name: 'Alice Johnson',
    role: 'Manager',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'alice.johnson@example.com',
  },
  {
    name: 'Bob Smith',
    role: 'Support Specialist',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'bob.smith@example.com',
  },
  {
    name: 'Clara Lee',
    role: 'Developer',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    email: 'clara.lee@example.com',
  },
  {
    name: 'David Kim',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/men/76.jpg',
    email: 'david.kim@example.com',
  },
];

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      {/* Changed 'Our Staff' to use an escaped apostrophe */}
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">Our Staff</h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
        {staffMembers.map((staff) => (
          <div
            key={staff.email}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center"
          >
            {/* Replaced <img> with <Image /> from next/image for optimization */}
            <Image
              src={staff.image}
              alt={staff.name}
              width={96} // Equivalent to w-24 (96px)
              height={96} // Equivalent to h-24 (96px)
              className="rounded-full border-4 border-purple-200 mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold text-purple-700">{staff.name}</h2>
            <p className="text-purple-500 mb-2">{staff.role}</p>
            <a href={`mailto:${staff.email}`} className="text-sm text-blue-500 hover:underline">
              {staff.email}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
