import { SocketType } from '@/domain/types';

/**
 * Household AC at 230 V. What differs between these is the current rating of the
 * socket (amperes), which caps how much power the rider's charger can actually draw.
 */
export const SOCKETS: Record<
  SocketType,
  { id: SocketType; label: string; realWorld: string; usableKw: number; powerLabel: string }
> = {
  SOCKET_5A: {
    id: 'SOCKET_5A',
    label: '5A household 3-pin',
    realWorld: 'Ordinary wall socket — the kind a lamp or phone charger plugs into.',
    usableKw: 0.7,
    powerLabel: '~0.7 kW',
  },
  SOCKET_15A: {
    id: 'SOCKET_15A',
    label: '15A household 3-pin',
    realWorld: 'Heavy-duty socket — the kind an AC or geyser uses.',
    usableKw: 3.0,
    powerLabel: '~1.5–3.0 kW',
  },
  OEM_FAST: {
    id: 'OEM_FAST',
    label: 'OEM fast charger',
    realWorld: "Brand-specific charger installed at the host's home.",
    usableKw: 3.3,
    powerLabel: '~1.5–3.3 kW',
  },
};

export const SOCKET_ORDER: SocketType[] = ['SOCKET_5A', 'SOCKET_15A', 'OEM_FAST'];

/** A 5A socket cannot deliver more than this, whatever the vehicle asks for. */
export const SOCKET_5A_KW = SOCKETS.SOCKET_5A.usableKw;

/**
 * Power filter buckets, scaled for two-wheelers. Car buckets (3/7.2/11/22 kW) are wrong
 * for this app — a household socket cannot reach them.
 */
export const POWER_BUCKETS = [0.75, 1.2, 2.0, 3.3] as const;
