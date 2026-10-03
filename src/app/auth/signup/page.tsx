'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'rider' | 'host'>('rider');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await signup({ name, email, phone, password, role });
    if (res.ok) {
      if (role === 'host') {
        router.push('/host/kyc');
      } else {
        router.push('/explore');
      }
    } else {
      setError(res.error || 'Failed to sign up');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Sign up" />
      
      <main className="shell max-w-md py-10">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-navy">Create an account</h1>
          <p className="mt-2 text-sm text-muted">Join the ChargeSetu network</p>
          
          {error && (
            <div className="mt-4 rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex cursor-pointer items-center justify-center rounded-lg border-2 py-3 font-semibold ${role === 'rider' ? 'border-emerald bg-green-light text-emerald' : 'border-line text-muted'}`}>
                <input type="radio" className="sr-only" checked={role === 'rider'} onChange={() => setRole('rider')} />
                Rider
              </label>
              <label className={`flex cursor-pointer items-center justify-center rounded-lg border-2 py-3 font-semibold ${role === 'host' ? 'border-emerald bg-green-light text-emerald' : 'border-line text-muted'}`}>
                <input type="radio" className="sr-only" checked={role === 'host'} onChange={() => setRole('host')} />
                Host
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald" placeholder="Animesh Agrawal" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald" placeholder="you@example.com" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Phone Number</label>
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald" placeholder="+91 98765 43210" />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald" placeholder="••••••••" />
            </div>
            
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-emerald hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
