'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import { createChargerAction } from '@/lib/chargers/actions';
import { useAuth } from '@/lib/auth-context';
import { SOCKETS } from '@/domain/data/sockets';
import { INDORE_CENTRE } from '@/lib/config'; // Mocking lat/long for now

export default function HostOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [socketType, setSocketType] = useState('SOCKET_15A');
  const [pricePerKwh, setPricePerKwh] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push('/auth/login');
    
    setLoading(true);
    const res = await createChargerAction({
      hostName: user.name,
      title,
      addressLine,
      city: 'Indore',
      lat: INDORE_CENTRE.lat + (Math.random() - 0.5) * 0.1, // Random near indore centre
      lng: INDORE_CENTRE.lng + (Math.random() - 0.5) * 0.1,
      socketType,
      powerKw: (SOCKETS as any)[socketType].usableKw,
      pricePerKwh,
      isActive: true,
    });
    
    if (res.ok) {
      router.push('/host');
    } else {
      alert(res.error || 'Failed to list charger');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="List your socket" back="/host" />
      
      <main className="shell max-w-md py-10">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-navy">List your charging point</h1>
          <p className="mt-2 text-sm text-muted">Earn money by sharing your wall socket.</p>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Listing Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald"
                placeholder="e.g. My Secure 15A Socket"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Full Address</label>
              <textarea
                required
                rows={3}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full resize-none rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald"
                placeholder="Complete address (hidden until booked)"
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Socket Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 ${socketType === 'SOCKET_5A' ? 'border-emerald bg-green-light' : 'border-line'}`}>
                  <input type="radio" className="sr-only" checked={socketType === 'SOCKET_5A'} onChange={() => setSocketType('SOCKET_5A')} />
                  <span className="font-semibold text-navy">5A Socket</span>
                  <span className="text-xs text-muted">~0.7 kW</span>
                </label>
                <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 ${socketType === 'SOCKET_15A' ? 'border-emerald bg-green-light' : 'border-line'}`}>
                  <input type="radio" className="sr-only" checked={socketType === 'SOCKET_15A'} onChange={() => setSocketType('SOCKET_15A')} />
                  <span className="font-semibold text-navy">15A Socket</span>
                  <span className="text-xs text-muted">~3.0 kW</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-navy">Price per kWh (₹)</label>
              <input
                type="number"
                required
                min={5}
                max={25}
                step={0.5}
                value={pricePerKwh}
                onChange={(e) => setPricePerKwh(Number(e.target.value))}
                className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-emerald"
              />
              <p className="mt-1 text-xs text-muted">Recommended: ₹7-11 depending on socket type.</p>
            </div>
            
            <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
