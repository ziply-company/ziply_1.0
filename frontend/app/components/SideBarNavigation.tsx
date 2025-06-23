'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function SidebarNavigation() {
  const pathname = usePathname();
  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/bookings", label: "Bookings" },
    { href: "/clients", label: "Clients" },
    { href: "/marketing", label: "Marketing" },
    { href: "/calendar", label: "Calendar" },
    { href: "/inventory", label: "Inventory" },
    { href: "/staff", label: "Staff" },
    { href: "/settings", label: "Settings" },
  ];
  return (
    <aside className="flex sm:flex-col bg-white rounded shadow p-2 sm:p-6 mb-4 sm:mb-0 min-w-0 sm:min-w-[180px] max-w-full sm:max-w-[220px] w-full sm:w-auto h-auto sm:h-full gap-1 sm:gap-4 overflow-x-auto">
      <nav className="flex flex-row sm:flex-col gap-1 sm:gap-2 w-full">
        {navLinks.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className={`flex-1 text-gray-700 py-2 px-2 sm:px-3 rounded hover:bg-blue-50 transition text-xs sm:text-base text-center sm:text-left
              ${pathname === href ? "bg-blue-100 font-semibold text-blue-700" : ""}
            `}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}