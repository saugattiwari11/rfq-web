'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStage('otp');
  }

  async function verifyOtp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = '/dashboard';
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-display font-700 mb-6">Log in</h1>

      {stage === 'phone' && (
        <div className="slip p-5">
          <label className="field-label" htmlFor="phone">Phone number</label>
          <input
            id="phone"
            className="field-input mb-4"
            placeholder="+977 98XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="btn-primary w-full" onClick={sendOtp} disabled={loading || !phone}>
            {loading ? 'Sending code…' : 'Send code'}
          </button>
        </div>
      )}

      {stage === 'otp' && (
        <div className="slip p-5">
          <label className="field-label" htmlFor="otp">Enter the code sent to {phone}</label>
          <input
            id="otp"
            className="field-input mb-4"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="btn-primary w-full" onClick={verifyOtp} disabled={loading || !otp}>
            {loading ? 'Verifying…' : 'Verify & continue'}
          </button>
        </div>
      )}

      {error && <p className="text-copper text-sm mt-3">{error}</p>}
    </div>
  );
}
