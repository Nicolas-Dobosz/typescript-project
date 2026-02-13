'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ArrowRightFromLine, Home, User} from 'lucide-react';

export default function SidebarNotch() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: <Home size={24} />, active: pathname === '/' },
    { href: '/profile/me', icon: <User size={24} />, active: pathname === '/profile/me' },
    { href: '/logout', icon: <ArrowRightFromLine size={24} />, active: pathname === '/logout' },
  ];

  return (
    <nav className="fixed left-2 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-2 bg-gray-900/90 backdrop-blur-md border-y border-r border-white/10 p-2 rounded-2xl shadow-xl">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <button
              className={`
                w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200
                ${link.active 
                  ? 'bg-white text-black scale-105 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {link.icon}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}