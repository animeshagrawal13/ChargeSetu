'use client';

import {
  AlertTriangle,
  BadgeCheck,
  Check,
  KeyRound,
  PhoneCall,
  ShieldCheck,
  Star,
  Timer,
  UserRoundCheck,
} from 'lucide-react';
import { useState } from 'react';

import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/Button';

const PILLARS = [
  {
    icon: <UserRoundCheck />,
    t: 'Verified identities',
    d: 'Hosts complete identity verification before a listing can go live. Riders verify a phone number before booking.',
  },
  {
    icon: <KeyRound />,
    t: 'OTP session handshake',
    d: 'A charging session cannot start without the 6-digit code the host issues on arrival, so neither side can proceed alone.',
  },
  {
    icon: <Timer />,
    t: 'Time-capped sessions',
    d: 'Every booking has a defined slot with an end time. Sessions do not run open-ended.',
  },
  {
    icon: <Star />,
    t: 'Two-way ratings',
    d: 'Riders rate hosts and hosts rate riders. Repeated problems remove a listing from the network.',
  },
];

const CHECKLIST = [
  'Use an earthed three-pin socket in sound condition',
  'Use the charger supplied with your vehicle',
  'Never run a session through an extension cord or multi-plug',
  'Keep the cable clear of walkways, water and direct sun',
  'Stop immediately if the plug, cable or socket feels hot',
  'Have unfamiliar or older wiring checked by a qualified electrician',
];

const REPORT_CATEGORIES = [
  'Unsafe socket',
  'Damaged cable',
  'Incorrect listing',
  'Unauthorized access',
  'Host issue',
  'Payment issue',
  'Other',
];

export default function SafetyPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Safety" back="/" showHelp={false} />

      <main className="shell max-w-3xl space-y-6 py-6 pb-20">
        {/* the disclaimer goes first, not buried */}
        <div className="flex items-start gap-3 rounded-card border border-warn/30 bg-warn/10 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <p className="text-sm leading-relaxed text-navy/85">
            <strong className="font-semibold">
              ChargeSetu does not certify electrical safety automatically.
            </strong>{' '}
            Hosts must ensure their charging setup meets applicable electrical and safety
            requirements. We verify listing information; verification does not replace professional
            electrical inspection.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight text-navy">
            Designed around two strangers meeting at a wall socket
          </h2>
          <p className="mt-2 text-muted">
            Trust is the product. These four controls apply to every booking on the network.
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <li key={p.t} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-light text-emerald [&>svg]:h-5 [&>svg]:w-5">
                  {p.icon}
                </span>
                <h3 className="mt-3.5 font-semibold text-navy">{p.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald" />
            <h2 className="text-lg font-semibold text-navy">Before every charge</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {CHECKLIST.map((c) => (
              <li key={c} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                <span className="text-sm leading-relaxed text-navy/80">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Household sockets in India supply 230 V. What differs is the current rating — 5A or 15A
            — and a socket should never be asked to carry more than it is rated for. Listings on
            ChargeSetu are capped at 3 kW.
          </p>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold text-navy">Report a safety issue</h2>
          <p className="mt-1 text-sm text-muted">
            Anything unsafe, inaccurate or suspicious. Reports are reviewed before the listing takes
            another booking.
          </p>

          {sent ? (
            <div
              role="status"
              className="mt-5 flex items-start gap-3 rounded-card bg-green-light p-5"
            >
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
              <div>
                <p className="font-semibold text-navy">Report received</p>
                <p className="mt-1 text-sm text-navy/75">
                  Our team will review this listing. The report has been securely saved to the database.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setSent(false);
                    setCategory(null);
                    setDetails('');
                  }}
                >
                  Report something else
                </Button>
              </div>
            </div>
          ) : (
            <>
              <fieldset className="mt-5">
                <legend className="mb-2.5 text-sm font-semibold text-navy">
                  What is wrong? <span className="text-danger">*</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {REPORT_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      aria-pressed={category === c}
                      className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                        category === c
                          ? 'border-danger bg-danger/10 text-danger'
                          : 'border-line bg-white text-navy hover:border-danger/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <label htmlFor="details" className="mb-2 block text-sm font-semibold text-navy">
                  What happened?
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Where, when, and what you saw. Do not include anyone's personal details."
                  className="w-full resize-none rounded-lg border border-line bg-surface px-4 py-3 text-base text-navy outline-none placeholder:text-muted focus:border-emerald"
                />
              </div>

              <Button
                variant="danger"
                size="lg"
                className="mt-5 w-full"
                disabled={!category || isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  const { submitSafetyReportAction } = await import('@/lib/host/actions');
                  const res = await submitSafetyReportAction(category as string, details);
                  if (res.ok) {
                    setSent(true);
                  } else {
                    alert('Failed to submit report');
                  }
                  setIsSubmitting(false);
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit report'}
              </Button>
            </>
          )}
        </section>

        <section className="rounded-card bg-navy p-6">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="h-5 w-5 text-green" />
            <h2 className="text-lg font-semibold text-white">In an emergency</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            If there is fire, electric shock or immediate danger, call{' '}
            <strong className="text-white">112</strong> first. Report it here afterwards so we can
            take the listing down.
          </p>
        </section>
      </main>
    </div>
  );
}
