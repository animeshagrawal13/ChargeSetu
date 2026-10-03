'use client';

import { useEffect, useState, useMemo } from 'react';
import { AppHeader } from '@/components/app/AppHeader';
import { useAuth } from '@/lib/auth-context';
import { getHostEarningsAction } from '@/lib/host/actions';
import { summariseEarnings } from '@/lib/pricing';
import { Wallet, Info, Zap, Calendar, IndianRupee } from 'lucide-react';

export default function EarningsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getHostEarningsAction().then((res) => {
        if (res.ok) setSessions(res.data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  // Transform database bookings into the shape summariseEarnings expects
  const mappedSessions = useMemo(() => {
    return sessions.map(s => ({
      id: s.id,
      units: s.actualKwh || 0,
      pricePerKwh: 10, // Defaulting for visual if price not stored directly in booking, though total amount is. 
      // We will estimate it from amount / kwh for the UI
      amount: s.amount || 0,
      date: new Date(s.slotEnd).toISOString()
    }));
  }, [sessions]);

  const summary = useMemo(() => {
    // If they have amount and units, we can rebuild the summary manually 
    // since the original pricing engine relied on exact pricePerKwh input
    let totalGross = 0;
    let totalUnits = 0;
    
    mappedSessions.forEach(s => {
      totalGross += s.amount;
      totalUnits += s.units;
    });

    const domesticTariff = 7; // ₹7/kWh
    const totalElectricity = totalUnits * domesticTariff;
    // Reverse calculating platform fee from the final amount would be tricky without knowing exact fee %.
    // Let's assume net is simply what they earned minus electricity for display.
    // In a fully real app, platform fee is taken BEFORE amount is saved, so amount IS the host gross.
    const net = totalGross - totalElectricity;

    return { totalGross, totalUnits, totalElectricity, net: Math.max(0, net) };
  }, [mappedSessions]);

  if (loading) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Earnings" back="/host" />
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-emerald" />
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface pb-12">
      <AppHeader title="Earnings" back="/host" />

      <main className="shell max-w-md py-6">
        {/* Wallet Balance Card */}
        <div className="card overflow-hidden bg-navy text-white shadow-lift">
          <div className="p-6">
            <div className="flex items-center gap-2 text-white/80">
              <Wallet className="h-5 w-5" />
              <h2 className="font-medium">Total Net Earnings</h2>
            </div>
            <p className="mt-3 text-4xl font-bold tracking-tight">₹{summary.net.toFixed(2)}</p>
            <p className="mt-2 text-sm text-white/70">From {mappedSessions.length} completed sessions</p>
          </div>
          <div className="bg-white/10 px-6 py-4 flex justify-between text-sm">
            <span className="text-white/80">Total Power Delivered</span>
            <span className="font-semibold">{summary.totalUnits.toFixed(2)} kWh</span>
          </div>
        </div>

        {/* Breakdown */}
        <h3 className="mt-8 text-lg font-bold text-navy">Earnings Breakdown</h3>
        <div className="mt-4 card p-0 divide-y divide-line">
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-medium text-navy">Gross Revenue from Riders</span>
            <span className="font-semibold text-navy">₹{summary.totalGross.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-navy">Est. Electricity Cost</span>
              <Info className="h-4 w-4 text-muted" />
            </div>
            <span className="font-semibold text-danger">- ₹{summary.totalElectricity.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between bg-green-light p-4">
            <span className="font-bold text-emerald">Net Profit</span>
            <span className="text-lg font-bold text-emerald">₹{summary.net.toFixed(2)}</span>
          </div>
        </div>

        {/* Recent Sessions */}
        <h3 className="mt-8 text-lg font-bold text-navy">Recent Sessions</h3>
        {mappedSessions.length === 0 ? (
          <div className="mt-4 card p-8 text-center text-muted">
            <Calendar className="mx-auto h-10 w-10 opacity-20 mb-3" />
            <p>No completed sessions yet.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {mappedSessions.slice(0).reverse().map((s, i) => (
              <div key={i} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                    <Zap className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{new Date(s.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted">{s.units.toFixed(2)} kWh delivered</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald">+₹{s.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-muted">Gross</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
