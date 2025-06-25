import React from 'react';

export default function MarketingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white w-full to-green-100">
      <section className="bg-white rounded-xl shadow-xl p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Welcome to Ziply Marketing!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover how Ziply can help your business grow with innovative marketing solutions
          tailored just for you.
        </p>
        <a
          href="#"
          className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}
