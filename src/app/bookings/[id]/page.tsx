'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import { getBookingByIdAction, updateBookingStatusAction, completeBookingAction } from '@/lib/bookings/actions';
import { useAuth } from '@/lib/auth-context';
import { Clock, KeyRound, Zap, ShieldCheck } from 'lucide-react';
import { calculatePrice } from '@/lib/pricing';
import { getChargerByIdAction } from '@/lib/chargers/actions';

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const { id } = use(params);
  
  const [booking, setBooking] = useState<any>(null);
  const [charger, setCharger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const res = await getBookingByIdAction(id);
      if (res.ok && res.data) {
        setBooking(res.data);
        const cRes = await getChargerByIdAction(res.data.chargerId);
        setCharger(cRes);
      }
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setLoading(true);
    const res = await updateBookingStatusAction(id, status);
    if (res.ok) setBooking(res.data);
    setLoading(false);
  };

  const handleStartSession = async () => {
    if (otpInput !== booking.otp) {
      alert('Invalid OTP');
      return;
    }
    handleUpdateStatus('active');
  };

  const handleCompleteSession = async () => {
    setLoading(true);
    const kwh = booking.estimatedKwh; // Use estimated for now, later ask host
    const pricing = calculatePrice(kwh, charger.pricePerKwh);
    const res = await completeBookingAction(id, kwh, pricing.total);
    if (res.ok) setBooking(res.data);
    setLoading(false);
  };

  if (loading && !booking) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader back="/bookings" />
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-emerald" />
      </div>
    </div>
  );

  if (!booking) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader back="/bookings" />
      <div className="py-20 text-center text-muted">Booking not found</div>
    </div>
  );

  const isHost = user?.id === booking.hostId;
  const isRider = user?.id === booking.riderId;

  return (
    <div className="min-h-dvh bg-surface pb-24">
      <AppHeader title={`Booking #${booking.seq}`} back="/bookings" />

      <main className="shell max-w-xl py-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">Status</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider
              ${booking.status === 'completed' ? 'bg-green-light text-emerald' : 
                booking.status === 'requested' ? 'bg-warn/10 text-warn' : 
                booking.status === 'cancelled' ? 'bg-danger/10 text-danger' : 
                'bg-emerald text-white'}`}
            >
              {booking.status}
            </span>
          </div>
          
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Start</span>
              <span className="font-medium text-navy">{new Date(booking.slotStart).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">End</span>
              <span className="font-medium text-navy">{new Date(booking.slotEnd).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Est. Charge</span>
              <span className="font-medium text-navy">{booking.estimatedKwh} kWh</span>
            </div>
            {charger && (
              <div className="flex justify-between">
                <span className="text-muted">Location</span>
                <span className="font-medium text-navy">{charger.addressLine}</span>
              </div>
            )}
          </div>
        </div>

        {/* -------------------- Lifecycle Actions -------------------- */}

        {/* REQUESTED */}
        {booking.status === 'requested' && isHost && (
          <div className="mt-6 card p-6">
            <h3 className="font-semibold text-navy">Action Required</h3>
            <p className="mt-1 text-sm text-muted">A rider has requested this slot.</p>
            <div className="mt-4 flex gap-3">
              <Button onClick={() => handleUpdateStatus('accepted')} className="flex-1">Accept</Button>
              <Button variant="danger" onClick={() => handleUpdateStatus('rejected')} className="flex-1">Reject</Button>
            </div>
          </div>
        )}
        
        {booking.status === 'requested' && isRider && (
          <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#FDF0E2] p-4">
            <Clock className="mt-0.5 h-5 w-5 text-warn" />
            <p className="text-sm text-navy">Waiting for the host to accept your request.</p>
          </div>
        )}

        {/* ACCEPTED / OTP */}
        {booking.status === 'accepted' && (
          <div className="mt-6 card p-6">
            <h3 className="font-semibold text-navy">Session Handshake</h3>
            
            {isRider && (
              <div className="mt-3">
                <p className="text-sm text-muted">Show this OTP to the host when you arrive to start charging.</p>
                <div className="mt-4 text-center">
                  <span className="inline-block rounded-lg bg-surface px-6 py-3 text-4xl font-bold tracking-[0.25em] text-navy">
                    {booking.otp}
                  </span>
                </div>
              </div>
            )}
            
            {isHost && (
              <div className="mt-3">
                <p className="text-sm text-muted">Enter the 4-digit OTP from the rider to start the session.</p>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000"
                    className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-center text-2xl font-bold tracking-[0.25em] outline-none focus:border-emerald"
                  />
                  <Button onClick={handleStartSession} disabled={otpInput.length !== 4}>Start</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIVE */}
        {booking.status === 'active' && (
          <div className="mt-6 card p-6 border-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald text-white animate-pulse">
                <Zap className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy">Charging in progress</h3>
                <p className="text-sm text-muted">Session started safely.</p>
              </div>
            </div>
            
            {isHost && (
              <Button onClick={handleCompleteSession} className="mt-6 w-full">
                End Session
              </Button>
            )}
            {isRider && (
              <p className="mt-6 text-sm text-center text-muted">The host will end the session and bill you.</p>
            )}
          </div>
        )}

        {/* COMPLETED */}
        {booking.status === 'completed' && charger && (
          <div className="mt-6 card p-6">
            <h3 className="font-semibold text-navy">Receipt</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Energy Delivered</span>
                <span className="font-medium text-navy">{booking.actualKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Rate</span>
                <span className="font-medium text-navy">₹{charger.pricePerKwh}/kWh</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-lg font-bold">
                <span className="text-navy">Total</span>
                <span className="text-emerald">₹{booking.amount}</span>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-green-light p-3.5">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald" />
              <p className="text-xs leading-relaxed text-navy/80">
                Payment settled securely. Don't forget to rate your experience!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
