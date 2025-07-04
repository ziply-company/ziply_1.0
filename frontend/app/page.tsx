import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome to Ziply',
  description: 'Generated by create next app',
};

export default function Home() {
  return (
    <main className="flex flex-col gap-6 w-full">
      <section>
        <h1 className="text-lg sm:text-2xl font-bold">Welcome back, Sarah!</h1>
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
      <section>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 border border-blue-100">
          <h2 className="text-base sm:text-lg font-bold mb-2 sm:mb-3 text-blue-700 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Today&#39;s Agenda
          </h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="font-medium text-gray-800">10:00 AM</span>
              <span className="text-gray-500">– Team Standup Meeting</span>
            </li>
            <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-medium text-gray-800">11:30 AM</span>
              <span className="text-gray-500">– Client Consultation: Acme Corp</span>
            </li>
            <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="font-medium text-gray-800">1:00 PM</span>
              <span className="text-gray-500">– Lunch Break</span>
            </li>
            <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="font-medium text-gray-800">2:00 PM</span>
              <span className="text-gray-500">– Marketing Strategy Review</span>
            </li>
            <li className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-500"></span>
              <span className="font-medium text-gray-800">4:00 PM</span>
              <span className="text-gray-500">– Inventory Check</span>
            </li>
          </ul>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-2 sm:gap-4">
          {/* Success Alert */}
          <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 text-green-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm text-xs sm:text-base">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Success!</span>
            <span>Your changes have been saved.</span>
          </div>
          {/* Warning Alert */}
          <div className="flex items-center gap-2 sm:gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm text-xs sm:text-base">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Warning!</span>
            <span>Your subscription will expire soon.</span>
          </div>
          {/* Error Alert */}
          <div className="flex items-center gap-2 sm:gap-3 bg-red-50 border border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm text-xs sm:text-base">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">Error!</span>
            <span>There was a problem processing your request.</span>
          </div>
          {/* Info Alert */}
          <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm text-xs sm:text-base">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <span className="font-medium">Info:</span>
            <span>New features have been added to your dashboard.</span>
          </div>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-blue-600">1,245</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-2">Active Users</span>
          </div>
          <div className="bg-white rounded shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">$9,876</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-2">Revenue</span>
          </div>
          <div className="bg-white rounded shadow p-4 sm:p-6 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-bold text-purple-600">87%</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-2">Satisfaction</span>
          </div>
        </div>
      </section>
      <section className="bg-white rounded shadow p-4 sm:p-6 mt-4">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-base">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-3 text-gray-600">Date</th>
                <th className="py-2 px-2 sm:px-3 text-gray-600">Event</th>
                <th className="py-2 px-2 sm:px-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2 px-2 sm:px-3">2024-06-10</td>
                <td className="py-2 px-2 sm:px-3">User signed up</td>
                <td className="py-2 px-2 sm:px-3">
                  <span className="text-green-600">Success</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-2 sm:px-3">2024-06-09</td>
                <td className="py-2 px-2 sm:px-3">Payment processed</td>
                <td className="py-2 px-2 sm:px-3">
                  <span className="text-blue-600">Completed</span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-2 sm:px-3">2024-06-08</td>
                <td className="py-2 px-2 sm:px-3">Feedback received</td>
                <td className="py-2 px-2 sm:px-3">
                  <span className="text-purple-600">Reviewed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <div className="bg-white rounded shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Weekly Booking Stats</h2>
          <div className="flex items-end h-32 sm:h-40 gap-2 sm:gap-4">
            {[
              { day: 'Mon', value: 8 },
              { day: 'Tue', value: 12 },
              { day: 'Wed', value: 6 },
              { day: 'Thu', value: 10 },
              { day: 'Fri', value: 15 },
              { day: 'Sat', value: 9 },
              { day: 'Sun', value: 4 },
            ].map(({ day, value }) => (
              <div key={day} className="flex flex-col items-center w-6 sm:w-8">
                <div
                  className="w-full rounded-t bg-blue-500 transition-all"
                  style={{
                    height: `${(value / 15) * 100}%`,
                    minHeight: '10px',
                  }}
                ></div>
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">{day}</span>
                <span className="text-[10px] sm:text-xs text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs sm:text-sm font-medium shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Booking
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs sm:text-sm font-medium shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
            Add Client
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-xs sm:text-sm font-medium shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3" />
            </svg>
            Export Data
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-xs sm:text-sm font-medium shadow">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
              />
            </svg>
            Send Notification
          </button>
        </div>
      </section>
    </main>
  );
}
