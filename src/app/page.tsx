import {
  AlertTriangle,
  BadgeCheck,
  Bike,
  CalendarClock,
  CircleDollarSign,
  KeyRound,
  MapPin,
  Plug,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  Zap,
} from 'lucide-react';

import { NetworkVisual } from '@/components/marketing/NetworkVisual';
import { SiteNav } from '@/components/marketing/SiteNav';
import { ButtonLink } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <>
      <SiteNav />

      <main id="main">
        {/* ---------------------------------------------------------- hero */}
        <section className="relative overflow-hidden bg-navy">
          <div className="grid-bg absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-emerald/12 blur-3xl"
            aria-hidden="true"
          />

          <div className="shell relative grid gap-14 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs font-semibold text-green">
                <MapPin className="h-3.5 w-3.5" />
                Piloting in Indore
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                Turning every household socket into a charging point.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                Find verified hyperlocal charging points, book a slot, charge your EV and pay
                digitally — without waiting for someone to build a new charging station on your
                street.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/explore" size="lg">
                  <Search className="h-4.5 w-4.5" />
                  Find a charging point
                </ButtonLink>
                <ButtonLink href="/host/onboarding" variant="secondary" size="lg">
                  Become a host
                </ButtonLink>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-7">
                {[
                  { v: '₹0', l: 'hardware cost per new point' },
                  { v: '4–5 h', l: 'typical two-wheeler charge' },
                  { v: '230 V', l: 'sockets already in every home' },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="text-2xl font-bold text-green">{s.v}</dt>
                    <dd className="mt-1 text-xs leading-snug text-white/55">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex justify-center lg:justify-end">
              <NetworkVisual />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- how it works */}
        <Section
          id="how"
          eyebrow="How ChargeSetu works"
          title="Four steps, no new infrastructure"
          lead="The supply already exists in crores of homes. It is simply invisible, unverified and unbookable — that is the part we built."
        >
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Bike />,
                t: 'Tell us your EV',
                d: 'Pick your brand and model. We work out the battery, charge time and which sockets will actually work for you.',
              },
              {
                icon: <Search />,
                t: 'Find a nearby socket',
                d: 'See verified household charging points on a map, ranked by how well they fit your stop — not just distance.',
              },
              {
                icon: <KeyRound />,
                t: 'Book and start with an OTP',
                d: 'Reserve a slot. The host issues a 6-digit code, so neither side can start a session without the other present.',
              },
              {
                icon: <Wallet />,
                t: 'Pay and rate',
                d: 'Pay by UPI when the session ends, get an itemised receipt, and rate each other.',
              },
            ].map((s, i) => (
              <li key={s.t} className="card p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-light text-emerald [&>svg]:h-5 [&>svg]:w-5">
                    {s.icon}
                  </span>
                  <span className="text-3xl font-bold text-line">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold text-navy">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ------------------------------------------------------- riders */}
        <Section
          id="riders"
          tone="surface"
          eyebrow="For riders"
          title="Your next charging point could be closer than you think"
          lead="Built for the people locked out of home charging — renters, PG and hostel residents, students and gig riders who own an EV but not a parking spot with a socket."
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: <Plug />, t: 'Compatibility, worked out for you', d: 'No amperes or connector jargon. Pick your model and we derive what fits.' },
                { icon: <CalendarClock />, t: 'Matched to your actual stop', d: 'A slow socket over a four-hour class beats a fast one during a ten-minute errand.' },
                { icon: <CircleDollarSign />, t: 'Price locked at booking', d: 'You see the rate per unit and the full fee breakdown before you confirm.' },
                { icon: <ShieldCheck />, t: 'Verified hosts', d: 'Identity-checked hosts, OTP sessions and two-way ratings on every booking.' },
              ].map((f) => (
                <li key={f.t} className="card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-green-light text-emerald [&>svg]:h-4.5 [&>svg]:w-4.5">
                    {f.icon}
                  </span>
                  <h3 className="mt-3.5 font-semibold text-navy">{f.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.d}</p>
                </li>
              ))}
            </ul>

            <ChargingPointPreview />
          </div>
        </Section>

        {/* -------------------------------------------------------- hosts */}
        <Section
          id="hosts"
          eyebrow="For hosts"
          title="Turn your unused socket into a useful local service"
          lead="List your compatible charging setup, choose when you're available, and earn from completed charging sessions."
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <EarningsPreview />

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { t: 'Nothing to buy', d: 'No charger to install, no capital cost. Listing takes about ten minutes.' },
                { t: 'You set the terms', d: 'Your price, your slots, your days. Pause the listing whenever you want.' },
                { t: 'Transparent cut', d: 'One configurable platform fee. No listing charge, no monthly fee.' },
                { t: 'You stay in control', d: 'Accept or reject each request. The OTP means nobody charges without you.' },
              ].map((f) => (
                <li key={f.t} className="card p-5">
                  <h3 className="font-semibold text-navy">{f.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.d}</p>
                </li>
              ))}
              <li className="sm:col-span-2 rounded-card border border-warn/25 bg-warn/5 p-4">
                <p className="text-xs leading-relaxed text-navy/75">
                  <strong className="font-semibold">Earnings vary.</strong> What you make depends on
                  usage, your pricing, local electricity cost and how often you are available.
                  ChargeSetu does not guarantee income.
                </p>
              </li>
            </ul>
          </div>
        </Section>

        {/* ------------------------------------------------------- safety */}
        <Section
          id="safety"
          tone="navy"
          eyebrow="Safety"
          title="Designed around two strangers meeting at a wall socket"
          lead="Trust is the product, not a feature bolted on afterwards."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: <BadgeCheck />, t: 'Verified identities', d: 'Hosts complete identity verification before a listing can go live. Riders verify a phone number.' },
              { icon: <KeyRound />, t: 'OTP session handshake', d: 'A session cannot start without the code the host issues on arrival.' },
              { icon: <Star />, t: 'Two-way ratings', d: 'Riders rate hosts and hosts rate riders. Repeated problems remove a listing.' },
            ].map((f) => (
              <div key={f.t} className="rounded-card border border-white/10 bg-white/5 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald/15 text-green [&>svg]:h-5 [&>svg]:w-5">
                  {f.icon}
                </span>
                <h3 className="mt-4 font-semibold text-white">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-card border border-warn/30 bg-warn/10 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
            <p className="text-sm leading-relaxed text-white/80">
              <strong className="font-semibold text-white">
                ChargeSetu does not certify electrical safety automatically.
              </strong>{' '}
              Hosts must ensure their charging setup meets applicable electrical and safety
              requirements. Verification of listing information does not replace professional
              electrical inspection.
            </p>
          </div>
        </Section>

        {/* ---------------------------------------------------------- faq */}
        <Section id="faq" tone="surface" eyebrow="FAQ" title="Questions people actually ask">
          <div className="mx-auto grid max-w-3xl gap-3">
            {[
              {
                q: 'Do I need to carry my own charger?',
                a: 'Usually yes. Most Indian electric two-wheelers ship with a portable charger, which is why an ordinary 5A or 15A household socket works with almost any brand. Only OEM fast chargers are brand-specific.',
              },
              {
                q: 'Why do you talk about amperes instead of volts?',
                a: 'Indian household supply is 230 V everywhere. What differs between sockets is the current rating — 5A or 15A — and that is what caps how fast you can charge.',
              },
              {
                q: 'How is the cost calculated?',
                a: 'Units delivered multiplied by the host’s price per unit, plus a platform fee shown separately before you confirm. Nothing is hidden at checkout.',
              },
              {
                q: 'Is the host’s electricity bill covered?',
                a: 'The host sets a price above their own domestic tariff, so the margin is theirs after electricity. Our host earnings view subtracts electricity cost explicitly rather than quoting gross revenue.',
              },
              {
                q: 'What stops someone using a socket without paying?',
                a: 'Sessions start only with a 6-digit OTP the host issues on arrival, and payment is settled against the recorded session.',
              },
            ].map((item) => (
              <details key={item.q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-navy">
                  {item.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------- cta */}
        <section className="bg-navy">
          <div className="shell py-16 text-center lg:py-20">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Every socket in India is already a charging point
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/65">
              We only had to make them findable, bookable and safe to share.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/explore" size="lg">
                Find a charging point
              </ButtonLink>
              <ButtonLink href="/demo" variant="secondary" size="lg">
                Try the demo
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-white">
        <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </span>
            <div>
              <p className="font-bold text-navy">ChargeSetu</p>
              <p className="text-xs text-muted">Hyperlocal P2P charging · Indore pilot</p>
            </div>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-muted">
            Demonstration build for Smart India Hackathon 2026. Listings, hosts and transactions
            shown are demo data. Not a live marketplace.
          </p>
        </div>
      </footer>
    </>
  );
}

/* ------------------------------------------------------------------ bits */

function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = 'white',
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: 'white' | 'surface' | 'navy';
}) {
  const bg = tone === 'navy' ? 'bg-navy' : tone === 'surface' ? 'bg-surface' : 'bg-white';
  const heading = tone === 'navy' ? 'text-white' : 'text-navy';
  const body = tone === 'navy' ? 'text-white/65' : 'text-muted';

  return (
    <section id={id} className={`${bg} scroll-mt-16`}>
      <div className="shell py-16 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald">{eyebrow}</p>
        <h2 className={`mt-3 max-w-2xl text-3xl font-bold tracking-tight ${heading} sm:text-[2.4rem] sm:leading-[1.15]`}>
          {title}
        </h2>
        {lead && <p className={`mt-4 max-w-2xl leading-relaxed ${body}`}>{lead}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function ChargingPointPreview() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="text-sm font-semibold text-navy">Charging points near you</p>
        <span className="text-xs text-muted">3 of 10</span>
      </div>

      <ul className="divide-y divide-line">
        {[
          { n: "Sneha's Charger", a: 'Sudama Nagar', km: '1.34', kw: '0.7 kW', p: '7.00', m: 96, s: 'Available now' },
          { n: "Pooja's Charger", a: 'Palasia', km: '2.10', kw: '2.0 kW', p: '10.00', m: 88, s: 'Available now' },
          { n: "Aditya's Charger", a: 'Rajwada', km: '3.42', kw: '3.3 kW', p: '14.00', m: 71, s: 'Busy until 6 PM' },
        ].map((c) => (
          <li key={c.n} className="flex items-start gap-3 px-5 py-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-green-light text-emerald">
              <Zap className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-navy">{c.n}</p>
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald" />
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">
                {c.a} · {c.km} km · {c.kw}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald">{c.s}</p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-navy">₹{c.p}</p>
              <p className="text-[10px] text-muted">per kWh</p>
              <span className="mt-1 inline-block rounded-full bg-green-light px-1.5 py-0.5 text-[10px] font-bold text-emerald">
                {c.m}%
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-surface px-5 py-3">
        <p className="text-[11px] leading-relaxed text-muted">
          Match score weighs compatibility, availability, distance, price and rating. Demo data.
        </p>
      </div>
    </div>
  );
}

function EarningsPreview() {
  const bars = [40, 62, 28, 78, 55, 90, 71];
  return (
    <div className="card p-6">
      <p className="text-sm font-semibold text-navy">A host&apos;s month</p>
      <p className="mt-1 text-xs text-muted">Illustrative example — not a projection</p>

      <p className="mt-5 text-4xl font-bold tracking-tight text-navy">₹1,240</p>
      <p className="text-xs text-muted">across 18 sessions</p>

      <div className="mt-6 flex h-24 items-end gap-1.5" aria-hidden="true">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-emerald/85" style={{ height: `${h}%` }} />
        ))}
      </div>

      <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
        {[
          ['Riders paid', '₹1,410'],
          ['Platform fee (12%)', '− ₹169'],
          ['Your electricity', '− ₹380'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-muted">{k}</dt>
            <dd className="font-medium text-navy">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-line pt-2">
          <dt className="font-semibold text-navy">You keep</dt>
          <dd className="text-lg font-bold text-emerald">₹861</dd>
        </div>
      </dl>
    </div>
  );
}

export const dynamic = 'force-static';

