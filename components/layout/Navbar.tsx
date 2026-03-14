'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

const ALL_LINKS = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/recipes', label: 'Browse', emoji: '🔍' },
  { href: '/cuisines', label: 'Cuisines', emoji: '🌍' },
  { href: '/topics', label: 'Topics', emoji: '🏷' },
  { href: '/popular', label: 'Popular', emoji: '🔥' },
  { href: '/recipe-of-the-day', label: 'Today', emoji: '⭐' },
  { href: '/favorites', label: 'Favorites', emoji: '🤍' },
];

// Always visible on desktop
const DESKTOP_LINKS = ALL_LINKS;

// Always visible on mobile (pinned)
const MOBILE_PINNED = ['/', '/recipes', '/recipe-of-the-day', '/favorites'];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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

  const pinnedLinks = ALL_LINKS.filter(l => MOBILE_PINNED.includes(l.href));
  const menuLinks = ALL_LINKS.filter(l => !MOBILE_PINNED.includes(l.href));

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
        <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="font-bold text-lg text-stone-900 shrink-0">
            🍳 Recipe Finder
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-1">
            {DESKTOP_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-stone-500">
                  👋 {user.user_metadata?.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
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

          {/* Mobile Right Side — Login + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

        </nav>

        {/* Mobile Pinned Links — always visible below header */}
        <div className="md:hidden flex border-t border-stone-100 bg-white">
          {pinnedLinks.map(({ href, label, emoji }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-orange-500'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="text-base">{emoji}</span>
                {label}
              </Link>
            );
          })}

          {/* More button opens hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
              menuOpen ? 'text-orange-500' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="text-base">☰</span>
            More
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white shadow-lg">
            {menuLinks.map(({ href, label, emoji }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium border-b border-stone-50 transition-colors ${
                    isActive
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </Link>
              );
            })}

            {/* Auth in menu */}
            {user && (
              <div className="px-6 py-3 bg-stone-50 text-xs text-stone-400">
                Signed in as {user.user_metadata?.name || user.email}
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}