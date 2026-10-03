'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(email, password);
    if (res.ok) {
      router.push('/');
    } else {
      setError(res.error || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Log in" />
      
      <main className="shell max-w-md py-10">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to your ChargeSetu account</p>
          
          {error && (
            <div className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald"
                placeholder="••••••••"
              />
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-emerald hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
