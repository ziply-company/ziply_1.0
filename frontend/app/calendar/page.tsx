import React from "react";

export default function CalendarPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 w-full to-pink-100">
            <section className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
                    📅 Calendar
                </h1>
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-600 text-lg">
                        Your calendar will appear here soon!
                    </p>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition">
                        Add Event
                    </button>
                </div>
            </section>
        </main>
    );
}
