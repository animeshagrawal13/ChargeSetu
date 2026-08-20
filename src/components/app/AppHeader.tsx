import { ArrowLeft, Headset, Zap } from 'lucide-react';
import Link from 'next/link';

/** Compact header used across the signed-in app surfaces. */
export function AppHeader({
  title,
  back = '/',
  showHelp = true,
}: {
  title?: string;
  back?: string;
  showHelp?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
      <div className="shell flex h-14 items-center gap-3">
        <Link
          href={back}
          aria-label="Go back"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-navy hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {title ? (
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-navy">{title}</h1>
        ) : (
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald">
              <Zap className="h-4 w-4 text-white" fill="currentColor" />
            </span>
            <span className="font-bold text-navy">ChargeSetu</span>
          </Link>
        )}

        {showHelp && (
          <Link
            href="/safety"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-emerald hover:text-emerald"
          >
            <Headset className="h-4 w-4" />
            Help
          </Link>
        )}
      </div>
    </header>
  );
}
