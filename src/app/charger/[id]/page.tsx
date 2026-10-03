'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Zap, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import { getChargerByIdAction } from '@/lib/chargers/actions';
import { useAuth } from '@/lib/auth-context';
import { AMENITY_BY_ID } from '@/domain/data/amenities';
import { TIME_SLOTS } from '@/domain/data/timeSlots';
import { createBookingAction } from '@/lib/bookings/actions'; // We will create this next

export default function ChargerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  
  const [charger, setCharger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    getChargerByIdAction(id).then((data) => {
      setCharger(data);
      setLoading(false);
    });
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!selectedSlot) return;

    setBookingLoading(true);
    // Determine timestamps for today
    const slotDef = TIME_SLOTS.find(s => s.id === selectedSlot);
    if (!slotDef) return;
    
    const now = new Date();
    const start = new Date(now.setHours(slotDef.startHour, 0, 0, 0));
    let end = new Date(now.setHours(slotDef.endHour, 0, 0, 0));
    if (slotDef.endHour < slotDef.startHour) {
      end.setDate(end.getDate() + 1); // Wraps midnight
    }

    const res = await createBookingAction({
      chargerId: charger.id,
      hostId: charger.hostId,
      riderId: user.id,
      slotStart: start.getTime(),
      slotEnd: end.getTime(),
      estimatedKwh: 2.5, // Mock estimate
    });

    if (res.ok) {
      router.push(`/bookings/${res.booking?.id}`);
    } else {
      alert(res.error || 'Booking failed');
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader back="/explore" />
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-emerald" />
      </div>
    </div>
  );

  if (!charger) return (
    <div className="min-h-dvh bg-surface">
      <AppHeader back="/explore" />
      <div className="py-20 text-center text-muted">Charger not found</div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface pb-24">
      <AppHeader title={charger.title} back="/explore" />

      <main className="shell max-w-2xl py-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">{charger.title}</h1>
              <p className="mt-1 text-sm text-muted">Hosted by {charger.hostName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-navy">₹{charger.pricePerKwh}</p>
              <p className="text-xs text-muted">per kWh</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-light px-3 py-1 text-xs font-semibold text-emerald">
              <Zap className="h-3.5 w-3.5" /> {charger.powerKw} kW
            </span>
            {charger.hostBadge !== 'Newbie' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF1FE] px-3 py-1 text-xs font-semibold text-[#1A73E8]">
                <BadgeCheck className="h-3.5 w-3.5" /> {charger.hostBadge}
              </span>
            )}
          </div>
        </div>

        {/* Location (Masked for prototype) */}
        <div className="mt-4 card p-6">
          <h2 className="font-semibold text-navy">Location</h2>
          <div className="mt-3 flex items-start gap-3 rounded-lg bg-surface p-4">
            <MapPin className="h-5 w-5 text-muted shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-navy">{charger.addressLine}</p>
              <p className="text-xs text-muted mt-1">Full address revealed after booking is accepted</p>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="mt-4 card p-6">
          <h2 className="font-semibold text-navy">Select a slot for today</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {TIME_SLOTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSlot(s.id)}
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-colors ${
                  selectedSlot === s.id
                    ? 'border-emerald bg-green-light text-emerald'
                    : 'border-line bg-white text-navy hover:border-emerald/40'
                }`}
              >
                <Clock className="mb-2 h-5 w-5" />
                <span className="text-sm font-semibold">{s.label}</span>
                <span className="text-xs opacity-80">{s.range}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-white p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <div className="shell flex max-w-2xl items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">
              {selectedSlot ? TIME_SLOTS.find(s => s.id === selectedSlot)?.label : 'Select a slot'}
            </p>
            <p className="text-xs text-muted">Est. top-up: ~2.5 kWh</p>
          </div>
          <Button 
            size="lg" 
            onClick={handleBook} 
            disabled={!selectedSlot || bookingLoading}
            className="w-40"
          >
            {bookingLoading ? 'Requesting...' : 'Request Slot'}
          </Button>
        </div>
      </div>
    </div>
  );
}
