'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMessage('Account created. Check your email to confirm, then log in.');
      setMode('login');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-display font-700 mb-6">
        {mode === 'login' ? 'Log in' : 'Create an account'}
      </h1>

      <div className="slip p-5">
        <label className="field-label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="field-input mb-4"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="field-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="field-input mb-4"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn-primary w-full"
          onClick={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading
            ? mode === 'login' ? 'Logging in…' : 'Creating account…'
            : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </div>

      {error && <p className="text-copper text-sm mt-3">{error}</p>}
      {message && <p className="text-teal text-sm mt-3">{message}</p>}

      <p className="text-sm text-muted mt-4">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <button className="text-copper hover:underline" onClick={() => setMode('signup')}>
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="text-copper hover:underline" onClick={() => setMode('login')}>
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
