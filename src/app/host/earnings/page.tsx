'use client';

import {
  ChevronDown,
  ChevronUp,
  History,
  Info,
  Lightbulb,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';
import { SOCKETS } from '@/domain/data/sockets';
import { formatKwh, formatMoney } from '@/domain/lib/format';
import { DOMESTIC_TARIFF, PLATFORM_FEE_PCT } from '@/lib/config';
import { calculatePrice, summariseEarnings } from '@/lib/pricing';

/** Seeded sessions. Everything on this page is derived from these — no loose numbers. */
const SESSIONS = [
  { id: 's1', at: '2026-08-20T18:20:00', units: 2.84, pricePerKwh: 9.5 },
  { id: 's2', at: '2026-08-19T09:05:00', units: 3.1, pricePerKwh: 9.5 },
  { id: 's3', at: '2026-08-18T20:40:00', units: 2.4, pricePerKwh: 9.0 },
  { id: 's4', at: '2026-08-17T07:55:00', units: 3.6, pricePerKwh: 9.5 },
  { id: 's5', at: '2026-08-16T19:10:00', units: 1.9, pricePerKwh: 9.0 },
  { id: 's6', at: '2026-08-15T17:30:00', units: 3.2, pricePerKwh: 9.5 },
  { id: 's7', at: '2026-08-14T08:15:00', units: 2.7, pricePerKwh: 9.0 },
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HostEarningsPage() {
  const [onDuty, setOnDuty] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [rateCard, setRateCard] = useState(false);

  const totals = useMemo(() => summariseEarnings(SESSIONS), []);

  const today = useMemo(() => {
    const t = new Date().toDateString();
    return summariseEarnings(SESSIONS.filter((s) => new Date(s.at).toDateString() === t));
  }, []);

  const week = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const net = summariseEarnings(
        SESSIONS.filter((s) => new Date(s.at).toDateString() === day.toDateString())
      ).net;
      return { day, net };
    });
  }, []);

  const peak = Math.max(...week.map((w) => w.net), 1);
  const lastSession = SESSIONS[0] ? calculatePrice(SESSIONS[0].units, SESSIONS[0].pricePerKwh) : null;

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Earnings & payouts" back="/host" />

      {/* duty toggle */}
      <div className="border-b border-line bg-white">
        <div className="shell flex items-center justify-center py-3">
          <button
            type="button"
            onClick={() => setOnDuty((d) => !d)}
            aria-pressed={onDuty}
            className={`inline-flex items-center gap-3 rounded-full border-2 px-5 py-2 transition-colors ${
              onDuty ? 'border-emerald bg-green-light' : 'border-line bg-white'
            }`}
          >
            <span
              className={`text-sm font-bold tracking-wide ${onDuty ? 'text-emerald' : 'text-muted'}`}
            >
              {onDuty ? 'ON DUTY' : 'OFF DUTY'}
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${
                onDuty ? 'bg-emerald' : 'bg-line'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  onDuty ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <main className="shell max-w-3xl space-y-5 py-5 pb-20">
        {/* today's band */}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex w-full items-center gap-3 rounded-card bg-[#E8EEFB] px-5 py-3.5 text-left"
        >
          <span className="flex-1 font-medium text-navy">Today&apos;s Earnings</span>
          <span className="text-lg font-bold text-navy">{formatMoney(today.net)}</span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-navy/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-navy/60" />
          )}
        </button>

        {expanded && (
          <>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              <StatCard icon={<Wallet />} label="Wallet balance" value={formatMoney(totals.gross - totals.platformFee)} />
              <StatCard icon={<Zap />} label="Today's earnings" value={formatMoney(today.net)} />
              <StatCard
                icon={<History />}
                label="Last session"
                value={formatMoney(lastSession?.hostNet ?? 0)}
              />
            </div>

            <button
              type="button"
              onClick={() => setRateCard(true)}
              className="mx-auto flex items-center gap-1.5 text-[15px] font-semibold text-[#1A73E8] hover:underline"
            >
              <Info className="h-4 w-4" />
              View Rate Card
            </button>
          </>
        )}

        {/* progress */}
        <div className="card flex items-center gap-4 p-5">
          <div className="flex-1">
            <span className="inline-block rounded bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
              Your Progress
            </span>
            <p className="mt-2 text-2xl font-bold text-navy">
              {totals.sessions} Completed Sessions
            </p>
            <p className="text-sm text-muted">{formatKwh(totals.units)} delivered</p>
          </div>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-green-light">
            <Zap className="h-7 w-7 text-emerald" />
          </span>
        </div>

        {/* where the money goes */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Where your money goes</h2>
          <p className="mt-1 text-sm text-muted">
            Across all {totals.sessions} completed sessions · illustrative example
          </p>

          <dl className="mt-5 space-y-2.5">
            <Line label="Riders paid you" value={formatMoney(totals.gross)} />
            <Line
              label={`Platform fee (${Math.round(PLATFORM_FEE_PCT * 100)}%)`}
              value={`− ${formatMoney(totals.platformFee)}`}
              muted
            />
            <Line
              label={`Your electricity (₹${DOMESTIC_TARIFF}/kWh)`}
              value={`− ${formatMoney(totals.electricity)}`}
              muted
            />
            <div className="flex items-center justify-between border-t border-line pt-3">
              <dt className="font-semibold text-navy">You keep</dt>
              <dd className="text-2xl font-bold text-emerald">{formatMoney(totals.net)}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-green-light p-3.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            <p className="text-xs leading-relaxed text-navy/80">
              Payouts settle to your UPI every Monday. The platform fee is the only cut we take —
              no listing charge, no monthly fee. Actual earnings depend on usage, your pricing,
              electricity cost and availability.
            </p>
          </div>
        </section>

        {/* weekly chart */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Last 7 days</h2>
          <div className="mt-5 flex h-32 items-end gap-2" aria-hidden="true">
            {week.map(({ day, net }) => (
              <div key={day.toISOString()} className="flex h-full flex-1 flex-col items-center">
                <span className="h-4 text-[10px] font-medium text-muted">
                  {net > 0 ? `₹${net.toFixed(0)}` : ''}
                </span>
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={`w-3/5 rounded-t ${net > 0 ? 'bg-emerald' : 'bg-line'}`}
                    style={{ height: `${Math.max((net / peak) * 100, net > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className="mt-1.5 text-[11px] font-medium text-muted">
                  {DAY_LETTERS[day.getDay()]}
                </span>
              </div>
            ))}
          </div>
          <p className="sr-only">
            Daily net earnings for the last seven days, totalling {formatMoney(totals.net)}.
          </p>
        </section>

        {/* recent sessions */}
        <section className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Recent sessions</h2>
          <ul className="mt-2 divide-y divide-line">
            {SESSIONS.map((s) => {
              const p = calculatePrice(s.units, s.pricePerKwh);
              return (
                <li key={s.id} className="flex items-center gap-3.5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-green-light">
                    <Zap className="h-4 w-4 text-emerald" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">
                      {new Date(s.at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-muted">{formatKwh(s.units)} delivered</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-emerald">{formatMoney(p.hostNet)}</p>
                    <p className="text-[11px] text-muted">of {formatMoney(p.energyCost)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* rate card */}
      {rateCard && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 sm:items-center"
          onClick={() => setRateCard(false)}
        >
          <div
            role="dialog"
            aria-label="Rate card"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 sm:rounded-2xl"
          >
            <div className="flex items-center pb-2">
              <h2 className="flex-1 text-lg font-semibold text-navy">Rate card</h2>
              <button type="button" onClick={() => setRateCard(false)} aria-label="Close">
                <X className="h-6 w-6 text-navy" />
              </button>
            </div>
            <p className="mb-3 text-sm text-muted">
              You set your own price per unit. These are the bands hosts typically use.
            </p>

            {(['SOCKET_5A', 'SOCKET_15A', 'OEM_FAST'] as const).map((id) => (
              <div key={id} className="flex items-center border-t border-line py-3">
                <div className="flex-1">
                  <p className="font-semibold text-navy">{SOCKETS[id].label}</p>
                  <p className="text-sm text-muted">{SOCKETS[id].powerLabel}</p>
                </div>
                <p className="font-bold text-emerald">
                  {id === 'SOCKET_5A' ? '₹7–9' : id === 'SOCKET_15A' ? '₹8–11' : '₹11–15'}
                </p>
              </div>
            ))}

            <dl className="mt-5 space-y-2 rounded-lg bg-surface p-4 text-sm">
              <Line label="Platform fee" value={`${Math.round(PLATFORM_FEE_PCT * 100)}%`} />
              <Line label="Listing charge" value="₹0" />
              <Line label="Monthly fee" value="₹0" />
              <Line label="Payout cycle" value="Weekly, to UPI" />
            </dl>

            <Button className="mt-5 w-full" onClick={() => setRateCard(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card w-40 shrink-0 p-4">
      <span className="text-muted [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p className="mt-1.5 text-xs text-muted">{label}</p>
      <p className="text-xl font-bold text-navy">{value}</p>
    </div>
  );
}

function Line({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? 'text-muted' : 'text-navy'}>{label}</dt>
      <dd className={`font-semibold ${muted ? 'text-muted' : 'text-navy'}`}>{value}</dd>
    </div>
  );
}
