'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Globe,
  Key,
  Shield,
  Network,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/logo';

const navigation = [
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Providers', href: '/providers', icon: Key },
  { name: 'Certificates', href: '/certificates', icon: Shield },
  { name: 'Proxy Hosts', href: '/proxy', icon: Network },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface NavContentProps {
  pathname: string;
  onNavigate?: () => void;
}

function NavContent({ pathname, onNavigate }: NavContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800/50">
        <Logo size="md" showText />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/domains' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-400 hover:bg-gray-800/70 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800/50 p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800/70 hover:text-white transition-all duration-150"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <Logo size="sm" showText />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside 
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-950 transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-gray-950 lg:flex lg:flex-col">
        <NavContent pathname={pathname} />
      </aside>

      {/* Mobile header spacer */}
      <div className="h-14 lg:hidden" />
    </>
  );
}
