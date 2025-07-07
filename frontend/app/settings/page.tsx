import React from 'react';

export const metadata = {
    title: "Settings",
    description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center w-full">
      <section className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Settings</h1>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Dark Mode</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <span className="ml-3 text-sm text-gray-500">Off</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Notifications</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <span className="ml-3 text-sm text-gray-500">On</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">Language</span>
            <select className="border rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
        <button className="mt-8 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Save Changes
        </button>
      </section>
    </main>
  );
}
