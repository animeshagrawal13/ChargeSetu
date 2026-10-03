'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Clock, Calendar } from 'lucide-react';
import { AppHeader } from '@/components/app/AppHeader';
import { getBookingsAction } from '@/lib/bookings/actions';
import { useAuth } from '@/lib/auth-context';

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getBookingsAction().then((res) => {
        if (res.ok) {
          // Sort newest first
          setBookings(res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="My Bookings" />
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-emerald" />
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="My Bookings" />
      
      <main className="shell max-w-3xl py-6">
        {bookings.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="mx-auto h-12 w-12 text-line" />
            <h3 className="mt-4 text-lg font-medium text-navy">No bookings yet</h3>
            <p className="mt-1 text-sm text-muted">When you book a charger, it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="card p-5 transition-shadow hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-green-light text-emerald">
                      <Zap className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-navy">Booking #{b.seq}</p>
                      <p className="text-xs text-muted">
                        {new Date(b.slotStart).toLocaleDateString()} • {new Date(b.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider
                    ${b.status === 'completed' ? 'bg-green-light text-emerald' : 
                      b.status === 'requested' ? 'bg-warn/10 text-warn' : 
                      b.status === 'cancelled' ? 'bg-danger/10 text-danger' : 
                      'bg-emerald text-white'}`}
                  >
                    {b.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
