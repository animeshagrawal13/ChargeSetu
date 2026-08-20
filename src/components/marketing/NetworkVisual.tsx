import { BatteryCharging, Bike, Home, MapPin, Plug } from 'lucide-react';

/**
 * The hero visual: an EV rider connected through ChargeSetu to household sockets.
 * Built as inline SVG plus positioned cards rather than an image, so it stays crisp,
 * weighs nothing, and reflows on mobile.
 */
export function NetworkVisual() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* connective tissue */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="link" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {[
          'M200,200 L92,96',
          'M200,200 L318,120',
          'M200,200 L96,296',
          'M200,200 L312,300',
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            stroke="url(#link)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="5 7"
            className="animate-[dash_2.4s_linear_infinite]"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

        <circle cx="200" cy="200" r="74" fill="#10B981" fillOpacity="0.07" />
        <circle cx="200" cy="200" r="108" fill="#10B981" fillOpacity="0.04" />
      </svg>

      {/* rider at the centre */}
      <div className="absolute left-1/2 top-1/2 flex h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-navy text-white shadow-lift">
        <Bike className="h-7 w-7 text-green" />
        <span className="mt-1 text-[11px] font-semibold tracking-wide">EV RIDER</span>
      </div>

      {/* surrounding host sockets */}
      <SocketNode className="left-[6%] top-[12%]" label="15A · Vijay Nagar" icon={<Home />} live />
      <SocketNode className="right-[2%] top-[20%]" label="5A · Palasia" icon={<Plug />} />
      <SocketNode className="bottom-[18%] left-[4%]" label="15A · Rau" icon={<Plug />} live />
      <SocketNode
        className="bottom-[14%] right-[4%]"
        label="OEM · Bhawarkuan"
        icon={<BatteryCharging />}
      />

      <div className="absolute left-1/2 top-[8%] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-card">
        <MapPin className="h-3.5 w-3.5 text-emerald" />
        <span className="text-xs font-semibold text-navy">Indore</span>
      </div>

      <style>{`@keyframes dash { to { stroke-dashoffset: -24; } }`}</style>
    </div>
  );
}

function SocketNode({
  className,
  label,
  icon,
  live,
}: {
  className: string;
  label: string;
  icon: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className={`absolute ${className} flex items-center gap-2 rounded-xl bg-white px-2.5 py-2 shadow-card`}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-green-light text-emerald [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-navy">{label}</p>
        <p className="flex items-center gap-1 text-[10px] text-muted">
          {live && <span className="h-1.5 w-1.5 rounded-full bg-green" />}
          {live ? 'Available' : 'Verified'}
        </p>
      </div>
    </div>
  );
}
