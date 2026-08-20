'use client';

import { Menu, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';

const LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#riders', label: 'For riders' },
  { href: '#hosts', label: 'For hosts' },
  { href: '#safety', label: 'Safety' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald">
            <Zap className="h-4.5 w-4.5 text-white" fill="currentColor" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">ChargeSetu</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/demo" variant="ghost" size="sm" className="text-white hover:bg-white/10">
            Try demo
          </ButtonLink>
          <ButtonLink href="/explore" size="sm">
            Find a charging point
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-10 w-10 place-items-center rounded-lg text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy lg:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <ButtonLink href="/explore" size="md">
                Find a charging point
              </ButtonLink>
              <ButtonLink href="/host/onboarding" variant="secondary" size="md">
                Become a host
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
