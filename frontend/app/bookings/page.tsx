export const metadata = {
    title: "Your Bookings",
};

export default function Booking() {
  return (
    <main className="flex flex-col gap-6 w-full">
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">Your Bookings</h1>
        <ul className="space-y-6">
          <li className="p-6 border border-gray-200 rounded-lg shadow flex flex-col bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
            <span className="font-bold text-lg text-blue-900 mb-1">Booking #12345</span>
            <span className="text-gray-700">
              Date: <span className="font-medium">2024-07-01</span>
            </span>
            <span className="text-gray-700">
              Service: <span className="font-medium">Home Cleaning</span>
            </span>
            <span className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold w-max">
              Confirmed
            </span>
          </li>
          <li className="p-6 border border-gray-200 rounded-lg shadow flex flex-col bg-gradient-to-r from-yellow-50 to-yellow-100 hover:shadow-xl transition-shadow">
            <span className="font-bold text-lg text-yellow-900 mb-1">Booking #12346</span>
            <span className="text-gray-700">
              Date: <span className="font-medium">2024-07-10</span>
            </span>
            <span className="text-gray-700">
              Service: <span className="font-medium">Lawn Mowing</span>
            </span>
            <span className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold w-max">
              Pending
            </span>
          </li>
          <li className="p-6 border border-gray-200 rounded-lg shadow flex flex-col bg-gradient-to-r from-red-50 to-red-100 hover:shadow-xl transition-shadow">
            <span className="font-bold text-lg text-red-900 mb-1">Booking #12347</span>
            <span className="text-gray-700">
              Date: <span className="font-medium">2024-07-15</span>
            </span>
            <span className="text-gray-700">
              Service: <span className="font-medium">Window Washing</span>
            </span>
            <span className="mt-2 inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold w-max">
              Cancelled
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
