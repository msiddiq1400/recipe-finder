'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name }, // saved to raw_user_meta_data → picked up by our trigger
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Check your email</h1>
        <p className="text-stone-500 text-sm">
          We sent a magic link to <strong>{email}</strong>. 
          Click it to sign in — no password needed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🍳</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome to Recipe Finder</h1>
        <p className="text-stone-500 text-sm">Sign in to save your favourite recipes</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Smith"
            required
            className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
            className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-orange-400"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>
    </div>
  );
}