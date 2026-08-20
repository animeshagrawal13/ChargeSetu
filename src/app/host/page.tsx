import { BadgeCheck, ChevronRight, Plug, ShieldAlert, Wallet } from 'lucide-react';
import Link from 'next/link';

import { AppHeader } from '@/components/app/AppHeader';

const ROWS = [
  {
    href: '/host/kyc',
    icon: <BadgeCheck />,
    t: 'Become a verified host',
    d: 'Identity and property verification. Required before a listing goes live.',
  },
  {
    href: '/host/earnings',
    icon: <Wallet />,
    t: 'Earnings & payouts',
    d: 'Duty status, weekly earnings and where every rupee goes.',
  },
  {
    href: '/safety',
    icon: <ShieldAlert />,
    t: 'Safety centre',
    d: 'Pre-charge checklist, the controls on every booking, and reporting.',
  },
];

export default function HostHubPage() {
  return (
    <div className="min-h-dvh bg-surface">
      <AppHeader title="Host" back="/" />

      <main className="shell max-w-2xl py-6 pb-20">
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-light">
            <Plug className="h-6 w-6 text-emerald" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-navy">
              Turn your unused socket into a useful local service
            </h2>
            <p className="mt-1 text-sm text-muted">
              List it, choose when you&apos;re available, earn from completed sessions.
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {ROWS.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-lift"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-green-light text-emerald [&>svg]:h-5 [&>svg]:w-5">
                  {r.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-navy">{r.t}</span>
                  <span className="mt-0.5 block text-sm text-muted">{r.d}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-muted">
          Demonstration build. Listings, sessions and earnings shown are seeded demo data — not a
          live marketplace, and not a projection of what any host would earn.
        </p>
      </main>
    </div>
  );
}
