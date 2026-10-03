'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, MapPin, Search, Zap } from 'lucide-react';
import { AppHeader } from '@/components/app/AppHeader';
import { getChargersAction } from '@/lib/chargers/actions';
import { formatKm } from '@/domain/lib/format';
import { INDORE_CENTRE } from '@/lib/config';
import { haversineKm } from '@/domain/lib/geo';

export default function ExplorePage() {
  const [chargers, setChargers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getChargersAction().then((data) => {
      // Sort by distance to centre
      const sorted = data.sort((a, b) => {
        const distA = haversineKm(INDORE_CENTRE, { lat: a.lat, lng: a.lng });
        const distB = haversineKm(INDORE_CENTRE, { lat: b.lat, lng: b.lng });
        return distA - distB;
      });
      setChargers(sorted);
      setLoading(false);
    });
  }, []);

  const filtered = chargers.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.addressLine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Find a charger" />

      <div className="sticky top-14 z-20 border-b border-line bg-white shadow-sm">
        <div className="shell py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by area or host..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald"
            />
          </div>
        </div>
      </div>

      <main className="shell max-w-3xl py-6 pb-20">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-emerald" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((c) => {
              const distance = haversineKm(INDORE_CENTRE, { lat: c.lat, lng: c.lng });
              return (
                <Link
                  key={c.id}
                  href={`/charger/${c.id}`}
                  className="card group flex items-start gap-4 p-5 transition-shadow hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-light text-emerald transition-colors group-hover:bg-emerald group-hover:text-white">
                    <Zap className="h-6 w-6" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h2 className="truncate text-base font-semibold text-navy">{c.title}</h2>
                      {c.hostBadge !== 'Newbie' && (
                        <BadgeCheck className="h-4 w-4 shrink-0 text-emerald" />
                      )}
                    </div>
                    
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{c.addressLine}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-surface px-2 py-1 text-[11px] font-medium text-navy">
                        {c.powerKw} kW • {c.socketType.replace('SOCKET_', '').replace('_', ' ')}
                      </span>
                      <span className="rounded bg-surface px-2 py-1 text-[11px] font-medium text-navy">
                        {formatKm(distance)} away
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-navy">₹{c.pricePerKwh}</p>
                    <p className="text-[10px] text-muted">per kWh</p>
                  </div>
                </Link>
              );
            })}
            
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <Zap className="mx-auto h-12 w-12 text-line" />
                <h3 className="mt-4 text-lg font-medium text-navy">No chargers found</h3>
                <p className="mt-1 text-sm text-muted">Try a different search area</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
