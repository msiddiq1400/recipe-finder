'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/recipes', label: 'Browse' },
  { href: '/cuisines', label: 'Cuisines' },
  { href: '/favorites', label: 'Favorites' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-stone-900">
          🍳 Recipe Finder
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-stone-500 hidden sm:block">
                👋 {user.user_metadata?.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

      </nav>
    </header>
  );
}