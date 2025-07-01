import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    return(
        <header className="w-full flex items-center justify-between row-start-1 mb-4">
            <div className="flex items-center w-full justify-between">
                {/* Logo */}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/ziply.svg" alt="ZIPLY" width={140} height={60}/>
                  </Link>
                </div>
                {/* Buttons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Notifications"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Profile"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}